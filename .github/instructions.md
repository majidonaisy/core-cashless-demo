# Project Reference Guide for GitHub Copilot

## Project Context

Building a React TypeScript SPA for an event management system with e-commerce capabilities. 

**Tech Stack:** React 18 + TypeScript + Vite + shadcn/ui + Tailwind CSS + Axios + React Router v6

**Backend:** Existing API (partially functional, some endpoints may fail)

---

## Core Architecture Principles

### Folder Structure

```
src/
├── api/
│   ├── client.ts              # Axios instance + interceptors
│   ├── endpoints/             # auth.ts, items.ts, cart.ts, events.ts
│   └── types.ts               # API types
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── auth/                  # LoginForm, RegisterForm
│   ├── cart/                  # CartList, CartItem, CheckoutModal
│   ├── events/                # EventsList, EventDetail, QRCodeDisplay
│   ├── items/                 # ItemCard, ItemsList
│   └── shared/                # ErrorBoundary, Loading, Navigation
├── context/
│   ├── AuthContext.tsx        # Auth state + methods
│   └── CartContext.tsx        # Cart state + methods
├── hooks/                     # useAuth, useCart, useItems, useEvents
├── lib/
│   └── utils.ts               # cn() for Tailwind
├── pages/                     # LoginPage, RegisterPage, ItemsPage, CartPage, EventsPage
├── routes/
│   ├── AppRoutes.tsx
│   └── ProtectedRoute.tsx
├── types/
│   └── domain.ts              # Business domain types
└── utils/                     # Helper functions
```

### State Management

- **Context API** for global state (AuthContext, CartContext)
- **Custom hooks** for business logic (useAuth, useCart, useItems, useEvents)
- **Local state** for UI concerns (loading, modals, form inputs)
- **NO Redux/Zustand** - avoid over-engineering

### API Layer Pattern

```typescript
// api/client.ts
- Axios instance with baseURL from env
- Request interceptor: Add login_key to request body for authenticated requests
- Response interceptor: Transform errors, handle 401 → logout
- Export: apiClient

// api/endpoints/auth.ts (same pattern for items, cart, events)
export const authAPI = {
  login: (email: string, password: string) => apiClient.post<LoginResponse>(...),
  createPasswordless: (username: string) => apiClient.post<RegisterResponse>(...),
  logout: (login_key: string) => apiClient.post<void>(...)
}
```

### Error Handling (3-tier)

1. **API Client:** Catch network errors, transform to standard format
2. **Hooks:** Catch API errors, set error state, expose to component
3. **Components:** Display shadcn/ui Alert with user-friendly messages

---

## Code Standards

### TypeScript

- **Strict mode enabled** - no `any` types
- Explicit return types for all functions
- Proper interfaces for all props and state
- Use `unknown` instead of `any` when type is truly unknown

### React Patterns

- **Functional components** with hooks only
- **Controlled inputs** for all forms
- **Proper useEffect dependencies** - no missing deps
- **Keys on list items** - use stable IDs
- **Error boundaries** at app level

### Component Pattern

```typescript
// Good component structure
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ItemCardProps {
  item: Item;
  onAddToCart: (item: Item) => void;
}

export function ItemCard({ item, onAddToCart }: ItemCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{item.description}</p>
        <Button onClick={() => onAddToCart(item)} className="mt-4">
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  )
}
```

### Styling with Tailwind + shadcn/ui

- **Use shadcn/ui components** for all UI elements (Button, Card, Alert, Toast, etc.)
- **Tailwind utilities** for spacing, layout, responsive design
- **NO inline styles** - always use Tailwind classes
- **Responsive**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints
- **cn() utility** from lib/utils.ts to merge classes

---

## Feature Requirements

### 1. Authentication

**Endpoints:**

- `POST /account/create-passwordless.php` - Create passwordless account
- `POST /account/login.php` - Login (returns login_key)
- `POST /account/logout.php` - Logout (requires login_key in body)

**Implementation:**

- Store `login_key` in localStorage
- AuthContext provides: user, isAuthenticated, login(), createAccount(), logout()
- ProtectedRoute component guards /items, /cart, /events
- Use shadcn/ui Form + Input + Label components
- Validation: email format, required fields
- Error display: shadcn/ui Alert (destructive variant)
- Note: login_key is passed in request body, not as a header

### 2. Items & Cart

**Endpoints:**

- `POST /item/get.php` - Get items (optional body: { storefront: 4 })
- `POST /cart/start.php` - Initialize cart (returns cart identifier)
- `POST /cart/add.php` - Add item (body: cart_identifier, category_id, item_id, qty)
- `POST /cart/remove.php` - Remove item (body: cart_identifier, category_id, item_id, qty)

