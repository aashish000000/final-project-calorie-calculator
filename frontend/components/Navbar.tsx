"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { FiHome, FiList, FiPlusCircle, FiLogOut, FiSettings, FiChevronDown } from "react-icons/fi";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) return null;

  // Get user initials for avatar
  const getInitials = () => {
    if (!user) return "?";
    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || user.email?.charAt(0).toUpperCase() || "?";
  };

  // Get display name
  const getDisplayName = () => {
    if (!user) return "";
    if (user.firstName) return user.firstName;
    return user.email?.split("@")[0] || "";
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
              🍎 Calorie Calculator
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/" icon={<FiHome />} label="Dashboard" />
              <NavLink href="/foods" icon={<FiList />} label="Foods" />
              <NavLink href="/log" icon={<FiPlusCircle />} label="Log Meal" />
            </div>
          </div>
          
          {/* Facebook-style profile dropdown */}
          <div className="flex items-center gap-3" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              {/* Avatar */}
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover shadow-md ring-2 ring-white"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {getInitials()}
                </div>
              )}
              {/* Name */}
              <span className="hidden sm:block font-medium text-gray-800 max-w-[120px] truncate">
                {getDisplayName()}
              </span>
              <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-4 top-14 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Profile Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover shadow-md ring-2 ring-white"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {getInitials()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {user?.fullName || `${user?.firstName} ${user?.lastName}`}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                      <FiSettings className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="font-medium">Settings & Privacy</span>
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      logout();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                      <FiLogOut className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="font-medium">Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile nav */}
      <div className="md:hidden border-t border-gray-100">
        <div className="flex justify-around py-2">
          <MobileNavLink href="/" icon={<FiHome />} label="Dashboard" />
          <MobileNavLink href="/foods" icon={<FiList />} label="Foods" />
          <MobileNavLink href="/log" icon={<FiPlusCircle />} label="Log" />
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MobileNavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1 px-4 py-1 text-gray-600 hover:text-primary-600"
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Link>
  );
}

