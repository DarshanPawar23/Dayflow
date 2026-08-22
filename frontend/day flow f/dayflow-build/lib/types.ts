// ============================================================
// DAYFLOW HRMS — Core Type Definitions
// ============================================================

export type Role = 'employee' | 'admin';

export type EmployeeStatus = 'active' | 'inactive' | 'on-leave';
export type AttendanceStatus = 'present' | 'absent' | 'half-day' | 'leave' | 'holiday' | 'weekend';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type LeaveType = 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid';
export type NotificationCategory = 'leave' | 'attendance' | 'payroll' | 'system';

// -------------------------------------------------------
// Auth
// -------------------------------------------------------
export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  employeeId: string;
  name: string;
  avatarUrl?: string;
}

// -------------------------------------------------------
// Employee
// -------------------------------------------------------
export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  position: string;
  department: string;
  status: EmployeeStatus;
  joinDate: string;
  address: string;
  avatarUrl?: string;
  salary: SalaryStructure;
  manager?: string;
  documents?: Document[];
}

// -------------------------------------------------------
// Attendance
// -------------------------------------------------------
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // ISO date YYYY-MM-DD
  checkIn?: string; // ISO datetime
  checkOut?: string; // ISO datetime
  status: AttendanceStatus;
  hoursWorked?: number;
  notes?: string;
}

// -------------------------------------------------------
// Leave
// -------------------------------------------------------
export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  duration: number; // days
  status: LeaveStatus;
  remarks: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewComment?: string;
  createdAt: string;
}

export interface LeaveBalance {
  employeeId: string;
  annual: { total: number; used: number; remaining: number };
  sick: { total: number; used: number; remaining: number };
  personal: { total: number; used: number; remaining: number };
}

// -------------------------------------------------------
// Payroll
// -------------------------------------------------------
export interface SalaryStructure {
  baseSalary: number;
  hra: number;        // Housing allowance
  ta: number;         // Travel allowance
  da: number;         // Dearness allowance
  pf: number;         // Provident fund deduction
  tax: number;        // Tax deduction
  netSalary: number;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  month: string; // YYYY-MM
  salary: SalaryStructure;
  status: 'processed' | 'pending' | 'draft';
}

// -------------------------------------------------------
// Notifications
// -------------------------------------------------------
export interface Notification {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  time: string; // ISO datetime
  read: boolean;
  actionUrl?: string;
}

// -------------------------------------------------------
// Reports / Analytics
// -------------------------------------------------------
export interface AttendanceTrend {
  date: string;
  present: number;
  absent: number;
  leave: number;
}

export interface LeaveTrend {
  month: string;
  annual: number;
  sick: number;
  personal: number;
}

export interface PayrollOverview {
  month: string;
  totalPayroll: number;
  employeeCount: number;
}

export interface DepartmentSummary {
  department: string;
  headcount: number;
  presentToday: number;
  leaveCount: number;
}

// -------------------------------------------------------
// Documents
// -------------------------------------------------------
export interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  url?: string;
}
