# Calorie Calculator API

ASP.NET Core 8 Web API for the Food Calorie Calculator application.

## Prerequisites

- .NET 8 SDK
- SQL Server (LocalDB, SQL Server Express, or full SQL Server)

## Getting Started

### 1. Update Connection String

Edit `appsettings.json` and update the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=CalorieCalculatorDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

For SQL Server Express:
```
Server=.\SQLEXPRESS;Database=CalorieCalculatorDb;Trusted_Connection=True;TrustServerCertificate=True;
```

For LocalDB:
```
Server=(localdb)\mssqllocaldb;Database=CalorieCalculatorDb;Trusted_Connection=True;
```

### 2. Run Migrations

```bash
cd CalorieCalculator.Api
dotnet ef database update
```

Or the database will auto-migrate on first run.

### 3. Run the API

```bash
dotnet run
```

The API will be available at:
- http://localhost:5000
- Swagger UI: http://localhost:5000/swagger

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (requires auth)

### Foods
- `GET /api/foods` - List all foods
- `GET /api/foods/{id}` - Get food by ID
- `POST /api/foods` - Create food
- `PUT /api/foods/{id}` - Update food
- `DELETE /api/foods/{id}` - Delete food

### Food Entries
- `GET /api/food-entries?date=YYYY-MM-DD` - List entries
- `POST /api/food-entries` - Create entry
- `PUT /api/food-entries/{id}` - Update entry
- `DELETE /api/food-entries/{id}` - Delete entry

### Metrics
- `GET /api/metrics/daily?date=YYYY-MM-DD` - Daily summary
- `GET /api/metrics/range?from=YYYY-MM-DD&to=YYYY-MM-DD` - Range metrics

## JWT Configuration

Update JWT settings in `appsettings.json`:

```json
{
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "CalorieCalculatorApi",
    "Audience": "CalorieCalculatorApp",
    "ExpiresInMinutes": 1440
  }
}
```

## Database Schema

- **Users** - User accounts with email and hashed password
- **Foods** - Food items with nutrition info per 100g
- **EntryItems** - Meal logs with calculated nutrition

## Seed Data

The database is seeded with 10 common foods:
- Chicken Breast, Brown Rice, Broccoli, Salmon, Egg
- Banana, Apple, Oatmeal, Greek Yogurt, Almonds

