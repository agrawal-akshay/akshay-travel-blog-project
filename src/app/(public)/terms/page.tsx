import React from 'react';
import { Scale, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Travilever',
  description: 'Understand the terms and rules governing your use of the Travilever platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 md:p-12 shadow-xl">
          
          {/* Header */}
          <div className="border-b border-gray-100 dark:border-zinc-800 pb-8 mb-8 text-center md:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-4">
              <Scale className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-3">
              Terms of Service
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last Updated: July 3, 2026 • 6 min read
            </p>
          </div>

          {/* Intro */}
          <div className="prose prose-amber dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
            <p className="lead text-lg font-medium text-gray-700 dark:text-gray-200 leading-relaxed">
              Welcome to Travilever. By accessing or using our website, guides, or newsletters, you agree to comply with and be bound by the following Terms of Service. If you do not agree, please do not use our services.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4 border-l-4 border-amber-500 pl-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By visiting Travilever, you agree to these Terms of Service, all applicable laws, and regulations. You are responsible for compliance with any local laws that apply to your geographic region.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4 border-l-4 border-amber-500 pl-3">
              2. Intellectual Property Rights
            </h2>
            <p>
              All content on Travilever—including but not limited to articles, photography, logo designs, custom code, layouts, and graphics—is the intellectual property of Travilever and is protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              You may read and print articles for personal, non-commercial use only. You must not copy, reproduce, republish, distribute, or monetize our content without explicit, written permission.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4 border-l-4 border-amber-500 pl-3">
              3. User Conduct & Accounts
            </h2>
            <p>
              If you register an account, publish comments, or submit messages on Travilever, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information.</li>
              <li>Keep your login credentials secure.</li>
              <li>Refrain from posting unlawful, threatening, abusive, defamatory, or obscene messages.</li>
              <li>Refrain from using spam bots, web scrapers, or other automated means to access our site.</li>
            </ul>

            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4 border-l-4 border-amber-500 pl-3">
              4. Disclaimer of Warranties
            </h2>
            <p>
              Our guides are provided on an "as is" and "as available" basis. While we strive to provide the most accurate, up-to-date travel information, we do not guarantee the completeness, accuracy, safety, or reliability of any advice, itinerary, or recommendation.
            </p>
            <div className="flex gap-3 bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/20 text-sm my-4 text-amber-800 dark:text-amber-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>
                <strong>Travel Warning:</strong> Schedules, booking rates, visa rules, and safety conditions can change rapidly. Always cross-reference crucial travel information with official government registries and local service providers before taking action.
              </p>
            </div>

            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4 border-l-4 border-amber-500 pl-3">
              5. Limitation of Liability
            </h2>
            <p>
              In no event shall Travilever, its founders, or contributors be held liable for any damages (including, without limitation, damages for loss of data, travel delays, accident, injury, or financial loss) arising out of the use or inability to use our guides, services, or recommended third-party links.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4 border-l-4 border-amber-500 pl-3">
              6. External Links & Affiliates
            </h2>
            <p>
              Travilever has not reviewed all of the sites linked to its Internet website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Travilever. Use of any such linked website is at the user's own risk.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4 border-l-4 border-amber-500 pl-3">
              7. Governing Law
            </h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. You irrevocably submit to the exclusive jurisdiction of the courts in that State.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4 border-l-4 border-amber-500 pl-3">
              8. Contact
            </h2>
            <p>
              For legal inquiries or clarifications regarding these terms, please contact:
            </p>
            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/20 mt-4">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">Travilever Legal Operations</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email: legal@travilever.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
