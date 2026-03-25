# LuxeCart Commerce Template

A premium full-stack ecommerce template styled like a modern fashion storefront and built to be reused for generic product-based stores. The project includes a polished customer storefront, cart and checkout flow, Stripe Checkout with webhook confirmation, and a lightweight admin area for managing products and reviewing orders.

## Highlights

- Premium storefront UI with responsive fashion-inspired styling
- Backend-driven catalog with category filters, search, sorting, and product detail pages
- Cart drawer, cart page, checkout flow, and order confirmation states
- Stripe Checkout in test mode with webhook-based payment confirmation
- Prisma + PostgreSQL backend with products, variants, categories, customers, orders, and order items
- Admin login with session-based protection, product CRUD, and order management basics
- Portfolio-friendly architecture with reusable services, contexts, and modular UI components

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Context API
- Axios
- Stripe.js

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Stripe
- express-session
- dotenv
- cors
- morgan

## Architecture Summary

- `client/` contains the customer storefront, checkout flow, and admin interface.
- `server/` contains the Express API, Stripe integration, session auth, Prisma models, and seed data.
- `server/prisma/schema.prisma` defines categories, products, variants, customers, orders, and order items.
- Stripe Checkout sessions are created on the backend and payment confirmation is finalized through Stripe webhooks.
- Admin access is intentionally lightweight for portfolio use and is powered by environment-based credentials plus signed session cookies.

## Folder Structure

```text
.
+-- client/
¦   +-- public/
¦   +-- src/
¦   ¦   +-- components/
¦   ¦   +-- context/
¦   ¦   +-- hooks/
¦   ¦   +-- pages/
¦   ¦   +-- routes/
¦   ¦   +-- services/
¦   ¦   +-- utils/
¦   +-- package.json
+-- server/
¦   +-- prisma/
¦   ¦   +-- schema.prisma
¦   ¦   +-- seed.js
¦   +-- src/
¦   ¦   +-- config/
¦   ¦   +-- controllers/
¦   ¦   +-- lib/
¦   ¦   +-- middleware/
¦   ¦   +-- routes/
¦   ¦   +-- services/
¦   ¦   +-- utils/
¦   +-- package.json
+-- README.md
```

## Features

### Storefront
- Homepage with hero, featured categories, arrivals, best sellers, newsletter, and polished loading states
- Shop page with backend-powered search, category filter, price range, sort, active filter chips, and reset actions
- Product details with variant selection, quantity control, related products, and cart integration
- Cart drawer, cart page, checkout page, success page, and cancel page

### Payments
- Stripe Checkout hosted payment page in test mode
- Pending order creation before redirect to Stripe
- Stripe webhook confirmation with backend status updates
- Success page that reads the authoritative backend order state

### Admin
- Session-based admin login
- Dashboard overview cards and recent order preview
- Product list with create, edit, delete, featured toggle, and simple variant management
- Order listing with payment and fulfillment status visibility

## Local Development Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd Fashion
```

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

### 2. Configure environment variables

Create environment files from the examples:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

On Windows PowerShell, create the files manually or duplicate them in your editor.

### 3. Start PostgreSQL

You can use a local PostgreSQL install or Docker.

Example Docker command:

```bash
docker run --name fashion-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=fashion_template -p 5432:5432 -d postgres:16
```

If port `5432` is already in use, map another port such as `5434` and update `DATABASE_URL` accordingly.

### 4. Run Prisma migration and seed

```bash
cd server
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
```

### 5. Start the apps

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

Frontend runs on `http://localhost:5173` and backend runs on `http://localhost:5000` by default.

## Environment Variables

### Client

```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### Server

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fashion_template?schema=public
CLIENT_URL=http://localhost:5173
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_me
ADMIN_SESSION_SECRET=super_secret_session_key
```

Notes:
- `CLIENT_URL` can be a single frontend URL or a comma-separated list for multi-origin deployments.
- In production, secure session cookies are enabled automatically when `NODE_ENV=production`.

## Stripe Test Mode Setup

1. Add your Stripe test secret key to `server/.env`
2. Add your Stripe test publishable key to `client/.env`
3. Start the Stripe CLI and forward events locally:

```bash
stripe listen --forward-to localhost:5000/api/checkout/webhook
```

4. Copy the returned `whsec_...` value into `STRIPE_WEBHOOK_SECRET`

### Stripe test card

Use this successful test card:

```text
Card number: 4242 4242 4242 4242
Expiry: any future date
CVC: any 3 digits
ZIP / Postal code: any value
```

## Admin Login Setup

Admin access uses environment-based credentials.

Set these values in `server/.env`:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_me
ADMIN_SESSION_SECRET=super_secret_session_key
```

Then sign in at:

```text
http://localhost:5173/admin/login
```

Suggested demo credentials for portfolio walkthroughs:

```text
Email: admin@example.com
Password: change_me
```

## Demo Flow

A clean portfolio walkthrough can follow this path:

1. Browse the homepage and shop page
2. Open a product, select a variant, and add it to cart
3. Proceed to checkout
4. Submit checkout and pay with Stripe test card
5. Return to the success page and show confirmed payment status
6. Open the admin area and review the newly created order
7. Edit a product or toggle featured status for the catalog demo

## Deployment Guidance

### Frontend deployment

Works well on Vercel or Netlify.

Set:

```env
VITE_API_URL=https://your-backend-url.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### Backend deployment

Works well on Render or Railway.

Requirements:
- PostgreSQL database
- Stripe secret key
- Stripe webhook secret
- `CLIENT_URL` set to your deployed frontend URL
- `NODE_ENV=production`

Important backend notes:
- Session cookies are configured for production automatically
- Stripe webhook route must remain reachable at `/api/checkout/webhook`
- If you deploy behind a proxy, `trust proxy` is already enabled in production mode

### Stripe production note

This project is intentionally kept in Stripe test mode for portfolio use. Before real-world use, add:
- production keys
- webhook monitoring
- stronger admin auth
- persistent session storage
- fulfillment workflows

## Portfolio-Friendly Strengths

- Demonstrates modern frontend craft and premium UI polish
- Shows a complete cart, checkout, and payment confirmation lifecycle
- Includes a real database schema and backend API design
- Balances practical architecture with beginner-friendly readability
- Includes a lightweight but credible admin workflow

## Helpful Commands

### Frontend

```bash
cd client
npm run dev
npm run build
```

### Backend

```bash
cd server
npm run dev
npm run start
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
```

## Manual Steps Before Deployment

- Add your real Stripe test keys to both env files
- Create the PostgreSQL database and run Prisma migrations
- Configure a Stripe webhook endpoint for your deployed backend
- Replace demo admin credentials with your own secure values
- Verify CORS `CLIENT_URL` matches the deployed frontend URL exactly

## License / Reuse

This project is structured as a reusable ecommerce starter and portfolio showcase. Adapt the branding, images, and data model as needed for your own storefront demos or freelance client work.
