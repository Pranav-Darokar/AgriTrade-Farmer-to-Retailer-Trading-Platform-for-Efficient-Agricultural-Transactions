# Farmer To Retailer Trading Platform

A modern web-based platform facilitating direct trade between farmers and retailers, cutting out middlemen to ensure better prices for produce and fresher goods for consumers.

## 🚀 Features

- **User Roles:**
  - **Farmers:** List produce, manage inventory, view orders.
  - **Retailers:** Browse produce, place orders, track order history.
  - **Admin:** Manage users and platform settings.
- **Authentication:** Secure JWT-based authentication with role-based access control.
- **Product Management:** Farmers can add, update, and delete produce listings with images.
- **Order System:** streamlined ordering process for retailers.
- **Profile Management:** Users can manage their profiles, including addresses and contact info.
- **File Uploads:** Support for uploading product images.

## 🛠 Tech Stack

### Backend
- **Java 21**
- **Spring Boot 3.2.2**
  - Spring Web
  - Spring Data JPA
  - Spring Security (JWT)
  - Spring Validation
  - Spring Mail
- **PostgreSQL** (Database)
- **Maven** (Build Tool)

### Frontend
- **React 19**
- **Vite** (Build Tool)
- **TailwindCSS 4** (Styling)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- **Axios** (HTTP Client)
- **React Router 7** (Routing)

## 📋 Prerequisites

Ensure you have the following installed:
- [Java 21 SDK](https://www.oracle.com/java/technologies/downloads/#java21)
- [Node.js & npm](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/download/)

## ⚙️ Installation & Setup

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/farmer-retailer-platform.git
    cd farmer-retailer-platform
    ```

2.  **Configure the Database:**
    - Create a PostgreSQL database named `farmtrade`.
    - Update `src/main/resources/application.properties` with your database credentials:
      ```properties
      spring.datasource.url=jdbc:postgresql://localhost:5432/farmtrade
      spring.datasource.username=your_username
      spring.datasource.password=your_password
      ```

3.  **Run the Backend:**
    ```bash
    ./mvnw spring-boot:run
    ```
    The backend will start on `http://localhost:8080`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the Frontend:**
    ```bash
    npm run dev
    ```
    The frontend will start on `http://localhost:5173`.

## 📚 API Documentation

The backend exposes a RESTful API. Key endpoints include:

- `POST /api/auth/register`: Register a new user (Farmer/Retailer).
- `POST /api/auth/login`: Authenticate and receive a JWT.
- `GET /api/products`: List all available products.
- `POST /api/products`: Add a new product (Farmer only).
- `POST /api/orders`: Place a new order (Retailer only).

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is licensed under the MIT License.
