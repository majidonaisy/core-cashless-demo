# CORE Cashless

A web application for cashless event payments. Users can browse events, manage stored-value guest accounts with QR codes, shop for items, and check out — all from a single interface.

## What It Does

- **Events** — Browse upcoming events, get a guest account with a QR code pass, and check your stored-value balance
- **Shop** — Browse items by category and add them to a cart
- **Cart & Checkout** — Review your cart, remove items, and complete purchases through an embedded checkout flow
- **Auth** — Login, register (passwordless), password reset, and logout
- **Mock Data** — Toggle mock event data on/off for testing without a live API

## Tech Stack

| Layer         | Technology                 |
| ------------- | -------------------------- |
| Framework     | React 19 + TypeScript      |
| Build         | Vite                       |
| Styling       | Tailwind CSS 4 + shadcn/ui |
| Routing       | React Router 7             |
| HTTP          | Axios                      |
| QR Codes      | qrcode.react               |
| Notifications | Sonner                     |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

The dev server proxies `/api` requests to the backend at `https://sales.paydia.com/patch-testing-client/api`.

## Project Structure

```
src/
├── api/            # API client, endpoint modules, mock data
├── components/     # Reusable UI (events, items, shared, ui)
├── context/        # Auth and Cart providers
├── hooks/          # useEvents, useItems
├── pages/          # Route-level page components
├── routes/         # Router config + protected routes
└── types/          # TypeScript interfaces
```

## Routes

| Path              | Description           | Auth |
| ----------------- | --------------------- | :--: |
| `/`               | Home                  |  No  |
| `/login`          | Login                 |  No  |
| `/register`       | Register              |  No  |
| `/password-reset` | Password reset        |  No  |
| `/items`          | Item catalog          | Yes  |
| `/cart`           | Shopping cart         | Yes  |
| `/events`         | Events + QR + balance | Yes  |

## API Endpoints

| Endpoint                          | Purpose                     |
| --------------------------------- | --------------------------- |
| `POST /patron/login.php`          | Login                       |
| `POST /patron/register.php`       | Register                    |
| `POST /patron/password-reset.php` | Password reset              |
| `POST /store/get-items.php`       | Fetch item catalog          |
| `POST /cart/start.php`            | Start a cart                |
| `POST /cart/add.php`              | Add item to cart            |
| `POST /cart/remove.php`           | Remove item from cart       |
| `POST /event/list.php`            | List event types            |
| `POST /event/current.php`         | Current/upcoming event      |
| `POST /event/get-account.php`     | Get guest account (QR code) |
| `POST /event/balance-check.php`   | Check stored-value balance  |
