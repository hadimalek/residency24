
-- AlterTable
ALTER TABLE `Article` ADD COLUMN `authorId` VARCHAR(30) NULL;

-- CreateTable
CREATE TABLE `Author` (
    `id` VARCHAR(30) NOT NULL,
    `slug` VARCHAR(128) NOT NULL,
    `userId` INTEGER NULL,
    `avatarId` VARCHAR(30) NULL,
    `websiteUrl` VARCHAR(512) NULL,
    `instagramUrl` VARCHAR(512) NULL,
    `linkedinUrl` VARCHAR(512) NULL,
    `telegramUrl` VARCHAR(512) NULL,
    `xUrl` VARCHAR(512) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Author_slug_key`(`slug`),
    UNIQUE INDEX `Author_userId_key`(`userId`),
    INDEX `Author_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuthorTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(30) NOT NULL,
    `locale` VARCHAR(8) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NULL,
    `bio` TEXT NULL,

    INDEX `AuthorTranslation_locale_idx`(`locale`),
    UNIQUE INDEX `AuthorTranslation_authorId_locale_key`(`authorId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Article_authorId_idx` ON `Article`(`authorId`);

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Author`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Author` ADD CONSTRAINT `Author_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Author` ADD CONSTRAINT `Author_avatarId_fkey` FOREIGN KEY (`avatarId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuthorTranslation` ADD CONSTRAINT `AuthorTranslation_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Author`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

