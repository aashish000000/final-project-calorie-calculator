import Cookies from "js-cookie";
import type {
  AuthResponse,
  Food,
  EntryItem,
  DailyMetrics,
  RangeMetrics,
  CreateFoodRequest,
  CreateEntryRequest,
  UpdateEntryRequest,
  User,
  ChatMessage,
  ChatResponse,
  UserGoals,
  UpdateGoalsRequest,
  WaterSummary,
  WaterEntry,
  FavoriteMeal,
  CreateFavoriteMealRequest,
  FoodSuggestions,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiClient {
  private getToken(): string | undefined {
    return Cookies.get("token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Auth
  async register(data: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/auth/me");
  }

  // Foods
  async getFoods(): Promise<Food[]> {
    return this.request<Food[]>("/foods");
  }

  async getFood(id: number): Promise<Food> {
    return this.request<Food>(`/foods/${id}`);
  }

  async createFood(data: CreateFoodRequest): Promise<Food> {
    return this.request<Food>("/foods", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateFood(id: number, data: CreateFoodRequest): Promise<Food> {
    return this.request<Food>(`/foods/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteFood(id: number): Promise<void> {
    return this.request<void>(`/foods/${id}`, {
      method: "DELETE",
    });
  }

  // Entries
  async getEntries(date?: string): Promise<EntryItem[]> {
    const params = date ? `?date=${date}` : "";
    return this.request<EntryItem[]>(`/food-entries${params}`);
  }

  async createEntry(data: CreateEntryRequest): Promise<EntryItem> {
    return this.request<EntryItem>("/food-entries", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateEntry(id: number, data: UpdateEntryRequest): Promise<EntryItem> {
    return this.request<EntryItem>(`/food-entries/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteEntry(id: number): Promise<void> {
    return this.request<void>(`/food-entries/${id}`, {
      method: "DELETE",
    });
  }

  // Metrics
  async getDailyMetrics(date?: string): Promise<DailyMetrics> {
    const params = date ? `?date=${date}` : "";
    return this.request<DailyMetrics>(`/metrics/daily${params}`);
  }

  async getRangeMetrics(from: string, to: string): Promise<RangeMetrics> {
    return this.request<RangeMetrics>(`/metrics/range?from=${from}&to=${to}`);
  }

  // Chat
  async sendChatMessage(message: string, history?: ChatMessage[]): Promise<ChatResponse> {
    // Convert frontend ChatMessage format to backend DTO format
    const historyDto = history?.map(msg => ({
      sender: msg.role,
      text: msg.content
    }));

    return this.request<ChatResponse>("/chat", {
      method: "POST",
      body: JSON.stringify({ 
        message, 
        history: historyDto 
      }),
    });
  }

  // Goals
  async getGoals(): Promise<UserGoals> {
    return this.request<UserGoals>("/auth/goals");
  }

  async updateGoals(goals: UpdateGoalsRequest): Promise<UserGoals> {
    return this.request<UserGoals>("/auth/goals", {
      method: "PUT",
      body: JSON.stringify(goals),
    });
  }

  // Profile
  async updateProfile(data: {
    firstName: string;
    middleName?: string;
    lastName: string;
  }): Promise<User> {
    return this.request<User>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return this.request<void>("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async deleteAccount(): Promise<void> {
    return this.request<void>("/auth/account", {
      method: "DELETE",
    });
  }

  // Profile Picture
  async uploadProfilePicture(imageData: string): Promise<User> {
    return this.request<User>("/auth/profile-picture", {
      method: "POST",
      body: JSON.stringify({ imageData }),
    });
  }

  async removeProfilePicture(): Promise<void> {
    return this.request<void>("/auth/profile-picture", {
      method: "DELETE",
    });
  }

  // Image Recognition
  async analyzeFood(imageFile: File): Promise<{
    foods: {
      name: string;
      estimatedGrams: number;
      estimatedCalories: number;
      estimatedProtein: number;
      estimatedCarbs: number;
      estimatedFat: number;
      notes?: string;
    }[];
    rawAnalysis?: string;
  }> {
    const formData = new FormData();
    formData.append("image", imageFile);

    const token = this.getToken();
    const response = await fetch(`${API_URL}/image-recognition/analyze`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Recipe Analyzer
  async analyzeRecipe(recipeText: string, servings?: number): Promise<{
    recipeName: string;
    ingredients: {
      name: string;
      quantity: string;
      unit: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }[];
    totalNutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    perServingNutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    servings: number;
    instructions?: string;
    prepTimeMinutes: number;
    cookTimeMinutes: number;
  }> {
    return this.request("/recipe/analyze", {
      method: "POST",
      body: JSON.stringify({ recipeText, servings }),
    });
  }

  // Water Tracking
  async getWaterSummary(date?: string): Promise<WaterSummary> {
    const params = date ? `?date=${date}` : "";
    return this.request(`/water/summary${params}`);
  }

  async logWater(milliliters: number, date?: string): Promise<WaterEntry> {
    return this.request("/water/log", {
      method: "POST",
      body: JSON.stringify({ milliliters, date }),
    });
  }

  async deleteWaterEntry(entryId: number): Promise<void> {
    return this.request(`/water/${entryId}`, {
      method: "DELETE",
    });
  }

  // Favorite Meals
  async getFavoriteMeals(): Promise<FavoriteMeal[]> {
    return this.request("/favorite-meals");
  }

  async createFavoriteMeal(request: CreateFavoriteMealRequest): Promise<FavoriteMeal> {
    return this.request("/favorite-meals", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async deleteFavoriteMeal(mealId: number): Promise<void> {
    return this.request(`/favorite-meals/${mealId}`, {
      method: "DELETE",
    });
  }

  async getFavoriteMealItems(mealId: number): Promise<CreateEntryRequest[]> {
    return this.request(`/favorite-meals/${mealId}/items`);
  }

  // Smart Suggestions
  async getFoodSuggestions(date?: string): Promise<FoodSuggestions> {
    const params = date ? `?date=${date}` : "";
    return this.request(`/suggestions${params}`);
  }
}

export const api = new ApiClient();

