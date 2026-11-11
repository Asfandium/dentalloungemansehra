using DentalLounge.Application.Common.Interfaces;
using DentalLounge.Application.Common.Models;
using DentalLounge.Application.DTOs.Auth;
using DentalLounge.Application.Validation;
using DentalLounge.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace DentalLounge.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly IAuditService _auditService;
    private readonly ICurrentUserService _currentUser;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ITokenService tokenService,
        IAuditService auditService,
        ICurrentUserService currentUser,
        ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _auditService = auditService;
        _currentUser = currentUser;
        _logger = logger;
    }

    [HttpPost("login")]
    [EnableRateLimiting("AuthRateLimit")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var validator = new LoginRequestValidator();
        var validationResult = await validator.ValidateAsync(request, ct);

        if (!validationResult.IsValid)
        {
            return BadRequest(ApiResponse<object>.Fail("Invalid credentials provided."));
        }

        var user = await _userManager.FindByEmailAsync(request.Email.Trim());
        if (user == null || !user.IsActive)
        {
            _logger.LogWarning("Failed login attempt for {Email}: user not found or inactive.", request.Email);
            return Unauthorized(ApiResponse<object>.Fail("Invalid email or password."));
        }

        var checkPassword = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);
        if (!checkPassword.Succeeded)
        {
            _logger.LogWarning("Failed login attempt for {Email}: invalid password.", request.Email);
            return Unauthorized(ApiResponse<object>.Fail("Invalid email or password."));
        }

        // Update last login timestamp
        user.LastLoginAtUtc = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        var roles = await _userManager.GetRolesAsync(user);
        var primaryRole = roles.FirstOrDefault() ?? "Helper";
        var token = _tokenService.GenerateToken(user, roles);

        await _auditService.LogActionAsync(
            action: "AdminLogin",
            entityName: nameof(ApplicationUser),
            entityId: user.Id.ToString(),
            details: $"Successful login by {user.Email} ({primaryRole})",
            ct: ct);

        var userDto = new UserDto
        {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            FullName = user.FullName,
            Role = primaryRole,
            IsActive = user.IsActive,
            CreatedAtUtc = user.CreatedAtUtc,
            LastLoginAtUtc = user.LastLoginAtUtc
        };

        return Ok(ApiResponse<LoginResponse>.Ok(new LoginResponse
        {
            Token = token,
            ExpiresAtUtc = DateTime.UtcNow.AddHours(8),
            User = userDto
        }, "Authentication successful."));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        if (!_currentUser.UserId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.Fail("Unauthenticated."));
        }

        var user = await _userManager.FindByIdAsync(_currentUser.UserId.Value.ToString());
        if (user == null || !user.IsActive)
        {
            return Unauthorized(ApiResponse<object>.Fail("User account unavailable or deactivated."));
        }

        var roles = await _userManager.GetRolesAsync(user);
        var primaryRole = roles.FirstOrDefault() ?? "Helper";

        return Ok(ApiResponse<UserDto>.Ok(new UserDto
        {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            FullName = user.FullName,
            Role = primaryRole,
            IsActive = user.IsActive,
            CreatedAtUtc = user.CreatedAtUtc,
            LastLoginAtUtc = user.LastLoginAtUtc
        }));
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout(CancellationToken ct)
    {
        if (_currentUser.UserId.HasValue)
        {
            await _auditService.LogActionAsync(
                action: "AdminLogout",
                entityName: nameof(ApplicationUser),
                entityId: _currentUser.UserId.Value.ToString(),
                details: $"Logout by {_currentUser.UserEmail}",
                ct: ct);
        }

        return Ok(ApiResponse<object>.Ok(null, "Logged out successfully."));
    }
}