**Implementation:**

- Filter out: category === "Reservation Packages" OR id <= 0
- Cart flow: First add → startCart() → then addItem()
- Store cart identifier in localStorage
- CartContext provides: cartIdentifier, items, addToCart(), removeFromCart()
- Display items in shadcn/ui Cards
- Cart badge shows item count
- Checkout: Open shadcn/ui Dialog with iframe (complete_sale_url)
- Success feedback: shadcn/ui Toast

### 3. Events & QR Codes

**Endpoints:**

- `POST /event/list.php` - List all event types
- `POST /event/current.php` - Get current/upcoming event
- `POST /event/get-account.php` - Get event account (body: login_key, event)
- `POST /event/balance-check.php` - Check balance (body: login_key, qr_code or vid)

**Implementation:**

- Display events in shadcn/ui Cards
- Highlight current event with shadcn/ui Badge
- On event select: getEventAccount() → get QR code → optionally checkBalance()
- QR code: Use qrcode.react library, display in shadcn/ui Card
- Balance display or error Alert if unavailable
- Note: balance-check requires employee authentication

---

## UI/UX Standards

### Loading States

- **Use shadcn/ui Skeleton** for content loading
- **Button loading state** during form submission: `<Button disabled={loading}>...</Button>`
- Always show visual feedback for async operations

### Error States

- **shadcn/ui Alert** with destructive variant
- User-friendly messages (never raw API errors)
- Example: "Unable to connect. Please try again." NOT "ERR_CONNECTION_REFUSED"

### Success Feedback

- **shadcn/ui Toast** for temporary notifications
- "Item added to cart", "Login successful", etc.

### Empty States

- Clear messaging in shadcn/ui Cards
- "Your cart is empty" with link to /items
- "No events available"

### Responsive Design

```typescript
// Grid layout example
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</div>

// Responsive nav
<nav className="flex flex-col md:flex-row gap-2 md:gap-4">
  ...
</nav>
```

---

## Common Patterns

### Context + Hook Pattern

```typescript
// AuthContext.tsx
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loginKey, setLoginKey] = useState<string | null>(null);

  // On mount: restore from localStorage
  useEffect(() => {
    const key = localStorage.getItem('login_key');
    const userData = localStorage.getItem('user');
    if (key && userData) {
      setLoginKey(key);
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      setLoginKey(response.login_key);
      setUser(response.user);
      localStorage.setItem('login_key', response.login_key);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      // Handle error
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginKey, isAuthenticated: !!user, login, ... }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### Protected Route Pattern

```typescript
// ProtectedRoute.tsx
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

### Form Pattern (with shadcn/ui)

```typescript
// Use react-hook-form + zod with shadcn/ui Form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export function LoginForm() {
  const { login } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await login(values.email, values.password);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* password field similar */}
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </Form>
  );
}
```

---

## Critical Rules

### ALWAYS

✅ Use TypeScript with explicit types  
✅ Use shadcn/ui components for all UI  
✅ Use Tailwind classes for styling  
✅ Handle errors with try-catch + Alert  
✅ Show loading states with Skeleton  
✅ Add keys to list items  
✅ Use controlled form inputs  
✅ Validate forms before submission  
✅ Make responsive with Tailwind breakpoints

### NEVER

❌ Use `any` type  
❌ Use inline styles  
❌ Mix custom styled components with shadcn/ui  
❌ Show raw API errors to users  
❌ Skip loading states  
❌ Forget error handling  
❌ Use class components  
❌ Hardcode API URLs (use env vars)

---

## Environment Setup

### Required Files

```bash
# .env.local (not committed)
VITE_API_BASE_URL=https://api.example.com

# .env.example (committed)
VITE_API_BASE_URL=https://your-api-domain.com
```

### Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## shadcn/ui Components to Use

**Core Components:**

- Button: All clickable actions
- Card: Item cards, event cards, containers
- Alert: Error messages, warnings
- Toast: Success notifications
- Badge: Cart count, status indicators
- Skeleton: Loading states
- Dialog: Modals (checkout iframe)
- Form + Input + Label: All forms
- Separator: Visual dividers

**Installation:**

```bash
npx shadcn-ui@latest add button card alert toast badge skeleton dialog form input label separator
```

---

## API Edge Cases to Handle

