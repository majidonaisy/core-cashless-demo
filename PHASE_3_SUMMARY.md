# Phase 3 Summary: Events, Polish & Responsive Design

## Overview

Phase 3 delivered the events system with QR codes and stored-value balance checking, a mock data toggle for testing, password reset functionality, Sonner toast notifications, proper error handling, and responsive design across all pages.

**Duration**: Following Phase 2 completion  
**Status**: ✅ Complete

---

## 🎯 Phase 3 Objectives

1. ✅ Implement events system with guest accounts and QR codes
2. ✅ Check and display stored-value balance per event
3. ✅ Add mock data with a UI toggle for testing
4. ✅ Implement password reset flow
5. ✅ Redesign homepage to a minimal layout
6. ✅ Migrate all Alert components to Sonner toast notifications
7. ✅ Add proper error handling for cart remove
8. ✅ Make all pages responsive for mobile and desktop
9. ✅ Fix currency formatting (cents → dollars)

---

## 📁 Files Created (9 files)

### Events System

- `src/api/endpoints/events.ts` — Events API: `listEvents`, `getCurrentEvent`, `getEventAccount`, `checkBalance`
- `src/hooks/useEvents.ts` — Custom hook for fetching events with `forceMock` support
- `src/components/events/EventsList.tsx` — Event cards grid with current event highlighting
- `src/components/events/EventDetail.tsx` — Event detail view with QR code, balance, and account info
- `src/components/events/QRCodeDisplay.tsx` — QR code renderer using `qrcode.react`
- `src/pages/EventsPage.tsx` — Two-column events page with mock data toggle

### Mock Data

- `src/api/mockData/events.ts` — Mock event types, current event, guest account, and balance response

### Password Reset

- `src/pages/PasswordResetPage.tsx` — Password reset request form with success state

### UI Components

- `src/components/ui/sonner.tsx` — Sonner toast wrapper (adapted for Vite, no next-themes dependency)
- `src/components/ui/switch.tsx` — Toggle switch component (for mock data toggle)

---

## 📝 Files Modified (14 files)

### Routing & Layout

| File                                   | Changes                                                         |
| -------------------------------------- | --------------------------------------------------------------- |
| `src/routes/AppRoutes.tsx`             | Added `/events` and `/password-reset` routes                    |
| `src/components/shared/Navigation.tsx` | Added Events nav link, mobile hamburger menu, responsive layout |
| `src/main.tsx`                         | Added `<Toaster>` component for Sonner notifications            |

### Pages (Sonner + Responsive)

| File                         | Changes                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `src/pages/HomePage.tsx`     | Minimal redesign (no emojis/colors), responsive padding and text sizing                |
| `src/pages/LoginPage.tsx`    | Replaced Alert with `toast.error()`/`toast.success()`, added "Forgot password?" link   |
| `src/pages/RegisterPage.tsx` | Replaced Alert with Sonner toasts                                                      |
| `src/pages/ItemsPage.tsx`    | Replaced Alert/successMessage with toasts, responsive heading and grid                 |
| `src/pages/CartPage.tsx`     | Cart item removal error toast, responsive card layout, mobile-friendly checkout dialog |

### API & Context

| File                          | Changes                                                                 |
| ----------------------------- | ----------------------------------------------------------------------- |
| `src/api/endpoints/auth.ts`   | Added `passwordReset()` method                                          |
| `src/api/endpoints/cart.ts`   | `removeFromCart` now throws API error instead of returning null         |
| `src/context/AuthContext.tsx` | Added `logout()` that clears all localStorage                           |
| `src/context/CartContext.tsx` | Re-throws errors from removeFromCart, null-safe checkout URL access     |
| `src/types/api.ts`            | Added Event, EventType, EventAccount, BalanceCheck, PasswordReset types |

### Components

| File                                      | Changes                                                           |
| ----------------------------------------- | ----------------------------------------------------------------- |
| `src/components/events/EventDetail.tsx`   | Balance display divides by 100 (cents → dollars), responsive text |
| `src/components/events/EventsList.tsx`    | Responsive grid (`sm:grid-cols-2` instead of 3-col)               |
| `src/components/events/QRCodeDisplay.tsx` | QR code scales with container, `break-all` on account ID          |
| `src/components/items/ItemCard.tsx`       | No structural changes (already responsive)                        |

---

## 🔑 Key Features Implemented

