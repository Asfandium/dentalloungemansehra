using DentalLounge.Application.Common.Interfaces;
using DentalLounge.Application.Common.Models;
using DentalLounge.Application.DTOs.Audit;
using DentalLounge.Domain.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DentalLounge.Api.Controllers;

[ApiController]
[Route("api/admin/audit-logs")]
[Authorize(Roles = RoleNames.SuperAdmin)]
public class AuditLogsController : ControllerBase
{
    private readonly IAppDbContext _context;

    public AuditLogsController(IAppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAuditLogs([FromQuery] AuditLogFilterQuery query, CancellationToken ct)
    {
        var dbQuery = _context.AuditLogs.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(query.Action))
        {
            dbQuery = dbQuery.Where(a => a.Action == query.Action.Trim());
        }

        if (!string.IsNullOrWhiteSpace(query.EntityName))
        {
            dbQuery = dbQuery.Where(a => a.EntityName == query.EntityName.Trim());
        }

        var totalCount = await dbQuery.CountAsync(ct);
        var pageNumber = query.PageNumber > 0 ? query.PageNumber : 1;
        var pageSize = query.PageSize > 0 && query.PageSize <= 50 ? query.PageSize : 20;

        var items = await dbQuery
            .OrderByDescending(a => a.TimestampUtc)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new AuditLogDto
            {
                Id = a.Id,
                UserId = a.UserId,
                UserEmail = a.UserEmail,
                Action = a.Action,
                EntityName = a.EntityName,
                EntityId = a.EntityId,
                Details = a.Details,
                IpAddress = a.IpAddress,
                TimestampUtc = a.TimestampUtc
            })
            .ToListAsync(ct);

        return Ok(ApiResponse<PagedResult<AuditLogDto>>.Ok(
            new PagedResult<AuditLogDto>(items, totalCount, pageNumber, pageSize)));
    }
}
