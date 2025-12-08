"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FiX, FiLoader, FiClock, FiUsers } from "react-icons/fi";

interface RecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface RecipeNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface RecipeAnalysis {
  recipeName: string;
  ingredients: RecipeIngredient[];
  totalNutrition: RecipeNutrition;
  perServingNutrition: RecipeNutrition;
  servings: number;
  instructions?: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
}

interface RecipeAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecipeAnalyzerModal({ isOpen, onClose }: RecipeAnalyzerModalProps) {
  const [recipeText, setRecipeText] = useState("");
  const [servings, setServings] = useState<string>("");
  const [analysis, setAnalysis] = useState<RecipeAnalysis | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const servingsNum = servings ? parseInt(servings) : undefined;
      return api.analyzeRecipe(recipeText, servingsNum);
    },
    onSuccess: (data) => {
      setAnalysis(data);
    },
  });

  const handleAnalyze = () => {
    if (recipeText.trim()) {
      analyzeMutation.mutate();
    }
  };

  const handleClose = () => {
    setRecipeText("");
    setServings("");
    setAnalysis(null);
    analyzeMutation.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">📝 Recipe Analyzer</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!analysis ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste Recipe
                </label>
                <textarea
                  value={recipeText}
                  onChange={(e) => setRecipeText(e.target.value)}
                  placeholder="Paste your recipe here... Include ingredients, quantities, and instructions."
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  disabled={analyzeMutation.isPending}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servings (Optional)
                </label>
                <input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  placeholder="e.g., 4"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={analyzeMutation.isPending}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Leave blank to auto-detect from recipe
                </p>
              </div>

              {analyzeMutation.isError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">
                    {analyzeMutation.error instanceof Error
                      ? analyzeMutation.error.message
                      : "Failed to analyze recipe"}
                  </p>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={!recipeText.trim() || analyzeMutation.isPending}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <FiLoader className="w-5 h-5 animate-spin" />
                    Analyzing Recipe...
                  </>
                ) : (
                  "Analyze Recipe"
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Recipe Name */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {analysis.recipeName}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FiUsers className="w-4 h-4" />
                    <span>{analysis.servings} servings</span>
                  </div>
                  {analysis.prepTimeMinutes > 0 && (
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4" />
                      <span>Prep: {analysis.prepTimeMinutes} min</span>
                    </div>
                  )}
                  {analysis.cookTimeMinutes > 0 && (
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4" />
                      <span>Cook: {analysis.cookTimeMinutes} min</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Nutrition Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-600 mb-3">
                    Per Serving
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Calories:</span>
                      <span className="font-semibold">
                        {Math.round(analysis.perServingNutrition.calories)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Protein:</span>
                      <span className="font-semibold">
                        {analysis.perServingNutrition.protein.toFixed(1)}g
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Carbs:</span>
                      <span className="font-semibold">
                        {analysis.perServingNutrition.carbs.toFixed(1)}g
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Fat:</span>
                      <span className="font-semibold">
                        {analysis.perServingNutrition.fat.toFixed(1)}g
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-600 mb-3">
                    Total Recipe
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Calories:</span>
                      <span className="font-semibold">
                        {Math.round(analysis.totalNutrition.calories)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Protein:</span>
                      <span className="font-semibold">
                        {analysis.totalNutrition.protein.toFixed(1)}g
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Carbs:</span>
                      <span className="font-semibold">
                        {analysis.totalNutrition.carbs.toFixed(1)}g
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Fat:</span>
                      <span className="font-semibold">
                        {analysis.totalNutrition.fat.toFixed(1)}g
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Ingredients
                </h4>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">
                          Ingredient
                        </th>
                        <th className="px-4 py-2 text-right font-medium text-gray-700">
                          Cal
                        </th>
                        <th className="px-4 py-2 text-right font-medium text-gray-700">
                          Protein
                        </th>
                        <th className="px-4 py-2 text-right font-medium text-gray-700">
                          Carbs
                        </th>
                        <th className="px-4 py-2 text-right font-medium text-gray-700">
                          Fat
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.ingredients.map((ingredient, index) => (
                        <tr
                          key={index}
                          className="border-t border-gray-200 hover:bg-gray-100"
                        >
                          <td className="px-4 py-2">
                            {ingredient.quantity} {ingredient.unit} {ingredient.name}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {Math.round(ingredient.calories)}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {ingredient.protein.toFixed(1)}g
                          </td>
                          <td className="px-4 py-2 text-right">
                            {ingredient.carbs.toFixed(1)}g
                          </td>
                          <td className="px-4 py-2 text-right">
                            {ingredient.fat.toFixed(1)}g
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Instructions */}
              {analysis.instructions && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Instructions
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {analysis.instructions}
                    </p>
                  </div>
                </div>
              )}

              {/* Try Another Button */}
              <button
                onClick={() => setAnalysis(null)}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Analyze Another Recipe
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
