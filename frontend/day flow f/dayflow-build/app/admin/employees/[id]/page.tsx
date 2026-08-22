'use client';
import { useEffect, useState } from 'react';
import { use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2, Save, X } from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';
import { getEmployee } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { Employee } from '@/lib/types';

export default function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [emp, setEmp] = useState<Employee | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getEmployee(id).then(setEmp); }, [id]);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!emp) return (
    <div className="p-8 flex items-center justify-center min-h-64">
      <div className="w-8 h-8 border-2 border-[rgba(200,189,176,0.5)] border-t-[#2C2825] rounded-full animate-spin" />
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'job', label: 'Job' },
    { id: 'salary', label: 'Salary' },
    { id: 'documents', label: 'Documents' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto pb-24 md:pb-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/admin/employees" className="inline-flex items-center gap-1.5 text-sm text-[#857D77] hover:text-[#2C2825] transition-colors mb-4">
          <ArrowLeft size={14} /> Back to Employees
        </Link>

        <GlassCard className="flex flex-col sm:flex-row items-start gap-5">
          <Avatar name={emp.name} size="xl" />
          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-xl font-semibold text-[#2C2825]">{emp.name}</h1>
                <p className="text-sm text-[#857D77]">{emp.position} · {emp.department}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-[#A89F96] font-mono">{emp.employeeId}</span>
                  <StatusBadge status={emp.status} size="sm" />
                </div>
              </div>
              {!editing ? (
                <GlassButton variant="secondary" size="sm" icon={<Edit2 size={13} />} onClick={() => setEditing(true)}>Edit</GlassButton>
              ) : (
                <div className="flex gap-2">
                  <GlassButton variant="ghost" size="sm" icon={<X size={13} />} onClick={() => setEditing(false)}>Cancel</GlassButton>
                  <GlassButton variant="primary" size="sm" loading={saving} icon={<Save size={13} />} onClick={handleSave}>
                    {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
                  </GlassButton>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Tabs tabs={tabs}>
          {(active) => (
            <>
              {active === 'overview' && (
                <GlassCard className="space-y-4">
                  <Field label="Email" value={emp.email} editing={editing} />
                  <Field label="Phone" value={emp.phone} editing={editing} />
                  <Field label="Address" value={emp.address} editing={editing} />
                  <Field label="Join Date" value={formatDate(emp.joinDate)} />
                  <Field label="Manager" value={emp.manager ?? '—'} />
                </GlassCard>
              )}
              {active === 'job' && (
                <GlassCard className="space-y-4">
                  <Field label="Position" value={emp.position} editing={editing} />
                  <Field label="Department" value={emp.department} editing={editing} />
                  <Field label="Role" value={emp.role} />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                    <span className="text-xs font-semibold text-[#A89F96] uppercase tracking-wide sm:w-36">Status</span>
                    {editing ? (
                      <select defaultValue={emp.status} className="flex-1 px-3 py-2 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] bg-transparent focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)]">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="on-leave">On Leave</option>
                      </select>
                    ) : <StatusBadge status={emp.status} />}
                  </div>
                </GlassCard>
              )}
              {active === 'salary' && (
                <GlassCard className="space-y-4">
                  <Field label="Base Salary" value={formatCurrency(emp.salary.baseSalary)} editing={editing} />
                  <Field label="HRA" value={formatCurrency(emp.salary.hra)} editing={editing} />
                  <Field label="Net Salary" value={formatCurrency(emp.salary.netSalary)} />
                </GlassCard>
              )}
              {active === 'documents' && (
                <GlassCard>
                  <p className="text-sm text-[#A89F96] py-4 text-center">{emp.documents?.length ? `${emp.documents.length} document(s) on file.` : 'No documents.'}</p>
                </GlassCard>
              )}
            </>
          )}
        </Tabs>
      </motion.div>
    </div>
  );
}

function Field({ label, value, editing }: { label: string; value: string; editing?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
      <span className="text-xs font-semibold text-[#A89F96] uppercase tracking-wide sm:w-36 shrink-0">{label}</span>
      {editing ? (
        <input defaultValue={value} className="flex-1 px-3 py-2 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)]" />
      ) : (
        <span className="flex-1 text-sm text-[#2C2825]">{value}</span>
      )}
    </div>
  );
}