### 1. Events System

**Flow:**

1. User navigates to `/events` — `useEvents` hook calls `listEvents()` and `getCurrentEvent()`
2. Events are displayed in a two-column layout (list + detail)
3. The current/upcoming event is highlighted with a green badge
4. User selects an event → `getEventAccount(login_key, event_id)` is called
5. Guest account is returned with a `qr_code` URL displayed as a QR code via `<QRCodeCanvas>`
6. `checkBalance(login_key, vid)` retrieves stored-value balance from purses
7. Total balance is summed from all purses and displayed in dollars (value ÷ 100)

**API Endpoints Used:**

- `POST /event/list.php` — List all event types
- `POST /event/current.php` — Get current/upcoming event
- `POST /event/get-account.php` — Get guest account (returns `qr_code`, `vid`, `cid`)
- `POST /event/balance-check.php` — Check balance (returns `purses[]` with `value` in cents)

### 2. Mock Data Toggle

- `Switch` component on the Events page persists to `localStorage` (`useMockEventData`)
- When enabled, all events API calls return mock data instead of hitting the real API
- Mock data includes 4 event types, 1 guest account, and a balance with 3 purses ($205.00 total)
- The `forceMock` parameter flows: `EventsPage` → `useEvents(options)` → `eventsAPI` methods

### 3. Password Reset

- `POST /patron/password-reset.php` with `{ username }` payload
- Two-state UI: form → success confirmation
- Linked from the Login page ("Forgot password?")
- Accessible at `/password-reset` (public route)

### 4. Sonner Toast Notifications

**Replaced Alert components in 5 pages:**

| Page              | Before                                            | After                                                     |
| ----------------- | ------------------------------------------------- | --------------------------------------------------------- |
| LoginPage         | `validationError` state + Alert                   | `toast.error()` on validation, `toast.success()` on login |
| RegisterPage      | `validationError` state + Alert                   | `toast.error()` / `toast.success()`                       |
| PasswordResetPage | `apiError`/`validationError` states + Alert       | `toast.error()` / `toast.success()`                       |
| EventsPage        | 3 Alert components for errors/warnings            | `useEffect` with `toast.error()`/`toast.info()`           |
| ItemsPage         | `successMessage` state + setTimeout + green Alert | `toast.success()` (auto-dismisses)                        |

**Setup:**

- `<Toaster richColors position="top-right" />` in `main.tsx`
- `sonner.tsx` adapted for Vite (removed `next-themes` useTheme dependency)

### 5. Cart Error Handling

- `cart.ts` `removeFromCart` now `throw`s the API error message (e.g., "Invalid request parameters")
- `CartContext` re-throws after setting error state
- `CartPage` catches and displays via `toast.error(message)`
- Success removal shows `toast.success('Item removed from cart')`

### 6. Responsive Design

| Component                                    | Mobile Adaptations                                                                     |
| -------------------------------------------- | -------------------------------------------------------------------------------------- |
| Navigation                                   | Hamburger menu below `md` breakpoint, collapsible mobile drawer                        |
| HomePage                                     | `text-3xl` → `sm:text-4xl`, tighter padding/spacing                                    |
| LoginPage / RegisterPage / PasswordResetPage | Already responsive (`max-w-md` + `px-4`)                                               |
| ItemsPage                                    | Heading scales down, category names wrap with `flex-wrap`                              |
| CartPage                                     | Cart items stack vertically on mobile, checkout dialog `max-w-[95vw]` on small screens |
| EventsPage                                   | Heading scales down, grid stacks to single column below `lg`                           |
| EventsList                                   | Grid uses `sm:grid-cols-2` (was 3-col, too many for half-width container)              |
| EventDetail                                  | Title/balance text scales, VID/CID use `truncate` for overflow                         |
| QRCodeDisplay                                | QR code scales with `width: 100%, maxWidth: 256px`, account ID uses `break-all`        |

---

## 🐛 Bugs Fixed

