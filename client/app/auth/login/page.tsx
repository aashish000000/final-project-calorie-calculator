"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/auth-context";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/lib/i18n/language-context";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-200 flex items-center justify-center p-4">
      {/* Decorative background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-cyan-200/40 to-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tr from-purple-200/40 to-indigo-200/40 rounded-full blur-3xl" />
      </div>

      {/* Main container */}
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="bg-white/30 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/40">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left Side - Branding */}
            <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col justify-center items-center bg-gradient-to-br from-white/40 to-purple-50/40">
              {/* 3D Decorative Shape */}
              <div className="relative w-40 h-40 lg:w-56 lg:h-56 mb-6">
                <div className="absolute inset-0">
                  <div className="absolute top-0 left-1/4 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full blur-sm opacity-80" />
                  <div className="absolute top-6 right-1/4 w-20 h-20 lg:w-28 lg:h-28 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full blur-sm opacity-80" />
                  <div className="absolute bottom-2 left-1/3 w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-sm opacity-70" />
                </div>
                <div className="absolute inset-6 lg:inset-8 bg-gradient-to-br from-cyan-400 via-teal-500 to-purple-600 rounded-2xl lg:rounded-3xl transform rotate-12 shadow-2xl" />
              </div>

              {/* Logo */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xl lg:text-2xl">🍎</span>
                </div>
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
                    CalorieCalc
                  </h2>
                  <p className="text-xs text-purple-600/70">Track • Analyze • Thrive</p>
                </div>
              </div>

              {/* Tagline */}
              <p className="text-center text-purple-800/70 text-sm lg:text-base max-w-xs mb-6">
                Your personal nutrition assistant for a healthier lifestyle
              </p>

              {/* CTA Buttons - Hidden on mobile */}
              <div className="hidden lg:flex gap-3">
                <button className="px-4 py-2 bg-white/60 text-purple-700 rounded-full text-sm font-medium hover:bg-white/80 transition-all shadow-sm">
                  Learn More
                </button>
                <button className="px-4 py-2 bg-purple-600/10 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-600/20 transition-all">
                  Features
                </button>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:w-1/2 bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900 p-8 lg:p-10">
              <div className="max-w-sm mx-auto">
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  {t('auth.login')} to CalorieCalc<span className="text-cyan-400">™</span>
                </h1>
                <p className="text-purple-300/70 mb-6 text-sm">
                  {t('auth.welcome')}! {t('auth.welcomeSubtitle')}
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
                      {t('auth.email')}
                    </label>
                    <div className="relative">
                      <input
                        {...register("email")}
                        type="email"
                        className="w-full px-4 py-3 pl-11 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all"
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
                      {t('auth.password')}
                    </label>
                    <div className="relative">
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-3 pl-11 pr-11 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all"
                        placeholder="••••••••"
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

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-purple-500/30 bg-white/5 text-cyan-500 focus:ring-cyan-400/50 focus:ring-offset-0"
                      />
                      <span className="text-purple-300/70">Remember me</span>
                    </label>
                    <button type="button" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      {t('auth.forgotPassword')}
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/25"
                  >
                    {isSubmitting ? t('common.loading') : t('auth.login')}
                  </button>
                </form>

                {/* Sign Up Link */}
                <p className="mt-6 text-center text-purple-300/60 text-sm">
                  {t('auth.noAccount')}{" "}
                  <Link
                    href="/auth/register"
                    className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    {t('auth.signup')}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Language Selector Footer - Facebook Style */}
        <LanguageSelector variant="footer" />
      </div>
    </div>
  );
}
