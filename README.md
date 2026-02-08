# Online-Shop Backend

BAD-Shop is an online shop backend application for clothes, gadgets, and cosmetics.  
The project is built with Node.js, Express, and MongoDB and demonstrates a RESTful API with authentication, authorization, and basic e-commerce functionality.

---

## Features:

- User registration and login (JWT authentication)
- User profile management
- Product catalog (clothes, gadgets, cosmetics)
- Shopping cart functionality
- Order creation and management
- Role-based access control (admin / user)

---

## Tech Stack:

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Token)
- bcrypt

---

## Project Structure:

src/

|- controllers

|- models

|- routes

|- middlewares

|- services

└ app.js

config/

   └ db.js

server.js

---
## Team:
- Bayzait Abayev
- Arslan Zheksenbaev
- Daryn Maulen
- Aldiyar Amangaliyev

---
## Authentication & Security

- Passwords are hashed using bcrypt
- Authentication via JWT
- Protected routes use authentication middleware
- Role-based access control for admin-only endpoints

---

## API Documentation

### Public Endpoints

#### Register:
POST /api/auth/register


#### Login:
POST /api/auth/login

---

### Private Endpoints (JWT required)

#### User Profile:
GET /api/users/profile

PUT /api/users/profile

---

### Products:
POST /api/products (admin only)

GET /api/products

GET /api/products/:id

PUT /api/products/:id (admin only)

DELETE /api/products/:id (admin only)

---

### Cart:
GET /api/cart

POST /api/cart

PUT /api/cart/:itemId

DELETE /api/cart/:itemId


---

### Orders:
POST /api/orders

GET /api/orders/my

GET /api/orders (admin only)

---

## Validation & Error Handling

- Input validation at schema and controller level
- Global error-handling middleware
- Meaningful HTTP status codes:
  - 400 Bad Request
  - 401 Unauthorized
  - 403 Forbidden
  - 404 Not Found
  - 500 Internal Server Error

  ---

## Deployment

The project is deployed on Render.

### 🔗 Live URL
https://online-shop-backend-ifwk.onrender.com

---

##  Setup Instructions

### 1. Clone repository
```bash
git clone https://github.com/ArsikIT/online-shop-backend.git
cd online-shop-backend 
```
### 2. Install dependencies
```bash
npm install
```
### 3. Create .env file
```bash
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
```
### 4. Run Server
```bash
npm run dev
```



