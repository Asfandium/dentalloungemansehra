using Microsoft.AspNetCore.Identity;

namespace DentalLounge.Domain.Entities;

public class ApplicationUser : IdentityUser<Guid>
{
    public string FullName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAtUtc { get; set; }
}

public class ApplicationRole : IdentityRole<Guid>
{
    public string Description { get; set; } = string.Empty;

    public ApplicationRole() : base() { }
    public ApplicationRole(string roleName, string description = "") : base(roleName)
    {
        Description = description;
    }
}
