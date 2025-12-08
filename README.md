# Calorie Calculator Project

A full-stack AI-powered calorie tracking application with intelligent nutrition assistance, photo recognition, and comprehensive analytics.

## 📁 Project Structure

```
calorie-calculator/
│
├── 📂 backend/              ← Backend API (C# / ASP.NET Core)
│   ├── CalorieCalculator.Api/
│   │   ├── Controllers/     ← API endpoints
│   │   ├── Services/        ← Business logic & AI services
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
│   │   ├── FoodPhotoModal.tsx  ← Photo recognition
│   │   ├── RecipeAnalyzerModal.tsx  ← Recipe analyzer
│   │   ├── WaterTracker.tsx    ← Water intake tracking
│   │   ├── FavoriteMeals.tsx   ← Quick actions
│   │   ├── SmartSuggestions.tsx  ← AI suggestions
│   │   ├── AdvancedCharts.tsx   ← Progress charts
│   │   └── ...
│   └── lib/
│       ├── api.ts           ← API client
│       └── auth-context.tsx ← Authentication
│
└── 📂 docs/                 ← Documentation/Landing Page
    ├── app/
    ├── components/          ← Landing page components
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
    "ApiKey": "your-openai-api-key-here"
  }
}
```

⚠️ **Important:** Never commit your actual API key! Use `appsettings.Example.json` as a template.

### Frontend Setup
1. Navigate to `client/`
2. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## ✨ Features

### Core Features
- **📊 Food Logging**: Track daily meals and macros with detailed nutrition breakdown
- **🎯 Goal Setting**: Set and track personalized calorie and macro goals
- **🗂️ Food Database**: Comprehensive searchable food database
- **📈 Dashboard**: Real-time progress tracking with interactive visualizations
- **🌐 Multi-language**: Support for multiple languages
- **🔐 Authentication**: Secure JWT-based user authentication

### 🤖 AI-Powered Features
1. **💬 AI Nutrition Chatbot**
   - Personalized nutrition advice powered by OpenAI GPT-4
   - Context-aware responses based on your daily intake
   - Answers questions about calories, macros, and health tips

2. **📸 Food Photo Recognition**
   - Take or upload photos of your meals
   - AI automatically identifies food items
   - Estimates portion sizes and nutrition
   - One-tap to add entire meal to your log

3. **📝 Recipe Analyzer**
   - Paste any recipe text
   - AI extracts ingredients and instructions
   - Calculates total and per-serving nutrition
   - Detailed ingredient breakdown

4. **💡 Smart Food Suggestions**
   - AI recommends foods based on remaining daily goals
   - Personalized to your macro needs
   - Shows why each food is suggested
   - Estimated serving sizes

### 📊 Analytics & Tracking
5. **📈 Advanced Charts**
   - 7-day calorie trend visualization
   - Average daily intake analytics
   - Trend analysis (gaining/losing)
   - Days on track counter
   - Weekly macro distribution

6. **💧 Water Tracking**
   - Daily water intake goals
   - Quick-add buttons (250ml, 350ml, 500ml, 750ml)
   - Custom amount input
   - Visual progress indicator
   - Today's hydration log

### ⚡ Productivity Features
7. **⭐ Favorite Meals (Quick Actions)**
   - Save frequently eaten meals
   - One-tap to add entire meal to today
   - See total nutrition for each favorite
   - Manage meal templates

## 🛠️ Tech Stack

**Backend:**
- ASP.NET Core 8.0
- Entity Framework Core
- SQLite Database
- JWT Authentication
- OpenAI API Integration (GPT-4o-mini, Vision API)

**Frontend:**
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- TanStack Query (React Query)
- JWT Authentication

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user
- `GET /api/auth/goals` - Get user goals
- `PUT /api/auth/goals` - Update user goals

### Food Management
- `GET /api/foods` - Get food database
- `POST /api/foods` - Create custom food
- `PUT /api/foods/{id}` - Update food
- `DELETE /api/foods/{id}` - Delete food

### Entry Logging
- `GET /api/entries` - Get food entries
- `POST /api/entries` - Log food entry
- `PUT /api/entries/{id}` - Update entry
- `DELETE /api/entries/{id}` - Delete entry

### Metrics & Analytics
- `GET /api/metrics/daily` - Get daily metrics
- `GET /api/metrics/range` - Get date range metrics

### AI Features
- `POST /api/chat` - AI nutrition chatbot
- `POST /api/image-recognition/analyze` - Analyze food photos
- `POST /api/recipe/analyze` - Analyze recipes
- `GET /api/suggestions` - Get smart food suggestions

### Water Tracking
- `GET /api/water/summary` - Get daily water summary
- `POST /api/water/log` - Log water intake
- `DELETE /api/water/{id}` - Delete water entry

### Favorite Meals
- `GET /api/favorite-meals` - Get favorite meals
- `POST /api/favorite-meals` - Create favorite meal
- `DELETE /api/favorite-meals/{id}` - Delete favorite meal
- `GET /api/favorite-meals/{id}/items` - Get meal items

## 🎨 Screenshots & Features Showcase

### Dashboard
- Real-time calorie and macro tracking
- Circular progress indicators
- 7-day week view with daily summaries
- Water intake tracker
- Favorite meals quick access
- AI-powered smart suggestions
- Advanced progress charts

### Food Log
- Quick food search and selection
- Photo recognition scanner
- Manual entry option
- Meal history view

### Foods Database
- Comprehensive food library
- Custom food creation
- Recipe analyzer tool
- Nutritional information display

## 🔧 Development Notes

### Ports
- Backend: **5000**
- Client: **3000**
- Docs: **3001**

### Database
- SQLite database auto-creates on first run
- Located at: `backend/CalorieCalculator.Api/CalorieCalculator.db`
- Includes seed data for common foods

### AI Features Requirements
- OpenAI API key required for:
  - AI Chatbot
  - Food Photo Recognition
  - Recipe Analyzer
  - Smart Suggestions
- All AI features gracefully degrade if API key not configured

## 📝 Development Setup

1. **Clone the repository**
2. **Install .NET 8.0 SDK**
3. **Install Node.js 18+**
4. **Configure OpenAI API key** in backend
5. **Run database migrations** (auto-created on first run)
6. **Start all servers**

## 🚀 Production Deployment

### Backend
- Configure connection strings for production database
- Set secure JWT secret keys
- Enable HTTPS
- Configure CORS for production domains

### Frontend
- Build Next.js for production: `npm run build`
- Configure production API URL
- Enable static optimization

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- OpenAI for GPT-4 and Vision API
- Next.js team for the amazing framework
- ASP.NET Core team for the robust backend framework

---

**Built with ❤️ using AI-powered technology**
