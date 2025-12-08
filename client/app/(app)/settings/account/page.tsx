"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiArrowLeft, FiUser, FiMail, FiCheck, FiCamera, FiImage, FiX, FiEye, FiMinus, FiPlus, FiCrop } from "react-icons/fi";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  middleName: z.string().max(100).optional(),
  lastName: z.string().min(1, "Last name is required").max(100),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function AccountSettingsPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [photoDescription, setPhotoDescription] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      middleName: user?.middleName || "",
      lastName: user?.lastName || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        middleName: user.middleName || "",
        lastName: user.lastName || "",
      });
      setPreviewImage(user.profilePicture || null);
    }
  }, [user, reset]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPhotoMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await api.updateProfile(data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      if (refreshUser) refreshUser();
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image must be less than 5MB");
      return;
    }

    // Read and show in editor
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setPendingImage(imageData);
      setShowPhotoMenu(false);
      setShowPhotoEditor(true);
      setZoomLevel(1);
      setPhotoDescription("");
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSavePhoto = async () => {
    if (!pendingImage) return;
    
    setIsUploadingPicture(true);
    setErrorMessage("");
    try {
      await api.uploadProfilePicture(pendingImage);
      setPreviewImage(pendingImage);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      if (refreshUser) refreshUser();
      setSuccessMessage("Profile picture updated!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowPhotoEditor(false);
      setPendingImage(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to upload picture");
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const handleCancelPhotoEdit = () => {
    setShowDiscardConfirm(true);
  };

  const handleConfirmDiscard = () => {
    setShowDiscardConfirm(false);
    setShowPhotoEditor(false);
    setPendingImage(null);
    setPhotoDescription("");
    setZoomLevel(1);
  };

  const handleRemovePicture = async () => {
    if (!user?.profilePicture && !previewImage) return;
    
    setShowDeleteConfirm(false);
    setShowPhotoMenu(false);
    setIsUploadingPicture(true);
    setErrorMessage("");
    try {
      await api.removeProfilePicture();
      setPreviewImage(null);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      if (refreshUser) refreshUser();
      setSuccessMessage("Profile picture removed!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to remove picture");
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const openDeleteConfirm = () => {
    setShowPhotoMenu(false);
    setShowDeleteConfirm(true);
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!user) return "?";
    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || user.email?.charAt(0).toUpperCase() || "?";
  };

  const getUserFullName = () => {
    if (!user) return "User";
    return user.fullName || `${user.firstName} ${user.lastName}`;
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
          <h1 className="text-xl font-bold text-gray-900">Account Settings</h1>
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
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <FiX className="w-5 h-5" />
            {errorMessage}
          </div>
        )}

        {/* Profile Picture - Facebook Style */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h2>
          <div className="flex items-center gap-6">
            {/* Avatar with Camera Icon */}
            <div className="relative" ref={dropdownRef}>
              {/* Profile Picture */}
              {previewImage ? (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover shadow-lg ring-4 ring-white cursor-pointer"
                    onClick={() => setShowPhotoViewer(true)}
                  />
                  {isUploadingPicture && (
                    <div className="absolute inset-0 w-28 h-28 rounded-full bg-black/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-4xl shadow-lg ring-4 ring-white">
                  {getInitials()}
                </div>
              )}
              
              {/* Camera Button - Facebook Style */}
              <button
                onClick={() => setShowPhotoMenu(!showPhotoMenu)}
                disabled={isUploadingPicture}
                className="absolute bottom-0 right-0 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full border-4 border-white shadow-md flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <FiCamera className="w-5 h-5 text-gray-700" />
              </button>

              {/* Facebook-style Dropdown Menu */}
              {showPhotoMenu && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {previewImage && (
                    <button
                      onClick={() => {
                        setShowPhotoMenu(false);
                        setShowPhotoViewer(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        <FiEye className="w-5 h-5 text-gray-700" />
                      </div>
                      <span className="font-medium text-gray-900">See profile picture</span>
                    </button>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                      <FiImage className="w-5 h-5 text-gray-700" />
                    </div>
                    <span className="font-medium text-gray-900">Choose profile picture</span>
                  </button>
                  {previewImage && (
                    <button
                      onClick={openDeleteConfirm}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                    >
                      <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                        <FiX className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="font-medium text-red-600">Remove photo</span>
                    </button>
                  )}
                </div>
              )}

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            <div className="flex-1">
              <p className="font-medium text-gray-900">{getUserFullName()}</p>
              <p className="text-sm text-gray-500 mt-1">
                Click the camera icon to update your profile picture
              </p>
            </div>
          </div>
        </div>

        {/* Photo Editor Modal - Facebook Style */}
        {showPhotoEditor && pendingImage && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Choose profile picture</h3>
                <button
                  onClick={handleCancelPhotoEdit}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Description Input */}
              <div className="px-4 pt-4">
                <textarea
                  value={photoDescription}
                  onChange={(e) => setPhotoDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                />
              </div>

              {/* Image Preview */}
              <div className="p-6 flex justify-center">
                <div className="relative">
                  <div 
                    className="w-48 h-48 rounded-full overflow-hidden ring-4 ring-gray-100 shadow-lg"
                    style={{ transform: `scale(${zoomLevel})` }}
                  >
                    <img
                      src={pendingImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Zoom Slider */}
              <div className="px-6 pb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiMinus className="w-5 h-5 text-gray-600" />
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <button
                    onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiPlus className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-4 flex gap-3">
                <button
                  onClick={() => {/* Crop functionality placeholder */}}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  <FiCrop className="w-4 h-4" />
                  Crop photo
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeWidth="2" d="M12 6v6l4 2" />
                  </svg>
                  Make temporary
                </button>
              </div>

              {/* Info Text */}
              <div className="px-6 pb-4">
                <p className="text-sm text-gray-500">
                  Your profile picture for <span className="font-semibold text-gray-700">{getUserFullName()}</span> will be visible to everyone.
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={handleCancelPhotoEdit}
                  className="px-6 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePhoto}
                  disabled={isUploadingPicture}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploadingPicture ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Discard Changes Confirmation Modal */}
        {showDiscardConfirm && (
          <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Discard changes</h3>
                <button
                  onClick={() => setShowDiscardConfirm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-gray-700">
                  Are you sure that you want to discard your changes?
                </p>
              </div>
              <div className="flex justify-end gap-3 p-4 border-t border-gray-100">
                <button
                  onClick={() => setShowDiscardConfirm(false)}
                  className="px-6 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDiscard}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Photo Viewer Modal */}
        {showPhotoViewer && previewImage && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setShowPhotoViewer(false)}
          >
            <button
              onClick={() => setShowPhotoViewer(false)}
              className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <FiX className="w-8 h-8" />
            </button>
            <img
              src={previewImage}
              alt="Profile"
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div 
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div 
              className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiX className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Remove Profile Picture?
                </h3>
                <p className="text-gray-500 text-sm">
                  Are you sure you want to remove your profile picture? This action cannot be undone.
                </p>
              </div>
              <div className="flex border-t border-gray-100">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 transition-colors border-r border-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemovePicture}
                  className="flex-1 py-3 px-4 text-red-600 font-medium hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            <p className="text-sm text-gray-500">Update your personal details</p>
          </div>

          <div className="p-6 space-y-5">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  {...register("firstName")}
                  type="text"
                  className="w-full px-4 py-3 pl-11 bg-white text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your first name"
                />
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            {/* Middle Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Middle Name <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  {...register("middleName")}
                  type="text"
                  className="w-full px-4 py-3 pl-11 bg-white text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your middle name"
                />
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  {...register("lastName")}
                  type="text"
                  className="w-full px-4 py-3 pl-11 bg-white text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your last name"
                />
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
