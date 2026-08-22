'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getAttendance } from '@/lib/api';
import { formatTime } from '@/lib/utils';
import type { AttendanceRecord, AttendanceStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const statusColor: Record<AttendanceStatus, string> = {
  present:  'bg-[rgba(122,139,110,0.25)]',
  absent:   'bg-[rgba(139,58,46,0.18)]',
  'half-day':'bg-[rgba(192,148,80,0.22)]',
  leave:    'bg-[rgba(100,105,160,0.18)]',
  holiday:  'bg-[rgba(235,227,213,0.6)]',
  weekend:  'bg-[rgba(235,227,213,0.4)]',
};

export default function AttendancePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [selected, setSelected] = useState<AttendanceRecord | null>(null);
  const [view, setView] = useState<'weekly' | 'daily'>('weekly');
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    if (user) getAttendance(user.id).then(setRecords);
  }, [user]);

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const getRecord = (date: Date) =>
    records.find((r) => r.date === date.toISOString().split('T')[0]);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto pb-24 md:pb-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-[#2C2825]">Attendance</h1>
        <p className="text-sm text-[#857D77] mt-1">Track your daily check-in and check-out records.</p>
      </motion.div>

      {/* Summary row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Present', count: records.filter(r => r.status === 'present').length, color: 'text-[#4A5E40]' },
          { label: 'Absent', count: records.filter(r => r.status === 'absent').length, color: 'text-[#8B3A2E]' },
          { label: 'Half Day', count: records.filter(r => r.status === 'half-day').length, color: 'text-[#8B6A2E]' },
          { label: 'On Leave', count: records.filter(r => r.status === 'leave').length, color: 'text-[#4A4E80]' },
        ].map(({ label, count, color }) => (
          <GlassCard key={label} padding="sm" className="text-center">
            <p className={cn('text-2xl font-semibold', color)}>{count}</p>
            <p className="text-xs text-[#A89F96] mt-0.5">{label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Week navigation */}
      <GlassCard>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-[#2C2825]">Weekly View</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setWeekOffset(w => w - 1)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[rgba(235,227,213,0.7)] transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-[#857D77] min-w-[120px] text-center">
              {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <button onClick={() => setWeekOffset(w => w + 1)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[rgba(235,227,213,0.7)] transition-colors" disabled={weekOffset === 0}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, i) => {
            const record = getRecord(day);
            const isToday = day.toDateString() === today.toDateString();
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
            return (
              <motion.button
                key={i}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => record && setSelected(record)}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all cursor-pointer',
                  record ? statusColor[record.status] : isWeekend ? 'bg-[rgba(235,227,213,0.3)]' : 'bg-[rgba(235,227,213,0.5)]',
                  isToday && 'ring-2 ring-[#7A8B6E] ring-offset-1',
                  selected?.date === day.toISOString().split('T')[0] && 'ring-2 ring-[#2C2825]'
                )}
              >
                <span className="text-[10px] font-medium text-[#A89F96]">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className={cn('text-sm font-semibold', isToday ? 'text-[#2C2825]' : 'text-[#2C2825]')}>
                  {day.getDate()}
                </span>
                {record && record.status !== 'weekend' && (
                  <div className={cn('w-1.5 h-1.5 rounded-full', {
                    'bg-[#4A5E40]': record.status === 'present',
                    'bg-[#8B3A2E]': record.status === 'absent',
                    'bg-[#8B6A2E]': record.status === 'half-day',
                    'bg-[#4A4E80]': record.status === 'leave',
                  })} />
                )}
              </motion.button>
            );
          })}
        </div>
      </GlassCard>

      {/* Selected day detail */}
      {selected && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-[#2C2825]">
                  {new Date(selected.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
                <div className="flex items-center gap-3 mt-3">
                  {selected.checkIn && (
                    <div className="flex items-center gap-1.5 text-sm text-[#857D77]">
                      <Clock size={13} /> <span className="font-medium text-[#2C2825]">{formatTime(selected.checkIn)}</span> check-in
                    </div>
                  )}
                  {selected.checkOut && (
                    <div className="flex items-center gap-1.5 text-sm text-[#857D77]">
                      <Clock size={13} /> <span className="font-medium text-[#2C2825]">{formatTime(selected.checkOut)}</span> check-out
                    </div>
                  )}
                  {selected.hoursWorked && selected.hoursWorked > 0 && (
                    <span className="text-sm text-[#857D77]">· <span className="font-medium text-[#2C2825]">{selected.hoursWorked}h</span> worked</span>
                  )}
                </div>
              </div>
              <StatusBadge status={selected.status} />
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* All records */}
      <GlassCard padding="none">
        <div className="px-5 py-4 border-b border-[rgba(200,189,176,0.3)]">
          <h3 className="font-semibold text-[#2C2825]">Recent Records</h3>
        </div>
        <div className="divide-y divide-[rgba(200,189,176,0.2)]">
          {records.filter(r => !['weekend', 'holiday'].includes(r.status)).slice(0, 10).map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between px-5 py-3.5"
            >
              <div>
                <p className="text-sm font-medium text-[#2C2825]">
                  {new Date(r.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
                {r.checkIn && (
                  <p className="text-xs text-[#A89F96]">
                    {formatTime(r.checkIn)}{r.checkOut ? ` – ${formatTime(r.checkOut)}` : ' · ongoing'}
                    {r.hoursWorked && r.hoursWorked > 0 ? ` · ${r.hoursWorked}h` : ''}
                  </p>
                )}
              </div>
              <StatusBadge status={r.status} size="sm" />
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
