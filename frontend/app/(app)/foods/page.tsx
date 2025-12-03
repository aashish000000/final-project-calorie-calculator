"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { foodSchema, type FoodFormData } from "@/lib/validations";
import type { Food } from "@/lib/types";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

export default function FoodsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const queryClient = useQueryClient();

  const { data: foods, isLoading } = useQuery({
    queryKey: ["foods"],
    queryFn: () => api.getFoods(),
  });

  const createMutation = useMutation({
    mutationFn: (data: FoodFormData) => api.createFood(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FoodFormData }) =>
      api.updateFood(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteFood(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FoodFormData>({
    resolver: zodResolver(foodSchema),
  });

  const openCreateModal = () => {
    setEditingFood(null);
    reset({
      name: "",
      caloriesPer100g: 0,
      proteinPer100g: 0,
      carbsPer100g: 0,
      fatPer100g: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (food: Food) => {
    setEditingFood(food);
    reset({
      name: food.name,
      caloriesPer100g: food.caloriesPer100g,
      proteinPer100g: food.proteinPer100g,
      carbsPer100g: food.carbsPer100g,
      fatPer100g: food.fatPer100g,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFood(null);
    reset();
  };

  const onSubmit = (data: FoodFormData) => {
    if (editingFood) {
      updateMutation.mutate({ id: editingFood.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this food?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Foods</h1>
          <p className="text-gray-600">Manage your food database</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary flex items-center gap-2">
          <FiPlus className="w-4 h-4" />
          Add Food
        </button>
      </div>

      {/* Foods Table */}
      <div className="card overflow-hidden p-0">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : foods?.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No foods yet. Add your first food!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Cal/100g</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Protein</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Carbs</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Fat</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {foods?.map((food) => (
                  <tr key={food.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{food.name}</span>
                      {food.userId === null && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">Global</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">{food.caloriesPer100g}</td>
                    <td className="px-6 py-4 text-right text-gray-600">{food.proteinPer100g}g</td>
                    <td className="px-6 py-4 text-right text-gray-600">{food.carbsPer100g}g</td>
                    <td className="px-6 py-4 text-right text-gray-600">{food.fatPer100g}g</td>
                    <td className="px-6 py-4 text-right">
                      {food.userId !== null && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(food)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(food.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingFood ? "Edit Food" : "Add Food"}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
              <div>
                <label className="label">Name</label>
                <input {...register("name")} className={`input ${errors.name ? "input-error" : ""}`} />
                {errors.name && <p className="error-text">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Calories/100g</label>
                  <input type="number" step="0.1" {...register("caloriesPer100g")} className="input" />
                </div>
                <div>
                  <label className="label">Protein/100g</label>
                  <input type="number" step="0.1" {...register("proteinPer100g")} className="input" />
                </div>
                <div>
                  <label className="label">Carbs/100g</label>
                  <input type="number" step="0.1" {...register("carbsPer100g")} className="input" />
                </div>
                <div>
                  <label className="label">Fat/100g</label>
                  <input type="number" step="0.1" {...register("fatPer100g")} className="input" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="btn btn-secondary flex-1">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

