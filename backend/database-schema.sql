-- SmartCafe Database Schema for MySQL (XAMPP)
-- Bu dosyayı phpMyAdmin'de veya MySQL terminalinde çalıştırabilirsiniz

-- Veritabanını oluştur (eğer yoksa)
CREATE DATABASE IF NOT EXISTS pos_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pos_website;

-- Users tablosu
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) PRIMARY KEY,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL, -- bcrypt hash (60 karakter)
  `firstName` VARCHAR(255) NOT NULL,
  `lastName` VARCHAR(255) NOT NULL,
  `role` ENUM('super_admin', 'admin', 'user') DEFAULT 'user',
  `isActive` BOOLEAN DEFAULT TRUE,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Packages tablosu
CREATE TABLE IF NOT EXISTS `packages` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `features` TEXT NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `duration` INT NOT NULL,
  `isActive` BOOLEAN DEFAULT TRUE,
  `displayOrder` INT DEFAULT 0,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_isActive` (`isActive`),
  INDEX `idx_displayOrder` (`displayOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subscriptions tablosu
CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` VARCHAR(36) PRIMARY KEY,
  `userId` VARCHAR(36),
  `packageId` VARCHAR(36) NOT NULL,
  `customerId` VARCHAR(255),
  `customerName` VARCHAR(255),
  `customerEmail` VARCHAR(255),
  `customerPhone` VARCHAR(50),
  `customerLogin` VARCHAR(255),
  `customerPassword` VARCHAR(255),
  `restaurantName` VARCHAR(255),
  `restaurantAddress` TEXT,
  `status` ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
  `paymentStatus` ENUM('pending', 'paid') DEFAULT 'pending',
  `paymentType` ENUM('one_time', 'monthly') DEFAULT 'one_time',
  `startDate` DATETIME NOT NULL,
  `endDate` DATETIME NOT NULL,
  `durationMonths` INT DEFAULT 1,
  `amount` DECIMAL(10, 2) NOT NULL,
  `notes` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`packageId`) REFERENCES `packages`(`id`) ON DELETE CASCADE,
  INDEX `idx_userId` (`userId`),
  INDEX `idx_packageId` (`packageId`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payment Logs tablosu (aylık ödemeler için)
CREATE TABLE IF NOT EXISTS `payment_logs` (
  `id` VARCHAR(36) PRIMARY KEY,
  `subscriptionId` VARCHAR(36) NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `month` INT NOT NULL,
  `year` INT NOT NULL,
  `status` ENUM('pending', 'paid', 'overdue', 'cancelled') DEFAULT 'pending',
  `paymentDate` DATETIME,
  `notes` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`subscriptionId`) REFERENCES `subscriptions`(`id`) ON DELETE CASCADE,
  INDEX `idx_subscriptionId` (`subscriptionId`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact Messages tablosu
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50),
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('new', 'read', 'replied') DEFAULT 'new',
  `reply` TEXT,
  `repliedBy` VARCHAR(36),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_status` (`status`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Site Content tablosu
CREATE TABLE IF NOT EXISTS `site_contents` (
  `id` VARCHAR(36) PRIMARY KEY,
  `key` VARCHAR(255) UNIQUE NOT NULL,
  `content` TEXT NOT NULL,
  `type` VARCHAR(50),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

