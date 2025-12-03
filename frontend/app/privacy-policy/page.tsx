"use client";

import Link from "next/link";
import { FiArrowLeft, FiShield } from "react-icons/fi";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <FiArrowLeft /> Back
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <FiShield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
              <p className="text-white/70">Calorie Calculator App</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="prose prose-slate max-w-none">
            <p className="text-gray-500 text-sm mb-6">
              <strong>Last Updated:</strong> October 1, 2025 | <strong>Effective Date:</strong> October 1, 2025
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to Calorie Calculator (&quot;we,&quot; &quot;our,&quot; or &quot;the App&quot;). Your privacy is important to us. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By using Calorie Calculator, you agree to the collection and use of information in accordance with this policy.
              If you do not agree with the terms of this Privacy Policy, please do not use the App.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1.1 Personal Information You Provide</h3>
            <p className="text-gray-600 leading-relaxed"><strong>Account Information:</strong></p>
            <p className="text-gray-600 leading-relaxed">When you create an account, we collect:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>First name, middle name (optional), and last name</li>
              <li>Email address</li>
              <li>Password (encrypted with BCrypt)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-2">
              <strong>Purpose:</strong> Authentication, account management, and personalized app experience.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1.2 Automatically Collected Information</h3>
            <p className="text-gray-600 leading-relaxed"><strong>Usage Data:</strong></p>
            <p className="text-gray-600 leading-relaxed">When you use our AI-powered nutrition assistant, we log:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Timestamp of requests</li>
              <li>Analysis type (text queries)</li>
              <li>User ID (linked to your account)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-2">
              <strong>Purpose:</strong> Service optimization, rate limiting, abuse prevention, and improving AI accuracy.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1.3 Nutritional Data</h3>
            <p className="text-gray-600 leading-relaxed"><strong>Food Logs:</strong></p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Foods you add to your personal food database</li>
              <li>Meal entries and portion sizes</li>
              <li>Daily calorie and macro goals</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-2">
              <strong>Purpose:</strong> Provide nutritional tracking and personalized insights.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 Core Functionality</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Authentication:</strong> Verify your identity via email and password</li>
              <li><strong>Nutritional Tracking:</strong> Calculate and store calorie/macro data</li>
              <li><strong>AI Assistant:</strong> Process your nutrition questions via OpenAI API</li>
              <li><strong>App Personalization:</strong> Customize your experience based on preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2 Security & Abuse Prevention</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Rate Limiting:</strong> Prevent abuse of AI services</li>
              <li><strong>Fraud Detection:</strong> Identify suspicious activity patterns</li>
              <li><strong>JWT Authentication:</strong> Secure token-based authentication</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Data Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.1 Third-Party Services</h3>
            <p className="text-gray-600 leading-relaxed">We share data with the following third-party services:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>OpenAI API:</strong> AI-powered nutrition assistant (query processing)</li>
              <li><strong>SQLite Database:</strong> Local data storage on our servers</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.2 We DO NOT Sell Your Data</h3>
            <p className="text-gray-600 leading-relaxed">
              We do NOT sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Data Retention</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Account Data:</strong> Retained while your account is active</li>
              <li><strong>Food Logs:</strong> Retained until you delete them or your account</li>
              <li><strong>AI Chat Logs:</strong> Retained for 90 days for service improvement</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">We implement industry-standard security measures:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Password Encryption:</strong> BCrypt hashing algorithm</li>
              <li><strong>Encryption in Transit:</strong> All data transmitted via HTTPS/TLS</li>
              <li><strong>JWT Authentication:</strong> Secure token-based authentication</li>
              <li><strong>API Key Security:</strong> OpenAI API key stored server-side (never exposed)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Your Privacy Rights</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.1 Access and Correction</h3>
            <p className="text-gray-600 leading-relaxed">
              You can view and edit your profile information in the App settings.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.2 Data Deletion</h3>
            <p className="text-gray-600 leading-relaxed">
              To delete your account and data, please contact us at{" "}
              <a href="mailto:support@caloriecalc.app" className="text-indigo-600 hover:underline">
                support@caloriecalc.app
              </a>
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.3 GDPR Rights (EU Users)</h3>
            <p className="text-gray-600 leading-relaxed">If you are in the European Economic Area (EEA), you have the following rights:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Right to Access: Request a copy of your data</li>
              <li>Right to Rectification: Correct inaccurate data</li>
              <li>Right to Erasure: Delete your data (&quot;right to be forgotten&quot;)</li>
              <li>Right to Restrict Processing: Limit how we use your data</li>
              <li>Right to Data Portability: Receive your data in a portable format</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Children&apos;s Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              <strong>Age Restriction:</strong> Calorie Calculator is NOT intended for children under 13 years old.
              We do not knowingly collect personal information from children under 13.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Changes to This Privacy Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated 
              &quot;Last Updated&quot; date. By continuing to use the App after changes are posted, you accept the updated Privacy Policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions or concerns about this Privacy Policy, please contact us:
            </p>
            <ul className="list-none pl-0 text-gray-600 space-y-2 mt-4">
              <li><strong>Email:</strong>{" "}
                <a href="mailto:support@caloriecalc.app" className="text-indigo-600 hover:underline">
                  support@caloriecalc.app
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

