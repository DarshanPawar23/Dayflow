// ============================================================
// DAYFLOW HRMS — Mock Data
// ============================================================
import type {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  LeaveBalance,
  PayrollRecord,
  Notification,
  AttendanceTrend,
  LeaveTrend,
  PayrollOverview,
  DepartmentSummary,
} from './types';

// -------------------------------------------------------
// Employees
// -------------------------------------------------------
export const mockEmployees: Employee[] = [
  {
    id: 'emp-001',
    employeeId: 'DF-1001',
    name: 'Alex Morgan',
    email: 'alex.morgan@dayflow.co',
    phone: '+1 (555) 201-4892',
    role: 'employee',
    position: 'Product Designer',
    department: 'Design',
    status: 'active',
    joinDate: '2022-03-14',
    address: '24 Elm Street, Austin, TX 78701',
    avatarUrl: undefined,
    manager: 'Sarah Johnson',
    salary: {
      baseSalary: 85000,
      hra: 12000,
      ta: 3600,
      da: 4200,
      pf: 10200,
      tax: 8500,
      netSalary: 86100,
    },
    documents: [
      { id: 'doc-001', name: 'Offer Letter', type: 'PDF', uploadedAt: '2022-03-14' },
      { id: 'doc-002', name: 'NDA Agreement', type: 'PDF', uploadedAt: '2022-03-14' },
    ],
  },
  {
    id: 'emp-002',
    employeeId: 'DF-1002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@dayflow.co',
    phone: '+1 (555) 309-7741',
    role: 'admin',
    position: 'HR Manager',
    department: 'Human Resources',
    status: 'active',
    joinDate: '2020-07-01',
    address: '88 Oak Avenue, Austin, TX 78702',
    avatarUrl: undefined,
    salary: {
      baseSalary: 115000,
      hra: 18000,
      ta: 5000,
      da: 6000,
      pf: 13800,
      tax: 14000,
      netSalary: 116200,
    },
    documents: [
      { id: 'doc-003', name: 'Offer Letter', type: 'PDF', uploadedAt: '2020-07-01' },
    ],
  },
  {
    id: 'emp-003',
    employeeId: 'DF-1003',
    name: 'James Carter',
    email: 'james.carter@dayflow.co',
    phone: '+1 (555) 410-5523',
    role: 'employee',
    position: 'Senior Engineer',
    department: 'Engineering',
    status: 'active',
    joinDate: '2021-09-06',
    address: '15 Pine Road, Austin, TX 78703',
    avatarUrl: undefined,
    manager: 'Sarah Johnson',
    salary: {
      baseSalary: 105000,
      hra: 15000,
      ta: 4200,
      da: 5100,
      pf: 12600,
      tax: 12000,
      netSalary: 104700,
    },
  },
  {
    id: 'emp-004',
    employeeId: 'DF-1004',
    name: 'Priya Sharma',
    email: 'priya.sharma@dayflow.co',
    phone: '+1 (555) 512-3314',
    role: 'employee',
    position: 'Marketing Lead',
    department: 'Marketing',
    status: 'active',
    joinDate: '2023-01-23',
    address: '5 Willow Lane, Austin, TX 78704',
    avatarUrl: undefined,
    manager: 'Sarah Johnson',
    salary: {
      baseSalary: 78000,
      hra: 11000,
      ta: 3200,
      da: 3800,
      pf: 9360,
      tax: 7500,
      netSalary: 79140,
    },
  },
  {
    id: 'emp-005',
    employeeId: 'DF-1005',
    name: 'Lucas Bell',
    email: 'lucas.bell@dayflow.co',
    phone: '+1 (555) 614-8870',
    role: 'employee',
    position: 'Data Analyst',
    department: 'Analytics',
    status: 'on-leave',
    joinDate: '2022-11-15',
    address: '37 Maple Drive, Austin, TX 78705',
    avatarUrl: undefined,
    manager: 'Sarah Johnson',
    salary: {
      baseSalary: 88000,
      hra: 12500,
      ta: 3800,
      da: 4400,
      pf: 10560,
      tax: 9000,
      netSalary: 89140,
    },
  },
  {
    id: 'emp-006',
    employeeId: 'DF-1006',
    name: 'Mei Lin',
    email: 'mei.lin@dayflow.co',
    phone: '+1 (555) 716-2291',
    role: 'employee',
    position: 'UX Researcher',
    department: 'Design',
    status: 'inactive',
    joinDate: '2021-05-10',
    address: '9 Cedar Court, Austin, TX 78706',
    avatarUrl: undefined,
    manager: 'Alex Morgan',
    salary: {
      baseSalary: 80000,
      hra: 11500,
      ta: 3300,
      da: 4000,
      pf: 9600,
      tax: 8000,
      netSalary: 81200,
    },
  },
];

// -------------------------------------------------------
// Attendance
// -------------------------------------------------------
function dateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

function timeStr(daysAgo: number, hour: number, min: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}

