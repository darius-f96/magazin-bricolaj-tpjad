# Magazin Bricolaj TPJAD

This is a web application built with **Spring Boot** and **Java 21** for the backend, and **React** with **Material-UI** for the frontend. The application allows users to browse products, manage their shopping cart, and place orders, while administrators can manage products and orders.

---

## Key Features

### **User Features**

1. **Product Browsing:**
    - Users can browse products categorized by `ProductCategory`.
    - Items can be searched by name and description.

2. **Cart Management:**
    - Users can add and remove items from their cart.
    - A shopping cart is automatically created for a user when they access it.

3. **Order Management:**
    - Users can submit orders based on items in their cart.
    - Users can manage delivery details.
    - After submission, users cannot modify orders, but may request changes or cancellation via an administrator.

4. **Delivery Management:**
    - Users can add, update, or remove delivery addresses.

5. **Authentication and Security:**
    - Registration and login are handled through `/auth` APIs.
    - Users are authenticated with **Spring Security** using **JWT tokens**:
        - JWT encodes user roles, username, and expiration details.
        - Token expiration: 15 minutes for the access token, 2 hours for the refresh token.
    - Refresh token logic is implemented for smooth re-authentication.
    - Unauthorized requests redirect the user to the login page.

---

### **Admin Features**

1. **Product Management (CRUD):**
    - Administrators can add, update, or remove products.

2. **Order Management:**
    - Administrators can confirm or cancel orders based on user requests.
    - Administrators can modify orders or order items based on user requests.

3. **Search:**
    - All users can search:
        - Orders by product name, price range, or date range.
        - Products by name and description.

4. **Delivery Details Management:**
    - CRUD functionality on user-defined delivery details.

---

## Application Structure (Backend)

### Layers Overview

- **Controller Layer:** Handles REST API communication between the frontend and backend.
- **Service Layer:** Business logic for application features.
- **Repository Layer:** Database interactions using **JPA Hibernate**.
- **Model Layer:** Defines the entities mapped to the database.

### Security
- Exposed `/auth` APIs are accessible without authentication.
- Other APIs require authentication and allow access based on the role (`USER` or `ADMIN`).
- Token blacklist service:
    - Implemented to handle logged-out tokens and invalidation of otherwise valid tokens.

### Service Interfaces and Implementations

#### **User Service**
- Handles CRUD operations for user profiles.

#### **Delivery Details Service**
- Handles CRUD operations for user delivery options.

#### **Order Service**
- Pure CRUD for managing orders (admin use only).

#### **Order Management Service**
- Includes the logic for:
    - Users placing orders.
    - Administrators confirming, modifying, or canceling orders.

#### **Product Service**
- Handles CRUD operations for products.

#### **Token Blacklist Service**
- Invalidates tokens after logout to ensure they cannot be reused.

---

## Database Architecture

The database schema is managed with **Liquibase**, ensuring version-controlled updates to the database structure. The schema includes tables for:

1. Users
2. Products
3. Orders
4. Delivery Details

![alt text](https://github.com/darius-f96/magazin-bricolaj-tpjad/blob/main/documentation/db-diagram.png)

### Key Characteristics:
- Orders are tied to users, delivery details, and product availability.
- Stock validation ensures products are available before confirming any order.

---

## Search Functionality

The backend supports dynamic search capabilities through **JPA Specifications**:

1. **Order Search:**
    - Search orders by:
        - Product name
        - Price range
        - Date range

2. **Product Search:**
    - Search products by:
        - Name
        - Description

These search implementations are located in the `specifications` folder of the backend.

---

## Frontend Features and Workflow

The frontend is developed in **React** using **Material-UI** for a sleek user interface. Users and admins have separate workflows based on their roles, with authentication directing to appropriate features.

**User Workflow:**
- Browse products.
- Add/remove products from the cart.
- Manage delivery details and submit orders.

**Admin Workflow:**
- Manage products (CRUD).
- Manage orders (CRUD with additional control for confirmations and cancellations).
- Handle user orders upon requests for changes.

---

## Libraries and Technologies

### Backend:
- **Spring Boot** with:
    - Spring Security
    - JPA Hibernate
    - Liquibase
- **Jakarta EE**
- **JWT**
- **Lombok**
- **Junit** for testing.

### Frontend:
- **React** with:
    - Material-UI

---

## Deployment & Infrastructure

The application is containerized and deployed using **Docker**.

### Services:

1. **PostgreSQL:**
    - Backend persistence.
    - Stores application data.

2. **Liquibase:**
    - Database version control.

3. **Spring Boot Backend:**
    - Serves REST APIs for the frontend.

### Steps to Run the Application:

1. **Backend:**
    - Install Docker.
    - Navigate to the root directory.
    - Run:
      ```bash
      docker compose build
      docker compose up -d
      ```

2. **Frontend:**
    - Install Node.js.
    - Navigate to the frontend directory.
    - Run:
      ```bash
      npm install
      npm start
      ```

---

## Authentication Flow

1. **Login/Registration:**
    - Accessible via `/auth` without authentication.

2. **Token Handling:**
    - Access tokens expire in **15 minutes**.
    - Refresh tokens expire in **2 hours**.
    - Token refresh flow prevents unexpected logout.

3. **Authorization:**
    - User roles (`USER` or `ADMIN`) define accessible APIs.

4. **Logout:**
    - Invalidates tokens using the Token Blacklist Service.

---

## Screenshots from app
![alt text](https://github.com/darius-f96/magazin-bricolaj-tpjad/blob/main/documentation/admin_page.png)
![alt text](https://github.com/darius-f96/magazin-bricolaj-tpjad/blob/main/documentation/order_page.png)
![alt text](https://github.com/darius-f96/magazin-bricolaj-tpjad/blob/main/documentation/product_page.png)
![alt text](https://github.com/darius-f96/magazin-bricolaj-tpjad/blob/main/documentation/submit_order.png)
![alt text](https://github.com/darius-f96/magazin-bricolaj-tpjad/blob/main/documentation/user_profile_page.png)

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes.
4. Push the branch and open a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For further queries or support, please contact the project contributors or submit an issue in the repository.
