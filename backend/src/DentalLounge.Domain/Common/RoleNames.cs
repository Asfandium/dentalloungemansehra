namespace DentalLounge.Domain.Common;

public static class RoleNames
{
    public const string SuperAdmin = "SuperAdmin";
    public const string Admin = "Admin";
    public const string Helper = "Helper";

    public static readonly IReadOnlyList<string> All = new[] { SuperAdmin, Admin, Helper };
}
