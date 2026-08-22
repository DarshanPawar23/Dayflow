'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, Calendar, DollarSign, User, Activity } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { KPICard } from '@/components/ui/KPICard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getAttendanceSummary, getLeaveBalance, getPayroll, getLeaveRequests } from '@/lib/api';
import { getGreeting, formatCurrency, formatDuration, formatTime } from '@/lib/utils';
import type { LeaveRequest } from '@/lib/types';
import Link from 'next/link';

type CheckState = 'idle' | 'checking-in' | 'in' | 'checking-out' | 'done';

function AttendanceClock() {
  const [state, setState] = useState<CheckState>('idle');
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state === 'in' && checkInTime) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - new Date(checkInTime).getTime()) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state, checkInTime]);

  const handleCheckIn = async () => {
    setState('checking-in');
    await new Promise((r) => setTimeout(r, 1200));
    const now = new Date().toISOString();
    setCheckInTime(now);
    setElapsed(0);
    setState('in');
  };

  const handleCheckOut = async () => {
    setState('checking-out');
    await new Promise((r) => setTimeout(r, 900));
    setState('done');
  };

  const progress = state === 'in' ? Math.min((elapsed / (9 * 3600)) * 100, 100) : state === 'done' ? 100 : 0;

  return (
    <GlassCard className="relative overflow-hidden" padding="lg">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(122,139,110,0.08)] to-transparent pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Circular progress ring */}
        <div className="relative w-36 h-36 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
            <circle cx="72" cy="72" r="62" fill="none" stroke="rgba(200,189,176,0.35)" strokeWidth="8" />
            <motion.circle
              cx="72" cy="72" r="62" fill="none"
              stroke={state === 'done' ? '#4A5E40' : '#7A8B6E'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 62}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 62 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 62 * (1 - progress / 100) }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {state === 'in' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <p className="text-xl font-semibold text-[#2C2825] tabular-nums">{formatDuration(elapsed)}</p>
                <p className="text-xs text-[#A89F96]">working</p>
              </motion.div>
            )}
            {state === 'idle' && <Clock size={32} className="text-[#A89F96]" />}
            {(state === 'checking-in' || state === 'checking-out') && (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Clock size={28} className="text-[#7A8B6E]" />
              </motion.div>
            )}
            {state === 'done' && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                <CheckCircle size={32} className="text-[#4A5E40]" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Info + Action */}
        <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
          <div>
            <h2 className="text-lg font-semibold text-[#2C2825]">Today&apos;s Attendance</h2>
            {checkInTime && state !== 'idle' && (
              <p className="text-sm text-[#857D77] mt-1">Checked in at {formatTime(checkInTime)}</p>
            )}
            {state === 'done' && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[#4A5E40] mt-1 flex items-center gap-1 justify-center md:justify-start">
                <CheckCircle size={14} /> Checked out · great work today!
              </motion.p>
            )}
          </div>

          <AnimatePresence mode="wait">
            {state === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GlassButton variant="primary" size="lg" onClick={handleCheckIn} icon={<Clock size={16} />}>
                  Check In
                </GlassButton>
              </motion.div>
            )}
            {state === 'checking-in' && (
              <motion.div key="ci" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GlassButton variant="primary" size="lg" loading>Checking in…</GlassButton>
              </motion.div>
            )}
            {state === 'in' && (
              <motion.div key="in" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GlassButton variant="danger" size="lg" onClick={handleCheckOut}>Check Out</GlassButton>
              </motion.div>
            )}
            {state === 'checking-out' && (
              <motion.div key="co" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GlassButton variant="danger" size="lg" loading>Checking out…</GlassButton>
              </motion.div>
            )}
            {state === 'done' && (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <StatusBadge status="present" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GlassCard>
  );
}

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ present: 0, absent: 0, halfDay: 0, leave: 0, totalDays: 0 });
  const [balance, setBalance] = useState<{ annual: { remaining: number }; sick: { remaining: number } } | null>(null);
  const [net, setNet] = useState(0);
  const [recentLeaves, setRecentLeaves] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    if (!user) return;
    getAttendanceSummary(user.id).then(setSummary);
    getLeaveBalance(user.id).then(setBalance);
    getPayroll(user.id).then((p) => { if (p[0]) setNet(p[0].salary.netSalary); });
    getLeaveRequests(user.id).then((r) => setRecentLeaves(r.slice(0, 3)));
  }, [user]);

  if (!user) return null;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto pb-24 md:pb-8">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#2C2825]">{getGreeting(user.name)}</h1>
        <p className="text-sm text-[#857D77] mt-1">Here&apos;s your overview for today.</p>
      </motion.div>

      {/* Hero attendance card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <AttendanceClock />
      </motion.div>

      {/* KPI summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          label="Days Present" value={summary.present}
          icon={<Clock size={18} />} accent="olive" delay={0.15}
        />
        <KPICard
          label="Leave Remaining" value={balance?.annual.remaining ?? '—'}
          icon={<Calendar size={18} />} accent="sage" delay={0.2}
        />
        <KPICard
          label="Net Salary" value={formatCurrency(net)}
          icon={<DollarSign size={18} />} accent="clay" delay={0.25}
        />
        <KPICard
          label="Days Absent" value={summary.absent}
          icon={<User size={18} />} accent="clay" delay={0.3}
        />
      </div>

      {/* Recent leaves + quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#2C2825]">Recent Leave Requests</h3>
            <Link href="/leave" className="text-xs text-[#7A8B6E] hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentLeaves.length === 0 && <p className="text-sm text-[#A89F96]">No recent requests.</p>}
            {recentLeaves.map((l) => (
              <div key={l.id} className="flex items-center justify-between py-2 border-b border-[rgba(200,189,176,0.25)] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#2C2825] capitalize">{l.type} leave</p>
                  <p className="text-xs text-[#A89F96]">{l.startDate} · {l.duration}d</p>
                </div>
                <StatusBadge status={l.status} size="sm" />
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick links */}
        <GlassCard>
          <h3 className="font-semibold text-[#2C2825] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'My Profile', href: '/profile', icon: <User size={18} /> },
              { label: 'Request Leave', href: '/leave', icon: <Calendar size={18} /> },
              { label: 'Attendance Log', href: '/attendance', icon: <Clock size={18} /> },
              { label: 'View Payslip', href: '/payroll', icon: <DollarSign size={18} /> },
            ].map(({ label, href, icon }) => (
              <Link key={href} href={href}>
                <motion.div
                  whileHover={{ y: -1, boxShadow: '0 6px 24px rgba(44,40,37,0.1)' }}
                  className="flex flex-col items-center gap-2 p-4 glass-dark rounded-xl cursor-pointer transition-all"
                >
                  <span className="text-[#857D77]">{icon}</span>
                  <span className="text-xs font-medium text-[#2C2825] text-center">{label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
