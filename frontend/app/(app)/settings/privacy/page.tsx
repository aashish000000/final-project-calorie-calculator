"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiShield, FiLock, FiEye, FiDatabase, FiChevronRight, FiCheck } from "react-icons/fi";

export default function PrivacySettingsPage() {
  const router = useRouter();

  const privacyItems = [
    {
      icon: FiDatabase,
      title: "Your Data",
      description: "See what data we store about you",
      color: "bg-blue-100 text-blue-600",
      items: [
        "Name and email address",
        "Food logs and meal history",
        "Custom foods you create",
        "Nutrition goals",
      ],
    },
    {
      icon: FiLock,
      title: "Data Security",
      description: "How we protect your information",
      color: "bg-green-100 text-green-600",
      items: [
        "Passwords encrypted with BCrypt",
        "All data transmitted via HTTPS",
        "JWT token authentication",
        "API keys stored server-side",
      ],
    },
    {
      icon: FiEye,
      title: "Data Sharing",
      description: "Who can see your data",
      color: "bg-purple-100 text-purple-600",
      items: [
        "We don't sell your data",
        "AI queries sent to OpenAI (anonymized)",
        "No third-party marketing access",
        "You control your data",
      ],
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
          <h1 className="text-xl font-bold text-gray-900">Privacy Centre</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Privacy Banner */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <FiShield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Your Privacy Matters</h2>
              <p className="text-indigo-100 text-sm">We&apos;re committed to protecting your data</p>
            </div>
          </div>
        </div>

        {/* Privacy Sections */}
        {privacyItems.map((section) => (
          <div key={section.title} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${section.color} flex items-center justify-center`}>
                <section.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
            </div>
            <ul className="p-4 space-y-3">
              {section.items.map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-600">
                  <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Legal Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Legal Documents</h3>
          </div>
          <Link
            href="/privacy-policy"
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <span className="text-gray-700">Privacy Policy</span>
            <FiChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
          <Link
            href="/terms"
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-700">Terms of Service</span>
            <FiChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>

        {/* Contact */}
        <div className="bg-gray-100 rounded-xl p-6 text-center">
          <p className="text-gray-600 text-sm">
            Questions about your privacy?
          </p>
          <a
            href="mailto:aa.aashishjoshi13@gmail.com"
            className="text-indigo-600 font-medium hover:underline"
          >
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
}

