'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Users, FileText, Edit2, Save, X } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SearchBar } from '@/components/ui/SearchBar';
import { Avatar } from '@/components/ui/Avatar';
import { DataTable } from '@/components/ui/DataTable';
import { getPayroll, getPayrollKPIs } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import type { PayrollRecord } from '@/lib/types';

const MONTHS = [
  '2026-08', '2026-07', '2026-06', '2026-05',
];

interface SalaryEditorProps {
  record: PayrollRecord;
  onClose: () => void;
  onSave: (updated: PayrollRecord) => void;
}

function SalaryEditor({ record, onClose, onSave }: SalaryEditorProps) {
  const [base, setBase] = useState(record.salary.baseSalary);
  const [hra, setHra] = useState(record.salary.hra);
  const [ta, setTa] = useState(record.salary.ta);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const net = base + hra + ta + record.salary.da - record.salary.pf - record.salary.tax;

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    onSave({ ...record, salary: { ...record.salary, baseSalary: base, hra, ta, netSalary: net } });
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass rounded-2xl p-5 space-y-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar name={record.employeeName} size="sm" />
          <div>
            <p className="text-sm font-semibold text-[#2C2825]">{record.employeeName}</p>
            <p className="text-xs text-[#A89F96]">{record.department}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[rgba(235,227,213,0.7)] text-[#857D77]">
          <X size={15} />
        </button>
      </div>

      <div className="space-y-3">
        {[
          { label: 'Base Salary', value: base, setter: setBase },
          { label: 'HRA', value: hra, setter: setHra },
          { label: 'Travel Allowance', value: ta, setter: setTa },
        ].map(({ label, value, setter }) => (
          <div key={label} className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A89F96]">{label}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#A89F96]">$</span>
              <input type="number" value={value} onChange={e => setter(Number(e.target.value))}
                className="w-full pl-7 pr-4 py-2.5 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)]" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[rgba(235,227,213,0.5)] rounded-xl p-3 flex items-center justify-between">
        <span className="text-sm font-medium text-[#857D77]">Net Salary Preview</span>
        <span className="text-base font-bold text-[#2C2825]">{formatCurrency(net)}</span>
      </div>

      {saved && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[#4A5E40] text-center">
          ✓ Salary updated successfully
        </motion.p>
      )}

      <GlassButton variant="primary" size="md" className="w-full" loading={saving} onClick={handleSave} icon={<Save size={14} />}>
        {saving ? 'Saving…' : 'Save Changes'}
      </GlassButton>
    </motion.div>
  );
}

export default function AdminPayrollPage() {
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [kpis, setKpis] = useState({ totalPayroll: 0, employeeCount: 0, processed: 0, pending: 0 });
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('2026-08');
  const [editing, setEditing] = useState<PayrollRecord | null>(null);

  useEffect(() => {
    getPayroll(undefined, month).then(setRecords);
    getPayrollKPIs().then(setKpis);
  }, [month]);

  const filtered = records.filter(r =>
    r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
    r.department.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'name', header: 'Employee',
      render: (r: PayrollRecord) => (
        <div className="flex items-center gap-3">
          <Avatar name={r.employeeName} size="sm" />
          <div>
            <p className="text-sm font-medium text-[#2C2825]">{r.employeeName}</p>
            <p className="text-xs text-[#A89F96]">{r.department}</p>
          </div>
        </div>
      )
    },
    { key: 'base', header: 'Base', render: (r: PayrollRecord) => <span className="text-sm text-[#2C2825]">{formatCurrency(r.salary.baseSalary)}</span> },
    { key: 'allowances', header: 'Allowances', render: (r: PayrollRecord) => <span className="text-sm text-[#4A5E40]">+{formatCurrency(r.salary.hra + r.salary.ta + r.salary.da)}</span> },
    { key: 'deductions', header: 'Deductions', render: (r: PayrollRecord) => <span className="text-sm text-[#8B3A2E]">−{formatCurrency(r.salary.pf + r.salary.tax)}</span> },
    { key: 'net', header: 'Net Salary', render: (r: PayrollRecord) => <span className="text-sm font-semibold text-[#2C2825]">{formatCurrency(r.salary.netSalary)}</span> },
    { key: 'status', header: 'Status', render: (r: PayrollRecord) => <StatusBadge status={r.status} size="sm" /> },
    {
      key: 'action', header: '',
      render: (r: PayrollRecord) => (
        <GlassButton variant="ghost" size="sm" icon={<Edit2 size={13} />} onClick={e => { e.stopPropagation(); setEditing(r); }}>
          Edit
        </GlassButton>
      )
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto pb-24 md:pb-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-[#2C2825]">Payroll Management</h1>
        <p className="text-sm text-[#857D77] mt-1">Review and manage salary structures for your organization.</p>
      </motion.div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Payroll', value: formatCurrency(kpis.totalPayroll), icon: <DollarSign size={16} /> },
          { label: 'Employees', value: kpis.employeeCount, icon: <Users size={16} /> },
          { label: 'Processed', value: kpis.processed, icon: <FileText size={16} /> },
          { label: 'Pending', value: kpis.pending, icon: <FileText size={16} /> },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <GlassCard padding="sm">
              <div className="flex items-center gap-2 mb-1 text-[#A89F96]">{k.icon}<span className="text-xs font-medium">{k.label}</span></div>
              <p className="text-xl font-semibold text-[#2C2825]">{k.value}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          {/* Filters */}
          <GlassCard padding="sm" className="flex flex-wrap gap-3 items-center">
            <SearchBar value={search} onChange={setSearch} placeholder="Search employees…" className="flex-1 min-w-48" />
            <select value={month} onChange={e => setMonth(e.target.value)}
              className="px-3 py-2 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)] bg-transparent">
              {MONTHS.map(m => <option key={m} value={m}>{new Date(m + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</option>)}
            </select>
          </GlassCard>

          <GlassCard padding="none">
            <DataTable columns={columns} data={filtered} keyExtractor={r => r.id} />
          </GlassCard>
        </div>

        {/* Salary editor panel */}
        <div>
          <AnimatePresence>
            {editing ? (
              <SalaryEditor
                key={editing.id}
                record={editing}
                onClose={() => setEditing(null)}
                onSave={updated => {
                  setRecords(prev => prev.map(r => r.id === updated.id ? updated : r));
                  setEditing(null);
                }}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 min-h-48"
              >
                <div className="w-12 h-12 rounded-2xl bg-[rgba(235,227,213,0.6)] flex items-center justify-center text-[#A89F96]">
                  <Edit2 size={20} />
                </div>
                <p className="text-sm text-[#857D77]">Select an employee and click Edit to modify their salary structure.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
