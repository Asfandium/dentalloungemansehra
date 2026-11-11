using DentalLounge.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DentalLounge.Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<Appointment> Appointments { get; }
    DbSet<AppointmentService> AppointmentServices { get; }
    DbSet<Service> Services { get; }
    DbSet<MediaAsset> MediaAssets { get; }
    DbSet<AuditLog> AuditLogs { get; }
    DbSet<NotificationOutbox> NotificationOutboxes { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
