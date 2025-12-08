"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { api } from "@/lib/api";
import { entrySchema, type EntryFormData } from "@/lib/validations";
import { FiCheck, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function LogPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [successMessage, setSuccessMessage] = useState("");

  const { data: foods, isLoading: isLoadingFoods } = useQuery({
    queryKey: ["foods"],
    queryFn: () => api.getFoods(),
  });

  const createMutation = useMutation({
    mutationFn: (data: EntryFormData) =>
      api.createEntry({ ...data, date: selectedDate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      setSuccessMessage("Entry logged successfully!");
      reset();
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<EntryFormData>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      foodId: 0,
      grams: 100,
    },
  });

  const selectedFoodId = watch("foodId");
  const grams = watch("grams");

  const selectedFood = foods?.find((f) => f.id === Number(selectedFoodId));

  const calculateNutrition = () => {
    if (!selectedFood || !grams) return null;
    const multiplier = grams / 100;
    return {
      calories: (selectedFood.caloriesPer100g * multiplier).toFixed(1),
      protein: (selectedFood.proteinPer100g * multiplier).toFixed(1),
      carbs: (selectedFood.carbsPer100g * multiplier).toFixed(1),
      fat: (selectedFood.fatPer100g * multiplier).toFixed(1),
    };
  };

  const nutrition = calculateNutrition();

  const onSubmit = (data: EntryFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Log Meal</h1>
          <p className="text-gray-600">Record what you ate</p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          <FiCheck className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="label">Select Food</label>
            {isLoadingFoods ? (
              <div className="input bg-gray-100 animate-pulse h-10" />
            ) : (
              <select
                {...register("foodId")}
                className={`input ${errors.foodId ? "input-error" : ""}`}
              >
                <option value={0}>Choose a food...</option>
                {foods?.map((food) => (
                  <option key={food.id} value={food.id}>
                    {food.name} ({food.caloriesPer100g} cal/100g)
                  </option>
                ))}
              </select>
            )}
            {errors.foodId && <p className="error-text">{errors.foodId.message}</p>}
          </div>

          <div>
            <label className="label">Amount (grams)</label>
            <input
              type="number"
              {...register("grams")}
              className={`input ${errors.grams ? "input-error" : ""}`}
              placeholder="100"
            />
            {errors.grams && <p className="error-text">{errors.grams.message}</p>}
          </div>

          {/* Preview */}
          {nutrition && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-3">Nutrition Preview</p>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{nutrition.calories}</p>
                  <p className="text-xs text-gray-500">Calories</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{nutrition.protein}g</p>
                  <p className="text-xs text-gray-500">Protein</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{nutrition.carbs}g</p>
                  <p className="text-xs text-gray-500">Carbs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{nutrition.fat}g</p>
                  <p className="text-xs text-gray-500">Fat</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Logging..." : "Log Entry"}
          </button>
        </form>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/")}
          className="btn btn-secondary flex-1"
        >
          View Dashboard
        </button>
        <Link href="/foods" className="btn btn-secondary flex-1 text-center">
          Manage Foods
        </Link>
      </div>
    </div>
  );
}

