'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import { getLeaveRequests, reviewLeaveRequest } from '@/lib/api';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import type { LeaveRequest, LeaveStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const filters: { label: string; value: LeaveStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

export default function LeaveApprovalPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [filter, setFilter] = useState<LeaveStatus | 'all'>('all');
  const [selected, setSelected] = useState<LeaveRequest | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  useEffect(() => { getLeaveRequests().then(setRequests); }, []);

  const filtered = requests.filter(r => filter === 'all' || r.status === filter);

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    setProcessing(id);
    const updated = await reviewLeaveRequest(id, action, comment);
    setRequests(prev => prev.map(r => r.id === id ? updated : r));
    setSelected(updated);
    setProcessing(null);
    setComment('');
  };

  return (
    <div className="p-6 md:p-8 space-y-5 max-w-6xl mx-auto pb-24 md:pb-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-[#2C2825]">Leave Approval Center</h1>
        <p className="text-sm text-[#857D77] mt-1">Review and manage employee leave requests.</p>
      </motion.div>

      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={cn('px-4 py-2 text-sm rounded-xl border transition-all',
              filter === f.value
                ? 'bg-[#2C2825] text-[#FDFAF5] border-[#2C2825]'
                : 'glass text-[#857D77] border-[rgba(200,189,176,0.4)] hover:text-[#2C2825]'
            )}>
            {f.label}
            <span className="ml-1.5 text-xs opacity-60">
              {requests.filter(r => f.value === 'all' ? true : r.status === f.value).length}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Request cards */}
        <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
          {filtered.length === 0 && <p className="text-sm text-[#A89F96] py-4 text-center">No requests.</p>}
          {filtered.map((r, i) => (
            <motion.button
              key={r.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(r)}
              className={cn(
                'w-full text-left glass rounded-2xl p-4 transition-all',
                selected?.id === r.id ? 'ring-2 ring-[#2C2825]' : 'hover:shadow-lift'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Avatar name={r.employeeName} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-[#2C2825]">{r.employeeName}</p>
                    <p className="text-xs text-[#A89F96]">{r.department}</p>
                  </div>
                </div>
                <StatusBadge status={r.status} size="sm" />
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-[#857D77]">
                <span className="capitalize font-medium">{r.type}</span>
                <span>·</span>
                <span>{r.duration}d</span>
                <span>·</span>
                <span>{formatRelativeTime(r.createdAt)}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {!selected ? (
            <GlassCard className="flex items-center justify-center min-h-64 text-[#A89F96] text-sm">
              Select a request to review
            </GlassCard>
          ) : (
            <motion.div key={selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard className="space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={selected.employeeName} size="md" />
                    <div>
                      <p className="font-semibold text-[#2C2825]">{selected.employeeName}</p>
                      <p className="text-sm text-[#857D77]">{selected.department}</p>
                    </div>
                  </div>
                  <StatusBadge status={selected.status} />
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-[#A89F96] mb-0.5">Leave Type</p>
                    <p className="font-medium text-[#2C2825] capitalize">{selected.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#A89F96] mb-0.5">Duration</p>
                    <p className="font-medium text-[#2C2825]">{selected.duration} day{selected.duration > 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#A89F96] mb-0.5">Start Date</p>
                    <p className="font-medium text-[#2C2825]">{formatDate(selected.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#A89F96] mb-0.5">End Date</p>
                    <p className="font-medium text-[#2C2825]">{formatDate(selected.endDate)}</p>
                  </div>
                </div>

                {selected.remarks && (
                  <div className="bg-[rgba(235,227,213,0.5)] rounded-xl p-4">
                    <p className="text-xs font-semibold text-[#A89F96] mb-1">Employee Remarks</p>
                    <p className="text-sm text-[#2C2825]">{selected.remarks}</p>
                  </div>
                )}

                {selected.reviewComment && (
                  <div className="bg-[rgba(122,139,110,0.08)] rounded-xl p-4">
                    <p className="text-xs font-semibold text-[#4A5E40] mb-1">Review Comment</p>
                    <p className="text-sm text-[#2C2825]">{selected.reviewComment}</p>
                    <p className="text-xs text-[#A89F96] mt-1">— {selected.reviewedBy} · {selected.reviewedAt && formatDate(selected.reviewedAt)}</p>
                  </div>
                )}

                {/* Approve/Reject */}
                {selected.status === 'pending' && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label htmlFor="review-comment" className="text-xs font-semibold text-[#2C2825] mb-1 block">Comment (optional)</label>
                      <textarea id="review-comment" value={comment} onChange={e => setComment(e.target.value)} rows={2} placeholder="Add a note…"
                        className="w-full px-4 py-3 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] placeholder-[#A89F96] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)] resize-none" />
                    </div>
                    <div className="flex gap-3">
                      <GlassButton
                        variant="danger" size="md" className="flex-1"
                        icon={<XCircle size={15} />}
                        loading={processing === selected.id}
                        onClick={() => handleAction(selected.id, 'rejected')}
                      >Reject</GlassButton>
                      <GlassButton
                        variant="primary" size="md" className="flex-1"
                        icon={<CheckCircle size={15} />}
                        loading={processing === selected.id}
                        onClick={() => handleAction(selected.id, 'approved')}
                      >Approve</GlassButton>
                    </div>
                  </div>
                )}

                {selected.status !== 'pending' && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-[#4A5E40] bg-[rgba(122,139,110,0.08)] rounded-xl p-3">
                    <CheckCircle size={15} />
                    Leave {selected.status} — {selected.reviewedBy ? `by ${selected.reviewedBy}` : ''}
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
