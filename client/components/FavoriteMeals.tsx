"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FiStar, FiPlus, FiTrash2, FiCheck } from "react-icons/fi";
import type { FavoriteMeal } from "@/lib/types";

export default function FavoriteMeals() {
  const [expandedMealId, setExpandedMealId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: favoriteMeals, isLoading } = useQuery({
    queryKey: ["favorite-meals"],
    queryFn: () => api.getFavoriteMeals(),
  });

  const deleteMutation = useMutation({
    mutationFn: (mealId: number) => api.deleteFavoriteMeal(mealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-meals"] });
    },
  });

  const addMealMutation = useMutation({
    mutationFn: async (mealId: number) => {
      const items = await api.getFavoriteMealItems(mealId);
      // Add all items from the favorite meal
      await Promise.all(items.map((item) => api.createEntry(item)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });

  const handleDelete = (mealId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this favorite meal?")) {
      deleteMutation.mutate(mealId);
    }
  };

  const handleAddMeal = (mealId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    addMealMutation.mutate(mealId);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    );
  }

  if (!favoriteMeals || favoriteMeals.length === 0) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <FiStar className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-semibold text-gray-900">Favorite Meals</h3>
        </div>
        <p className="text-sm text-gray-600">
          Save your frequent meals for quick logging!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiStar className="w-5 h-5 text-amber-600" />
        <h3 className="text-lg font-semibold text-gray-900">Favorite Meals</h3>
      </div>

      <div className="space-y-2">
        {favoriteMeals.map((meal) => (
          <div
            key={meal.id}
            className="bg-white rounded-lg border border-amber-100 overflow-hidden"
          >
            <div
              className="p-3 cursor-pointer hover:bg-amber-50 transition"
              onClick={() =>
                setExpandedMealId(expandedMealId === meal.id ? null : meal.id)
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{meal.name}</h4>
                  <div className="flex gap-3 text-xs text-gray-600 mt-1">
                    <span>{Math.round(meal.totalCalories)} cal</span>
                    <span>{meal.totalProtein.toFixed(0)}g protein</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleAddMeal(meal.id, e)}
                    disabled={addMealMutation.isPending}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                    title="Add to today"
                  >
                    {addMealMutation.isPending ? (
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiPlus className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={(e) => handleDelete(meal.id, e)}
                    disabled={deleteMutation.isPending}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {expandedMealId === meal.id && (
              <div className="px-3 pb-3 pt-0 border-t border-amber-100 bg-amber-25">
                <div className="space-y-1 mt-2">
                  {meal.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span>
                        {item.foodName} ({item.grams}g)
                      </span>
                      <span className="text-gray-500">
                        {Math.round(item.calories)} cal
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
