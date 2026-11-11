using DentalLounge.Application.Common.Interfaces;
using DentalLounge.Application.Common.Models;
using DentalLounge.Application.DTOs.Auth;
using DentalLounge.Application.Validation;
using DentalLounge.Domain.Common;
using DentalLounge.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DentalLounge.Api.Controllers;

[ApiController]
[Route("api/admin/staff")]
[Authorize(Roles = RoleNames.SuperAdmin)]
public class StaffController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IAuditService _auditService;
    private readonly ICurrentUserService _currentUser;
    private readonly ILogger<StaffController> _logger;

    public StaffController(
        UserManager<ApplicationUser> userManager,
        IAuditService auditService,
        ICurrentUserService currentUser,
        ILogger<StaffController> logger)
    {
        _userManager = userManager;
        _auditService = auditService;
        _currentUser = currentUser;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetStaffList(CancellationToken ct)
    {
        var users = await _userManager.Users
            .OrderByDescending(u => u.CreatedAtUtc)
            .ToListAsync(ct);

        var staffList = new List<UserDto>();
        foreach (var u in users)
        {
            var roles = await _userManager.GetRolesAsync(u);
            staffList.Add(new UserDto
            {
                Id = u.Id,
                Email = u.Email ?? string.Empty,
                FullName = u.FullName,
                Role = roles.FirstOrDefault() ?? "Helper",
                IsActive = u.IsActive,
                CreatedAtUtc = u.CreatedAtUtc,
                LastLoginAtUtc = u.LastLoginAtUtc
            });
        }

        return Ok(ApiResponse<List<UserDto>>.Ok(staffList));
    }

    [HttpPost]
    public async Task<IActionResult> CreateStaff([FromBody] CreateStaffRequest request, CancellationToken ct)
    {
        var validator = new CreateStaffRequestValidator();
        var validationResult = await validator.ValidateAsync(request, ct);

        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            return BadRequest(ApiResponse<object>.Fail("Validation failed.", errors));
        }

        var existing = await _userManager.FindByEmailAsync(request.Email.Trim());
        if (existing != null)
        {
            return BadRequest(ApiResponse<object>.Fail("A staff account with this email address already exists."));
        }

        var newUser = new ApplicationUser
        {
            UserName = request.Email.Trim(),
            Email = request.Email.Trim(),
            FullName = request.FullName.Trim(),
            IsActive = true,
            EmailConfirmed = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        var createResult = await _userManager.CreateAsync(newUser, request.Password);
        if (!createResult.Succeeded)
        {
            var errorMsg = string.Join(", ", createResult.Errors.Select(e => e.Description));
            return BadRequest(ApiResponse<object>.Fail($"Failed to create staff member: {errorMsg}"));
        }

        // Assign permitted role (Admin or Helper)
        await _userManager.AddToRoleAsync(newUser, request.Role);

        await _auditService.LogActionAsync(
            action: "CreateStaff",
            entityName: nameof(ApplicationUser),
            entityId: newUser.Id.ToString(),
            details: $"Created staff account {newUser.Email} with role {request.Role}",
            ct: ct);

        return Ok(ApiResponse<object>.Ok(new { newUser.Id, newUser.Email, Role = request.Role }, "Staff account created successfully."));
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> ToggleStatus(Guid id, [FromBody] UpdateStaffRequest request, CancellationToken ct)
    {
        if (id == _currentUser.UserId)
        {
            return BadRequest(ApiResponse<object>.Fail("You cannot change the active status of your own account."));
        }

        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
        {
            return NotFound(ApiResponse<object>.Fail("Staff member not found."));
        }

        var roles = await _userManager.GetRolesAsync(user);
        if (roles.Contains(RoleNames.SuperAdmin))
        {
            return BadRequest(ApiResponse<object>.Fail("SuperAdmin accounts cannot be deactivated."));
        }

        user.IsActive = request.IsActive;
        if (!string.IsNullOrWhiteSpace(request.FullName))
        {
            user.FullName = request.FullName.Trim();
        }

        if (request.Role is RoleNames.Admin or RoleNames.Helper && !roles.Contains(request.Role))
        {
            await _userManager.RemoveFromRolesAsync(user, roles);
            await _userManager.AddToRoleAsync(user, request.Role);
        }

        await _userManager.UpdateAsync(user);

        await _auditService.LogActionAsync(
            action: "UpdateStaffStatus",
            entityName: nameof(ApplicationUser),
            entityId: id.ToString(),
            details: $"Updated staff {user.Email}: Active={user.IsActive}, Role={request.Role}",
            ct: ct);

        return Ok(ApiResponse<object>.Ok(null, "Staff status updated successfully."));
    }

    [HttpPost("{id:guid}/reset-password")]
    public async Task<IActionResult> ResetPassword(Guid id, [FromBody] ResetStaffPasswordRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 8)
        {
            return BadRequest(ApiResponse<object>.Fail("New password must be at least 8 characters."));
        }

        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
        {
            return NotFound(ApiResponse<object>.Fail("Staff member not found."));
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var result = await _userManager.ResetPasswordAsync(user, token, request.NewPassword);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return BadRequest(ApiResponse<object>.Fail($"Password reset failed: {errors}"));
        }

        await _auditService.LogActionAsync(
            action: "ResetStaffPassword",
            entityName: nameof(ApplicationUser),
            entityId: id.ToString(),
            details: $"Password reset for {user.Email}",
            ct: ct);

        return Ok(ApiResponse<object>.Ok(null, "Staff password has been reset successfully."));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteStaff(Guid id, CancellationToken ct)
    {
        if (id == _currentUser.UserId)
        {
            return BadRequest(ApiResponse<object>.Fail("You cannot delete your own account."));
        }

        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
        {
            return NotFound(ApiResponse<object>.Fail("Staff member not found."));
        }

        var roles = await _userManager.GetRolesAsync(user);
        if (roles.Contains(RoleNames.SuperAdmin))
        {
            return BadRequest(ApiResponse<object>.Fail("SuperAdmin accounts cannot be deleted."));
        }

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
        {
            return BadRequest(ApiResponse<object>.Fail("Failed to delete staff member."));
        }

        await _auditService.LogActionAsync(
            action: "DeleteStaff",
            entityName: nameof(ApplicationUser),
            entityId: id.ToString(),
            details: $"Deleted staff member {user.Email}",
            ct: ct);

        return Ok(ApiResponse<object>.Ok(null, "Staff member deleted successfully."));
    }
}
