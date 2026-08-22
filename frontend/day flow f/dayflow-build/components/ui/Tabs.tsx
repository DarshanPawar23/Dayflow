'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Tab { id: string; label: string; icon?: React.ReactNode; }

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  className?: string;
  children?: (activeTab: string) => React.ReactNode;
}

export function Tabs({ tabs, defaultTab, onChange, className, children }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);

  const handleChange = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div className={cn('flex flex-col gap-0', className)}>
      <div className="flex gap-1 p-1 bg-[rgba(235,227,213,0.5)] rounded-xl w-fit border border-[rgba(200,189,176,0.3)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(122,139,110,0.7)]',
              active === tab.id ? 'text-[#2C2825]' : 'text-[#857D77] hover:text-[#2C2825]'
            )}
            aria-selected={active === tab.id}
            role="tab"
          >
            {active === tab.id && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 bg-[rgba(253,250,245,0.9)] rounded-lg border border-[rgba(200,189,176,0.4)] shadow-sm"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon}
              {tab.label}
            </span>
          </button>
        ))}
      </div>
      {children && <div className="mt-5">{children(active)}</div>}
    </div>
  );
}
