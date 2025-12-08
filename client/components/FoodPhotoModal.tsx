"use client";

import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FiCamera, FiUpload, FiX, FiCheck, FiLoader } from "react-icons/fi";
import { format } from "date-fns";

interface RecognizedFood {
  name: string;
  estimatedGrams: number;
  estimatedCalories: number;
  estimatedProtein: number;
  estimatedCarbs: number;
  estimatedFat: number;
  notes?: string;
}

interface FoodPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FoodPhotoModal({
  isOpen,
  onClose,
  onSuccess,
}: FoodPhotoModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [recognizedFoods, setRecognizedFoods] = useState<RecognizedFood[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<Set<number>>(new Set());
  const [step, setStep] = useState<"upload" | "analyzing" | "results">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const analyzeMutation = useMutation({
    mutationFn: (file: File) => api.analyzeFood(file),
    onSuccess: (data) => {
      setRecognizedFoods(data.foods);
      // Select all foods by default
      setSelectedFoods(new Set(data.foods.map((_, idx) => idx)));
      setStep("results");
    },
    onError: (error: any) => {
      alert(error.message || "Failed to analyze image");
      setStep("upload");
    },
  });

  const addFoodsMutation = useMutation({
    mutationFn: async (foods: RecognizedFood[]) => {
      // Try to find matching foods in the database
      const allFoods = await api.getFoods();
      const date = format(new Date(), "yyyy-MM-dd");

      // Add each selected food
      for (const food of foods) {
        // Try to find a matching food in the database
        const match = allFoods.find(
          (f) => f.name.toLowerCase() === food.name.toLowerCase()
        );

        if (match) {
          // Use existing food
          await api.createEntry({
            foodId: match.id,
            grams: food.estimatedGrams,
            date,
          });
        } else {
          // Create new food entry
          const newFood = await api.createFood({
            name: food.name,
            caloriesPer100g: (food.estimatedCalories / food.estimatedGrams) * 100,
            proteinPer100g: (food.estimatedProtein / food.estimatedGrams) * 100,
            carbsPer100g: (food.estimatedCarbs / food.estimatedGrams) * 100,
            fatPer100g: (food.estimatedFat / food.estimatedGrams) * 100,
          });

          await api.createEntry({
            foodId: newFood.id,
            grams: food.estimatedGrams,
            date,
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      onSuccess();
      handleClose();
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        alert("Image size must be less than 20MB");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (!imageFile) return;
    setStep("analyzing");
    analyzeMutation.mutate(imageFile);
  };

  const handleToggleFood = (index: number) => {
    const newSelected = new Set(selectedFoods);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedFoods(newSelected);
  };

  const handleAddToLog = () => {
    const selected = recognizedFoods.filter((_, idx) => selectedFoods.has(idx));
    if (selected.length === 0) {
      alert("Please select at least one food item");
      return;
    }
    addFoodsMutation.mutate(selected);
  };

  const handleClose = () => {
    setImageFile(null);
    setImagePreview(null);
    setRecognizedFoods([]);
    setSelectedFoods(new Set());
    setStep("upload");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">📸 Food Photo Recognition</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "upload" && (
            <div className="space-y-4">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Food preview"
                    className="w-full h-64 object-contain bg-gray-100 rounded-lg"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleAnalyze}
                      className="flex-1 btn btn-primary"
                      disabled={analyzeMutation.isPending}
                    >
                      {analyzeMutation.isPending ? (
                        <>
                          <FiLoader className="w-5 h-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Analyze Food"
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="btn btn-secondary"
                    >
                      Choose Different Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 text-center">
                    Take a photo or upload an image of your food, and AI will
                    identify it and estimate nutrition info!
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
                    >
                      <FiCamera className="w-12 h-12 text-indigo-600" />
                      <span className="font-medium">Take Photo</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
                    >
                      <FiUpload className="w-12 h-12 text-indigo-600" />
                      <span className="font-medium">Upload Photo</span>
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />

                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
              )}
            </div>
          )}

          {step === "analyzing" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <FiLoader className="w-16 h-16 text-indigo-600 animate-spin" />
              <p className="text-lg font-medium">Analyzing your food...</p>
              <p className="text-gray-600 text-sm">This may take a few seconds</p>
            </div>
          )}

          {step === "results" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Recognized Foods:</h3>
                <button
                  onClick={() => {
                    setStep("upload");
                    setImageFile(null);
                    setImagePreview(null);
                    setRecognizedFoods([]);
                  }}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Try Another Photo
                </button>
              </div>

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Analyzed food"
                  className="w-full h-48 object-contain bg-gray-100 rounded-lg"
                />
              )}

              <div className="space-y-2">
                {recognizedFoods.map((food, idx) => (
                  <div
                    key={idx}
                    className={`p-4 border rounded-lg cursor-pointer transition ${
                      selectedFoods.has(idx)
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleToggleFood(idx)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              selectedFoods.has(idx)
                                ? "bg-indigo-600 border-indigo-600"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedFoods.has(idx) && (
                              <FiCheck className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <h4 className="font-semibold">{food.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {food.estimatedGrams}g • {food.estimatedCalories.toFixed(0)} cal
                        </p>
                        <div className="flex gap-4 text-xs text-gray-500 mt-2">
                          <span>P: {food.estimatedProtein.toFixed(1)}g</span>
                          <span>C: {food.estimatedCarbs.toFixed(1)}g</span>
                          <span>F: {food.estimatedFat.toFixed(1)}g</span>
                        </div>
                        {food.notes && (
                          <p className="text-xs text-gray-500 mt-2 italic">
                            {food.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddToLog}
                  className="flex-1 btn btn-primary"
                  disabled={
                    selectedFoods.size === 0 || addFoodsMutation.isPending
                  }
                >
                  {addFoodsMutation.isPending ? (
                    <>
                      <FiLoader className="w-5 h-5 animate-spin" />
                      Adding to Log...
                    </>
                  ) : (
                    `Add ${selectedFoods.size} Item${selectedFoods.size !== 1 ? "s" : ""} to Log`
                  )}
                </button>
                <button onClick={handleClose} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
