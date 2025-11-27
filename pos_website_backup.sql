-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 27 Kas 2025, 19:50:58
-- Sunucu sürümü: 10.4.32-MariaDB
-- PHP Sürümü: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `pos_website`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `advertising_customers`
--

CREATE TABLE `advertising_customers` (
  `id` varchar(36) NOT NULL,
  `customerName` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `restaurantName` varchar(255) NOT NULL,
  `tableCount` int(11) DEFAULT NULL,
  `qrMenuRequest` tinyint(4) NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `channel` enum('whatsapp','instagram','tiktok','facebook') NOT NULL DEFAULT 'whatsapp',
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `advertising_customers`
--

INSERT INTO `advertising_customers` (`id`, `customerName`, `phone`, `restaurantName`, `tableCount`, `qrMenuRequest`, `notes`, `channel`, `createdAt`, `updatedAt`) VALUES
('14756c75-47d8-4b1b-afc2-541fb5c67df5', '+++', '+994504243892', '++++', 20, 1, 'berde ay pizza 20 azina danisdim', 'instagram', '2025-11-18 19:03:04.290744', '2025-11-18 19:03:34.000000'),
('9ec855dc-909c-4fc2-908f-8b5da39f357b', 'adil', '+994504243893', 'berde', 20, 1, 'salam', 'instagram', '2025-11-18 19:26:55.198170', '2025-11-18 19:27:07.000000'),
('d70bd666-ec85-4ab5-8aa3-e0cec9df528f', 'oku', '+994556172023', 'sa', 20, 1, 'e', 'instagram', '2025-11-18 19:27:29.589378', '2025-11-18 19:27:29.589378');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `cash_registers`
--

CREATE TABLE `cash_registers` (
  `id` varchar(36) NOT NULL,
  `restaurantId` varchar(255) NOT NULL,
  `openedById` varchar(255) DEFAULT NULL,
  `closedById` varchar(255) DEFAULT NULL,
  `status` enum('open','closed') NOT NULL DEFAULT 'closed',
  `openingBalance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `closingBalance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `totalCash` decimal(10,2) NOT NULL DEFAULT 0.00,
  `totalCard` decimal(10,2) NOT NULL DEFAULT 0.00,
  `totalQR` decimal(10,2) NOT NULL DEFAULT 0.00,
  `totalSales` decimal(10,2) NOT NULL DEFAULT 0.00,
  `totalRefunds` decimal(10,2) NOT NULL DEFAULT 0.00,
  `openedAt` datetime DEFAULT NULL,
  `closedAt` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `cash_registers`
--

INSERT INTO `cash_registers` (`id`, `restaurantId`, `openedById`, `closedById`, `status`, `openingBalance`, `closingBalance`, `totalCash`, `totalCard`, `totalQR`, `totalSales`, `totalRefunds`, `openedAt`, `closedAt`, `notes`, `createdAt`, `updatedAt`) VALUES
('6cc8959d-11f1-4f86-ae05-a4f76bd0a738', '95fd053e-dffd-4547-83a9-0a5a9695d273', NULL, NULL, 'open', 500.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2025-11-19 20:05:58', NULL, NULL, '2025-11-19 20:05:58.666292', '2025-11-19 20:05:58.666292');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied') NOT NULL DEFAULT 'new',
  `reply` varchar(255) DEFAULT NULL,
  `repliedBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `userAgent` varchar(255) DEFAULT NULL,
  `deviceId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `phone`, `subject`, `message`, `status`, `reply`, `repliedBy`, `createdAt`, `updatedAt`, `userAgent`, `deviceId`) VALUES
('1b0caa2e-6364-4f33-b2dc-934a16a80d89', 'bbbbbbb', 'bbbbbbbbbbbbbbbb@gmail.com', 'bbbbbbbbbbbbbbbbbbbb', 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'new', NULL, NULL, '2025-11-23 22:12:59.578562', '2025-11-23 22:12:59.578562', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'bfedaa1270552a80aad6bf81573b153d'),
('4c9819c0-fad3-4bb4-9260-73ca3a5f41db', 'Alasgar Musayev', 'lsgrmusazad@gmail.com', '0504243892', 'MENE ZEG', '333', 'replied', 'salam', '', '2025-11-16 21:32:17.015730', '2025-11-16 21:32:41.000000', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'fc66af115c5b28561ddc92b0e8ef1df7');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `customers`
--

CREATE TABLE `customers` (
  `id` varchar(36) NOT NULL,
  `restaurantId` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `restaurantName` varchar(255) DEFAULT NULL,
  `tableCount` int(11) DEFAULT NULL,
  `qrMenuRequest` tinyint(4) NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `totalOrders` int(11) NOT NULL DEFAULT 0,
  `totalSpent` decimal(10,2) NOT NULL DEFAULT 0.00,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `notification_subscriptions`
--

CREATE TABLE `notification_subscriptions` (
  `id` varchar(36) NOT NULL,
  `endpoint` varchar(255) NOT NULL,
  `p256dh` varchar(255) DEFAULT NULL,
  `auth` varchar(255) DEFAULT NULL,
  `userAgent` varchar(255) DEFAULT NULL,
  `userId` varchar(255) DEFAULT NULL,
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `notification_subscriptions`
--

INSERT INTO `notification_subscriptions` (`id`, `endpoint`, `p256dh`, `auth`, `userAgent`, `userId`, `isActive`, `createdAt`, `updatedAt`) VALUES
('07b56c75-6f9d-41ae-932a-7eb98914cb24', 'https://fcm.googleapis.com/fcm/send/cAVjr3FRsEk:APA91bHX6f0sY0SPP5KUN_qxF7TKF28OUEJ4TgR7UPTgib0YxuIZTCOUkOybn48J2_kvFtechY5YM6ntfM-DTTXJGAPgaG8xwZrA1hn_PkJ6zh-a2b_nk_VAp6xxyMKZYCJCykzDPggY', 'BIqsXa3xGu5t2QczYd53WJZKZwA5boMcfWShiAc+FCO0C6xgfkSXdF2IEzhnmdOcLWt/e3Gw9I2JLQWRcscWe78=', 'ycb/XyJFRSQpwSMO0wMBCA==', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', NULL, 1, '2025-11-15 22:44:36.652018', '2025-11-15 22:44:36.652018'),
('81699581-7234-4df1-91c3-f22c120874fc', 'https://fcm.googleapis.com/fcm/send/dPj6y6uMeVY:APA91bHZQ42XXNJ7sbh76xy7rPn9utuFBysqFA9JdowdNEE6T7v_bWpg55Q9NUIc0Xqv4Usi2P7T6HIrMpbRrsbEBHhXkMJI09Bi-9Tw32U4zc13_LjpQ2YKAXNuVxQIs7L14w6oljHO', 'BIUd5vc0DQbHXyt+UO2OvQ0JsKNXvP/JTzpd13RWw0LEDnc8OU+uz7jx7XMwc3tHUea0Gf/ttVrtmxEMOCMOfJ8=', '0gpKaQtaD/U6OEFDLZr2Dg==', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', NULL, 1, '2025-11-15 21:44:26.234832', '2025-11-15 21:44:26.234832');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `orders`
--

CREATE TABLE `orders` (
  `id` varchar(36) NOT NULL,
  `restaurantId` varchar(255) NOT NULL,
  `tableId` varchar(255) DEFAULT NULL,
  `customerId` varchar(255) DEFAULT NULL,
  `waiterId` varchar(255) DEFAULT NULL,
  `orderNumber` varchar(255) NOT NULL,
  `status` enum('pending','in_progress','ready','served','paid','cancelled') NOT NULL DEFAULT 'pending',
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `paidAmount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `orders`
--

INSERT INTO `orders` (`id`, `restaurantId`, `tableId`, `customerId`, `waiterId`, `orderNumber`, `status`, `subtotal`, `tax`, `discount`, `total`, `paidAmount`, `notes`, `createdAt`, `updatedAt`) VALUES
('05a674c8-31fe-4763-bb6c-19011eea1b3e', '95fd053e-dffd-4547-83a9-0a5a9695d273', '8efec112-57d8-46f3-9386-f4e4dad3dc6b', NULL, NULL, 'ORD-2025-0023', 'paid', 15.01, 2.70, 0.00, 17.71, 0.00, NULL, '2025-11-20 00:36:38.781267', '2025-11-20 19:57:39.000000'),
('0a758758-bd65-41ce-a593-6bba22b9ed82', '95fd053e-dffd-4547-83a9-0a5a9695d273', '34419402-b428-4107-b535-01b24b8a9803', NULL, NULL, 'ORD-2025-0028', 'paid', 30.02, 5.40, 0.00, 35.42, 0.00, NULL, '2025-11-20 18:56:40.519179', '2025-11-20 21:24:45.000000'),
('10af48c7-63ed-4be2-b1ec-f5c60857e206', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'bbf63f22-ba66-4150-88f6-bf7e0a2ab778', NULL, NULL, 'ORD-2025-0035', 'pending', 5.00, 0.90, 0.00, 5.90, 0.00, NULL, '2025-11-20 21:18:27.729373', '2025-11-20 21:18:27.729373'),
('160d543a-c9d6-4227-b091-589eed711202', '95fd053e-dffd-4547-83a9-0a5a9695d273', '34419402-b428-4107-b535-01b24b8a9803', NULL, NULL, 'ORD-2025-0003', 'paid', 5.00, 0.90, 0.00, 5.90, 0.01, NULL, '2025-11-19 23:01:00.231787', '2025-11-19 23:50:32.000000'),
('1e4086a6-cc7d-48f7-946b-3cff2cbba700', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'e908abc8-067c-439c-8e39-d4c58bb7f7a9', NULL, NULL, 'ORD-2025-0016', 'paid', 110.05, 19.81, 0.00, 129.86, 0.00, NULL, '2025-11-20 00:02:44.263043', '2025-11-20 19:57:32.000000'),
('20f1c127-5fbf-4238-b6b8-0e8fe35b0ef4', '95fd053e-dffd-4547-83a9-0a5a9695d273', '48b2b493-f1b6-465f-877d-7e161263864d', NULL, NULL, 'ORD-2025-0047', 'pending', 12.50, 2.25, 0.00, 14.75, 0.00, NULL, '2025-11-20 21:53:44.092055', '2025-11-20 21:53:49.000000'),
('214d1f23-0f0d-4a83-b9c0-baabd7ec0964', '95fd053e-dffd-4547-83a9-0a5a9695d273', '022aa892-930b-4704-877c-5410cc1da4cb', NULL, NULL, 'ORD-2025-0041', 'pending', 5.00, 0.90, 0.00, 5.90, 0.00, NULL, '2025-11-20 21:31:28.272700', '2025-11-20 21:31:28.272700'),
('25f83be7-5d33-4921-a246-6d4ab08691ff', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'e908abc8-067c-439c-8e39-d4c58bb7f7a9', NULL, NULL, 'ORD-2025-0002', 'paid', 5.00, 0.90, 0.00, 5.90, 0.01, NULL, '2025-11-19 22:58:51.859890', '2025-11-19 23:50:08.000000'),
('2963f1ec-f15c-4a58-b478-67a8747073b2', '95fd053e-dffd-4547-83a9-0a5a9695d273', '022aa892-930b-4704-877c-5410cc1da4cb', NULL, NULL, 'ORD-2025-0037', 'paid', 5.00, 0.90, 0.00, 5.90, 0.01, NULL, '2025-11-20 21:24:52.424510', '2025-11-20 21:30:24.000000'),
('2d992f85-5edf-4362-921c-900eed2b165d', '95fd053e-dffd-4547-83a9-0a5a9695d273', '1449e3fe-dbf1-491e-89bb-2219f4ab38f4', NULL, NULL, 'ORD-2025-0026', 'paid', 0.04, 0.01, 0.00, 0.04, 0.00, NULL, '2025-11-20 01:18:26.400941', '2025-11-20 20:50:31.000000'),
('31ff0b36-3cd1-4093-b6e6-70b6acbbb654', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'dce80f77-15f7-443a-b7a4-08d53ab5d40d', NULL, NULL, 'ORD-2025-0029', 'paid', 19.03, 3.43, 0.00, 19.03, 0.00, NULL, '2025-11-20 19:02:45.558387', '2025-11-20 19:57:18.000000'),
('3abc46da-a2c1-416a-9b63-304fff5b82a0', '95fd053e-dffd-4547-83a9-0a5a9695d273', '8d2af9ac-9699-41db-a537-0ed3d3dbde09', NULL, NULL, 'ORD-2025-0007', 'paid', 5.00, 0.90, 0.00, 5.90, 0.01, NULL, '2025-11-19 23:09:53.858961', '2025-11-19 23:50:15.000000'),
('3ad1ecfd-af0d-4dc0-b759-4c1f25a1d307', '95fd053e-dffd-4547-83a9-0a5a9695d273', '7d343e60-18a2-4d9d-9a31-874c363c6958', NULL, NULL, 'ORD-2025-0032', 'paid', 2.50, 0.45, 0.00, 2.95, 0.00, NULL, '2025-11-20 21:17:49.929566', '2025-11-20 21:17:51.000000'),
('412c5e24-7ee3-45ff-9d85-da0e98840e7c', '95fd053e-dffd-4547-83a9-0a5a9695d273', '9d5b132c-d4d2-4ee0-b231-f927f37c7c61', NULL, NULL, 'ORD-2025-0012', 'paid', 205.01, 36.90, 0.00, 241.91, 0.00, NULL, '2025-11-19 23:25:51.515174', '2025-11-19 23:50:37.000000'),
('4517c658-77ed-47a9-8ef9-0803e156d768', '95fd053e-dffd-4547-83a9-0a5a9695d273', '1bd25a63-698e-4c8a-ac8a-a01b6e77ae70', NULL, NULL, 'ORD-2025-0038', 'pending', 2.50, 0.45, 0.00, 2.95, 0.00, NULL, '2025-11-20 21:25:08.477622', '2025-11-20 21:25:08.477622'),
('48f867f1-0eec-4763-a079-1f4e51657f33', '95fd053e-dffd-4547-83a9-0a5a9695d273', '7d343e60-18a2-4d9d-9a31-874c363c6958', NULL, NULL, 'ORD-2025-0004', 'paid', 5.03, 0.91, 0.00, 5.03, 0.01, NULL, '2025-11-19 23:07:37.452733', '2025-11-19 23:50:28.000000'),
('4935f506-fb54-44ba-a2e2-5f3dd1642376', '95fd053e-dffd-4547-83a9-0a5a9695d273', '0ff66842-e103-479b-983c-c447df204621', NULL, NULL, 'ORD-2025-0025', 'pending', 20.04, 3.61, 0.00, 20.04, 0.00, NULL, '2025-11-20 00:51:49.961227', '2025-11-20 00:52:02.000000'),
('562c70d1-3af1-432a-a159-7cfe98f13979', '95fd053e-dffd-4547-83a9-0a5a9695d273', '022aa892-930b-4704-877c-5410cc1da4cb', NULL, NULL, 'ORD-2025-0033', 'cancelled', 10.00, 1.80, 0.00, 11.80, 0.00, NULL, '2025-11-20 21:18:01.167001', '2025-11-20 21:24:21.000000'),
('5e7c0ab6-7378-4081-9fc3-518d86a3aeac', '95fd053e-dffd-4547-83a9-0a5a9695d273', '48b2b493-f1b6-465f-877d-7e161263864d', NULL, NULL, 'ORD-2025-0005', 'paid', 0.00, 0.00, 0.00, 0.00, 0.00, NULL, '2025-11-19 23:08:36.548379', '2025-11-20 20:50:11.000000'),
('6fa12397-0074-4ece-935e-ce28e9f1e27d', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'dce80f77-15f7-443a-b7a4-08d53ab5d40d', NULL, NULL, 'ORD-2025-0001', 'paid', 325.01, 58.50, 0.00, 383.51, 0.00, NULL, '2025-11-19 22:56:48.796656', '2025-11-19 23:50:04.000000'),
('7007f1f0-d646-4d54-aa8d-67e2a607028d', '95fd053e-dffd-4547-83a9-0a5a9695d273', '0ff66842-e103-479b-983c-c447df204621', NULL, NULL, 'ORD-2025-0015', 'paid', 215.07, 38.71, 0.00, 253.78, 0.00, NULL, '2025-11-19 23:46:40.257739', '2025-11-19 23:50:34.000000'),
('71dff258-6018-4cc8-99aa-1b19e2f06400', '95fd053e-dffd-4547-83a9-0a5a9695d273', '1bd25a63-698e-4c8a-ac8a-a01b6e77ae70', NULL, NULL, 'ORD-2025-0017', 'paid', 19.04, 3.43, 0.00, 19.04, 0.00, NULL, '2025-11-20 00:04:41.708614', '2025-11-20 20:50:39.000000'),
('74e68e65-5009-4abf-87e3-a947106d0d05', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'ca60403e-815e-457a-868d-ff2744214f63', NULL, NULL, 'ORD-2025-0027', 'paid', 0.00, 0.00, 0.00, 0.00, 0.00, NULL, '2025-11-20 18:54:49.519947', '2025-11-20 20:50:25.000000'),
('760a68b3-0f63-40b5-b9da-981de0c5ca56', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'e693dbda-c148-4f07-8ecf-eee119a27c79', NULL, NULL, 'ORD-2025-0018', 'paid', 10.00, 1.80, 0.00, 11.80, 0.00, NULL, '2025-11-20 00:11:13.522350', '2025-11-20 19:57:42.000000'),
('811ab02d-9372-4701-8685-3f2533fecdd2', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'e693dbda-c148-4f07-8ecf-eee119a27c79', NULL, NULL, 'ORD-2025-0034', 'paid', 0.01, 0.00, 0.00, 0.01, 0.00, NULL, '2025-11-20 21:18:18.071015', '2025-11-20 21:24:30.000000'),
('82e15b01-6e49-4406-8b78-a2b9e0efcd61', '95fd053e-dffd-4547-83a9-0a5a9695d273', '8d2af9ac-9699-41db-a537-0ed3d3dbde09', NULL, NULL, 'ORD-2025-0021', 'paid', 5.01, 0.90, 0.00, 5.01, 0.01, NULL, '2025-11-20 00:35:48.632050', '2025-11-20 19:57:36.000000'),
('8a394ae7-7838-493b-8c90-d2aad48e9cdc', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'e908abc8-067c-439c-8e39-d4c58bb7f7a9', NULL, NULL, 'ORD-2025-0036', 'paid', 5.00, 0.90, 0.00, 5.90, 0.01, NULL, '2025-11-20 21:19:50.966653', '2025-11-20 21:24:39.000000'),
('8e87d377-69c1-4a83-9a10-0f1ed8e13ba3', '95fd053e-dffd-4547-83a9-0a5a9695d273', '8efec112-57d8-46f3-9386-f4e4dad3dc6b', NULL, NULL, 'ORD-2025-0008', 'paid', 10.00, 1.80, 0.00, 11.80, 0.00, NULL, '2025-11-19 23:11:03.728943', '2025-11-19 23:50:12.000000'),
('8fc29c37-b74d-4659-9b18-5b8943c6ae1f', '95fd053e-dffd-4547-83a9-0a5a9695d273', '3114430f-cc65-455c-b1d8-7ac5da7b7f59', NULL, NULL, 'ORD-2025-0011', 'paid', 0.00, 0.00, 0.00, 0.00, 0.00, NULL, '2025-11-19 23:22:13.597929', '2025-11-20 19:57:47.000000'),
('975aa529-0bc1-4dfe-8181-4ef70bf0ae42', '95fd053e-dffd-4547-83a9-0a5a9695d273', '022aa892-930b-4704-877c-5410cc1da4cb', NULL, NULL, 'ORD-2025-0022', 'paid', 62.54, 11.26, 0.00, 62.54, 0.01, NULL, '2025-11-20 00:36:13.886243', '2025-11-20 18:55:56.000000'),
('a40a83e6-fc42-4a29-93a7-1a2ac908c68f', '95fd053e-dffd-4547-83a9-0a5a9695d273', '1bd25a63-698e-4c8a-ac8a-a01b6e77ae70', NULL, NULL, 'ORD-2025-0009', 'paid', 60.01, 10.80, 0.00, 70.81, 0.01, NULL, '2025-11-19 23:13:58.937832', '2025-11-19 23:50:25.000000'),
('abb452fc-1df0-4802-ad37-0c22615ed3bf', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'ca60403e-815e-457a-868d-ff2744214f63', NULL, NULL, 'ORD-2025-0013', 'paid', 80.01, 14.40, 0.00, 94.41, 0.01, NULL, '2025-11-19 23:34:58.774482', '2025-11-19 23:35:16.000000'),
('ad37b88d-3ea3-464f-bcc2-d68b5fecec93', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'dce80f77-15f7-443a-b7a4-08d53ab5d40d', NULL, NULL, 'ORD-2025-0048', 'pending', 5.00, 0.90, 0.00, 5.00, 0.00, NULL, '2025-11-20 22:09:28.974445', '2025-11-20 22:09:32.000000'),
('b2ea6fb8-a0fa-4084-a9ee-be5bd3564b3b', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'e693dbda-c148-4f07-8ecf-eee119a27c79', NULL, NULL, 'ORD-2025-0042', 'pending', 10.00, 1.80, 0.00, 11.80, 0.00, NULL, '2025-11-20 21:37:49.241032', '2025-11-20 21:37:52.000000'),
('b8e325e0-aa5b-454a-8f4f-d4cf3b0cd368', '95fd053e-dffd-4547-83a9-0a5a9695d273', '7d343e60-18a2-4d9d-9a31-874c363c6958', NULL, NULL, 'ORD-2025-0024', 'paid', 0.01, 0.00, 0.00, 0.01, 0.01, NULL, '2025-11-20 00:41:47.193362', '2025-11-20 21:17:46.000000'),
('bc40052c-7845-4c41-a60d-430ba254dc96', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'dce80f77-15f7-443a-b7a4-08d53ab5d40d', NULL, NULL, 'ORD-2025-0019', 'paid', 267.33, 48.12, 0.00, 315.45, 0.00, NULL, '2025-11-20 00:15:28.323298', '2025-11-20 18:55:43.000000'),
('cd6b1b82-9305-4b3e-a08a-1cb3ef10b067', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'ca60403e-815e-457a-868d-ff2744214f63', NULL, NULL, 'ORD-2025-0014', 'paid', 128.05, 23.05, 0.00, 151.10, 0.00, NULL, '2025-11-19 23:39:49.985596', '2025-11-20 00:02:11.000000'),
('cdf5904e-d95d-4e07-bc2d-21919b919642', '95fd053e-dffd-4547-83a9-0a5a9695d273', '022aa892-930b-4704-877c-5410cc1da4cb', NULL, NULL, 'ORD-2025-0030', 'paid', 0.01, 0.00, 0.00, 0.01, 0.00, NULL, '2025-11-20 19:53:09.729308', '2025-11-20 19:57:28.000000'),
('d29a1ba7-1608-4a76-b705-2095df0c01c2', '95fd053e-dffd-4547-83a9-0a5a9695d273', '9d5b132c-d4d2-4ee0-b231-f927f37c7c61', NULL, NULL, 'ORD-2025-0020', 'paid', 5.02, 0.90, 0.00, 5.02, 0.01, NULL, '2025-11-20 00:22:15.555731', '2025-11-20 19:57:44.000000'),
('d38192c2-7b89-4554-8e43-65d3fa72a3ff', '95fd053e-dffd-4547-83a9-0a5a9695d273', '022aa892-930b-4704-877c-5410cc1da4cb', NULL, NULL, 'ORD-2025-0006', 'paid', 5.00, 0.90, 0.00, 5.90, 0.01, NULL, '2025-11-19 23:09:01.139706', '2025-11-19 23:50:22.000000'),
('d67361c7-7a43-41dc-933a-3254ddf783fb', '95fd053e-dffd-4547-83a9-0a5a9695d273', '7d343e60-18a2-4d9d-9a31-874c363c6958', NULL, NULL, 'ORD-2025-0045', 'pending', 5.03, 0.90, 0.00, 5.03, 0.00, NULL, '2025-11-20 21:39:42.894929', '2025-11-20 21:39:47.000000'),
('d8030d1e-1b35-473e-9152-92413de83a90', '95fd053e-dffd-4547-83a9-0a5a9695d273', '3114430f-cc65-455c-b1d8-7ac5da7b7f59', NULL, NULL, 'ORD-2025-0039', 'pending', 5.00, 0.90, 0.00, 5.90, 0.00, NULL, '2025-11-20 21:26:06.190522', '2025-11-20 21:26:06.190522'),
('d8094df5-d5e1-4591-ac48-085a01f125fe', '95fd053e-dffd-4547-83a9-0a5a9695d273', '9d5b132c-d4d2-4ee0-b231-f927f37c7c61', NULL, NULL, 'ORD-2025-0043', 'pending', 5.00, 0.90, 0.00, 5.90, 0.00, NULL, '2025-11-20 21:38:10.202135', '2025-11-20 21:38:12.000000'),
('e08dae62-ab51-403a-b048-07b9281acd0b', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'dce80f77-15f7-443a-b7a4-08d53ab5d40d', NULL, NULL, 'ORD-2025-0031', 'paid', 2.50, 0.45, 0.00, 2.50, 0.00, NULL, '2025-11-20 20:12:27.420069', '2025-11-20 21:24:34.000000'),
('f6b4355a-aac4-437a-9f7b-f4689f8e24e3', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'dce80f77-15f7-443a-b7a4-08d53ab5d40d', NULL, NULL, 'ORD-2025-0040', 'paid', 19.03, 3.43, 0.00, 22.46, 0.00, NULL, '2025-11-20 21:30:29.372676', '2025-11-20 21:47:27.000000'),
('f784db2a-ffcc-4f5d-aa48-02646049ea7a', '95fd053e-dffd-4547-83a9-0a5a9695d273', '0d48b45d-6bd5-49d2-9ad8-781caaca9642', NULL, NULL, 'ORD-2025-0044', 'pending', 5.00, 0.90, 0.00, 5.90, 0.00, NULL, '2025-11-20 21:38:21.281639', '2025-11-20 21:38:21.281639'),
('fb672de5-efbb-4850-baf7-4634befbd491', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'e908abc8-067c-439c-8e39-d4c58bb7f7a9', NULL, NULL, 'ORD-2025-0046', 'pending', 5.01, 0.90, 0.00, 5.01, 0.00, NULL, '2025-11-20 21:53:35.845275', '2025-11-20 21:53:37.000000'),
('fc5e87b7-7837-4cce-855e-4b5b2370246a', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'e693dbda-c148-4f07-8ecf-eee119a27c79', NULL, NULL, 'ORD-2025-0010', 'paid', 870.01, 156.60, 0.00, 1026.61, 0.00, NULL, '2025-11-19 23:14:53.999013', '2025-11-19 23:50:19.000000');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `order_items`
--

CREATE TABLE `order_items` (
  `id` varchar(36) NOT NULL,
  `orderId` varchar(255) NOT NULL,
  `productId` varchar(255) NOT NULL,
  `productName` varchar(255) NOT NULL,
  `unitPrice` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `total` decimal(10,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `order_items`
--

INSERT INTO `order_items` (`id`, `orderId`, `productId`, `productName`, `unitPrice`, `quantity`, `total`, `notes`, `createdAt`, `updatedAt`) VALUES
('01de0563-2eed-413a-87cf-13d154645e35', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '9d137d40-5a17-4cb7-b40c-b429307f1c29', 'Black Burger Toyuq', 4.00, 4, 16.00, NULL, '2025-11-19 23:47:18.009901', '2025-11-19 23:48:31.000000'),
('0266176a-551e-4407-a2d5-512f30045421', '7007f1f0-d646-4d54-aa8d-67e2a607028d', 'a60ae1b7-31f2-4d7c-af66-7d7b7aaacb64', 'Pepperoni Pizza', 9.50, 1, 9.50, NULL, '2025-11-19 23:47:27.491939', '2025-11-19 23:47:27.491939'),
('0322dea4-9aeb-4b18-96e1-6d764ff5bc8e', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '5c7fa6ec-2b12-4ec0-8e8f-51388b40588e', 'Tavuklu Pide', 6.50, 1, 6.50, NULL, '2025-11-19 23:47:37.057945', '2025-11-19 23:47:37.057945'),
('03ed865d-ff2b-42f4-8f49-8e2f81a1a497', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-19 23:47:28.509100', '2025-11-19 23:47:28.509100'),
('04951dfd-7e29-459b-8810-d012a2734413', 'fc5e87b7-7837-4cce-855e-4b5b2370246a', '99a960cc-9f42-4fda-8b2d-ed8d60cd7bdf', 'OKA', 5.00, 10, 50.00, NULL, '2025-11-19 23:14:54.729723', '2025-11-19 23:21:37.000000'),
('063e1857-ad61-420c-88f5-9d83d7e8c0c4', '214d1f23-0f0d-4a83-b9c0-baabd7ec0964', 'e1580ead-44e7-4d64-aee9-41f2dc162019', 'hhh', 5.00, 1, 5.00, NULL, '2025-11-20 21:31:28.285088', '2025-11-20 21:31:28.285088'),
('07684ac5-dc48-4d0d-9e58-fb8def56df9e', 'd8030d1e-1b35-473e-9152-92413de83a90', 'e1580ead-44e7-4d64-aee9-41f2dc162019', 'hhh', 5.00, 1, 5.00, NULL, '2025-11-20 21:26:06.212085', '2025-11-20 21:26:06.212085'),
('09e1031f-5a45-437d-9d2b-98af939988b8', 'bc40052c-7845-4c41-a60d-430ba254dc96', 'e6e84ee6-89c0-49d8-b7f9-5db2ab1eb89c', 'Qapalı Burger', 5.00, 2, 10.00, NULL, '2025-11-20 18:36:49.291555', '2025-11-20 18:37:12.000000'),
('0a51dbc3-ed93-484f-a920-59b3a34dee49', 'bc40052c-7845-4c41-a60d-430ba254dc96', 'e9b45443-e08c-45ce-b4ca-82242284a692', 'Şef Burger', 5.00, 4, 20.00, NULL, '2025-11-20 18:31:23.949385', '2025-11-20 18:37:12.000000'),
('0b2621ef-d98e-47fa-89cf-83230d3866e8', '71dff258-6018-4cc8-99aa-1b19e2f06400', '6c2a8faa-ac72-47c2-807b-9cd32440fb42', 'Çikolatalı Dondurma', 5.00, 3, 15.00, NULL, '2025-11-20 19:58:14.402860', '2025-11-20 19:58:21.000000'),
('0b58e357-021b-42c5-8397-5fbb7b16576d', '4935f506-fb54-44ba-a2e2-5f3dd1642376', '9d137d40-5a17-4cb7-b40c-b429307f1c29', 'Black Burger Toyuq', 4.00, 1, 4.00, NULL, '2025-11-20 00:52:02.580147', '2025-11-20 00:52:02.580147'),
('0b92f3c9-81b0-4da1-b9f6-36cb12f89d2d', '2d992f85-5edf-4362-921c-900eed2b165d', 'b8589d85-df98-4d0e-b131-4528ae29ec35', 'Espresso', 3.50, 1, 3.50, NULL, '2025-11-20 01:22:27.138859', '2025-11-20 01:22:27.138859'),
('0c15bc79-9bb6-49cf-a176-c72beffd8345', '71dff258-6018-4cc8-99aa-1b19e2f06400', '14c23a20-df63-4669-beb3-fbf251b18ff8', 'Cappuccino', 4.00, 2, 8.00, NULL, '2025-11-20 20:00:06.562474', '2025-11-20 20:00:08.000000'),
('0c8fdba4-b2f5-48f8-afbd-f3df65e9fe84', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '93f15745-9164-422e-b9d5-0274f983ca10', 'Cheese Burger', 3.90, 1, 3.90, NULL, '2025-11-19 23:48:31.009007', '2025-11-19 23:48:31.009007'),
('0e355018-602d-4567-933c-e642766003dd', '0a758758-bd65-41ce-a593-6bba22b9ed82', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-20 18:56:42.827402', '2025-11-20 18:56:42.827402'),
('1167c4a8-53ff-49da-8a96-76dee9a3e770', '4935f506-fb54-44ba-a2e2-5f3dd1642376', 'b589ebf8-2b02-42bd-9085-dd7d53bd0224', 'Margherita Pizza', 8.50, 1, 8.50, NULL, '2025-11-20 00:52:00.813197', '2025-11-20 00:52:00.813197'),
('11f5883d-2323-4db1-91cb-256390e8e8fc', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '5a81a5d8-7d6e-40d6-bc26-da8e89bfe39e', 'Black Burger MAL', 4.50, 1, 4.50, NULL, '2025-11-20 00:03:14.888190', '2025-11-20 00:03:14.888190'),
('13536337-70ed-41d2-93c2-5817485658ac', 'bc40052c-7845-4c41-a60d-430ba254dc96', '8a50e378-79cc-4da8-912b-5bdc879b58cf', 'Vanilyalı Dondurma', 5.00, 5, 25.00, NULL, '2025-11-20 18:36:44.155462', '2025-11-20 18:36:51.000000'),
('14441c1d-2933-495c-94ea-d28cd54ef6bb', '4935f506-fb54-44ba-a2e2-5f3dd1642376', 'dbc0e029-aa92-4989-93de-69e46a6b8f46', 'Limonata', 3.50, 1, 3.50, NULL, '2025-11-20 00:51:54.591152', '2025-11-20 00:51:54.591152'),
('1668dd1f-106c-4676-b543-fa31a8397330', '31ff0b36-3cd1-4093-b6e6-70b6acbbb654', '8a50e378-79cc-4da8-912b-5bdc879b58cf', 'Vanilyalı Dondurma', 5.00, 2, 10.00, NULL, '2025-11-20 19:53:56.418944', '2025-11-20 19:54:02.000000'),
('16d68b39-5509-4e2a-859d-0be01a3b984e', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-19 23:47:10.924136', '2025-11-19 23:47:10.924136'),
('185422a0-aa25-4725-a6bb-345b0d8f0510', '4935f506-fb54-44ba-a2e2-5f3dd1642376', '6c2a8faa-ac72-47c2-807b-9cd32440fb42', 'Çikolatalı Dondurma', 5.00, 3, 15.00, NULL, '2025-11-20 00:51:52.012108', '2025-11-20 00:51:53.000000'),
('1a4ecc1d-2c7d-447a-a913-6846c9960c1c', 'bc40052c-7845-4c41-a60d-430ba254dc96', '987e5ed7-4783-471b-8863-a017a37491c0', 'ŞAURMA ROLL', 3.50, 1, 3.50, NULL, '2025-11-20 18:37:14.025709', '2025-11-20 18:37:14.025709'),
('1adf5aff-f660-436b-ac18-73a56822d328', 'abb452fc-1df0-4802-ad37-0c22615ed3bf', '42182cf0-2fc2-4a24-9ed7-02c54dd1b1e8', '50', 25.00, 3, 75.00, NULL, '2025-11-19 23:34:58.790584', '2025-11-19 23:35:07.000000'),
('1befab62-1a1d-4aa3-9c66-5945df9f7163', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-19 23:47:38.351910', '2025-11-19 23:47:38.351910'),
('1c07468d-7e92-4ca7-97ac-e95bd1702f98', '7007f1f0-d646-4d54-aa8d-67e2a607028d', 'e6e84ee6-89c0-49d8-b7f9-5db2ab1eb89c', 'Qapalı Burger', 5.00, 4, 20.00, NULL, '2025-11-19 23:47:24.971639', '2025-11-19 23:48:32.000000'),
('1c620558-bb88-4f04-b86a-aa1b00bcf739', '31ff0b36-3cd1-4093-b6e6-70b6acbbb654', '0e1d85de-44d9-4505-b675-a7b0b19c3f18', 'Latte', 4.50, 1, 4.50, NULL, '2025-11-20 19:54:12.901862', '2025-11-20 19:54:12.901862'),
('1c8d90c8-071a-4583-870f-eef3f61c24ab', '2d992f85-5edf-4362-921c-900eed2b165d', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-20 01:22:24.923959', '2025-11-20 01:22:24.923959'),
('1d69b62d-29e4-4fa9-a474-fb76feddf77c', '31ff0b36-3cd1-4093-b6e6-70b6acbbb654', '7b7e7bd4-fc95-4da8-a913-7e67cb418434', 'Çay', 2.00, 2, 4.00, NULL, '2025-11-20 19:54:00.837902', '2025-11-20 19:54:11.000000'),
('1e1876e5-7db0-42f1-b2f0-52c67c5d1c6a', '2d992f85-5edf-4362-921c-900eed2b165d', 'dbc0e029-aa92-4989-93de-69e46a6b8f46', 'Limonata', 3.50, 1, 3.50, NULL, '2025-11-20 01:19:22.396080', '2025-11-20 01:19:22.396080'),
('1e1fbb75-868e-4885-ab30-e9c3fe58f96c', 'bc40052c-7845-4c41-a60d-430ba254dc96', 'be173ebf-05b6-4b58-b9fc-0d34b84960d3', 'Mojito', 8.00, 2, 16.00, NULL, '2025-11-20 18:36:54.710902', '2025-11-20 18:37:00.000000'),
('200f08ee-bd57-48eb-b2bc-6f97ece52dd7', '975aa529-0bc1-4dfe-8181-4ef70bf0ae42', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-20 00:56:10.328046', '2025-11-20 00:56:10.328046'),
('201ccbe5-ef89-4ebc-be73-23059c14408e', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', 'fd539fa4-b3e7-4835-9a2c-9f7df4eb1125', 'Sezar Salata', 7.50, 1, 7.50, NULL, '2025-11-20 00:03:22.297025', '2025-11-20 00:03:22.297025'),
('20bdbacb-7d13-4a11-a0d0-b0d7161fa59b', '7007f1f0-d646-4d54-aa8d-67e2a607028d', 'b589ebf8-2b02-42bd-9085-dd7d53bd0224', 'Margherita Pizza', 8.50, 1, 8.50, NULL, '2025-11-19 23:47:27.725301', '2025-11-19 23:47:27.725301'),
('21d5d04b-a995-4e5c-ba43-ccf5c1da42a1', 'bc40052c-7845-4c41-a60d-430ba254dc96', '5a81a5d8-7d6e-40d6-bc26-da8e89bfe39e', 'Black Burger MAL', 4.50, 3, 13.50, NULL, '2025-11-20 18:31:24.794636', '2025-11-20 18:37:13.000000'),
('22012f50-4f11-4263-99f6-6e50a14f2710', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '93f15745-9164-422e-b9d5-0274f983ca10', 'Cheese Burger', 3.90, 1, 3.90, NULL, '2025-11-19 23:47:18.991073', '2025-11-19 23:47:18.991073'),
('2542e218-cfe5-4090-90bb-a6d5e0f349bf', 'bc40052c-7845-4c41-a60d-430ba254dc96', 'b589ebf8-2b02-42bd-9085-dd7d53bd0224', 'Margherita Pizza', 8.50, 1, 8.50, NULL, '2025-11-20 18:37:10.912918', '2025-11-20 18:37:10.912918'),
('25f6d5c0-8903-47f0-9bca-24e4fea4e298', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '93f15745-9164-422e-b9d5-0274f983ca10', 'Cheese Burger', 3.90, 1, 3.90, NULL, '2025-11-19 23:47:18.649572', '2025-11-19 23:47:18.649572'),
('28898255-bac1-4463-a89c-95198aa2cacf', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-20 00:03:36.789572', '2025-11-20 00:03:36.789572'),
('2a542ac7-bc9b-4655-b6a4-180b71d947c5', 'bc40052c-7845-4c41-a60d-430ba254dc96', 'fd539fa4-b3e7-4835-9a2c-9f7df4eb1125', 'Sezar Salata', 7.50, 1, 7.50, NULL, '2025-11-20 18:36:59.279051', '2025-11-20 18:36:59.279051'),
('2babdfed-3b70-419b-a6d2-f9e1422554d6', 'bc40052c-7845-4c41-a60d-430ba254dc96', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 2, 21.00, NULL, '2025-11-20 18:31:23.058464', '2025-11-20 18:37:10.000000'),
('2bc75a13-8e98-4280-a916-4482cca98195', 'bc40052c-7845-4c41-a60d-430ba254dc96', '6c2a8faa-ac72-47c2-807b-9cd32440fb42', 'Çikolatalı Dondurma', 5.00, 9, 45.00, NULL, '2025-11-20 18:36:43.467437', '2025-11-20 18:36:52.000000'),
('2c511d7d-0b9a-4b05-8d1c-a71389a19668', 'bc40052c-7845-4c41-a60d-430ba254dc96', 'd27041bd-75ea-4f29-a8fa-c953e835a38f', 'Sıcak Çikolata', 4.00, 2, 8.00, NULL, '2025-11-20 18:36:55.049085', '2025-11-20 18:36:59.000000'),
('2c87fabe-98df-4975-a214-d1d2431b2e8d', 'e08dae62-ab51-403a-b048-07b9281acd0b', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 2, 5.00, NULL, '2025-11-20 20:42:48.839152', '2025-11-20 20:46:18.000000'),
('2fb39af5-7c7e-4b0d-8d6c-73bc869ab82d', '5e7c0ab6-7378-4081-9fc3-518d86a3aeac', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-20 20:50:10.143125', '2025-11-20 20:50:10.143125'),
('30371f75-4355-421d-86b3-a6e0928deaa4', 'd67361c7-7a43-41dc-933a-3254ddf783fb', '6c2a8faa-ac72-47c2-807b-9cd32440fb42', 'Çikolatalı Dondurma', 5.00, 1, 5.00, NULL, '2025-11-20 21:39:47.265416', '2025-11-20 21:39:47.265416'),
('32974acd-b430-4a70-9ec9-46e62fc5dd27', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '5a81a5d8-7d6e-40d6-bc26-da8e89bfe39e', 'Black Burger MAL', 4.50, 1, 4.50, NULL, '2025-11-19 23:48:32.174427', '2025-11-19 23:48:32.174427'),
('32cec89f-293f-48c6-abb0-c97dad304e9c', '7007f1f0-d646-4d54-aa8d-67e2a607028d', 'ee1cf870-0a6e-42f6-a9f5-be27645bb0aa', 'Portakal Suyu', 4.00, 1, 4.00, NULL, '2025-11-19 23:46:42.731972', '2025-11-19 23:46:42.731972'),
('33195d40-83b6-4bcb-a818-87648bf1148a', 'ad37b88d-3ea3-464f-bcc2-d68b5fecec93', 'ee1cf870-0a6e-42f6-a9f5-be27645bb0aa', 'Portakal Suyu', 4.00, 1, 4.00, NULL, '2025-11-20 22:09:32.619068', '2025-11-20 22:09:32.619068'),
('35b83af0-f205-4488-9391-e583ccf30cfb', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-19 23:47:38.925973', '2025-11-19 23:47:38.925973'),
('3669a015-76c0-4ad0-8ab3-1a268f389893', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '5c7fa6ec-2b12-4ec0-8e8f-51388b40588e', 'Tavuklu Pide', 6.50, 1, 6.50, NULL, '2025-11-19 23:47:33.482209', '2025-11-19 23:47:33.482209'),
('38244efb-1517-4817-abdd-3bed1a674c7c', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-19 23:47:38.147190', '2025-11-19 23:47:38.147190'),
('382a044a-ea84-4220-8d9a-a6a459f10058', '2d992f85-5edf-4362-921c-900eed2b165d', '0e1d85de-44d9-4505-b675-a7b0b19c3f18', 'Latte', 4.50, 1, 4.50, NULL, '2025-11-20 01:22:26.851051', '2025-11-20 01:22:26.851051'),
('38899473-cd45-40a6-a86c-06e2398d95a0', '71dff258-6018-4cc8-99aa-1b19e2f06400', '8a50e378-79cc-4da8-912b-5bdc879b58cf', 'Vanilyalı Dondurma', 5.00, 2, 10.00, NULL, '2025-11-20 19:58:16.324362', '2025-11-20 19:58:23.000000'),
('38af4469-d1c6-4fd9-9b0b-6bb855d1b2ba', '0a758758-bd65-41ce-a593-6bba22b9ed82', '8a50e378-79cc-4da8-912b-5bdc879b58cf', 'Vanilyalı Dondurma', 5.00, 1, 5.00, NULL, '2025-11-20 18:56:55.912586', '2025-11-20 18:56:55.912586'),
('38e86b5b-ca32-42e6-af0e-5424c91e6450', 'f784db2a-ffcc-4f5d-aa48-02646049ea7a', 'fac9e673-c726-421e-92a5-91d9b66c6bfa', 'OKAkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkbggggggggggggggggggggg', 5.00, 1, 5.00, NULL, '2025-11-20 21:38:21.323361', '2025-11-20 21:38:21.323361'),
('391b9319-c322-4c59-83b8-770d8de15fa4', 'bc40052c-7845-4c41-a60d-430ba254dc96', 'b8589d85-df98-4d0e-b131-4528ae29ec35', 'Espresso', 3.50, 1, 3.50, NULL, '2025-11-20 18:36:56.938659', '2025-11-20 18:36:56.938659'),
('392cd61e-2917-41b7-a47b-2a14de1bbd6f', '8fc29c37-b74d-4659-9b18-5b8943c6ae1f', '0e1d85de-44d9-4505-b675-a7b0b19c3f18', 'Latte', 4.50, 1, 4.50, NULL, '2025-11-20 19:02:08.150028', '2025-11-20 19:02:08.150028'),
('3a35d409-5922-43cf-bddd-9822f219e8c3', '48f867f1-0eec-4763-a079-1f4e51657f33', '6c2a8faa-ac72-47c2-807b-9cd32440fb42', 'Çikolatalı Dondurma', 5.00, 1, 5.00, NULL, '2025-11-19 23:49:06.412075', '2025-11-19 23:49:06.412075'),
('3ba4a193-5f30-46cb-b354-23e251bfd367', '2d992f85-5edf-4362-921c-900eed2b165d', 'ee1cf870-0a6e-42f6-a9f5-be27645bb0aa', 'Portakal Suyu', 4.00, 1, 4.00, NULL, '2025-11-20 01:22:25.203224', '2025-11-20 01:22:25.203224'),
('3cab98e2-fafa-445f-a707-71358a184d04', 'd67361c7-7a43-41dc-933a-3254ddf783fb', '8a50e378-79cc-4da8-912b-5bdc879b58cf', 'Vanilyalı Dondurma', 5.00, 1, 5.00, NULL, '2025-11-20 21:39:45.890587', '2025-11-20 21:39:45.890587'),
('3cd319f2-593d-4b1c-8c2b-eb9210371b42', '8fc29c37-b74d-4659-9b18-5b8943c6ae1f', 'dbc0e029-aa92-4989-93de-69e46a6b8f46', 'Limonata', 3.50, 1, 3.50, NULL, '2025-11-20 19:02:04.865425', '2025-11-20 19:02:04.865425'),
('3cfb9ad8-b5d7-4584-bf85-8f1591cb15c8', 'd67361c7-7a43-41dc-933a-3254ddf783fb', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-20 21:39:48.326254', '2025-11-20 21:39:48.326254'),
('3e8d908e-3aea-4ac7-89a1-63282ac293d9', '975aa529-0bc1-4dfe-8181-4ef70bf0ae42', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 2, 5.00, NULL, '2025-11-20 00:36:15.362668', '2025-11-20 00:55:53.000000'),
('3ec0e5b4-2801-47bd-ba94-ac3f6ab3df29', '31ff0b36-3cd1-4093-b6e6-70b6acbbb654', 'ee1cf870-0a6e-42f6-a9f5-be27645bb0aa', 'Portakal Suyu', 4.00, 1, 4.00, NULL, '2025-11-20 19:54:05.860949', '2025-11-20 19:54:05.860949'),
('40bb92c6-c5ac-4c97-b626-ff1f41adeaa1', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '5c7fa6ec-2b12-4ec0-8e8f-51388b40588e', 'Tavuklu Pide', 6.50, 1, 6.50, NULL, '2025-11-19 23:47:34.197048', '2025-11-19 23:47:34.197048'),
('41015288-1f1d-4d05-95ee-3c9b20289052', '71dff258-6018-4cc8-99aa-1b19e2f06400', '42182cf0-2fc2-4a24-9ed7-02c54dd1b1e8', '50', 25.00, 1, 25.00, NULL, '2025-11-20 20:01:13.202267', '2025-11-20 20:01:13.202267'),
('412e5c60-6ff4-44b2-847c-66e59a37b3bc', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-20 00:03:36.194065', '2025-11-20 00:03:36.194065'),
('4253e3fd-eabe-4751-a15d-5300140b1c32', '2d992f85-5edf-4362-921c-900eed2b165d', 'be173ebf-05b6-4b58-b9fc-0d34b84960d3', 'Mojito', 8.00, 1, 8.00, NULL, '2025-11-20 01:22:26.231244', '2025-11-20 01:22:26.231244'),
('42da3386-899e-44e0-a98e-df99ce26f71a', '7007f1f0-d646-4d54-aa8d-67e2a607028d', 'd27041bd-75ea-4f29-a8fa-c953e835a38f', 'Sıcak Çikolata', 4.00, 3, 12.00, NULL, '2025-11-19 23:46:45.053512', '2025-11-19 23:47:42.000000'),
('42f9d3f5-a872-4104-97c5-4538461517bc', '82e15b01-6e49-4406-8b78-a2b9e0efcd61', '8a50e378-79cc-4da8-912b-5bdc879b58cf', 'Vanilyalı Dondurma', 5.00, 1, 5.00, NULL, '2025-11-20 00:35:48.691328', '2025-11-20 00:35:48.691328'),
('4314fe3e-0394-4f14-bdf7-6771e004315b', 'e08dae62-ab51-403a-b048-07b9281acd0b', '42182cf0-2fc2-4a24-9ed7-02c54dd1b1e8', '50', 25.00, 1, 25.00, NULL, '2025-11-20 20:53:22.861973', '2025-11-20 20:53:22.861973'),
('4395e658-791b-4291-a4d2-8623850fa461', '2d992f85-5edf-4362-921c-900eed2b165d', '8a50e378-79cc-4da8-912b-5bdc879b58cf', 'Vanilyalı Dondurma', 5.00, 1, 5.00, NULL, '2025-11-20 01:22:24.186231', '2025-11-20 01:22:24.186231'),
('4438b70c-5596-4d45-b0ab-5e8a5a13b7bc', '7007f1f0-d646-4d54-aa8d-67e2a607028d', 'e9b45443-e08c-45ce-b4ca-82242284a692', 'Şef Burger', 5.00, 3, 15.00, NULL, '2025-11-19 23:47:18.306684', '2025-11-19 23:48:33.000000'),
('44b1dd75-0aeb-402a-8ec9-0ec6317f715f', '975aa529-0bc1-4dfe-8181-4ef70bf0ae42', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-20 00:56:10.890829', '2025-11-20 00:56:10.890829'),
('44fec67e-9e15-4dd1-9f5f-74f4b74fd8ac', 'b8e325e0-aa5b-454a-8f4f-d4cf3b0cd368', 'e1580ead-44e7-4d64-aee9-41f2dc162019', 'hhh', 5.00, 1, 5.00, NULL, '2025-11-20 21:17:44.305243', '2025-11-20 21:17:44.305243'),
('455e76fe-3019-4b4a-b6b9-096161ae1a96', '31ff0b36-3cd1-4093-b6e6-70b6acbbb654', 'b8589d85-df98-4d0e-b131-4528ae29ec35', 'Espresso', 3.50, 1, 3.50, NULL, '2025-11-20 19:54:16.399174', '2025-11-20 19:54:16.399174'),
('45e17fc3-d3c8-48a6-ba4f-8821b1df9015', '975aa529-0bc1-4dfe-8181-4ef70bf0ae42', '99a960cc-9f42-4fda-8b2d-ed8d60cd7bdf', 'OKA', 5.00, 1, 5.00, NULL, '2025-11-20 00:56:14.124670', '2025-11-20 00:56:14.124670'),
('48985228-181a-445c-ba17-541439d44fb1', 'f6b4355a-aac4-437a-9f7b-f4689f8e24e3', 'e1580ead-44e7-4d64-aee9-41f2dc162019', 'hhh', 5.00, 3, 15.00, NULL, '2025-11-20 21:30:29.382621', '2025-11-20 21:47:09.000000'),
('4a721b7c-1474-49db-946d-06c46caf1f48', '05a674c8-31fe-4763-bb6c-19011eea1b3e', '9d137d40-5a17-4cb7-b40c-b429307f1c29', 'Black Burger Toyuq', 4.00, 1, 4.00, NULL, '2025-11-20 00:36:48.192402', '2025-11-20 00:36:48.192402'),
('4ab332b6-c6f9-4c22-b494-d01e25cb3d80', 'd67361c7-7a43-41dc-933a-3254ddf783fb', 'fac9e673-c726-421e-92a5-91d9b66c6bfa', 'OKAkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkbggggggggggggggggggggg', 5.00, 1, 5.00, NULL, '2025-11-20 21:39:44.794252', '2025-11-20 21:39:44.794252'),
('4bc2edf8-9eb5-448a-aa69-64fac4ed8af4', '975aa529-0bc1-4dfe-8181-4ef70bf0ae42', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-20 00:56:11.094472', '2025-11-20 00:56:11.094472'),
('4c20e9a9-d695-46cd-9605-307932c797d8', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-19 23:47:27.181123', '2025-11-19 23:47:27.181123'),
('4cd515ce-5a4e-44e0-9c7c-715567795f82', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '7b7e7bd4-fc95-4da8-a913-7e67cb418434', 'Çay', 2.00, 1, 2.00, NULL, '2025-11-19 23:47:42.402865', '2025-11-19 23:47:42.402865'),
('4fc08baf-c5ac-48b9-a660-cba3f775df91', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '5a81a5d8-7d6e-40d6-bc26-da8e89bfe39e', 'Black Burger MAL', 4.50, 1, 4.50, NULL, '2025-11-20 00:03:17.451006', '2025-11-20 00:03:17.451006'),
('5153f9d5-24d4-422b-926b-e4de9ff18933', '2d992f85-5edf-4362-921c-900eed2b165d', '7722aa31-c21c-48cd-9616-7b689e82cd52', 'Mevsim Salatası', 6.00, 1, 6.00, NULL, '2025-11-20 01:22:28.101398', '2025-11-20 01:22:28.101398'),
('5205d81c-6e7f-4e4b-8263-2f503a47f4ba', 'cd6b1b82-9305-4b3e-a08a-1cb3ef10b067', 'be173ebf-05b6-4b58-b9fc-0d34b84960d3', 'Mojito', 8.00, 2, 16.00, NULL, '2025-11-19 23:54:40.805194', '2025-11-19 23:57:59.000000'),
('52d6c1c5-5316-48b6-ab31-cdaee91cb63b', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-19 23:47:28.698640', '2025-11-19 23:47:28.698640'),
('54d4d1b1-7aa9-494a-a8ae-bd75c2dfd2dc', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '4f5925f5-81d3-4ea7-b580-d5cd71627e7f', 'Kıymalı Pide', 7.00, 2, 14.00, NULL, '2025-11-20 00:03:24.045631', '2025-11-20 00:03:32.000000'),
('5512dc56-64d1-4ffc-a8b9-426f5f43c9d5', '760a68b3-0f63-40b5-b9da-981de0c5ca56', '99a960cc-9f42-4fda-8b2d-ed8d60cd7bdf', 'OKA', 5.00, 2, 10.00, NULL, '2025-11-20 00:11:13.539395', '2025-11-20 00:11:16.000000'),
('55857cbf-d987-4fd9-938c-3d217e6445dc', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '4f5925f5-81d3-4ea7-b580-d5cd71627e7f', 'Kıymalı Pide', 7.00, 3, 21.00, NULL, '2025-11-19 23:47:26.314221', '2025-11-19 23:47:40.000000'),
('56e52b2f-ab40-4d3e-a8c7-dce6173ccd97', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', 'be173ebf-05b6-4b58-b9fc-0d34b84960d3', 'Mojito', 8.00, 1, 8.00, NULL, '2025-11-20 00:03:20.079832', '2025-11-20 00:03:20.079832'),
('57e1a06b-1e99-4bf0-8422-d4ab11dd493a', '31ff0b36-3cd1-4093-b6e6-70b6acbbb654', '6c2a8faa-ac72-47c2-807b-9cd32440fb42', 'Çikolatalı Dondurma', 5.00, 1, 5.00, NULL, '2025-11-20 19:54:04.295550', '2025-11-20 19:54:04.295550'),
('5854e4c6-0138-4f1b-8642-0cd80d8a790c', 'f6b4355a-aac4-437a-9f7b-f4689f8e24e3', '6c2a8faa-ac72-47c2-807b-9cd32440fb42', 'Çikolatalı Dondurma', 5.00, 1, 5.00, NULL, '2025-11-20 21:31:14.767936', '2025-11-20 21:31:14.767936'),
('585cd21e-0b0a-4237-a18f-1cb78516d926', 'bc40052c-7845-4c41-a60d-430ba254dc96', '7b7e7bd4-fc95-4da8-a913-7e67cb418434', 'Çay', 2.00, 2, 4.00, NULL, '2025-11-20 18:36:55.708722', '2025-11-20 18:37:01.000000'),
('58d42377-ffb9-4a39-af10-da774dfc5ac6', '82e15b01-6e49-4406-8b78-a2b9e0efcd61', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-20 00:35:51.313659', '2025-11-20 00:35:51.313659'),
('592757e0-fd74-411b-b4d8-e8c39fd9dd93', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '987e5ed7-4783-471b-8863-a017a37491c0', 'ŞAURMA ROLL', 3.50, 1, 3.50, NULL, '2025-11-20 00:03:31.018421', '2025-11-20 00:03:31.018421'),
('599effb3-7308-47dd-8e90-72c32a92da90', '74e68e65-5009-4abf-87e3-a947106d0d05', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-20 20:50:23.844129', '2025-11-20 20:50:23.844129'),
('5b9a63f3-0bc4-49a6-a443-8dd0a4eb623d', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-19 23:47:29.929431', '2025-11-19 23:47:29.929431'),
('5d136987-f9f5-4729-816d-61be1f88fa92', '31ff0b36-3cd1-4093-b6e6-70b6acbbb654', 'be173ebf-05b6-4b58-b9fc-0d34b84960d3', 'Mojito', 8.00, 1, 8.00, NULL, '2025-11-20 19:54:08.809148', '2025-11-20 19:54:08.809148'),
('5f25a060-d56c-4fd1-b13b-ad70ccadf61f', 'e08dae62-ab51-403a-b048-07b9281acd0b', '9d137d40-5a17-4cb7-b40c-b429307f1c29', 'Black Burger Toyuq', 4.00, 1, 4.00, NULL, '2025-11-20 20:53:21.214585', '2025-11-20 20:53:21.214585'),
('5f43e48c-3b25-4fdd-82b6-4e369485db74', 'cd6b1b82-9305-4b3e-a08a-1cb3ef10b067', '7722aa31-c21c-48cd-9616-7b689e82cd52', 'Mevsim Salatası', 6.00, 1, 6.00, NULL, '2025-11-19 23:54:43.855475', '2025-11-19 23:54:43.855475'),
('5f74df2e-48b8-4779-8a05-7ed847fa1802', 'd29a1ba7-1608-4a76-b705-2095df0c01c2', '6c2a8faa-ac72-47c2-807b-9cd32440fb42', 'Çikolatalı Dondurma', 5.00, 1, 5.00, NULL, '2025-11-20 00:22:16.528607', '2025-11-20 00:22:16.528607'),
('60de8f1b-e754-4ac1-ab63-8ebbca4cb04a', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-19 23:47:30.326794', '2025-11-19 23:47:30.326794'),
('60ed0013-d465-41ca-b3a3-e6516bb57c92', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '5c7fa6ec-2b12-4ec0-8e8f-51388b40588e', 'Tavuklu Pide', 6.50, 1, 6.50, NULL, '2025-11-19 23:47:37.395096', '2025-11-19 23:47:37.395096'),
('612c1875-4ff5-46d0-ba0e-486bbee0600d', '71dff258-6018-4cc8-99aa-1b19e2f06400', '7b7e7bd4-fc95-4da8-a913-7e67cb418434', 'Çay', 2.00, 1, 2.00, NULL, '2025-11-20 20:00:02.969885', '2025-11-20 20:00:02.969885'),
('62a84d6c-92b6-4b62-9cd9-93fb6eb95afc', 'bc40052c-7845-4c41-a60d-430ba254dc96', '93f15745-9164-422e-b9d5-0274f983ca10', 'Cheese Burger', 3.90, 4, 15.60, NULL, '2025-11-20 01:26:35.901661', '2025-11-20 18:37:12.000000'),
('62b22cc1-0f3d-4759-a7b8-021e594b25c7', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-20 00:03:37.172840', '2025-11-20 00:03:37.172840'),
('654cd739-12ea-45f4-9cb0-8112a3d77924', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '14c23a20-df63-4669-beb3-fbf251b18ff8', 'Cappuccino', 4.00, 1, 4.00, NULL, '2025-11-20 00:03:21.185006', '2025-11-20 00:03:21.185006'),
('65beb116-66d5-4162-95e3-9a631ab0bdd3', 'd29a1ba7-1608-4a76-b705-2095df0c01c2', '4f61d23b-cb4c-4344-985c-2933684b696c', 'Piña Colada', 9.00, 1, 9.00, NULL, '2025-11-20 00:22:19.480535', '2025-11-20 00:22:19.480535'),
('6963e101-fe36-4700-840d-3eeb0d9fc339', 'd29a1ba7-1608-4a76-b705-2095df0c01c2', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-20 00:22:17.117432', '2025-11-20 00:22:17.117432'),
('69bede0a-8044-4230-bd02-76fb5f02099f', 'ad37b88d-3ea3-464f-bcc2-d68b5fecec93', 'e1580ead-44e7-4d64-aee9-41f2dc162019', 'hhh', 5.00, 1, 5.00, NULL, '2025-11-20 22:09:29.053943', '2025-11-20 22:09:29.053943'),
('6b151d4b-67db-4b88-a1b2-06ea928e33d8', '975aa529-0bc1-4dfe-8181-4ef70bf0ae42', 'ee1cf870-0a6e-42f6-a9f5-be27645bb0aa', 'Portakal Suyu', 4.00, 2, 8.00, NULL, '2025-11-20 00:36:16.207186', '2025-11-20 00:55:53.000000'),
('6d9593d9-0468-491b-abfa-2e3d84cd626c', '2d992f85-5edf-4362-921c-900eed2b165d', '5a81a5d8-7d6e-40d6-bc26-da8e89bfe39e', 'Black Burger MAL', 4.50, 1, 4.50, NULL, '2025-11-20 01:19:14.977039', '2025-11-20 01:19:14.977039'),
('6f29f587-2db6-4791-98de-eacb2bc272c6', 'd38192c2-7b89-4554-8e43-65d3fa72a3ff', '99a960cc-9f42-4fda-8b2d-ed8d60cd7bdf', 'OKA', 5.00, 1, 5.00, NULL, '2025-11-19 23:09:01.146567', '2025-11-19 23:09:01.146567'),
('6f5e73f5-a916-4e8c-acbf-d30c00545c51', 'd29a1ba7-1608-4a76-b705-2095df0c01c2', 'ee1cf870-0a6e-42f6-a9f5-be27645bb0aa', 'Portakal Suyu', 4.00, 1, 4.00, NULL, '2025-11-20 00:22:18.469993', '2025-11-20 00:22:18.469993'),
('6feb0f2b-1cf5-4089-ae49-98d64b602deb', '975aa529-0bc1-4dfe-8181-4ef70bf0ae42', 'dbc0e029-aa92-4989-93de-69e46a6b8f46', 'Limonata', 3.50, 1, 3.50, NULL, '2025-11-20 00:55:53.651247', '2025-11-20 00:55:53.651247'),
('6ff0d9ba-5872-4058-92e3-836c5c136e3f', '975aa529-0bc1-4dfe-8181-4ef70bf0ae42', '8a50e378-79cc-4da8-912b-5bdc879b58cf', 'Vanilyalı Dondurma', 5.00, 3, 15.00, NULL, '2025-11-20 00:36:13.906584', '2025-11-20 00:55:52.000000'),
('70301a42-ff29-4a6c-80c9-c6f6121b0988', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-19 23:47:30.128439', '2025-11-19 23:47:30.128439'),
('70a40b99-4d52-42a6-8a1f-393793f72ad3', 'abb452fc-1df0-4802-ad37-0c22615ed3bf', '99a960cc-9f42-4fda-8b2d-ed8d60cd7bdf', 'OKA', 5.00, 2, 10.00, NULL, '2025-11-19 23:34:59.869231', '2025-11-19 23:35:01.000000'),
('71cf04e0-f0af-475d-9448-18bfb88be2d0', 'cd6b1b82-9305-4b3e-a08a-1cb3ef10b067', '99a960cc-9f42-4fda-8b2d-ed8d60cd7bdf', 'OKA', 5.00, 4, 20.00, NULL, '2025-11-19 23:39:51.278037', '2025-11-19 23:39:54.000000'),
('723c22a9-1d12-4079-af3a-dc40223278c1', 'bc40052c-7845-4c41-a60d-430ba254dc96', '4f5925f5-81d3-4ea7-b580-d5cd71627e7f', 'Kıymalı Pide', 7.00, 2, 14.00, NULL, '2025-11-20 18:31:22.038371', '2025-11-20 18:37:09.000000'),
('731d0564-2a1e-4140-86ce-1462756a0ddc', 'f6b4355a-aac4-437a-9f7b-f4689f8e24e3', 'be173ebf-05b6-4b58-b9fc-0d34b84960d3', 'Mojito', 8.00, 1, 8.00, NULL, '2025-11-20 21:47:14.671653', '2025-11-20 21:47:14.671653'),
('73f6e254-6bdd-4b55-8607-3886963fa238', 'ad37b88d-3ea3-464f-bcc2-d68b5fecec93', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-20 22:09:31.033106', '2025-11-20 22:09:31.033106'),
('753e5dd2-791e-4873-a787-28ce382548d5', 'fb672de5-efbb-4850-baf7-4634befbd491', 'fac9e673-c726-421e-92a5-91d9b66c6bfa', 'OKAkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkbggggggggggggggggggggg', 5.00, 1, 5.00, NULL, '2025-11-20 21:53:37.847501', '2025-11-20 21:53:37.847501'),
('754e2de8-2ba1-401f-aae9-5e4be15fab97', '82e15b01-6e49-4406-8b78-a2b9e0efcd61', 'ee1cf870-0a6e-42f6-a9f5-be27645bb0aa', 'Portakal Suyu', 4.00, 1, 4.00, NULL, '2025-11-20 00:35:50.612151', '2025-11-20 00:35:50.612151'),
('75ff02b4-ca86-4bed-b892-887a6190c4f7', 'b2ea6fb8-a0fa-4084-a9ee-be5bd3564b3b', 'e1580ead-44e7-4d64-aee9-41f2dc162019', 'hhh', 5.00, 2, 10.00, NULL, '2025-11-20 21:37:49.388947', '2025-11-20 21:37:52.000000'),
('7607e978-95c9-419b-9151-2bf0e144ae42', 'd8094df5-d5e1-4591-ac48-085a01f125fe', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 2, 5.00, NULL, '2025-11-20 21:38:10.226396', '2025-11-20 21:38:12.000000'),
('770c869b-43a8-4dd3-ba71-6ff0bbbdf3d0', '7007f1f0-d646-4d54-aa8d-67e2a607028d', 'fd539fa4-b3e7-4835-9a2c-9f7df4eb1125', 'Sezar Salata', 7.50, 1, 7.50, NULL, '2025-11-19 23:46:46.838292', '2025-11-19 23:46:46.838292'),
('7785a019-560f-4ffd-9baf-7f031d30248a', '4935f506-fb54-44ba-a2e2-5f3dd1642376', 'a60ae1b7-31f2-4d7c-af66-7d7b7aaacb64', 'Pepperoni Pizza', 9.50, 1, 9.50, NULL, '2025-11-20 00:52:00.518216', '2025-11-20 00:52:00.518216'),
('78f353a5-d6dd-4e12-be1a-12d88f5ff8ee', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '99a960cc-9f42-4fda-8b2d-ed8d60cd7bdf', 'OKA', 5.00, 4, 20.00, NULL, '2025-11-19 23:47:19.910817', '2025-11-19 23:47:23.000000'),
('7a471bc7-1caa-4575-bd2e-1c07cb58f231', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', 'b589ebf8-2b02-42bd-9085-dd7d53bd0224', 'Margherita Pizza', 8.50, 1, 8.50, NULL, '2025-11-20 00:03:25.243423', '2025-11-20 00:03:25.243423'),
('7b951666-fa9a-4110-9222-97266947f22e', 'bc40052c-7845-4c41-a60d-430ba254dc96', 'a60ae1b7-31f2-4d7c-af66-7d7b7aaacb64', 'Pepperoni Pizza', 9.50, 1, 9.50, NULL, '2025-11-20 18:37:10.434716', '2025-11-20 18:37:10.434716'),
('7e1b5ae8-611e-45a2-b177-a3ef33e9ab39', '8e87d377-69c1-4a83-9a10-0f1ed8e13ba3', '99a960cc-9f42-4fda-8b2d-ed8d60cd7bdf', 'OKA', 5.00, 2, 10.00, NULL, '2025-11-19 23:11:03.737701', '2025-11-19 23:49:46.000000'),
('7ea4e049-2d42-44c8-87e4-04affbf49aa1', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '5c7fa6ec-2b12-4ec0-8e8f-51388b40588e', 'Tavuklu Pide', 6.50, 1, 6.50, NULL, '2025-11-19 23:47:36.853666', '2025-11-19 23:47:36.853666'),
('7f27e148-9e6f-408e-a488-d079b7ac08e5', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', 'e6e84ee6-89c0-49d8-b7f9-5db2ab1eb89c', 'Qapalı Burger', 5.00, 2, 10.00, NULL, '2025-11-20 00:03:14.101478', '2025-11-20 00:03:16.000000'),
('7f781ba6-7534-4c67-91ec-94183169f792', '05a674c8-31fe-4763-bb6c-19011eea1b3e', '6c2a8faa-ac72-47c2-807b-9cd32440fb42', 'Çikolatalı Dondurma', 5.00, 2, 10.00, NULL, '2025-11-20 00:36:39.280461', '2025-11-20 00:36:51.000000'),
('8023d578-6812-4598-9c6c-06ccaca17aea', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '3675ac7e-8556-4e29-bffb-32b4f45fd98b', 'Türk Kahvesi', 3.00, 2, 6.00, NULL, '2025-11-19 23:46:46.525072', '2025-11-19 23:47:14.000000'),
('80d2b004-6f92-4348-978f-15bd9adc06cb', '975aa529-0bc1-4dfe-8181-4ef70bf0ae42', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-20 00:56:10.710853', '2025-11-20 00:56:10.710853'),
('81b14f10-de31-4f31-a8d6-5e0e35f21c2e', '8fc29c37-b74d-4659-9b18-5b8943c6ae1f', 'fd539fa4-b3e7-4835-9a2c-9f7df4eb1125', 'Sezar Salata', 7.50, 1, 7.50, NULL, '2025-11-20 19:02:11.773428', '2025-11-20 19:02:11.773428'),
('81ee453f-8347-4ca3-b676-3cd3101fe7ad', '4935f506-fb54-44ba-a2e2-5f3dd1642376', '7b7e7bd4-fc95-4da8-a913-7e67cb418434', 'Çay', 2.00, 1, 2.00, NULL, '2025-11-20 00:51:56.481289', '2025-11-20 00:51:56.481289'),
('83e828ee-e704-4fe9-9f38-6e4ba4311841', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '42182cf0-2fc2-4a24-9ed7-02c54dd1b1e8', '50', 25.00, 2, 50.00, NULL, '2025-11-19 23:47:19.610106', '2025-11-19 23:47:22.000000'),
('8478bdf7-b6b3-4538-8391-b2988c991b49', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '5c7fa6ec-2b12-4ec0-8e8f-51388b40588e', 'Tavuklu Pide', 6.50, 1, 6.50, NULL, '2025-11-20 00:03:31.929851', '2025-11-20 00:03:31.929851'),
('86486938-5a23-404f-9413-9b19956f6220', '31ff0b36-3cd1-4093-b6e6-70b6acbbb654', 'd27041bd-75ea-4f29-a8fa-c953e835a38f', 'Sıcak Çikolata', 4.00, 4, 16.00, NULL, '2025-11-20 19:53:57.711119', '2025-11-20 19:54:10.000000'),
('86bfde90-142f-4149-91fe-6c72f3086fdf', '82e15b01-6e49-4406-8b78-a2b9e0efcd61', '6c2a8faa-ac72-47c2-807b-9cd32440fb42', 'Çikolatalı Dondurma', 5.00, 1, 5.00, NULL, '2025-11-20 00:35:49.622492', '2025-11-20 00:35:49.622492'),
('86fcd704-5741-454e-8c6f-1660ff5d27f4', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-20 00:03:36.980652', '2025-11-20 00:03:36.980652'),
('889a5606-0e2c-456f-b22d-d2b8a91ba933', 'bc40052c-7845-4c41-a60d-430ba254dc96', 'ee1cf870-0a6e-42f6-a9f5-be27645bb0aa', 'Portakal Suyu', 4.00, 1, 4.00, NULL, '2025-11-20 18:36:53.282588', '2025-11-20 18:36:53.282588'),
('89ed4442-8e64-413c-ab5f-4aafba55c9c7', 'bc40052c-7845-4c41-a60d-430ba254dc96', '31914e98-914c-46d5-b467-a1fa4461782b', 'Kaşarlı Pide', 6.00, 2, 12.00, NULL, '2025-11-20 18:36:58.090253', '2025-11-20 18:37:08.000000'),
('8a6a5f6b-9e18-4ea8-91a7-25dd10713e8a', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-19 23:47:28.888882', '2025-11-19 23:47:28.888882'),
('8ad9fe86-9fae-45ad-bfe8-0c0611fe48e4', '48f867f1-0eec-4763-a079-1f4e51657f33', '8a50e378-79cc-4da8-912b-5bdc879b58cf', 'Vanilyalı Dondurma', 5.00, 1, 5.00, NULL, '2025-11-19 23:49:05.656171', '2025-11-19 23:49:05.656171'),
('8c443f95-6aa3-410b-8fd3-22bc53ebf4de', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '93f15745-9164-422e-b9d5-0274f983ca10', 'Cheese Burger', 3.90, 1, 3.90, NULL, '2025-11-20 00:03:15.573485', '2025-11-20 00:03:15.573485'),
('8caa770f-ac7a-4297-8684-5ed542800c47', '2d992f85-5edf-4362-921c-900eed2b165d', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-20 01:19:26.084809', '2025-11-20 01:19:26.084809'),
('8d5d23fc-60d1-486e-94d8-80bc0d16ad8e', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '5a81a5d8-7d6e-40d6-bc26-da8e89bfe39e', 'Black Burger MAL', 4.50, 1, 4.50, NULL, '2025-11-19 23:47:17.728701', '2025-11-19 23:47:17.728701'),
('8ef87f03-7067-4d29-a358-4c434d6faa77', '975aa529-0bc1-4dfe-8181-4ef70bf0ae42', 'be173ebf-05b6-4b58-b9fc-0d34b84960d3', 'Mojito', 8.00, 1, 8.00, NULL, '2025-11-20 00:36:19.006586', '2025-11-20 00:36:19.006586'),
('9210b97f-72cc-495a-b7a5-358c73327f85', 'f6b4355a-aac4-437a-9f7b-f4689f8e24e3', '14c23a20-df63-4669-beb3-fbf251b18ff8', 'Cappuccino', 4.00, 2, 8.00, NULL, '2025-11-20 21:47:17.344213', '2025-11-20 21:47:19.000000'),
('9263d9c2-1723-4f8d-844c-786c1ab88134', '975aa529-0bc1-4dfe-8181-4ef70bf0ae42', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-20 00:56:10.102043', '2025-11-20 00:56:10.102043'),
('94751b3c-182d-4bda-a8d4-7fe70f210079', '8a394ae7-7838-493b-8c90-d2aad48e9cdc', '8a50e378-79cc-4da8-912b-5bdc879b58cf', 'Vanilyalı Dondurma', 5.00, 1, 5.00, NULL, '2025-11-20 21:19:50.993634', '2025-11-20 21:19:50.993634'),
('9487d79a-70c3-4719-b5c9-ba420d5e3aab', 'bc40052c-7845-4c41-a60d-430ba254dc96', '0e1d85de-44d9-4505-b675-a7b0b19c3f18', 'Latte', 4.50, 2, 9.00, NULL, '2025-11-20 18:36:55.985098', '2025-11-20 18:37:01.000000'),
('94904080-b410-4513-afac-c8f9def9a448', 'f6b4355a-aac4-437a-9f7b-f4689f8e24e3', 'dbc0e029-aa92-4989-93de-69e46a6b8f46', 'Limonata', 3.50, 1, 3.50, NULL, '2025-11-20 21:47:06.661639', '2025-11-20 21:47:06.661639'),
('95445bd9-2f73-4ab4-833e-9286847518bf', '2d992f85-5edf-4362-921c-900eed2b165d', '5a81a5d8-7d6e-40d6-bc26-da8e89bfe39e', 'Black Burger MAL', 4.50, 1, 4.50, NULL, '2025-11-20 01:19:14.791504', '2025-11-20 01:19:14.791504'),
('96342606-24a5-481e-a9cf-ce71aac76c33', '71dff258-6018-4cc8-99aa-1b19e2f06400', '9d137d40-5a17-4cb7-b40c-b429307f1c29', 'Black Burger Toyuq', 4.00, 1, 4.00, NULL, '2025-11-20 20:01:10.179532', '2025-11-20 20:01:10.179532'),
('96db9d27-c7b3-4cfc-9b18-bf76b746687e', '4517c658-77ed-47a9-8ef9-0803e156d768', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-20 21:25:08.493719', '2025-11-20 21:25:08.493719'),
('98758a31-1f3c-4f90-be41-da6fadcd74e6', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '8a50e378-79cc-4da8-912b-5bdc879b58cf', 'Vanilyalı Dondurma', 5.00, 3, 15.00, NULL, '2025-11-19 23:46:40.267767', '2025-11-19 23:48:50.000000'),
('9b103bec-732c-4921-a4cc-8dbd0e84b91e', 'bc40052c-7845-4c41-a60d-430ba254dc96', '5a81a5d8-7d6e-40d6-bc26-da8e89bfe39e', 'Black Burger MAL', 4.50, 1, 4.50, NULL, '2025-11-20 18:31:29.219044', '2025-11-20 18:31:29.219044'),
('9c362926-b64f-4680-bfe3-ca0e7ed97560', '71dff258-6018-4cc8-99aa-1b19e2f06400', 'fac9e673-c726-421e-92a5-91d9b66c6bfa', 'OKAkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkbggggggggggggggggggggg', 5.00, 1, 5.00, NULL, '2025-11-20 19:58:18.208345', '2025-11-20 19:58:18.208345'),
('9ca9ad18-d08a-4c6b-a882-f1e0fc29a262', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-20 00:03:37.971428', '2025-11-20 00:03:37.971428'),
('9d3f7e88-eedf-4129-9b20-854ad713eedb', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '5c7fa6ec-2b12-4ec0-8e8f-51388b40588e', 'Tavuklu Pide', 6.50, 1, 6.50, NULL, '2025-11-19 23:47:37.245639', '2025-11-19 23:47:37.245639'),
('9d700912-0897-44e6-83f2-916e3552d538', '2d992f85-5edf-4362-921c-900eed2b165d', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-20 01:18:40.787648', '2025-11-20 01:18:40.787648'),
('9ee9eaff-c3f6-4abd-a4c2-d7e9084a9945', '7007f1f0-d646-4d54-aa8d-67e2a607028d', 'b8589d85-df98-4d0e-b131-4528ae29ec35', 'Espresso', 3.50, 1, 3.50, NULL, '2025-11-19 23:46:45.798880', '2025-11-19 23:46:45.798880'),
('a085d48a-2978-4afe-99c6-f8a811dbf8fa', '811ab02d-9372-4701-8685-3f2533fecdd2', 'e1580ead-44e7-4d64-aee9-41f2dc162019', 'hhh', 5.00, 1, 5.00, NULL, '2025-11-20 21:18:58.449918', '2025-11-20 21:18:58.449918'),
('a0f66ca3-21c7-468b-a922-1de70cfaf921', 'cd6b1b82-9305-4b3e-a08a-1cb3ef10b067', '8a50e378-79cc-4da8-912b-5bdc879b58cf', 'Vanilyalı Dondurma', 5.00, 1, 5.00, NULL, '2025-11-19 23:54:41.761198', '2025-11-19 23:54:41.761198'),
('a1787f35-63da-40fb-82f0-9bfcb62dae38', '811ab02d-9372-4701-8685-3f2533fecdd2', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-20 21:18:43.317422', '2025-11-20 21:18:43.317422'),
('a18064b0-3eb1-4ccc-8a15-ec1d510a3b6c', '6fa12397-0074-4ece-935e-ce28e9f1e27d', '99a960cc-9f42-4fda-8b2d-ed8d60cd7bdf', 'OKA', 5.00, 21, 105.00, NULL, '2025-11-19 23:33:05.056972', '2025-11-19 23:33:28.000000'),
('a1cd509a-c18f-482f-8152-4acebae48d6d', '4935f506-fb54-44ba-a2e2-5f3dd1642376', '0e1d85de-44d9-4505-b675-a7b0b19c3f18', 'Latte', 4.50, 1, 4.50, NULL, '2025-11-20 00:51:56.854663', '2025-11-20 00:51:56.854663'),
('a2967108-3d6d-4469-8f7a-a5dec7844df0', '2d992f85-5edf-4362-921c-900eed2b165d', 'dbc0e029-aa92-4989-93de-69e46a6b8f46', 'Limonata', 3.50, 1, 3.50, NULL, '2025-11-20 01:19:16.892462', '2025-11-20 01:19:16.892462'),
('a3d2415c-112b-44f9-bab1-b5ec05e03131', '2d992f85-5edf-4362-921c-900eed2b165d', 'dbc0e029-aa92-4989-93de-69e46a6b8f46', 'Limonata', 3.50, 1, 3.50, NULL, '2025-11-20 01:19:24.275779', '2025-11-20 01:19:24.275779'),
('a40468e7-2670-4180-b907-cb59715acf1f', '2d992f85-5edf-4362-921c-900eed2b165d', '6c2a8faa-ac72-47c2-807b-9cd32440fb42', 'Çikolatalı Dondurma', 5.00, 1, 5.00, NULL, '2025-11-20 01:22:24.600956', '2025-11-20 01:22:24.600956'),
('a52a667d-1150-45e8-b767-209693f48de8', '8fc29c37-b74d-4659-9b18-5b8943c6ae1f', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-20 19:02:03.424849', '2025-11-20 19:02:03.424849'),
('a63f043b-6c80-42bd-9393-1d0116330668', 'bc40052c-7845-4c41-a60d-430ba254dc96', '5c7fa6ec-2b12-4ec0-8e8f-51388b40588e', 'Tavuklu Pide', 6.50, 2, 13.00, NULL, '2025-11-20 01:26:34.481785', '2025-11-20 18:31:22.000000'),
('a64c31d5-b3f5-4608-8656-50128adb7646', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-19 23:47:29.095804', '2025-11-19 23:47:29.095804'),
('a7ddf587-fcdc-4195-94eb-64de21d612a4', '2d992f85-5edf-4362-921c-900eed2b165d', '0e1d85de-44d9-4505-b675-a7b0b19c3f18', 'Latte', 4.50, 1, 4.50, NULL, '2025-11-20 01:19:01.412852', '2025-11-20 01:19:01.412852'),
('a9e2b24d-ce27-4b64-bc72-691a7f9bf8ba', 'bc40052c-7845-4c41-a60d-430ba254dc96', '7722aa31-c21c-48cd-9616-7b689e82cd52', 'Mevsim Salatası', 6.00, 1, 6.00, NULL, '2025-11-20 18:37:07.154198', '2025-11-20 18:37:07.154198'),
('ab234e95-f0b7-4f0c-9559-16ca07b31524', 'a40a83e6-fc42-4a29-93a7-1a2ac908c68f', '99a960cc-9f42-4fda-8b2d-ed8d60cd7bdf', 'OKA', 5.00, 3, 15.00, NULL, '2025-11-19 23:14:16.835379', '2025-11-19 23:14:24.000000'),
('ac0cfdfb-e00a-46ca-a77b-1b61a320eb39', 'bc40052c-7845-4c41-a60d-430ba254dc96', '9d137d40-5a17-4cb7-b40c-b429307f1c29', 'Black Burger Toyuq', 4.00, 4, 16.00, NULL, '2025-11-20 18:31:24.362413', '2025-11-20 18:37:14.000000'),
('ac4ce056-33c2-4569-b058-d4a4496708a2', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-20 00:03:37.545363', '2025-11-20 00:03:37.545363'),
('ae46c12a-97c1-4655-942c-38312a0d7325', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', 'a60ae1b7-31f2-4d7c-af66-7d7b7aaacb64', 'Pepperoni Pizza', 9.50, 1, 9.50, NULL, '2025-11-20 00:03:31.367468', '2025-11-20 00:03:31.367468'),
('afa4c465-cbdb-439e-9673-5496da5b8b2a', 'f6b4355a-aac4-437a-9f7b-f4689f8e24e3', 'ee1cf870-0a6e-42f6-a9f5-be27645bb0aa', 'Portakal Suyu', 4.00, 1, 4.00, NULL, '2025-11-20 21:47:05.483294', '2025-11-20 21:47:05.483294'),
('b0a131c9-a0ea-4cfc-88b8-74b7dd99f0ea', '975aa529-0bc1-4dfe-8181-4ef70bf0ae42', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-20 00:56:10.506485', '2025-11-20 00:56:10.506485'),
('b0cb4852-9f5c-402d-84af-cc0d106236d5', '05a674c8-31fe-4763-bb6c-19011eea1b3e', '7b7e7bd4-fc95-4da8-a913-7e67cb418434', 'Çay', 2.00, 1, 2.00, NULL, '2025-11-20 00:36:47.267205', '2025-11-20 00:36:47.267205'),
('b1a0bf0e-bede-4172-a27b-4f9327e3951f', '975aa529-0bc1-4dfe-8181-4ef70bf0ae42', '42182cf0-2fc2-4a24-9ed7-02c54dd1b1e8', '50', 25.00, 1, 25.00, NULL, '2025-11-20 00:56:13.596866', '2025-11-20 00:56:13.596866'),
('b3a9a40b-4678-4c62-8a8c-e33ee8800936', 'bc40052c-7845-4c41-a60d-430ba254dc96', '631452f0-59cb-4ba3-992d-dcdcf2bc3df7', 'Karışık Pizza', 11.00, 2, 22.00, NULL, '2025-11-20 18:31:22.747877', '2025-11-20 18:54:32.000000'),
('b58d081d-8c6c-4b51-8c0c-77a078eeb070', 'fc5e87b7-7837-4cce-855e-4b5b2370246a', '42182cf0-2fc2-4a24-9ed7-02c54dd1b1e8', '50', 25.00, 33, 825.00, NULL, '2025-11-19 23:14:54.010067', '2025-11-19 23:21:36.000000'),
('b762e409-37d4-41bc-abb5-2bdaacfa7b15', 'bc40052c-7845-4c41-a60d-430ba254dc96', '4f61d23b-cb4c-4344-985c-2933684b696c', 'Piña Colada', 9.00, 1, 9.00, NULL, '2025-11-20 18:36:53.933772', '2025-11-20 18:36:53.933772'),
('b9416cb3-5dea-489a-8934-d79699e65689', '412c5e24-7ee3-45ff-9d85-da0e98840e7c', '42182cf0-2fc2-4a24-9ed7-02c54dd1b1e8', '50', 25.00, 7, 175.00, NULL, '2025-11-19 23:25:51.523134', '2025-11-19 23:26:24.000000'),
('b9d6f801-9803-4d19-aed5-436c500933e2', '4935f506-fb54-44ba-a2e2-5f3dd1642376', '8a50e378-79cc-4da8-912b-5bdc879b58cf', 'Vanilyalı Dondurma', 5.00, 2, 10.00, NULL, '2025-11-20 00:51:49.977018', '2025-11-20 00:51:50.000000'),
('bcee86a6-ae52-4aca-8206-0bb97a24a9ba', '71dff258-6018-4cc8-99aa-1b19e2f06400', 'be173ebf-05b6-4b58-b9fc-0d34b84960d3', 'Mojito', 8.00, 1, 8.00, NULL, '2025-11-20 19:59:58.060693', '2025-11-20 19:59:58.060693'),
('be35fab3-bc5b-46fd-bbac-740b44a266c3', 'bc40052c-7845-4c41-a60d-430ba254dc96', '3675ac7e-8556-4e29-bffb-32b4f45fd98b', 'Türk Kahvesi', 3.00, 1, 3.00, NULL, '2025-11-20 18:37:06.769173', '2025-11-20 18:37:06.769173'),
('be4f64ed-bd7a-4950-901c-ba84d714b5d2', '48f867f1-0eec-4763-a079-1f4e51657f33', '7b7e7bd4-fc95-4da8-a913-7e67cb418434', 'Çay', 2.00, 1, 2.00, NULL, '2025-11-19 23:49:08.931477', '2025-11-19 23:49:08.931477'),
('c0c7b324-42db-4767-ad66-abe91db70b43', '3abc46da-a2c1-416a-9b63-304fff5b82a0', '99a960cc-9f42-4fda-8b2d-ed8d60cd7bdf', 'OKA', 5.00, 1, 5.00, NULL, '2025-11-19 23:09:53.889886', '2025-11-19 23:09:53.889886'),
('c10e3365-2b7a-4fbc-ba99-12a68e22f70c', 'cdf5904e-d95d-4e07-bc2d-21919b919642', '8a50e378-79cc-4da8-912b-5bdc879b58cf', 'Vanilyalı Dondurma', 5.00, 1, 5.00, NULL, '2025-11-20 19:57:27.015189', '2025-11-20 19:57:27.015189'),
('c1c4c5eb-d77f-40ac-bc8d-205a748c5a33', 'bc40052c-7845-4c41-a60d-430ba254dc96', '99a960cc-9f42-4fda-8b2d-ed8d60cd7bdf', 'OKA', 5.00, 4, 20.00, NULL, '2025-11-20 18:31:26.773296', '2025-11-20 18:37:16.000000'),
('c2d5a4de-8ac4-4e53-825b-bd7ffaccfab4', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', 'a60ae1b7-31f2-4d7c-af66-7d7b7aaacb64', 'Pepperoni Pizza', 9.50, 1, 9.50, NULL, '2025-11-20 00:03:25.858269', '2025-11-20 00:03:25.858269'),
('c3f9eea0-0ff2-4b42-ab71-6e5e4c094f6e', '10af48c7-63ed-4be2-b1ec-f5c60857e206', '6c2a8faa-ac72-47c2-807b-9cd32440fb42', 'Çikolatalı Dondurma', 5.00, 1, 5.00, NULL, '2025-11-20 21:18:27.740496', '2025-11-20 21:18:27.740496'),
('c4d9f98b-1271-406e-b1ef-ceb2f0b6451a', '2d992f85-5edf-4362-921c-900eed2b165d', '7b7e7bd4-fc95-4da8-a913-7e67cb418434', 'Çay', 2.00, 1, 2.00, NULL, '2025-11-20 01:22:26.524371', '2025-11-20 01:22:26.524371'),
('c567fb6c-0fa4-4254-8957-34ea2e7208bb', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '99a960cc-9f42-4fda-8b2d-ed8d60cd7bdf', 'OKA', 5.00, 3, 15.00, NULL, '2025-11-20 00:03:28.143881', '2025-11-20 00:56:49.000000'),
('c69d1823-266a-4ddb-9606-2c2826fa7d60', '71dff258-6018-4cc8-99aa-1b19e2f06400', '0e1d85de-44d9-4505-b675-a7b0b19c3f18', 'Latte', 4.50, 1, 4.50, NULL, '2025-11-20 20:00:04.497922', '2025-11-20 20:00:04.497922'),
('c6fb3dc8-f645-4e74-8a52-0ca78cdbb205', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '9d137d40-5a17-4cb7-b40c-b429307f1c29', 'Black Burger Toyuq', 4.00, 2, 8.00, NULL, '2025-11-20 00:03:17.094084', '2025-11-20 00:03:30.000000'),
('c7207bfa-9845-447d-9e32-6ee712a76d85', 'a40a83e6-fc42-4a29-93a7-1a2ac908c68f', '42182cf0-2fc2-4a24-9ed7-02c54dd1b1e8', '50', 25.00, 3, 75.00, NULL, '2025-11-19 23:14:16.276483', '2025-11-19 23:14:23.000000'),
('c806e5bf-2352-4aa5-81c4-ae7b30fe80e3', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-20 00:03:37.359014', '2025-11-20 00:03:37.359014'),
('c8cf5902-5986-4f48-ab0e-ddcb7417c439', '4935f506-fb54-44ba-a2e2-5f3dd1642376', '0d84f7eb-4ae9-46e8-bf45-52026b3ff281', 'Lahmacun', 4.50, 1, 4.50, NULL, '2025-11-20 00:51:58.667372', '2025-11-20 00:51:58.667372'),
('cb9f5dca-3079-421f-a992-8b65fca4c038', '71dff258-6018-4cc8-99aa-1b19e2f06400', '631452f0-59cb-4ba3-992d-dcdcf2bc3df7', 'Karışık Pizza', 11.00, 1, 11.00, NULL, '2025-11-20 20:01:08.931330', '2025-11-20 20:01:08.931330'),
('cc2c89c2-8046-448e-b2d3-07b532c3518f', 'f6b4355a-aac4-437a-9f7b-f4689f8e24e3', 'fac9e673-c726-421e-92a5-91d9b66c6bfa', 'OKAkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkbggggggggggggggggggggg', 5.00, 1, 5.00, NULL, '2025-11-20 21:47:11.065290', '2025-11-20 21:47:11.065290'),
('ccfecd09-b63e-446a-93ae-ebdbca396b68', '25f83be7-5d33-4921-a246-6d4ab08691ff', '99a960cc-9f42-4fda-8b2d-ed8d60cd7bdf', 'OKA', 5.00, 1, 5.00, NULL, '2025-11-19 22:58:51.870306', '2025-11-19 22:58:51.870306'),
('cd479fc4-18bd-466c-ab5e-588ac531daa5', 'cd6b1b82-9305-4b3e-a08a-1cb3ef10b067', '6c2a8faa-ac72-47c2-807b-9cd32440fb42', 'Çikolatalı Dondurma', 5.00, 2, 10.00, NULL, '2025-11-19 23:54:39.802469', '2025-11-19 23:54:42.000000'),
('ce45a9fe-60cc-4760-a9d7-e1a91c13f697', '4935f506-fb54-44ba-a2e2-5f3dd1642376', '4f61d23b-cb4c-4344-985c-2933684b696c', 'Piña Colada', 9.00, 1, 9.00, NULL, '2025-11-20 00:51:55.270206', '2025-11-20 00:51:55.270206'),
('cf393312-f322-4de9-a083-eb2d1644f148', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '987e5ed7-4783-471b-8863-a017a37491c0', 'ŞAURMA ROLL', 3.50, 1, 3.50, NULL, '2025-11-19 23:47:17.455105', '2025-11-19 23:47:17.455105'),
('d0093fce-9f2b-438e-bdee-cfd92a5f58af', '3ad1ecfd-af0d-4dc0-b759-4c1f25a1d307', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-20 21:17:50.059047', '2025-11-20 21:17:50.059047'),
('d12e9647-b594-4a01-bafd-6df8c372c0a3', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', 'e9b45443-e08c-45ce-b4ca-82242284a692', 'Şef Burger', 5.00, 2, 10.00, NULL, '2025-11-20 00:03:16.161450', '2025-11-20 00:03:30.000000'),
('d19845e6-808c-4ce6-9218-1d1087ac86ec', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '5c7fa6ec-2b12-4ec0-8e8f-51388b40588e', 'Tavuklu Pide', 6.50, 1, 6.50, NULL, '2025-11-19 23:47:15.756714', '2025-11-19 23:47:15.756714'),
('d2ce86da-2902-452f-939d-7279be7effb2', '05a674c8-31fe-4763-bb6c-19011eea1b3e', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-20 00:36:39.868538', '2025-11-20 00:36:39.868538'),
('d32b2196-2bb8-48de-9244-9abdd7dd5614', '975aa529-0bc1-4dfe-8181-4ef70bf0ae42', '4f61d23b-cb4c-4344-985c-2933684b696c', 'Piña Colada', 9.00, 5, 45.00, NULL, '2025-11-20 00:55:54.033023', '2025-11-20 00:55:56.000000'),
('d35f2d6e-e5ca-4c16-af07-e6fd07c1fd41', '05a674c8-31fe-4763-bb6c-19011eea1b3e', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-20 00:36:51.947739', '2025-11-20 00:36:51.947739'),
('d364c01d-5c63-4de2-b660-596a85148e2b', '48f867f1-0eec-4763-a079-1f4e51657f33', '99a960cc-9f42-4fda-8b2d-ed8d60cd7bdf', 'OKA', 5.00, 1, 5.00, NULL, '2025-11-19 23:07:37.466154', '2025-11-19 23:07:37.466154'),
('d370ecdb-d5f4-4ba5-80fd-0616b6a53a46', '562c70d1-3af1-432a-a159-7cfe98f13979', 'e1580ead-44e7-4d64-aee9-41f2dc162019', 'hhh', 5.00, 2, 10.00, NULL, '2025-11-20 21:18:01.174666', '2025-11-20 21:19:22.000000'),
('d381ca35-910b-492a-ae8c-411e8f52abd7', '48f867f1-0eec-4763-a079-1f4e51657f33', 'd27041bd-75ea-4f29-a8fa-c953e835a38f', 'Sıcak Çikolata', 4.00, 1, 4.00, NULL, '2025-11-19 23:49:09.284849', '2025-11-19 23:49:09.284849'),
('d43fefbc-723f-41cf-a497-8cdeee00ad13', 'd29a1ba7-1608-4a76-b705-2095df0c01c2', '8a50e378-79cc-4da8-912b-5bdc879b58cf', 'Vanilyalı Dondurma', 5.00, 1, 5.00, NULL, '2025-11-20 00:22:15.568838', '2025-11-20 00:22:15.568838'),
('d5cde3cd-b87a-4466-b94c-89c54ef7d796', 'f6b4355a-aac4-437a-9f7b-f4689f8e24e3', 'd27041bd-75ea-4f29-a8fa-c953e835a38f', 'Sıcak Çikolata', 4.00, 1, 4.00, NULL, '2025-11-20 21:47:15.877384', '2025-11-20 21:47:15.877384'),
('d64ccf00-af7a-4516-a5a6-7caa3968a30f', 'd29a1ba7-1608-4a76-b705-2095df0c01c2', 'dbc0e029-aa92-4989-93de-69e46a6b8f46', 'Limonata', 3.50, 1, 3.50, NULL, '2025-11-20 00:22:18.924045', '2025-11-20 00:22:18.924045'),
('d65b26ca-32cc-4846-91ef-e02f15c30c70', '214d1f23-0f0d-4a83-b9c0-baabd7ec0964', 'dbc0e029-aa92-4989-93de-69e46a6b8f46', 'Limonata', 3.50, 1, 3.50, NULL, '2025-11-20 21:38:01.979669', '2025-11-20 21:38:01.979669');
INSERT INTO `order_items` (`id`, `orderId`, `productId`, `productName`, `unitPrice`, `quantity`, `total`, `notes`, `createdAt`, `updatedAt`) VALUES
('d6a0fbf3-fdf0-423b-acfc-19c90ca58f92', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-20 00:03:24.841120', '2025-11-20 00:03:24.841120'),
('d6b69696-84c9-4c4f-89a3-a14bd5974953', 'f6b4355a-aac4-437a-9f7b-f4689f8e24e3', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-20 21:47:04.253723', '2025-11-20 21:47:04.253723'),
('d72582eb-f0f3-4623-aeea-72ac33f8abfb', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '4f61d23b-cb4c-4344-985c-2933684b696c', 'Piña Colada', 9.00, 1, 9.00, NULL, '2025-11-19 23:46:44.168094', '2025-11-19 23:46:44.168094'),
('d7a3b372-1fa9-45be-bc51-cc67884346ad', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '5c7fa6ec-2b12-4ec0-8e8f-51388b40588e', 'Tavuklu Pide', 6.50, 1, 6.50, NULL, '2025-11-19 23:47:32.722254', '2025-11-19 23:47:32.722254'),
('d8a312f1-9d75-4b4b-a07a-c3d3b7b019f3', '7007f1f0-d646-4d54-aa8d-67e2a607028d', 'be173ebf-05b6-4b58-b9fc-0d34b84960d3', 'Mojito', 8.00, 3, 24.00, NULL, '2025-11-19 23:46:44.785142', '2025-11-19 23:47:41.000000'),
('d9010812-bcdc-4f67-8c61-40fc7a127194', '48f867f1-0eec-4763-a079-1f4e51657f33', '4f61d23b-cb4c-4344-985c-2933684b696c', 'Piña Colada', 9.00, 1, 9.00, NULL, '2025-11-19 23:49:08.437909', '2025-11-19 23:49:08.437909'),
('d98d8d80-2a68-4396-8ce0-93b620e6a0b5', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '14c23a20-df63-4669-beb3-fbf251b18ff8', 'Cappuccino', 4.00, 1, 4.00, NULL, '2025-11-19 23:47:42.667263', '2025-11-19 23:47:42.667263'),
('dadd4e9e-db37-4275-b519-dedee54320e9', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-20 00:03:38.166729', '2025-11-20 00:03:38.166729'),
('dafb1e31-d371-4f80-af13-060957d8da0f', '2d992f85-5edf-4362-921c-900eed2b165d', '2eb3c163-a07b-46da-a1f1-6bfbb5faf85f', 'Çoban Salatası', 5.50, 1, 5.50, NULL, '2025-11-20 01:22:28.352858', '2025-11-20 01:22:28.352858'),
('db28fb04-933e-4781-bce8-824d3e36cefb', 'bc40052c-7845-4c41-a60d-430ba254dc96', '42182cf0-2fc2-4a24-9ed7-02c54dd1b1e8', '50', 25.00, 5, 125.00, NULL, '2025-11-20 18:31:27.232325', '2025-11-20 18:37:16.000000'),
('dd58ef8d-2f3b-474e-b085-da10a560029d', '6fa12397-0074-4ece-935e-ce28e9f1e27d', '42182cf0-2fc2-4a24-9ed7-02c54dd1b1e8', '50', 25.00, 10, 250.00, NULL, '2025-11-19 23:31:51.935234', '2025-11-19 23:33:27.000000'),
('ddfe9a8d-c166-4373-8a7e-4232c8c9a727', '05a674c8-31fe-4763-bb6c-19011eea1b3e', '8a50e378-79cc-4da8-912b-5bdc879b58cf', 'Vanilyalı Dondurma', 5.00, 2, 10.00, NULL, '2025-11-20 00:36:38.797073', '2025-11-20 00:36:51.000000'),
('de4c4c63-e676-494a-b43b-a9a386fb3768', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '6c2a8faa-ac72-47c2-807b-9cd32440fb42', 'Çikolatalı Dondurma', 5.00, 2, 10.00, NULL, '2025-11-20 00:02:44.276323', '2025-11-20 01:02:31.000000'),
('deea9bba-08f9-4d07-85d9-7081e60e377a', '4935f506-fb54-44ba-a2e2-5f3dd1642376', 'e6e84ee6-89c0-49d8-b7f9-5db2ab1eb89c', 'Qapalı Burger', 5.00, 1, 5.00, NULL, '2025-11-20 00:52:02.302531', '2025-11-20 00:52:02.302531'),
('df7f65b3-74e6-4656-9a18-923cd21ab56f', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '5c7fa6ec-2b12-4ec0-8e8f-51388b40588e', 'Tavuklu Pide', 6.50, 1, 6.50, NULL, '2025-11-19 23:47:39.858515', '2025-11-19 23:47:39.858515'),
('dfff6b1e-b77b-445b-af5c-216d500de02e', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-19 23:47:38.541170', '2025-11-19 23:47:38.541170'),
('e2a2c71d-d850-4f35-bf80-c009f98fe0b3', '4935f506-fb54-44ba-a2e2-5f3dd1642376', '31914e98-914c-46d5-b467-a1fa4461782b', 'Kaşarlı Pide', 6.00, 1, 6.00, NULL, '2025-11-20 00:51:59.314693', '2025-11-20 00:51:59.314693'),
('e322a5f5-711c-4290-b9e7-b4685d8a812b', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-19 23:46:41.847643', '2025-11-19 23:46:41.847643'),
('e474928c-4e33-4925-8c0e-dd515425e48d', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '631452f0-59cb-4ba3-992d-dcdcf2bc3df7', 'Karışık Pizza', 11.00, 8, 88.00, NULL, '2025-11-19 23:47:26.848119', '2025-11-19 23:47:35.000000'),
('e47aea2c-48c0-4121-a7eb-a599b0404cb5', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-20 00:03:36.594735', '2025-11-20 00:03:36.594735'),
('e55a4414-6751-4d11-b992-c45939ae5732', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '5c7fa6ec-2b12-4ec0-8e8f-51388b40588e', 'Tavuklu Pide', 6.50, 1, 6.50, NULL, '2025-11-19 23:47:33.285760', '2025-11-19 23:47:33.285760'),
('e7759d49-fe2e-4c31-b712-e9f865cef46a', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '631452f0-59cb-4ba3-992d-dcdcf2bc3df7', 'Karışık Pizza', 11.00, 6, 66.00, NULL, '2025-11-20 00:03:24.489793', '2025-11-20 00:03:35.000000'),
('e7bfb9eb-ee32-43bc-a56b-f580e40b43b7', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-19 23:47:29.279926', '2025-11-19 23:47:29.279926'),
('e7c40878-5bfb-4f1f-b720-2023d1d89d21', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '5c7fa6ec-2b12-4ec0-8e8f-51388b40588e', 'Tavuklu Pide', 6.50, 1, 6.50, NULL, '2025-11-20 00:03:23.575902', '2025-11-20 00:03:23.575902'),
('e8d5cd2a-7871-4582-910b-9cb745bf3345', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '5c7fa6ec-2b12-4ec0-8e8f-51388b40588e', 'Tavuklu Pide', 6.50, 1, 6.50, NULL, '2025-11-19 23:47:34.404343', '2025-11-19 23:47:34.404343'),
('e90389ce-d50c-4e9a-9534-7152ffdf2a1d', '975aa529-0bc1-4dfe-8181-4ef70bf0ae42', '6c2a8faa-ac72-47c2-807b-9cd32440fb42', 'Çikolatalı Dondurma', 5.00, 2, 10.00, NULL, '2025-11-20 00:36:14.676483', '2025-11-20 00:55:52.000000'),
('e99c811c-6e16-4dfe-a2e7-a1914ed6b9bf', 'cd6b1b82-9305-4b3e-a08a-1cb3ef10b067', 'd27041bd-75ea-4f29-a8fa-c953e835a38f', 'Sıcak Çikolata', 4.00, 1, 4.00, NULL, '2025-11-19 23:54:42.759066', '2025-11-19 23:54:42.759066'),
('e9c3f255-c351-4a45-9a0c-967a8aaa3dbf', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '42182cf0-2fc2-4a24-9ed7-02c54dd1b1e8', '50', 25.00, 2, 50.00, NULL, '2025-11-20 00:03:28.529503', '2025-11-20 00:03:29.000000'),
('ea065fe0-2690-4eaa-8e7b-9718b8906e34', 'bc40052c-7845-4c41-a60d-430ba254dc96', '2eb3c163-a07b-46da-a1f1-6bfbb5faf85f', 'Çoban Salatası', 5.50, 2, 11.00, NULL, '2025-11-20 18:36:58.876791', '2025-11-20 18:37:07.000000'),
('ea680c06-3380-4bfd-a6c8-d1a433843a87', 'cd6b1b82-9305-4b3e-a08a-1cb3ef10b067', '42182cf0-2fc2-4a24-9ed7-02c54dd1b1e8', '50', 25.00, 4, 100.00, NULL, '2025-11-19 23:39:50.007239', '2025-11-19 23:39:54.000000'),
('ea7aab39-bf8d-4761-93f1-148386fc8b59', '48f867f1-0eec-4763-a079-1f4e51657f33', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-19 23:49:06.786155', '2025-11-19 23:49:06.786155'),
('ed4d903d-a48d-44ac-999d-2ada199a3687', '2963f1ec-f15c-4a58-b478-67a8747073b2', 'e1580ead-44e7-4d64-aee9-41f2dc162019', 'hhh', 5.00, 1, 5.00, NULL, '2025-11-20 21:24:52.446088', '2025-11-20 21:24:52.446088'),
('ee4bc5ee-6f74-4c5e-b135-53f59b57c8c1', '2d992f85-5edf-4362-921c-900eed2b165d', 'd27041bd-75ea-4f29-a8fa-c953e835a38f', 'Sıcak Çikolata', 4.00, 1, 4.00, NULL, '2025-11-20 01:22:27.523400', '2025-11-20 01:22:27.523400'),
('efd87b36-e53e-45c2-9285-30f820bb3fca', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '6c2a8faa-ac72-47c2-807b-9cd32440fb42', 'Çikolatalı Dondurma', 5.00, 2, 10.00, NULL, '2025-11-19 23:46:41.224133', '2025-11-19 23:47:10.000000'),
('f273b5bb-40ea-4f5f-a607-8b5a3fe23bd1', '412c5e24-7ee3-45ff-9d85-da0e98840e7c', '99a960cc-9f42-4fda-8b2d-ed8d60cd7bdf', 'OKA', 5.00, 7, 35.00, NULL, '2025-11-19 23:25:52.225445', '2025-11-19 23:26:24.000000'),
('f2a1bc68-588d-4cd3-bc7d-c0579ca81734', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-19 23:47:38.739290', '2025-11-19 23:47:38.739290'),
('f2a6c5e0-c022-4c35-8745-f43a8a4be568', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '93f15745-9164-422e-b9d5-0274f983ca10', 'Cheese Burger', 3.90, 1, 3.90, NULL, '2025-11-20 00:03:29.776491', '2025-11-20 00:03:29.776491'),
('f5e7195c-a503-4e64-927d-1d112485781b', 'cd6b1b82-9305-4b3e-a08a-1cb3ef10b067', 'fd539fa4-b3e7-4835-9a2c-9f7df4eb1125', 'Sezar Salata', 7.50, 1, 7.50, NULL, '2025-11-19 23:54:44.269049', '2025-11-19 23:54:44.269049'),
('f65e39d4-080d-4298-842b-40fa26423258', '20f1c127-5fbf-4238-b6b8-0e8fe35b0ef4', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 5, 12.50, NULL, '2025-11-20 21:53:44.111802', '2025-11-20 21:53:48.000000'),
('f6b00c8a-4b9a-4bb4-acb1-82a8885036e4', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '5c7fa6ec-2b12-4ec0-8e8f-51388b40588e', 'Tavuklu Pide', 6.50, 1, 6.50, NULL, '2025-11-19 23:47:32.904867', '2025-11-19 23:47:32.904867'),
('f6e0d0cd-2b4d-4c96-afca-17057f70ea06', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '7b7e7bd4-fc95-4da8-a913-7e67cb418434', 'Çay', 2.00, 1, 2.00, NULL, '2025-11-20 00:03:20.646074', '2025-11-20 00:03:20.646074'),
('f6f6d514-0786-4c80-a04a-77bf9830f838', '05a674c8-31fe-4763-bb6c-19011eea1b3e', '1fbcb15a-291a-471c-ab40-63d31695c551', 'Kola', 2.50, 1, 2.50, NULL, '2025-11-20 00:36:40.575376', '2025-11-20 00:36:40.575376'),
('f7d57f6c-7987-48bf-ae53-933f5f1d2863', 'fb672de5-efbb-4850-baf7-4634befbd491', 'e1580ead-44e7-4d64-aee9-41f2dc162019', 'hhh', 5.00, 1, 5.00, NULL, '2025-11-20 21:53:35.873684', '2025-11-20 21:53:35.873684'),
('f8c8f014-3bbf-4a40-98c0-34abcb634f77', '71dff258-6018-4cc8-99aa-1b19e2f06400', 'd27041bd-75ea-4f29-a8fa-c953e835a38f', 'Sıcak Çikolata', 4.00, 1, 4.00, NULL, '2025-11-20 20:00:01.386837', '2025-11-20 20:00:01.386837'),
('f8ede847-6801-4a1c-9723-683707c65ce6', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-20 00:03:36.387683', '2025-11-20 00:03:36.387683'),
('f9835797-7e42-4f42-9a24-2e394ef8ce9d', 'd67361c7-7a43-41dc-933a-3254ddf783fb', 'e1580ead-44e7-4d64-aee9-41f2dc162019', 'hhh', 5.00, 1, 5.00, NULL, '2025-11-20 21:39:42.930299', '2025-11-20 21:39:42.930299'),
('f9bf4da9-53b2-497e-85bc-fcf835414675', '975aa529-0bc1-4dfe-8181-4ef70bf0ae42', '6eabbd96-f0e0-4aae-b650-8b443e622014', '4 Peynirli Pizza', 10.50, 1, 10.50, NULL, '2025-11-20 00:56:07.810533', '2025-11-20 00:56:07.810533'),
('f9ccdb21-8647-4a4c-bd3f-98d30700f5d1', '0a758758-bd65-41ce-a593-6bba22b9ed82', 'fac9e673-c726-421e-92a5-91d9b66c6bfa', 'OKAkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkbggggggggggggggggggggg', 5.00, 7, 35.00, NULL, '2025-11-20 18:56:56.689969', '2025-11-20 18:56:58.000000'),
('fb6d5c87-b78d-4a9a-9c2a-0b029a50a951', '160d543a-c9d6-4227-b091-589eed711202', '99a960cc-9f42-4fda-8b2d-ed8d60cd7bdf', 'OKA', 5.00, 1, 5.00, NULL, '2025-11-19 23:01:00.237251', '2025-11-19 23:01:00.237251'),
('fbbe7857-bcf2-467f-9459-873c9df9a596', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '93f15745-9164-422e-b9d5-0274f983ca10', 'Cheese Burger', 3.90, 1, 3.90, NULL, '2025-11-19 23:48:33.599807', '2025-11-19 23:48:33.599807'),
('fc812407-fccd-4547-bdb5-ff2b70aa3677', '31ff0b36-3cd1-4093-b6e6-70b6acbbb654', '14c23a20-df63-4669-beb3-fbf251b18ff8', 'Cappuccino', 4.00, 1, 4.00, NULL, '2025-11-20 19:54:14.442125', '2025-11-20 19:54:14.442125'),
('fe3b482b-6432-4f33-ad6a-b08417473f89', '7007f1f0-d646-4d54-aa8d-67e2a607028d', 'dbc0e029-aa92-4989-93de-69e46a6b8f46', 'Limonata', 3.50, 1, 3.50, NULL, '2025-11-19 23:46:43.858230', '2025-11-19 23:46:43.858230'),
('fecf622b-76ce-473d-8fcf-16171619c1c2', '7007f1f0-d646-4d54-aa8d-67e2a607028d', '5c7fa6ec-2b12-4ec0-8e8f-51388b40588e', 'Tavuklu Pide', 6.50, 1, 6.50, NULL, '2025-11-19 23:47:33.094515', '2025-11-19 23:47:33.094515');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `packages`
--

CREATE TABLE `packages` (
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `features` text NOT NULL,
  `duration` int(11) NOT NULL,
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `displayOrder` int(11) NOT NULL DEFAULT 0,
  `id` varchar(36) NOT NULL,
  `description` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `price1Month` decimal(10,2) DEFAULT NULL,
  `price6Months` decimal(10,2) DEFAULT NULL,
  `price12Months` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `packages`
--

INSERT INTO `packages` (`name`, `price`, `features`, `duration`, `isActive`, `displayOrder`, `id`, `description`, `createdAt`, `updatedAt`, `price1Month`, `price6Months`, `price12Months`) VALUES
('Demo Paket', 199.99, '[\"Tüm özellikler\",\"Sınırsız kullanıcı\",\"7/24 destek\",\"Demo amaçlı\",\"Test için ideal\"]', 30, 1, 0, '2f767ce0-4a47-4c93-a4a1-dd1de545677e', 'Sistemin tüm özelliklerini test etmek için demo paket', '2025-11-15 20:22:24.807144', '2025-11-18 17:47:43.000000', NULL, NULL, NULL),
('Demo Paket', 99.99, '[\"Sınırsız ürün yönetimi\",\"Masa rezervasyon sistemi\",\"Temel raporlama\",\"Mobil uyumlu arayüz\",\"Email desteği\",\"Aylık güncellemeler\"]', 30, 1, 0, '75c5f79f-1d33-4650-bb76-8edafbb86a1d', 'Bu bir demo pakettir. Restoran yönetimi için temel özellikler içerir.', '2025-11-18 17:56:07.644090', '2025-11-18 17:56:07.644090', 99.99, 549.99, 999.99),
('Profesyonel Paket', 599.99, '[\"Tüm Temel Paket özellikleri\",\"Gelişmiş stok yönetimi\",\"Çoklu kullanıcı desteği\",\"Detaylı raporlar ve analizler\",\"Ödeme entegrasyonu\",\"7/24 telefon desteği\"]', 30, 1, 2, '7d8b2ddd-ee3d-427d-9167-917d27a967b5', 'Orta ölçekli restoranlar için kapsamlı çözüm', '2025-11-09 23:07:25.354514', '2025-11-09 23:07:25.354514', NULL, NULL, NULL),
('Temel Paket', 299.99, '[\"Sipariş yönetimi vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv\",\"Temel stok takibi\",\"Masa yönetimi\",\"Temel raporlar\",\"Email desteği\"]', 30, 1, 1, 'c4a17e75-3383-4dfc-a8af-fab98bccd11c', 'Küçük restoranlar için ideal başlangıç paketi', '2025-11-09 23:07:25.343571', '2025-11-15 20:10:26.000000', NULL, NULL, NULL),
('Kurumsal Paket', 1299.99, '[\"Tüm Profesyonel Paket özellikleri\",\"Çoklu şube yönetimi\",\"Merkezi kontrol paneli\",\"Özel entegrasyonlar\",\"Özel eğitim ve danışmanlık\",\"Öncelikli destek\",\"Özel geliştirmeler\"]', 30, 1, 3, 'e321fdf3-f050-43c5-b547-dac869bb50db', 'Büyük restoran zincirleri için kurumsal çözüm', '2025-11-09 23:07:25.360455', '2025-11-09 23:07:25.360455', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `payments`
--

CREATE TABLE `payments` (
  `id` varchar(36) NOT NULL,
  `restaurantId` varchar(255) NOT NULL,
  `orderId` varchar(255) DEFAULT NULL,
  `cashRegisterId` varchar(255) DEFAULT NULL,
  `method` enum('cash','card','qr','other') NOT NULL DEFAULT 'cash',
  `type` enum('payment','refund','cancellation') NOT NULL DEFAULT 'payment',
  `amount` decimal(10,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `payments`
--

INSERT INTO `payments` (`id`, `restaurantId`, `orderId`, `cashRegisterId`, `method`, `type`, `amount`, `notes`, `createdAt`, `updatedAt`) VALUES
('043fc971-5949-4288-b047-83c773f567f1', '95fd053e-dffd-4547-83a9-0a5a9695d273', '71dff258-6018-4cc8-99aa-1b19e2f06400', NULL, 'cash', 'payment', 19.03, NULL, '2025-11-20 20:50:39.136272', '2025-11-20 20:50:39.136272'),
('0ca1e5f2-a16d-4f63-983a-7b113f4569c9', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'a40a83e6-fc42-4a29-93a7-1a2ac908c68f', NULL, 'cash', 'payment', 70.81, NULL, '2025-11-19 23:50:25.881980', '2025-11-19 23:50:25.881980'),
('1aaf6554-48fc-4597-93e2-4f3aadef158e', '95fd053e-dffd-4547-83a9-0a5a9695d273', '31ff0b36-3cd1-4093-b6e6-70b6acbbb654', NULL, 'cash', 'payment', 19.03, NULL, '2025-11-20 19:57:18.652896', '2025-11-20 19:57:18.652896'),
('273608fc-3e55-4786-af3d-eeedbdadcdb7', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'bc40052c-7845-4c41-a60d-430ba254dc96', NULL, 'cash', 'payment', 315.45, NULL, '2025-11-20 18:55:43.566453', '2025-11-20 18:55:43.566453'),
('2fee3675-be7c-4473-8b5a-675323540c41', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'cd6b1b82-9305-4b3e-a08a-1cb3ef10b067', NULL, 'cash', 'payment', 151.09, NULL, '2025-11-20 00:02:11.177105', '2025-11-20 00:02:11.177105'),
('33599d36-5306-4bcf-84bd-262ec4d72e5d', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'abb452fc-1df0-4802-ad37-0c22615ed3bf', NULL, 'cash', 'payment', 94.41, NULL, '2025-11-19 23:35:16.703102', '2025-11-19 23:35:16.703102'),
('3e1d1b9c-1be6-4de7-8763-88c139f53e17', '95fd053e-dffd-4547-83a9-0a5a9695d273', '6fa12397-0074-4ece-935e-ce28e9f1e27d', NULL, 'cash', 'payment', 383.51, NULL, '2025-11-19 23:50:04.961990', '2025-11-19 23:50:04.961990'),
('4b8a13ed-3405-4947-ba57-b5d445ccefa1', '95fd053e-dffd-4547-83a9-0a5a9695d273', '1e4086a6-cc7d-48f7-946b-3cff2cbba700', NULL, 'cash', 'payment', 129.85, NULL, '2025-11-20 19:57:32.696807', '2025-11-20 19:57:32.696807'),
('4d396011-6f0b-4092-9852-80ab64ecb50b', '95fd053e-dffd-4547-83a9-0a5a9695d273', '3ad1ecfd-af0d-4dc0-b759-4c1f25a1d307', NULL, 'cash', 'payment', 2.93, NULL, '2025-11-20 21:17:51.777341', '2025-11-20 21:17:51.777341'),
('57b061b3-0f2e-4018-b204-820edda8b7f1', '95fd053e-dffd-4547-83a9-0a5a9695d273', '412c5e24-7ee3-45ff-9d85-da0e98840e7c', NULL, 'cash', 'payment', 241.91, NULL, '2025-11-19 23:50:37.311370', '2025-11-19 23:50:37.311370'),
('618d4b1d-429d-4e48-ba9a-a95c5b788bbc', '95fd053e-dffd-4547-83a9-0a5a9695d273', '82e15b01-6e49-4406-8b78-a2b9e0efcd61', NULL, 'cash', 'payment', 5.00, NULL, '2025-11-20 19:57:36.165841', '2025-11-20 19:57:36.165841'),
('65e7f0c1-27f1-4cae-97d0-6b615b9f05e7', '95fd053e-dffd-4547-83a9-0a5a9695d273', '74e68e65-5009-4abf-87e3-a947106d0d05', NULL, 'cash', 'payment', -0.01, NULL, '2025-11-20 20:50:25.076848', '2025-11-20 20:50:25.076848'),
('6d9bb5d4-f636-4c52-a476-104e2dfcb656', '95fd053e-dffd-4547-83a9-0a5a9695d273', '760a68b3-0f63-40b5-b9da-981de0c5ca56', NULL, 'cash', 'payment', 11.80, NULL, '2025-11-20 19:57:42.034611', '2025-11-20 19:57:42.034611'),
('75450d4c-afed-439b-b7a1-2e3a9142d9a3', '95fd053e-dffd-4547-83a9-0a5a9695d273', '8e87d377-69c1-4a83-9a10-0f1ed8e13ba3', NULL, 'cash', 'payment', 11.80, NULL, '2025-11-19 23:50:12.161180', '2025-11-19 23:50:12.161180'),
('79717904-a7b9-4c83-9ed5-74e2a1312858', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'd38192c2-7b89-4554-8e43-65d3fa72a3ff', NULL, 'cash', 'payment', 5.90, NULL, '2025-11-19 23:50:22.265392', '2025-11-19 23:50:22.265392'),
('7f30c069-e168-43df-a15c-78a8de3e970e', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'b8e325e0-aa5b-454a-8f4f-d4cf3b0cd368', NULL, 'cash', 'payment', 5.89, NULL, '2025-11-20 21:17:46.905340', '2025-11-20 21:17:46.905340'),
('82fbcd95-ab7a-4bbf-88e5-b815f6d3fb66', '95fd053e-dffd-4547-83a9-0a5a9695d273', '811ab02d-9372-4701-8685-3f2533fecdd2', NULL, 'cash', 'payment', 0.01, NULL, '2025-11-20 21:24:30.607433', '2025-11-20 21:24:30.607433'),
('85abe878-f83e-4cf5-a330-f83bdd44908d', '95fd053e-dffd-4547-83a9-0a5a9695d273', '25f83be7-5d33-4921-a246-6d4ab08691ff', NULL, 'cash', 'payment', 5.90, NULL, '2025-11-19 23:50:08.493467', '2025-11-19 23:50:08.493467'),
('8a937757-c706-42d2-bd56-790ed056cbfa', '95fd053e-dffd-4547-83a9-0a5a9695d273', '3abc46da-a2c1-416a-9b63-304fff5b82a0', NULL, 'cash', 'payment', 5.90, NULL, '2025-11-19 23:50:15.843388', '2025-11-19 23:50:15.843388'),
('8df31d34-df91-4b90-9b22-9863bdb09c6c', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'cdf5904e-d95d-4e07-bc2d-21919b919642', NULL, 'cash', 'payment', -0.01, NULL, '2025-11-20 19:57:28.474550', '2025-11-20 19:57:28.474550'),
('927e23a7-0e1e-4a8a-9cdd-0aa8bb8371b0', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'f6b4355a-aac4-437a-9f7b-f4689f8e24e3', NULL, 'cash', 'payment', 22.46, NULL, '2025-11-20 21:47:27.347623', '2025-11-20 21:47:27.347623'),
('9d976802-5278-4ec6-bd8f-5f3971918618', '95fd053e-dffd-4547-83a9-0a5a9695d273', '05a674c8-31fe-4763-bb6c-19011eea1b3e', NULL, 'cash', 'payment', 17.71, NULL, '2025-11-20 19:57:39.177684', '2025-11-20 19:57:39.177684'),
('a67e8ed9-e5b8-4a6b-8e4b-885fdfcfbe34', '95fd053e-dffd-4547-83a9-0a5a9695d273', '2963f1ec-f15c-4a58-b478-67a8747073b2', NULL, 'cash', 'payment', 5.88, NULL, '2025-11-20 21:30:24.924046', '2025-11-20 21:30:24.924046'),
('bf0ef7de-4401-406e-a093-63721bee5ad3', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'fc5e87b7-7837-4cce-855e-4b5b2370246a', NULL, 'cash', 'payment', 1026.61, NULL, '2025-11-19 23:50:19.356939', '2025-11-19 23:50:19.356939'),
('c096d9e2-2042-4e35-ae87-489c3b12b376', '95fd053e-dffd-4547-83a9-0a5a9695d273', '0a758758-bd65-41ce-a593-6bba22b9ed82', NULL, 'cash', 'payment', 35.41, NULL, '2025-11-20 21:24:45.228561', '2025-11-20 21:24:45.228561'),
('cb077950-ce35-4d4e-bc6d-2ad6e8aeac6b', '95fd053e-dffd-4547-83a9-0a5a9695d273', '160d543a-c9d6-4227-b091-589eed711202', NULL, 'cash', 'payment', 5.90, NULL, '2025-11-19 23:50:32.169009', '2025-11-19 23:50:32.169009'),
('ce9dcc44-f2a8-49d6-8abc-036508c2e3d1', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'd29a1ba7-1608-4a76-b705-2095df0c01c2', NULL, 'cash', 'payment', 5.02, NULL, '2025-11-20 19:57:44.583679', '2025-11-20 19:57:44.583679'),
('d4e60f9a-62a4-4b61-8c97-6d7ef2f98c54', '95fd053e-dffd-4547-83a9-0a5a9695d273', '2d992f85-5edf-4362-921c-900eed2b165d', NULL, 'cash', 'payment', 0.04, NULL, '2025-11-20 20:50:31.585027', '2025-11-20 20:50:31.585027'),
('d54596b0-986c-451d-9244-513c1143ff1e', '95fd053e-dffd-4547-83a9-0a5a9695d273', '975aa529-0bc1-4dfe-8181-4ef70bf0ae42', NULL, 'cash', 'payment', 62.53, NULL, '2025-11-20 18:55:56.282636', '2025-11-20 18:55:56.282636'),
('f0061641-06a6-48ec-b689-cb15d2013f93', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'e08dae62-ab51-403a-b048-07b9281acd0b', NULL, 'cash', 'payment', 2.50, NULL, '2025-11-20 21:24:34.659665', '2025-11-20 21:24:34.659665'),
('f3b303f5-fc8d-4376-8489-0897d72d116d', '95fd053e-dffd-4547-83a9-0a5a9695d273', '8a394ae7-7838-493b-8c90-d2aad48e9cdc', NULL, 'cash', 'payment', 5.89, NULL, '2025-11-20 21:24:39.282579', '2025-11-20 21:24:39.282579'),
('fee07496-59ac-4d14-a333-64524d8447ef', '95fd053e-dffd-4547-83a9-0a5a9695d273', '48f867f1-0eec-4763-a079-1f4e51657f33', NULL, 'cash', 'payment', 5.03, NULL, '2025-11-19 23:50:28.894064', '2025-11-19 23:50:28.894064'),
('ff2cfd64-d216-45d2-8942-7746496450b7', '95fd053e-dffd-4547-83a9-0a5a9695d273', '7007f1f0-d646-4d54-aa8d-67e2a607028d', NULL, 'cash', 'payment', 253.78, NULL, '2025-11-19 23:50:34.482170', '2025-11-19 23:50:34.482170');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `payment_logs`
--

CREATE TABLE `payment_logs` (
  `id` varchar(36) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `month` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `status` enum('pending','paid','overdue','cancelled') NOT NULL DEFAULT 'pending',
  `paymentDate` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `subscriptionId` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `payment_logs`
--

INSERT INTO `payment_logs` (`id`, `amount`, `month`, `year`, `status`, `paymentDate`, `notes`, `createdAt`, `updatedAt`, `subscriptionId`) VALUES
('09b4cf34-0444-4690-87b1-e4e5fbac83d0', 99.99, 4, 2026, 'paid', '2026-02-18 19:46:05', NULL, '2025-11-19 19:46:05.294828', '2025-11-19 19:46:05.294828', ''),
('0fa9f2bc-3703-430e-b4a9-8909eaed2a12', 1299.99, 2, 2025, 'paid', '2025-12-14 19:46:05', NULL, '2025-11-19 19:46:05.261063', '2025-11-19 19:46:05.261063', ''),
('15c15cd7-c172-4907-ad5f-11d60db5b48e', 1299.99, 6, 2026, 'paid', '2026-04-14 19:46:05', NULL, '2025-11-19 19:46:05.270867', '2025-11-19 19:46:05.270867', ''),
('1d1d98ab-235f-45bf-974c-ce15e6450c45', 1299.99, 9, 2026, 'paid', '2026-07-14 19:46:05', NULL, '2025-11-19 19:46:05.275385', '2025-11-19 19:46:05.275385', ''),
('2855615d-fbde-49ff-bd85-fa42759c343f', 199.99, 8, 2026, 'paid', '2026-06-05 19:46:05', NULL, '2025-11-19 19:46:05.235721', '2025-11-19 19:46:05.235721', ''),
('2c04d672-f18b-485a-9e55-8515a26940a8', 199.99, 7, 2026, 'paid', '2026-05-05 19:46:05', NULL, '2025-11-19 19:46:05.233720', '2025-11-19 19:46:05.233720', ''),
('2c9c275b-7b8a-4a88-bf74-4a87f5bb9735', 199.99, 1, 2025, 'paid', '2025-11-05 19:46:05', NULL, '2025-11-19 19:46:05.216552', '2025-11-19 19:46:05.216552', ''),
('32555077-71d6-43d6-87dd-204aeeaf1cd1', 199.99, 10, 2026, 'pending', NULL, NULL, '2025-11-19 19:46:05.238749', '2025-11-19 19:46:05.238749', ''),
('3517e3b1-4ab8-4c86-8961-23291767e801', 99.99, 4, 2026, 'paid', '2026-02-02 19:46:05', NULL, '2025-11-19 19:46:05.336195', '2025-11-19 19:46:05.336195', ''),
('3b4bd0a3-7f9a-48ad-8f5d-addd8be49c6f', 199.99, 12, 2025, 'pending', NULL, '2. ay ödemesi', '2025-11-19 19:52:52.602495', '2025-11-19 19:52:52.602495', ''),
('4eda6e0d-02d1-4c2d-a0f5-7db6a26fa78d', 199.99, 2, 2025, 'paid', '2025-12-05 19:46:05', NULL, '2025-11-19 19:46:05.221056', '2025-11-19 19:46:05.221056', ''),
('5747b22b-13dc-479f-a78b-78f2a31f0412', 199.99, 12, 2026, 'paid', '2026-10-05 19:46:05', NULL, '2025-11-19 19:46:05.241616', '2025-11-19 19:46:05.241616', ''),
('5acd9cbe-9afa-46e7-a6ef-de1dc6a37dd2', 1299.99, 3, 2026, 'paid', '2026-01-14 19:46:05', NULL, '2025-11-19 19:46:05.264522', '2025-11-19 19:46:05.264522', ''),
('62071b9e-1b4e-4fb8-8831-999e0b48a245', 99.99, 2, 2025, 'paid', '2025-12-18 19:46:05', NULL, '2025-11-19 19:46:05.291903', '2025-11-19 19:46:05.291903', ''),
('673c9ba6-3910-43d9-a714-d23debc0b67f', 99.99, 5, 2026, 'pending', NULL, NULL, '2025-11-19 19:46:05.337612', '2025-11-19 19:46:05.337612', ''),
('6a5ca38e-e5d9-416d-a20c-ec8167c49c95', 199.99, 4, 2026, 'pending', NULL, NULL, '2025-11-19 19:46:05.228153', '2025-11-19 19:46:05.228153', ''),
('6a893f69-0a39-40ca-9db6-f897ac9149a4', 99.99, 1, 2025, 'paid', '2025-11-02 19:46:05', NULL, '2025-11-19 19:46:05.317199', '2025-11-19 19:46:05.317199', ''),
('6c2e7a5d-83f0-489f-9314-82c69b528d19', 99.99, 3, 2026, 'paid', '2026-01-18 19:46:05', NULL, '2025-11-19 19:46:05.293414', '2025-11-19 19:46:05.293414', ''),
('78b99466-f2bb-40b3-a941-c5a9d5255f52', 1299.99, 12, 2026, 'pending', NULL, NULL, '2025-11-19 19:46:05.279564', '2025-11-19 19:46:05.279564', ''),
('7fc71b4b-a912-4d61-9993-25c9f00c0cb8', 199.99, 5, 2026, 'paid', '2026-03-05 19:46:05', NULL, '2025-11-19 19:46:05.229795', '2025-11-19 19:46:05.229795', ''),
('8757108d-f83d-42e1-aa9a-70d081f8fa9f', 1299.99, 4, 2026, 'pending', NULL, NULL, '2025-11-19 19:46:05.267979', '2025-11-19 19:46:05.267979', ''),
('8af51f14-8873-415d-b4d4-138489d5beb8', 199.99, 9, 2026, 'paid', '2026-07-05 19:46:05', NULL, '2025-11-19 19:46:05.237336', '2025-11-19 19:46:05.237336', ''),
('953a1bb9-ab06-4b5c-b586-a399ed8443aa', 1299.99, 8, 2026, 'pending', NULL, NULL, '2025-11-19 19:46:05.273769', '2025-11-19 19:46:05.273769', ''),
('a1e60c47-86c2-416d-b7ce-a087a9d074ec', 99.99, 3, 2026, 'paid', '2026-01-02 19:46:05', NULL, '2025-11-19 19:46:05.334457', '2025-11-19 19:46:05.334457', ''),
('b4c30676-01ef-4f44-a206-7af01b675f78', 99.99, 1, 2025, 'paid', '2025-11-02 19:46:05', NULL, '2025-11-19 19:46:05.330747', '2025-11-19 19:46:05.330747', ''),
('b6d1a796-1c98-4cc6-885c-9fb56e3399a2', 199.99, 11, 2025, 'pending', NULL, '1. ay ödemesi', '2025-11-19 19:52:52.600481', '2025-11-19 19:52:52.600481', ''),
('b9865609-e738-4ac6-b843-95ba0c35c268', 199.99, 3, 2026, 'paid', '2026-01-05 19:46:05', NULL, '2025-11-19 19:46:05.226523', '2025-11-19 19:46:05.226523', ''),
('c1c8fd2e-04ba-4bcd-bb12-cdde246b8e2f', 1299.99, 7, 2026, 'pending', NULL, NULL, '2025-11-19 19:46:05.272266', '2025-11-19 19:46:05.272266', ''),
('c405268d-eb15-41b3-835b-9ef3c82a8bb8', 99.99, 2, 2025, 'paid', '2025-12-02 19:46:05', NULL, '2025-11-19 19:46:05.332923', '2025-11-19 19:46:05.332923', ''),
('d1d8b59f-0529-4ed7-b1a0-96e750ccd07a', 99.99, 6, 2026, 'pending', NULL, NULL, '2025-11-19 19:46:05.338979', '2025-11-19 19:46:05.338979', ''),
('dbca8fcb-52a3-4b88-83fd-52cb2eb0a9bf', 99.99, 5, 2026, 'paid', '2026-03-18 19:46:05', NULL, '2025-11-19 19:46:05.296193', '2025-11-19 19:46:05.296193', ''),
('dc5adddf-1a6f-4c9b-b9ac-600d6b066d6f', 99.99, 1, 2025, 'paid', '2025-11-18 19:46:05', NULL, '2025-11-19 19:46:05.289837', '2025-11-19 19:46:05.289837', ''),
('e28bee65-30d0-43b2-aed4-05b099968526', 1299.99, 11, 2026, 'paid', '2026-09-14 19:46:05', NULL, '2025-11-19 19:46:05.278159', '2025-11-19 19:46:05.278159', ''),
('e85aeeb4-b604-40e8-b95c-4c3bbb190a01', 1299.99, 10, 2026, 'pending', NULL, NULL, '2025-11-19 19:46:05.276769', '2025-11-19 19:46:05.276769', ''),
('ea0b2dc3-5daa-40d1-b05a-4d5444024bd6', 99.99, 6, 2026, 'paid', '2026-04-18 19:46:05', NULL, '2025-11-19 19:46:05.297555', '2025-11-19 19:46:05.297555', ''),
('ec0756fb-ba45-4e62-a875-937dd7e3e83a', 1299.99, 5, 2026, 'paid', '2026-03-14 19:46:05', NULL, '2025-11-19 19:46:05.269439', '2025-11-19 19:46:05.269439', ''),
('ee955ea8-82d4-4c47-91ab-ae3443d84b4f', 199.99, 11, 2026, 'paid', '2026-09-05 19:46:05', NULL, '2025-11-19 19:46:05.240167', '2025-11-19 19:46:05.240167', ''),
('f3647c4a-b126-498c-bd64-91a127ae0eb7', 1299.99, 1, 2025, 'paid', '2025-11-14 19:46:05', NULL, '2025-11-19 19:46:05.258736', '2025-11-19 19:46:05.258736', ''),
('f58ea192-1f36-4535-9266-e4ba3e2c3a8e', 199.99, 6, 2026, 'pending', NULL, NULL, '2025-11-19 19:46:05.232040', '2025-11-19 19:46:05.232040', ''),
('f9dc285f-b1ce-4cfa-9db9-c6ee1de04bdd', 199.99, 1, 2026, 'pending', NULL, '3. ay ödemesi', '2025-11-19 19:52:52.603774', '2025-11-19 19:52:52.603774', '');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `products`
--

CREATE TABLE `products` (
  `id` varchar(36) NOT NULL,
  `restaurantId` varchar(255) NOT NULL,
  `groupId` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `isAvailable` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `products`
--

INSERT INTO `products` (`id`, `restaurantId`, `groupId`, `name`, `description`, `price`, `barcode`, `isActive`, `isAvailable`, `createdAt`, `updatedAt`, `image`) VALUES
('0d84f7eb-4ae9-46e8-bf45-52026b3ff281', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'e2fd40c4-5b7e-4033-9988-a55e4290ba33', 'Lahmacun', NULL, 4.50, NULL, 1, 1, '2025-11-19 23:46:00.494330', '2025-11-19 23:46:00.494330', NULL),
('0e1d85de-44d9-4505-b675-a7b0b19c3f18', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'aa507439-480d-421a-bae2-bcdd1461f4f2', 'Latte', NULL, 4.50, NULL, 1, 1, '2025-11-19 23:46:00.529283', '2025-11-19 23:46:00.529283', NULL),
('14c23a20-df63-4669-beb3-fbf251b18ff8', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'aa507439-480d-421a-bae2-bcdd1461f4f2', 'Cappuccino', NULL, 4.00, NULL, 1, 1, '2025-11-19 23:46:00.524658', '2025-11-19 23:46:00.524658', NULL),
('1fbcb15a-291a-471c-ab40-63d31695c551', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'fa1c6906-22b3-4b61-ac24-3d32f2e7dcd8', 'Kola', NULL, 2.50, NULL, 1, 1, '2025-11-19 23:46:00.563162', '2025-11-19 23:46:00.563162', NULL),
('2eb3c163-a07b-46da-a1f1-6bfbb5faf85f', '95fd053e-dffd-4547-83a9-0a5a9695d273', '2547e7c9-e003-4ca5-b834-456cb809c7a3', 'Çoban Salatası', NULL, 5.50, NULL, 1, 1, '2025-11-19 23:46:00.499136', '2025-11-19 23:46:00.499136', NULL),
('31914e98-914c-46d5-b467-a1fa4461782b', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'fecb92fe-a185-468b-b2bf-580d67b5eb1c', 'Kaşarlı Pide', NULL, 6.00, NULL, 1, 1, '2025-11-19 23:46:00.488912', '2025-11-19 23:46:00.488912', NULL),
('3675ac7e-8556-4e29-bffb-32b4f45fd98b', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'aa507439-480d-421a-bae2-bcdd1461f4f2', 'Türk Kahvesi', NULL, 3.00, NULL, 1, 1, '2025-11-19 23:46:00.515249', '2025-11-19 23:46:00.515249', NULL),
('42182cf0-2fc2-4a24-9ed7-02c54dd1b1e8', '95fd053e-dffd-4547-83a9-0a5a9695d273', NULL, '50', NULL, 25.00, NULL, 1, 1, '2025-11-19 23:14:00.557468', '2025-11-19 23:14:00.557468', NULL),
('4f5925f5-81d3-4ea7-b580-d5cd71627e7f', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'fecb92fe-a185-468b-b2bf-580d67b5eb1c', 'Kıymalı Pide', NULL, 7.00, NULL, 1, 1, '2025-11-19 23:46:00.484349', '2025-11-19 23:46:00.484349', NULL),
('4f61d23b-cb4c-4344-985c-2933684b696c', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'b29e4aa6-a2e7-450a-a77a-537b64cea80c', 'Piña Colada', NULL, 9.00, NULL, 1, 1, '2025-11-19 23:46:00.548464', '2025-11-19 23:46:00.548464', NULL),
('5a81a5d8-7d6e-40d6-bc26-da8e89bfe39e', '95fd053e-dffd-4547-83a9-0a5a9695d273', '9749005d-a167-4933-8117-bb26c9d79b80', 'Black Burger MAL', NULL, 4.50, NULL, 1, 1, '2025-11-19 23:46:00.434518', '2025-11-19 23:46:00.434518', NULL),
('5c7fa6ec-2b12-4ec0-8e8f-51388b40588e', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'fecb92fe-a185-468b-b2bf-580d67b5eb1c', 'Tavuklu Pide', NULL, 6.50, NULL, 1, 1, '2025-11-19 23:46:00.479639', '2025-11-19 23:46:00.479639', NULL),
('631452f0-59cb-4ba3-992d-dcdcf2bc3df7', '95fd053e-dffd-4547-83a9-0a5a9695d273', '8d532d61-812c-4e53-9054-7b4ccab3c025', 'Karışık Pizza', NULL, 11.00, NULL, 1, 1, '2025-11-19 23:46:00.475034', '2025-11-19 23:46:00.475034', NULL),
('6c2a8faa-ac72-47c2-807b-9cd32440fb42', '95fd053e-dffd-4547-83a9-0a5a9695d273', '1486baa3-943f-465c-9b51-014751ca4251', 'Çikolatalı Dondurma', NULL, 5.00, NULL, 1, 1, '2025-11-19 23:46:00.571233', '2025-11-19 23:46:00.571233', NULL),
('6eabbd96-f0e0-4aae-b650-8b443e622014', '95fd053e-dffd-4547-83a9-0a5a9695d273', '8d532d61-812c-4e53-9054-7b4ccab3c025', '4 Peynirli Pizza', NULL, 10.50, NULL, 1, 1, '2025-11-19 23:46:00.469057', '2025-11-19 23:46:00.469057', NULL),
('7722aa31-c21c-48cd-9616-7b689e82cd52', '95fd053e-dffd-4547-83a9-0a5a9695d273', '2547e7c9-e003-4ca5-b834-456cb809c7a3', 'Mevsim Salatası', NULL, 6.00, NULL, 1, 1, '2025-11-19 23:46:00.511106', '2025-11-19 23:46:00.511106', NULL),
('7b7e7bd4-fc95-4da8-a913-7e67cb418434', '95fd053e-dffd-4547-83a9-0a5a9695d273', '4b9041f6-7d74-42e7-9029-dc058ef5e19f', 'Çay', NULL, 2.00, NULL, 1, 1, '2025-11-19 23:46:00.533910', '2025-11-19 23:46:00.533910', NULL),
('8a50e378-79cc-4da8-912b-5bdc879b58cf', '95fd053e-dffd-4547-83a9-0a5a9695d273', '1486baa3-943f-465c-9b51-014751ca4251', 'Vanilyalı Dondurma', NULL, 5.00, NULL, 1, 1, '2025-11-19 23:46:00.575340', '2025-11-19 23:46:00.575340', NULL),
('93f15745-9164-422e-b9d5-0274f983ca10', '95fd053e-dffd-4547-83a9-0a5a9695d273', '9749005d-a167-4933-8117-bb26c9d79b80', 'Cheese Burger', NULL, 3.90, NULL, 1, 1, '2025-11-19 23:46:00.453951', '2025-11-19 23:46:00.453951', NULL),
('987e5ed7-4783-471b-8863-a017a37491c0', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'f5e9b2e9-3bae-41f2-a1bc-ad1e895ee4c4', 'ŞAURMA ROLL', NULL, 3.50, NULL, 1, 1, '2025-11-19 23:46:00.427353', '2025-11-19 23:46:00.427353', NULL),
('99a960cc-9f42-4fda-8b2d-ed8d60cd7bdf', '95fd053e-dffd-4547-83a9-0a5a9695d273', NULL, 'OKA', NULL, 5.00, NULL, 1, 1, '2025-11-19 22:56:48.767045', '2025-11-19 22:56:48.767045', NULL),
('9d137d40-5a17-4cb7-b40c-b429307f1c29', '95fd053e-dffd-4547-83a9-0a5a9695d273', '9749005d-a167-4933-8117-bb26c9d79b80', 'Black Burger Toyuq', NULL, 4.00, NULL, 1, 1, '2025-11-19 23:46:00.440507', '2025-11-19 23:46:00.440507', NULL),
('a60ae1b7-31f2-4d7c-af66-7d7b7aaacb64', '95fd053e-dffd-4547-83a9-0a5a9695d273', '8d532d61-812c-4e53-9054-7b4ccab3c025', 'Pepperoni Pizza', NULL, 9.50, NULL, 1, 1, '2025-11-19 23:46:00.464283', '2025-11-19 23:46:00.464283', NULL),
('b589ebf8-2b02-42bd-9085-dd7d53bd0224', '95fd053e-dffd-4547-83a9-0a5a9695d273', '8d532d61-812c-4e53-9054-7b4ccab3c025', 'Margherita Pizza', NULL, 8.50, NULL, 1, 1, '2025-11-19 23:46:00.459516', '2025-11-19 23:46:00.459516', NULL),
('b8589d85-df98-4d0e-b131-4528ae29ec35', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'aa507439-480d-421a-bae2-bcdd1461f4f2', 'Espresso', NULL, 3.50, NULL, 1, 1, '2025-11-19 23:46:00.519282', '2025-11-19 23:46:00.519282', NULL),
('be173ebf-05b6-4b58-b9fc-0d34b84960d3', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'b29e4aa6-a2e7-450a-a77a-537b64cea80c', 'Mojito', NULL, 8.00, NULL, 1, 1, '2025-11-19 23:46:00.544156', '2025-11-19 23:46:00.544156', NULL),
('d27041bd-75ea-4f29-a8fa-c953e835a38f', '95fd053e-dffd-4547-83a9-0a5a9695d273', '4b9041f6-7d74-42e7-9029-dc058ef5e19f', 'Sıcak Çikolata', NULL, 4.00, NULL, 1, 1, '2025-11-19 23:46:00.538206', '2025-11-19 23:46:00.538206', NULL),
('dbc0e029-aa92-4989-93de-69e46a6b8f46', '95fd053e-dffd-4547-83a9-0a5a9695d273', '142af7af-8f73-44d0-8141-df51e3661801', 'Limonata', NULL, 3.50, NULL, 1, 1, '2025-11-19 23:46:00.552845', '2025-11-19 23:46:00.552845', NULL),
('e1580ead-44e7-4d64-aee9-41f2dc162019', '95fd053e-dffd-4547-83a9-0a5a9695d273', NULL, 'hhh', NULL, 5.00, NULL, 1, 1, '2025-11-20 20:23:27.607377', '2025-11-20 20:23:27.607377', NULL),
('e6e84ee6-89c0-49d8-b7f9-5db2ab1eb89c', '95fd053e-dffd-4547-83a9-0a5a9695d273', '9749005d-a167-4933-8117-bb26c9d79b80', 'Qapalı Burger', NULL, 5.00, NULL, 1, 1, '2025-11-19 23:46:00.444895', '2025-11-19 23:46:00.444895', NULL),
('e9b45443-e08c-45ce-b4ca-82242284a692', '95fd053e-dffd-4547-83a9-0a5a9695d273', '9749005d-a167-4933-8117-bb26c9d79b80', 'Şef Burger', NULL, 5.00, NULL, 1, 1, '2025-11-19 23:46:00.449520', '2025-11-19 23:46:00.449520', NULL),
('ee1cf870-0a6e-42f6-a9f5-be27645bb0aa', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'fa1c6906-22b3-4b61-ac24-3d32f2e7dcd8', 'Portakal Suyu', NULL, 4.00, NULL, 1, 1, '2025-11-19 23:46:00.556643', '2025-11-19 23:46:00.556643', NULL),
('fac9e673-c726-421e-92a5-91d9b66c6bfa', '95fd053e-dffd-4547-83a9-0a5a9695d273', NULL, 'OKAkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkbggggggggggggggggggggg', NULL, 5.00, NULL, 1, 1, '2025-11-20 18:40:20.728604', '2025-11-20 18:40:20.728604', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAhMAAAFuCAYAAAA795qmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAEy1SURBVHhe7Z0NfBXlne/PyUlCiPi2dW3uigZYlS5IV9dUc0W6CPWdVliRoCgNJJWXCAEBQ0iC3lZ3vauttnT9yO3Wi91VqK5h16LWVxRFRSlWQREqi3ARA'),
('fd539fa4-b3e7-4835-9a2c-9f7df4eb1125', '95fd053e-dffd-4547-83a9-0a5a9695d273', '2547e7c9-e003-4ca5-b834-456cb809c7a3', 'Sezar Salata', NULL, 7.50, NULL, 1, 1, '2025-11-19 23:46:00.505965', '2025-11-19 23:46:00.505965', NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `product_groups`
--

CREATE TABLE `product_groups` (
  `id` varchar(36) NOT NULL,
  `restaurantId` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `displayOrder` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `product_groups`
--

INSERT INTO `product_groups` (`id`, `restaurantId`, `name`, `description`, `displayOrder`, `isActive`, `createdAt`, `updatedAt`) VALUES
('072280a1-a2ee-4fca-904d-4785255ebceb', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'AAAAAAAAAAAA', '', 4, 1, '2025-11-19 22:46:20.394930', '2025-11-19 22:58:40.000000'),
('142af7af-8f73-44d0-8141-df51e3661801', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'BUZLU LİMONATLAR', 'BUZLU LİMONATLAR kategorisi', 0, 1, '2025-11-19 23:46:00.410566', '2025-11-19 23:46:00.410566'),
('1486baa3-943f-465c-9b51-014751ca4251', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'DONDURMA', 'DONDURMA kategorisi', 0, 1, '2025-11-19 23:46:00.420497', '2025-11-19 23:46:00.420497'),
('2547e7c9-e003-4ca5-b834-456cb809c7a3', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'SALATLAR', 'SALATLAR kategorisi', 0, 1, '2025-11-19 23:46:00.389439', '2025-11-19 23:46:00.389439'),
('4b9041f6-7d74-42e7-9029-dc058ef5e19f', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'İSDİ İÇKİLƏR', 'İSDİ İÇKİLƏR kategorisi', 0, 1, '2025-11-19 23:46:00.399783', '2025-11-19 23:46:00.399783'),
('5259e056-2659-41f2-b505-ab2fe924c358', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'CCCCCCC', '', 0, 1, '2025-11-19 22:46:11.411941', '2025-11-19 22:46:11.411941'),
('8d532d61-812c-4e53-9054-7b4ccab3c025', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'PİZZA', 'PİZZA kategorisi', 0, 1, '2025-11-19 23:46:00.373029', '2025-11-19 23:46:00.373029'),
('9749005d-a167-4933-8117-bb26c9d79b80', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'BURGERLƏR', 'BURGERLƏR kategorisi', 0, 1, '2025-11-19 23:46:00.363611', '2025-11-19 23:46:00.363611'),
('aa507439-480d-421a-bae2-bcdd1461f4f2', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'KOFE', 'KOFE kategorisi', 0, 1, '2025-11-19 23:46:00.393934', '2025-11-19 23:46:00.393934'),
('aaa51be2-6484-403e-9921-38df87769abb', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'DDDDDDDDDDDDDDDD', '', 0, 1, '2025-11-19 22:46:17.654636', '2025-11-19 22:46:17.654636'),
('b29e4aa6-a2e7-450a-a77a-537b64cea80c', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'KOKTEYL', 'KOKTEYL kategorisi', 0, 1, '2025-11-19 23:46:00.405166', '2025-11-19 23:46:00.405166'),
('e2490487-aa44-4c7e-9726-c422c306f16c', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'CCCCCCCCCCC', '', 0, 1, '2025-11-19 22:46:14.578171', '2025-11-19 22:46:14.578171'),
('e2fd40c4-5b7e-4033-9988-a55e4290ba33', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'LAHMAJUN', 'LAHMAJUN kategorisi', 0, 1, '2025-11-19 23:46:00.384208', '2025-11-19 23:46:00.384208'),
('e5f72309-a326-4097-a8c8-de98ac3ddba3', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'WWWWWWW', '', 0, 1, '2025-11-19 22:04:50.297972', '2025-11-19 22:04:50.297972'),
('f5e9b2e9-3bae-41f2-a1bc-ad1e895ee4c4', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'ŞAURMA ROLL', 'ŞAURMA ROLL kategorisi', 0, 1, '2025-11-19 23:46:00.356766', '2025-11-19 23:46:00.356766'),
('f71ba384-9b28-41c1-b69b-a40b4e276a0b', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'NNNNNNNNNNN', '', 0, 1, '2025-11-19 22:04:45.464592', '2025-11-19 22:04:45.464592'),
('fa1c6906-22b3-4b61-ac24-3d32f2e7dcd8', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'İÇKİLƏR', 'İÇKİLƏR kategorisi', 0, 1, '2025-11-19 23:46:00.414814', '2025-11-19 23:46:00.414814'),
('fecb92fe-a185-468b-b2bf-580d67b5eb1c', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'PİDE', 'PİDE kategorisi', 0, 1, '2025-11-19 23:46:00.378067', '2025-11-19 23:46:00.378067');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `restaurants`
--

CREATE TABLE `restaurants` (
  `id` varchar(36) NOT NULL,
  `subscriptionId` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `loginEmail` varchar(255) DEFAULT NULL,
  `loginPassword` varchar(255) NOT NULL,
  `loginLink` varchar(255) DEFAULT NULL,
  `maxTables` int(11) NOT NULL DEFAULT 10,
  `maxStaff` int(11) NOT NULL DEFAULT 5,
  `maxProducts` int(11) NOT NULL DEFAULT 100,
  `maxStockItems` int(11) NOT NULL DEFAULT 1000,
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `restaurants`
--

INSERT INTO `restaurants` (`id`, `subscriptionId`, `name`, `address`, `phone`, `email`, `loginEmail`, `loginPassword`, `loginLink`, `maxTables`, `maxStaff`, `maxProducts`, `maxStockItems`, `isActive`, `createdAt`, `updatedAt`) VALUES
('95fd053e-dffd-4547-83a9-0a5a9695d273', '39c1d981-ffa8-4b5b-aaa9-e133542071cc', 'salam', 'salam', '+994504243892', 'mustafa@example.com', 'mustafa@example.com', '$2a$10$7r/tf1oHwqgHQ.ipW/sMfuOuHkHUyfEubiMRNcgEqnPwH7XJG09AO', 'restaurant-39c1d981-exfo12', 10, 5, 100, 1000, 1, '2025-11-19 19:52:52.591805', '2025-11-19 19:52:52.591805');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `restaurant_users`
--

CREATE TABLE `restaurant_users` (
  `id` varchar(36) NOT NULL,
  `restaurantId` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','manager','waiter','cashier','stock_keeper') NOT NULL DEFAULT 'waiter',
  `permissions` text DEFAULT NULL,
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `settings`
--

CREATE TABLE `settings` (
  `id` varchar(36) NOT NULL,
  `whatsappNumber` varchar(255) DEFAULT NULL,
  `instagramUrl` varchar(255) DEFAULT NULL,
  `tiktokUrl` varchar(255) DEFAULT NULL,
  `facebookUrl` varchar(255) DEFAULT NULL,
  `twitterUrl` varchar(255) DEFAULT NULL,
  `linkedinUrl` varchar(255) DEFAULT NULL,
  `companyName` varchar(255) NOT NULL DEFAULT 'SmartCafe',
  `companyDescription` text DEFAULT NULL,
  `contactLink` varchar(255) DEFAULT NULL,
  `faqLink` varchar(255) DEFAULT NULL,
  `documentationLink` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `siteTitle` varchar(255) DEFAULT NULL,
  `metaDescription` text DEFAULT NULL,
  `metaKeywords` text DEFAULT NULL,
  `faviconUrl` varchar(255) DEFAULT NULL,
  `logoUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `key` varchar(255) DEFAULT NULL,
  `value` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `settings`
--

INSERT INTO `settings` (`id`, `whatsappNumber`, `instagramUrl`, `tiktokUrl`, `facebookUrl`, `twitterUrl`, `linkedinUrl`, `companyName`, `companyDescription`, `contactLink`, `faqLink`, `documentationLink`, `email`, `phone`, `siteTitle`, `metaDescription`, `metaKeywords`, `faviconUrl`, `logoUrl`, `createdAt`, `updatedAt`, `key`, `value`) VALUES
('277fd340-d1c5-453b-8de4-d3fe97336634', '+994504243892', NULL, NULL, NULL, NULL, NULL, 'SmartCafe', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-18 19:13:14.200074', '2025-11-18 19:28:09.000000', 'advertisingMessageTemplates', '[{\"id\":\"1763482394170\",\"name\":\"y\",\"content\":\"eeeeee\",\"createdAt\":\"2025-11-18T16:13:14.170Z\"},{\"id\":\"1763483288995\",\"name\":\"hhh\",\"content\":\"sssssssssssssss\",\"createdAt\":\"2025-11-18T16:28:08.995Z\"}]'),
('9abd25a2-52ff-42be-ae80-92688349445b', '+99450423892', NULL, NULL, NULL, NULL, NULL, 'SmartCafe', 'Restoranlar için modern ve kullanıcı dostu POS çözümü. Sipariş yönetiminden stok takibine kadar her şey tek platformda.', NULL, NULL, NULL, 'info@posrestaurant.com', '+90 (212) 123 45 67', NULL, NULL, NULL, NULL, NULL, '2025-11-15 21:06:02.126473', '2025-11-18 19:09:01.000000', NULL, NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `site_contents`
--

CREATE TABLE `site_contents` (
  `id` varchar(36) NOT NULL,
  `key` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `stocks`
--

CREATE TABLE `stocks` (
  `id` varchar(36) NOT NULL,
  `restaurantId` varchar(255) NOT NULL,
  `productId` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `purchasePrice` decimal(10,2) DEFAULT NULL,
  `salePrice` decimal(10,2) DEFAULT NULL,
  `quantity` decimal(10,2) NOT NULL DEFAULT 0.00,
  `unit` enum('piece','kg','liter','gram') NOT NULL DEFAULT 'piece',
  `minQuantity` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `displayOrder` int(11) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `stocks`
--

INSERT INTO `stocks` (`id`, `restaurantId`, `productId`, `name`, `barcode`, `purchasePrice`, `salePrice`, `quantity`, `unit`, `minQuantity`, `description`, `expiryDate`, `isActive`, `createdAt`, `updatedAt`, `displayOrder`, `image`) VALUES
('233e9baf-ad76-485a-a360-d4bb8ae119b3', '95fd053e-dffd-4547-83a9-0a5a9695d273', NULL, 'hhh', NULL, NULL, 5.00, 23.00, 'piece', 0.21, NULL, NULL, 1, '2025-11-19 22:39:16.525770', '2025-11-20 19:51:23.000000', 1, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAhMAAAFuCAYAAAA795qmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAEy1SURBVHhe7Z0NfBXlne/PyUlCiPi2dW3uigZYlS5IV9dUc0W6CPWdVliRoCgNJJWXCAEBQ0iC3lZ3vauttnT9yO3Wi91VqK5h16LWVxRFRSlWQREqi3ARA'),
('3caa8e76-f5f5-4985-8bf4-262c6135dbd1', '95fd053e-dffd-4547-83a9-0a5a9695d273', NULL, '.', NULL, NULL, NULL, 1.00, 'piece', NULL, NULL, NULL, 1, '2025-11-19 22:44:00.736100', '2025-11-19 22:44:00.736100', 0, NULL),
('8e1dd455-dd67-439a-9e3c-73adb7ab33e3', '95fd053e-dffd-4547-83a9-0a5a9695d273', NULL, '50', NULL, 2.00, 25.00, 23.00, 'piece', 0.01, NULL, NULL, 1, '2025-11-19 19:54:32.620865', '2025-11-19 22:39:30.000000', 0, NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(255) DEFAULT NULL,
  `packageId` varchar(255) NOT NULL,
  `status` enum('active','expired','cancelled') NOT NULL DEFAULT 'active',
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `restaurantName` varchar(255) DEFAULT NULL,
  `restaurantAddress` text DEFAULT NULL,
  `paymentStatus` enum('pending','paid') NOT NULL DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `customerName` varchar(255) DEFAULT NULL,
  `customerEmail` varchar(255) DEFAULT NULL,
  `customerPhone` varchar(255) DEFAULT NULL,
  `durationMonths` int(11) NOT NULL DEFAULT 1,
  `paymentType` enum('one_time','monthly') NOT NULL DEFAULT 'one_time',
  `customerLogin` varchar(255) DEFAULT NULL,
  `customerPassword` varchar(255) DEFAULT NULL,
  `customerId` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `userId`, `packageId`, `status`, `startDate`, `endDate`, `amount`, `createdAt`, `updatedAt`, `restaurantName`, `restaurantAddress`, `paymentStatus`, `notes`, `customerName`, `customerEmail`, `customerPhone`, `durationMonths`, `paymentType`, `customerLogin`, `customerPassword`, `customerId`) VALUES
('2afa7ef3-5521-4baf-9c09-68fec507c19f', NULL, '2f767ce0-4a47-4c93-a4a1-dd1de545677e', 'active', '2025-11-05 19:46:05', '2026-11-05 19:46:05', 2399.88, '2025-11-19 19:46:05.209234', '2025-11-19 19:46:05.209234', 'Tadım Restoran', 'Bakü, Füzuli Caddesi No:42', 'pending', 'Demo abonelik', 'Ayşe Demir', 'ayse@example.com', '+994501234568', 12, 'monthly', 'user10002', 'pass10002', '10002'),
('39c1d981-ffa8-4b5b-aaa9-e133542071cc', NULL, '2f767ce0-4a47-4c93-a4a1-dd1de545677e', 'active', '2025-11-26 03:00:00', '2026-02-26 03:00:00', 599.97, '2025-11-19 19:52:52.447209', '2025-11-19 19:52:52.447209', 'salam', 'salam', 'paid', NULL, 'EKIM VEKIM', 'mustafa@example.com', '+994504243892', 3, 'monthly', 'mustafa@example.com', '123admin', '50549'),
('439e0904-b119-4d0f-b182-47caf5124d0a', NULL, '75c5f79f-1d33-4650-bb76-8edafbb86a1d', 'active', '2025-11-02 19:46:05', '2026-05-02 19:46:05', 599.94, '2025-11-19 19:46:05.326104', '2025-11-19 19:46:05.326104', 'Harika Lezzet', 'Bakü, Səbail Caddesi No:90', 'pending', 'Demo abonelik', 'Selin Özkan', 'selin@example.com', '+994501234576', 6, 'monthly', 'user10010', 'pass10010', '10010'),
('64675ed6-3bee-4c3a-987a-c2f03373f0ab', NULL, 'c4a17e75-3383-4dfc-a8af-fab98bccd11c', 'active', '2025-10-24 19:46:05', '2026-01-24 19:46:05', 899.97, '2025-11-19 19:46:05.302049', '2025-11-19 19:46:05.302049', 'Lezzet Bahçesi', 'Bakü, Rasulzade Caddesi No:89', 'paid', 'Demo abonelik', 'Zeynep Arslan', 'zeynep@example.com', '+994501234572', 3, 'one_time', 'user10006', 'pass10006', '10006'),
('89afe83e-b32b-4b75-840a-ea2bdee45ef4', NULL, 'e321fdf3-f050-43c5-b547-dac869bb50db', 'active', '2025-11-14 19:46:05', '2026-11-14 19:46:05', 15599.88, '2025-11-19 19:46:05.252872', '2025-11-19 19:46:05.252872', 'Nefis Köşk', 'Bakü, Torgovaya Caddesi No:23', 'pending', 'Demo abonelik', 'Fatma Şahin', 'fatma@example.com', '+994501234570', 12, 'monthly', 'user10004', 'pass10004', '10004'),
('d59bea21-6fe2-46d0-9dc9-e3cacee70301', NULL, '7d8b2ddd-ee3d-427d-9167-917d27a967b5', 'active', '2025-10-24 19:46:05', '2026-01-24 19:46:05', 1799.97, '2025-11-19 19:46:05.246504', '2025-11-19 19:46:05.246504', 'Gurme Sofrası', 'Bakü, İstiqlaliyyet Caddesi No:78', 'paid', 'Demo abonelik', 'Mehmet Kaya', 'mehmet@example.com', '+994501234569', 3, 'one_time', 'user10003', 'pass10003', '10003'),
('f28b0093-3c88-497d-8625-e608510ade33', NULL, 'e321fdf3-f050-43c5-b547-dac869bb50db', 'active', '2025-11-16 19:46:05', '2026-02-16 19:46:05', 3899.97, '2025-11-19 19:46:05.321461', '2025-11-19 19:46:05.321461', 'Mükemmel Restoran', 'Bakü, Xətai Caddesi No:67', 'paid', 'Demo abonelik', 'Can Aydın', 'can@example.com', '+994501234575', 3, 'one_time', 'user10009', 'pass10009', '10009'),
('f30e5bdd-c1b2-4012-8a00-86ce5852fe64', NULL, '75c5f79f-1d33-4650-bb76-8edafbb86a1d', 'active', '2025-11-02 19:46:05', '2025-12-02 19:46:05', 99.99, '2025-11-19 19:46:05.311640', '2025-11-19 19:46:05.311640', 'Güzel Sofra', 'Bakü, Nəsimi Caddesi No:34', 'pending', 'Demo abonelik', 'Elif Yıldız', 'elif@example.com', '+994501234574', 1, 'monthly', 'user10008', 'pass10008', '10008'),
('f7d27678-739d-45a9-86b3-979424a24174', NULL, '75c5f79f-1d33-4650-bb76-8edafbb86a1d', 'active', '2025-11-13 19:46:05', '2025-12-13 19:46:05', 99.99, '2025-11-19 19:46:05.190865', '2025-11-19 19:46:05.190865', 'Lezzet Durağı', 'Bakü, Nizami Caddesi No:15', 'pending', 'Demo abonelik', 'Ahmet Yılmaz', 'ahmet@example.com', '+994501234567', 1, 'one_time', 'user10001', 'pass10001', '10001'),
('fa041ba5-fef1-4a2f-b5a2-9a99c467da85', NULL, '75c5f79f-1d33-4650-bb76-8edafbb86a1d', 'active', '2025-11-18 19:46:05', '2026-05-18 19:46:05', 599.94, '2025-11-19 19:46:05.283737', '2025-11-19 19:46:05.283737', 'Zevk Lokantası', 'Bakü, Bulvar Caddesi No:56', 'pending', 'Demo abonelik', 'Ali Öztürk', 'ali@example.com', '+994501234571', 6, 'monthly', 'user10005', 'pass10005', '10005');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `tables`
--

CREATE TABLE `tables` (
  `id` varchar(36) NOT NULL,
  `restaurantId` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('empty','occupied','reserved','closed') NOT NULL DEFAULT 'empty',
  `capacity` int(11) NOT NULL DEFAULT 0,
  `positionX` int(11) NOT NULL DEFAULT 0,
  `positionY` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `groupId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `tables`
--

INSERT INTO `tables` (`id`, `restaurantId`, `name`, `description`, `status`, `capacity`, `positionX`, `positionY`, `isActive`, `createdAt`, `updatedAt`, `groupId`) VALUES
('022aa892-930b-4704-877c-5410cc1da4cb', '95fd053e-dffd-4547-83a9-0a5a9695d273', '33', NULL, 'occupied', 0, 0, 0, 1, '2025-11-19 21:17:15.369572', '2025-11-20 21:31:28.000000', NULL),
('0d48b45d-6bd5-49d2-9ad8-781caaca9642', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'zal 1', NULL, 'occupied', 0, 0, 0, 1, '2025-11-20 21:02:04.190006', '2025-11-20 21:38:21.000000', '0731b45d-ec11-48fb-92dc-f57088b8419a'),
('0ff66842-e103-479b-983c-c447df204621', '95fd053e-dffd-4547-83a9-0a5a9695d273', '55', NULL, 'occupied', 0, 0, 0, 1, '2025-11-19 21:42:32.340704', '2025-11-20 00:51:49.000000', NULL),
('1449e3fe-dbf1-491e-89bb-2219f4ab38f4', '95fd053e-dffd-4547-83a9-0a5a9695d273', '5', NULL, 'empty', 0, 0, 0, 1, '2025-11-20 01:14:57.683997', '2025-11-20 20:50:31.000000', '7a81eaca-c449-4fb4-a602-fe951c85ec47'),
('1bd25a63-698e-4c8a-ac8a-a01b6e77ae70', '95fd053e-dffd-4547-83a9-0a5a9695d273', '55', NULL, 'occupied', 0, 0, 0, 1, '2025-11-19 21:42:09.816058', '2025-11-20 21:25:08.000000', NULL),
('3114430f-cc65-455c-b1d8-7ac5da7b7f59', '95fd053e-dffd-4547-83a9-0a5a9695d273', '123', NULL, 'occupied', 0, 0, 0, 1, '2025-11-19 21:42:49.319744', '2025-11-20 21:26:06.000000', NULL),
('34419402-b428-4107-b535-01b24b8a9803', '95fd053e-dffd-4547-83a9-0a5a9695d273', '33', NULL, 'empty', 0, 0, 0, 1, '2025-11-19 21:42:24.010180', '2025-11-20 21:24:45.000000', NULL),
('48b2b493-f1b6-465f-877d-7e161263864d', '95fd053e-dffd-4547-83a9-0a5a9695d273', '1234', NULL, 'occupied', 0, 0, 0, 1, '2025-11-19 21:42:53.962342', '2025-11-20 21:53:44.000000', NULL),
('7d343e60-18a2-4d9d-9a31-874c363c6958', '95fd053e-dffd-4547-83a9-0a5a9695d273', '3', NULL, 'occupied', 0, 0, 0, 1, '2025-11-19 21:42:16.034664', '2025-11-20 21:39:42.000000', NULL),
('8d2af9ac-9699-41db-a537-0ed3d3dbde09', '95fd053e-dffd-4547-83a9-0a5a9695d273', '55', NULL, 'empty', 0, 0, 0, 1, '2025-11-19 21:17:26.226691', '2025-11-20 19:57:36.000000', NULL),
('8efec112-57d8-46f3-9386-f4e4dad3dc6b', '95fd053e-dffd-4547-83a9-0a5a9695d273', '5', NULL, 'empty', 0, 0, 0, 1, '2025-11-19 21:27:45.818355', '2025-11-20 19:57:39.000000', NULL),
('9d5b132c-d4d2-4ee0-b231-f927f37c7c61', '95fd053e-dffd-4547-83a9-0a5a9695d273', '555555', NULL, 'occupied', 0, 0, 0, 1, '2025-11-19 21:42:43.303612', '2025-11-20 21:38:10.000000', NULL),
('bbf63f22-ba66-4150-88f6-bf7e0a2ab778', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'zal 3', NULL, 'occupied', 0, 0, 0, 1, '2025-11-20 21:02:45.258661', '2025-11-20 21:18:27.000000', NULL),
('ca60403e-815e-457a-868d-ff2744214f63', '95fd053e-dffd-4547-83a9-0a5a9695d273', '12345', NULL, 'empty', 0, 0, 0, 1, '2025-11-19 21:42:59.759093', '2025-11-20 20:50:25.000000', NULL),
('dce80f77-15f7-443a-b7a4-08d53ab5d40d', '95fd053e-dffd-4547-83a9-0a5a9695d273', '2', NULL, 'occupied', 0, 0, 0, 1, '2025-11-19 21:17:10.527093', '2025-11-20 22:09:29.000000', NULL),
('de9a5de3-31aa-4584-ba56-4b492b7024d3', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'zal 2', NULL, 'empty', 0, 0, 0, 1, '2025-11-20 21:02:33.901642', '2025-11-20 21:02:33.901642', '0731b45d-ec11-48fb-92dc-f57088b8419a'),
('e693dbda-c148-4f07-8ecf-eee119a27c79', '95fd053e-dffd-4547-83a9-0a5a9695d273', '555', NULL, 'occupied', 0, 0, 0, 1, '2025-11-19 21:28:04.632001', '2025-11-20 21:37:49.000000', NULL),
('e908abc8-067c-439c-8e39-d4c58bb7f7a9', '95fd053e-dffd-4547-83a9-0a5a9695d273', '44', NULL, 'occupied', 0, 0, 0, 1, '2025-11-19 21:17:21.139933', '2025-11-20 21:53:35.000000', NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `table_groups`
--

CREATE TABLE `table_groups` (
  `id` varchar(36) NOT NULL,
  `restaurantId` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `table_groups`
--

INSERT INTO `table_groups` (`id`, `restaurantId`, `name`, `createdAt`, `updatedAt`) VALUES
('0731b45d-ec11-48fb-92dc-f57088b8419a', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'DDDDDD', '2025-11-19 21:44:54.332245', '2025-11-19 21:44:54.332245'),
('10337492-1996-4cb6-a652-ad08cde14515', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'BVCX', '2025-11-19 21:44:43.121374', '2025-11-19 21:44:43.121374'),
('7a81eaca-c449-4fb4-a602-fe951c85ec47', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'DDWW', '2025-11-19 21:44:59.758557', '2025-11-19 21:44:59.758557'),
('96e7f819-d152-4fad-9f9d-7e708676f71e', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'WER', '2025-11-19 21:44:32.168989', '2025-11-19 21:44:32.168989'),
('c5fc4983-4a54-4142-96cd-524ea5cb385b', '95fd053e-dffd-4547-83a9-0a5a9695d273', 'ZXCV', '2025-11-19 21:44:37.960038', '2025-11-19 21:44:37.960038');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('super_admin','admin','user') NOT NULL DEFAULT 'user',
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `id` varchar(36) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`email`, `password`, `role`, `isActive`, `id`, `firstName`, `lastName`, `createdAt`, `updatedAt`) VALUES
('admin@posrestaurant.com', '$2a$10$ppsY7lEnBKf4zL17MwrdpetZCZHmLXjKwRg/4oqqZf0V7cLdJgD0a', 'super_admin', 1, '', 'Super', 'Admin', '2025-11-09 23:07:25.091028', '2025-11-15 19:45:42.000000');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `visitor_logs`
--

CREATE TABLE `visitor_logs` (
  `id` varchar(36) NOT NULL,
  `ipAddress` varchar(255) DEFAULT NULL,
  `userAgent` varchar(255) DEFAULT NULL,
  `deviceId` varchar(255) DEFAULT NULL,
  `referer` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `visitor_logs`
--

INSERT INTO `visitor_logs` (`id`, `ipAddress`, `userAgent`, `deviceId`, `referer`, `path`, `createdAt`) VALUES
('00c3b39a-547f-49d3-9fe3-522dcbfac914', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard', '2025-11-19 21:06:35.426765'),
('00e8c1ac-056c-43f9-918f-d61eb9f54f94', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'eb40daf0e0a49036a722b3a221b16e41', 'http://localhost:3000/', '/paketler', '2025-11-18 17:39:29.452386'),
('01a4e788-67d5-4270-a31d-c9b3738a872c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/iletisim', '2025-11-26 17:55:58.180191'),
('01fee255-1b5a-46f1-9f22-000a0e927ff2', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/e693dbda-c148-4f07-8ecf-eee119a27c79', '2025-11-19 23:50:18.114291'),
('0476a309-2073-44fb-a4b4-0780ff9b0bb2', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/paketler', '2025-11-18 17:38:20.269803'),
('04860738-4fde-4638-b77a-db1b464de11c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/e908abc8-067c-439c-8e39-d4c58bb7f7a9', '2025-11-19 22:58:19.940077'),
('097019c5-d4c3-4116-bcea-9e7978826671', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/iletisim/admin-panel', '2025-11-23 22:15:45.538373'),
('09c4af94-7194-4bea-9227-233be68f6daa', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/iletisim', '2025-11-21 19:33:05.745187'),
('0a3fd8cd-367d-43a8-854c-f97da05f1b6b', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard', '2025-11-20 00:29:14.434723'),
('0e3f58fa-6d80-4530-a23a-ca6538e2710c', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/7d343e60-18a2-4d9d-9a31-874c363c6958', '2025-11-20 00:41:44.269393'),
('0ffe6fdf-5fae-4207-b1cf-98289cd28887', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/iletisim', '2025-11-16 21:31:55.234562'),
('10c102a8-7986-42e1-84a0-c3ab8ea6e44a', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/iletisim', '2025-11-19 19:50:26.950874'),
('128767bf-6627-4734-8100-19f1a0ab1e3b', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/dce80f77-15f7-443a-b7a4-08d53ab5d40d', '2025-11-20 00:15:20.609748'),
('1370d6fd-30ef-4c43-aa16-0e011c498434', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/customers', '2025-11-19 21:06:13.607228'),
('13b1ae52-9fee-42ef-ba3b-f7b12ed5aebc', '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '6007e13cfe80db39f0b9c889a86026cd', 'http://localhost:3000/', '/restaurant/dashboard/tables', '2025-11-19 19:57:50.366826'),
('13e51940-42ee-4f9a-9e89-c8fce2ecea69', '::ffff:127.0.0.1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '5b912f1f394eb54d1a44ae4d27401004', 'http://localhost:3000/', '/restaurant/dashboard/table-order/0ff66842-e103-479b-983c-c447df204621', '2025-11-20 00:53:10.564073'),
('14046104-8590-41d4-a075-129a51d2fb01', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/tables', '2025-11-20 00:02:40.488237'),
('149c69fe-210b-453b-84a5-1f53cfa0ea6c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/e693dbda-c148-4f07-8ecf-eee119a27c79', '2025-11-19 23:14:44.474931'),
('14b8414f-aa11-483f-845a-db69a4af759f', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/8efec112-57d8-46f3-9386-f4e4dad3dc6b', '2025-11-20 19:57:38.029107'),
('16d3ef26-f3f0-40bd-adbc-53279a5fcfb1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/paketler', '2025-11-23 21:47:53.912053'),
('17c5035c-f64b-4d1c-afad-fa5f26f77826', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/', '2025-11-16 21:31:27.805514'),
('187ed807-e99b-46cf-b3d4-17bca528f26a', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/dce80f77-15f7-443a-b7a4-08d53ab5d40d', '2025-11-19 22:51:32.448560'),
('1c8c6780-6f5c-4c34-9e57-439d4d09e0a5', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboar', '2025-11-19 23:10:51.630377'),
('1d0c6e0b-9f92-487f-a2bf-7a156e29f0ae', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/', '2025-11-23 21:47:06.019276'),
('1e028560-5eee-46ff-bdc7-87de5b1ff5e6', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/bbf63f22-ba66-4150-88f6-bf7e0a2ab778', '2025-11-20 21:18:24.138516'),
('1e67ca95-8f9f-4d07-aa63-4ecb0817fbe1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/hakkimizda', '2025-11-18 18:07:41.080946'),
('1f50d0cf-df26-4ace-8c82-55b4e13cce05', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/ozellikler', '2025-11-20 00:27:54.931854'),
('2461de76-ed32-4fa2-ad46-6d46f3063c59', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order', '2025-11-20 18:54:37.875890'),
('24f52910-3f58-44dd-9a74-f97e439f77a6', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/login', '2025-11-23 21:46:58.871152'),
('26b5bc2b-5283-44d5-af81-aea3bd99a765', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/customers', '2025-11-20 00:41:13.111619'),
('2856be39-b721-4123-976d-0804c08f5f01', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order', '2025-11-20 18:54:37.847588'),
('285fdb7d-7f94-43a9-b165-7d61a081c6a4', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/1449e3fe-dbf1-491e-89bb-2219f4ab38f4', '2025-11-20 01:15:01.246593'),
('2ae22ffd-706c-44d7-bc40-e80742da71a6', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/ozellikler', '2025-11-21 18:02:29.650070'),
('2b828745-236d-46de-9e5c-65784ea8b878', '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '6007e13cfe80db39f0b9c889a86026cd', 'http://localhost:3000/', '/restaurant/dashboard/staff', '2025-11-19 20:32:53.593905'),
('2baf8a8a-7127-4e10-99cf-05667341ecf3', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/hakkimizda', '2025-11-26 17:55:57.251405'),
('2c599f8d-6fea-4d70-b1e6-ce134efe2006', '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '6007e13cfe80db39f0b9c889a86026cd', 'http://localhost:3000/', '/restaurant/dashboard', '2025-11-19 20:32:47.471739'),
('2edef368-8e72-4ec0-8336-fe7c0138b5e4', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/e908abc8-067c-439c-8e39-d4c58bb7f7a9', '2025-11-20 00:56:46.713191'),
('2f9f88a5-a1bc-4474-ae46-6ed3ff402c2d', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/iletisim', '2025-11-20 00:27:36.432312'),
('3054b7aa-76e0-48e7-90a9-0d2bc579c5da', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard', '2025-11-20 00:29:14.441051'),
('3501a944-8657-4c92-9572-29435a24b662', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboar', '2025-11-19 23:10:51.623168'),
('35c6e30b-e41f-482b-a076-0fe571b32ff3', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/iletisim', '2025-11-23 21:47:04.301013'),
('3814facd-5166-4f1d-a98f-731017415b46', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/reports', '2025-11-19 23:34:15.179101'),
('3816e599-400e-4415-8754-5d2272d0477d', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard', '2025-11-19 19:53:16.925863'),
('38379a48-f704-4e13-af87-566de19e88fd', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard', '2025-11-23 21:46:58.734959'),
('38b45991-ef09-4b71-8b43-791a08bd0789', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/', '2025-11-18 17:38:12.351527'),
('3ab9ba27-4516-468d-bea0-d1f96079d44f', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/1449e3fe-dbf1-491e-89bb-2219f4ab38f4', '2025-11-20 01:18:34.201835'),
('3b24fc9c-1b00-4217-8360-4c5a8af6b13d', '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '6007e13cfe80db39f0b9c889a86026cd', 'http://localhost:3000/', '/', '2025-11-18 18:37:04.025405'),
('3de77ca4-4331-4ea8-9894-3088d8d524ae', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/stock', '2025-11-20 00:03:44.980811'),
('3dfc8837-d2ee-417b-90dc-bb3eb2a0f56d', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-settings', '2025-11-20 00:21:42.391468'),
('3fcd7f54-7e6b-45d0-84b1-065206be829a', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/iletisim', '2025-11-19 22:14:53.521252'),
('3fd0481a-6a31-4d89-a3dc-1984f004742a', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/ca60403e-815e-457a-868d-ff2744214f63', '2025-11-19 23:34:44.162454'),
('415db6d9-7736-491b-a7c7-1412a3c96d17', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/7d343e60-18a2-4d9d-9a31-874c363c6958', '2025-11-19 23:49:15.585954'),
('42bfedd1-02db-44d3-a288-e98690d7af33', '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '6007e13cfe80db39f0b9c889a86026cd', 'http://localhost:3000/', '/restaurant/dashboard/cash-register', '2025-11-19 20:32:22.534881'),
('436718fa-655c-4cd9-ad07-33477a2067de', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/ca60403e-815e-457a-868d-ff2744214f63', '2025-11-20 18:54:47.060992'),
('43a1ba08-bfa0-4e3c-8bfb-93700341c715', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/48b2b493-f1b6-465f-877d-7e161263864d', '2025-11-20 00:14:27.948861'),
('43af5687-9fa9-482c-9129-7796f84fe86d', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/8d2af9ac-9699-41db-a537-0ed3d3dbde09', '2025-11-20 19:57:35.042561'),
('43e7915f-728d-494d-a93e-3a4720366c3d', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/iletisim', '2025-11-20 00:27:36.436722'),
('441590d1-282c-482e-ad5b-ff53f77eff8b', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/34419402-b428-4107-b535-01b24b8a9803', '2025-11-20 01:09:35.787912'),
('45f8cc66-67b9-4a56-ad9e-56e375c471ba', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/3114430f-cc65-455c-b1d8-7ac5da7b7f59', '2025-11-19 23:50:38.934163'),
('46e7a337-b1dc-481e-ba51-9c08e8c2a721', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/', '2025-11-19 21:06:18.531841'),
('4831745d-d456-4261-a3f6-5ed4f0f6149b', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/', '2025-11-19 21:06:18.533954'),
('4a6818b5-294c-4534-971e-1d3ce197eb0c', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-settings', '2025-11-19 21:08:30.885776'),
('4ca726d6-8859-4b4d-817a-9f18f19283ae', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/e693dbda-c148-4f07-8ecf-eee119a27c79', '2025-11-20 00:11:09.326874'),
('4e2df097-04cc-416b-9dd8-780eefe84579', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/3114430f-cc65-455c-b1d8-7ac5da7b7f59', '2025-11-20 00:32:51.410732'),
('5026b3d3-23b7-4fef-b5bd-bb5bf3e73a57', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/login', '2025-11-21 17:43:51.712967'),
('53138998-dcc5-4ed2-8f05-d2e65b8ce514', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'eb40daf0e0a49036a722b3a221b16e41', 'http://localhost:3000/', '/restaurant/dashboard/tables', '2025-11-19 20:41:34.787476'),
('5444204b-b380-4b88-9bf5-eb2f42f30d02', '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '6007e13cfe80db39f0b9c889a86026cd', 'http://localhost:3000/', '/', '2025-11-19 20:32:25.540194'),
('545e664a-c0f7-4c91-9993-6590c894d9a9', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/0ff66842-e103-479b-983c-c447df204621', '2025-11-19 23:45:51.473949'),
('54f28648-810a-4540-969d-00c20f27fa05', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/paketler', '2025-11-20 01:11:58.798547'),
('56c3ec21-81fc-4e09-b987-419480cba0ae', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/1bd25a63-698e-4c8a-ac8a-a01b6e77ae70', '2025-11-20 00:04:37.264105'),
('583054e5-2ad6-40a6-aaf1-e5a0093528bb', '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '6007e13cfe80db39f0b9c889a86026cd', 'http://localhost:3000/', '/', '2025-11-19 20:32:25.549844'),
('58775048-df7f-40bf-921a-4e3cc38a2ee5', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/iletisim', '2025-11-24 00:25:55.891177'),
('58c12459-ce4e-41db-93e3-6c4dd94ba3f8', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/hakkimizda', '2025-11-21 19:33:05.366725'),
('5bdb63c9-e73c-4525-9fc8-a518d17ba5a8', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboar', '2025-11-20 18:29:49.439116'),
('5d42a3c9-3e22-415c-8f44-71297203117c', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/8d2af9ac-9699-41db-a537-0ed3d3dbde09', '2025-11-20 00:34:55.656454'),
('607b9001-2a8a-4bcb-b69d-ea6ebd23c372', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'eb40daf0e0a49036a722b3a221b16e41', 'http://localhost:3000/', '/restaurant/dashboard', '2025-11-19 20:41:30.389547'),
('60cd2600-4e2c-41bc-81fb-6a84dd53b426', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/ozellikler', '2025-11-19 20:01:53.347537'),
('615809f5-c191-4d44-bf51-5ddf3728d31e', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/1449e3fe-dbf1-491e-89bb-2219f4ab38f4', '2025-11-20 01:18:34.196597'),
('64dedfcf-999e-49b8-9cee-40471a355079', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/9d5b132c-d4d2-4ee0-b231-f927f37c7c61', '2025-11-20 00:14:12.861674'),
('6b63767c-82e0-40e4-b34c-6d6705b00e85', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/ozellikler', '2025-11-18 17:47:56.911133'),
('6c9c2d6d-a527-4fab-af8e-49f31552e853', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/ozellikler', '2025-11-23 22:12:24.396247'),
('6d325a2c-07e2-438c-b7ef-dbf7955966ae', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/orders', '2025-11-19 19:53:38.340556'),
('6f022638-44fc-499d-8021-5da327ea5b5a', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/tables', '2025-11-20 00:02:23.328321'),
('71f083ad-a0fc-4307-be0e-bf3a327d89eb', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order', '2025-11-19 22:57:10.024715'),
('745c5bea-5ade-4995-a399-6073aa4ea062', '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '6007e13cfe80db39f0b9c889a86026cd', 'http://localhost:3000/', '/', '2025-11-18 18:37:04.056482'),
('771fa110-fd83-4c8c-bc0c-24713811847d', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/', '2025-11-20 00:21:00.502190'),
('781efd55-6970-427d-8c6e-88a78719c4d1', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/tables', '2025-11-19 21:08:56.249974'),
('79dbb7a0-79c8-47dd-938c-6211b6ca2968', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard', '2025-11-21 17:43:51.261005'),
('7a576828-8e3a-4c48-8fb7-041edd2c2148', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/e908abc8-067c-439c-8e39-d4c58bb7f7a9', '2025-11-19 23:50:07.522171'),
('7cde0497-2563-45bf-8dc3-db1ea7fd103c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/login', '2025-11-19 19:50:23.277777'),
('7d681540-df6c-49be-b23f-4459d4e91587', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/login', '2025-11-20 00:29:14.712414'),
('7d862c4e-8c7d-406d-a0c2-0cc473c82979', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/0d48b45d-6bd5-49d2-9ad8-781caaca9642', '2025-11-20 21:38:19.252581'),
('7dbec744-7e9a-4fb0-bc67-5d0416d3ea9a', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/', '2025-11-18 17:38:12.359226'),
('7fbbbbde-2669-4dba-9208-7902fe4bba61', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/48b2b493-f1b6-465f-877d-7e161263864d', '2025-11-19 23:08:22.462907'),
('7ff5cad3-e79e-4dfe-b1ad-605e4e0b8cf3', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'eb40daf0e0a49036a722b3a221b16e41', 'http://localhost:3000/', '/restaurant/login', '2025-11-21 20:09:26.465565'),
('807c8369-3ed0-4edb-ba0f-274899b24d08', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/', '2025-11-26 17:55:49.082558'),
('80b5ed34-0611-40bb-8e01-1aed42f4e0a2', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/stock', '2025-11-19 19:53:43.135005'),
('85f9f66d-4eec-4a1a-a692-771d50b86bfe', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/', '2025-11-21 17:50:23.395069'),
('860170cf-6993-409e-9eeb-06c5f675d982', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard', '2025-11-24 00:24:59.608106'),
('8620163e-80f4-4cdb-8b22-9cab5eabdb71', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/customers', '2025-11-19 19:53:41.511178'),
('867e1f25-f5e3-42b4-99cc-91ae8ef717e5', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/', '2025-11-20 00:21:00.531004'),
('869cc799-0606-4a18-a138-afb9d11a1389', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/orders', '2025-11-20 00:54:17.458715'),
('86e0fd5c-c246-43f7-aa20-cd7e3256bc1c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/34419402-b428-4107-b535-01b24b8a9803', '2025-11-19 22:59:44.949315'),
('872962d4-e70c-42a4-8a82-e036960ef9b6', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/paketler', '2025-11-26 18:00:40.732278'),
('88249208-b717-4e8b-acc0-f0978f838f7f', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/tables', '2025-11-19 19:53:27.153048'),
('885e74fb-93a5-4f15-a078-82e7db61e98b', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/iletisim', '2025-11-19 19:50:26.944958'),
('889e1e35-b709-440b-beee-71fb56d25ae8', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/ozellikler', '2025-11-20 00:28:17.688338'),
('88fa44a6-99a7-46dd-ac20-b948e86f6681', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard', '2025-11-19 21:06:35.391998'),
('8ac324f5-2c9c-48c8-b3f2-6f315bc144c6', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/7d343e60-18a2-4d9d-9a31-874c363c6958', '2025-11-19 23:01:08.665857'),
('8bcdb2f9-6e3d-4207-ae62-84264f28bdc6', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order', '2025-11-19 22:57:10.030340'),
('8d3eb506-5fc4-45e5-aae8-c8401e5f7e21', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/', '2025-11-20 19:52:18.879569'),
('8e396047-205d-4b8c-884f-f760b365399b', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/product-groups', '2025-11-19 19:53:43.739610'),
('8feeb1fd-ee08-4bb1-ba32-321479c25561', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/hakkimizda', '2025-11-16 21:31:53.589945'),
('914a5e31-003d-4f63-b4b7-18b4b7a844ec', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/reports', '2025-11-20 01:00:02.874916'),
('95e22c39-330f-4be0-8673-0c58f3a3384d', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/paketler', '2025-11-20 00:28:18.022308'),
('96ba07fd-3db9-41af-a2d4-99ed973c36a0', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/settings', '2025-11-20 00:55:14.437835'),
('96fd9140-8542-45cc-9f57-ad7b5f6e23e0', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/', '2025-11-19 18:40:49.769703'),
('973ec586-3373-4849-9036-d0c95b14af55', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/ozellikler', '2025-11-26 17:55:50.707349'),
('9a2d0a96-744d-4083-a28a-468a0dca792d', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/ozellikler', '2025-11-16 21:31:40.266302'),
('9af6fdc2-4e5e-40b8-9372-b5b4930ceed7', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-settings', '2025-11-19 21:08:30.863115'),
('9c2de9dd-ee35-457a-98c2-832776077f79', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/', '2025-11-16 21:31:27.809838'),
('9df0fa99-7ac9-4d53-87e7-09f01cd8b75c', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard', '2025-11-20 00:36:36.003147'),
('a3674f2e-08e7-499d-8e52-654ac7809357', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/1bd25a63-698e-4c8a-ac8a-a01b6e77ae70', '2025-11-20 00:25:00.612671'),
('a404adb1-b757-4d3f-bb31-5622cd148b09', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'eb40daf0e0a49036a722b3a221b16e41', 'http://localhost:3000/', '/restaurant/dashboard/orders', '2025-11-19 20:48:02.755809'),
('a41a6a7e-0b39-4383-ad70-4c6102a698ec', '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '6007e13cfe80db39f0b9c889a86026cd', 'http://localhost:3000/', '/restaurant/dashboard/settings', '2025-11-19 20:32:57.772622'),
('a42b3df0-424a-46a5-a760-b3d578bacffe', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/hakkimizda', '2025-11-19 20:01:57.008766'),
('a5957cd6-0397-4e02-927c-7a69c4a16daa', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/tables', '2025-11-21 19:44:41.013251'),
('a5daab30-9791-4522-a675-63f99ff02d67', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/34419402-b428-4107-b535-01b24b8a9803', '2025-11-19 23:50:31.206607'),
('a5f3d967-8e37-4e1a-8e58-f0de90f20279', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/022aa892-930b-4704-877c-5410cc1da4cb', '2025-11-19 22:52:12.161880'),
('a6010e32-cc94-4cd9-ad8f-1e3f57214149', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/paketler', '2025-11-19 20:01:54.407624'),
('a8e3a517-48b7-4dba-aaeb-5256bd5f0b63', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/', '2025-11-20 19:52:18.864213'),
('a948fca6-c525-4f90-8bf5-36c5fc7460a2', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/hakkimizda', '2025-11-23 22:12:25.792412'),
('a9b5a2dd-4bcf-4504-b5bc-70e119aa6648', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/', '2025-11-21 17:50:23.384077'),
('a9f4022a-bed4-4a40-9967-953e8f34eb95', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/', '2025-11-24 00:25:05.153470'),
('ad9504be-151f-4064-9333-05b893dd9ce4', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/iletisim', '2025-11-18 18:07:41.837338'),
('af25dfb0-550e-4bac-b9f6-c92892ad9c62', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'eb40daf0e0a49036a722b3a221b16e41', 'http://localhost:3000/', '/restaurant/dashboard/settings', '2025-11-19 20:41:33.112683'),
('b503f434-c801-46e7-858d-a63d006e790e', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/0ff66842-e103-479b-983c-c447df204621', '2025-11-20 00:51:39.772390'),
('b659e26c-1e0a-4d02-882a-a4f555ca4425', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/hakkimizda', '2025-11-24 00:25:26.313510'),
('b7b2bded-15ce-4cf0-80df-9dfb029e9193', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/login', '2025-11-20 00:27:06.018542'),
('b89aa395-d2bc-4099-8f12-ef72186faaf6', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/iletisim/admin-panel', '2025-11-23 22:15:45.541776'),
('b9346e12-9cfe-46e3-b9fa-87ddae1052fc', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/iletisim', '2025-11-20 00:28:18.410066'),
('bc130250-f7f2-4d75-9af1-cedafe2a248d', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/', '2025-11-20 00:27:47.898453'),
('bc338b07-d5e8-41f9-b932-f635fa0bfc4e', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/cash-register', '2025-11-19 19:53:42.400068'),
('c0e1c310-0eca-4a31-b8fa-8b61b2d049b2', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard', '2025-11-23 21:46:58.768709'),
('c1474c05-3143-4f68-91c8-62041a2d78c2', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard', '2025-11-20 00:36:36.010559'),
('c2cab1bb-087c-434f-9935-ef78bd23f70d', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/orders', '2025-11-20 00:25:11.663073'),
('c47747cf-a1ff-4700-813c-bf2d88831d7d', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/9d5b132c-d4d2-4ee0-b231-f927f37c7c61', '2025-11-19 23:21:51.243344'),
('c68550e6-4b5c-47f6-89cc-60fbb65a015f', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/hakkimizda', '2025-11-19 22:14:51.380404'),
('c809ce47-0d05-45d3-a838-ae82da6a33ee', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/e908abc8-067c-439c-8e39-d4c58bb7f7a9', '2025-11-20 00:02:41.543030'),
('cbea7a46-e98c-41af-83a3-67db35489cba', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'eb40daf0e0a49036a722b3a221b16e41', 'http://localhost:3000/', '/paketler', '2025-11-18 17:39:29.418923'),
('cc661781-28dc-40bc-a5c8-be086ab8fb92', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/settings', '2025-11-20 00:21:40.584067'),
('ccf00e4a-727d-4b7b-bed0-a8c1f029f42b', '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '6007e13cfe80db39f0b9c889a86026cd', 'http://localhost:3000/', '/restaurant/dashboard/customers', '2025-11-19 20:32:21.985109'),
('cdb003fb-1503-4a01-91cf-1fe2f2137c34', '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '6007e13cfe80db39f0b9c889a86026cd', 'http://localhost:3000/', '/restaurant/dashboard/orders', '2025-11-19 20:32:21.161739'),
('cdb55b1c-22b1-45d1-b148-574daa806a87', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/', '2025-11-19 18:40:49.770727'),
('cfa64b5e-f552-43f6-b411-10ac8ac3c301', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/022aa892-930b-4704-877c-5410cc1da4cb', '2025-11-20 00:36:07.619174'),
('cfcde93b-c8e1-44f6-ba7d-b32ab50a0f5c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/paketler', '2025-11-24 00:25:08.088157'),
('d01577a3-b431-4ae6-bafe-45c516d02afe', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/login', '2025-11-24 00:24:59.606015'),
('d01dc1fa-97d6-4055-a2f2-399fc76c4bbc', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/staff', '2025-11-20 00:21:47.733208'),
('d085286b-d1bb-4685-8fc5-6a0f6a852e76', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/9d5b132c-d4d2-4ee0-b231-f927f37c7c61', '2025-11-19 23:25:39.972419'),
('d0be746b-9359-4f43-bcc7-5c83744120fc', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/1bd25a63-698e-4c8a-ac8a-a01b6e77ae70', '2025-11-19 23:50:24.683665'),
('d0d2a6fd-9d18-4338-a090-d1a6a3d77c41', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/ozellikler', '2025-11-24 00:26:04.284293'),
('d29845ed-6b2f-4fbb-885a-0fc887c8b70e', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/login', '2025-11-20 00:27:05.985518'),
('d319313a-0ddd-4a5c-ad9e-af418a39db04', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/dce80f77-15f7-443a-b7a4-08d53ab5d40d', '2025-11-19 23:26:54.209096'),
('d3670c14-e034-4714-afd9-f715c0996e31', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/paketler', '2025-11-16 21:31:41.945890'),
('d3cea036-5b9e-4311-b649-a809dec8a440', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/reports', '2025-11-19 19:53:44.955415'),
('d428096d-5385-46de-9e71-ea200d703ba2', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/paketler', '2025-11-21 18:02:30.402695'),
('d58b8c95-37b4-4977-bd13-b25edf36b599', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/ca60403e-815e-457a-868d-ff2744214f63', '2025-11-19 23:37:41.860197'),
('d59aaab9-a58d-41e2-a94b-e1d96ac958b2', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/paketler', '2025-11-19 22:14:49.713528');
INSERT INTO `visitor_logs` (`id`, `ipAddress`, `userAgent`, `deviceId`, `referer`, `path`, `createdAt`) VALUES
('d5df7b03-5cfc-42f8-b742-196824af21bc', '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '6007e13cfe80db39f0b9c889a86026cd', 'http://localhost:3000/', '/restaurant/dashboard', '2025-11-19 20:32:47.491066'),
('d774942c-8c4c-4a83-af3f-b4ac0a7bcc7a', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/9d5b132c-d4d2-4ee0-b231-f927f37c7c61', '2025-11-20 00:24:49.196457'),
('d8281c9a-05fb-4bec-aa75-9ded696c1722', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/stock', '2025-11-19 22:12:45.589703'),
('dd67ecd4-46c4-4441-90dc-b2ffcdf0d80d', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/paketler', '2025-11-26 17:55:51.505050'),
('dd8e97f5-3a1d-413b-b760-d323d61d9bdb', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/ozellikler', '2025-11-19 22:14:47.986233'),
('de227442-9c7b-4e6b-b980-532a0343a7e9', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/cash-register', '2025-11-19 21:06:14.323382'),
('dea78247-b673-43f2-a605-824e623b30ec', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/3114430f-cc65-455c-b1d8-7ac5da7b7f59', '2025-11-19 23:22:09.807230'),
('e0cac4f9-9bf4-468b-aca8-a0014520ef09', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/022aa892-930b-4704-877c-5410cc1da4cb', '2025-11-20 00:55:36.611835'),
('e0d7760d-bc37-404a-bd3a-e1fbe1bb6ebc', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-settings', '2025-11-20 00:55:15.708645'),
('e440947c-2798-4580-8c31-d30491594b2c', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/e693dbda-c148-4f07-8ecf-eee119a27c79', '2025-11-20 00:02:32.743845'),
('e553ab7a-a8f7-4931-9447-e28f956a2b49', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/orders', '2025-11-19 21:06:12.427627'),
('e5e88447-b1f5-45c9-8251-08f063b7b935', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/8efec112-57d8-46f3-9386-f4e4dad3dc6b', '2025-11-19 23:11:00.863991'),
('e9361947-b7d3-4003-9e89-795e1a1c9110', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-settings', '2025-11-19 21:07:51.551255'),
('e97fb858-9a72-4190-b762-719f5a391ba2', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/8efec112-57d8-46f3-9386-f4e4dad3dc6b', '2025-11-20 00:36:37.479797'),
('e9c7904d-b437-42bf-9be5-4d5edecc5b5c', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/8d2af9ac-9699-41db-a537-0ed3d3dbde09', '2025-11-19 23:09:49.272525'),
('ebbfc3ad-2ca6-4964-88cf-4bc6c47e14b8', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/hakkimizda', '2025-11-20 00:28:18.773975'),
('ec13be1b-bacb-4125-b4f1-8dba69e21edc', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard', '2025-11-24 00:24:59.608886'),
('ed49db6a-72bc-4778-993b-6f8cd96dbd48', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/settings', '2025-11-19 19:53:48.992878'),
('ee59bc13-4751-44de-aa90-b8539bc367c8', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/7d343e60-18a2-4d9d-9a31-874c363c6958', '2025-11-20 00:41:35.811732'),
('ee6d708f-7e2e-4118-a833-50d23ab73da2', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/7d343e60-18a2-4d9d-9a31-874c363c6958', '2025-11-19 23:49:15.565036'),
('ef053097-7e9c-449e-88fe-b0240f25aac1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/tables', '2025-11-21 19:44:41.011147'),
('ef3a8891-3fe0-44b4-9913-fc392f6384bc', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/login', '2025-11-19 19:50:23.279204'),
('f07088f0-18f3-49e6-adfe-0182284e653a', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/dce80f77-15f7-443a-b7a4-08d53ab5d40d', '2025-11-20 01:26:23.768219'),
('f15a6035-f3c7-4d64-8ce7-4da0510a0c1a', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/table-order/1bd25a63-698e-4c8a-ac8a-a01b6e77ae70', '2025-11-19 23:07:54.838876'),
('f1a5bdbf-a6b2-4480-a096-0d2eda78bdc5', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/iletisim', '2025-11-23 21:47:04.303613'),
('f41629a7-ed2f-499f-ac34-03de994bb43b', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/settings', '2025-11-19 23:24:25.374029'),
('f5bae214-db52-4500-9d9f-0bb1d3883a3c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboar', '2025-11-20 18:29:49.443774'),
('f5e7ce4b-0c22-45cc-9e20-572be950de27', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/022aa892-930b-4704-877c-5410cc1da4cb', '2025-11-19 23:08:55.559690'),
('f6f1922a-e4eb-4cda-9f31-4a9fb6ba90b2', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/staff', '2025-11-19 23:34:14.557005'),
('f7e0f1b0-a26f-4e24-b029-76d93418cab9', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/restaurant/dashboard/staff', '2025-11-19 19:53:47.787740'),
('fb04c773-f8d8-4abc-8463-6f8017c662a9', '::1', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', 'c835f2625fc8d329fad3504cb46b36dd', 'http://localhost:3000/', '/restaurant/dashboard/table-order/0ff66842-e103-479b-983c-c447df204621', '2025-11-19 23:33:54.787443'),
('fe99eaaf-6416-4f02-a0b2-f0841d398705', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '3e128d49e5892d7bef1df205390af418', 'http://localhost:3000/', '/', '2025-11-26 17:55:49.088052');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `advertising_customers`
--
ALTER TABLE `advertising_customers`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `cash_registers`
--
ALTER TABLE `cash_registers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_eb569e8887d0867d496bde1d3c6` (`restaurantId`),
  ADD KEY `FK_28d1fde47fffd110990ee1e4b13` (`openedById`),
  ADD KEY `FK_704049998f4692cfed581260603` (`closedById`);

--
-- Tablo için indeksler `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_a1a02d2ca991de8d72e402972d1` (`restaurantId`);

--
-- Tablo için indeksler `notification_subscriptions`
--
ALTER TABLE `notification_subscriptions`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_59b0c3b34ea0fa5562342f2414` (`orderNumber`),
  ADD KEY `FK_2312cd07a04f50ba29d76c9564e` (`restaurantId`),
  ADD KEY `FK_2a7fdd7af437285a3ef0fc8b64f` (`tableId`),
  ADD KEY `FK_e5de51ca888d8b1f5ac25799dd1` (`customerId`),
  ADD KEY `FK_2912d5ae4c5a140b02c1f0c7611` (`waiterId`);

--
-- Tablo için indeksler `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_f1d359a55923bb45b057fbdab0d` (`orderId`),
  ADD KEY `FK_cdb99c05982d5191ac8465ac010` (`productId`);

--
-- Tablo için indeksler `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_6dbeb6793f751150ace3326254c` (`restaurantId`),
  ADD KEY `FK_af929a5f2a400fdb6913b4967e1` (`orderId`),
  ADD KEY `FK_da32a09b405562e09d4e1f5331c` (`cashRegisterId`);

--
-- Tablo için indeksler `payment_logs`
--
ALTER TABLE `payment_logs`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_11a1d3b4f6f1c6630be3127391d` (`restaurantId`),
  ADD KEY `FK_8f1611225215b15b7784b2e266d` (`groupId`);

--
-- Tablo için indeksler `product_groups`
--
ALTER TABLE `product_groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_1b382703bd99f9cd71ac2a017fe` (`restaurantId`);

--
-- Tablo için indeksler `restaurants`
--
ALTER TABLE `restaurants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_cbe2f755e00bdc4800bca9001b` (`subscriptionId`),
  ADD UNIQUE KEY `REL_cbe2f755e00bdc4800bca9001b` (`subscriptionId`);

--
-- Tablo için indeksler `restaurant_users`
--
ALTER TABLE `restaurant_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_7e9eb12dd09262ca34da1abce9` (`email`),
  ADD KEY `FK_585a60361ad47f64145e892254f` (`restaurantId`);

--
-- Tablo için indeksler `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `site_contents`
--
ALTER TABLE `site_contents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_385cedfea976a85d36120272d9` (`key`);

--
-- Tablo için indeksler `stocks`
--
ALTER TABLE `stocks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_e9b266734e2ac9758f75f40397d` (`restaurantId`),
  ADD KEY `FK_3024bbca6232c8b6efa3ff51028` (`productId`);

--
-- Tablo için indeksler `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_4c4a54a34ba608e545eb8447a9a` (`packageId`),
  ADD KEY `FK_fbdba4e2ac694cf8c9cecf4dc84` (`userId`);

--
-- Tablo için indeksler `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_94e0a6541322cecd437cd841701` (`restaurantId`),
  ADD KEY `FK_06c9ebaa6c9f1f6368a7688a6b1` (`groupId`);

--
-- Tablo için indeksler `table_groups`
--
ALTER TABLE `table_groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_650786af4811eff2ebd829f1451` (`restaurantId`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`);

--
-- Tablo için indeksler `visitor_logs`
--
ALTER TABLE `visitor_logs`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `cash_registers`
--
ALTER TABLE `cash_registers`
  ADD CONSTRAINT `FK_28d1fde47fffd110990ee1e4b13` FOREIGN KEY (`openedById`) REFERENCES `restaurant_users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_704049998f4692cfed581260603` FOREIGN KEY (`closedById`) REFERENCES `restaurant_users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_eb569e8887d0867d496bde1d3c6` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Tablo kısıtlamaları `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `FK_a1a02d2ca991de8d72e402972d1` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Tablo kısıtlamaları `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `FK_2312cd07a04f50ba29d76c9564e` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_2912d5ae4c5a140b02c1f0c7611` FOREIGN KEY (`waiterId`) REFERENCES `restaurant_users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_2a7fdd7af437285a3ef0fc8b64f` FOREIGN KEY (`tableId`) REFERENCES `tables` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_e5de51ca888d8b1f5ac25799dd1` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Tablo kısıtlamaları `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `FK_cdb99c05982d5191ac8465ac010` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_f1d359a55923bb45b057fbdab0d` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Tablo kısıtlamaları `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `FK_6dbeb6793f751150ace3326254c` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_af929a5f2a400fdb6913b4967e1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_da32a09b405562e09d4e1f5331c` FOREIGN KEY (`cashRegisterId`) REFERENCES `cash_registers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Tablo kısıtlamaları `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `FK_11a1d3b4f6f1c6630be3127391d` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_8f1611225215b15b7784b2e266d` FOREIGN KEY (`groupId`) REFERENCES `product_groups` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Tablo kısıtlamaları `product_groups`
--
ALTER TABLE `product_groups`
  ADD CONSTRAINT `FK_1b382703bd99f9cd71ac2a017fe` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Tablo kısıtlamaları `restaurants`
--
ALTER TABLE `restaurants`
  ADD CONSTRAINT `FK_cbe2f755e00bdc4800bca9001b6` FOREIGN KEY (`subscriptionId`) REFERENCES `subscriptions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Tablo kısıtlamaları `restaurant_users`
--
ALTER TABLE `restaurant_users`
  ADD CONSTRAINT `FK_585a60361ad47f64145e892254f` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Tablo kısıtlamaları `stocks`
--
ALTER TABLE `stocks`
  ADD CONSTRAINT `FK_3024bbca6232c8b6efa3ff51028` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_e9b266734e2ac9758f75f40397d` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Tablo kısıtlamaları `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `FK_4c4a54a34ba608e545eb8447a9a` FOREIGN KEY (`packageId`) REFERENCES `packages` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Tablo kısıtlamaları `tables`
--
ALTER TABLE `tables`
  ADD CONSTRAINT `FK_06c9ebaa6c9f1f6368a7688a6b1` FOREIGN KEY (`groupId`) REFERENCES `table_groups` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_94e0a6541322cecd437cd841701` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Tablo kısıtlamaları `table_groups`
--
ALTER TABLE `table_groups`
  ADD CONSTRAINT `FK_650786af4811eff2ebd829f1451` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
