"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Globe, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (isRegister) {
      // Register logic
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: 'user', // Directly register as public user
          }),
        });
        const data = await res.json();
        if (data.success) {
          setSuccess('Account created successfully! You can now log in.');
          setIsRegister(false);
          setFormData(prev => ({ ...prev, password: '' }));
        } else {
          setError(data.error || 'Failed to register.');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred. Please try again.');
      }
    } else {
      // Login logic
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('user', JSON.stringify(data.user));
          window.dispatchEvent(new Event('auth-change'));
          setSuccess('Logged in successfully!');
          router.push('/');
        } else {
          setError(data.error || 'Invalid credentials.');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-28">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4 text-blue-600 dark:text-blue-400">
          <Globe className="w-10 h-10 animate-pulse" />
        </div>
        <h2 className="text-3xl font-serif font-extrabold text-gray-900 dark:text-white">
          {isRegister ? 'Create your account' : 'Sign in to Travilever'}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {isRegister ? 'Join our global community of adventurers' : 'Welcome back! Explore the world with us'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-8 px-4 shadow-xl border border-gray-100 dark:border-zinc-800 sm:rounded-2xl sm:px-10">
          
          {error && (
            <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium border border-green-100 dark:border-green-900/30">
              {success}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {isRegister && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Full Name / Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    name="username"
                    required={isRegister}
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-4 rounded-lg font-bold transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-800 cursor-pointer"
              >
                {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-gray-100 dark:border-zinc-800 pt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setSuccess('');
              }}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
