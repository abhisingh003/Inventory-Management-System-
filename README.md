# Inventory & Order Management System

A premium, production-ready Inventory & Order Management System built with FastAPI, PostgreSQL, React, Vite, and Tailwind CSS.

## Overview

This project delivers a full SaaS-style inventory and order management dashboard with:

- Product management with unique SKU validation
- Customer management with unique email enforcement
- Order creation with inventory validation and automatic stock deduction
- Real-time dashboard analytics and charts
- Dark UI, animations, and modern SaaS design
- Dockerized backend, frontend, and PostgreSQL services

## Features

- Product CRUD with SKU uniqueness and stock badge
- Customer CRUD with email deduplication
- Transaction-safe order creation
- Inventory validation and automatic stock reduction
- Dashboard analytics with charts and low stock alerts
- Animated UI with Framer Motion
- Responsive layout for mobile, tablet, and desktop

## Tech Stack

- Backend: Python, FastAPI, SQLAlchemy, Alembic, Pydantic
- Database: PostgreSQL
- Frontend: React, Vite, Tailwind CSS, Framer Motion, Recharts
- Containerization: Docker, Docker Compose

## Project Structure

- `backend/` – FastAPI application and database migrations
- `frontend/` – React dashboard application
- `docker-compose.yml` – Local development container setup

## Setup

### Backend

1. Copy environment example:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Set `DATABASE_URL`, `SECRET_KEY`, and `PORT` in `backend/.env`.
3. Install dependencies:
   ```bash
   cd backend
   python -m venv .venv
   .venv/Scripts/Activate.ps1
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   alembic upgrade head
   ```
5. Start backend:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

### Frontend

1. Copy environment example:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Start frontend:
   ```bash
   npm run dev
   ```

## Docker

Run the full stack locally with Docker Compose:

```bash
docker-compose up --build
```

This starts:

- Frontend on `http://localhost:4173`
- Backend on `http://localhost:8000`
- PostgreSQL on `localhost:5432`

## API Docs

The backend exposes Swagger UI at:

- `http://localhost:8000/docs`

## Deployment

Deploy the frontend to Vercel or Netlify and the backend to Render or Railway. Use a managed PostgreSQL database such as Neon, Supabase, or Render PostgreSQL.

> Set environment variables in deployment platforms, including `DATABASE_URL`, `SECRET_KEY`, and `VITE_API_URL`.

## Environment

- Backend: `backend/.env.example`
- Frontend: `frontend/.env.example`

## Notes

- Backend uses transaction-safe order creation and rollback on failure.
- Stock validation happens on both the frontend and backend.
- The UI is designed for a premium SaaS experience with modern animation and responsive design.

## Placeholder Screenshots

- `/screenshots/dashboard.png`
- `/screenshots/products.png`
- `/screenshots/customers.png`
- `/screenshots/orders.png`

## License

This code is provided for assessment and portfolio purposes.
