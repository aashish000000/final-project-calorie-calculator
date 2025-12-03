# Food Calorie Calculator

A full-stack web application for tracking daily calorie and macro intake.

## Project Structure

```
├── api/                    # ASP.NET Core 8 Web API
│   └── CalorieCalculator.Api/
│       ├── Controllers/    # API endpoints
│       ├── Services/       # Business logic
│       ├── Entities/       # Database models
│       ├── DTOs/           # Data transfer objects
│       ├── Data/           # EF Core DbContext
│       └── Migrations/     # Database migrations
│
├── frontend/               # Next.js 14 Frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   └── lib/               # Utilities & API client
│
└── (presentation files)   # Original presentation website
```

## Tech Stack

### Backend
- ASP.NET Core 8 Web API
- Entity Framework Core
- SQL Server
- JWT Authentication
- BCrypt password hashing

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query (TanStack Query)
- React Hook Form + Zod
- Recharts

## Getting Started

### Backend Setup

1. Navigate to the API directory:
```bash
cd api/CalorieCalculator.Api
```

2. Update connection string in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=CalorieCalculatorDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

3. Run the API:
```bash
dotnet run
```

The API will be available at http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Run the development server:
```bash
npm run dev
```

The app will be available at http://localhost:3000

## Features

- **User Authentication** - Secure JWT-based login and registration
- **Food Database** - Add and manage foods with nutritional info (per 100g)
- **Meal Logging** - Log meals with automatic calorie calculation
- **Dashboard** - View daily and weekly nutrition summaries
- **Charts** - Visualize your progress over time

## API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user

### Foods
- `GET /api/foods` - List foods
- `POST /api/foods` - Create food
- `PUT /api/foods/{id}` - Update food
- `DELETE /api/foods/{id}` - Delete food

### Entries
- `GET /api/food-entries` - List entries
- `POST /api/food-entries` - Log meal
- `DELETE /api/food-entries/{id}` - Delete entry

### Metrics
- `GET /api/metrics/daily` - Daily summary
- `GET /api/metrics/range` - Weekly/monthly data

## Screenshots

### Dashboard
- Daily calorie, protein, carbs, and fat totals
- Weekly calorie chart
- Today's meal entries

### Foods Page
- List of all foods with nutrition info
- Add/edit/delete custom foods
- Pre-seeded with common foods

### Log Meal
- Select food from dropdown
- Enter grams consumed
- Preview calculated nutrition

## Author

**Aashish Joshi**  
Computer Science Major, New Jersey City University

## License

MIT
