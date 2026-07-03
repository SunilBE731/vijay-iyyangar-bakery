'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg('');

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        // Store JWT token
        localStorage.setItem('admin_token', data.token);
        router.push('/admin/dashboard');
      } else {
        setErrorMsg(data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to connect to authentication server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream/10 dark:bg-dark-cocoa/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-warm-brown/10 rounded-3xl border border-warm-brown/5 shadow-2xl p-8 relative overflow-hidden space-y-6">
        
        {/* Background circular overlay */}
        <div className="absolute -left-16 -top-16 h-36 w-36 rounded-full bg-gold/5 pointer-events-none" />

        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-warm-brown/60 hover:text-gold dark:text-cream/60 dark:hover:text-gold transition-colors">
          <ArrowLeft size={12} /> Back to Bakery
        </Link>

        {/* Brand Logo header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Logo size="md" />
          <div>
            <h2 className="text-xl font-serif font-bold text-warm-brown dark:text-cream">
              Administrative Portal
            </h2>
            <p className="text-[10px] text-gold font-sans font-bold tracking-widest uppercase mt-1">
              Secure Sign In Required
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-sans font-semibold border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* Email field */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-warm-brown/40 dark:text-cream/40">
              <Mail size={18} />
            </span>
            <input
              type="email"
              required
              placeholder="Admin Email (admin@vijayiyengar.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-cream/35 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-sm focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
            />
          </div>

          {/* Password field */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-warm-brown/40 dark:text-cream/40">
              <Lock size={18} />
            </span>
            <input
              type="password"
              required
              placeholder="Admin Password (admin123)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-cream/35 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-sm focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-warm-brown hover:bg-gold text-white font-sans font-semibold rounded-full flex items-center justify-center gap-2 transition-all shadow-md uppercase tracking-wider text-xs"
          >
            {loading ? 'Authenticating Session...' : 'Sign In to Dashboard'}
            <ShieldCheck size={16} />
          </button>
        </form>

        <p className="text-[10px] text-center text-warm-brown/50 dark:text-cream/50">
          Demo Access: <span className="font-bold">admin@vijayiyengar.com</span> / Password: <span className="font-bold">admin123</span>
        </p>

      </div>
    </div>
  );
}
