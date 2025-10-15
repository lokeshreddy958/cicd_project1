-- Budget Planner Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS budget_planner_db;
USE budget_planner_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO users (name, email, password) VALUES
('John Doe', 'john@example.com', 'password123'),
('Jane Smith', 'jane@example.com', 'password456');

INSERT INTO categories (name, type) VALUES
('Salary', 'income'),
('Freelance', 'income'),
('Food', 'expense'),
('Transportation', 'expense'),
('Entertainment', 'expense'),
('Utilities', 'expense');

INSERT INTO transactions (user_id, category_id, amount, description, transaction_date) VALUES
(1, 1, 5000.00, 'Monthly salary', '2023-10-01'),
(1, 3, -150.00, 'Grocery shopping', '2023-10-02'),
(1, 4, -50.00, 'Bus fare', '2023-10-03'),
(2, 2, 2000.00, 'Freelance project', '2023-10-01'),
(2, 5, -100.00, 'Movie tickets', '2023-10-04');
