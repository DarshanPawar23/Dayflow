'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle, Calendar } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { getLeaveRequests, getLeaveBalance, submitLeaveRequest } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { LeaveRequest, LeaveBalance, LeaveType } from '@/lib/types';

function LeaveForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: Omit<LeaveRequest, 'id' | 'createdAt'>) => void }) {
  const { user } = useAuth();
  const [type, setType] = useState<LeaveType>('annual');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const duration = start && end
    ? Math.max(0, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !start || !end) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 700));
    onSubmit({
      employeeId: user.id,
      employeeName: user.name,
      department: 'Design',
      type, startDate: start, endDate: end, duration,
      status: 'pending', remarks,
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="leave-type" className="text-xs font-semibold text-[#2C2825]">Leave Type</label>
        <select id="leave-type" value={type} onChange={e => setType(e.target.value as LeaveType)}
          className="w-full px-4 py-3 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)] bg-transparent appearance-none">
          {['annual','sick','personal','maternity','paternity','unpaid'].map(t => (
            <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase()+t.slice(1)}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="start-date" className="text-xs font-semibold text-[#2C2825]">Start Date</label>
          <input id="start-date" type="date" value={start} onChange={e => setStart(e.target.value)} required
            className="w-full px-4 py-3 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)]" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="end-date" className="text-xs font-semibold text-[#2C2825]">End Date</label>
          <input id="end-date" type="date" value={end} onChange={e => setEnd(e.target.value)} required min={start}
            className="w-full px-4 py-3 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)]" />
        </div>
      </div>
      {duration > 0 && <p className="text-sm text-[#7A8B6E] font-medium">{duration} working day{duration > 1 ? 's' : ''}</p>}
      <div className="space-y-1.5">
        <label htmlFor="remarks" className="text-xs font-semibold text-[#2C2825]">Remarks</label>
        <textarea id="remarks" value={remarks} onChange={e => setRemarks(e.target.value)} rows={3} placeholder="Any additional notes…"
          className="w-full px-4 py-3 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] placeholder-[#A89F96] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)] resize-none" />
      </div>
      <div className="flex gap-3 pt-2">
        <GlassButton variant="ghost" size="md" onClick={onClose} type="button" className="flex-1">Cancel</GlassButton>
        <GlassButton variant="primary" size="md" loading={submitting} type="submit" className="flex-1">Submit Request</GlassButton>
      </div>
    </form>
  );
}

export default function LeavePage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [balance, setBalance] = useState<LeaveBalance | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      getLeaveRequests(user.id).then(setRequests);
      getLeaveBalance(user.id).then(setBalance);
    }
  }, [user]);

  const handleSubmit = async (data: Omit<LeaveRequest, 'id' | 'createdAt'>) => {
    const newReq = await submitLeaveRequest(data);
    setRequests(prev => [newReq, ...prev]);
    setSuccessId(newReq.id);
    setTimeout(() => setSuccessId(null), 3000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto pb-24 md:pb-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[#2C2825]">Time Off</h1>
          <p className="text-sm text-[#857D77] mt-1">Manage your leave requests and balances.</p>
        </div>
        <GlassButton variant="primary" icon={<Plus size={15} />} onClick={() => setModalOpen(true)}>Request Leave</GlassButton>
      </motion.div>

      {/* Success banner */}
      <AnimatePresence>
        {successId && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 bg-[rgba(122,139,110,0.12)] border border-[rgba(122,139,110,0.3)] text-[#4A5E40] rounded-xl px-4 py-3 text-sm">
            <CheckCircle size={16} /> Request submitted — Awaiting HR approval.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leave balances */}
      {balance && (
        <div className="grid grid-cols-3 gap-4">
          {(['annual','sick','personal'] as const).map(type => (
            <GlassCard key={type} padding="sm" className="text-center">
              <p className="text-xs font-semibold text-[#A89F96] uppercase tracking-wide mb-2 capitalize">{type}</p>
              <p className="text-2xl font-semibold text-[#2C2825]">{balance[type].remaining}</p>
              <p className="text-xs text-[#A89F96]">of {balance[type].total} remaining</p>
              <div className="mt-2 h-1 bg-[rgba(200,189,176,0.3)] rounded-full overflow-hidden">
                <div className="h-full bg-[#7A8B6E] rounded-full transition-all"
                  style={{ width: `${(balance[type].remaining / balance[type].total) * 100}%` }} />
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Requests list */}
      <GlassCard padding="none">
        <div className="px-5 py-4 border-b border-[rgba(200,189,176,0.3)] flex items-center justify-between">
          <h2 className="font-semibold text-[#2C2825]">Leave Requests</h2>
          <span className="text-xs text-[#A89F96]">{requests.length} total</span>
        </div>
        <div className="divide-y divide-[rgba(200,189,176,0.2)]">
          {requests.length === 0 && <p className="text-sm text-[#A89F96] px-5 py-8 text-center">No requests yet.</p>}
          {requests.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className={cn('flex items-center justify-between px-5 py-4', successId === r.id && 'bg-[rgba(122,139,110,0.06)]')}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[rgba(235,227,213,0.6)] flex items-center justify-center text-[#857D77]">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2C2825] capitalize">{r.type} leave</p>
                  <p className="text-xs text-[#A89F96]">{formatDate(r.startDate)} – {formatDate(r.endDate)} · {r.duration}d</p>
                </div>
              </div>
              <StatusBadge status={r.status} size="sm" />
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Request Leave">
        <LeaveForm onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
}
