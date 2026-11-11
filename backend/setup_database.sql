CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;


DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE TABLE "Appointments" (
        "Id" uuid NOT NULL,
        "Name" character varying(100) NOT NULL,
        "Gender" character varying(30) NOT NULL,
        "AppointmentDate" date NOT NULL,
        "ContactNumber" character varying(30) NOT NULL,
        "Email" character varying(150),
        "Message" character varying(1000),
        "Status" integer NOT NULL,
        "CreatedAtUtc" timestamp with time zone NOT NULL,
        "UpdatedAtUtc" timestamp with time zone,
        CONSTRAINT "PK_Appointments" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE TABLE "AuditLogs" (
        "Id" uuid NOT NULL,
        "UserId" uuid,
        "UserEmail" character varying(150),
        "Action" character varying(100) NOT NULL,
        "EntityName" character varying(100) NOT NULL,
        "EntityId" character varying(100),
        "Details" text,
        "IpAddress" character varying(50),
        "TimestampUtc" timestamp with time zone NOT NULL,
        CONSTRAINT "PK_AuditLogs" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE TABLE "Roles" (
        "Id" uuid NOT NULL,
        "Description" text NOT NULL,
        "Name" character varying(256),
        "NormalizedName" character varying(256),
        "ConcurrencyStamp" text,
        CONSTRAINT "PK_Roles" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE TABLE "Services" (
        "Id" uuid NOT NULL,
        "StableKey" character varying(50) NOT NULL,
        "Name" character varying(100) NOT NULL,
        "Category" character varying(50) NOT NULL,
        "ShortDescription" character varying(300) NOT NULL,
        "FullDescription" character varying(3000) NOT NULL,
        "WhoItIsFor" character varying(500) NOT NULL,
        "GeneralBenefits" character varying(2000) NOT NULL,
        "PriceAmount" numeric(18,2),
        "CurrencyCode" character varying(5) NOT NULL DEFAULT 'PKR',
        "PriceDisplayMode" integer NOT NULL,
        "PriceNote" character varying(200),
        "ImageUrl" character varying(500) NOT NULL,
        "ImageAltText" character varying(200) NOT NULL,
        "DisplayOrder" integer NOT NULL,
        "IsPublished" boolean NOT NULL,
        "CreatedAtUtc" timestamp with time zone NOT NULL,
        "UpdatedAtUtc" timestamp with time zone,
        CONSTRAINT "PK_Services" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE TABLE "Users" (
        "Id" uuid NOT NULL,
        "FullName" character varying(150) NOT NULL,
        "IsActive" boolean NOT NULL,
        "CreatedAtUtc" timestamp with time zone NOT NULL,
        "LastLoginAtUtc" timestamp with time zone,
        "UserName" character varying(256),
        "NormalizedUserName" character varying(256),
        "Email" character varying(256),
        "NormalizedEmail" character varying(256),
        "EmailConfirmed" boolean NOT NULL,
        "PasswordHash" text,
        "SecurityStamp" text,
        "ConcurrencyStamp" text,
        "PhoneNumber" text,
        "PhoneNumberConfirmed" boolean NOT NULL,
        "TwoFactorEnabled" boolean NOT NULL,
        "LockoutEnd" timestamp with time zone,
        "LockoutEnabled" boolean NOT NULL,
        "AccessFailedCount" integer NOT NULL,
        CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE TABLE "NotificationOutbox" (
        "Id" uuid NOT NULL,
        "AppointmentId" uuid NOT NULL,
        "Channel" character varying(30) NOT NULL,
        "Recipient" character varying(150) NOT NULL,
        "Subject" character varying(255) NOT NULL,
        "BodyHtml" text NOT NULL,
        "Status" integer NOT NULL,
        "AttemptCount" integer NOT NULL,
        "LastAttemptUtc" timestamp with time zone,
        "ErrorMessage" character varying(500),
        "CreatedAtUtc" timestamp with time zone NOT NULL,
        "SentAtUtc" timestamp with time zone,
        CONSTRAINT "PK_NotificationOutbox" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_NotificationOutbox_Appointments_AppointmentId" FOREIGN KEY ("AppointmentId") REFERENCES "Appointments" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE TABLE "AspNetRoleClaims" (
        "Id" integer GENERATED BY DEFAULT AS IDENTITY,
        "RoleId" uuid NOT NULL,
        "ClaimType" text,
        "ClaimValue" text,
        CONSTRAINT "PK_AspNetRoleClaims" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_AspNetRoleClaims_Roles_RoleId" FOREIGN KEY ("RoleId") REFERENCES "Roles" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE TABLE "AppointmentServices" (
        "Id" uuid NOT NULL,
        "AppointmentId" uuid NOT NULL,
        "ServiceName" character varying(100) NOT NULL,
        "ServiceId" uuid,
        CONSTRAINT "PK_AppointmentServices" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_AppointmentServices_Appointments_AppointmentId" FOREIGN KEY ("AppointmentId") REFERENCES "Appointments" ("Id") ON DELETE CASCADE,
        CONSTRAINT "FK_AppointmentServices_Services_ServiceId" FOREIGN KEY ("ServiceId") REFERENCES "Services" ("Id") ON DELETE SET NULL
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE TABLE "MediaAssets" (
        "Id" uuid NOT NULL,
        "OriginalFileName" character varying(255) NOT NULL,
        "SafeStorageKey" character varying(100) NOT NULL,
        "ContentType" character varying(100) NOT NULL,
        "FileSize" bigint NOT NULL,
        "Width" integer,
        "Height" integer,
        "AltText" character varying(200) NOT NULL,
        "PublicUrl" character varying(500) NOT NULL,
        "CreatedAtUtc" timestamp with time zone NOT NULL,
        "CreatedByUserId" uuid,
        "ServiceId" uuid,
        CONSTRAINT "PK_MediaAssets" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_MediaAssets_Services_ServiceId" FOREIGN KEY ("ServiceId") REFERENCES "Services" ("Id") ON DELETE SET NULL
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE TABLE "AspNetUserClaims" (
        "Id" integer GENERATED BY DEFAULT AS IDENTITY,
        "UserId" uuid NOT NULL,
        "ClaimType" text,
        "ClaimValue" text,
        CONSTRAINT "PK_AspNetUserClaims" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_AspNetUserClaims_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE TABLE "AspNetUserLogins" (
        "LoginProvider" text NOT NULL,
        "ProviderKey" text NOT NULL,
        "ProviderDisplayName" text,
        "UserId" uuid NOT NULL,
        CONSTRAINT "PK_AspNetUserLogins" PRIMARY KEY ("LoginProvider", "ProviderKey"),
        CONSTRAINT "FK_AspNetUserLogins_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE TABLE "AspNetUserRoles" (
        "UserId" uuid NOT NULL,
        "RoleId" uuid NOT NULL,
        CONSTRAINT "PK_AspNetUserRoles" PRIMARY KEY ("UserId", "RoleId"),
        CONSTRAINT "FK_AspNetUserRoles_Roles_RoleId" FOREIGN KEY ("RoleId") REFERENCES "Roles" ("Id") ON DELETE CASCADE,
        CONSTRAINT "FK_AspNetUserRoles_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE TABLE "AspNetUserTokens" (
        "UserId" uuid NOT NULL,
        "LoginProvider" text NOT NULL,
        "Name" text NOT NULL,
        "Value" text,
        CONSTRAINT "PK_AspNetUserTokens" PRIMARY KEY ("UserId", "LoginProvider", "Name"),
        CONSTRAINT "FK_AspNetUserTokens_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE INDEX "IX_Appointments_AppointmentDate" ON "Appointments" ("AppointmentDate");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE INDEX "IX_Appointments_CreatedAtUtc" ON "Appointments" ("CreatedAtUtc");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE INDEX "IX_Appointments_Status" ON "Appointments" ("Status");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE INDEX "IX_AppointmentServices_AppointmentId" ON "AppointmentServices" ("AppointmentId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE INDEX "IX_AppointmentServices_ServiceId" ON "AppointmentServices" ("ServiceId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE INDEX "IX_AspNetRoleClaims_RoleId" ON "AspNetRoleClaims" ("RoleId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE INDEX "IX_AspNetUserClaims_UserId" ON "AspNetUserClaims" ("UserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE INDEX "IX_AspNetUserLogins_UserId" ON "AspNetUserLogins" ("UserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE INDEX "IX_AspNetUserRoles_RoleId" ON "AspNetUserRoles" ("RoleId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE INDEX "IX_AuditLogs_Action" ON "AuditLogs" ("Action");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE INDEX "IX_AuditLogs_EntityName" ON "AuditLogs" ("EntityName");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE INDEX "IX_AuditLogs_TimestampUtc" ON "AuditLogs" ("TimestampUtc");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_MediaAssets_SafeStorageKey" ON "MediaAssets" ("SafeStorageKey");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE INDEX "IX_MediaAssets_ServiceId" ON "MediaAssets" ("ServiceId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE INDEX "IX_NotificationOutbox_AppointmentId" ON "NotificationOutbox" ("AppointmentId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE INDEX "IX_NotificationOutbox_CreatedAtUtc" ON "NotificationOutbox" ("CreatedAtUtc");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE INDEX "IX_NotificationOutbox_Status" ON "NotificationOutbox" ("Status");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE UNIQUE INDEX "RoleNameIndex" ON "Roles" ("NormalizedName");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE INDEX "IX_Services_DisplayOrder" ON "Services" ("DisplayOrder");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE INDEX "IX_Services_IsPublished" ON "Services" ("IsPublished");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_Services_StableKey" ON "Services" ("StableKey");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE INDEX "EmailIndex" ON "Users" ("NormalizedEmail");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    CREATE UNIQUE INDEX "UserNameIndex" ON "Users" ("NormalizedUserName");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261010225552_InitialCreate') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20261010225552_InitialCreate', '8.0.2');
    END IF;
END $EF$;
COMMIT;

