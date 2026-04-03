-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 02, 2026 at 11:32 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jobnble_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` int(11) NOT NULL,
  `job_id` int(11) DEFAULT NULL,
  `seeker_id` int(11) DEFAULT NULL,
  `match_score` int(11) DEFAULT 0,
  `match_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`match_details`)),
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employers`
--

CREATE TABLE `employers` (
  `id` int(11) NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `tax_id` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employers`
--

INSERT INTO `employers` (`id`, `company_name`, `phone`, `address`, `tax_id`, `email`, `password`, `created_at`) VALUES
(3, 'JobNNble', '0846691639', '32/11 ซอยราชปรารภ 8', '110145687321547', 'JobNNble@gmail.com', '123456', '2026-02-21 04:59:31');

-- --------------------------------------------------------

--
-- Table structure for table `jobs_post`
--

CREATE TABLE `jobs_post` (
  `id` int(11) NOT NULL,
  `employer_id` int(11) DEFAULT NULL,
  `job_title` varchar(255) DEFAULT NULL,
  `job_type` varchar(100) DEFAULT NULL,
  `disability_type` varchar(255) DEFAULT NULL,
  `disability_level` varchar(100) DEFAULT NULL,
  `salary` varchar(100) DEFAULT NULL,
  `job_location` text DEFAULT NULL,
  `job_desc` text DEFAULT NULL,
  `req_skills` text DEFAULT NULL,
  `req_experience` text DEFAULT NULL,
  `req_portfolio` text DEFAULT NULL,
  `accommodation` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jobs_post`
--

INSERT INTO `jobs_post` (`id`, `employer_id`, `job_title`, `job_type`, `disability_type`, `disability_level`, `salary`, `job_location`, `job_desc`, `req_skills`, `req_experience`, `req_portfolio`, `accommodation`, `status`, `created_at`) VALUES
(1, 3, 'Marketing Design', 'fulltime', 'ทางการได้ยินหรือสื่อความหมาย', 'ไม่ระบุระดับ', '30,000', 'กรุงเทพมหานคร', 'รายละเอียดงาน:\nออกแบบแพคเกจ\n\nคุณสมบัติผู้สมัคร:\nวุฒิปริญญาตรี', 'Microsoft Office', '', '', '', 'open', '2026-04-02 21:22:11'),
(2, 3, 'Marketing Design', 'fulltime', 'ทางการได้ยินหรือสื่อความหมาย', 'ไม่ระบุระดับ', '30,000', 'กรุงเทพมหานคร', 'รายละเอียดงาน:\nหล่อ\n\nคุณสมบัติผู้สมัคร:\nหล่อ', 'Adobe Creative Cloud', '', '', '', 'open', '2026-04-02 21:23:53'),
(3, 3, 'Marketing Design', 'fulltime', 'ทางการได้ยินหรือสื่อความหมาย', 'ไม่ระบุระดับ', '30,000', 'กรุงเทพมหานคร', 'รายละเอียดงาน:\nหล่อ\n\nคุณสมบัติผู้สมัคร:\nหล่อ', 'Adobe Creative Cloud', '', '', '', 'open', '2026-04-02 21:24:15'),
(4, 3, 'Marketing Design', 'fulltime', 'ทางการได้ยินหรือสื่อความหมาย', 'ไม่ระบุระดับ', '30,000', 'กรุงเทพมหานคร', 'รายละเอียดงาน:\nหล่อ\n\nคุณสมบัติผู้สมัคร:\nหล่อ', 'Adobe Creative Cloud', '', '', '', 'open', '2026-04-02 21:27:44');

-- --------------------------------------------------------

--
-- Table structure for table `job_seekers`
--

CREATE TABLE `job_seekers` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job_seekers`
--

INSERT INTO `job_seekers` (`id`, `first_name`, `last_name`, `phone`, `email`, `password`, `created_at`) VALUES
(7, 'มาวิน', 'ดำขำ', '0846691636', 'winners55558@gmail.com', '12345', '2026-02-21 04:58:36'),
(9, 'มาวิน', 'ดำขำ', '0817512983', 'mawin@gmail.com', '12345678w@', '2026-03-30 22:23:18'),
(10, 'siriprapa', 'yodyingworapant', '0639196279', 'yodyingworapantsiriprapa@gmail.com', 'isuskuyheetad123!', '2026-04-01 17:58:07'),
(11, '้ดดด', 'ดดด', '0845552235', 'peach@gmail.com', 'peach123!', '2026-04-01 19:03:33'),
(12, 'Suppanat', 'Saranpanich', '0972355528', 'peach.suppanat@gmail.com', '123456@a', '2026-04-02 00:17:28'),
(13, 'หห', 'หห', '1234567890', 'sss@gmail.com', '123456@a', '2026-04-02 02:29:33');

-- --------------------------------------------------------

--
-- Table structure for table `resumes`
--

CREATE TABLE `resumes` (
  `id` int(11) NOT NULL,
  `seeker_id` int(11) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `disability_type` varchar(100) DEFAULT NULL,
  `disability_level` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `sub_district` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `zipcode` varchar(10) DEFAULT NULL,
  `education_level` varchar(100) DEFAULT NULL,
  `education_history` longtext DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `portfolio_url` varchar(255) DEFAULT NULL,
  `experience` text DEFAULT NULL,
  `work_experience` longtext DEFAULT NULL,
  `intern_experience` longtext DEFAULT NULL,
  `activities` longtext DEFAULT NULL,
  `portfolio` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `selected_template` varchar(50) DEFAULT 'minimal',
  `job_position` varchar(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resumes`
--

INSERT INTO `resumes` (`id`, `seeker_id`, `dob`, `disability_type`, `disability_level`, `address`, `sub_district`, `district`, `province`, `zipcode`, `education_level`, `education_history`, `summary`, `skills`, `portfolio_url`, `experience`, `work_experience`, `intern_experience`, `activities`, `portfolio`, `updated_at`, `selected_template`, `job_position`) VALUES
(5, 10, '2004-06-03', 'visual', 'independent', '919 พระราม2', 'แขวงบางบอน', 'เขตบางบอน', 'กรุงเทพมหานคร', '19999', NULL, '[{\"level\":\"\",\"institution\":\"\",\"major\":\"\",\"gpa\":\"\"},{\"level\":\"มัธยมศึกษาตอนปลาย / ปวช.\",\"institution\":\"โรงเรียนบางปะกอกวิทยาคม\",\"major\":\"ศิลป์-คำนวณ intensive\",\"gpa\":\"3.88\"}]', 'ทำงานเก่ง', 'Microsoft Word, Microsoft Excel, PowerPoint, Adobe Illustrator, Canva, Video Editing, ภาษาอังกฤษ (สื่อสารได้)', '', NULL, '[]', '[]', '[]', NULL, '2026-04-01 18:07:20', 'minimal', ''),
(6, 1, '2549-12-20', 'physical', 'independent', '555', '', '', 'นครนายก', '', NULL, '[{\"level\":\"ปริญญาตรี\",\"institution\":\"rr\",\"major\":\"rrr\",\"gpa\":\"2\"}]', 'ddd', 'Microsoft Word, Microsoft Excel, Canva, Video Editing, ภาษาอังกฤษ (ดีเยี่ยม), dd', '', NULL, '[]', '[]', '[]', NULL, '2026-04-02 02:52:40', 'bright', ''),
(7, 11, '2551-02-18', 'intellectual', 'wheelchair', '555', 'ตำบลที่ 1', 'อำเภอที่ 1', 'นครปฐม', '21110', NULL, '[{\"level\":\"ปริญญาตรี\",\"institution\":\"กไฟก\",\"major\":\"ฟก\",\"gpa\":\"2\"}]', 'กฟกไฟกฟไกฟไ', 'Microsoft Word, Microsoft Excel, ภาษาอังกฤษ (ดีเยี่ยม), ฟอฟอฟ', '', NULL, '[{\"title\":\"กฟไกฟไ\",\"company\":\"ฟกฟไก\",\"duration\":\"ฟกฟไฟไกฟ\"}]', '[{\"title\":\"ไกฟกฟไกฟไ\",\"company\":\"กฟไกฟไกฟไ\",\"duration\":\"ฟกฟไกฟไกฟ\"},{\"title\":\"ไฟกฟไกฟไฟอ\",\"company\":\"ฟอกอำกอำ\",\"duration\":\"กฟไกำอำำฟอ\"}]', '[{\"name\":\"กฟอำกอำฟๆอ\",\"role\":\"กไฟอฟอฟ\"}]', NULL, '2026-04-02 01:40:49', 'modern', ''),
(8, 13, '2551-11-17', 'learning', 'sign_language', '555', '', '', 'นครนายก', '', NULL, '[{\"level\":\"ปวส.\",\"institution\":\"dad\",\"major\":\"adw\",\"gpa\":\"adwd\"},{\"level\":\"มัธยมศึกษาตอนปลาย / ปวช.\",\"institution\":\"dawd\",\"major\":\"adda\",\"gpa\":\"ad\"}]', 'dwadaw', 'Microsoft Word, Canva, ภาษาอังกฤษ (ดีเยี่ยม), ภาษาจีน, defgewagv', '', NULL, '[{\"title\":\"dwada\",\"company\":\"adawd\",\"duration\":\"dawdaad\"}]', '[{\"title\":\"dawd\",\"company\":\"ad\",\"duration\":\"dawdawd\"},{\"title\":\"awdwd\",\"company\":\"adawd\",\"duration\":\"adawda\"}]', '[{\"name\":\"dawdfa\",\"role\":\"fewwgagqeg\"}]', NULL, '2026-04-02 03:02:25', 'modern', ''),
(9, 7, '2005-03-28', 'visual', 'cane', '32/11', 'แขวงราชเทวี', 'เขตราชเทวี', 'กรุงเทพมหานคร', '21110', 'ปริญญาตรี', '[{\"level\":\"ปริญญาตรี\",\"institution\":\"\",\"major\":\"\",\"gpa\":\"\"}]', '⚠️ ไม่พบ API Key', '', '', 'ทำงาน: [] ฝึกงาน: []', '[]', '[]', '[]', '', '2026-04-02 21:18:17', 'bright', 'ขายไก่ทอด');

-- --------------------------------------------------------

--
-- Table structure for table `smart_matches`
--

CREATE TABLE `smart_matches` (
  `id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `seeker_id` int(11) NOT NULL,
  `match_score` int(11) NOT NULL,
  `match_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`match_details`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_id` (`job_id`),
  ADD KEY `seeker_id` (`seeker_id`);

--
-- Indexes for table `employers`
--
ALTER TABLE `employers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `jobs_post`
--
ALTER TABLE `jobs_post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employer_id` (`employer_id`);

--
-- Indexes for table `job_seekers`
--
ALTER TABLE `job_seekers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `resumes`
--
ALTER TABLE `resumes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `seeker_id` (`seeker_id`);

--
-- Indexes for table `smart_matches`
--
ALTER TABLE `smart_matches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_id` (`job_id`),
  ADD KEY `seeker_id` (`seeker_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employers`
--
ALTER TABLE `employers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `jobs_post`
--
ALTER TABLE `jobs_post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `job_seekers`
--
ALTER TABLE `job_seekers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `resumes`
--
ALTER TABLE `resumes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `smart_matches`
--
ALTER TABLE `smart_matches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
