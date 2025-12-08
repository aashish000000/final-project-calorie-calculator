"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FiDroplet, FiPlus, FiX } from "react-icons/fi";

const PRESET_AMOUNTS = [250, 350, 500, 750]; // ml

export default function WaterTracker() {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const queryClient = useQueryClient();

  const { data: waterSummary, isLoading } = useQuery({
    queryKey: ["water", new Date().toISOString().split("T")[0]],
    queryFn: () => api.getWaterSummary(),
  });

  const logWaterMutation = useMutation({
    mutationFn: (milliliters: number) => api.logWater(milliliters),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["water"] });
      setCustomAmount("");
      setShowCustomInput(false);
    },
  });

  const deleteWaterMutation = useMutation({
    mutationFn: (entryId: number) => api.deleteWaterEntry(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["water"] });
    },
  });

  const handleLogWater = (milliliters: number) => {
    if (milliliters > 0) {
      logWaterMutation.mutate(milliliters);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(customAmount);
    if (amount > 0) {
      handleLogWater(amount);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  const percentage = Math.min(waterSummary?.percentageOfGoal || 0, 100);
  const totalLiters = ((waterSummary?.totalMilliliters || 0) / 1000).toFixed(1);
  const goalLiters = ((waterSummary?.goalMilliliters || 2000) / 1000).toFixed(1);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiDroplet className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Water Intake</h3>
        </div>
        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
          title="Add custom amount"
        >
          {showCustomInput ? <FiX className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
        </button>
      </div>

      {/* Progress Circle */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-32 h-32 mb-3">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#E5E7EB"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#3B82F6"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">
              {percentage.toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">
            {totalLiters}L / {goalLiters}L
          </p>
          <p className="text-sm text-gray-600">Today's Progress</p>
        </div>
      </div>

      {/* Custom Input */}
      {showCustomInput && (
        <form onSubmit={handleCustomSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Amount (ml)"
              min="1"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <button
              type="submit"
              disabled={!customAmount || logWaterMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Add
            </button>
          </div>
        </form>
      )}

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {PRESET_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => handleLogWater(amount)}
            disabled={logWaterMutation.isPending}
            className="py-2 px-3 bg-white text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed border border-blue-200"
          >
            +{amount}ml
          </button>
        ))}
      </div>

      {/* Recent Entries */}
      {waterSummary && waterSummary.entries.length > 0 && (
        <div className="mt-4 pt-4 border-t border-blue-100">
          <p className="text-sm font-medium text-gray-700 mb-2">Today's Logs</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {waterSummary.entries.slice().reverse().map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between py-1 px-2 bg-white rounded text-sm"
              >
                <span className="text-gray-700">
                  {entry.milliliters}ml
                  <span className="text-gray-400 ml-2">
                    {new Date(entry.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </span>
                <button
                  onClick={() => deleteWaterMutation.mutate(entry.id)}
                  className="text-gray-400 hover:text-red-600 transition"
                  disabled={deleteWaterMutation.isPending}
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
