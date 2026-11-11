namespace DentalLounge.Infrastructure.Auth;

public class JwtSettings
{
    public const string SectionName = "JwtSettings";

    public string SecretKey { get; set; } = "DentalLoungeSuperSecretKeyForDevelopmentMustBe32CharsLongAtLeast!";
    public string Issuer { get; set; } = "DentalLoungeApi";
    public string Audience { get; set; } = "DentalLoungeAdmin";
    public int ExpiryMinutes { get; set; } = 480; // 8 hours
}
