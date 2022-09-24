-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Gegenereerd op: 24 sep 2022 om 21:41
-- Serverversie: 10.4.24-MariaDB
-- PHP-versie: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `website`
--
CREATE DATABASE IF NOT EXISTS `website` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `website`;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `accesscode`
--

CREATE TABLE `accesscode` (
  `id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `isUsed` tinyint(1) DEFAULT 0,
  `userId` int(11) DEFAULT NULL,
  `usedAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `editedcontent`
--

CREATE TABLE `editedcontent` (
  `id` int(11) NOT NULL,
  `timeLeftUnix` bigint(20) NOT NULL,
  `headerText` varchar(255) DEFAULT NULL,
  `titleText` varchar(255) DEFAULT NULL,
  `imageLink` varchar(255) DEFAULT NULL,
  `imageAlt` varchar(255) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `lastTimeUpdateToRow` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `lastTimeUpdateToRow` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `accesscode`
--
ALTER TABLE `accesscode`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usedBy` (`userId`);

--
-- Indexen voor tabel `editedcontent`
--
ALTER TABLE `editedcontent`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_user.id` (`user_id`);

--
-- Indexen voor tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `accesscode`
--
ALTER TABLE `accesscode`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT voor een tabel `editedcontent`
--
ALTER TABLE `editedcontent`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT voor een tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Beperkingen voor geëxporteerde tabellen
--

--
-- Beperkingen voor tabel `accesscode`
--
ALTER TABLE `accesscode`
  ADD CONSTRAINT `usedBy` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `editedcontent`
--
ALTER TABLE `editedcontent`
  ADD CONSTRAINT `user_id_user.id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
