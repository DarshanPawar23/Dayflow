'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Clock, Calendar, DollarSign, BarChart3,
  Settings, LogOut, ChevronLeft, ChevronRight, Waves,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

const employeeNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/attendance', label: 'Attendance', icon: Clock },
  { href: '/leave', label: 'Time Off', icon: Calendar },
  { href: '/payroll', label: 'Payroll', icon: DollarSign },
];

const adminNav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/employees', label: 'Employees', icon: Users },
  { href: '/admin/attendance', label: 'Attendance', icon: Clock },
  { href: '/admin/leave', label: 'Leave Center', icon: Calendar },
  { href: '/admin/payroll', label: 'Payroll', icon: DollarSign },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const nav = user?.role === 'admin' ? adminNav : employeeNav;

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 228 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      className="hidden md:flex flex-col h-full glass-panel border-r border-[rgba(200,189,176,0.4)] relative shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[rgba(200,189,176,0.3)]">
        <div className="w-8 h-8 rounded-xl bg-[#2C2825] flex items-center justify-center shrink-0">
          <Waves size={16} className="text-[#EBE3D5]" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="font-semibold text-base text-[#2C2825] tracking-tight"
            >
              DAYFLOW
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-4" aria-label="Main navigation">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative',
                active
                  ? 'bg-[rgba(44,40,37,0.08)] text-[#2C2825]'
                  : 'text-[#857D77] hover:bg-[rgba(235,227,213,0.6)] hover:text-[#2C2825]'
              )}
              aria-current={active ? 'page' : undefined}
            >
              {active && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#2C2825] rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <motion.span whileHover={{ scale: 1.1 }} className="shrink-0">
                <Icon size={18} />
              </motion.span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Divider + secondary */}
      <div className="px-2 pb-4 flex flex-col gap-1 border-t border-[rgba(200,189,176,0.3)] pt-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#857D77] hover:bg-[rgba(235,227,213,0.6)] hover:text-[#2C2825] transition-all"
        >
          <Settings size={18} />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#857D77] hover:bg-[rgba(139,58,46,0.1)] hover:text-[#8B3A2E] transition-all w-full text-left"
          aria-label="Log out"
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm font-medium">Log out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute top-5 -right-3 w-6 h-6 rounded-full glass border border-[rgba(200,189,176,0.5)] flex items-center justify-center text-[#857D77] hover:text-[#2C2825] shadow-sm z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
