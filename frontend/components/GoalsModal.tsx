"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { UserGoals } from "@/lib/types";
import { FiX, FiTarget, FiZap, FiDroplet, FiActivity } from "react-icons/fi";

interface GoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoals: UserGoals;
}

export function GoalsModal({ isOpen, onClose, currentGoals }: GoalsModalProps) {
  const queryClient = useQueryClient();
  const [goals, setGoals] = useState<UserGoals>(currentGoals);

  useEffect(() => {
    setGoals(currentGoals);
  }, [currentGoals]);

  const updateGoalsMutation = useMutation({
    mutationFn: (newGoals: UserGoals) => api.updateGoals(newGoals),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGoalsMutation.mutate(goals);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Daily Goals</h2>
              <p className="text-indigo-200 text-sm mt-1">Set your nutrition targets</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Calorie Goal */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FiActivity className="w-4 h-4 text-indigo-600" />
              Calorie Goal
            </label>
            <div className="relative">
              <input
                type="number"
                value={goals.calorieGoal}
                onChange={(e) => setGoals({ ...goals, calorieGoal: parseInt(e.target.value) || 0 })}
                min={500}
                max={10000}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="2000"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                kcal
              </span>
            </div>
          </div>

          {/* Protein Goal */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FiTarget className="w-4 h-4 text-green-600" />
              Protein Goal
            </label>
            <div className="relative">
              <input
                type="number"
                value={goals.proteinGoal}
                onChange={(e) => setGoals({ ...goals, proteinGoal: parseInt(e.target.value) || 0 })}
                min={10}
                max={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="150"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                grams
              </span>
            </div>
          </div>

          {/* Carbs Goal */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FiZap className="w-4 h-4 text-yellow-600" />
              Carbs Goal
            </label>
            <div className="relative">
              <input
                type="number"
                value={goals.carbsGoal}
                onChange={(e) => setGoals({ ...goals, carbsGoal: parseInt(e.target.value) || 0 })}
                min={20}
                max={800}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                placeholder="250"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                grams
              </span>
            </div>
          </div>

          {/* Fat Goal */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FiDroplet className="w-4 h-4 text-red-600" />
              Fat Goal
            </label>
            <div className="relative">
              <input
                type="number"
                value={goals.fatGoal}
                onChange={(e) => setGoals({ ...goals, fatGoal: parseInt(e.target.value) || 0 })}
                min={10}
                max={300}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="65"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                grams
              </span>
            </div>
          </div>

          {/* Macro Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Daily Macro Split</h4>
            <div className="flex justify-between">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-1">
                  <span className="text-green-600 font-medium text-sm">
                    {Math.round((goals.proteinGoal * 4 / goals.calorieGoal) * 100) || 0}%
                  </span>
                </div>
                <span className="text-xs text-gray-500">Protein</span>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-1">
                  <span className="text-yellow-600 font-medium text-sm">
                    {Math.round((goals.carbsGoal * 4 / goals.calorieGoal) * 100) || 0}%
                  </span>
                </div>
                <span className="text-xs text-gray-500">Carbs</span>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-1">
                  <span className="text-red-600 font-medium text-sm">
                    {Math.round((goals.fatGoal * 9 / goals.calorieGoal) * 100) || 0}%
                  </span>
                </div>
                <span className="text-xs text-gray-500">Fat</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateGoalsMutation.isPending}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 transition-all"
            >
              {updateGoalsMutation.isPending ? "Saving..." : "Save Goals"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

