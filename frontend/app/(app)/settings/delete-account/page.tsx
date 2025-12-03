"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiAlertTriangle, FiTrash2, FiCheck } from "react-icons/fi";
import { api } from "@/lib/api";

export default function DeleteAccountPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return;
    
    setIsDeleting(true);
    setErrorMessage("");
    try {
      await api.deleteAccount();
      logout();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to delete account");
      setIsDeleting(false);
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
          <h1 className="text-xl font-bold text-gray-900">Delete Account</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Warning Banner */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FiAlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-red-800">This action is permanent</h2>
              <p className="text-red-700 mt-1">
                Once you delete your account, there is no going back. Please be certain.
              </p>
            </div>
          </div>
        </div>

        {/* What will be deleted */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">What will be deleted:</h3>
          </div>
          <ul className="p-4 space-y-3">
            <li className="flex items-center gap-3 text-gray-600">
              <FiTrash2 className="w-5 h-5 text-red-500" />
              Your profile information (name, email)
            </li>
            <li className="flex items-center gap-3 text-gray-600">
              <FiTrash2 className="w-5 h-5 text-red-500" />
              All your food logs and meal history
            </li>
            <li className="flex items-center gap-3 text-gray-600">
              <FiTrash2 className="w-5 h-5 text-red-500" />
              Custom foods you&apos;ve created
            </li>
            <li className="flex items-center gap-3 text-gray-600">
              <FiTrash2 className="w-5 h-5 text-red-500" />
              Your nutrition goals and settings
            </li>
            <li className="flex items-center gap-3 text-gray-600">
              <FiTrash2 className="w-5 h-5 text-red-500" />
              AI chat history
            </li>
          </ul>
        </div>

        {/* Confirmation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
          <p className="text-gray-600 mb-4">
            To confirm, type <span className="font-mono font-bold text-red-600">DELETE</span> in the box below:
          </p>
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
            placeholder="Type DELETE to confirm"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-mono"
          />

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={confirmText !== "DELETE" || isDeleting}
              className="flex-1 py-3 px-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 className="w-5 h-5" />
                  Delete My Account
                </>
              )}
            </button>
          </div>
        </div>

        {/* Alternative */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-800 mb-2">Not sure yet?</h3>
          <p className="text-blue-700 text-sm">
            If you just want to take a break, you can simply log out. Your data will be saved 
            and you can come back anytime.
          </p>
        </div>
      </div>
    </div>
  );
}

