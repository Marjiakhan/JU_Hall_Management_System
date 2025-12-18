
CREATE DATABASE IF NOT EXISTS ju_hall_management;
USE ju_hall_management;


SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS blocks (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS floors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    block_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_floors_block (block_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rooms (
    id INT PRIMARY KEY,
    floor_id INT NOT NULL,
    capacity INT DEFAULT 4,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (floor_id) REFERENCES floors(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_rooms_floor (floor_id),
    INDEX idx_rooms_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(11) NOT NULL,
    department VARCHAR(100),
    batch VARCHAR(20),
    district VARCHAR(100),
    entry_date DATE,
    dob DATE,
    blood_group VARCHAR(10),
    photo_url TEXT,
    room_id INT,
    password VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    role ENUM('student') DEFAULT 'student',
    status ENUM('regular', 'irregular') DEFAULT 'regular',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_students_email (email),
    INDEX idx_students_phone (phone),
    INDEX idx_students_room (room_id),
    INDEX idx_students_department (department),
    INDEX idx_students_district (district),
    INDEX idx_students_batch (batch),
    INDEX idx_students_google (google_id),
    INDEX idx_students_status (status),
    CONSTRAINT chk_phone_length CHECK (CHAR_LENGTH(phone) = 11)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS supervisors (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(11) NOT NULL,
    hall_name VARCHAR(200),
    password VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    role ENUM('supervisor') DEFAULT 'supervisor',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_supervisors_email (email),
    INDEX idx_supervisors_phone (phone),
    INDEX idx_supervisors_google (google_id),
    CONSTRAINT chk_supervisor_phone_length CHECK (CHAR_LENGTH(phone) = 11)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    created_by VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES supervisors(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_notices_created_by (created_by),
    INDEX idx_notices_priority (priority),
    INDEX idx_notices_active (is_active),
    INDEX idx_notices_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    notification_number INT NOT NULL,
    notice_id INT NOT NULL,
    type ENUM('new_notice', 'notice_update') DEFAULT 'new_notice',
    message VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (notice_id) REFERENCES notices(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_notifications_notice (notice_id),
    INDEX idx_notifications_number (notification_number),
    INDEX idx_notifications_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notification_reads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(50) NOT NULL,
    notification_id INT NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY unique_student_notification (student_id, notification_id),
    INDEX idx_notification_reads_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS student_attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late') NOT NULL,
    marked_by VARCHAR(50) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (marked_by) REFERENCES supervisors(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY unique_student_date (student_id, date),
    INDEX idx_attendance_student (student_id),
    INDEX idx_attendance_date (date),
    INDEX idx_attendance_status (status),
    INDEX idx_attendance_marked_by (marked_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS emergency_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(50),
    student_name VARCHAR(200),
    emergency_type ENUM('medical', 'accident', 'fire', 'security', 'other') NOT NULL,
    location VARCHAR(255),
    room_number VARCHAR(50),
    floor VARCHAR(100),
    contact_number VARCHAR(11),
    description TEXT,
    status ENUM('pending', 'in_progress', 'resolved') DEFAULT 'pending',
    resolved_by VARCHAR(50),
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (resolved_by) REFERENCES supervisors(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_emergency_student (student_id),
    INDEX idx_emergency_status (status),
    INDEX idx_emergency_type (emergency_type),
    INDEX idx_emergency_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(11),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('pending', 'read', 'responded') DEFAULT 'pending',
    responded_by VARCHAR(50),
    response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (responded_by) REFERENCES supervisors(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_contact_status (status),
    INDEX idx_contact_email (email),
    INDEX idx_contact_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS chat_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50),
    user_role ENUM('student', 'supervisor'),
    user_name VARCHAR(200),
    message TEXT NOT NULL,
    response TEXT,
    is_emergency BOOLEAN DEFAULT FALSE,
    language VARCHAR(20) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_chat_user (user_id),
    INDEX idx_chat_role (user_role),
    INDEX idx_chat_emergency (is_emergency),
    INDEX idx_chat_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS search_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50),
    user_role ENUM('student', 'supervisor'),
    search_query VARCHAR(500),
    department_filter VARCHAR(100),
    district_filter VARCHAR(100),
    results_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_search_user (user_id),
    INDEX idx_search_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DELIMITER //
CREATE TRIGGER after_notice_insert
AFTER INSERT ON notices
FOR EACH ROW
BEGIN
    DECLARE next_number INT;
    SELECT COALESCE(MAX(notification_number), 0) + 1 INTO next_number FROM notifications;
    INSERT INTO notifications (notification_number, notice_id, type, message)
    VALUES (next_number, NEW.id, 'new_notice', CONCAT('New Notice: ', NEW.title));
END//
DELIMITER ;


DELIMITER //
CREATE TRIGGER after_notice_update
AFTER UPDATE ON notices
FOR EACH ROW
BEGIN
    DECLARE next_number INT;
    IF OLD.title != NEW.title OR OLD.content != NEW.content THEN
        SELECT COALESCE(MAX(notification_number), 0) + 1 INTO next_number FROM notifications;
        INSERT INTO notifications (notification_number, notice_id, type, message)
        VALUES (next_number, NEW.id, 'notice_update', CONCAT('Notice Updated: ', NEW.title));
    END IF;
END//
DELIMITER ;

CREATE OR REPLACE VIEW v_student_unread_notifications AS
SELECT 
    s.id AS student_id,
    COUNT(n.id) - COUNT(nr.id) AS unread_count
FROM students s
CROSS JOIN notifications n
LEFT JOIN notification_reads nr ON nr.student_id = s.id AND nr.notification_id = n.id
GROUP BY s.id;


CREATE OR REPLACE VIEW v_room_occupancy AS
SELECT 
    r.id AS room_id,
    r.floor_id,
    f.name AS floor_name,
    f.block_id,
    b.name AS block_name,
    r.capacity,
    COUNT(s.id) AS current_occupancy,
    r.capacity - COUNT(s.id) AS available_slots
FROM rooms r
JOIN floors f ON r.floor_id = f.id
JOIN blocks b ON f.block_id = b.id
LEFT JOIN students s ON s.room_id = r.id AND s.is_active = TRUE
WHERE r.is_active = TRUE
GROUP BY r.id, r.floor_id, f.name, f.block_id, b.name, r.capacity;


CREATE OR REPLACE VIEW v_attendance_summary AS
SELECT 
    sa.student_id,
    s.name AS student_name,
    DATE_FORMAT(sa.date, '%Y-%m') AS month,
    SUM(CASE WHEN sa.status = 'present' THEN 1 ELSE 0 END) AS present_days,
    SUM(CASE WHEN sa.status = 'absent' THEN 1 ELSE 0 END) AS absent_days,
    SUM(CASE WHEN sa.status = 'late' THEN 1 ELSE 0 END) AS late_days
FROM student_attendance sa
JOIN students s ON sa.student_id = s.id
GROUP BY sa.student_id, s.name, DATE_FORMAT(sa.date, '%Y-%m');


DELIMITER //
CREATE PROCEDURE get_unread_notification_count(IN p_student_id VARCHAR(50))
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM notifications) - 
        (SELECT COUNT(*) FROM notification_reads WHERE student_id = p_student_id) AS unread_count;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE mark_notification_read(IN p_student_id VARCHAR(50), IN p_notification_id INT)
BEGIN
    INSERT IGNORE INTO notification_reads (student_id, notification_id)
    VALUES (p_student_id, p_notification_id);
END//
DELIMITER ;


DELIMITER //
CREATE PROCEDURE mark_attendance(
    IN p_student_id VARCHAR(50),
    IN p_date DATE,
    IN p_status ENUM('present', 'absent', 'late'),
    IN p_marked_by VARCHAR(50),
    IN p_remarks TEXT
)
BEGIN
    INSERT INTO student_attendance (student_id, date, status, marked_by, remarks)
    VALUES (p_student_id, p_date, p_status, p_marked_by, p_remarks)
    ON DUPLICATE KEY UPDATE 
        status = p_status,
        marked_by = p_marked_by,
        remarks = p_remarks,
        updated_at = CURRENT_TIMESTAMP;
END//
DELIMITER ;

INSERT INTO blocks (id, name, description) VALUES
('block-a', 'A', 'Main Building'),
('block-b', 'B', 'Annex Building')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO floors (id, name, block_id) VALUES
(1, 'Ground Floor', 'block-a'),
(2, 'First Floor', 'block-a')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO rooms (id, floor_id, capacity) VALUES
(101, 1, 4), (102, 1, 4), (103, 1, 4), (104, 1, 4), (105, 1, 4),
(106, 1, 4), (107, 1, 4), (108, 1, 4), (109, 1, 4), (110, 1, 4),
(111, 1, 4), (112, 1, 4), (113, 1, 4), (114, 1, 4), (115, 1, 4),
(116, 1, 4), (117, 1, 4), (118, 1, 4), (119, 1, 4), (120, 1, 4),
(121, 1, 4), (122, 1, 4), (123, 1, 4), (124, 1, 4), (125, 1, 4),
(126, 1, 4), (127, 1, 4), (128, 1, 4), (129, 1, 4), (130, 1, 4),
(131, 1, 4), (132, 1, 4), (133, 1, 4), (134, 1, 4), (135, 1, 4),
(136, 1, 4), (137, 1, 4), (138, 1, 4), (139, 1, 4), (140, 1, 4)
ON DUPLICATE KEY UPDATE capacity = VALUES(capacity);

INSERT INTO rooms (id, floor_id, capacity) VALUES
(201, 2, 4), (202, 2, 4), (203, 2, 4), (204, 2, 4), (205, 2, 4),
(206, 2, 4), (207, 2, 4), (208, 2, 4), (209, 2, 4), (210, 2, 4),
(211, 2, 4), (212, 2, 4), (213, 2, 4), (214, 2, 4), (215, 2, 4),
(216, 2, 4), (217, 2, 4), (218, 2, 4), (219, 2, 4), (220, 2, 4),
(221, 2, 4), (222, 2, 4), (223, 2, 4), (224, 2, 4), (225, 2, 4),
(226, 2, 4), (227, 2, 4), (228, 2, 4), (229, 2, 4), (230, 2, 4),
(231, 2, 4), (232, 2, 4), (233, 2, 4), (234, 2, 4), (235, 2, 4),
(236, 2, 4), (237, 2, 4), (238, 2, 4), (239, 2, 4), (240, 2, 4)
ON DUPLICATE KEY UPDATE capacity = VALUES(capacity);

INSERT INTO students (id, name, first_name, last_name, department, batch, district, entry_date, dob, blood_group, phone, email, photo_url, room_id, password) VALUES
('S001', 'Ahmed Rahman', 'Ahmed', 'Rahman', 'Computer Science', '2022', 'Dhaka', '2022-09-01', '2001-05-15', 'A+', '01712345678', 'ahmed.rahman@student.edu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed', 101, 'hashed_password_placeholder'),
('S002', 'Karim Hossain', 'Karim', 'Hossain', 'Electrical Engineering', '2022', 'Chittagong', '2022-09-01', '2001-08-22', 'B+', '01812456789', 'karim.hossain@student.edu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim', 101, 'hashed_password_placeholder'),
('S003', 'Rafiq Islam', 'Rafiq', 'Islam', 'Mechanical Engineering', '2021', 'Sylhet', '2021-09-01', '2000-12-10', 'O+', '01912567890', 'rafiq.islam@student.edu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafiq', 101, 'hashed_password_placeholder'),
('S004', 'Tariq Ahmed', 'Tariq', 'Ahmed', 'Civil Engineering', '2023', 'Rajshahi', '2023-09-01', '2002-03-25', 'AB+', '01612678901', 'tariq.ahmed@student.edu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tariq', 102, 'hashed_password_placeholder')
ON DUPLICATE KEY UPDATE name = VALUES(name);
