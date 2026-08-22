'use client';
import { motion } from 'framer-motion';
import { formatRelativeTime } from '@/lib/utils';
import type { Notification, NotificationCategory } from '@/lib/types';
import { Bell, Calendar, DollarSign, Clock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const catIcon: Record<NotificationCategory, React.ReactNode> = {
  leave:      <Calendar size={15} />,
  attendance: <Clock size={15} />,
  payroll:    <DollarSign size={15} />,
  system:     <Info size={15} />,
};

const catColor: Record<NotificationCategory, string> = {
  leave:      'bg-[rgba(100,105,160,0.12)] text-[#4A4E80]',
  attendance: 'bg-[rgba(122,139,110,0.12)] text-[#4A5E40]',
  payroll:    'bg-[rgba(192,148,80,0.15)] text-[#8B6A2E]',
  system:     'bg-[rgba(168,159,150,0.15)] text-[#857D77]',
};

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
}

export function NotificationPanel({ notifications, onMarkRead }: NotificationPanelProps) {
  return (
    <div className="flex flex-col">
      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[rgba(235,227,213,0.7)] flex items-center justify-center text-[#A89F96]">
            <Bell size={22} />
          </div>
          <p className="text-sm text-[#857D77]">No notifications yet.</p>
        </div>
      )}
      {notifications.map((n, i) => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => !n.read && onMarkRead(n.id)}
          className={cn(
            'flex gap-3 px-5 py-4 border-b border-[rgba(200,189,176,0.2)] transition-colors',
            !n.read ? 'bg-[rgba(235,227,213,0.3)] cursor-pointer hover:bg-[rgba(235,227,213,0.5)]' : 'opacity-70'
          )}
        >
          <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5', catColor[n.category])}>
            {catIcon[n.category]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-[#2C2825] leading-snug">{n.title}</p>
              {!n.read && <span className="w-2 h-2 rounded-full bg-[#8B6A2E] shrink-0 mt-1.5" />}
            </div>
            <p className="text-xs text-[#857D77] mt-0.5 leading-relaxed">{n.description}</p>
            <p className="text-[10px] text-[#A89F96] mt-1">{formatRelativeTime(n.time)}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
