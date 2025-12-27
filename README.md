# 📝 Simple Blog Web Application - Setup Guide

This project is a full-stack web application using **React (Frontend)** and **Spring Boot (Backend)** with **MySQL** as the database.

## 🚀 Prerequisites
* [XAMPP](https://www.apachefriends.org/index.html) (for MySQL Database)
* Java Development Kit (JDK) 17 or later
* Node.js & npm

---

## 🛠️ Step 1: Configure the Database (XAMPP)

1.  **Start XAMPP Control Panel.**
2.  Click **Start** next to **Apache** and **MySQL**.
3.  Open your browser and go to: [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
4.  Click **New** on the left sidebar.
5.  **Database Name:** Type `blog_db` (or whatever name is in your backend `application.properties`).
6.  **Collation:** Select `utf8mb4_general_ci`.
7.  Click **Create**.

---

## 💾 Step 2: Import the Tables (SQL Script)

1.  Click on your new database (`blog_db`) in phpMyAdmin.
2.  Click the **SQL** tab at the top.
3.  Copy and paste the code below into the text box to create all necessary tables:

```sql
-- 1. Create Users Table
CREATE TABLE tblAccounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER'
);

-- 2. Create Posts Table
CREATE TABLE tblPosts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Comments Table
CREATE TABLE tblComments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
