"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/auth-context";
import { registerSchema } from "@/lib/validations";
import type { RegisterFormData } from "@/lib/validations";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (!agreeTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }
    
    setError("");
    setIsSubmitting(true);
    try {
      await registerUser(data.email, data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-200 flex items-center justify-center p-4">
      {/* Decorative background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-teal-200/40 to-cyan-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-purple-200/40 to-pink-200/40 rounded-full blur-3xl" />
      </div>

      {/* Main container */}
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="bg-white/30 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/40">
          <div className="flex flex-col lg:flex-row-reverse">
            
            {/* Right Side - Branding */}
            <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col justify-center items-center bg-gradient-to-br from-white/40 to-purple-50/40">
              {/* 3D Decorative Shape */}
              <div className="relative w-40 h-40 lg:w-56 lg:h-56 mb-6">
                <div className="absolute inset-0">
                  <div className="absolute top-4 right-1/4 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full blur-sm opacity-80" />
                  <div className="absolute top-8 left-1/4 w-20 h-20 lg:w-28 lg:h-28 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-sm opacity-80" />
                  <div className="absolute bottom-4 right-1/3 w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-sm opacity-70" />
                </div>
                <div className="absolute inset-6 lg:inset-8 bg-gradient-to-br from-teal-400 via-cyan-500 to-purple-600 rounded-2xl lg:rounded-3xl transform -rotate-12 shadow-2xl" />
              </div>

              {/* Logo */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xl lg:text-2xl">🍎</span>
                </div>
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    CalorieCalc
                  </h2>
                  <p className="text-xs text-teal-600/70">Your Nutrition Partner</p>
                </div>
              </div>

              {/* Tagline */}
              <p className="text-center text-purple-800/70 text-sm lg:text-base max-w-xs mb-6">
                Join thousands of users on their journey to better health
              </p>

              {/* Features - Hidden on mobile */}
              <div className="hidden lg:block space-y-2 text-sm text-purple-700/80">
                <div className="flex items-center gap-2">
                  <span className="text-teal-600">✓</span>
                  <span>Track calories effortlessly</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-teal-600">✓</span>
                  <span>AI-powered nutrition insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-teal-600">✓</span>
                  <span>Beautiful progress dashboard</span>
                </div>
              </div>
            </div>

            {/* Left Side - Form */}
            <div className="lg:w-1/2 bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900 p-8 lg:p-10">
              <div className="max-w-sm mx-auto">
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  Create your account<span className="text-teal-400">™</span>
                </h1>
                <p className="text-purple-300/70 mb-6 text-sm">
                  Start your nutrition journey today
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200/80 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        {...register("email")}
                        type="email"
                        className="w-full px-4 py-3 pl-11 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-transparent transition-all"
                        placeholder="mail@example.com"
                      />
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/60" />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200/80 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-3 pl-11 pr-11 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-transparent transition-all"
                        placeholder="Create a strong password"
                      />
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/60" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400/60 hover:text-purple-300 transition-colors"
                      >
                        {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200/80 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        {...register("confirmPassword")}
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full px-4 py-3 pl-11 pr-11 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-transparent transition-all"
                        placeholder="Confirm your password"
                      />
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/60" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400/60 hover:text-purple-300 transition-colors"
                      >
                        {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-400">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-purple-500/30 bg-white/5 text-teal-500 focus:ring-teal-400/50 focus:ring-offset-0"
                    />
                    <label htmlFor="terms" className="text-sm text-purple-300/70 cursor-pointer">
                      I agree to the{" "}
                      <span className="text-teal-400 hover:text-teal-300">Terms</span>
                      {" "}and{" "}
                      <span className="text-teal-400 hover:text-teal-300">Privacy Policy</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-teal-400 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/25"
                  >
                    {isSubmitting ? "Creating account..." : "Sign up"}
                  </button>
                </form>

                {/* Sign In Link */}
                <p className="mt-6 text-center text-purple-300/60 text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
