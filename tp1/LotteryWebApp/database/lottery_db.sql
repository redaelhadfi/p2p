
CREATE DATABASE IF NOT EXISTS lottery_db;

USE lottery_db;

CREATE TABLE IF NOT EXISTS lottery_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    gain DECIMAL(10, 2) NOT NULL,
    date_participation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nom (nom),
    INDEX idx_date (date_participation)
);

INSERT INTO lottery_results (nom, gain, date_participation) VALUES 
('Alice', 5.67, NOW()),
('Bob', 8.23, NOW()),
('Charlie', 3.45, NOW());
