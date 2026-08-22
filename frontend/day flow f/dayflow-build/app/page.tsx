'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Waves, ArrowRight, Users, Clock, BarChart3, Shield } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassCard } from '@/components/ui/GlassCard';

const features = [
  { icon: <Users size={22} />, title: 'People Management', desc: 'Unified employee directory, roles, and org structure.' },
  { icon: <Clock size={22} />, title: 'Attendance Tracking', desc: 'Real-time check-in, calendars, and daily summaries.' },
  { icon: <BarChart3 size={22} />, title: 'Analytics & Reports', desc: 'Visual trends across payroll, attendance, and leaves.' },
  { icon: <Shield size={22} />, title: 'Leave Management', desc: 'Submit, review, and approve time-off requests.' },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-tonal flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 glass border-b border-[rgba(200,189,176,0.3)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#2C2825] flex items-center justify-center">
            <Waves size={15} className="text-[#EBE3D5]" />
          </div>
          <span className="font-semibold text-[#2C2825] tracking-tight">DAYFLOW</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/signin">
            <GlassButton variant="ghost" size="sm">Sign In</GlassButton>
          </Link>
          <Link href="/auth/signup">
            <GlassButton variant="primary" size="sm">Get Started <ArrowRight size={14} /></GlassButton>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center gap-6 relative overflow-hidden">
        {/* Background shape */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[rgba(122,139,110,0.07)] blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[rgba(160,112,96,0.06)] blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="relative"
        >
          <span className="inline-block text-xs font-semibold text-[#7A8B6E] border border-[rgba(122,139,110,0.3)] bg-[rgba(122,139,110,0.08)] px-3 py-1 rounded-full mb-5">
            Human Resource Management
          </span>
          <h1 className="text-4xl md:text-6xl font-semibold text-[#2C2825] leading-tight tracking-tight max-w-3xl">
            The HRMS built for
            <br />
            <span className="text-[#7A8B6E]">thoughtful organizations</span>
          </h1>
          <p className="mt-6 text-lg text-[#857D77] max-w-xl mx-auto leading-relaxed">
            Attendance, leave, payroll, and people — managed with clarity and calm. No clutter, no noise.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3 flex-wrap justify-center"
        >
          <Link href="/auth/signin">
            <GlassButton variant="primary" size="lg">
              Sign in to DAYFLOW <ArrowRight size={16} />
            </GlassButton>
          </Link>
          <Link href="/auth/signup">
            <GlassButton variant="secondary" size="lg">Create account</GlassButton>
          </Link>
        </motion.div>

        {/* Demo credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl px-6 py-4 text-sm text-[#857D77] max-w-sm mt-2"
        >
          <p className="font-medium text-[#2C2825] mb-2">Demo accounts</p>
          <div className="space-y-1 text-xs">
            <p><span className="font-medium">Employee:</span> alex.morgan@dayflow.co / any password</p>
            <p><span className="font-medium">Admin:</span> sarah.johnson@dayflow.co / any password</p>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 py-16 bg-tonal-warm">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-semibold text-[#2C2825] mb-10 text-center"
          >
            Everything your team needs
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <GlassCard className="h-full">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(235,227,213,0.8)] flex items-center justify-center text-[#7A8B6E] mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-[#2C2825] mb-1.5">{f.title}</h3>
                  <p className="text-sm text-[#857D77] leading-relaxed">{f.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-[rgba(200,189,176,0.3)] text-center text-xs text-[#A89F96]">
        © 2026 DAYFLOW. A thoughtfully designed HRMS.
      </footer>
    </main>
  );
}
