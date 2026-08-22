'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Filter } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SearchBar } from '@/components/ui/SearchBar';
import { Avatar } from '@/components/ui/Avatar';
import { GlassButton } from '@/components/ui/GlassButton';
import { getEmployees } from '@/lib/api';
import type { Employee } from '@/lib/types';

const departments = ['All', 'Design', 'Engineering', 'Marketing', 'Analytics', 'Human Resources'];
const statuses = ['all', 'active', 'inactive', 'on-leave'];

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [status, setStatus] = useState('all');

  useEffect(() => { getEmployees().then(setEmployees); }, []);

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === 'All' || e.department === dept;
    const matchStatus = status === 'all' || e.status === status;
    return matchSearch && matchDept && matchStatus;
  });

  const columns = [
    {
      key: 'name', header: 'Employee',
      render: (e: Employee) => (
        <div className="flex items-center gap-3">
          <Avatar name={e.name} size="sm" />
          <div>
            <p className="text-sm font-medium text-[#2C2825]">{e.name}</p>
            <p className="text-xs text-[#A89F96]">{e.email}</p>
          </div>
        </div>
      )
    },
    { key: 'employeeId', header: 'ID', render: (e: Employee) => <span className="text-xs font-mono text-[#857D77]">{e.employeeId}</span> },
    { key: 'position', header: 'Role', render: (e: Employee) => <span className="text-sm text-[#2C2825]">{e.position}</span> },
    { key: 'department', header: 'Department', render: (e: Employee) => <span className="text-sm text-[#857D77]">{e.department}</span> },
    { key: 'status', header: 'Status', render: (e: Employee) => <StatusBadge status={e.status} size="sm" /> },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto pb-24 md:pb-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[#2C2825]">Employees</h1>
          <p className="text-sm text-[#857D77] mt-1">{filtered.length} of {employees.length} employees</p>
        </div>
      </motion.div>

      {/* Filters */}
      <GlassCard padding="sm" className="flex flex-wrap gap-3 items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search employees…" className="flex-1 min-w-48" />
        <select value={dept} onChange={e => setDept(e.target.value)}
          className="px-3 py-2 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)] bg-transparent">
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)}
          className="px-3 py-2 text-sm glass rounded-xl border border-[rgba(200,189,176,0.4)] text-[#2C2825] focus:outline-none focus:ring-2 focus:ring-[rgba(122,139,110,0.5)] bg-transparent capitalize">
          {statuses.map(s => <option key={s} value={s} className="capitalize">{s === 'all' ? 'All statuses' : s}</option>)}
        </select>
      </GlassCard>

      {/* Table */}
      <GlassCard padding="none">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={e => e.id}
          onRowClick={e => router.push(`/admin/employees/${e.id}`)}
        />
      </GlassCard>
    </div>
  );
}
