import React from 'react';
import { Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Travilever',
  description: 'Learn how Travilever collects, uses, and protects your personal data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 md:p-12 shadow-xl">
          
          {/* Header */}
          <div className="border-b border-gray-100 dark:border-zinc-800 pb-8 mb-8 text-center md:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-3">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last Updated: July 3, 2026 • 5 min read
            </p>
          </div>

          {/* Intro */}
          <div className="prose prose-blue dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
            <p className="lead text-lg font-medium text-gray-700 dark:text-gray-200 leading-relaxed">
              At Travilever, we value your trust and are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information when you visit our website, subscribe to our newsletters, or use our services.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4 border-l-4 border-blue-600 pl-3">
              1. Information We Collect
            </h2>
            <p>
              We collect information to provide better services to all our users. The types of information we collect include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Personal Data:</strong> Email address, username, or contact information when you register, subscribe to our newsletter, or submit a message.
              </li>
              <li>
                <strong>Usage Information:</strong> Data about how you interact with our website, such as page visits, clicks, time spent on pages, and referring sites.
              </li>
              <li>
                <strong>Device Data:</strong> IP address, browser type, operating system, and cookie data.
              </li>
            </ul>

            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4 border-l-4 border-blue-600 pl-3">
              2. How We Use Your Information
            </h2>
            <p>
              We use the collected information for various purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide, maintain, and improve our travel guides and platform features.</li>
              <li>To send you newsletters, updates, and other travel-related content (you can opt out at any time).</li>
              <li>To analyze site usage and improve visitor experience.</li>
              <li>To respond to user messages, comments, and inquiries.</li>
              <li>To detect, prevent, and address security or technical issues.</li>
            </ul>

            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4 border-l-4 border-blue-600 pl-3">
              3. Cookies and Tracking Technologies
            </h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4 border-l-4 border-blue-600 pl-3">
              4. Data Protection & Security
            </h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4 border-l-4 border-blue-600 pl-3">
              5. Third-Party Services & Links
            </h2>
            <p>
              Our guides contain links to external sites that are not operated by us (e.g. hotel booking platforms, gear stores). If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
            </p>
            <p>
              We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
            </p>

            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4 border-l-4 border-blue-600 pl-3">
              6. Your Data Rights (GDPR & CCPA)
            </h2>
            <p>
              Depending on your location, you may have rights regarding your personal data, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The right to access, update, or delete the information we have on you.</li>
              <li>The right of rectification (correcting inaccurate information).</li>
              <li>The right to object to or restrict processing of your data.</li>
              <li>The right to withdraw consent.</li>
            </ul>

            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4 border-l-4 border-blue-600 pl-3">
              7. Contact Us
            </h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please reach out to us:
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/20 mt-4">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">Travilever Privacy Operations</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email: privacy@travilever.com</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Address: 121 Exploration Way, San Francisco, CA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
