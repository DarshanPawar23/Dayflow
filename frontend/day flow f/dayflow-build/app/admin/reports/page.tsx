'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { BarChart3, TrendingUp, FileText, Download } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { getAttendanceTrend, getLeaveTrend, getPayrollOverview } from '@/lib/api';
import type { AttendanceTrend, LeaveTrend, PayrollOverview } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';

type Range = '7D' | '30D' | '90D';

function AnimatedChartCard({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay, duration: 0.5 }}>
      <GlassCard>
        <h3 className="font-semibold text-[#2C2825] mb-5">{title}</h3>
        {children}
      </GlassCard>
    </motion.div>
  );
}

const tooltipStyle = {
  contentStyle: {
    background: 'rgba(253,250,245,0.96)',
    border: '1px solid rgba(200,189,176,0.4)',
    borderRadius: 12,
    fontSize: 12,
    boxShadow: '0 4px 24px rgba(44,40,37,0.1)',
  },
  cursor: { stroke: 'rgba(200,189,176,0.5)' },
};

export default function ReportsPage() {
  const [range, setRange] = useState<Range>('30D');
  const [attendanceTrend, setAttendanceTrend] = useState<AttendanceTrend[]>([]);
  const [leaveTrend, setLeaveTrend] = useState<LeaveTrend[]>([]);
  const [payrollOverview, setPayrollOverview] = useState<PayrollOverview[]>([]);

  useEffect(() => {
    const days = range === '7D' ? 7 : range === '30D' ? 30 : 90;
    getAttendanceTrend(days).then(setAttendanceTrend);
    getLeaveTrend().then(setLeaveTrend);
    getPayrollOverview().then(setPayrollOverview);
  }, [range]);

  const attChartData = attendanceTrend.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Present: d.present,
    Absent: d.absent,
    Leave: d.leave,
  }));

  const payChartData = payrollOverview.map(p => ({
    month: p.month,
    'Total Payroll': p.totalPayroll / 1000, // in thousands
    Headcount: p.employeeCount,
  }));

  const reportCards = [
    { title: 'Attendance Report', desc: 'Monthly attendance summary for all employees', icon: <BarChart3 size={20} /> },
    { title: 'Salary Slip', desc: 'Generate individual salary slips for any month', icon: <FileText size={20} /> },
    { title: 'Payroll Report', desc: 'Full payroll breakdown with deductions summary', icon: <TrendingUp size={20} /> },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto pb-24 md:pb-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#2C2825]">Reports &amp; Analytics</h1>
          <p className="text-sm text-[#857D77] mt-1">Data-driven insights across your organization.</p>
        </div>
        {/* Range selector */}
        <div className="flex items-center gap-1 p-1 bg-[rgba(235,227,213,0.5)] rounded-xl border border-[rgba(200,189,176,0.3)]">
          {(['7D', '30D', '90D'] as Range[]).map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-all ${range === r
                ? 'bg-[#2C2825] text-[#FDFAF5]'
                : 'text-[#857D77] hover:text-[#2C2825]'
              }`}>
              {r}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance trend */}
        <AnimatedChartCard title="Attendance Trend" delay={0}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={attChartData} margin={{ left: -24, right: 0, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="gradPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7A8B6E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7A8B6E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradAbsent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C49080" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#C49080" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,189,176,0.3)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#A89F96' }} tickLine={false} interval={range === '7D' ? 0 : range === '30D' ? 4 : 13} />
              <YAxis tick={{ fontSize: 10, fill: '#A89F96' }} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="Present" stroke="#7A8B6E" strokeWidth={2} fill="url(#gradPresent)" dot={false} />
              <Area type="monotone" dataKey="Absent" stroke="#C49080" strokeWidth={2} fill="url(#gradAbsent)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </AnimatedChartCard>

        {/* Leave trend */}
        <AnimatedChartCard title="Leave Trend by Type" delay={0.1}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={leaveTrend} margin={{ left: -24, right: 0, top: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,189,176,0.3)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#A89F96' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#A89F96' }} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="annual" fill="#7A8B6E" radius={[4, 4, 0, 0]} name="Annual" />
              <Bar dataKey="sick" fill="#C49080" radius={[4, 4, 0, 0]} name="Sick" />
              <Bar dataKey="personal" fill="#9DA8CC" radius={[4, 4, 0, 0]} name="Personal" />
            </BarChart>
          </ResponsiveContainer>
        </AnimatedChartCard>

        {/* Payroll overview */}
        <AnimatedChartCard title="Payroll Overview (in $K)" delay={0.15}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={payChartData} margin={{ left: -16, right: 0, top: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,189,176,0.3)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#A89F96' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#A89F96' }} tickLine={false} axisLine={false} />
              <Tooltip
                {...tooltipStyle}
                formatter={(v: number) => [`$${v.toFixed(0)}K`, 'Total Payroll']}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="Total Payroll" stroke="#7A8B6E" strokeWidth={2.5} dot={{ fill: '#7A8B6E', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </AnimatedChartCard>

        {/* Dept summary */}
        <AnimatedChartCard title="Monthly Summary" delay={0.2}>
          <div className="space-y-3">
            {[
              { label: 'Avg. Attendance Rate', value: '87%', color: 'bg-[#7A8B6E]', pct: 87 },
              { label: 'Leave Utilization', value: '34%', color: 'bg-[#9DA8CC]', pct: 34 },
              { label: 'On-time Check-ins', value: '73%', color: 'bg-[#C49080]', pct: 73 },
            ].map(({ label, value, color, pct }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-[#857D77]">{label}</span>
                  <span className="text-sm font-semibold text-[#2C2825]">{value}</span>
                </div>
                <div className="h-1.5 bg-[rgba(200,189,176,0.3)] rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AnimatedChartCard>
      </div>

      {/* Report cards */}
      <div>
        <h2 className="font-semibold text-[#2C2825] mb-4">Generate Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(235,227,213,0.7)] flex items-center justify-center text-[#7A8B6E] shrink-0">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#2C2825]">{card.title}</h3>
                    <p className="text-xs text-[#857D77] mt-0.5 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <GlassButton variant="secondary" size="sm" className="flex-1">View</GlassButton>
                  <GlassButton variant="primary" size="sm" icon={<Download size={13} />}>Generate</GlassButton>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
