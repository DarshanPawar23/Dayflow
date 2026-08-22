'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SearchBar } from '@/components/ui/SearchBar';
import { Avatar } from '@/components/ui/Avatar';
import { getAllAttendance, getEmployees } from '@/lib/api';
import { formatTime } from '@/lib/utils';
import type { Employee, AttendanceRecord, AttendanceStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS: AttendanceStatus[] = ['present', 'absent', 'half-day', 'leave', 'holiday'];

export default function AdminAttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'all'>('all');
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    getEmployees().then(setEmployees);
    getAllAttendance().then(setRecords);
  }, []);

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);
  const weekDays = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const getRecord = (empId: string, date: Date) =>
    records.find(r => r.employeeId === empId && r.date === date.toISOString().split('T')[0]);

  const filteredEmployees = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (statusFilter === 'all') return true;
    const todayRecord = getRecord(e.id, today);
    return todayRecord?.status === statusFilter;
  });

  // Summary stats for today
  const todayStr = today.toISOString().split('T')[0];
  const todayRecords = records.filter(r => r.date === todayStr);
  const stats = {
    present: todayRecords.filter(r => r.status === 'present').length,
    absent: todayRecords.filter(r => r.status === 'absent').length,
    leave: todayRecords.filter(r => r.status === 'leave').length,
    halfDay: todayRecords.filter(r => r.status === 'half-day').length,
  };

  const statusDotColor: Record<string, string> = {
    present: 'bg-[#4A5E40]',
    absent: 'bg-[#8B3A2E]',
    'half-day': 'bg-[#8B6A2E]',
    leave: 'bg-[#4A4E80]',
    holiday: 'bg-[#857D77]',
    weekend: 'bg-[rgba(200,189,176,0.4)]',
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto pb-24 md:pb-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-[#2C2825]">Attendance Management</h1>
        <p className="text-sm text-[#857D77] mt-1">Monitor and manage team attendance across all departments.</p>
      </motion.div>

      {/* Today summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Present', count: stats.present, color: 'text-[#4A5E40]' },
          { label: 'Absent', count: stats.absent, color: 'text-[#8B3A2E]' },
          { label: 'On Leave', count: stats.leave, color: 'text-[#4A4E80]' },
          { label: 'Half Day', count: stats.halfDay, color: 'text-[#8B6A2E]' },
        ].map(({ label, count, color }) => (
          <GlassCard key={label} padding="sm" className="text-center">
            <p className={cn('text-2xl font-semibold', color)}>{count}</p>
            <p className="text-xs text-[#A89F96] mt-0.5">{label} Today</p>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <GlassCard padding="sm" className="flex flex-wrap gap-3 items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search employees…" className="flex-1 min-w-48" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as AttendanceStatus | 'all')}
          className="px-3 py-2 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)] bg-transparent capitalize">
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
        {/* Week nav */}
        <div className="flex items-center gap-1 ml-auto">
          <button onClick={() => setWeekOffset(w => w - 1)}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[rgba(235,227,213,0.7)] transition-colors text-[#857D77]">
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-[#857D77] min-w-[120px] text-center">
            {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
            {weekDays[4].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <button onClick={() => setWeekOffset(w => w + 1)} disabled={weekOffset === 0}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[rgba(235,227,213,0.7)] transition-colors text-[#857D77] disabled:opacity-40">
            <ChevronRight size={16} />
          </button>
        </div>
      </GlassCard>

      {/* Attendance matrix */}
      <GlassCard padding="none" className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-[rgba(200,189,176,0.35)]">
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#A89F96] uppercase tracking-wide w-48">Employee</th>
              {weekDays.map(d => (
                <th key={d.toISOString()} className="px-3 py-3 text-xs font-semibold text-[#A89F96] uppercase tracking-wide text-center">
                  <div>{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="font-normal text-[#C8BDB0]">{d.getDate()}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp, i) => (
              <motion.tr
                key={emp.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-[rgba(200,189,176,0.15)] hover:bg-[rgba(235,227,213,0.3)] transition-colors"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={emp.name} size="xs" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#2C2825] truncate">{emp.name}</p>
                      <p className="text-xs text-[#A89F96] truncate">{emp.department}</p>
                    </div>
                  </div>
                </td>
                {weekDays.map(d => {
                  const rec = getRecord(emp.id, d);
                  return (
                    <td key={d.toISOString()} className="px-3 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className={cn('w-2.5 h-2.5 rounded-full mx-auto',
                          rec ? statusDotColor[rec.status] : 'bg-[rgba(200,189,176,0.3)]'
                        )} />
                        {rec && rec.checkIn && (
                          <span className="text-[10px] text-[#A89F96]">{formatTime(rec.checkIn)}</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </motion.tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={weekDays.length + 1} className="text-center py-10 text-sm text-[#A89F96]">
                  No employees match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Legend */}
        <div className="flex items-center gap-4 px-5 py-3 border-t border-[rgba(200,189,176,0.25)] flex-wrap">
          <span className="text-xs text-[#A89F96] font-semibold">Legend:</span>
          {[
            { label: 'Present', color: 'bg-[#4A5E40]' },
            { label: 'Absent', color: 'bg-[#8B3A2E]' },
            { label: 'Half Day', color: 'bg-[#8B6A2E]' },
            { label: 'Leave', color: 'bg-[#4A4E80]' },
            { label: 'No Record', color: 'bg-[rgba(200,189,176,0.3)]' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={cn('w-2.5 h-2.5 rounded-full', color)} />
              <span className="text-xs text-[#857D77]">{label}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
