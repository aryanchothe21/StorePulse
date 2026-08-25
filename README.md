# StorePulse

A full-stack, role-based store rating platform built for the Roxiler FullStack Coding Challenge. Users can discover stores and rate them (1–5), store owners can track their ratings, and admins manage the entire platform from a central dashboard.

## 🚀 Tech Stack

**Backend**
- Node.js + Express.js
- MySQL
- Prisma ORM
- JWT authentication
- bcrypt password hashing

**Frontend**
- React (Vite)
- React Router DOM
- Axios
- Context API for auth state

## 👥 Roles & Functionality

### System Administrator
- Add new stores, normal users, and admin users
- Dashboard showing total users, total stores, total ratings
- View and filter listings of users and stores (by Name, Email, Address, Role)
- View full user details — Store Owners also show their store's average rating
- Sortable tables across all listings

### Normal User
- Sign up and log in
- Browse and search stores by Name and Address
- Submit a rating (1–5) for any store
- Modify a previously submitted rating
- Update their password

### Store Owner
- Log in and view a dashboard showing:
  - List of users who rated their store
  - Average rating of their store
- Update their password

## ⚙️ Setup Instructions

### Backend

1. Navigate to the backend folder:
```bash
   cd backend
   npm install
```

2. Copy the example environment file and fill in your own values:
```bash
   cp .env.example .env
```
   Set your MySQL password in `DATABASE_URL` and a random string for `JWT_SECRET`.

3. Create the database:
```sql
   CREATE DATABASE roxiler_db;
```

4. Run migrations:
```bash
   npx prisma migrate dev
```

5. Seed the initial Admin account:
```bash
   node prisma/seed.js
```
   Default login: `admin@roxiler.com` / `Admin@1234`

6. Start the backend server:
```bash
   npm run dev
```
   Runs at `http://localhost:3000`

### Frontend

1. In a separate terminal:
```bash
   cd frontend
   npm install
   npm run dev
```
   Runs at `http://localhost:5173`

## 📡 API Reference

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/auth/signup` | Public | Register as a Normal User |
| POST | `/auth/login` | Public | Log in and receive a JWT |
| PATCH | `/auth/update-password` | Any logged-in user | Change password |
| GET | `/admin/dashboard` | Admin | User / store / rating counts |
| POST | `/admin/users` | Admin | Create a user with any role |
| GET | `/admin/users` | Admin | List Admin/Normal users (filter + sort) |
| GET | `/admin/users/:id` | Admin | Get single user detail |
| POST | `/admin/stores` | Admin | Create a store linked to a Store Owner |
| GET | `/admin/stores` | Admin | List all stores with computed average rating |
| GET | `/stores?search=` | Any logged-in user | Browse and search stores |
| POST | `/ratings` | Any logged-in user | Submit or modify a rating (1–5) |
| GET | `/store-owner/dashboard` | Store Owner | View own store's ratings + average |

## ✅ Validation Rules

| Field | Rule |
|-------|------|
| Name | 20–60 characters |
| Address | Max 400 characters |
| Password | 8–16 characters, at least 1 uppercase letter, at least 1 special character |
| Email | Standard email format |

## 🔒 Security Notes

- Passwords are hashed with bcrypt (10 salt rounds) — never stored or returned in plain text
- JWT tokens expire after 1 day
- Store Owner dashboard derives the store from the logged-in user's token, never from a client-supplied ID — preventing access to other owners' data
- Sort fields are whitelisted server-side to prevent query parameter injection
- `.env` is git-ignored; `.env.example` provides a safe template

## 🗄️ Database Schema

Three core tables — `users`, `stores`, `ratings` — with a compound unique constraint on `(userId, storeId)` in `ratings`, enabling a single `upsert` operation to handle both "submit a new rating" and "modify an existing rating."

## 👤 Author

**Aryan Chothe**

