-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.7.36-0ubuntu0.18.04.1 - (Ubuntu)
-- Server OS:                    Linux
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for pivt_app
DROP DATABASE IF EXISTS `pivt_app`;
CREATE DATABASE IF NOT EXISTS `pivt_app` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `pivt_app`;

-- Dumping structure for table pivt_app.address
DROP TABLE IF EXISTS `address`;
CREATE TABLE IF NOT EXISTS `address` (
  `address_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `street_and_number` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `place` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `phone_number` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `restaurant_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`address_id`),
  KEY `fk_address_restaurant_id` (`restaurant_id`),
  CONSTRAINT `fk_address_restaurant_id` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant` (`restaurant_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table pivt_app.address: ~1 rows (approximately)
INSERT INTO `address` (`address_id`, `street_and_number`, `place`, `phone_number`, `restaurant_id`) VALUES
	(13, 'Bulevar Baje 90', '', '+1889532450', 40);

-- Dumping structure for table pivt_app.administrator
DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int(10) NOT NULL AUTO_INCREMENT,
  `username` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password_hash` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`administrator_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table pivt_app.administrator: ~0 rows (approximately)
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`) VALUES
	(1, 'admin', '$2b$10$RAPmMtkDnwTU9nXUMurRi.dP8RJxi2mfvPZyuOh1vR/Woct32pWFu');

-- Dumping structure for table pivt_app.day_off
DROP TABLE IF EXISTS `day_off`;
CREATE TABLE IF NOT EXISTS `day_off` (
  `day_off_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `day_off_date` date NOT NULL,
  `reason` text COLLATE utf8_unicode_ci NOT NULL,
  `restaurant_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`day_off_id`),
  KEY `fk_day_off_restaurant_id` (`restaurant_id`),
  CONSTRAINT `fk_day_off_restaurant_id` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant` (`restaurant_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table pivt_app.day_off: ~2 rows (approximately)
INSERT INTO `day_off` (`day_off_id`, `day_off_date`, `reason`, `restaurant_id`) VALUES
	(5, '2023-02-09', 'Renoviranje restorana.', 40),
	(9, '2023-02-13', 'Drzavni praznik.', 40);

-- Dumping structure for table pivt_app.location
DROP TABLE IF EXISTS `location`;
CREATE TABLE IF NOT EXISTS `location` (
  `location_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `location_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`location_id`),
  UNIQUE KEY `uq_location_location_name` (`location_name`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table pivt_app.location: ~3 rows (approximately)
INSERT INTO `location` (`location_id`, `location_name`) VALUES
	(29, 'Manjaca'),
	(2, 'Nis'),
	(1, 'Vranje');

-- Dumping structure for table pivt_app.manager
DROP TABLE IF EXISTS `manager`;
CREATE TABLE IF NOT EXISTS `manager` (
  `manager_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password_hash` varchar(128) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`manager_id`),
  UNIQUE KEY `uq_manager_username_email` (`username`,`email`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table pivt_app.manager: ~1 rows (approximately)
INSERT INTO `manager` (`manager_id`, `username`, `email`, `password_hash`, `created_at`, `is_active`) VALUES
	(6, 'lolaa', 'lola@gmail.com', '$2b$10$eOriqgLwqjrnhSY0vYcDu.ZNlBD0AInxlnlfnjLaUWxOi.6hXLa.S', '2023-01-26 13:22:28', 1);

-- Dumping structure for table pivt_app.photo
DROP TABLE IF EXISTS `photo`;
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `file_path` text COLLATE utf8_unicode_ci NOT NULL,
  `restaurant_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`photo_id`),
  UNIQUE KEY `uq_photo_file_path` (`file_path`(255)) USING BTREE,
  KEY `fk_photo_restaurant_id` (`restaurant_id`),
  CONSTRAINT `fk_photo_restaurant_id` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant` (`restaurant_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table pivt_app.photo: ~1 rows (approximately)
INSERT INTO `photo` (`photo_id`, `name`, `file_path`, `restaurant_id`) VALUES
	(26, '9817e6f9-ee4d-4e9f-99d2-40f1cda5e2d2-restoaran1.jpg', 'uploads/2023/01/9817e6f9-ee4d-4e9f-99d2-40f1cda5e2d2-restoaran1.jpg', 40);

