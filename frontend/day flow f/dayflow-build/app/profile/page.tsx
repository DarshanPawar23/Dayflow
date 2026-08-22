'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, DollarSign, FileText, Edit2, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Tabs } from '@/components/ui/Tabs';
import { Avatar } from '@/components/ui/Avatar';
import { getEmployee, updateEmployee } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { Employee } from '@/lib/types';

export default function ProfilePage() {
  const { user } = useAuth();
  const [emp, setEmp] = useState<Employee | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editData, setEditData] = useState({ phone: '', address: '' });

  useEffect(() => {
    if (user) getEmployee(user.id).then(e => {
      setEmp(e);
      if (e) setEditData({ phone: e.phone, address: e.address });
    });
  }, [user]);

  const handleSave = async () => {
    if (!emp) return;
    setSaving(true);
    const updated = await updateEmployee(emp.id, editData);
    setEmp({ ...emp, ...editData });
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
    { id: 'personal', label: 'Personal', icon: <User size={14} /> },
    { id: 'job', label: 'Job', icon: <Briefcase size={14} /> },
    { id: 'salary', label: 'Salary', icon: <DollarSign size={14} /> },
    { id: 'documents', label: 'Documents', icon: <FileText size={14} /> },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto pb-24 md:pb-8">
      {/* Profile header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar name={emp.name} size="xl" />
          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-xl font-semibold text-[#2C2825]">{emp.name}</h1>
                <p className="text-sm text-[#857D77]">{emp.position} · {emp.department}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-[#A89F96] font-mono">{emp.employeeId}</span>
                  <span className="w-1 h-1 rounded-full bg-[#C8BDB0]" />
                  <StatusBadge status={emp.status} size="sm" />
                </div>
              </div>
              {!editing ? (
                <GlassButton variant="secondary" size="sm" icon={<Edit2 size={13} />} onClick={() => setEditing(true)}>
                  Edit
                </GlassButton>
              ) : (
                <div className="flex gap-2">
                  <GlassButton variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</GlassButton>
                  <GlassButton variant="primary" size="sm" loading={saving} onClick={handleSave} icon={saved ? <Check size={13} /> : undefined}>
                    {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
                  </GlassButton>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Tabs tabs={tabs}>
          {(active) => (
            <>
              {active === 'personal' && (
                <GlassCard className="space-y-4">
                  <InfoRow label="Full Name" value={emp.name} />
                  <InfoRow label="Email" value={emp.email} />
                  <InfoRow label="Phone" value={editing ? undefined : emp.phone}
                    editContent={editing ? (
                      <input value={editData.phone} onChange={e => setEditData(d => ({ ...d, phone: e.target.value }))}
                        className="w-full px-3 py-2 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)]" />
                    ) : undefined}
                  />
                  <InfoRow label="Address" value={editing ? undefined : emp.address}
                    editContent={editing ? (
                      <input value={editData.address} onChange={e => setEditData(d => ({ ...d, address: e.target.value }))}
                        className="w-full px-3 py-2 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)]" />
                    ) : undefined}
                  />
                  <InfoRow label="Joined" value={formatDate(emp.joinDate)} />
                </GlassCard>
              )}
              {active === 'job' && (
                <GlassCard className="space-y-4">
                  <InfoRow label="Position" value={emp.position} />
                  <InfoRow label="Department" value={emp.department} />
                  <InfoRow label="Employee ID" value={emp.employeeId} />
                  <InfoRow label="Status" value={<StatusBadge status={emp.status} />} />
                  {emp.manager && <InfoRow label="Reports To" value={emp.manager} />}
                </GlassCard>
              )}
              {active === 'salary' && (
                <GlassCard className="space-y-4">
                  <InfoRow label="Base Salary" value={formatCurrency(emp.salary.baseSalary)} />
                  <InfoRow label="HRA" value={formatCurrency(emp.salary.hra)} />
                  <InfoRow label="TA" value={formatCurrency(emp.salary.ta)} />
                  <InfoRow label="DA" value={formatCurrency(emp.salary.da)} />
                  <InfoRow label="PF (deduction)" value={`−${formatCurrency(emp.salary.pf)}`} />
                  <InfoRow label="Tax (deduction)" value={`−${formatCurrency(emp.salary.tax)}`} />
                  <div className="pt-3 border-t border-[rgba(200,189,176,0.3)] flex items-center justify-between">
                    <span className="font-semibold text-[#2C2825]">Net Salary</span>
                    <span className="font-bold text-[#2C2825]">{formatCurrency(emp.salary.netSalary)}</span>
                  </div>
                </GlassCard>
              )}
              {active === 'documents' && (
                <GlassCard className="space-y-3">
                  {emp.documents?.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between py-2.5 border-b border-[rgba(200,189,176,0.2)] last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[rgba(235,227,213,0.6)] flex items-center justify-center text-[#857D77]">
                          <FileText size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#2C2825]">{doc.name}</p>
                          <p className="text-xs text-[#A89F96]">{doc.type} · {formatDate(doc.uploadedAt)}</p>
                        </div>
                      </div>
                      <GlassButton variant="ghost" size="sm">View</GlassButton>
                    </div>
                  ))}
                  {(!emp.documents || emp.documents.length === 0) && (
                    <p className="text-sm text-[#A89F96] py-4 text-center">No documents available.</p>
                  )}
                </GlassCard>
              )}
            </>
          )}
        </Tabs>
      </motion.div>
    </div>
  );
}

function InfoRow({ label, value, editContent }: { label: string; value?: React.ReactNode; editContent?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
      <span className="text-xs font-semibold text-[#A89F96] uppercase tracking-wide sm:w-36 shrink-0">{label}</span>
      <div className="flex-1 text-sm text-[#2C2825]">
        {editContent ?? (typeof value === 'string' ? value : value)}
      </div>
    </div>
  );
}
