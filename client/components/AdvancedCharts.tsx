"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { format, subDays } from "date-fns";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

interface ChartDataPoint {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  calorieGoal: number;
}

export default function AdvancedCharts() {
  const endDate = format(new Date(), "yyyy-MM-dd");
  const startDate = format(subDays(new Date(), 6), "yyyy-MM-dd");

  const { data: rangeMetrics, isLoading } = useQuery({
    queryKey: ["metrics-range", startDate, endDate],
    queryFn: () => api.getMetricsRange(startDate, endDate),
  });

  const { data: userGoals } = useQuery({
    queryKey: ["goals"],
    queryFn: () => api.getGoals(),
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    );
  }

  if (!rangeMetrics || !userGoals) {
    return null;
  }

  // Prepare chart data
  const chartData: ChartDataPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd");
    const dayData = rangeMetrics.dailyData?.find((d) => d.date === date);
    chartData.push({
      date,
      calories: dayData?.calories || 0,
      protein: dayData?.protein || 0,
      carbs: dayData?.carbs || 0,
      fat: dayData?.fat || 0,
      calorieGoal: userGoals.calorieGoal,
    });
  }

  // Calculate stats
  const avgCalories = chartData.reduce((sum, d) => sum + d.calories, 0) / 7;
  const trend = chartData[6].calories - chartData[0].calories;
  const daysOnTrack = chartData.filter(
    (d) => d.calories >= userGoals.calorieGoal * 0.9 && d.calories <= userGoals.calorieGoal * 1.1
  ).length;

  // Chart dimensions
  const chartWidth = 100;
  const chartHeight = 60;
  const maxCalories = Math.max(...chartData.map((d) => Math.max(d.calories, d.calorieGoal)), 1);
  const scaleY = chartHeight / maxCalories;

  // Generate SVG path for calorie line
  const caloriePath = chartData
    .map((d, i) => {
      const x = (i / 6) * chartWidth;
      const y = chartHeight - d.calories * scaleY;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  // Generate SVG path for goal line
  const goalPath = `M 0 ${chartHeight - userGoals.calorieGoal * scaleY} L ${chartWidth} ${chartHeight - userGoals.calorieGoal * scaleY}`;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">7-Day Progress</h3>
        <p className="text-sm text-gray-600">Track your nutrition trends</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Avg Daily</p>
          <p className="text-lg font-bold text-gray-900">
            {Math.round(avgCalories)}
          </p>
          <p className="text-xs text-gray-500">calories</p>
        </div>
        <div className="bg-white rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Trend</p>
          <div className="flex items-center gap-1">
            {trend >= 0 ? (
              <FiTrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <FiTrendingDown className="w-4 h-4 text-red-600" />
            )}
            <p className={`text-lg font-bold ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
              {trend > 0 ? "+" : ""}
              {Math.round(trend)}
            </p>
          </div>
          <p className="text-xs text-gray-500">cal/day</p>
        </div>
        <div className="bg-white rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">On Track</p>
          <p className="text-lg font-bold text-indigo-600">{daysOnTrack}/7</p>
          <p className="text-xs text-gray-500">days</p>
        </div>
      </div>

      {/* Calorie Trend Chart */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Calorie Intake</h4>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-32"
          preserveAspectRatio="none"
        >
          {/* Goal line */}
          <path
            d={goalPath}
            stroke="#9CA3AF"
            strokeWidth="0.5"
            strokeDasharray="2,2"
            fill="none"
          />
          {/* Calorie line */}
          <path
            d={caloriePath}
            stroke="#6366F1"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Data points */}
          {chartData.map((d, i) => {
            const x = (i / 6) * chartWidth;
            const y = chartHeight - d.calories * scaleY;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="1.5"
                fill="#6366F1"
              />
            );
          })}
        </svg>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {chartData.map((d, i) => (
            <span key={i}>{format(new Date(d.date), "EEE")[0]}</span>
          ))}
        </div>
      </div>

      {/* Macro Distribution */}
      <div className="bg-white rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">This Week's Macros</h4>
        <div className="space-y-3">
          {/* Protein */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Protein</span>
              <span className="font-medium text-green-600">
                {Math.round(rangeMetrics.protein || 0)}g
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{
                  width: `${Math.min(
                    ((rangeMetrics.protein || 0) / (userGoals.proteinGoal * 7)) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
          {/* Carbs */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Carbs</span>
              <span className="font-medium text-amber-600">
                {Math.round(rangeMetrics.carbs || 0)}g
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{
                  width: `${Math.min(
                    ((rangeMetrics.carbs || 0) / (userGoals.carbsGoal * 7)) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
          {/* Fat */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Fat</span>
              <span className="font-medium text-red-600">
                {Math.round(rangeMetrics.fat || 0)}g
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full"
                style={{
                  width: `${Math.min(
                    ((rangeMetrics.fat || 0) / (userGoals.fatGoal * 7)) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
