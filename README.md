# SnipURL — Production-Grade URL Shortener

A full-stack URL shortener with **analytics**, **authentication**, **custom aliases**, and **Docker** support.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion |
| **State** | Zustand, TanStack React Query v5 |
| **Backend** | Node.js, Express.js (ESM) |
| **Database** | MongoDB + Mongoose |
| **Caching** | Redis (optional) |
| **Auth** | JWT (jsonwebtoken) |
| **Security** | Helmet, CORS, Rate Limiting |
| **Logging** | Winston |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## 📁 Project Structure

```
url-shortener/
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, rate limiter
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   ├── utils/          # Logger, error handler
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, UrlCard, StatsCard, etc.
│   │   ├── hooks/          # Zustand store, React Query hooks
│   │   ├── pages/          # Home, Login, Register, Dashboard, Analytics
│   │   └── utils/          # Axios instance
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
└── docker-compose.yml
```

---

## 🚀 Quick Start (Local Dev)

### Prerequisites
- Node.js 20+
- MongoDB running on `localhost:27017`
- (Optional) Redis on `localhost:6379`

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your values
npm install
npm run dev
# API running at http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
# App running at http://localhost:5173
```

---

## 🐳 Docker (One Command)

```bash
docker-compose up --build
```

- Frontend → http://localhost:5173  
- Backend API → http://localhost:5000  
- MongoDB → localhost:27017  
- Redis → localhost:6379

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout |

### URLs
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/urls` | Optional | Create short URL |
| GET | `/api/urls` | Required | List user's URLs |
| GET | `/api/urls/stats` | Required | Dashboard stats |
| GET | `/api/urls/:id` | Required | URL + analytics |
| PATCH | `/api/urls/:id` | Required | Update URL |
| DELETE | `/api/urls/:id` | Required | Delete URL |

### Redirect
| Method | Endpoint | Description |
|---|---|---|
| GET | `/:shortCode` | Redirect to original URL |

---

## ✨ Features

- 🔗 **URL Shortening** — instant short links with 7-char nanoid codes
- 🎨 **Custom Aliases** — `/api/urls` with `customAlias` field
- ⏰ **Expiry Dates** — auto-expire links via MongoDB TTL index
- 📊 **Analytics** — per-link click charts, device breakdown
- 🔐 **JWT Auth** — register/login, protected dashboard
- 🛡️ **Security** — Helmet headers, rate limiting, CORS
- 📱 **Responsive** — mobile-first dark UI
- 🐳 **Docker Ready** — production docker-compose with Nginx

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/url_shortener
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_key_change_me
JWT_EXPIRES_IN=7d
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_BASE_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000/api
```
