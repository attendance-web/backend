START TRANSACTION;

SET time_zone = '+07:00';
SET NAMES utf8mb4;

CREATE DATABASE attendance_web;
USE attendance_web;

CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    fullname VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    birth_day DATE,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role ENUM('user', 'admin', 'owner') DEFAULT 'user'
);

INSERT INTO users (id, fullname, email, password, birth_day) 
VALUES ('abc123', 'John Doe', 'johndoe@example.com', 'i8ngx18or7sv6be1xikusaf6c7b6', '2030-10-20');

CREATE TABLE attendance (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    attendance TINYINT(1) DEFAULT 0,
    datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    att_open TINYINT(1) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE att_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stats TINYINT(1) DEFAULT 0,
    datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE logs (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    actiVity VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO attendance (id, user_id, attendance) 
VALUES ('att123', 'abc123', 1);

COMMIT;