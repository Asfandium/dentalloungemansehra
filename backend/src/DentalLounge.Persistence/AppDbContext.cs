using DentalLounge.Application.Common.Interfaces;
using DentalLounge.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DentalLounge.Persistence;

public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<AppointmentService> AppointmentServices => Set<AppointmentService>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<NotificationOutbox> NotificationOutboxes => Set<NotificationOutbox>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Customize Identity table names for clarity
        builder.Entity<ApplicationUser>(b =>
        {
            b.ToTable("Users");
            b.Property(u => u.FullName).HasMaxLength(150);
        });
        builder.Entity<ApplicationRole>().ToTable("Roles");

        // Appointment
        builder.Entity<Appointment>(b =>
        {
            b.ToTable("Appointments");
            b.HasKey(a => a.Id);
            b.Property(a => a.Name).IsRequired().HasMaxLength(100);
            b.Property(a => a.Gender).IsRequired().HasMaxLength(30);
            b.Property(a => a.ContactNumber).IsRequired().HasMaxLength(30);
            b.Property(a => a.Email).HasMaxLength(150);
            b.Property(a => a.Message).HasMaxLength(1000);
            b.Property(a => a.Status).HasConversion<int>();
            b.HasIndex(a => a.Status);
            b.HasIndex(a => a.AppointmentDate);
            b.HasIndex(a => a.CreatedAtUtc);

            b.HasMany(a => a.Services)
             .WithOne(s => s.Appointment)
             .HasForeignKey(s => s.AppointmentId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasMany(a => a.Notifications)
             .WithOne(n => n.Appointment)
             .HasForeignKey(n => n.AppointmentId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // AppointmentService
        builder.Entity<AppointmentService>(b =>
        {
            b.ToTable("AppointmentServices");
            b.HasKey(s => s.Id);
            b.Property(s => s.ServiceName).IsRequired().HasMaxLength(100);

            b.HasOne(s => s.Service)
             .WithMany()
             .HasForeignKey(s => s.ServiceId)
             .OnDelete(DeleteBehavior.SetNull);
        });

        // Service
        builder.Entity<Service>(b =>
        {
            b.ToTable("Services");
            b.HasKey(s => s.Id);
            b.Property(s => s.StableKey).IsRequired().HasMaxLength(50);
            b.HasIndex(s => s.StableKey).IsUnique();

            b.Property(s => s.Name).IsRequired().HasMaxLength(100);
            b.Property(s => s.Category).IsRequired().HasMaxLength(50);
            b.Property(s => s.ShortDescription).HasMaxLength(300);
            b.Property(s => s.FullDescription).HasMaxLength(3000);
            b.Property(s => s.WhoItIsFor).HasMaxLength(500);
            b.Property(s => s.GeneralBenefits).HasMaxLength(2000);
            
            // Explicit decimal precision for currency (never float)
            b.Property(s => s.PriceAmount).HasPrecision(18, 2);
            b.Property(s => s.CurrencyCode).IsRequired().HasMaxLength(5).HasDefaultValue("PKR");
            b.Property(s => s.PriceDisplayMode).HasConversion<int>();
            b.Property(s => s.PriceNote).HasMaxLength(200);

            b.Property(s => s.ImageUrl).HasMaxLength(500);
            b.Property(s => s.ImageAltText).HasMaxLength(200);
            b.Property(s => s.DisplayOrder).IsRequired();
            b.HasIndex(s => s.DisplayOrder);
            b.HasIndex(s => s.IsPublished);
        });

        // MediaAsset
        builder.Entity<MediaAsset>(b =>
        {
            b.ToTable("MediaAssets");
            b.HasKey(m => m.Id);
            b.Property(m => m.SafeStorageKey).IsRequired().HasMaxLength(100);
            b.HasIndex(m => m.SafeStorageKey).IsUnique();
            b.Property(m => m.OriginalFileName).IsRequired().HasMaxLength(255);
            b.Property(m => m.ContentType).IsRequired().HasMaxLength(100);
            b.Property(m => m.PublicUrl).IsRequired().HasMaxLength(500);
            b.Property(m => m.AltText).HasMaxLength(200);

            b.HasOne(m => m.Service)
             .WithMany()
             .HasForeignKey(m => m.ServiceId)
             .OnDelete(DeleteBehavior.SetNull);
        });

        // AuditLog
        builder.Entity<AuditLog>(b =>
        {
            b.ToTable("AuditLogs");
            b.HasKey(a => a.Id);
            b.Property(a => a.Action).IsRequired().HasMaxLength(100);
            b.Property(a => a.EntityName).IsRequired().HasMaxLength(100);
            b.Property(a => a.EntityId).HasMaxLength(100);
            b.Property(a => a.UserEmail).HasMaxLength(150);
            b.Property(a => a.IpAddress).HasMaxLength(50);
            b.HasIndex(a => a.Action);
            b.HasIndex(a => a.EntityName);
            b.HasIndex(a => a.TimestampUtc);
        });

        // NotificationOutbox
        builder.Entity<NotificationOutbox>(b =>
        {
            b.ToTable("NotificationOutbox");
            b.HasKey(n => n.Id);
            b.Property(n => n.Channel).IsRequired().HasMaxLength(30);
            b.Property(n => n.Recipient).IsRequired().HasMaxLength(150);
            b.Property(n => n.Subject).IsRequired().HasMaxLength(255);
            b.Property(n => n.Status).HasConversion<int>();
            b.Property(n => n.ErrorMessage).HasMaxLength(500);
            b.HasIndex(n => n.Status);
            b.HasIndex(n => n.CreatedAtUtc);
        });
    }
}