-- Dumping structure for table pivt_app.reservation
DROP TABLE IF EXISTS `reservation`;
CREATE TABLE IF NOT EXISTS `reservation` (
  `reservation_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `last_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `phone_number` varchar(24) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `email` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `reservation_date` datetime NOT NULL,
  `reservation_duration` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  `status` enum('pending','confirmed') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'pending',
  `table_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`reservation_id`),
  KEY `fk_reservation_table_id` (`table_id`),
  CONSTRAINT `fk_reservation_table_id` FOREIGN KEY (`table_id`) REFERENCES `table` (`table_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table pivt_app.reservation: ~0 rows (approximately)

-- Dumping structure for table pivt_app.restaurant
DROP TABLE IF EXISTS `restaurant`;
CREATE TABLE IF NOT EXISTS `restaurant` (
  `restaurant_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `description` text COLLATE utf8_unicode_ci,
  `location_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`restaurant_id`),
  UNIQUE KEY `uq_restaurant_name_location_id` (`name`,`location_id`),
  KEY `fk_restaurant_location_id` (`location_id`),
  CONSTRAINT `fk_restaurant_location_id` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table pivt_app.restaurant: ~1 rows (approximately)
INSERT INTO `restaurant` (`restaurant_id`, `name`, `description`, `location_id`) VALUES
	(40, 'Restoran kod Lole', 'Dobrodošli za trpezu jedinstvenih domaćih ukusa! Nekad se znalo za svako jelo – dobar recept, sveži lokalni sastojci, spremljeni s mnogo ljubavi. U nacionalnom restoranu „Kod Lole“ i danas se zna! Inspirisani proverenim receptima naših baka, otvaramo vam riznicu nezaboravnih domaćih ukusa. Restoran „Kod Lole“ je mesto uzbudljivih gastronomskih susreta tradicije i modernosti, lokalnog i nacionalnog, domaćinskog i kosmopolitskog. Mesto gde se opušta i uživa, gde se dobro jede i gde se toče najfinija vina ili rakije. To je mesto koje će probuditi sva vaša čula. Ali „Kod Lole“ je, pre svega, vaša druga kuća. Dobrodošli!', 29);

-- Dumping structure for table pivt_app.restaurant_manager
DROP TABLE IF EXISTS `restaurant_manager`;
CREATE TABLE IF NOT EXISTS `restaurant_manager` (
  `restaurant_manager_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `restaurant_id` int(10) unsigned NOT NULL DEFAULT '0',
  `manager_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`restaurant_manager_id`),
  KEY `fk_restaurant_manager_restaurant_id` (`restaurant_id`),
  KEY `fk_restaurant_manager_manager_id` (`manager_id`),
  CONSTRAINT `fk_restaurant_manager_manager_id` FOREIGN KEY (`manager_id`) REFERENCES `manager` (`manager_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_restaurant_manager_restaurant_id` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant` (`restaurant_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table pivt_app.restaurant_manager: ~1 rows (approximately)
INSERT INTO `restaurant_manager` (`restaurant_manager_id`, `restaurant_id`, `manager_id`) VALUES
	(22, 40, 6);

-- Dumping structure for table pivt_app.table
DROP TABLE IF EXISTS `table`;
CREATE TABLE IF NOT EXISTS `table` (
  `table_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `table_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `table_capacity` int(10) unsigned NOT NULL DEFAULT '0',
  `table_max_reservation_duration` int(10) unsigned NOT NULL DEFAULT '0',
  `restaurant_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`table_id`),
  KEY `fq_table_restaurant_id` (`restaurant_id`),
  CONSTRAINT `fq_table_restaurant_id` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant` (`restaurant_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table pivt_app.table: ~5 rows (approximately)
INSERT INTO `table` (`table_id`, `table_name`, `table_capacity`, `table_max_reservation_duration`, `restaurant_id`) VALUES
	(41, 'Terasa 101', 9, 90, 40),
	(42, 'Terasa 102', 14, 30, 40),
	(43, 'Bar 201', 5, 90, 40),
	(44, 'Bar 202', 6, 120, 40),
	(46, 'Bar 203', 4, 90, 40);

-- Dumping structure for table pivt_app.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password_hash` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `forename` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `surname` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `activation_code` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `activation_code` (`activation_code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table pivt_app.user: ~0 rows (approximately)

-- Dumping structure for table pivt_app.working_hours
DROP TABLE IF EXISTS `working_hours`;
CREATE TABLE IF NOT EXISTS `working_hours` (
  `working_hours_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `day` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Monday',
  `open` tinyint(1) DEFAULT NULL,
  `opening_hours` time NOT NULL DEFAULT '00:00:00',
  `closing_hours` time NOT NULL DEFAULT '00:00:00',
  `restaurant_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`working_hours_id`) USING BTREE,
  KEY `fq_working_hours_restaurant_id` (`restaurant_id`),
  CONSTRAINT `fq_working_hours_restaurant_id` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant` (`restaurant_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table pivt_app.working_hours: ~7 rows (approximately)
INSERT INTO `working_hours` (`working_hours_id`, `day`, `open`, `opening_hours`, `closing_hours`, `restaurant_id`) VALUES
	(135, 'Monday', 0, '09:30:00', '15:00:00', 40),
	(136, 'Tuesday', 1, '19:00:00', '20:30:00', 40),
	(137, 'Wednesday', 1, '03:30:00', '20:30:00', 40),
	(138, 'Thursday', 1, '06:00:00', '19:00:00', 40),
	(139, 'Friday', 1, '07:00:00', '16:30:00', 40),
	(140, 'Saturday', 1, '02:30:00', '18:30:00', 40),
	(141, 'Sunday', 1, '11:00:00', '20:00:00', 40);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
