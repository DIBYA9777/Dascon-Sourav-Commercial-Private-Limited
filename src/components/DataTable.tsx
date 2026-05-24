import React from 'react';
import { cn } from '@/src/lib/utils';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  className?: string;
  loading?: boolean;
}

export function DataTable<T>({ columns, data, onRowClick, className, loading }: DataTableProps<T>) {
  return (
    <div className={cn('overflow-x-auto border border-slate-200 rounded-lg', className)}>
      <table className="w-full text-sm text-left text-slate-500">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={cn('px-6 py-3 font-semibold', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-slate-400">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-slate-400">
                No data available
              </td>
            </tr>
          ) : (
            data.map((item, rowIdx) => (
              <tr
                key={rowIdx}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'bg-white hover:bg-slate-50 transition-colors',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={cn('px-6 py-4 text-slate-700', col.className)}>
                    {typeof col.accessor === 'function'
                      ? col.accessor(item)
                      : (item[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
