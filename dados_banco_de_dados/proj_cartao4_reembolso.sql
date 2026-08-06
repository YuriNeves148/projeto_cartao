-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: proj_cartao4
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.24.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `reembolso`
--

DROP TABLE IF EXISTS `reembolso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reembolso` (
  `id_reembolso` int NOT NULL AUTO_INCREMENT,
  `id_compra` int NOT NULL,
  `valor_reembolso` decimal(10,2) NOT NULL,
  `data_reembolso` date NOT NULL,
  PRIMARY KEY (`id_reembolso`),
  KEY `fk_reembolso_compra` (`id_compra`),
  CONSTRAINT `fk_reembolso_compra` FOREIGN KEY (`id_compra`) REFERENCES `compra` (`id_compra`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reembolso`
--

LOCK TABLES `reembolso` WRITE;
/*!40000 ALTER TABLE `reembolso` DISABLE KEYS */;
INSERT INTO `reembolso` VALUES (2,9,120.00,'2026-01-20'),(3,15,42.30,'2026-03-22'),(5,28,95.00,'2026-08-10'),(6,35,50.00,'2026-06-18'),(7,42,139.00,'2026-07-15'),(8,48,60.00,'2026-08-28'),(9,55,100.00,'2026-05-18'),(10,63,180.00,'2026-07-30'),(11,71,220.00,'2026-08-22'),(12,79,88.20,'2026-09-01'),(13,5,10.00,'2026-05-22'),(14,130,200.00,'2026-08-03'),(17,133,250.00,'2026-11-23'),(18,134,300.00,'2026-11-06'),(19,135,68.00,'2026-12-08');
/*!40000 ALTER TABLE `reembolso` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-06 10:35:20
