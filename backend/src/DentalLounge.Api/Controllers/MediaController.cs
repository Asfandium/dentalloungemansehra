using DentalLounge.Application.Common.Interfaces;
using DentalLounge.Application.Common.Models;
using DentalLounge.Application.DTOs.Media;
using DentalLounge.Domain.Common;
using DentalLounge.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DentalLounge.Api.Controllers;

[ApiController]
[Route("api/admin/media")]
[Authorize(Roles = $"{RoleNames.SuperAdmin},{RoleNames.Admin}")]
public class MediaController : ControllerBase
{
    private readonly IAppDbContext _context;
    private readonly IFileStorageService _storageService;
    private readonly ICurrentUserService _currentUser;
    private readonly IAuditService _auditService;
    private readonly ILogger<MediaController> _logger;

    public MediaController(
        IAppDbContext context,
        IFileStorageService storageService,
        ICurrentUserService currentUser,
        IAuditService auditService,
        ILogger<MediaController> logger)
    {
        _context = context;
        _storageService = storageService;
        _currentUser = currentUser;
        _auditService = auditService;
        _logger = logger;
    }

    [HttpPost("upload")]
    [RequestSizeLimit(10 * 1024 * 1024)] // 10MB limit
    public async Task<IActionResult> UploadMedia([FromForm] IFormFile? file, [FromForm] string? altText, [FromForm] Guid? serviceId, CancellationToken ct)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(ApiResponse<object>.Fail("No file provided."));
        }

        try
        {
            await using var stream = file.OpenReadStream();
            var (safeKey, publicUrl, width, height) = await _storageService.SaveImageAsync(
                stream, file.FileName, file.ContentType, ct);

            var mediaAsset = new MediaAsset
            {
                Id = Guid.NewGuid(),
                OriginalFileName = file.FileName,
                SafeStorageKey = safeKey,
                ContentType = file.ContentType,
                FileSize = file.Length,
                Width = width,
                Height = height,
                AltText = altText ?? file.FileName,
                PublicUrl = publicUrl,
                CreatedByUserId = _currentUser.UserId,
                ServiceId = serviceId,
                CreatedAtUtc = DateTime.UtcNow
            };

            _context.MediaAssets.Add(mediaAsset);
            await _context.SaveChangesAsync(ct);

            await _auditService.LogActionAsync(
                action: "UploadMedia",
                entityName: nameof(MediaAsset),
                entityId: mediaAsset.Id.ToString(),
                details: $"Uploaded file {file.FileName} ({file.Length} bytes) as {safeKey}",
                ct: ct);

            var response = new UploadMediaResponse
            {
                Id = mediaAsset.Id,
                SafeStorageKey = mediaAsset.SafeStorageKey,
                PublicUrl = mediaAsset.PublicUrl,
                OriginalFileName = mediaAsset.OriginalFileName,
                FileSize = mediaAsset.FileSize,
                Width = mediaAsset.Width,
                Height = mediaAsset.Height
            };

            return Ok(ApiResponse<UploadMediaResponse>.Ok(response, "File uploaded successfully."));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upload media file.");
            return StatusCode(StatusCodes.Status500InternalServerError,
                ApiResponse<object>.Fail("File upload processing error."));
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetMediaList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        pageNumber = pageNumber > 0 ? pageNumber : 1;
        pageSize = pageSize > 0 && pageSize <= 50 ? pageSize : 20;

        var query = _context.MediaAssets
            .Include(m => m.Service)
            .OrderByDescending(m => m.CreatedAtUtc);

        var totalCount = await query.CountAsync(ct);
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(m => new MediaAssetDto
            {
                Id = m.Id,
                OriginalFileName = m.OriginalFileName,
                ContentType = m.ContentType,
                FileSize = m.FileSize,
                Width = m.Width,
                Height = m.Height,
                AltText = m.AltText,
                PublicUrl = m.PublicUrl,
                CreatedAtUtc = m.CreatedAtUtc,
                ServiceId = m.ServiceId,
                ServiceName = m.Service != null ? m.Service.Name : null
            })
            .ToListAsync(ct);

        return Ok(ApiResponse<PagedResult<MediaAssetDto>>.Ok(
            new PagedResult<MediaAssetDto>(items, totalCount, pageNumber, pageSize)));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteMedia(Guid id, CancellationToken ct)
    {
        var media = await _context.MediaAssets.FirstOrDefaultAsync(m => m.Id == id, ct);
        if (media == null)
        {
            return NotFound(ApiResponse<object>.Fail("Media asset not found."));
        }

        // Check if media is referenced by a published service
        var isReferenced = await _context.Services
            .AnyAsync(s => s.ImageUrl == media.PublicUrl, ct);

        if (isReferenced)
        {
            return BadRequest(ApiResponse<object>.Fail("Cannot delete an image that is currently referenced by an active service. Please replace or update the service image first."));
        }

        await _storageService.DeleteFileAsync(media.SafeStorageKey, ct);
        _context.MediaAssets.Remove(media);
        await _context.SaveChangesAsync(ct);

        await _auditService.LogActionAsync(
            action: "DeleteMedia",
            entityName: nameof(MediaAsset),
            entityId: id.ToString(),
            details: $"Deleted media asset {media.OriginalFileName} ({media.SafeStorageKey})",
            ct: ct);

        return Ok(ApiResponse<object>.Ok(null, "Media asset successfully removed."));
    }
}
