'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Avatar } from '@/components/ui/Avatar';
import { Drawer } from '@/components/ui/Drawer';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';
import { getTodayLabel } from '@/lib/utils';
import { getNotifications } from '@/lib/api';
import type { Notification } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TopbarProps { onSearchOpen?: () => void; }

export function Topbar({ onSearchOpen }: TopbarProps) {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [search, setSearch] = useState('');
  const todayLabel = getTodayLabel();
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

  return (
    <>
      <header className="flex items-center gap-3 px-4 md:px-6 py-3.5 border-b border-[rgba(200,189,176,0.35)] glass-panel shrink-0">
        {/* Date label */}
        <div className="hidden md:block flex-1">
          <p className="text-xs text-[#A89F96]">{todayLabel}</p>
        </div>

        {/* Search */}
        <label htmlFor="topbar-search" className="relative flex-1 md:flex-none md:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89F96]" size={14} />
          <input
            id="topbar-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search anything…"
            className="w-full pl-8 pr-4 py-2 text-sm bg-[rgba(235,227,213,0.4)] border border-[rgba(200,189,176,0.3)] rounded-xl text-[#2C2825] placeholder-[#A89F96] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)] transition-all"
          />
        </label>

        {/* Notification bell */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setNotifOpen(true)}
          className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[rgba(235,227,213,0.7)] transition-colors text-[#857D77] hover:text-[#2C2825]"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8B6A2E] border border-[#FDFAF5]" />
          )}
        </motion.button>

        {/* Avatar + Role */}
        <Link
          href={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <Avatar name={user?.name ?? 'User'} size="sm" />
          <div className="hidden md:block text-right">
            <p className="text-xs font-semibold text-[#2C2825] leading-tight">{user?.name}</p>
            <p className="text-[10px] text-[#A89F96] capitalize">{user?.role}</p>
          </div>
        </Link>
      </header>

      <Drawer open={notifOpen} onClose={() => setNotifOpen(false)} title="Notifications">
        <NotificationPanel notifications={notifications} onMarkRead={(id) => {
          setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
        }} />
      </Drawer>
    </>
  );
}
