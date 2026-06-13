# Library Backend (Express + Sequelize)

Minimal backend for the library system. After extracting:

1. Copy `.env.example` to `.env` and set your values.
2. Run `npm install`.
3. Start the server: `npm run dev` (requires nodemon) or `npm start`.

Endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/books
- POST /api/admin/books (admin only)
- POST /api/transactions/checkout
- POST /api/transactions/return

Database: PostgreSQL (set DB_URL in .env). Migrations are not included; models sync on startup.
