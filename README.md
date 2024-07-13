# Travel App Backend

This is the backend for the Travel App, built with Node.js and Express.js. The backend manages user authentication, trip creation, retrieval, update, and deletion.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
  - [User Authentication](#user-authentication)
  - [Trip Management](#trip-management)
- [Models](#models)
- [Helper Functions](#helper-functions)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/travel-app-backend.git
    cd travel-app-backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your MongoDB connection string and other environment variables:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4. Start the server:
    ```sh
    npm start
    ```

## Configuration

Make sure you have a MongoDB instance running and accessible. Update the `.env` file with your MongoDB connection string and JWT secret.

## API Endpoints

### User Authentication

- **Register a new user**
  
  ```http
  POST /auth/register
  ```

- **Request Body**
  ```http
  {
    "username": "exampleUser",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Register a new user**
  ```http
  POST /auth/login
  ```

- **Request Body**
  ```http
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
### Trip Management

- **Get all trips for the current authenticated user**
  ```http
  GET /trips
  ```
- **Get trip by ID**
  ```http
  POST /auth/register
  ```
- **Create a new trip**
  ```http
  POST /auth/register
  ```
- **Request body**

```json
{
    "title": "Trip to Japan",
    "days": [
      { "date": "2024-07-13", "expense": 200 }
    ],
    "startDate": "2024-07-13",
    "endDate": "2024-07-20",
    "privateTrip": false
}
```