| Bug                                      | Root Cause                                         | Fix                                                     |
| ---------------------------------------- | -------------------------------------------------- | ------------------------------------------------------- |
| Infinite loop in `useEvents`             | `useCallback` missing `forceMock` dependency       | Added `forceMock` to `useCallback` deps                 |
| Cart remove "Invalid request parameters" | `login_key` was injected into cart requests        | Excluded cart endpoints from `login_key` injection      |
| Checkout popup not filling dialog        | Missing flex layout                                | Added `flex-1 min-h-0` to iframe container              |
| Mock data showing when toggle off        | Mock fallbacks in non-forceMock code paths         | Removed all mock fallbacks except when `forceMock=true` |
| Mock toggle not triggering re-fetch      | `useEffect` empty dependency array                 | Changed to depend on `[fetchEvents]`                    |
| Event cards misaligned                   | Inconsistent card heights                          | `flex flex-col` on Card + `mt-auto` on bottom section   |
| Balance showing $20,500 instead of $205  | Purse values in cents not divided by 100           | `formatCurrency(balance / 100)`                         |
| Fee inconsistency                        | EventsList divides by 100, EventDetail did not     | Fixed EventDetail to also divide by 100                 |
| Sonner using next-themes                 | `useTheme()` from next-themes doesn't work in Vite | Removed theme dependency from sonner.tsx                |

---

## 📦 Dependencies Added

| Package        | Version | Purpose                                        |
| -------------- | ------- | ---------------------------------------------- |
| `qrcode.react` | 4.2.0   | QR code rendering                              |
| `sonner`       | 2.0.7   | Toast notifications                            |
| `next-themes`  | 0.4.6   | Installed but unused (sonner adapted for Vite) |
| `lucide-react` | 0.563.0 | Icons for Sonner toast types                   |

---

## 🗂️ Project Structure After Phase 3

```
src/
├── api/
│   ├── client.ts
│   ├── endpoints/
│   │   ├── auth.ts          — login, register, logout, passwordReset
│   │   ├── cart.ts          — startCart, addToCart, removeFromCart (throws on error)
│   │   ├── events.ts        — listEvents, getCurrentEvent, getEventAccount, checkBalance
│   │   └── items.ts         — getItems
│   └── mockData/
│       └── events.ts        — Mock event types, account, balance
├── components/
│   ├── events/
│   │   ├── EventDetail.tsx   — Event info + QR code + balance + account details
│   │   ├── EventsList.tsx    — Responsive event cards grid
│   │   └── QRCodeDisplay.tsx — Scalable QR code with account ID
│   ├── items/
│   │   └── ItemCard.tsx
│   ├── shared/
│   │   └── Navigation.tsx    — Responsive nav with mobile hamburger menu
│   └── ui/                   — 11 shadcn components (+ sonner, switch)
├── context/
│   ├── AuthContext.tsx        — Auth state + logout
│   └── CartContext.tsx        — Cart state + error re-throw
├── hooks/
│   ├── useEvents.ts          — Events fetching with forceMock support
│   └── useItems.ts
├── pages/
│   ├── CartPage.tsx           — Cart + error toasts + responsive
│   ├── EventsPage.tsx         — Events + mock toggle + toasts
│   ├── HomePage.tsx           — Minimal landing page
│   ├── ItemsPage.tsx          — Items catalog + toasts + responsive
│   ├── LoginPage.tsx          — Login + toasts + forgot password link
│   ├── PasswordResetPage.tsx  — Password reset form
│   └── RegisterPage.tsx       — Register + toasts
├── routes/
│   ├── AppRoutes.tsx          — 7 routes (3 public, 3 protected, 1 reset)
│   └── ProtectedRoute.tsx
├── types/
│   └── api.ts                 — All TypeScript interfaces
└── main.tsx                   — App entry with Toaster provider
```

---

## 🌐 Routes

| Path              | Component         | Auth Required |
| ----------------- | ----------------- | :-----------: |
| `/`               | HomePage          |      No       |
| `/login`          | LoginPage         |      No       |
| `/register`       | RegisterPage      |      No       |
| `/password-reset` | PasswordResetPage |      No       |
| `/items`          | ItemsPage         |      Yes      |
| `/cart`           | CartPage          |      Yes      |
| `/events`         | EventsPage        |      Yes      |

---

## 💾 localStorage Keys

| Key                | Purpose                             |
| ------------------ | ----------------------------------- |
| `login_key`        | API authentication token            |
| `user`             | Serialized user object              |
| `cart_id`          | Active cart identifier              |
| `cart_items`       | Cart items array                    |
| `checkout_url`     | Stored `complete_sale_url` from API |
| `useMockEventData` | Mock data toggle state (boolean)    |

All keys are cleared on logout.
