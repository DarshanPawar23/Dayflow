'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, FileText } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { getPayroll } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import type { PayrollRecord } from '@/lib/types';

function SalaryRow({ label, amount, deduction }: { label: string; amount: number; deduction?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[rgba(200,189,176,0.2)] last:border-0">
      <span className="text-sm text-[#857D77]">{label}</span>
      <span className={`text-sm font-medium ${deduction ? 'text-[#8B3A2E]' : 'text-[#2C2825]'}`}>
        {deduction ? '−' : '+'}{formatCurrency(amount)}
      </span>
    </div>
  );
}

export default function PayrollPage() {
  const { user } = useAuth();
  const [payroll, setPayroll] = useState<PayrollRecord | null>(null);

  useEffect(() => {
    if (user) getPayroll(user.id).then(r => setPayroll(r[0] ?? null));
  }, [user]);

  const s = payroll?.salary;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-2xl mx-auto pb-24 md:pb-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-[#2C2825]">Payroll</h1>
        <p className="text-sm text-[#857D77] mt-1">Your compensation summary for August 2026.</p>
      </motion.div>

      {/* Hero salary card */}
      {s && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="bg-gradient-to-br from-[rgba(44,40,37,0.04)] to-transparent">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs font-semibold text-[#A89F96] uppercase tracking-wide">Net Take-Home</p>
                <p className="text-4xl font-semibold text-[#2C2825] mt-1">{formatCurrency(s.netSalary)}</p>
                <p className="text-sm text-[#857D77] mt-1">August 2026 · Processed</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[rgba(122,139,110,0.12)] flex items-center justify-center text-[#7A8B6E]">
                <DollarSign size={22} />
              </div>
            </div>

            <div className="space-y-0 mb-5">
              <p className="text-xs font-semibold text-[#A89F96] uppercase tracking-wide mb-3">Earnings</p>
              <SalaryRow label="Base Salary" amount={s.baseSalary} />
              <SalaryRow label="Housing Allowance (HRA)" amount={s.hra} />
              <SalaryRow label="Travel Allowance (TA)" amount={s.ta} />
              <SalaryRow label="Dearness Allowance (DA)" amount={s.da} />
            </div>

            <div className="space-y-0 mb-5">
              <p className="text-xs font-semibold text-[#A89F96] uppercase tracking-wide mb-3">Deductions</p>
              <SalaryRow label="Provident Fund (PF)" amount={s.pf} deduction />
              <SalaryRow label="Income Tax" amount={s.tax} deduction />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[rgba(200,189,176,0.35)]">
              <span className="font-semibold text-[#2C2825]">Net Salary</span>
              <span className="text-xl font-bold text-[#2C2825]">{formatCurrency(s.netSalary)}</span>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* View salary slip */}
      <GlassCard>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(235,227,213,0.7)] flex items-center justify-center text-[#857D77]">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-[#2C2825]">August 2026 Salary Slip</p>
              <p className="text-xs text-[#A89F96]">PDF · Available for download</p>
            </div>
          </div>
          <GlassButton variant="secondary" size="sm" icon={<FileText size={14} />}>View Slip</GlassButton>
        </div>
      </GlassCard>
    </div>
  );
}
