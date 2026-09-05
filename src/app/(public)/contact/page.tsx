"use client";

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      alert('All fields are required');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSent(true);
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
      } else {
        alert('Failed to send message');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 min-h-screen max-w-6xl font-sans">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">
          Get in Touch
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Have a question, partnership proposal, or just want to say hi? We would love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
        
        {/* Contact Information */}
        <div className="bg-gray-50 dark:bg-zinc-950 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Contact Information</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Email Us</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">hello@travilever.com</p>
                <p className="text-gray-600 dark:text-gray-400">partnerships@travilever.com</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Office Location</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Sector X,Rohini<br/>Delhi, India - 282002</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Call Us</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">+91 xxxxxxxxxx</p>
                <p className="text-sm text-gray-500 mt-1">Mon-Fri from 9am to 6pm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          {sent ? (
            <div className="text-center space-y-4 py-8 animate-in fade-in zoom-in-95 duration-300">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">Thank you!</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">Your message was successfully received. Our support team will get in touch with you shortly.</p>
              <button 
                onClick={() => setSent(false)} 
                className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                  <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                  <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="Doe" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="john@example.com" required />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Message</label>
                <textarea id="message" value={formData.message} onChange={handleChange} rows={5} className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none" placeholder="How can we help you?" required></textarea>
              </div>

              <button type="submit" disabled={sending} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 text-white font-medium py-4 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer">
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}