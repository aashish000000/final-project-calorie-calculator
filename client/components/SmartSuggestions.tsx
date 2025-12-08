"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FiZap, FiRefreshCw } from "react-icons/fi";

export default function SmartSuggestions() {
  const { data: suggestions, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["suggestions"],
    queryFn: () => api.getFoodSuggestions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    );
  }

  if (!suggestions) {
    return null;
  }

  const hasRemaining = suggestions.remaining.calories > 50;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiZap className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Smart Suggestions</h3>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition disabled:opacity-50"
          title="Refresh suggestions"
        >
          <FiRefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Message */}
      <p className="text-sm text-gray-700 mb-4">{suggestions.message}</p>

      {hasRemaining && suggestions.suggestions.length > 0 ? (
        <div className="space-y-3">
          {suggestions.suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 border border-purple-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {suggestion.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">{suggestion.reason}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {suggestion.estimatedGrams}g
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {Math.round(suggestion.calories)} cal
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                      {suggestion.protein.toFixed(0)}g protein
                    </span>
                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded">
                      {suggestion.carbs.toFixed(0)}g carbs
                    </span>
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                      {suggestion.fat.toFixed(0)}g fat
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : hasRemaining ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-600">
            Log some meals to get personalized suggestions!
          </p>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-lg">🎉</p>
          <p className="text-sm text-gray-600 mt-2">
            You've met your daily goals!
          </p>
        </div>
      )}

      {/* Remaining Nutrients Summary */}
      {hasRemaining && (
        <div className="mt-4 pt-4 border-t border-purple-100">
          <p className="text-xs font-medium text-gray-600 mb-2">Remaining Today:</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-500">Calories</p>
              <p className="text-sm font-semibold text-gray-900">
                {suggestions.remaining.calories}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Protein</p>
              <p className="text-sm font-semibold text-green-600">
                {suggestions.remaining.protein.toFixed(0)}g
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Carbs</p>
              <p className="text-sm font-semibold text-amber-600">
                {suggestions.remaining.carbs.toFixed(0)}g
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Fat</p>
              <p className="text-sm font-semibold text-red-600">
                {suggestions.remaining.fat.toFixed(0)}g
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