export const mockAttendance: AttendanceRecord[] = [
  // Alex Morgan (emp-001) — last 14 days
  { id: 'att-001', employeeId: 'emp-001', date: dateStr(0), status: 'present', checkIn: timeStr(0, 9, 2), hoursWorked: 0 },
  { id: 'att-002', employeeId: 'emp-001', date: dateStr(1), status: 'present', checkIn: timeStr(1, 8, 58), checkOut: timeStr(1, 18, 5), hoursWorked: 9.1 },
  { id: 'att-003', employeeId: 'emp-001', date: dateStr(2), status: 'present', checkIn: timeStr(2, 9, 10), checkOut: timeStr(2, 17, 45), hoursWorked: 8.6 },
  { id: 'att-004', employeeId: 'emp-001', date: dateStr(3), status: 'weekend' },
  { id: 'att-005', employeeId: 'emp-001', date: dateStr(4), status: 'weekend' },
  { id: 'att-006', employeeId: 'emp-001', date: dateStr(5), status: 'present', checkIn: timeStr(5, 9, 0), checkOut: timeStr(5, 18, 0), hoursWorked: 9.0 },
  { id: 'att-007', employeeId: 'emp-001', date: dateStr(6), status: 'leave' },
  { id: 'att-008', employeeId: 'emp-001', date: dateStr(7), status: 'present', checkIn: timeStr(7, 8, 55), checkOut: timeStr(7, 17, 30), hoursWorked: 8.6 },
  { id: 'att-009', employeeId: 'emp-001', date: dateStr(8), status: 'half-day', checkIn: timeStr(8, 13, 0), checkOut: timeStr(8, 18, 0), hoursWorked: 5.0 },
  { id: 'att-010', employeeId: 'emp-001', date: dateStr(9), status: 'present', checkIn: timeStr(9, 9, 5), checkOut: timeStr(9, 18, 10), hoursWorked: 9.1 },
  { id: 'att-011', employeeId: 'emp-001', date: dateStr(10), status: 'weekend' },
  { id: 'att-012', employeeId: 'emp-001', date: dateStr(11), status: 'weekend' },
  { id: 'att-013', employeeId: 'emp-001', date: dateStr(12), status: 'present', checkIn: timeStr(12, 9, 0), checkOut: timeStr(12, 17, 55), hoursWorked: 8.9 },
  { id: 'att-014', employeeId: 'emp-001', date: dateStr(13), status: 'absent' },
  // Other employees
  { id: 'att-050', employeeId: 'emp-002', date: dateStr(0), status: 'present', checkIn: timeStr(0, 8, 45), hoursWorked: 0 },
  { id: 'att-051', employeeId: 'emp-003', date: dateStr(0), status: 'present', checkIn: timeStr(0, 9, 15), hoursWorked: 0 },
  { id: 'att-052', employeeId: 'emp-004', date: dateStr(0), status: 'absent' },
  { id: 'att-053', employeeId: 'emp-005', date: dateStr(0), status: 'leave' },
  { id: 'att-054', employeeId: 'emp-006', date: dateStr(0), status: 'absent' },
];

// -------------------------------------------------------
// Leave Requests
// -------------------------------------------------------
export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'lv-001',
    employeeId: 'emp-001',
    employeeName: 'Alex Morgan',
    department: 'Design',
    type: 'annual',
    startDate: '2026-09-01',
    endDate: '2026-09-05',
    duration: 5,
    status: 'approved',
    remarks: 'Family vacation planned.',
    reviewedBy: 'Sarah Johnson',
    reviewedAt: '2026-08-10T10:00:00Z',
    reviewComment: 'Approved. Enjoy your break!',
    createdAt: '2026-08-05T08:00:00Z',
  },
  {
    id: 'lv-002',
    employeeId: 'emp-001',
    employeeName: 'Alex Morgan',
    department: 'Design',
    type: 'sick',
    startDate: '2026-07-15',
    endDate: '2026-07-16',
    duration: 2,
    status: 'approved',
    remarks: 'Not feeling well.',
    reviewedBy: 'Sarah Johnson',
    reviewedAt: '2026-07-14T09:30:00Z',
    createdAt: '2026-07-14T07:00:00Z',
  },
  {
    id: 'lv-003',
    employeeId: 'emp-001',
    employeeName: 'Alex Morgan',
    department: 'Design',
    type: 'personal',
    startDate: '2026-10-10',
    endDate: '2026-10-10',
    duration: 1,
    status: 'pending',
    remarks: 'Personal errand.',
    createdAt: '2026-08-20T11:00:00Z',
  },
  {
    id: 'lv-004',
    employeeId: 'emp-003',
    employeeName: 'James Carter',
    department: 'Engineering',
    type: 'annual',
    startDate: '2026-08-25',
    endDate: '2026-08-29',
    duration: 5,
    status: 'pending',
    remarks: 'Travel plans.',
    createdAt: '2026-08-18T09:00:00Z',
  },
  {
    id: 'lv-005',
    employeeId: 'emp-004',
    employeeName: 'Priya Sharma',
    department: 'Marketing',
    type: 'sick',
    startDate: '2026-08-22',
    endDate: '2026-08-22',
    duration: 1,
    status: 'pending',
    remarks: 'Fever and headache.',
    createdAt: '2026-08-22T07:30:00Z',
  },
  {
    id: 'lv-006',
    employeeId: 'emp-005',
    employeeName: 'Lucas Bell',
    department: 'Analytics',
    type: 'annual',
    startDate: '2026-08-15',
    endDate: '2026-08-22',
    duration: 8,
    status: 'approved',
    remarks: 'Annual leave.',
    reviewedBy: 'Sarah Johnson',
    reviewedAt: '2026-08-10T14:00:00Z',
    createdAt: '2026-08-08T10:00:00Z',
  },
];

