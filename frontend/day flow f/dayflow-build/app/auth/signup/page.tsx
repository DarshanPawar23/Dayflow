'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Waves, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Contains uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Contains number', pass: /\d/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const labels = ['', 'Weak', 'Fair', 'Strong'];
  const colors = ['', 'bg-[#8B3A2E]', 'bg-[#8B6A2E]', 'bg-[#4A5E40]'];
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < score ? colors[score] : 'bg-[rgba(200,189,176,0.4)]'}`} />
        ))}
      </div>
      <p className="text-xs text-[#857D77]">{password && labels[score]}</p>
    </div>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ employeeId: '', email: '', password: '', role: 'employee' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    router.push('/auth/verify');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-tonal">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-xl bg-[#2C2825] flex items-center justify-center">
            <Waves size={15} className="text-[#EBE3D5]" />
          </div>
          <span className="font-semibold text-[#2C2825]">DAYFLOW</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 space-y-5"
        >
          <div>
            <h1 className="text-2xl font-semibold text-[#2C2825]">Create account</h1>
            <p className="text-sm text-[#857D77] mt-1">Join your organization on DAYFLOW.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="employeeId" className="text-xs font-semibold text-[#2C2825]">Employee ID</label>
              <input id="employeeId" value={form.employeeId} onChange={(e) => handleChange('employeeId', e.target.value)}
                placeholder="DF-1001" required
                className="w-full px-4 py-3 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] placeholder-[#A89F96] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="text-xs font-semibold text-[#2C2825]">Work Email</label>
              <input id="signup-email" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)}
                placeholder="you@company.co" required autoComplete="email"
                className="w-full px-4 py-3 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] placeholder-[#A89F96] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-password" className="text-xs font-semibold text-[#2C2825]">Password</label>
              <div className="relative">
                <input id="signup-password" type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Create a secure password" required autoComplete="new-password"
                  className="w-full px-4 py-3 pr-11 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] placeholder-[#A89F96] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)] transition-all"
                />
                <button type="button" onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89F96] hover:text-[#857D77]"
                  aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && <PasswordStrength password={form.password} />}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="role" className="text-xs font-semibold text-[#2C2825]">Role</label>
              <select id="role" value={form.role} onChange={(e) => handleChange('role', e.target.value)}
                className="w-full px-4 py-3 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)] bg-transparent transition-all appearance-none"
              >
                <option value="employee">Employee</option>
                <option value="admin">HR / Admin</option>
              </select>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-start gap-2 text-sm text-[#8B3A2E] bg-[rgba(139,58,46,0.08)] border border-[rgba(139,58,46,0.2)] rounded-xl p-3">
                <AlertCircle size={15} className="shrink-0 mt-0.5" /> {error}
              </motion.div>
            )}

            <GlassButton variant="primary" size="lg" loading={loading} type="submit" className="w-full">
              {loading ? 'Creating account…' : 'Create account'}
            </GlassButton>
          </form>

          <p className="text-sm text-center text-[#857D77]">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-[#2C2825] font-medium hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
