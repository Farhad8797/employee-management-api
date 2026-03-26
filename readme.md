# Employee Management API

A scalable Node.js backend built with **Express**, **MongoDB**, and **Redis**. This project features a multi-layer security system and optimized data retrieval using a "Cache-Aside" strategy.

---

## Tech Stack

* **Runtime:** Node.js (v24+)
* **Framework:** Express.js
* **Database:** MongoDB Atlas (Mongoose)
* **Caching:** Redis (via Docker)
* **Security:** JSON Web Tokens (JWT) & bcrypt
* **Testing:** VSCode REST Client

---

## Key Features

### 1. Advanced Caching (Sub-20ms Responses)
Used Redis to cache heavy database queries. 
* **Cache-Aside Pattern:** The app checks Redis first; if empty (a "cache miss"), it fetches from MongoDB and populates Redis for the next request.
* **Smart Invalidation:** Whenever a `POST`, `PUT`, or `DELETE` request is made, the relevant Redis cache is cleared to prevent stale data.

### 2. Multi-Layer Security & RBAC
Implemented two-stage middleware for every protected route:
* **Authentication:** Verifies identity using JWT stored in headers.
* **Authorization:** Role-Based Access Control (Admin, Editor, User). 
    * *Admin:* Full CRUD access.
    * *Editor:* Can read/write but cannot delete.
    * *User:* Read-only (GET) access.

### 3. Resilient Connection Logic
Engineered a custom **Redis Reconnect Strategy**. If the Redis container goes offline, the app attempts to reconnect 5 times before falling back to a "Direct-to-DB" mode, ensuring the server never crashes.

---

## Getting Started

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (For Redis)
* [Node.js](https://nodejs.org/)
* A MongoDB Atlas Connection String

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Farhad8797/employee-management-api.git

2. **Install Dependencies**
    ```bash
    npm install

3. **Redis Setup**
    ```bash
    docker run -d --name <container_name> -p <port> redis

4. **Setup Environment Variables**
    ```bash
    PORT=write_your_port
    DATABASE_URI=your_mongodb_uri
    ACCESS_TOKEN_SECRET=your_jwt_secret_key
    REFRESH_TOKEN_SECRET=your_jwt_secret_key
    REDIS_URL=your_redis_uri

5. **Run the server**
    ```bash
    npm run dev