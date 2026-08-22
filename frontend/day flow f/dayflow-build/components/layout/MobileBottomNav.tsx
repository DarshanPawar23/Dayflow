'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Clock, Calendar, DollarSign, Users } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

const employeeNav = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/attendance', label: 'Attendance', icon: Clock },
  { href: '/leave', label: 'Leave', icon: Calendar },
  { href: '/payroll', label: 'Payroll', icon: DollarSign },
];

const adminNav = [
  { href: '/admin/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/admin/employees', label: 'People', icon: Users },
  { href: '/admin/attendance', label: 'Attendance', icon: Clock },
  { href: '/admin/leave', label: 'Leave', icon: Calendar },
  { href: '/admin/payroll', label: 'Payroll', icon: DollarSign },
];

export function MobileBottomNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const nav = user?.role === 'admin' ? adminNav : employeeNav;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-[rgba(200,189,176,0.4)] flex z-40 safe-area-bottom">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors min-h-[56px]',
              active ? 'text-[#2C2825]' : 'text-[#A89F96]'
            )}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
