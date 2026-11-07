-- ==================================================
-- TalentHub College Placement-Management System Database Schema
-- Database: MySQL 8.0+
-- ==================================================

CREATE DATABASE IF NOT EXISTS talenthub;
USE talenthub;

-- Table 1: STUDENTS
DROP TABLE IF EXISTS OFFERS;
DROP TABLE IF EXISTS INTERVIEW_SLOTS;
DROP TABLE IF EXISTS APPLICATIONS;
DROP TABLE IF EXISTS JOB_ALLOWED_BRANCHES;
DROP TABLE IF EXISTS JOB_LISTINGS;
DROP TABLE IF EXISTS COMPANIES;
DROP TABLE IF EXISTS STUDENTS;

CREATE TABLE STUDENTS (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    usn VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    branch VARCHAR(20) NOT NULL,
    cgpa DECIMAL(3,2) NOT NULL CHECK (cgpa >= 0.00 AND cgpa <= 10.00),
    active_backlogs INT NOT NULL DEFAULT 0 CHECK (active_backlogs >= 0),
    cleared_backlogs INT NOT NULL DEFAULT 0 CHECK (cleared_backlogs >= 0),
    has_accepted_offer BOOLEAN NOT NULL DEFAULT FALSE,
    hashed_password VARCHAR(255) NOT NULL DEFAULT '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW' -- default "password123"
);

-- Table 2: COMPANIES
CREATE TABLE COMPANIES (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL UNIQUE
);

-- Table 3: JOB_LISTINGS
CREATE TABLE JOB_LISTINGS (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    role VARCHAR(100) NOT NULL,
    season VARCHAR(20) NOT NULL,
    min_cgpa DECIMAL(3,2) NOT NULL DEFAULT 0.00 CHECK (min_cgpa >= 0.00 AND min_cgpa <= 10.00),
    max_active_backlogs INT NOT NULL DEFAULT 0 CHECK (max_active_backlogs >= 0),
    drive_date DATE NOT NULL,
    is_open BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (company_id) REFERENCES COMPANIES(company_id) ON DELETE CASCADE
);

-- Table 4: JOB_ALLOWED_BRANCHES
CREATE TABLE JOB_ALLOWED_BRANCHES (
    job_id INT NOT NULL,
    branch VARCHAR(20) NOT NULL,
    PRIMARY KEY (job_id, branch),
    FOREIGN KEY (job_id) REFERENCES JOB_LISTINGS(job_id) ON DELETE CASCADE
);

