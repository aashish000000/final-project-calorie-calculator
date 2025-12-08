export const siteContent = {
  hero: {
    title: "Food Calorie Calculator App Architecture",
    subtitle: "A modern full-stack web app for tracking daily calorie intake",
    badge: "Presentation by Aashish Joshi",
    ctaPrimary: "Scroll to Overview",
    ctaSecondary: "View Tech Stack",
  },

  aboutMe: {
    title: "About Me",
    subtitle: "The Developer Behind the Project",
    description: [
      "My name is Aashish Joshi, a junior Computer Science major at New Jersey City University (NJCU).",
      "I'm passionate about full-stack web development, combining front-end design with back-end logic to build meaningful applications.",
    ],
  },

  whyProject: {
    title: "Why This Project?",
    subtitle: "The Motivation Behind Building This App",
    reasons: [
      {
        title: "Health Technology Interest",
        description:
          "I'm deeply interested in health technology and how software can improve people's lives through better nutrition tracking.",
      },
      {
        title: "Helping Users",
        description:
          "My goal is to help users understand and manage their daily calorie intake more easily and effectively.",
      },
      {
        title: "Practical Application",
        description:
          "This project allows me to apply my full-stack development skills to solve a real-world wellness problem.",
      },
      {
        title: "Modern Technologies",
        description:
          "It combines nutrition tracking with modern web technologies, creating a comprehensive learning experience.",
      },
    ],
  },

  objectives: {
    title: "Project Objectives",
    subtitle: "Key Goals and Deliverables",
    items: [
      {
        icon: "responsive",
        title: "Responsive Web App",
        description: "Develop a fully responsive calorie-tracking web application that works seamlessly across all devices.",
      },
      {
        icon: "security",
        title: "Secure Authentication",
        description: "Implement secure user authentication using JWT (JSON Web Tokens) for protected API access.",
      },
      {
        icon: "database",
        title: "Data Management",
        description: "Store and manage food entries in SQL Server using Entity Framework Core for efficient data operations.",
      },
      {
        icon: "dashboard",
        title: "Visual Dashboard",
        description: "Visualize user metrics in an intuitive dashboard with charts and progress indicators.",
      },
      {
        icon: "analytics",
        title: "Calorie Summaries",
        description: "Provide daily and weekly summaries of calories and macronutrients to help users track progress.",
      },
    ],
  },

  howItWorks: {
    title: "How It Works",
    subtitle: "The User Journey Through the App",
    steps: [
      {
        number: 1,
        title: "Sign Up or Log In",
        description: "Users create an account or log in to access their personalized dashboard.",
      },
      {
        number: 2,
        title: "Add Food Items",
        description: "Users add food items with portion sizes in grams for accurate tracking.",
      },
      {
        number: 3,
        title: "Calculate Calories",
        description: "The backend calculates total calories using nutrition data, enhanced with AI capabilities.",
      },
      {
        number: 4,
        title: "Store Data",
        description: "All food entries and calculations are securely stored in SQL Server.",
      },
      {
        number: 5,
        title: "View Dashboard",
        description: "Users see their daily and weekly stats displayed visually on the dashboard.",
      },
    ],
  },

  techStack: {
    title: "Technology Stack",
    subtitle: "The Tools Powering This Application",
    categories: [
      {
        name: "Frontend",
        technologies: [
          { name: "Next.js", icon: "nextjs", description: "React framework for production" },
          { name: "Tailwind CSS", icon: "tailwind", description: "Utility-first CSS framework" },
        ],
      },
      {
        name: "Backend",
        technologies: [
          { name: ".NET Core API", icon: "dotnet", description: "High-performance web API" },
          { name: "Entity Framework", icon: "ef", description: "ORM for database operations" },
          { name: "JWT Auth", icon: "jwt", description: "Secure token authentication" },
        ],
      },
      {
        name: "Database",
        technologies: [
          { name: "SQL Server", icon: "sqlserver", description: "Relational database management" },
        ],
      },
      {
        name: "Tools",
        technologies: [
          { name: "Visual Studio", icon: "vs", description: "IDE for .NET development" },
          { name: "Postman", icon: "postman", description: "API testing and documentation" },
          { name: "GitHub", icon: "github", description: "Version control and collaboration" },
          { name: "Vercel", icon: "vercel", description: "Frontend deployment platform" },
        ],
      },
    ],
  },

  projectOverview: {
    title: "Project Overview",
    subtitle: "What the Application Does",
    features: [
      {
        icon: "web",
        title: "Web-Based Tracking",
        description: "A comprehensive web-based calorie tracking system accessible from any browser.",
      },
      {
        icon: "auth",
        title: "JWT Authentication",
        description: "Users register and log in securely with JWT-based authentication.",
      },
      {
        icon: "food",
        title: "Custom Food Entries",
        description: "Add foods with per-100g nutritional values for accurate tracking.",
      },
      {
        icon: "calc",
        title: "Automatic Calculation",
        description: "Log daily meals and let the system automatically calculate calories.",
      },
      {
        icon: "metrics",
        title: "Dashboard Metrics",
        description: "View daily and weekly metrics in a beautiful, intuitive dashboard.",
      },
    ],
  },

  dataFlow: {
    title: "Data Flow Overview",
    subtitle: "How Information Moves Through the System",
    flows: [
      {
        step: 1,
        title: "Authentication",
        description: "User registers or logs in, and the server issues a JWT access token for secure API access.",
      },
      {
        step: 2,
        title: "Food Entry",
        description: "User adds foods to the database and specifies the weight in grams for each item.",
      },
      {
        step: 3,
        title: "Meal Logging",
        description: "User logs meals with specific gram amounts. Server calculates calories and macros automatically.",
      },
      {
        step: 4,
        title: "AI Enhancement",
        description: "OpenAI integration assists with nutritional computation and food recognition.",
      },
      {
        step: 5,
        title: "Dashboard Display",
        description: "Dashboard aggregates data showing daily totals, weekly summaries, and macro distribution charts.",
      },
    ],
  },

  databaseSchema: {
    title: "Database Schema",
    subtitle: "The Data Structure Behind the App",
    tables: [
      {
        name: "Users",
        description: "Stores user account information",
        fields: [
          { name: "Id", type: "int", key: true },
          { name: "Email", type: "string" },
          { name: "PasswordHash", type: "string" },
          { name: "CreatedAt", type: "datetime" },
        ],
      },
      {
        name: "EntryItems",
        description: "Stores food entry records",
        fields: [
          { name: "Id", type: "int", key: true },
          { name: "UserId", type: "int", fk: true },
          { name: "FoodId", type: "int", fk: true },
          { name: "Grams", type: "decimal" },
          { name: "Calories", type: "decimal" },
          { name: "Protein", type: "decimal" },
          { name: "Carbs", type: "decimal" },
          { name: "Fat", type: "decimal" },
          { name: "CreatedAt", type: "datetime" },
        ],
      },
    ],
    codeExample: `public class EntryItem
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int FoodId { get; set; }
    public decimal Grams { get; set; }
    public decimal Calories { get; set; }
    public decimal Protein { get; set; }
    public decimal Carbs { get; set; }
    public decimal Fat { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public User User { get; set; }
    public Food Food { get; set; }
}`,
  },

  apiEndpoints: {
    title: "API Endpoints",
    subtitle: "RESTful API Structure",
    groups: [
      {
        name: "Authentication",
        endpoints: [
          { method: "POST", path: "/auth/register", description: "Register a new user account" },
          { method: "POST", path: "/auth/login", description: "Authenticate and receive JWT token" },
        ],
      },
      {
        name: "Food Entries",
        endpoints: [
          { method: "GET", path: "/food-entries", description: "Retrieve all food entries for user" },
          { method: "POST", path: "/food-entries", description: "Create a new food entry" },
          { method: "PUT", path: "/food-entries/:id", description: "Update an existing entry" },
          { method: "DELETE", path: "/food-entries/:id", description: "Delete a food entry" },
        ],
      },
      {
        name: "Metrics",
        endpoints: [
          { method: "GET", path: "/metrics/daily", description: "Get daily calorie summary" },
          { method: "GET", path: "/metrics/range", description: "Get metrics for date range" },
        ],
      },
    ],
  },

  dashboardMetrics: {
    title: "Dashboard Metrics",
    subtitle: "Visual Components for User Insights",
    metrics: [
      {
        icon: "daily",
        title: "Daily Totals",
        description: "Track calories, protein, carbs, and fats consumed each day.",
        value: "2,150",
        unit: "kcal",
      },
      {
        icon: "weekly",
        title: "Weekly Progress",
        description: "Line and bar charts showing calorie trends over the week.",
        value: "15,050",
        unit: "kcal",
      },
      {
        icon: "macro",
        title: "Macro Distribution",
        description: "Pie chart breaking down protein, carbs, and fat percentages.",
        value: "40/35/25",
        unit: "%",
      },
      {
        icon: "top",
        title: "Top Foods",
        description: "List of most consumed foods ranked by calorie contribution.",
        value: "Top 10",
        unit: "foods",
      },
    ],
  },

  summary: {
    title: "Summary",
    subtitle: "Key Takeaways",
    points: [
      {
        icon: "modern",
        title: "Modern & Scalable",
        description: "Built with cutting-edge technologies for performance and growth.",
      },
      {
        icon: "secure",
        title: "Secure Authentication",
        description: "JWT-based auth ensures user data protection and secure API access.",
      },
      {
        icon: "data",
        title: "Robust Data Layer",
        description: "Entity Framework Core with SQL Server for reliable data management.",
      },
      {
        icon: "interactive",
        title: "Interactive Dashboard",
        description: "Next.js-powered frontend with dynamic visualizations and smooth UX.",
      },
      {
        icon: "simple",
        title: "Simplified Tracking",
        description: "Makes calorie tracking simpler, more visual, and more engaging.",
      },
    ],
  },

  futurePlans: {
    title: "Future Plans",
    subtitle: "Roadmap for Upcoming Features",
    plans: [
      {
        icon: "ai",
        title: "AI Recommendations",
        description: "Introduce AI-based food recommendations tailored to user preferences and goals.",
        status: "Planned",
      },
      {
        icon: "barcode",
        title: "Barcode Scanner",
        description: "Add barcode scanning for quick and easy food logging from packages.",
        status: "Planned",
      },
      {
        icon: "mobile",
        title: "Mobile App",
        description: "Develop a native mobile version using React Native for iOS and Android.",
        status: "Planned",
      },
      {
        icon: "wearable",
        title: "Wearable Integration",
        description: "Connect with Fitbit, Apple Watch, and other health devices for comprehensive tracking.",
        status: "Future",
      },
    ],
  },

  navigation: {
    links: [
      { id: "hero", label: "Home" },
      { id: "about", label: "About" },
      { id: "why", label: "Why" },
      { id: "objectives", label: "Objectives" },
      { id: "how", label: "How It Works" },
      { id: "tech", label: "Tech Stack" },
      { id: "overview", label: "Overview" },
      { id: "dataflow", label: "Data Flow" },
      { id: "schema", label: "Schema" },
      { id: "api", label: "API" },
      { id: "metrics", label: "Metrics" },
      { id: "summary", label: "Summary" },
      { id: "future", label: "Future" },
    ],
  },
};

