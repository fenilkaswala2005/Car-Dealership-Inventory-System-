# Vehicle Inventory RESTful API

A robust, production-ready backend RESTful API built with **Python**, **FastAPI**, **PostgreSQL**, and **SQLAlchemy ORM**, featuring **JWT Authentication** and **Role-Based Access Control (RBAC)**.

---

## Features

- **User Authentication**:
  - User registration (`POST /api/auth/register`) and login (`POST /api/auth/login`).
  - JWT Bearer Token authorization.
  - Role-based authorization (`user` vs `admin`).
- **Vehicle Management** (Protected):
  - Add new vehicles (`POST /api/vehicles`).
  - View all vehicles with pagination (`GET /api/vehicles`).
  - Search vehicles by `make`, `model`, `category`, or `min_price`/`max_price` (`GET /api/vehicles/search`).
  - Update vehicle details (`PUT /api/vehicles/{id}`).
  - Delete vehicle (`DELETE /api/vehicles/{id}`) - **Admin only**.
- **Inventory Control** (Protected):
  - Purchase vehicle and automatically decrement stock quantity (`POST /api/vehicles/{id}/purchase`).
  - Restock vehicle and increment stock quantity (`POST /api/vehicles/{id}/restock`) - **Admin only**.

---

## Directory Structure

```
vehicle_inventory_api/
├── app/
│   ├── __init__.py
│   ├── main.py            # FastAPI entry point & CORS configuration
│   ├── config.py          # Environment settings (Pydantic Settings)
│   ├── database.py        # PostgreSQL connection & SQLAlchemy Session
│   ├── models.py          # SQLAlchemy ORM Models (User, Vehicle)
│   ├── schemas.py         # Pydantic schemas for request/response validation
│   ├── auth.py            # Password hashing, JWT token logic, & security dependencies
│   └── routers/
│       ├── __init__.py
│       ├── auth.py        # Registration and Login routes
│       ├── vehicles.py    # CRUD and Search vehicle routes
│       └── inventory.py   # Purchase and Restock routes
├── .env.example           # Environment variables template
├── requirements.txt       # Python dependencies list
└── README.md              # Project documentation and setup guide
```

---

## Prerequisites

1. **Python 3.9+** installed on your system.
2. **PostgreSQL** database server running locally, on cloud, or inside Docker.

---

## Step-by-Step Instructions to Run the Code

### Step 1: Clone or Navigate to the Project Directory

```bash
cd C:\Users\Dell\.gemini\antigravity\scratch\vehicle_inventory_api
```

### Step 2: Set Up a Python Virtual Environment

```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Required Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Set Up PostgreSQL Database

Ensure PostgreSQL is installed and running. Create a new database named `vehicle_db`.

#### Option A: Using PostgreSQL CLI (`psql`)
```sql
CREATE DATABASE vehicle_db;
```

#### Option B: Using Docker (Quickest Setup)
```bash
docker run --name vehicle_postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=vehicle_db -p 5432:5432 -d postgres
```

### Step 5: Configure Environment Variables

Copy `.env.example` to create a `.env` file:

```bash
# On Windows PowerShell
copy .env.example .env

# On Linux / macOS
cp .env.example .env
```

Open `.env` and verify your PostgreSQL credentials:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vehicle_db
SECRET_KEY=super-secret-key-please-change-in-production-123456789
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

*(Replace `postgres:postgres` with your PostgreSQL username and password if different).*

### Step 6: Start the FastAPI Server

Run Uvicorn with auto-reload enabled:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Upon startup, FastAPI automatically creates the required database tables (`users` and `vehicles`) in PostgreSQL.

---

## API Documentation & Interactive Swagger UI

Open your browser and navigate to:
- **Interactive Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc UI**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## API Endpoints Reference & Examples

### 1. Authentication (`/api/auth`)

#### Register Standard User (`POST /api/auth/register`)
**Request Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "userpass123",
  "role": "user"
}
```

#### Register Admin User (`POST /api/auth/register`)
**Request Body**:
```json
{
  "username": "admin_boss",
  "email": "admin@example.com",
  "password": "adminpass123",
  "role": "admin"
}
```

#### Login (`POST /api/auth/login`)
**Request Body**:
```json
{
  "username_or_email": "john_doe",
  "password": "userpass123"
}
```
**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2026-07-23T09:00:00Z"
  }
}
```

> **Note**: Copy the `access_token` and click the **Authorize** button at top-right of Swagger UI (`http://127.0.0.1:8000/docs`) to test protected endpoints.

---

### 2. Vehicles (`/api/vehicles`) - Protected

#### Add Vehicle (`POST /api/vehicles`)
**Header**: `Authorization: Bearer <token>`  
**Request Body**:
```json
{
  "make": "Toyota",
  "model": "Camry",
  "category": "Sedan",
  "price": 26500.00,
  "quantity": 10
}
```

#### List Vehicles (`GET /api/vehicles?skip=0&limit=10`)
**Header**: `Authorization: Bearer <token>`

#### Search Vehicles (`GET /api/vehicles/search?make=Toyota&category=Sedan&min_price=20000&max_price=30000`)
**Header**: `Authorization: Bearer <token>`

#### Update Vehicle (`PUT /api/vehicles/1`)
**Header**: `Authorization: Bearer <token>`  
**Request Body**:
```json
{
  "price": 25999.99,
  "quantity": 12
}
```

#### Delete Vehicle (`DELETE /api/vehicles/1`) - **Admin Only**
**Header**: `Authorization: Bearer <admin_token>`

---

### 3. Inventory (`/api/vehicles/{id}`) - Protected

#### Purchase Vehicle (`POST /api/vehicles/1/purchase`)
**Header**: `Authorization: Bearer <token>`  
**Request Body**:
```json
{
  "quantity": 2
}
```
**Response**:
```json
{
  "message": "Successfully purchased 2 vehicle(s). Remaining stock: 8",
  "vehicle": {
    "id": 1,
    "make": "Toyota",
    "model": "Camry",
    "category": "Sedan",
    "price": 25999.99,
    "quantity": 8,
    "created_at": "2026-07-23T09:00:00Z"
  }
}
```

#### Restock Vehicle (`POST /api/vehicles/1/restock`) - **Admin Only**
**Header**: `Authorization: Bearer <admin_token>`  
**Request Body**:
```json
{
  "quantity": 5
}
```
**Response**:
```json
{
  "message": "Successfully restocked 5 vehicle(s). New stock: 13",
  "vehicle": {
    "id": 1,
    "make": "Toyota",
    "model": "Camry",
    "category": "Sedan",
    "price": 25999.99,
    "quantity": 13,
    "created_at": "2026-07-23T09:00:00Z"
  }
}
```
