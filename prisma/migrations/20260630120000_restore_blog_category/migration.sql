-- Restore the BlogCategory table (managed blog categories).
--
-- This model was removed from schema.prisma in an earlier change, and because
-- deploys used `prisma db push`, the live table was silently dropped along
-- with every managed category. The model has been re-added to schema.prisma;
-- this migration recreates the table.
--
-- `IF NOT EXISTS` makes it safe to apply whether or not the table currently
-- exists on a given environment (e.g. a server whose table was never dropped).

-- CreateTable
CREATE TABLE IF NOT EXISTS `BlogCategory` (
    `id` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(8) NOT NULL,
    `slug` VARCHAR(128) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `source` VARCHAR(32) NULL,
    `sourceId` VARCHAR(64) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `BlogCategory_locale_idx`(`locale`),
    UNIQUE INDEX `BlogCategory_locale_slug_key`(`locale`, `slug`),
    UNIQUE INDEX `BlogCategory_source_sourceId_locale_key`(`source`, `sourceId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
