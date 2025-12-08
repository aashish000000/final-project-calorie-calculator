"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiArrowLeft, FiTarget, FiCheck, FiZap, FiDroplet } from "react-icons/fi";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

const goalsSchema = z.object({
  calorieGoal: z.coerce.number().min(500, "Min 500 kcal").max(10000, "Max 10000 kcal"),
  proteinGoal: z.coerce.number().min(10, "Min 10g").max(500, "Max 500g"),
  carbsGoal: z.coerce.number().min(20, "Min 20g").max(800, "Max 800g"),
  fatGoal: z.coerce.number().min(10, "Min 10g").max(300, "Max 300g"),
});

type GoalsFormData = z.infer<typeof goalsSchema>;

export default function GoalsSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<GoalsFormData>({
    resolver: zodResolver(goalsSchema),
    defaultValues: {
      calorieGoal: user?.calorieGoal || 2000,
      proteinGoal: user?.proteinGoal || 150,
      carbsGoal: user?.carbsGoal || 250,
      fatGoal: user?.fatGoal || 65,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        calorieGoal: user.calorieGoal || 2000,
        proteinGoal: user.proteinGoal || 150,
        carbsGoal: user.carbsGoal || 250,
        fatGoal: user.fatGoal || 65,
      });
    }
  }, [user, reset]);

  const watchedValues = watch();

  // Calculate macro percentages
  const calculateMacroPercentages = () => {
    const totalCaloriesFromMacros =
      (watchedValues.proteinGoal || 0) * 4 +
      (watchedValues.carbsGoal || 0) * 4 +
      (watchedValues.fatGoal || 0) * 9;
    
    if (totalCaloriesFromMacros === 0) return { protein: 0, carbs: 0, fat: 0 };

    return {
      protein: Math.round(((watchedValues.proteinGoal || 0) * 4 / totalCaloriesFromMacros) * 100),
      carbs: Math.round(((watchedValues.carbsGoal || 0) * 4 / totalCaloriesFromMacros) * 100),
      fat: Math.round(((watchedValues.fatGoal || 0) * 9 / totalCaloriesFromMacros) * 100),
    };
  };

  const macroPercentages = calculateMacroPercentages();

  const onSubmit = async (data: GoalsFormData) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await api.updateGoals(data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      setSuccessMessage("Goals updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update goals");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Nutrition Goals</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3">
            <FiCheck className="w-5 h-5" />
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {errorMessage}
          </div>
        )}

        {/* Macro Distribution Preview */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
          <h2 className="font-semibold text-lg mb-4">Macro Distribution</h2>
          <div className="flex gap-2 mb-3">
            <div 
              className="h-3 bg-green-400 rounded-full transition-all"
              style={{ width: `${macroPercentages.protein}%` }}
            />
            <div 
              className="h-3 bg-yellow-400 rounded-full transition-all"
              style={{ width: `${macroPercentages.carbs}%` }}
            />
            <div 
              className="h-3 bg-red-400 rounded-full transition-all"
              style={{ width: `${macroPercentages.fat}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Protein {macroPercentages.protein}%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              Carbs {macroPercentages.carbs}%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              Fat {macroPercentages.fat}%
            </span>
          </div>
        </div>

        {/* Goals Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Daily Goals</h2>
            <p className="text-sm text-gray-500">Set your daily nutrition targets</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Calorie Goal */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiTarget className="w-4 h-4 text-indigo-600" />
                Daily Calorie Goal
              </label>
              <div className="flex items-center gap-3">
                <input
                  {...register("calorieGoal")}
                  type="number"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <span className="text-gray-500 font-medium">kcal</span>
              </div>
              {errors.calorieGoal && (
                <p className="mt-1 text-sm text-red-600">{errors.calorieGoal.message}</p>
              )}
            </div>

            {/* Protein Goal */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <span className="w-4 h-4 rounded-full bg-green-500"></span>
                Protein Goal
              </label>
              <div className="flex items-center gap-3">
                <input
                  {...register("proteinGoal")}
                  type="number"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <span className="text-gray-500 font-medium">g</span>
              </div>
              {errors.proteinGoal && (
                <p className="mt-1 text-sm text-red-600">{errors.proteinGoal.message}</p>
              )}
            </div>

            {/* Carbs Goal */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiZap className="w-4 h-4 text-yellow-500" />
                Carbs Goal
              </label>
              <div className="flex items-center gap-3">
                <input
                  {...register("carbsGoal")}
                  type="number"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                />
                <span className="text-gray-500 font-medium">g</span>
              </div>
              {errors.carbsGoal && (
                <p className="mt-1 text-sm text-red-600">{errors.carbsGoal.message}</p>
              )}
            </div>

            {/* Fat Goal */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiDroplet className="w-4 h-4 text-red-500" />
                Fat Goal
              </label>
              <div className="flex items-center gap-3">
                <input
                  {...register("fatGoal")}
                  type="number"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <span className="text-gray-500 font-medium">g</span>
              </div>
              {errors.fatGoal && (
                <p className="mt-1 text-sm text-red-600">{errors.fatGoal.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? "Saving..." : "Save Goals"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

