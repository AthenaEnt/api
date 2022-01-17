-- CreateTable
CREATE TABLE `Verification` (
    `id` VARCHAR(100) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `otpCode` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `tel` VARCHAR(191) NULL,
    `context` VARCHAR(191) NOT NULL,
    `pwdRecoverKey` VARCHAR(191) NULL,
    `hasBeenVerified` BOOLEAN NOT NULL DEFAULT false,
    `expireAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(100) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `parentId` VARCHAR(100) NULL,
    `iconImageId` VARCHAR(100) NULL,
    `bannerImageId` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Marque` (
    `id` VARCHAR(100) NOT NULL,
    `imageId` VARCHAR(100) NULL,
    `name` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Discount` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `bannerImageId` VARCHAR(100) NULL,
    `discountType` VARCHAR(191) NOT NULL,
    `discountNature` VARCHAR(191) NOT NULL,
    `discountCode` VARCHAR(191) NOT NULL,
    `discount` INTEGER NOT NULL,
    `startAt` DATETIME(3) NOT NULL,
    `endAt` DATETIME(3) NOT NULL,
    `inCartProductMin` INTEGER NULL,
    `inCartProductMax` INTEGER NULL,
    `commandAmountMin` INTEGER NULL,
    `commandAmountMax` INTEGER NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PriceRule` (
    `id` VARCHAR(100) NOT NULL,
    `minPrice` INTEGER NOT NULL,
    `maxPrice` INTEGER NULL,
    `amountPercent` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pub` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `bannerImageId` VARCHAR(100) NULL,
    `link` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `startAt` DATETIME(3) NOT NULL,
    `endAt` DATETIME(3) NOT NULL,
    `forDiscountId` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShippingZone` (
    `id` VARCHAR(100) NOT NULL,
    `townName` VARCHAR(191) NOT NULL,
    `townCode` VARCHAR(191) NOT NULL,
    `baseShippingPrice` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShippingRule` (
    `id` VARCHAR(100) NOT NULL,
    `ruleName` VARCHAR(191) NOT NULL,
    `rule` JSON NOT NULL,
    `description` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GeneralMeta` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductAttributeMeta` (
    `id` VARCHAR(100) NOT NULL,
    `attributeId` VARCHAR(100) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `value` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductAttribute` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(10) NOT NULL,
    `description` TEXT NULL,
    `global` BOOLEAN NOT NULL DEFAULT false,
    `categoryId` VARCHAR(100) NULL,
    `onlyForProductId` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommandUnit` (
    `id` VARCHAR(100) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `shortCode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommandUnitProduct` (
    `id` VARCHAR(100) NOT NULL,
    `commandUnitId` VARCHAR(100) NOT NULL,
    `productId` VARCHAR(100) NOT NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `unitPrice` INTEGER NOT NULL,
    `priceRuleId` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Media` (
    `id` VARCHAR(100) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `fileType` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `fileDuration` DOUBLE NULL,
    `source` VARCHAR(191) NOT NULL DEFAULT 'server',
    `userId` VARCHAR(100) NULL,

    UNIQUE INDEX `Media_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `shortDescription` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL,
    `productWeight` INTEGER NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `sku` VARCHAR(191) NULL,
    `marqueId` VARCHAR(100) NULL,
    `variantParentId` VARCHAR(100) NULL,
    `showProduct` BOOLEAN NOT NULL DEFAULT true,
    `hasUserDeleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(100) NOT NULL,
    `content` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `context` VARCHAR(191) NOT NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `canLockScreen` BOOLEAN NOT NULL DEFAULT false,
    `theme` VARCHAR(191) NOT NULL DEFAULT '',
    `commandId` VARCHAR(255) NULL,
    `hasUserRead` BOOLEAN NOT NULL DEFAULT false,
    `userId` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(100) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `accoundActivated` BOOLEAN NOT NULL DEFAULT false,
    `role` VARCHAR(191) NOT NULL,
    `currentRole` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserShippingAdress` (
    `id` VARCHAR(100) NOT NULL,
    `shippingZoneId` VARCHAR(100) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `alternatePhone` VARCHAR(191) NOT NULL,
    `adressType` VARCHAR(191) NOT NULL,
    `quatier` VARCHAR(191) NOT NULL,
    `hasUserDeleted` BOOLEAN NOT NULL DEFAULT false,
    `additionalDetails` VARCHAR(191) NULL,
    `audioFileId` VARCHAR(100) NULL,
    `forUserId` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Command` (
    `id` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `totalPrice` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,
    `archived` BOOLEAN NULL DEFAULT false,
    `delivered` BOOLEAN NOT NULL DEFAULT false,
    `status` VARCHAR(191) NOT NULL DEFAULT 'waiting_payment',
    `orderedById` VARCHAR(100) NOT NULL,
    `hasUserCanceled` BOOLEAN NOT NULL DEFAULT false,
    `hasUserDeleted` BOOLEAN NOT NULL DEFAULT false,
    `shippingAdressId` VARCHAR(100) NULL,
    `receiptId` VARCHAR(100) NOT NULL,
    `appliedDiscountId` VARCHAR(100) NULL,

    UNIQUE INDEX `Command_receiptId_key`(`receiptId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommandProduct` (
    `id` VARCHAR(100) NOT NULL,
    `productId` VARCHAR(100) NOT NULL,
    `hasUserDeleted` BOOLEAN NOT NULL DEFAULT false,
    `commandUnitProductId` VARCHAR(100) NOT NULL,
    `quantite` INTEGER NOT NULL,
    `commandId` VARCHAR(100) NOT NULL,
    `hasCustomerConfirmShipping` BOOLEAN NOT NULL DEFAULT false,
    `hasAgentConfirmShipping` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Receipt` (
    `id` VARCHAR(100) NOT NULL,
    `amount` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `hasUserDeleted` BOOLEAN NOT NULL DEFAULT false,
    `paidAt` DATETIME(3) NULL,
    `isPaid` BOOLEAN NOT NULL DEFAULT false,
    `outPaymentId` VARCHAR(191) NULL,
    `outPaymentDetails` JSON NULL,
    `receiptMetas` JSON NOT NULL,
    `receiptMediaId` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CategoryToMarque` (
    `A` VARCHAR(100) NOT NULL,
    `B` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `_CategoryToMarque_AB_unique`(`A`, `B`),
    INDEX `_CategoryToMarque_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CategoryToProduct` (
    `A` VARCHAR(100) NOT NULL,
    `B` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `_CategoryToProduct_AB_unique`(`A`, `B`),
    INDEX `_CategoryToProduct_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DiscountToProduct` (
    `A` VARCHAR(100) NOT NULL,
    `B` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `_DiscountToProduct_AB_unique`(`A`, `B`),
    INDEX `_DiscountToProduct_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProductToShippingZone` (
    `A` VARCHAR(100) NOT NULL,
    `B` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `_ProductToShippingZone_AB_unique`(`A`, `B`),
    INDEX `_ProductToShippingZone_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProductToProductAttributeMeta` (
    `A` VARCHAR(100) NOT NULL,
    `B` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `_ProductToProductAttributeMeta_AB_unique`(`A`, `B`),
    INDEX `_ProductToProductAttributeMeta_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProductToTag` (
    `A` VARCHAR(100) NOT NULL,
    `B` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `_ProductToTag_AB_unique`(`A`, `B`),
    INDEX `_ProductToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MediaToProduct` (
    `A` VARCHAR(100) NOT NULL,
    `B` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `_MediaToProduct_AB_unique`(`A`, `B`),
    INDEX `_MediaToProduct_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_iconImageId_fkey` FOREIGN KEY (`iconImageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_bannerImageId_fkey` FOREIGN KEY (`bannerImageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Marque` ADD CONSTRAINT `Marque_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Discount` ADD CONSTRAINT `Discount_bannerImageId_fkey` FOREIGN KEY (`bannerImageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pub` ADD CONSTRAINT `Pub_bannerImageId_fkey` FOREIGN KEY (`bannerImageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pub` ADD CONSTRAINT `Pub_forDiscountId_fkey` FOREIGN KEY (`forDiscountId`) REFERENCES `Discount`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductAttributeMeta` ADD CONSTRAINT `ProductAttributeMeta_attributeId_fkey` FOREIGN KEY (`attributeId`) REFERENCES `ProductAttribute`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductAttribute` ADD CONSTRAINT `ProductAttribute_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductAttribute` ADD CONSTRAINT `ProductAttribute_onlyForProductId_fkey` FOREIGN KEY (`onlyForProductId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommandUnitProduct` ADD CONSTRAINT `CommandUnitProduct_commandUnitId_fkey` FOREIGN KEY (`commandUnitId`) REFERENCES `CommandUnit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommandUnitProduct` ADD CONSTRAINT `CommandUnitProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommandUnitProduct` ADD CONSTRAINT `CommandUnitProduct_priceRuleId_fkey` FOREIGN KEY (`priceRuleId`) REFERENCES `PriceRule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_marqueId_fkey` FOREIGN KEY (`marqueId`) REFERENCES `Marque`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_variantParentId_fkey` FOREIGN KEY (`variantParentId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_commandId_fkey` FOREIGN KEY (`commandId`) REFERENCES `Command`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserShippingAdress` ADD CONSTRAINT `UserShippingAdress_shippingZoneId_fkey` FOREIGN KEY (`shippingZoneId`) REFERENCES `ShippingZone`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserShippingAdress` ADD CONSTRAINT `UserShippingAdress_audioFileId_fkey` FOREIGN KEY (`audioFileId`) REFERENCES `Media`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserShippingAdress` ADD CONSTRAINT `UserShippingAdress_forUserId_fkey` FOREIGN KEY (`forUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Command` ADD CONSTRAINT `Command_orderedById_fkey` FOREIGN KEY (`orderedById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Command` ADD CONSTRAINT `Command_shippingAdressId_fkey` FOREIGN KEY (`shippingAdressId`) REFERENCES `UserShippingAdress`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Command` ADD CONSTRAINT `Command_receiptId_fkey` FOREIGN KEY (`receiptId`) REFERENCES `Receipt`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Command` ADD CONSTRAINT `Command_appliedDiscountId_fkey` FOREIGN KEY (`appliedDiscountId`) REFERENCES `Discount`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommandProduct` ADD CONSTRAINT `CommandProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommandProduct` ADD CONSTRAINT `CommandProduct_commandUnitProductId_fkey` FOREIGN KEY (`commandUnitProductId`) REFERENCES `CommandUnitProduct`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommandProduct` ADD CONSTRAINT `CommandProduct_commandId_fkey` FOREIGN KEY (`commandId`) REFERENCES `Command`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Receipt` ADD CONSTRAINT `Receipt_receiptMediaId_fkey` FOREIGN KEY (`receiptMediaId`) REFERENCES `Media`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToMarque` ADD FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToMarque` ADD FOREIGN KEY (`B`) REFERENCES `Marque`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToProduct` ADD FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToProduct` ADD FOREIGN KEY (`B`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiscountToProduct` ADD FOREIGN KEY (`A`) REFERENCES `Discount`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiscountToProduct` ADD FOREIGN KEY (`B`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductToShippingZone` ADD FOREIGN KEY (`A`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductToShippingZone` ADD FOREIGN KEY (`B`) REFERENCES `ShippingZone`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductToProductAttributeMeta` ADD FOREIGN KEY (`A`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductToProductAttributeMeta` ADD FOREIGN KEY (`B`) REFERENCES `ProductAttributeMeta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductToTag` ADD FOREIGN KEY (`A`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductToTag` ADD FOREIGN KEY (`B`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MediaToProduct` ADD FOREIGN KEY (`A`) REFERENCES `Media`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MediaToProduct` ADD FOREIGN KEY (`B`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