1. **Non-functional endpoints:** Log error, show Alert, proceed with mock behavior
2. **Network failures:** Show "Network error. Please try again." in Alert
3. **401 Unauthorized:** Clear session, redirect to /login
4. **Empty responses:** Show empty state Cards with helpful message
5. **Missing fields:** Use optional chaining and fallbacks: `item?.name ?? 'Unknown'`

---

## Code Quality Checklist

Before completing any feature:

- [ ] No TypeScript errors
- [ ] All props have explicit types
- [ ] Error handling in place (try-catch)
- [ ] Loading state implemented (Skeleton or Button loading)
- [ ] Empty state handled
- [ ] Responsive (test with dev tools)
- [ ] shadcn/ui components used (not custom styled)
- [ ] Tailwind classes used (no inline styles)
- [ ] No console.log statements
- [ ] Keys on mapped items

---

## Quick Reference

### Import Patterns

```typescript
// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// API
import { authAPI } from "@/api/endpoints/auth";
import type { LoginResponse } from "@/api/types";

// Hooks
import { useAuth } from "@/hooks/useAuth";

// React Router
import { useNavigate, Navigate, Link } from "react-router-dom";

// Tailwind merge
import { cn } from "@/lib/utils";
```

### Common Tailwind Classes

```
Layout: flex, grid, grid-cols-1 md:grid-cols-2 lg:grid-cols-3
Spacing: p-4, p-6, gap-4, mb-4, mt-8
Typography: text-sm, text-base, text-lg, font-semibold, text-muted-foreground
Colors: bg-background, text-foreground, border-border
Responsive: sm:, md:, lg:, xl:
Utility: w-full, h-full, line-clamp-2
```

---

## When in Doubt

1. **Component unclear?** Use shadcn/ui component
2. **Styling unclear?** Use Tailwind utilities
3. **State management unclear?** Use Context for global, useState for local
4. **Error handling unclear?** Try-catch + Alert component
5. **Loading state unclear?** Use Skeleton or Button loading prop
6. **Type unclear?** Define explicit interface, never use `any`

---

## API Documentation Reference

### Swagger/OpenAPI Documentation Available

**Location:** A Swagger documentation file has been provided in the project that contains the complete API specification.

**How to Use the Swagger Doc:**

1. **Refer to it for ALL endpoint details:**
   - Exact endpoint URLs and HTTP methods
   - Request parameters (query params, body params)
   - Request body schemas
   - Response structures and status codes
   - Authentication requirements
   - Error response formats

2. **Extract TypeScript types from Swagger:**
   - Look at response schemas to create accurate TypeScript interfaces
   - Pay attention to required vs optional fields
   - Note the data types (string, number, boolean, arrays, objects)
   - Check for enum values or specific constraints

3. **Priority order for API implementation:**
   - **FIRST:** Check the Swagger doc for the canonical API contract
   - **SECOND:** Cross-reference with the feature requirements in this guide
   - **THIRD:** If there's a discrepancy, trust the Swagger doc (it's the source of truth)

4. **Important notes:**
   - Some endpoints documented in Swagger may not be fully functional (backend partially complete)
   - If an endpoint fails, document it in KNOWN_ISSUES.md
   - Implement the frontend assuming correct API behavior per Swagger spec
   - Use defensive coding for potentially missing or null fields

5. **Type generation strategy:**
   - Manually create types based on Swagger schemas (more control, better learning)
   - OR use a tool like `swagger-typescript-api` to generate types (faster but review carefully)
   - Ensure all types in `src/api/types.ts` match the Swagger documentation

**Example: Creating types from Swagger**

If Swagger shows this response schema:

```json
{
  "LoginResponse": {
    "type": "object",
    "properties": {
      "error": { "$ref": "#/components/schemas/PortalError" },
      "login_key": { "type": "string" },
      "cart": { "$ref": "#/components/schemas/Cart" }
    }
  }
}
```

Create this TypeScript type:

```typescript
// src/api/types.ts
export interface PortalError {
  critical: boolean;
  type: "generic" | "format" | "login" | "comm" | "data";
  message: string;
}

export interface LoginResponse {
  error?: PortalError | null;
  login_key?: string;
  cart?: Cart | null;
}
```

**When implementing endpoints:**

- Always reference Swagger for the exact endpoint path
- Check HTTP method (most endpoints are POST, even list/get operations)
- Check required body parameters (login_key is passed in body, not headers)
- Verify request body structure
- Match response handling to Swagger schema
- All responses include an optional `error` field of type PortalError

---

**Remember:** This is a senior-level evaluation. Demonstrate clean architecture, proper error handling, type safety, and production-ready code with modern tools (shadcn/ui + Tailwind). Always reference the Swagger documentation as the authoritative source for API contracts.
