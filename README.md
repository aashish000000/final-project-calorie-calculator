# Calorie Calculator Project

A full-stack calorie tracking application with an AI-powered nutrition assistant.

## 📁 Project Structure

```
calorie-calculator/
│
├── 📂 backend/              ← Backend API (C# / ASP.NET Core)
│   ├── CalorieCalculator.Api/
│   │   ├── Controllers/     ← API endpoints
│   │   ├── Services/        ← Business logic & AI chatbot
│   │   ├── Data/            ← Database context
│   │   ├── DTOs/            ← Data transfer objects
│   │   ├── Entities/        ← Database models
│   │   └── Program.cs       ← App entry point
│   └── CalorieCalculator.sln
│
├── 📂 client/               ← Main Application (Next.js / React)
│   ├── app/
│   │   ├── (app)/           ← Protected app pages
│   │   │   ├── foods/       ← Food database
│   │   │   ├── log/         ← Daily food log
│   │   │   ├── settings/    ← User settings
│   │   │   └── page.tsx     ← Dashboard
│   │   └── auth/            ← Login/Register
│   ├── components/          ← React components
│   │   ├── ChatBot.tsx      ← AI nutrition assistant
│   │   ├── Navbar.tsx
│   │   └── ...
│   └── lib/
│       ├── api.ts           ← API client
│       └── auth-context.tsx ← Authentication
│
└── 📂 docs/                 ← Documentation/Landing Page
    ├── app/
    ├── components/          ← Landing page components
    │   ├── Hero.tsx
    │   ├── ProjectOverview.tsx
    │   └── ...
    └── page.tsx
```

## 🚀 Quick Start

### 1. Start the Backend (Port 5000)
```bash
cd backend/CalorieCalculator.Api
dotnet run
```
Backend will run at: **http://localhost:5000**

### 2. Start the Client (Port 3000)
```bash
cd client
npm install
npm run dev
```
Client will run at: **http://localhost:3000**

### 3. Start the Docs (Port 3001)
```bash
cd docs
npm install
npm run dev -- -p 3001
```
Docs will run at: **http://localhost:3001**

## ⚙️ Configuration

### Backend Setup
1. Navigate to `backend/CalorieCalculator.Api/appsettings.json`
2. Add your OpenAI API key:
```json
{
  "OpenAI": {
    "ApiKey": "your-api-key-here"
  }
}
```

### Frontend Setup
1. Navigate to `client/`
2. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🎯 Features

- **Food Logging**: Track daily meals and macros
- **AI Chatbot**: Get personalized nutrition advice powered by OpenAI
- **Goal Setting**: Set and track calorie and macro goals
- **Food Database**: Search and add foods
- **Dashboard**: View daily progress and metrics
- **Multi-language**: Support for multiple languages

## 🛠️ Tech Stack

**Backend:**
- ASP.NET Core 8.0
- Entity Framework Core
- SQLite Database
- JWT Authentication
- OpenAI API Integration

**Frontend:**
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- JWT Authentication

## 📊 API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/foods` - Get food database
- `POST /api/entries` - Log food entry
- `GET /api/metrics/daily` - Get daily metrics
- `POST /api/chat` - AI chatbot

## 📝 Development Notes

- Backend runs on port **5000**
- Client runs on port **3000**
- Docs/Landing page runs on port **3001**
- Make sure all three servers are running for full functionality
