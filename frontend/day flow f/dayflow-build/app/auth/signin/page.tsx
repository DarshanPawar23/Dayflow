'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Waves, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { GlassButton } from '@/components/ui/GlassButton';

export default function SignInPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (!user) { setError('No account found with that email. Try a demo account.'); return; }
      router.push(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex flex-col justify-between w-[44%] bg-tonal-stone p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 -left-20 w-64 h-64 rounded-full bg-[rgba(122,139,110,0.12)] blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-56 h-56 rounded-full bg-[rgba(160,112,96,0.1)] blur-3xl" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#2C2825] flex items-center justify-center">
            <Waves size={16} className="text-[#EBE3D5]" />
          </div>
          <span className="font-semibold text-[#2C2825] text-lg tracking-tight">DAYFLOW</span>
        </div>
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-semibold text-[#2C2825] leading-tight"
          >
            Welcome back.
          </motion.h2>
          <p className="mt-3 text-[#857D77] leading-relaxed">
            Your workspace is ready.<br />Sign in to continue where you left off.
          </p>
          <div className="mt-10 glass rounded-2xl p-5 space-y-2 text-sm text-[#857D77]">
            <p className="text-xs font-semibold text-[#2C2825] mb-2">Demo accounts</p>
            <p><span className="font-medium">Employee:</span> alex.morgan@dayflow.co</p>
            <p><span className="font-medium">Admin:</span> sarah.johnson@dayflow.co</p>
            <p className="text-xs text-[#A89F96]">Any password works.</p>
          </div>
        </div>
        <p className="text-xs text-[#A89F96]">© 2026 DAYFLOW</p>
      </motion.div>

      {/* Right form panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center px-6 py-12 bg-tonal"
      >
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-[#2C2825] flex items-center justify-center">
              <Waves size={15} className="text-[#EBE3D5]" />
            </div>
            <span className="font-semibold text-[#2C2825]">DAYFLOW</span>
          </div>

          <h1 className="text-2xl font-semibold text-[#2C2825] mb-1">Sign in</h1>
          <p className="text-sm text-[#857D77] mb-8">Enter your credentials to access your workspace.</p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-[#2C2825]">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@dayflow.co"
                required
                autoComplete="email"
                className="w-full px-4 py-3 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] placeholder-[#A89F96] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)] transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-[#2C2825]">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] placeholder-[#A89F96] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89F96] hover:text-[#857D77]"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 text-sm text-[#8B3A2E] bg-[rgba(139,58,46,0.08)] border border-[rgba(139,58,46,0.2)] rounded-xl p-3"
              >
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}

            <GlassButton variant="primary" size="lg" loading={loading} type="submit" className="w-full">
              {loading ? 'Signing in…' : 'Sign in'}
            </GlassButton>
          </form>

          <p className="mt-6 text-sm text-center text-[#857D77]">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-[#2C2825] font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
