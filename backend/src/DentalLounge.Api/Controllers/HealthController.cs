using Microsoft.AspNetCore.Mvc;

namespace DentalLounge.Api.Controllers;

[ApiController]
[Route("")]
public class HealthController : ControllerBase
{
    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new
        {
            status = "Healthy",
            service = "Mansehra Dental Lounge Web API",
            timestampUtc = DateTime.UtcNow
        });
    }
}
