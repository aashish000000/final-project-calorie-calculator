"use client";

import Link from "next/link";
import { FiArrowLeft, FiFileText } from "react-icons/fi";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <FiArrowLeft /> Back
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <FiFileText className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Terms of Service</h1>
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

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using Calorie Calculator (&quot;the App&quot;), you agree to be bound by these Terms of Service 
              (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the App.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to update these Terms at any time. Continued use of the App after changes constitutes 
              acceptance of the modified Terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 leading-relaxed">
              Calorie Calculator is a nutritional tracking application that allows users to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Track daily calorie and macronutrient intake</li>
              <li>Log meals and food consumption</li>
              <li>Set and monitor nutritional goals</li>
              <li>Access an AI-powered nutrition assistant for guidance</li>
              <li>Create and manage a personal food database</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.1 Account Creation</h3>
            <p className="text-gray-600 leading-relaxed">To use certain features, you must create an account by providing:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>First name and last name (required)</li>
              <li>Middle name (optional)</li>
              <li>Valid email address</li>
              <li>Secure password (minimum 6 characters)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.2 Account Responsibilities</h3>
            <p className="text-gray-600 leading-relaxed">You are responsible for:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Maintaining the confidentiality of your password</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>Providing accurate and truthful information</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.3 Account Termination</h3>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to suspend or terminate your account if you violate these Terms or engage in 
              fraudulent, abusive, or illegal activity.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Acceptable Use</h2>
            <p className="text-gray-600 leading-relaxed">You agree NOT to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Use the App for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the App&apos;s functionality</li>
              <li>Upload malicious code or content</li>
              <li>Impersonate another person or entity</li>
              <li>Use automated systems to access the App (bots, scrapers)</li>
              <li>Abuse the AI assistant with excessive or malicious requests</li>
              <li>Share your account credentials with others</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. AI Nutrition Assistant</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.1 Nature of AI Responses</h3>
            <p className="text-gray-600 leading-relaxed">
              The AI nutrition assistant is powered by artificial intelligence and provides general nutritional 
              information and suggestions. Responses are:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Generated automatically based on your queries</li>
              <li>For informational purposes only</li>
              <li>NOT a substitute for professional medical or dietary advice</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.2 Limitations</h3>
            <p className="text-gray-600 leading-relaxed">
              We do not guarantee the accuracy, completeness, or reliability of AI-generated content. 
              Always consult a qualified healthcare professional for personalized dietary advice.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Health Disclaimer</h2>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-4">
              <p className="text-amber-800 font-medium">Important Medical Disclaimer</p>
              <p className="text-amber-700 text-sm mt-2">
                Calorie Calculator is NOT a medical device. The nutritional information and AI suggestions 
                provided are for informational purposes only and should NOT be considered medical advice.
              </p>
            </div>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Consult a doctor before starting any diet or nutrition program</li>
              <li>Do not rely solely on this App for health decisions</li>
              <li>Nutritional data may contain inaccuracies</li>
              <li>Individual nutritional needs vary based on health conditions</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Intellectual Property</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7.1 Our Content</h3>
            <p className="text-gray-600 leading-relaxed">
              All content, features, and functionality of the App (including but not limited to text, graphics, 
              logos, icons, and software) are owned by Calorie Calculator and protected by intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7.2 Your Content</h3>
            <p className="text-gray-600 leading-relaxed">
              You retain ownership of any content you submit (food entries, custom foods). By submitting content, 
              you grant us a license to use, store, and process it to provide the Service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>The App is provided &quot;AS IS&quot; without warranties of any kind</li>
              <li>We do not guarantee uninterrupted or error-free service</li>
              <li>We are not liable for any indirect, incidental, or consequential damages</li>
              <li>Our total liability shall not exceed the amount you paid us (if any)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Indemnification</h2>
            <p className="text-gray-600 leading-relaxed">
              You agree to indemnify and hold harmless Calorie Calculator, its officers, directors, employees, 
              and agents from any claims, damages, losses, or expenses arising from:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Your use of the App</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed">
              The App may integrate with third-party services (e.g., OpenAI for AI features). These services 
              have their own terms and privacy policies. We are not responsible for third-party content or practices.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
              where Calorie Calculator operates, without regard to conflict of law principles.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Dispute Resolution</h2>
            <p className="text-gray-600 leading-relaxed">
              Any disputes arising from these Terms or your use of the App shall be resolved through:
            </p>
            <ol className="list-decimal pl-6 text-gray-600 space-y-2">
              <li><strong>Informal Resolution:</strong> Contact us first to attempt to resolve the issue</li>
              <li><strong>Mediation:</strong> If informal resolution fails, the parties agree to mediation</li>
              <li><strong>Arbitration:</strong> As a last resort, binding arbitration may be pursued</li>
            </ol>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Severability</h2>
            <p className="text-gray-600 leading-relaxed">
              If any provision of these Terms is found to be unenforceable, the remaining provisions shall 
              continue in full force and effect.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">14. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <ul className="list-none pl-0 text-gray-600 space-y-2 mt-4">
              <li><strong>Email:</strong>{" "}
                <a href="mailto:aa.aashishjoshi13@gmail.com" className="text-teal-600 hover:underline">
                  aa.aashishjoshi13@gmail.com
                </a>
              </li>
            </ul>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-sm text-center">
                By using Calorie Calculator, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

