'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { KPICard } from '@/components/ui/KPICard';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import { getAdminKPIs, getLeaveRequests } from '@/lib/api';
import { mockDepartmentSummary, mockAttendanceTrend } from '@/lib/mock-data';
import { getGreeting, formatDate } from '@/lib/utils';
import type { LeaveRequest } from '@/lib/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [kpis, setKpis] = useState({ totalEmployees: 0, presentToday: 0, pendingLeaves: 0, attendanceIssues: 0 });
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    getAdminKPIs().then(setKpis);
    getLeaveRequests().then(r => setPendingLeaves(r.filter(l => l.status === 'pending').slice(0, 4)));
  }, []);

  const chartData = mockAttendanceTrend.slice(-14).map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Present: d.present,
    Absent: d.absent,
    Leave: d.leave,
  }));

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto pb-24 md:pb-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#2C2825]">{getGreeting(user?.name ?? 'Sarah')}</h1>
        <p className="text-sm text-[#857D77] mt-1">HR Command Center — here&apos;s your organization at a glance.</p>
      </motion.div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Employees" value={kpis.totalEmployees} icon={<Users size={18} />} accent="olive" delay={0.1} trend={{ value: 8, label: 'this quarter' }} />
        <KPICard label="Present Today" value={kpis.presentToday} icon={<Clock size={18} />} accent="sage" delay={0.15} />
        <KPICard label="Leave Requests" value={kpis.pendingLeaves} icon={<Calendar size={18} />} accent="clay" delay={0.2} />
        <KPICard label="Attendance Issues" value={kpis.attendanceIssues} icon={<AlertTriangle size={18} />} accent="clay" delay={0.25} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance chart */}
        <GlassCard className="lg:col-span-2">
          <h2 className="font-semibold text-[#2C2825] mb-5">14-Day Attendance Overview</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,189,176,0.3)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#A89F96' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#A89F96' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(253,250,245,0.95)', border: '1px solid rgba(200,189,176,0.4)', borderRadius: 12, fontSize: 12 }}
                cursor={{ fill: 'rgba(235,227,213,0.4)' }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Present" fill="#7A8B6E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Absent" fill="#C49080" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Leave" fill="#9DA8CC" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Dept summary */}
        <GlassCard>
          <h2 className="font-semibold text-[#2C2825] mb-4">Department Summary</h2>
          <div className="space-y-3">
            {mockDepartmentSummary.map(dept => (
              <div key={dept.department} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#2C2825]">{dept.department}</p>
                  <p className="text-xs text-[#A89F96]">{dept.headcount} people</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#4A5E40]">{dept.presentToday} present</p>
                  {dept.leaveCount > 0 && <p className="text-xs text-[#8B6A2E]">{dept.leaveCount} on leave</p>}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Pending leaves */}
      <GlassCard>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-[#2C2825]">Pending Approvals</h2>
          <a href="/admin/leave" className="text-xs text-[#7A8B6E] hover:underline">View all</a>
        </div>
        <div className="divide-y divide-[rgba(200,189,176,0.2)]">
          {pendingLeaves.length === 0 && <p className="text-sm text-[#A89F96] py-4 text-center">No pending requests.</p>}
          {pendingLeaves.map((l, i) => (
            <motion.div key={l.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <Avatar name={l.employeeName} size="sm" />
                <div>
                  <p className="text-sm font-medium text-[#2C2825]">{l.employeeName}</p>
                  <p className="text-xs text-[#A89F96] capitalize">{l.type} · {formatDate(l.startDate)} ({l.duration}d)</p>
                </div>
              </div>
              <StatusBadge status={l.status} size="sm" />
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
