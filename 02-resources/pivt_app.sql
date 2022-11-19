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
  `city` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `restaurant_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`address_id`),
  KEY `fk_address_restaurant_id` (`restaurant_id`),
  CONSTRAINT `fk_address_restaurant_id` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant` (`restaurant_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table pivt_app.location
DROP TABLE IF EXISTS `location`;
CREATE TABLE IF NOT EXISTS `location` (
  `location_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `location_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`location_id`),
  UNIQUE KEY `uq_location_location_name` (`location_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table pivt_app.manager
DROP TABLE IF EXISTS `manager`;
CREATE TABLE IF NOT EXISTS `manager` (
  `manager_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `password_hash` varchar(128) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`manager_id`),
  UNIQUE KEY `uq_manager_username` (`username`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table pivt_app.reservation
DROP TABLE IF EXISTS `reservation`;
CREATE TABLE IF NOT EXISTS `reservation` (
  `reservation_id` int(10) unsigned NOT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table pivt_app.restaurant
DROP TABLE IF EXISTS `restaurant`;
CREATE TABLE IF NOT EXISTS `restaurant` (
  `restaurant_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `location_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`restaurant_id`),
  UNIQUE KEY `uq_restaurant_name_location_id` (`name`,`location_id`),
  KEY `fk_restaurant_location_id` (`location_id`),
  CONSTRAINT `fk_restaurant_location_id` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table pivt_app.table
DROP TABLE IF EXISTS `table`;
CREATE TABLE IF NOT EXISTS `table` (
  `table_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `table_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `table_capacity` int(10) unsigned NOT NULL DEFAULT '0',
  `table_max_reservation_duration` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  `restaurant_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`table_id`),
  UNIQUE KEY `table_name` (`table_name`),
  KEY `fq_table_restaurant_id` (`restaurant_id`),
  CONSTRAINT `fq_table_restaurant_id` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant` (`restaurant_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table pivt_app.working_hours
DROP TABLE IF EXISTS `working_hours`;
CREATE TABLE IF NOT EXISTS `working_hours` (
  `working_hours_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `day` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `opening_hours` time NOT NULL DEFAULT '00:00:00',
  `closing_hours` time NOT NULL DEFAULT '00:00:00',
  `restaurant_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`working_hours_id`) USING BTREE,
  KEY `fq_working_hours_restaurant_id` (`restaurant_id`),
  CONSTRAINT `fq_working_hours_restaurant_id` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant` (`restaurant_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
