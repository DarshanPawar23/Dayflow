@'
# Dayflow — Human Resource Management System

> A modern, role-based Human Resource Management System for managing employees, attendance, leave, payroll, and employee profiles.

## 📌 Overview

Dayflow HRMS is a full-stack Human Resource Management System designed to simplify and digitize daily HR operations.

The system provides two main roles:

- **HR / Admin**
- **Employee**

HR/Admin users can manage employees, attendance, leave requests, and payroll, while employees can manage their own profile, attendance, leave requests, and view their salary information.

---

## ✨ Key Features

### 🔐 Authentication

- HR/Admin signup
- Company registration
- Company logo upload
- Secure login
- JWT-based authentication
- Role-based authorization
- Protected API routes
- Employee temporary password
- Mandatory password change for new employees

### 👨‍💼 Employee Management

HR/Admin can:

- Create employees
- View all employees
- View employee details
- Search employees
- Edit employee information
- Upload/view employee profile images
- Deactivate employees
- Delete employees

### 👤 Employee Profile

Employees can:

- View their own profile
- View employee ID
- View name
- View email
- View phone number
- View role
- View joining year
- View company information
- Upload/change profile picture
- Change password
- Edit permitted profile information

### ⏱️ Attendance Management

Employees can:

- Check in
- Check out
- View their attendance history
- View working hours
- View extra hours
- View attendance status

The system prevents:

- Multiple check-ins on the same working session
- Check-out before check-in
- Multiple check-outs after already checking out

HR/Admin can:

- View all employee attendance
- View individual employee attendance
- Filter attendance by employee
- Filter attendance by date
- View Present records
- View Absent records
- View Leave records
- View Half-day records
- View check-in/check-out times
- View working hours
- View extra hours

### 📝 Leave Management

Employees can:

- Apply for leave
- Select leave type
- Select start date
- Select end date
- Enter leave reason
- Upload medical certificate for sick leave
- View their own leave requests
- View request status

Supported leave types:

- Paid Leave
- Sick Leave
- Unpaid Leave

HR/Admin can:

- View all leave requests
- View pending requests
- View leave details
- Approve leave
- Reject leave
- Add rejection reason

Leave statuses:

- `PENDING`
- `APPROVED`
- `REJECTED`

### 💰 Payroll Management

HR/Admin can:

- Select an employee
- Enter monthly salary
- Generate payroll
- Automatically calculate salary components
- Calculate attendance-based payable days
- Calculate paid leave
- Calculate unpaid leave
- Calculate absent days
- Calculate deductions
- Calculate net salary
- View payroll records
- Mark payroll as paid

Employees can:

- View their own salary
- View salary breakdown
- View gross salary
- View deductions
- View net salary
- View payroll history

Employee payroll information is read-only.

---

# 🏗️ System Architecture

```text
                    DAYFLOW HRMS
                         │
                         ▼
                 Authentication
                         │
              ┌──────────┴──────────┐
              │                     │
             HR                 EMPLOYEE
              │                     │
              ▼                     ▼
        HR Dashboard          Employee Dashboard
              │                     │
       ┌──────┼────────┐       ┌────┼────────┐
       │      │        │       │    │        │
       ▼      ▼        ▼       ▼    ▼        ▼
   Employees Attendance Leave Profile Attendance Leave
       │      │        │                     │
       │      │        ▼                     ▼
       │      │   Approve / Reject         Apply
       │      │
       └──────┴──────────────┐
                             ▼
                          Payroll
                             │
                             ▼
                       Salary Details
