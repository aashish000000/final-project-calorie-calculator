export interface User {
  id: number;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Food {
  id: number;
  userId: number | null;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  createdAt: string;
}

export interface EntryItem {
  id: number;
  userId: number;
  foodId: number;
  foodName: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
}

export interface DailyMetrics {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  entries: EntryItem[];
}

export interface DailySummary {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface TopFood {
  foodId: number;
  foodName: string;
  totalCalories: number;
  entryCount: number;
}

export interface RangeMetrics {
  fromDate: string;
  toDate: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  dailyData: DailySummary[];
  topFoods: TopFood[];
}

export interface CreateFoodRequest {
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}

export interface CreateEntryRequest {
  foodId: number;
  grams: number;
  date?: string;
}

export interface UpdateEntryRequest {
  foodId: number;
  grams: number;
}

// Goals types
export interface UserGoals {
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
}

export interface UpdateGoalsRequest {
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
}

// Chat types
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  message: string;
  suggestedAction?: string;
  actionData?: unknown;
}
