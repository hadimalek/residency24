-- AlterTable
ALTER TABLE `User` MODIFY `role` VARCHAR(32) NOT NULL DEFAULT 'ADMIN';

-- AlterTable
ALTER TABLE `Lead` ADD COLUMN `assignedToId` VARCHAR(30) NULL,
    ADD COLUMN `source` VARCHAR(64) NULL,
    ADD COLUMN `sourcePage` VARCHAR(512) NULL,
    MODIFY `status` VARCHAR(32) NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE `Provider` MODIFY `apiKey` VARCHAR(512) NOT NULL;

-- CreateTable
CREATE TABLE `Language` (
    `code` VARCHAR(8) NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    `nativeName` VARCHAR(64) NOT NULL,
    `direction` VARCHAR(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    INDEX `Language_isActive_sortOrder_idx`(`isActive`, `sortOrder`),
    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Country` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(64) NOT NULL,
    `iso2` VARCHAR(2) NOT NULL,
    `iso3` VARCHAR(3) NOT NULL,
    `region` VARCHAR(64) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `heroImageId` VARCHAR(30) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Country_slug_key`(`slug`),
    UNIQUE INDEX `Country_iso2_key`(`iso2`),
    UNIQUE INDEX `Country_iso3_key`(`iso3`),
    INDEX `Country_isActive_isFeatured_sortOrder_idx`(`isActive`, `isFeatured`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CountryTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `countryId` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(8) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `shortDescription` VARCHAR(512) NULL,
    `description` TEXT NULL,
    `metaTitle` VARCHAR(255) NULL,
    `metaDescription` VARCHAR(512) NULL,

    INDEX `CountryTranslation_locale_idx`(`locale`),
    UNIQUE INDEX `CountryTranslation_countryId_locale_key`(`countryId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VisaType` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(64) NOT NULL,
    `category` VARCHAR(64) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `heroImageId` VARCHAR(30) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VisaType_slug_key`(`slug`),
    INDEX `VisaType_isActive_isFeatured_category_sortOrder_idx`(`isActive`, `isFeatured`, `category`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VisaTypeTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `visaTypeId` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(8) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `shortDescription` VARCHAR(512) NULL,
    `description` TEXT NULL,
    `metaTitle` VARCHAR(255) NULL,
    `metaDescription` VARCHAR(512) NULL,

    INDEX `VisaTypeTranslation_locale_idx`(`locale`),
    UNIQUE INDEX `VisaTypeTranslation_visaTypeId_locale_key`(`visaTypeId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(64) NOT NULL,
    `category` VARCHAR(64) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `heroImageId` VARCHAR(30) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Service_slug_key`(`slug`),
    INDEX `Service_isActive_isFeatured_category_sortOrder_idx`(`isActive`, `isFeatured`, `category`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(8) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `shortDescription` VARCHAR(512) NULL,
    `description` TEXT NULL,
    `metaTitle` VARCHAR(255) NULL,
    `metaDescription` VARCHAR(512) NULL,

    INDEX `ServiceTranslation_locale_idx`(`locale`),
    UNIQUE INDEX `ServiceTranslation_serviceId_locale_key`(`serviceId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CountryVisaType` (
    `countryId` VARCHAR(191) NOT NULL,
    `visaTypeId` VARCHAR(191) NOT NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,

    INDEX `CountryVisaType_visaTypeId_idx`(`visaTypeId`),
    PRIMARY KEY (`countryId`, `visaTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CountryService` (
    `countryId` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,

    INDEX `CountryService_serviceId_idx`(`serviceId`),
    PRIMARY KEY (`countryId`, `serviceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Page` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `pageType` ENUM('HOME', 'COUNTRY_HUB', 'COUNTRY_SERVICE', 'VISA_TYPE', 'COUNTRY_VISA', 'COMPARISON', 'TOOL', 'LANDING', 'GENERIC') NOT NULL,
    `status` ENUM('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt` DATETIME(3) NULL,
    `isHomepage` BOOLEAN NOT NULL DEFAULT false,
    `countryId` VARCHAR(191) NULL,
    `visaTypeId` VARCHAR(191) NULL,
    `serviceId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Page_status_pageType_idx`(`status`, `pageType`),
    INDEX `Page_countryId_status_idx`(`countryId`, `status`),
    INDEX `Page_visaTypeId_status_idx`(`visaTypeId`, `status`),
    INDEX `Page_serviceId_status_idx`(`serviceId`, `status`),
    UNIQUE INDEX `Page_slug_pageType_key`(`slug`, `pageType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PageTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `pageId` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(8) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `h1` VARCHAR(255) NULL,
    `intro` TEXT NULL,
    `ctaPrimary` VARCHAR(128) NULL,
    `ctaSecondary` VARCHAR(128) NULL,
    `metaTitle` VARCHAR(255) NULL,
    `metaDescription` VARCHAR(512) NULL,

    INDEX `PageTranslation_locale_idx`(`locale`),
    UNIQUE INDEX `PageTranslation_pageId_locale_key`(`pageId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PageBlock` (
    `id` VARCHAR(191) NOT NULL,
    `pageId` VARCHAR(191) NOT NULL,
    `blockType` ENUM('HERO', 'TRUST_BAR', 'FEATURE_GRID', 'PROCESS_STEPS', 'COST_TABLE', 'REQUIREMENTS', 'DOCUMENTS_CHECKLIST', 'FAQ', 'COMPARISON', 'TESTIMONIAL', 'CTA', 'LEAD_FORM', 'DISCLAIMER', 'TIMELINE', 'ELIGIBILITY_SUMMARY', 'RICH_TEXT', 'IMAGE', 'RELATED_SERVICES', 'RELATED_ARTICLES') NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `payload` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PageBlock_pageId_sortOrder_idx`(`pageId`, `sortOrder`),
    INDEX `PageBlock_blockType_idx`(`blockType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PageBlockTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `blockId` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(8) NOT NULL,
    `payload` TEXT NOT NULL,

    INDEX `PageBlockTranslation_locale_idx`(`locale`),
    UNIQUE INDEX `PageBlockTranslation_blockId_locale_key`(`blockId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Article` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `status` ENUM('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt` DATETIME(3) NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `featuredImageId` VARCHAR(30) NULL,
    `countryId` VARCHAR(191) NULL,
    `category` VARCHAR(64) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Article_slug_key`(`slug`),
    INDEX `Article_status_publishedAt_idx`(`status`, `publishedAt`),
    INDEX `Article_countryId_status_idx`(`countryId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ArticleTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `articleId` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(8) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `excerpt` VARCHAR(512) NULL,
    `content` TEXT NOT NULL,
    `metaTitle` VARCHAR(255) NULL,
    `metaDescription` VARCHAR(512) NULL,

    INDEX `ArticleTranslation_locale_idx`(`locale`),
    UNIQUE INDEX `ArticleTranslation_articleId_locale_key`(`articleId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Faq` (
    `id` VARCHAR(191) NOT NULL,
    `category` VARCHAR(64) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `countryId` VARCHAR(191) NULL,
    `visaTypeId` VARCHAR(191) NULL,
    `serviceId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Faq_category_sortOrder_isActive_idx`(`category`, `sortOrder`, `isActive`),
    INDEX `Faq_countryId_idx`(`countryId`),
    INDEX `Faq_visaTypeId_idx`(`visaTypeId`),
    INDEX `Faq_serviceId_idx`(`serviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FaqTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `faqId` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(8) NOT NULL,
    `question` VARCHAR(512) NOT NULL,
    `answer` TEXT NOT NULL,

    INDEX `FaqTranslation_locale_idx`(`locale`),
    UNIQUE INDEX `FaqTranslation_faqId_locale_key`(`faqId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CostTable` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(128) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `countryId` VARCHAR(191) NULL,
    `visaTypeId` VARCHAR(191) NULL,
    `serviceId` VARCHAR(191) NULL,
    `lastVerifiedAt` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CostTable_slug_key`(`slug`),
    INDEX `CostTable_countryId_idx`(`countryId`),
    INDEX `CostTable_visaTypeId_idx`(`visaTypeId`),
    INDEX `CostTable_serviceId_idx`(`serviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CostTableTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `costTableId` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(8) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `disclaimer` TEXT NULL,

    INDEX `CostTableTranslation_locale_idx`(`locale`),
    UNIQUE INDEX `CostTableTranslation_costTableId_locale_key`(`costTableId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CostItem` (
    `id` VARCHAR(191) NOT NULL,
    `costTableId` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `amountMin` DECIMAL(12, 2) NULL,
    `amountMax` DECIMAL(12, 2) NULL,

    INDEX `CostItem_costTableId_sortOrder_idx`(`costTableId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CostItemTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `costItemId` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(8) NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `notes` TEXT NULL,

    INDEX `CostItemTranslation_locale_idx`(`locale`),
    UNIQUE INDEX `CostItemTranslation_costItemId_locale_key`(`costItemId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Requirement` (
    `id` VARCHAR(191) NOT NULL,
    `visaTypeId` VARCHAR(191) NULL,
    `applicantType` VARCHAR(64) NULL,
    `isRequired` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Requirement_visaTypeId_applicantType_sortOrder_idx`(`visaTypeId`, `applicantType`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RequirementTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `requirementId` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(8) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `notes` TEXT NULL,

    INDEX `RequirementTranslation_locale_idx`(`locale`),
    UNIQUE INDEX `RequirementTranslation_requirementId_locale_key`(`requirementId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Redirect` (
    `id` VARCHAR(191) NOT NULL,
    `fromPath` VARCHAR(512) NOT NULL,
    `toPath` VARCHAR(512) NOT NULL,
    `statusCode` INTEGER NOT NULL DEFAULT 301,
    `locale` VARCHAR(8) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `hitCount` INTEGER NOT NULL DEFAULT 0,
    `lastHitAt` DATETIME(3) NULL,
    `reason` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Redirect_isActive_fromPath_idx`(`isActive`, `fromPath`),
    UNIQUE INDEX `Redirect_fromPath_locale_key`(`fromPath`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SeoMeta` (
    `id` VARCHAR(191) NOT NULL,
    `pageId` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(8) NOT NULL,
    `metaTitle` VARCHAR(255) NULL,
    `metaDescription` VARCHAR(512) NULL,
    `canonicalUrl` VARCHAR(512) NULL,
    `ogTitle` VARCHAR(255) NULL,
    `ogDescription` VARCHAR(512) NULL,
    `ogImageUrl` VARCHAR(512) NULL,
    `twitterCard` VARCHAR(64) NULL,
    `robots` VARCHAR(128) NULL,
    `schemaType` VARCHAR(64) NULL,
    `schemaJson` TEXT NULL,

    INDEX `SeoMeta_locale_idx`(`locale`),
    UNIQUE INDEX `SeoMeta_pageId_locale_key`(`pageId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Media` (
    `id` VARCHAR(30) NOT NULL,
    `filePath` VARCHAR(512) NOT NULL,
    `fileName` VARCHAR(255) NOT NULL,
    `mimeType` VARCHAR(64) NOT NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `fileSize` INTEGER NULL,
    `uploadedById` VARCHAR(30) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Media_mimeType_idx`(`mimeType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MediaTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `mediaId` VARCHAR(30) NOT NULL,
    `locale` VARCHAR(8) NOT NULL,
    `altText` VARCHAR(512) NULL,
    `title` VARCHAR(255) NULL,
    `caption` TEXT NULL,

    INDEX `MediaTranslation_locale_idx`(`locale`),
    UNIQUE INDEX `MediaTranslation_mediaId_locale_key`(`mediaId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Menu` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(64) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Menu_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MenuItem` (
    `id` VARCHAR(191) NOT NULL,
    `menuId` VARCHAR(191) NOT NULL,
    `parentId` VARCHAR(191) NULL,
    `url` VARCHAR(512) NOT NULL,
    `target` VARCHAR(16) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    INDEX `MenuItem_menuId_sortOrder_idx`(`menuId`, `sortOrder`),
    INDEX `MenuItem_parentId_idx`(`parentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MenuItemTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `menuItemId` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(8) NOT NULL,
    `label` VARCHAR(255) NOT NULL,

    INDEX `MenuItemTranslation_locale_idx`(`locale`),
    UNIQUE INDEX `MenuItemTranslation_menuItemId_locale_key`(`menuItemId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Lead_source_idx` ON `Lead`(`source`);

-- AddForeignKey
ALTER TABLE `Country` ADD CONSTRAINT `Country_heroImageId_fkey` FOREIGN KEY (`heroImageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CountryTranslation` ADD CONSTRAINT `CountryTranslation_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VisaType` ADD CONSTRAINT `VisaType_heroImageId_fkey` FOREIGN KEY (`heroImageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VisaTypeTranslation` ADD CONSTRAINT `VisaTypeTranslation_visaTypeId_fkey` FOREIGN KEY (`visaTypeId`) REFERENCES `VisaType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_heroImageId_fkey` FOREIGN KEY (`heroImageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceTranslation` ADD CONSTRAINT `ServiceTranslation_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CountryVisaType` ADD CONSTRAINT `CountryVisaType_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CountryVisaType` ADD CONSTRAINT `CountryVisaType_visaTypeId_fkey` FOREIGN KEY (`visaTypeId`) REFERENCES `VisaType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CountryService` ADD CONSTRAINT `CountryService_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CountryService` ADD CONSTRAINT `CountryService_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Page` ADD CONSTRAINT `Page_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Page` ADD CONSTRAINT `Page_visaTypeId_fkey` FOREIGN KEY (`visaTypeId`) REFERENCES `VisaType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Page` ADD CONSTRAINT `Page_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PageTranslation` ADD CONSTRAINT `PageTranslation_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `Page`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PageBlock` ADD CONSTRAINT `PageBlock_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `Page`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PageBlockTranslation` ADD CONSTRAINT `PageBlockTranslation_blockId_fkey` FOREIGN KEY (`blockId`) REFERENCES `PageBlock`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_featuredImageId_fkey` FOREIGN KEY (`featuredImageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ArticleTranslation` ADD CONSTRAINT `ArticleTranslation_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Faq` ADD CONSTRAINT `Faq_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Faq` ADD CONSTRAINT `Faq_visaTypeId_fkey` FOREIGN KEY (`visaTypeId`) REFERENCES `VisaType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Faq` ADD CONSTRAINT `Faq_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FaqTranslation` ADD CONSTRAINT `FaqTranslation_faqId_fkey` FOREIGN KEY (`faqId`) REFERENCES `Faq`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CostTable` ADD CONSTRAINT `CostTable_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CostTable` ADD CONSTRAINT `CostTable_visaTypeId_fkey` FOREIGN KEY (`visaTypeId`) REFERENCES `VisaType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CostTable` ADD CONSTRAINT `CostTable_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CostTableTranslation` ADD CONSTRAINT `CostTableTranslation_costTableId_fkey` FOREIGN KEY (`costTableId`) REFERENCES `CostTable`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CostItem` ADD CONSTRAINT `CostItem_costTableId_fkey` FOREIGN KEY (`costTableId`) REFERENCES `CostTable`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CostItemTranslation` ADD CONSTRAINT `CostItemTranslation_costItemId_fkey` FOREIGN KEY (`costItemId`) REFERENCES `CostItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Requirement` ADD CONSTRAINT `Requirement_visaTypeId_fkey` FOREIGN KEY (`visaTypeId`) REFERENCES `VisaType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequirementTranslation` ADD CONSTRAINT `RequirementTranslation_requirementId_fkey` FOREIGN KEY (`requirementId`) REFERENCES `Requirement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SeoMeta` ADD CONSTRAINT `SeoMeta_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `Page`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MediaTranslation` ADD CONSTRAINT `MediaTranslation_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `Media`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuItem` ADD CONSTRAINT `MenuItem_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuItem` ADD CONSTRAINT `MenuItem_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `MenuItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuItemTranslation` ADD CONSTRAINT `MenuItemTranslation_menuItemId_fkey` FOREIGN KEY (`menuItemId`) REFERENCES `MenuItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