-- Table 5: APPLICATIONS
CREATE TABLE APPLICATIONS (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    job_id INT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'APPLIED',
    applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_student_job UNIQUE (student_id, job_id),
    CONSTRAINT chk_status CHECK (status IN ('APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'OFFERED', 'ACCEPTED', 'REJECTED')),
    FOREIGN KEY (student_id) REFERENCES STUDENTS(student_id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES JOB_LISTINGS(job_id) ON DELETE CASCADE
);

-- Table 6: INTERVIEW_SLOTS
CREATE TABLE INTERVIEW_SLOTS (
    interview_slot_id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    round_number INT NOT NULL CHECK (round_number > 0),
    scheduled_at DATETIME NOT NULL,
    venue VARCHAR(150) NOT NULL,
    result VARCHAR(50) DEFAULT 'PENDING',
    notes TEXT,
    CONSTRAINT uk_app_round UNIQUE (application_id, round_number),
    FOREIGN KEY (application_id) REFERENCES APPLICATIONS(application_id) ON DELETE CASCADE
);

-- Table 7: OFFERS
CREATE TABLE OFFERS (
    offer_id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    package_lpa DECIMAL(5,2) NOT NULL CHECK (package_lpa > 0),
    offer_letter_key VARCHAR(255) NOT NULL,
    accepted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uk_offer_application UNIQUE (application_id),
    FOREIGN KEY (application_id) REFERENCES APPLICATIONS(application_id) ON DELETE CASCADE
);

-- ==================================================
-- DEMO SEED DATA
-- ==================================================

-- Insert Sample Students
INSERT INTO STUDENTS (student_id, usn, name, email, branch, cgpa, active_backlogs, cleared_backlogs, has_accepted_offer) VALUES
(1, '1RV21CS001', 'Asha Sharma', 'asha@student.edu', 'CSE', 9.20, 0, 0, FALSE),
(2, '1RV21IS045', 'Rahul Kumar', 'rahul@student.edu', 'ISE', 8.40, 0, 1, FALSE),
(3, '1RV21EC089', 'Sneha Patel', 'sneha@student.edu', 'ECE', 7.80, 1, 0, FALSE),
(4, '1RV21EE012', 'Vikram Singh', 'vikram@student.edu', 'EEE', 6.90, 0, 2, FALSE),
(5, '1RV21ME034', 'Ananya Rao', 'ananya@student.edu', 'ME', 8.90, 0, 0, FALSE),
(6, '1RV21CV056', 'Karthik Nair', 'karthik@student.edu', 'CIVIL', 7.10, 2, 1, FALSE);

-- Insert Sample Companies
INSERT INTO COMPANIES (company_id, company_name) VALUES
(1, 'Infosys'),
(2, 'TCS'),
(3, 'Capgemini'),
(4, 'Amazon'),
(5, 'Google'),
(6, 'Microsoft');

-- Insert Sample Job Listings
INSERT INTO JOB_LISTINGS (job_id, company_id, role, season, min_cgpa, max_active_backlogs, drive_date, is_open) VALUES
(1, 1, 'Systems Engineer', '2025-2026', 6.50, 2, '2025-11-15', TRUE),
(2, 2, 'Digital Graduate Trainee', '2025-2026', 7.00, 1, '2025-11-20', TRUE),
(3, 3, 'Senior Software Analyst', '2025-2026', 7.50, 0, '2025-11-25', TRUE),
(4, 4, 'Software Development Engineer I (SDE-1)', '2025-2026', 8.50, 0, '2025-12-01', TRUE),
(5, 5, 'Software Engineer', '2025-2026', 8.75, 0, '2025-12-10', TRUE),
(6, 6, 'Cloud Solution Engineer', '2025-2026', 8.00, 0, '2025-10-01', FALSE); -- Closed Drive

-- Insert Job Allowed Branches
-- Job 1 (Infosys): Open to CSE, ISE, ECE, EEE (4 rows)
INSERT INTO JOB_ALLOWED_BRANCHES (job_id, branch) VALUES
(1, 'CSE'), (1, 'ISE'), (1, 'ECE'), (1, 'EEE');

-- Job 2 (TCS): Open to ALL branches (0 rows inserted)

-- Job 3 (Capgemini): CSE, ISE, ECE
INSERT INTO JOB_ALLOWED_BRANCHES (job_id, branch) VALUES
(3, 'CSE'), (3, 'ISE'), (3, 'ECE');

-- Job 4 (Amazon): CSE, ISE
INSERT INTO JOB_ALLOWED_BRANCHES (job_id, branch) VALUES
(4, 'CSE'), (4, 'ISE');

-- Job 5 (Google): CSE, ISE, ECE
INSERT INTO JOB_ALLOWED_BRANCHES (job_id, branch) VALUES
(5, 'CSE'), (5, 'ISE'), (5, 'ECE');

-- Insert Sample Applications
INSERT INTO APPLICATIONS (application_id, student_id, job_id, status, applied_at, updated_at) VALUES
(1, 1, 4, 'OFFERED', '2025-10-02 10:00:00', '2025-10-05 14:00:00'),
(2, 1, 5, 'INTERVIEW_SCHEDULED', '2025-10-03 11:30:00', '2025-10-04 09:00:00'),
(3, 2, 1, 'SHORTLISTED', '2025-10-02 14:15:00', '2025-10-03 16:20:00'),
(4, 2, 2, 'APPLIED', '2025-10-04 09:45:00', '2025-10-04 09:45:00'),
(5, 3, 1, 'APPLIED', '2025-10-05 16:00:00', '2025-10-05 16:00:00'),
(6, 5, 4, 'SHORTLISTED', '2025-10-03 12:00:00', '2025-10-04 10:00:00');

-- Insert Sample Interview Slots
INSERT INTO INTERVIEW_SLOTS (interview_slot_id, application_id, round_number, scheduled_at, venue, result, notes) VALUES
(1, 1, 1, '2025-10-04 10:00:00', 'Virtual Room A / Amazon Chime', 'PASSED', 'Candidate demonstrated excellent DSA problem solving abilities.'),
(2, 1, 2, '2025-10-05 11:30:00', 'Virtual Room B / Amazon Chime', 'PASSED', 'Strong architectural understanding and communication skills.'),
(3, 2, 1, '2025-10-10 14:00:00', 'Google Meet - Room 3', 'PENDING', 'Google Technical Interview Round 1.');

-- Insert Sample Offers
INSERT INTO OFFERS (offer_id, application_id, package_lpa, offer_letter_key, accepted) VALUES
(1, 1, 28.50, 'OFFER_AMZ_2025_ASHA_001.pdf', FALSE);
