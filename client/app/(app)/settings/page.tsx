"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import {
  FiShield,
  FiList,
  FiSliders,
  FiArrowLeft,
  FiChevronRight,
  FiUser,
  FiTarget,
  FiLogOut,
  FiTrash2,
  FiFileText,
  FiHelpCircle,
  FiKey,
  FiGlobe,
} from "react-icons/fi";
import Link from "next/link";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/lib/i18n/language-context";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { language, languages } = useLanguage();
  const currentLang = languages.find((l) => l.code === language);

  // Get user initials for avatar
  const getInitials = () => {
    if (!user) return "?";
    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || user.email?.charAt(0).toUpperCase() || "?";
  };

  const menuItems = [
    {
      icon: FiUser,
      label: "Account Settings",
      description: "Edit profile, change name",
      href: "/settings/account",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: FiKey,
      label: "Password & Security",
      description: "Change password, security options",
      href: "/settings/security",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: FiTarget,
      label: "Nutrition Goals",
      description: "Daily calories, protein, carbs, fat",
      href: "/settings/goals",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: FiShield,
      label: "Privacy Centre",
      description: "Manage your privacy settings",
      href: "/settings/privacy",
      color: "bg-gray-100 text-gray-700",
    },
    {
      icon: FiList,
      label: "Activity Log",
      description: "View your meal history",
      href: "/log",
      color: "bg-gray-100 text-gray-700",
    },
    {
      icon: FiSliders,
      label: "Preferences",
      description: "App preferences and display",
      href: "/settings/preferences",
      color: "bg-gray-100 text-gray-700",
    },
  ];

  const legalItems = [
    {
      icon: FiFileText,
      label: "Terms of Service",
      href: "/terms",
    },
    {
      icon: FiShield,
      label: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      icon: FiHelpCircle,
      label: "Help & Support",
      href: "mailto:aa.aashishjoshi13@gmail.com",
    },
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">Settings & privacy</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Profile Card */}
        <Link
          href="/settings/account"
          className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
        >
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover shadow-md ring-2 ring-white"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
              {getInitials()}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {user?.fullName || `${user?.firstName} ${user?.lastName}`}
            </h2>
            <p className="text-sm text-gray-500">See your profile</p>
          </div>
          <FiChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        {/* Main Menu */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100`}
            >
              <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <FiChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          ))}
          {/* Language Selector */}
          <LanguageSelector variant="settings" />
        </div>

        {/* Legal & Support */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Legal & Support</p>
          </div>
          {legalItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                index !== legalItems.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-gray-600" />
              </div>
              <p className="flex-1 font-medium text-gray-900">{item.label}</p>
              <FiChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          ))}
        </div>

        {/* Logout & Delete */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <FiLogOut className="w-5 h-5 text-gray-600" />
            </div>
            <p className="flex-1 text-left font-medium text-gray-900">Log Out</p>
          </button>
          <Link
            href="/settings/delete-account"
            className="flex items-center gap-4 p-4 hover:bg-red-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <FiTrash2 className="w-5 h-5 text-red-600" />
            </div>
            <p className="flex-1 font-medium text-red-600">Delete Account</p>
            <FiChevronRight className="w-5 h-5 text-red-400" />
          </Link>
        </div>

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-400">CalorieCalc v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">© 2025 All rights reserved</p>
        </div>
      </div>
    </div>
  );
}
