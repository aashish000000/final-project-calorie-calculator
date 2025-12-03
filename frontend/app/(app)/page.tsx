"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, subDays, addDays, startOfWeek, isSameDay } from "date-fns";
import { api } from "@/lib/api";
import { FiPlus, FiTrash2, FiChevronLeft, FiChevronRight, FiSettings } from "react-icons/fi";
import Link from "next/link";
import { GoalsModal } from "@/components/GoalsModal";

// Circular Progress Component
function CircularProgress({ 
  value, 
  max, 
  size = 160, 
  strokeWidth = 12,
  color = "#6366f1"
}: { 
  value: number; 
  max: number; 
  size?: number; 
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / max, 1);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">{Math.round(value)}</span>
        <span className="text-sm text-gray-500">/ {max} kcal</span>
      </div>
    </div>
  );
}

// Macro Progress Circle
function MacroCircle({ 
  label, 
  value, 
  max, 
  color,
  unit = "g"
}: { 
  label: string; 
  value: number; 
  max: number; 
  color: string;
  unit?: string;
}) {
  const progress = Math.min(value / max, 1) * 100;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16 mb-2">
        <svg className="transform -rotate-90 w-16 h-16">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="#e5e7eb"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${progress * 1.76} 176`}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-700">{Math.round(value)}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <span className="text-xs text-gray-400">{Math.round(max - value)}{unit} left</span>
    </div>
  );
}

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Fetch user goals
  const { data: userGoals } = useQuery({
    queryKey: ["goals"],
    queryFn: () => api.getGoals(),
  });

  const { data: dailyMetrics, isLoading: isLoadingDaily } = useQuery({
    queryKey: ["metrics", "daily", format(selectedDate, "yyyy-MM-dd")],
    queryFn: () => api.getDailyMetrics(format(selectedDate, "yyyy-MM-dd")),
  });

  const { data: rangeMetrics, isLoading: isLoadingRange } = useQuery({
    queryKey: ["metrics", "range", format(weekStart, "yyyy-MM-dd")],
    queryFn: () =>
      api.getRangeMetrics(
        format(weekStart, "yyyy-MM-dd"),
        format(addDays(weekStart, 6), "yyyy-MM-dd")
      ),
  });

  const handleDeleteEntry = async (id: number) => {
    try {
      await api.deleteEntry(id);
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setWeekStart(prev => direction === "prev" ? subDays(prev, 7) : addDays(prev, 7));
  };

  // Use user goals or defaults
  const calorieGoal = userGoals?.calorieGoal ?? 2000;
  const proteinGoal = userGoals?.proteinGoal ?? 150;
  const carbsGoal = userGoals?.carbsGoal ?? 250;
  const fatGoal = userGoals?.fatGoal ?? 65;

  const calories = dailyMetrics?.totalCalories || 0;
  const protein = dailyMetrics?.totalProtein || 0;
  const carbs = dailyMetrics?.totalCarbs || 0;
  const fat = dailyMetrics?.totalFat || 0;

  return (
    <div className="min-h-screen bg-gray-50 -m-8 -mt-8">
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white px-4 pt-6 pb-32 rounded-b-3xl shadow-lg">
        <div className="max-w-lg mx-auto">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold">Calorie Counter</h1>
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigateWeek("prev")}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
              {format(weekStart, "d MMM")} - {format(addDays(weekStart, 6), "d MMM, yyyy")}
            </div>
            <button 
              onClick={() => navigateWeek("next")}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => {
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              const dayData = rangeMetrics?.dailyData?.find(
                (d) => format(new Date(d.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
              );
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`flex flex-col items-center py-2 rounded-xl transition-all ${
                    isSelected 
                      ? "bg-white text-indigo-600" 
                      : "hover:bg-white/10"
                  }`}
                >
                  <span className={`text-xs ${isSelected ? "text-indigo-600" : "text-white/70"}`}>
                    {format(day, "EEE")}
                  </span>
                  <span className={`text-lg font-semibold mt-1 ${
                    isSelected ? "text-indigo-600" : isToday ? "text-white" : "text-white"
                  }`}>
                    {format(day, "d")}
                  </span>
                  {/* Mini calorie indicator */}
                  {dayData && dayData.calories > 0 && (
                    <div className="flex gap-0.5 mt-1">
                      <div className="w-1 h-1 rounded-full bg-cyan-400" />
                      <div className="w-1 h-1 rounded-full bg-green-400" />
                      <div className="w-1 h-1 rounded-full bg-yellow-400" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Stacked Bar Chart - Simplified */}
          <div className="mt-4 grid grid-cols-7 gap-1 h-24">
            {weekDays.map((day) => {
              const dayData = rangeMetrics?.dailyData?.find(
                (d) => format(new Date(d.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
              );
              const dayCalories = dayData?.calories || 0;
              const dayProtein = dayData?.protein || 0;
              const dayCarbs = dayData?.carbs || 0;
              const dayFat = dayData?.fat || 0;
              const maxHeight = 80;
              const scale = dayCalories > 0 ? maxHeight / (dayCalories) : 0;
              const isSelected = isSameDay(day, selectedDate);

              return (
                <div 
                  key={day.toISOString()} 
                  className={`flex flex-col justify-end items-center ${isSelected ? "opacity-100" : "opacity-60"}`}
                >
                  {dayCalories > 0 ? (
                    <div className="w-6 flex flex-col rounded-t-sm overflow-hidden">
                      <div 
                        className="bg-red-400" 
                        style={{ height: `${dayFat * 4 * scale}px` }} 
                      />
                      <div 
                        className="bg-yellow-400" 
                        style={{ height: `${dayCarbs * 4 * scale}px` }} 
                      />
                      <div 
                        className="bg-green-400" 
                        style={{ height: `${dayProtein * 4 * scale}px` }} 
                      />
                    </div>
                  ) : (
                    <div className="w-6 h-2 bg-white/20 rounded-t-sm" />
                  )}
                  <span className="text-xs text-white/60 mt-1">{dayCalories > 0 ? Math.round(dayCalories) : "-"}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content - Overlapping cards */}
      <div className="px-4 -mt-20 pb-24 max-w-lg mx-auto">
        {/* Calorie Goal Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <div className="flex items-center justify-between">
            {/* Left side - Circular Progress */}
            <div className="flex-shrink-0">
              {isLoadingDaily ? (
                <div className="w-40 h-40 bg-gray-100 rounded-full animate-pulse" />
              ) : (
                <CircularProgress 
                  value={calories} 
                  max={calorieGoal}
                  color="#6366f1"
                />
              )}
            </div>

            {/* Right side - Macros */}
            <div className="flex-1 ml-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                {((calories / calorieGoal) * 100).toFixed(0)}% of daily goal
              </h3>
              <div className="flex justify-between mt-4">
                <MacroCircle 
                  label="Carbs" 
                  value={carbs} 
                  max={carbsGoal} 
                  color="#facc15"
                />
                <MacroCircle 
                  label="Protein" 
                  value={protein} 
                  max={proteinGoal} 
                  color="#22c55e"
                />
                <MacroCircle 
                  label="Fat" 
                  value={fat} 
                  max={fatGoal} 
                  color="#ef4444"
                />
              </div>
            </div>
          </div>

          {/* Calorie Goal Text */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Daily calorie goal</span>
              <button
                onClick={() => setIsGoalsModalOpen(true)}
                className="flex items-center gap-2 text-lg font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                {calorieGoal} kcal
                <FiSettings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Nutrients Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Nutrients Facts</h2>
          <div className="space-y-4">
            {/* Calories */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Calories</span>
                <span className="font-medium">{Math.round(calories)} / {calorieGoal}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((calories / calorieGoal) * 100, 100)}%` }}
                />
              </div>
            </div>
            {/* Protein */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Protein</span>
                <span className="font-medium">{Math.round(protein)}g / {proteinGoal}g</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((protein / proteinGoal) * 100, 100)}%` }}
                />
              </div>
            </div>
            {/* Carbs */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Carbs</span>
                <span className="font-medium">{Math.round(carbs)}g / {carbsGoal}g</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((carbs / carbsGoal) * 100, 100)}%` }}
                />
              </div>
            </div>
            {/* Fat */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Fat</span>
                <span className="font-medium">{Math.round(fat)}g / {fatGoal}g</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((fat / fatGoal) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Meals Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Today&apos;s Meals
            </h2>
            <Link 
              href="/log"
              className="flex items-center gap-1 text-sm text-indigo-600 font-medium hover:text-indigo-700"
            >
              <FiPlus className="w-4 h-4" />
              Add
            </Link>
          </div>
          
          {isLoadingDaily ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : dailyMetrics?.entries?.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <FiPlus className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="text-gray-500 mb-4">No meals logged yet</p>
              <Link 
                href="/log" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Log your first meal
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {dailyMetrics?.entries?.map((entry) => (
                <div 
                  key={entry.id} 
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  {/* Food Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-lg">
                    🍽️
                  </div>
                  
                  {/* Food Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{entry.foodName}</p>
                    <p className="text-sm text-gray-500">{entry.grams}g</p>
                  </div>
                  
                  {/* Calories & Actions */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{Math.round(entry.calories)}</p>
                      <p className="text-xs text-gray-500">kcal</p>
                    </div>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <Link
        href="/log"
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:from-indigo-500 hover:to-purple-500 transition-all hover:scale-105 z-40"
      >
        <FiPlus className="w-6 h-6" />
      </Link>

      {/* Goals Modal */}
      <GoalsModal
        isOpen={isGoalsModalOpen}
        onClose={() => setIsGoalsModalOpen(false)}
        currentGoals={{
          calorieGoal,
          proteinGoal,
          carbsGoal,
          fatGoal,
        }}
      />
    </div>
  );
}
