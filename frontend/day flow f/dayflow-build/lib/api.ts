// ============================================================
// DAYFLOW HRMS — API-Ready Service Functions (Mock)
// ============================================================
import {
  mockEmployees,
  mockAttendance,
  mockLeaveRequests,
  mockLeaveBalances,
  mockPayroll,
  mockNotifications,
  mockAttendanceTrend,
  mockLeaveTrend,
  mockPayrollOverview,
  mockDepartmentSummary,
} from './mock-data';
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
  AuthUser,
} from './types';

// Simulate network delay
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

// -------------------------------------------------------
// Auth
// -------------------------------------------------------
export const mockAuthUsers: AuthUser[] = [
  { id: 'emp-001', email: 'alex.morgan@dayflow.co', role: 'employee', employeeId: 'DF-1001', name: 'Alex Morgan' },
  { id: 'emp-002', email: 'sarah.johnson@dayflow.co', role: 'admin', employeeId: 'DF-1002', name: 'Sarah Johnson' },
];

export async function signIn(email: string, _password: string): Promise<AuthUser | null> {
  await delay(800);
  return mockAuthUsers.find((u) => u.email === email) ?? null;
}

// -------------------------------------------------------
// Employees
// -------------------------------------------------------
export async function getEmployees(): Promise<Employee[]> {
  await delay();
  return mockEmployees;
}

export async function getEmployee(id: string): Promise<Employee | null> {
  await delay();
  return mockEmployees.find((e) => e.id === id) ?? null;
}

export async function updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
  await delay(600);
  const emp = mockEmployees.find((e) => e.id === id);
  if (!emp) throw new Error('Employee not found');
  return { ...emp, ...data };
}

// -------------------------------------------------------
// Attendance
// -------------------------------------------------------
export async function getAttendance(employeeId: string): Promise<AttendanceRecord[]> {
  await delay();
  return mockAttendance.filter((a) => a.employeeId === employeeId);
}

export async function getAllAttendance(): Promise<AttendanceRecord[]> {
  await delay();
  return mockAttendance;
}

export async function getAttendanceSummary(employeeId: string) {
  await delay();
  const records = mockAttendance.filter((a) => a.employeeId === employeeId);
  return {
    present: records.filter((r) => r.status === 'present').length,
    absent: records.filter((r) => r.status === 'absent').length,
    halfDay: records.filter((r) => r.status === 'half-day').length,
    leave: records.filter((r) => r.status === 'leave').length,
    totalDays: records.filter((r) => !['weekend', 'holiday'].includes(r.status)).length,
  };
}

// -------------------------------------------------------
// Leave
// -------------------------------------------------------
export async function getLeaveRequests(employeeId?: string): Promise<LeaveRequest[]> {
  await delay();
  if (employeeId) return mockLeaveRequests.filter((l) => l.employeeId === employeeId);
  return mockLeaveRequests;
}

export async function getLeaveBalance(employeeId: string): Promise<LeaveBalance | null> {
  await delay();
  return mockLeaveBalances.find((b) => b.employeeId === employeeId) ?? null;
}

export async function submitLeaveRequest(
  data: Omit<LeaveRequest, 'id' | 'createdAt'>
): Promise<LeaveRequest> {
  await delay(700);
  return {
    ...data,
    id: `lv-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
}

export async function reviewLeaveRequest(
  id: string,
  action: 'approved' | 'rejected',
  comment?: string,
  reviewerName = 'Sarah Johnson'
): Promise<LeaveRequest> {
  await delay(600);
  const request = mockLeaveRequests.find((r) => r.id === id);
  if (!request) throw new Error('Leave request not found');
  return {
    ...request,
    status: action,
    reviewedBy: reviewerName,
    reviewedAt: new Date().toISOString(),
    reviewComment: comment,
  };
}

// -------------------------------------------------------
// Payroll
// -------------------------------------------------------
export async function getPayroll(employeeId?: string, month?: string): Promise<PayrollRecord[]> {
  await delay();
  let records = mockPayroll;
  if (employeeId) records = records.filter((p) => p.employeeId === employeeId);
  if (month) records = records.filter((p) => p.month === month);
  return records;
}

export async function getPayrollKPIs() {
  await delay();
  const total = mockPayroll.reduce((sum, p) => sum + p.salary.netSalary, 0);
  return {
    totalPayroll: total,
    employeeCount: mockPayroll.length,
    processed: mockPayroll.filter((p) => p.status === 'processed').length,
    pending: mockPayroll.filter((p) => p.status === 'pending').length,
  };
}

// -------------------------------------------------------
// Notifications
// -------------------------------------------------------
export async function getNotifications(): Promise<Notification[]> {
  await delay();
  return mockNotifications;
}

// -------------------------------------------------------
// Analytics
// -------------------------------------------------------
export async function getAttendanceTrend(days = 30): Promise<AttendanceTrend[]> {
  await delay();
  return mockAttendanceTrend.slice(-days);
}

export async function getLeaveTrend(): Promise<LeaveTrend[]> {
  await delay();
  return mockLeaveTrend;
}

export async function getPayrollOverview(): Promise<PayrollOverview[]> {
  await delay();
  return mockPayrollOverview;
}

export async function getDepartmentSummary(): Promise<DepartmentSummary[]> {
  await delay();
  return mockDepartmentSummary;
}

export async function getAdminKPIs() {
  await delay();
  return {
    totalEmployees: mockEmployees.length,
    presentToday: mockAttendance.filter(
      (a) => a.date === new Date().toISOString().split('T')[0] && a.status === 'present'
    ).length,
    pendingLeaves: mockLeaveRequests.filter((l) => l.status === 'pending').length,
    attendanceIssues: mockAttendance.filter(
      (a) => a.date === new Date().toISOString().split('T')[0] && a.status === 'absent'
    ).length,
  };
}
