# FoodHub Client

Live Site: [https://foodhub-client-pi.vercel.app/](https://foodhub-client-pi.vercel.app/)

FoodHub is a modern, full-featured food ordering web application built with Next.js, React, and a robust set of reusable UI components and modules. This README provides an overview of the tech stack, project structure, major features, and highlights the reusable modules that make development efficient and scalable.

---

## Tech Stack

- **Framework:** Next.js (App Router, SSR/SSG, API routes)
- **Language:** TypeScript
- **UI:** Shadcn/ui, Tailwind CSS, Radix UI, Lucide Icons
- **State Management:** React Context API (Cart, User)
- **Forms:** @tanstack/react-form, Zod validation
- **Authentication:** Better Auth
- **Image Upload:** Cloudinary (via next-cloudinary, custom API route)
- **Notifications:** Shadcn Sonner
- **Other:** embla-carousel-react, class-variance-authority, clsx, tailwind-merge

---

## Project Structure

- `src/app/` — App routes, layouts, and pages (Next.js App Router)
- `src/components/` — All UI, layout, and feature modules
  - `common/` — Reusable components (e.g., ImageUpload, ConfirmationDialog)
  - `layout/` — Navbar, Sidebar, Footer, ProfileDropdownMenu, etc.
  - `modules/` — Feature modules (adminDashboard, authentication, browse, cart, homepage, providerDashboard, restaurants, userDashboard, etc.)
  - `ui/` — Atomic UI components (Button, Card, Dialog, Table, etc.)
- `src/contexts/` — React Contexts for Cart and User
- `src/hooks/` — Custom hooks
- `src/lib/` — Utility functions and auth client
- `src/services/` — API service wrappers
- `src/types/` — TypeScript types for all entities
- `src/routes/` — Route definitions for different user roles
- `public/` — Static assets

---

## Major Features

### User Roles

- **Customer:** Browse meals, add to cart, place orders, leave reviews, manage profile and orders.
- **Provider:** Manage restaurant profile, create/update meals, view/manage orders.
- **Admin:** Manage users, categories, and orders.

### Authentication & Authorization

- Secure login, registration, and email verification.
- Role-based dashboard routing and access control.

### Meal Browsing & Ordering

- Browse meals by category, search, and filter.
- Meal detail pages with reviews and related meals.
- Add meals to cart (with provider conflict handling).
- Checkout and order placement.

### Restaurant Management

- Public restaurant profiles with meal listings and reviews.
- Providers can update their restaurant info and manage meals.

### Reviews & Ratings

- Customers can leave and edit reviews for meals.
- Star rating system and review summaries.

### Admin Dashboard

- User management (list, update status)
- Category management (create, update, list)
- Order management

### Responsive UI & UX

- Mobile-friendly navigation (Sheet, Accordion, Sidebar)
- Dynamic Breadcrumbs, Profile Dropdown, and more.
- Toast notifications for feedback.

---

## Reusable Modules & Components

### ImageUpload Component

- **Location:** `src/components/common/image-upload-input.tsx`
- **Purpose:** Handles image selection, preview, validation, and upload to Cloudinary via a simple ref interface. Can be used in any form with just a few lines of code.
- **Usage Example:**
  ```tsx
  const imageUploadRef = useRef<ImageUploadRef>(null);
  // ...
  <ImageUpload ref={imageUploadRef} folder="foodhub/meals" />;
  // ...
  const imageUrl = await imageUploadRef.current?.uploadToCloudinary();
  ```

### ConfirmationDialog Component

- **Location:** `src/components/common/ConfirmationDialog.tsx`
- **Purpose:** Easily add confirmation dialogs to any action (delete, update, etc.) with customizable title, description, and trigger.

### Cart Context & CartSheet

- **Location:** `src/contexts/CartContext.tsx`, `src/components/modules/cart/CartSheet.tsx`
- **Purpose:** Global cart state with provider conflict handling, persistent storage, and a responsive cart drawer UI.

### Review System

- **Location:** `src/components/modules/common/ReviewFormDialog.tsx`, `ReviewList.tsx`, `StarRating.tsx`
- **Purpose:** Modular review and rating system for meals, with dialog-based forms and summary blocks.

### PaginationControls Component

- **Location:** `src/components/ui/pagination-controls.tsx`
- **Purpose:** Simple, reusable pagination component. Import and use with minimal parameters (`limit`, `page`, `count`, `totalPages`) for any paginated list or table.

### Modular Feature Blocks

- **Location:** `src/components/modules/`
- **Purpose:** Each feature (browse, cart, dashboard, provider, admin, etc.) is organized as a module with its own blocks, forms, and lists for easy reuse and extension.

### UI Primitives

- **Location:** `src/components/ui/`
- **Purpose:** Atomic, themeable UI components (Button, Card, Dialog, Table, etc.) built on Radix UI and Tailwind CSS.

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or yarn or pnpm
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## Contributing

Feel free to open issues or PRs for improvements, bug fixes, or new features!

---

## License

This project is for educational purposes.
