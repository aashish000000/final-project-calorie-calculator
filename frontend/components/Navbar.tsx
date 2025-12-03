"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { FiHome, FiList, FiPlusCircle, FiLogOut, FiUser } from "react-icons/fi";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

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
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-gray-600">
              <FiUser className="w-4 h-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
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

