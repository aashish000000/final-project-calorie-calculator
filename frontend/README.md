# Calorie Calculator Frontend

Next.js 14 frontend for the Food Calorie Calculator application.

## Prerequisites

- Node.js 18+
- npm or yarn

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API URL

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

## Features

- **Dashboard** - Daily calorie summary with charts
- **Foods** - Manage your food database
- **Log Meals** - Record food entries with automatic nutrition calculation
- **Authentication** - Secure JWT-based login/register

## Pages

- `/auth/login` - Sign in page
- `/auth/register` - Create account page
- `/` - Dashboard (protected)
- `/foods` - Food management (protected)
- `/log` - Log meals (protected)

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **React Hook Form + Zod** for forms
- **Recharts** for charts
- **js-cookie** for token storage

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── page.tsx (Dashboard)
│   │   ├── foods/page.tsx
│   │   └── log/page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── providers.tsx
├── components/
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   └── MetricCard.tsx
└── lib/
    ├── api.ts
    ├── auth-context.tsx
    ├── types.ts
    └── validations.ts
```

