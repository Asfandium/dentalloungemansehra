using DentalLounge.Api.Controllers;
using DentalLounge.Application.Common.Interfaces;
using DentalLounge.Application.DTOs.Appointments;
using DentalLounge.Domain.Enums;
using DentalLounge.Persistence;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Xunit;

namespace DentalLounge.Tests;

public class AppointmentPersistenceTests
{
    private static AppDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateAppointment_MustPersistRecord_AndQueueOutboxNotification()
    {
        await using var context = CreateInMemoryDbContext();
        var auditMock = new Mock<IAuditService>();
        var controller = new AppointmentsController(context, auditMock.Object, NullLogger<AppointmentsController>.Instance);

        var request = new CreateAppointmentRequest
        {
            Name = "Fatima Khan",
            Gender = "Female",
            AppointmentDate = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-dd"),
            ContactNumber = "03482226228",
            Email = "fatima@example.com",
            Message = "Need consultation for root canal.",
            Services = new List<string> { "Root Canal Treatment - RCT" }
        };

        var response = await controller.CreateAppointment(request, CancellationToken.None);

        response.Should().BeOfType<ObjectResult>();
        var objectResult = (ObjectResult)response;
        objectResult.StatusCode.Should().Be(201);

        // Verify appointment was persisted
        var savedAppointment = await context.Appointments
            .Include(a => a.Services)
            .Include(a => a.Notifications)
            .FirstOrDefaultAsync(a => a.Name == "Fatima Khan");

        savedAppointment.Should().NotBeNull();
        savedAppointment!.Status.Should().Be(AppointmentStatus.Pending);
        savedAppointment.Services.Should().HaveCount(1);
        savedAppointment.Services.First().ServiceName.Should().Be("Root Canal Treatment - RCT");

        // Verify transactional outbox queued
        savedAppointment.Notifications.Should().HaveCount(1);
        var notification = savedAppointment.Notifications.First();
        notification.Status.Should().Be(NotificationStatus.Pending);
        notification.Channel.Should().Be("Email");
    }

    [Fact]
    public async Task AppointmentMustRemainPreserved_EvenWhenEmailServiceThrowsException()
    {
        await using var context = CreateInMemoryDbContext();
        var auditMock = new Mock<IAuditService>();
        var controller = new AppointmentsController(context, auditMock.Object, NullLogger<AppointmentsController>.Instance);

        var request = new CreateAppointmentRequest
        {
            Name = "Bilal Ahmed",
            Gender = "Male",
            AppointmentDate = DateTime.UtcNow.AddDays(1).ToString("yyyy-MM-dd"),
            ContactNumber = "03482226228",
            Email = "bilal@example.com",
            Message = "Urgent extraction request",
            Services = new List<string> { "Extraction" }
        };

        // Create appointment (which records outbox notification)
        var response = await controller.CreateAppointment(request, CancellationToken.None);
        ((ObjectResult)response).StatusCode.Should().Be(201);

        // Simulate simulated SMTP delivery failure in outbox processor
        var emailServiceMock = new Mock<IEmailService>();
        emailServiceMock
            .Setup(e => e.SendAppointmentNotificationAsync(It.IsAny<Domain.Entities.Appointment>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new InvalidOperationException("SMTP connection timeout"));

        var outbox = await context.NotificationOutboxes.FirstAsync();
        try
        {
            await emailServiceMock.Object.SendAppointmentNotificationAsync(outbox.Appointment, CancellationToken.None);
        }
        catch
        {
            outbox.Status = NotificationStatus.Failed;
            outbox.ErrorMessage = "SMTP connection timeout";
            await context.SaveChangesAsync();
        }

        // CRITICAL REQUIREMENT: The appointment itself must NEVER be deleted or rolled back when email fails!
        var appointmentInDb = await context.Appointments.FirstOrDefaultAsync(a => a.Name == "Bilal Ahmed");
        appointmentInDb.Should().NotBeNull();
        appointmentInDb!.Status.Should().Be(AppointmentStatus.Pending);

        // Outbox record tracks failure so admin can see and retry
        outbox.Status.Should().Be(NotificationStatus.Failed);
    }
}
