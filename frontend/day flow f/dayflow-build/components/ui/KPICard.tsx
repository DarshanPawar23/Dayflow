'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  accent?: string;
  className?: string;
  delay?: number;
}

export function KPICard({ label, value, icon, trend, accent = 'olive', className, delay = 0 }: KPICardProps) {
  const trendIcon = !trend ? null : trend.value > 0 ? <TrendingUp size={12} /> : trend.value < 0 ? <TrendingDown size={12} /> : <Minus size={12} />;
  const trendColor = !trend ? '' : trend.value > 0 ? 'text-[#4A5E40]' : trend.value < 0 ? 'text-[#8B3A2E]' : 'text-[#857D77]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(44,40,37,0.12)' }}
      className={cn(
        'glass rounded-2xl p-5 relative overflow-hidden flex flex-col gap-3',
        className
      )}
    >
      {/* Accent blob */}
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 blur-2xl pointer-events-none"
        style={{ background: accent === 'olive' ? '#7A8B6E' : accent === 'clay' ? '#A07060' : accent === 'sage' ? '#9EAD92' : '#8B6A2E' }}
      />
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-[rgba(235,227,213,0.8)] flex items-center justify-center text-[#857D77]">
          {icon}
        </div>
        {trend && (
          <span className={cn('flex items-center gap-1 text-xs font-medium', trendColor)}>
            {trendIcon} {Math.abs(trend.value)}% {trend.label}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-semibold text-[#2C2825]">{value}</p>
        <p className="text-sm text-[#857D77] mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}
