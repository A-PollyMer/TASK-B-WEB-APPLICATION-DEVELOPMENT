# 📝 BlogSite - Web Application Project

A full-stack blog application built with **Spring Boot** (Backend) and **React** (Frontend).

## 📋 Prerequisites & Installation

Before running this project, you must install the necessary tools.

### 1️⃣ Backend Requirements: Java Development Kit (JDK)
The backend is built using **Java Spring Boot**. You need the Java Development Kit (JDK) to run it.

* **Download:** [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://adoptium.net/) (Version 17 or higher is recommended).
* **Verify Installation:**
    Open your terminal/command prompt and type:
    ```bash
    java -version
    ```

### 2️⃣ Frontend Requirements: Node.js & NPM
The frontend is built using **React**. You need Node.js to manage dependencies and run the server.

* **Download:** [Node.js LTS Version](https://nodejs.org/en/).
* **Verify Installation:**
    Open your terminal and type:
    ```bash
    node -v
    npm -v
    ```

### 3️⃣ Database Requirements: XAMPP (MySQL)
This project uses **MySQL** as the database. The easiest way to set this up is using XAMPP.

* **Download:** [XAMPP Installer](https://www.apachefriends.org/index.html).
* **Setup:** Install and open the **XAMPP Control Panel**. Start the **Apache** and **MySQL** modules.

---

## ⚠️ IMPORTANT: Port Consistency Configuration

For the application to communicate correctly, **Ports must match** the default configuration.

| Component | Required Port | Why? |
| :--- | :--- | :--- |
| **Frontend (React)** | `3000` | The backend `CorsConfig` is set to allow requests specifically from `http://localhost:3000`. |
| **Backend (Java)** | `8080` | The frontend API calls are hardcoded to `http://localhost:8080`. |
| **Database (MySQL)** | `3306` | Standard MySQL port. The database name must be **`blogsite`**. |

> **Troubleshooting:** If your React app starts on a different port (like 3001) because 3000 is busy, the backend will block the connection (CORS Error). Ensure Port 3000 is free before starting.

---

## ⚙️ Setup Instructions

### Step 1: Configure the Database
1.  Open your browser and go to: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
2.  Click **New** on the left sidebar.
3.  **Database Name:** Type `blogsite` (Must match the configuration in the backend).
4.  **Collation:** Select `utf8mb4_general_ci`.
5.  Click **Create**.

### Step 2: Run the Backend (Spring Boot)
1.  Navigate to the `backend` folder in your terminal:
    ```bash
    cd backend
    ```
2.  Run the application using the Maven Wrapper:
    * **Windows:**
        ```bash
        mvnw spring-boot:run
        ```
    * **Mac/Linux:**
        ```bash
        ./mvnw spring-boot:run
        ```
3.  The backend will start on **http://localhost:8080**.

### Step 3: Run the Frontend (React)
1.  Open a new terminal window and navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install the project dependencies (this downloads the `node_modules`):
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
4.  The application will open automatically at **http://localhost:3000**.

---

## 🔑 Default Access & Notes
* **Register a User:** Navigate to the `/register` page to create an account.
* **Admin Access:** To make a user an Admin, open **phpMyAdmin**, find the `tblAccounts` table, and manually change the `role` column of your user from `USER` to `ADMIN`.
