using DentalLounge.Application.Common.Interfaces;
using DentalLounge.Api.Services;
using DentalLounge.Domain.Entities;
using DentalLounge.Infrastructure.Audit;
using DentalLounge.Infrastructure.Auth;
using DentalLounge.Infrastructure.BackgroundServices;
using DentalLounge.Infrastructure.Email;
using DentalLounge.Infrastructure.Storage;
using DentalLounge.Persistence;
using DentalLounge.Persistence.Seed;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Threading.RateLimiting;

// Load .env file if present
var envCandidates = new[]
{
    Path.Combine(Directory.GetCurrentDirectory(), ".env"),
    Path.Combine(Directory.GetCurrentDirectory(), "..", ".env"),
    Path.Combine(Directory.GetCurrentDirectory(), "..", "..", ".env"),
    Path.Combine(AppContext.BaseDirectory, ".env"),
    Path.Combine(AppContext.BaseDirectory, "..", "..", "..", ".env")
};

foreach (var envPath in envCandidates)
{
    if (File.Exists(envPath))
    {
        foreach (var line in File.ReadAllLines(envPath))
        {
            var trimmed = line.Trim();
            if (string.IsNullOrWhiteSpace(trimmed) || trimmed.StartsWith("#")) continue;
            var parts = trimmed.Split('=', 2);
            if (parts.Length == 2)
            {
                var key = parts[0].Trim();
                var val = parts[1].Trim().Trim('"', '\'');
                if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable(key)))
                {
                    Environment.SetEnvironmentVariable(key, val);
                }
            }
        }
        break;
    }
}

var builder = WebApplication.CreateBuilder(args);

// 1. Configuration & Strong-Typed Settings
var jwtSettings = builder.Configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>() ?? new JwtSettings();
var envJwtKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY");
if (!string.IsNullOrWhiteSpace(envJwtKey))
{
    jwtSettings.SecretKey = envJwtKey;
}
else if (string.IsNullOrWhiteSpace(jwtSettings.SecretKey))
{
    jwtSettings.SecretKey = "DentalLoungeSuperSecretKeyForDevelopmentMustBe32CharsLongAtLeast!";
}

builder.Services.Configure<JwtSettings>(options =>
{
    options.SecretKey = jwtSettings.SecretKey;
    options.Issuer = string.IsNullOrWhiteSpace(jwtSettings.Issuer) ? "DentalLoungeApi" : jwtSettings.Issuer;
    options.Audience = string.IsNullOrWhiteSpace(jwtSettings.Audience) ? "DentalLoungeAdmin" : jwtSettings.Audience;
    options.ExpiryMinutes = jwtSettings.ExpiryMinutes > 0 ? jwtSettings.ExpiryMinutes : 480;
});

// Support Environment Variables for SMTP overrides
var smtpSettings = builder.Configuration.GetSection(SmtpSettings.SectionName).Get<SmtpSettings>() ?? new SmtpSettings();
if (!string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("SMTP_HOST")))
    smtpSettings.Host = Environment.GetEnvironmentVariable("SMTP_HOST")!;
if (!string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("SMTP_PORT")) && int.TryParse(Environment.GetEnvironmentVariable("SMTP_PORT"), out var port))
    smtpSettings.Port = port;
if (!string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("SMTP_USERNAME")))
    smtpSettings.Username = Environment.GetEnvironmentVariable("SMTP_USERNAME")!;
if (!string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("SMTP_PASSWORD")))
    smtpSettings.Password = Environment.GetEnvironmentVariable("SMTP_PASSWORD")!;
if (!string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("SMTP_FROM")))
    smtpSettings.FromEmail = Environment.GetEnvironmentVariable("SMTP_FROM")!;
if (!string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("APPOINTMENT_NOTIFICATION_EMAIL")))
    smtpSettings.NotificationRecipientEmail = Environment.GetEnvironmentVariable("APPOINTMENT_NOTIFICATION_EMAIL")!;

builder.Services.Configure<SmtpSettings>(options =>
{
    options.Host = smtpSettings.Host;
    options.Port = smtpSettings.Port;
    options.Username = smtpSettings.Username;
    options.Password = smtpSettings.Password;
    options.FromEmail = smtpSettings.FromEmail;
    options.FromName = smtpSettings.FromName;
    options.NotificationRecipientEmail = smtpSettings.NotificationRecipientEmail;
    options.EnableSsl = smtpSettings.EnableSsl;
});

// 2. Database Connection (PostgreSQL default)
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? Environment.GetEnvironmentVariable("DB_CONNECTION_STRING")
    ?? builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=localhost;Port=5432;Database=dentallounge_db;Username=postgres;Password=postgres";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        npgsqlOptions.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName);
    });
});
builder.Services.AddScoped<IAppDbContext>(provider => provider.GetRequiredService<AppDbContext>());

// 3. ASP.NET Core Identity
builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// 4. JWT Authentication
var jwtKey = Encoding.UTF8.GetBytes(jwtSettings.SecretKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // set true in production TLS termination
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(jwtKey),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidateAudience = true,
        ValidAudience = jwtSettings.Audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(1)
    };
});

builder.Services.AddAuthorization();

// 5. Upload Directory & Application Services DI
var uploadsPath = Path.Combine(builder.Environment.ContentRootPath, "wwwroot", "uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IEmailService, MailKitEmailService>();
builder.Services.AddSingleton<IFileStorageService>(sp =>
    new LocalStorageService(
        sp.GetRequiredService<ILogger<LocalStorageService>>(),
        uploadsPath));
builder.Services.AddScoped<ITokenService, JwtTokenService>();
builder.Services.AddScoped<IAuditService, AuditService>();

// Hosted background worker for Outbox email delivery
builder.Services.AddHostedService<NotificationOutboxProcessor>();

// 6. Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // Public appointment booking: 10 requests / min per IP
    options.AddPolicy("PublicApi", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "anon",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));

    // Admin login rate limiting: 5 attempts / min per IP
    options.AddPolicy("AuthRateLimit", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "anon",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));
});

// 7. CORS
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultCorsPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();

// 8. Swagger / OpenAPI with Bearer Authorization
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Mansehra Dental Lounge API",
        Version = "v1",
        Description = "Production Web API and Administration endpoints for Mansehra Dental Lounge."
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// 9. Static Files (Uploads Directory)
app.UseStaticFiles(); // Default wwwroot
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

// 10. Swagger UI
if (app.Environment.IsDevelopment() || builder.Configuration.GetValue<bool>("EnableSwagger"))
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Mansehra Dental Lounge API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseRouting();
app.UseCors("DefaultCorsPolicy");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// 11. Database Migration & Seed on Startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        
        // Attempt migration if database is reachable
        if (context.Database.IsRelational())
        {
            logger.LogInformation("Applying pending database migrations...");
            await context.Database.MigrateAsync();
        }

        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = services.GetRequiredService<RoleManager<ApplicationRole>>();
        var config = services.GetRequiredService<IConfiguration>();

        await DbInitializer.SeedAsync(context, userManager, roleManager, config, logger);
    }
    catch (Exception ex)
    {
        logger.LogWarning("Database migration / seed skipped on startup: {Message}. (Ensure PostgreSQL is running).", ex.Message);
    }
}

app.Run();

// Required for WebApplicationFactory in integration tests
public partial class Program { }
