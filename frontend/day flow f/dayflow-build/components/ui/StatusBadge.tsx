'use client';
import { cn } from '@/lib/utils';
import type { AttendanceStatus, LeaveStatus, EmployeeStatus, LeaveType } from '@/lib/types';

type BadgeVariant = AttendanceStatus | LeaveStatus | EmployeeStatus | LeaveType | 'processed' | 'pending' | 'draft' | string;

const variantStyles: Record<string, string> = {
  // Attendance
  present:   'bg-[rgba(122,139,110,0.15)] text-[#4A5E40] border-[rgba(122,139,110,0.3)]',
  absent:    'bg-[rgba(139,58,46,0.12)] text-[#8B3A2E] border-[rgba(139,58,46,0.25)]',
  'half-day':'bg-[rgba(192,148,80,0.15)] text-[#8B6A2E] border-[rgba(192,148,80,0.3)]',
  leave:     'bg-[rgba(100,105,160,0.12)] text-[#4A4E80] border-[rgba(100,105,160,0.25)]',
  holiday:   'bg-[rgba(160,112,96,0.12)] text-[#6A4840] border-[rgba(160,112,96,0.25)]',
  weekend:   'bg-[rgba(168,159,150,0.15)] text-[#857D77] border-[rgba(168,159,150,0.3)]',
  // Leave status
  pending:   'bg-[rgba(192,148,80,0.15)] text-[#8B6A2E] border-[rgba(192,148,80,0.3)]',
  approved:  'bg-[rgba(122,139,110,0.15)] text-[#4A5E40] border-[rgba(122,139,110,0.3)]',
  rejected:  'bg-[rgba(139,58,46,0.12)] text-[#8B3A2E] border-[rgba(139,58,46,0.25)]',
  // Employee status
  active:    'bg-[rgba(122,139,110,0.15)] text-[#4A5E40] border-[rgba(122,139,110,0.3)]',
  inactive:  'bg-[rgba(168,159,150,0.15)] text-[#857D77] border-[rgba(168,159,150,0.3)]',
  'on-leave':'bg-[rgba(100,105,160,0.12)] text-[#4A4E80] border-[rgba(100,105,160,0.25)]',
  // Payroll
  processed: 'bg-[rgba(122,139,110,0.15)] text-[#4A5E40] border-[rgba(122,139,110,0.3)]',
  draft:     'bg-[rgba(168,159,150,0.15)] text-[#857D77] border-[rgba(168,159,150,0.3)]',
  // Leave types
  annual:    'bg-[rgba(122,139,110,0.12)] text-[#4A5E40] border-[rgba(122,139,110,0.25)]',
  sick:      'bg-[rgba(139,58,46,0.10)] text-[#8B3A2E] border-[rgba(139,58,46,0.20)]',
  personal:  'bg-[rgba(100,105,160,0.10)] text-[#4A4E80] border-[rgba(100,105,160,0.20)]',
  maternity: 'bg-[rgba(160,112,180,0.10)] text-[#6A4A80] border-[rgba(160,112,180,0.20)]',
  paternity: 'bg-[rgba(80,120,160,0.10)] text-[#404A80] border-[rgba(80,120,160,0.20)]',
  unpaid:    'bg-[rgba(168,159,150,0.15)] text-[#857D77] border-[rgba(168,159,150,0.3)]',
};

const labelMap: Record<string, string> = {
  'half-day': 'Half Day',
  'on-leave': 'On Leave',
  'processed': 'Processed',
  'annual': 'Annual',
  'sick': 'Sick',
  'personal': 'Personal',
  'maternity': 'Maternity',
  'paternity': 'Paternity',
  'unpaid': 'Unpaid',
};

interface StatusBadgeProps {
  status: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, className, size = 'md' }: StatusBadgeProps) {
  const style = variantStyles[status] ?? 'bg-[rgba(168,159,150,0.15)] text-[#857D77] border-[rgba(168,159,150,0.3)]';
  const label = labelMap[status] ?? (status.charAt(0).toUpperCase() + status.slice(1));
  return (
    <span
      className={cn(
        'inline-flex items-center border font-medium capitalize',
        size === 'sm' ? 'text-xs px-2 py-0.5 rounded-md' : 'text-xs px-2.5 py-1 rounded-lg',
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
