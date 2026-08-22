'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  keyExtractor: (row: T) => string;
  className?: string;
  emptyMessage?: string;
}

export function DataTable<T>({ columns, data, onRowClick, keyExtractor, className, emptyMessage = 'No data found.' }: DataTableProps<T>) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[rgba(200,189,176,0.35)]">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  'text-left px-4 py-3 text-xs font-semibold text-[#A89F96] uppercase tracking-wide',
                  col.headerClassName
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-[#A89F96] text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <motion.tr
                key={keyExtractor(row)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-b border-[rgba(200,189,176,0.2)] transition-colors duration-150',
                  onRowClick && 'cursor-pointer hover:bg-[rgba(235,227,213,0.5)]'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={cn('px-4 py-3.5 text-[#2C2825]', col.className)}
                  >
                    {col.render
                      ? col.render(row)
                      : (row as Record<string, unknown>)[col.key as string] as React.ReactNode}
                  </td>
                ))}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
