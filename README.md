# 🛍️ Aroha — Fashion E-Commerce Website

A fully functional fashion e-commerce platform built with **Flask**, **React**, and **MySQL** that demonstrates all DBMS concepts.

---

## 📁 Project Structure

```
dbms_aroha_shopping_project/
├── database/
│   ├── schema.sql          ← Database tables, triggers, views, seed data
│   └── queries.sql         ← ALL SQL queries (loaded at runtime by name)
│
├── backend/
│   ├── app.py              ← Flask entry point
│   ├── db_config.py        ← MySQL connection pool config
│   ├── models.py           ← Table structure reference
│   ├── requirements.txt    ← Python dependencies
│   ├── routes/
│   │   ├── auth.py         ← Register, Login (Customer + Admin)
│   │   ├── products.py     ← Product listing, search, categories
│   │   ├── cart.py         ← Add/remove/update cart
│   │   ├── orders.py       ← Place order (with transactions), order history
│   │   ├── reviews.py      ← Add/view reviews (with rollback)
│   │   ├── history.py      ← Browsing history
│   │   ├── recommendations.py ← Trending + personalized (SQL-based)
│   │   └── admin.py        ← Dashboard, product/category CRUD, orders, users
│   └── services/
│       └── sql_loader.py   ← Loads queries from queries.sql by @name tag
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx        ← React entry point
│       ├── App.jsx         ← Router + protected routes
│       ├── App.css         ← All styles
│       ├── api.js          ← API service layer
│       ├── AuthContext.jsx  ← Auth state management
│       ├── components/
│       │   ├── Navbar.jsx   ← Navigation with role-based links
│       │   └── ProductCard.jsx
│       └── pages/
│           ├── Login.jsx / Register.jsx
│           ├── Dashboard.jsx          ← Customer home (hero, trending, new)
│           ├── Products.jsx           ← Browse + filter + search
│           ├── ProductDetail.jsx      ← Details, reviews, add-to-cart
│           ├── Cart.jsx               ← Cart management
│           ├── OrdersPage.jsx         ← Order history
│           ├── History.jsx            ← Browsing history
│           ├── Recommendations.jsx    ← Personalized + trending
│           ├── AdminDashboard.jsx     ← Stats overview
│           ├── AdminProducts.jsx      ← CRUD products
│           ├── AdminCategories.jsx    ← CRUD categories
│           ├── AdminOrders.jsx        ← Manage order status
│           └── AdminUsers.jsx         ← View users
│
└── README.md               ← This file
```

---

## ⚙️ Tech Stack

| Layer    | Technology   |
|----------|-------------|
| Backend  | Python Flask |
| Frontend | React (Vite) |
| Database | MySQL        |
| Styling  | Vanilla CSS  |

---

## 🚀 Setup Instructions

### Prerequisites

- **Python 3.8+**
- **Node.js 18+**
- **MySQL 8.0+** (running locally)

### 1. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source database/schema.sql
```

This creates the `aroha_shopping` database with all tables, triggers, views, and seed data.

### 2. Backend Setup

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
venv\Scripts\activate     # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Update db_config.py with your MySQL password if needed

# Run the server
python app.py
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🔐 Login Credentials

### Admin
- **Username:** `admin`
- **Password:** `admin123`

### Customer
Register a new account from the Register page.

---

## 🧾 DBMS Features Implemented

| Feature | Location |
|---------|----------|
| Basic Queries (WHERE, BETWEEN) | `queries.sql` §1 |
| Aggregates (AVG, COUNT, MAX, MIN, SUM) | `queries.sql` §2 |
| Set Operations (UNION, INTERSECT, EXCEPT) | `queries.sql` §3 |
| Subqueries (nested SELECT) | `queries.sql` §4 |
| Joins (INNER, LEFT) | `queries.sql` §5 |
| Views (expensive_products, user_order_summary) | `schema.sql` |
| Triggers (rating validation) | `schema.sql` |
| Cursors (stored procedures) | `queries.sql` §16 |
| Transactions (SAVEPOINT, ROLLBACK) | `routes/orders.py`, `queries.sql` §17 |
| Concurrency (SELECT FOR UPDATE) | `routes/orders.py`, `queries.sql` §18 |
| Recovery (ROLLBACK demo) | `queries.sql` §19 |
| Constraints (CHECK, FK, UNIQUE) | `schema.sql` |

---

## 🛒 E-Commerce Features

- ✅ User registration & login
- ✅ Admin login (separate)
- ✅ Browse products with search & category filter
- ✅ Product details with reviews
- ✅ Cart system (add, update, remove)
- ✅ Order placement with transaction safety
- ✅ Order history with line items
- ✅ Browsing history tracking
- ✅ SQL-based recommendations (trending + personalized)
- ✅ Admin dashboard with analytics
- ✅ Admin product/category CRUD
- ✅ Admin order status management
- ✅ Admin user listing

---

## 🤖 SQL-Based AI Features

1. **Trending Products** — Ranked by order count + average rating
2. **History-Based Recommendations** — Products in categories the user browsed
3. **Collaborative Filtering** — Products bought by similar users
4. **Highest Rated Fallback** — Top-rated products when no personalization data exists