export const mockLeaveBalances: LeaveBalance[] = [
  {
    employeeId: 'emp-001',
    annual: { total: 21, used: 5, remaining: 16 },
    sick: { total: 10, used: 2, remaining: 8 },
    personal: { total: 5, used: 0, remaining: 5 },
  },
  {
    employeeId: 'emp-002',
    annual: { total: 21, used: 3, remaining: 18 },
    sick: { total: 10, used: 1, remaining: 9 },
    personal: { total: 5, used: 1, remaining: 4 },
  },
];

// -------------------------------------------------------
// Payroll
// -------------------------------------------------------
export const mockPayroll: PayrollRecord[] = mockEmployees.map((e, i) => ({
  id: `pay-${String(i + 1).padStart(3, '0')}`,
  employeeId: e.id,
  employeeName: e.name,
  department: e.department,
  month: '2026-08',
  salary: e.salary,
  status: i < 4 ? 'processed' : 'pending',
}));

// -------------------------------------------------------
// Notifications
// -------------------------------------------------------
export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    category: 'leave',
    title: 'Leave Request Approved',
    description: 'Your annual leave (Sep 1–5) has been approved by Sarah Johnson.',
    time: '2026-08-10T10:05:00Z',
    read: true,
  },
  {
    id: 'notif-002',
    category: 'attendance',
    title: 'Late Check-In Noted',
    description: 'You checked in at 09:15 today. Please ensure timely attendance.',
    time: '2026-08-22T09:20:00Z',
    read: false,
  },
  {
    id: 'notif-003',
    category: 'payroll',
    title: 'Salary Processed',
    description: 'Your August 2026 salary of $86,100 has been processed.',
    time: '2026-08-21T14:00:00Z',
    read: false,
  },
  {
    id: 'notif-004',
    category: 'system',
    title: 'Profile Updated',
    description: 'Your profile information was updated successfully.',
    time: '2026-08-19T11:30:00Z',
    read: true,
  },
  {
    id: 'notif-005',
    category: 'leave',
    title: 'New Leave Request',
    description: 'James Carter has submitted a leave request for review.',
    time: '2026-08-18T09:05:00Z',
    read: false,
  },
  {
    id: 'notif-006',
    category: 'attendance',
    title: 'Attendance Report Ready',
    description: 'Your monthly attendance report for July is now available.',
    time: '2026-08-01T08:00:00Z',
    read: true,
  },
];

// -------------------------------------------------------
// Analytics / Reports
// -------------------------------------------------------
export const mockAttendanceTrend: AttendanceTrend[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  const isWeekend = d.getDay() === 0 || d.getDay() === 6;
  return {
    date: d.toISOString().split('T')[0],
    present: isWeekend ? 0 : Math.floor(Math.random() * 3) + 3,
    absent: isWeekend ? 0 : Math.floor(Math.random() * 2),
    leave: isWeekend ? 0 : Math.floor(Math.random() * 2),
  };
});

export const mockLeaveTrend: LeaveTrend[] = [
  { month: 'Mar', annual: 4, sick: 2, personal: 1 },
  { month: 'Apr', annual: 3, sick: 5, personal: 2 },
  { month: 'May', annual: 6, sick: 3, personal: 1 },
  { month: 'Jun', annual: 8, sick: 2, personal: 3 },
  { month: 'Jul', annual: 5, sick: 4, personal: 2 },
  { month: 'Aug', annual: 7, sick: 1, personal: 1 },
];

export const mockPayrollOverview: PayrollOverview[] = [
  { month: 'Mar', totalPayroll: 523000, employeeCount: 6 },
  { month: 'Apr', totalPayroll: 537000, employeeCount: 6 },
  { month: 'May', totalPayroll: 541000, employeeCount: 6 },
  { month: 'Jun', totalPayroll: 548000, employeeCount: 6 },
  { month: 'Jul', totalPayroll: 551000, employeeCount: 6 },
  { month: 'Aug', totalPayroll: 556380, employeeCount: 6 },
];

export const mockDepartmentSummary: DepartmentSummary[] = [
  { department: 'Design', headcount: 2, presentToday: 1, leaveCount: 0 },
  { department: 'Engineering', headcount: 1, presentToday: 1, leaveCount: 0 },
  { department: 'Marketing', headcount: 1, presentToday: 0, leaveCount: 0 },
  { department: 'Analytics', headcount: 1, presentToday: 0, leaveCount: 1 },
  { department: 'Human Resources', headcount: 1, presentToday: 1, leaveCount: 0 },
];
