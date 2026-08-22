# DAYFLOW — Human Resource Management System

> A premium, production-quality HRMS frontend built with Next.js, TypeScript, and Tailwind CSS.  
> **Frontend only.** All data is mocked and API-ready — swap for a real backend without touching UI code.

---

## Live Preview

Start the development server and open [http://localhost:3000](http://localhost:3000).

```bash
cd dayflow-build
npm run dev
```

### Demo Accounts

| Role     | Email                        | Password     |
|----------|------------------------------|--------------|
| Employee | alex.morgan@dayflow.co       | any password |
| Admin/HR | sarah.johnson@dayflow.co     | any password |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) (App Router) | Framework & routing |
| [TypeScript](https://www.typescriptlang.org/) | Static typing |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling & design tokens |
| [Framer Motion](https://www.framer.com/motion/) | Animations & page transitions |
| [Recharts](https://recharts.org/) | Charts & analytics visualizations |
| [Lucide React](https://lucide.dev/) | Icon library |
| [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | Conditional class utilities |

---

## Project Structure

```
dayflow-build/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, metadata, AuthProvider)
│   ├── globals.css               # Global styles, design tokens, glass utilities
│   ├── page.tsx                  # Landing page (/)
│   │
│   ├── auth/
│   │   ├── signin/page.tsx       # Sign In — split screen, role-based redirect
│   │   ├── signup/page.tsx       # Sign Up — password strength meter, role select
│   │   └── verify/page.tsx       # Email Verification — resend & open email app
│   │
│   ├── dashboard/                # Employee Dashboard
│   │   ├── layout.tsx            # Auth guard (employee)
│   │   └── page.tsx              # Live check-in timer, KPI cards, quick actions
│   │
│   ├── attendance/               # Employee Attendance
│   │   ├── layout.tsx
│   │   └── page.tsx              # Weekly calendar, day detail panel, records list
│   │
│   ├── leave/                    # Employee Leave / Time Off
│   │   ├── layout.tsx
│   │   └── page.tsx              # Balance cards, request list, modal form
│   │
│   ├── payroll/                  # Employee Payroll
│   │   ├── layout.tsx
│   │   └── page.tsx              # Salary breakdown, deductions, view payslip
│   │
│   ├── profile/                  # Employee Profile
│   │   ├── layout.tsx
│   │   └── page.tsx              # Tabbed profile, edit phone/address
│   │
│   ├── settings/                 # Settings (all roles)
│   │   ├── layout.tsx
│   │   └── page.tsx              # Account, Notifications, Security, Appearance
│   │
│   └── admin/
│       ├── layout.tsx            # Auth guard (admin only)
│       ├── dashboard/page.tsx    # KPIs, attendance chart, dept summary, approvals
│       ├── employees/
│       │   ├── page.tsx          # Directory — search, filter, sortable table
│       │   └── [id]/page.tsx     # Employee detail — full edit capability
│       ├── attendance/page.tsx   # Matrix (employees × week), status dots
│       ├── leave/page.tsx        # 3-panel: filter → cards → approve/reject
│       ├── payroll/page.tsx      # Salary table + inline editor panel
│       └── reports/page.tsx      # Recharts visualizations, time range filter
│
├── components/
│   ├── ui/
│   │   ├── GlassCard.tsx         # Hover-lift card with glass surface
│   │   ├── GlassButton.tsx       # Primary / Secondary / Ghost / Danger variants
│   │   ├── StatusBadge.tsx       # All entity statuses (attendance, leave, payroll)
│   │   ├── Avatar.tsx            # Image or warm-colored initials fallback
│   │   ├── KPICard.tsx           # Animated metric card with trend indicator
│   │   ├── DataTable.tsx         # Generic typed table with row click
│   │   ├── Modal.tsx             # Scale + blur modal with escape key support
│   │   ├── Drawer.tsx            # Slide-in drawer (right or left)
│   │   ├── Tabs.tsx              # Animated pill tabs (Framer layoutId)
│   │   ├── SearchBar.tsx         # Accessible search input with icon
│   │   ├── LoadingState.tsx      # Shimmer skeleton components
│   │   └── States.tsx            # EmptyState and ErrorState components
│   │
│   ├── layout/
│   │   ├── AppShell.tsx          # Sidebar + Topbar + page transitions wrapper
│   │   ├── Sidebar.tsx           # Collapsible sidebar, role-filtered nav
│   │   ├── Topbar.tsx            # Search, notification bell, user avatar
│   │   └── MobileBottomNav.tsx   # Bottom nav for mobile (role-aware)
│   │
│   └── notifications/
│       └── NotificationPanel.tsx # Category icons, unread state, mark-read
│
└── lib/
    ├── types.ts                  # All TypeScript interfaces & type aliases
    ├── mock-data.ts              # Realistic typed datasets (employees, attendance, etc.)
    ├── api.ts                    # API-ready service functions returning mock data
    ├── auth-context.tsx          # AuthContext — login, logout, localStorage session
    └── utils.ts                  # cn, formatCurrency, formatDate, getGreeting, etc.
```

---

## Pages & Routes

### Public

| Route | Description |
|---|---|
| `/` | Landing page — hero, features, demo credentials |
| `/auth/signin` | Sign in with role-based redirect (employee → `/dashboard`, admin → `/admin/dashboard`) |
| `/auth/signup` | Create account with live password strength indicator |
| `/auth/verify` | Email verification screen with resend and open-email-app actions |

### Employee (requires auth)

| Route | Description |
|---|---|
| `/dashboard` | Greeting, live check-in/out with animated ring timer, KPI cards, quick actions |
| `/attendance` | Weekly calendar view, click-for-detail, records table |
| `/leave` | Leave balance progress bars, request list, "Request Leave" modal |
| `/payroll` | Net salary hero card, earnings + deductions breakdown, view payslip |
| `/profile` | Personal / Job / Salary / Documents tabs; editable fields with save confirmation |
| `/settings` | Account, Notifications toggles, Security, Appearance (light/system/dark) |

### Admin / HR (requires auth + admin role)

| Route | Description |
|---|---|
| `/admin/dashboard` | KPIs (employees, present, leave requests, issues), 14-day attendance bar chart, dept summary, pending approvals |
| `/admin/employees` | Searchable + filterable employee directory; click row → details |
| `/admin/employees/[id]` | Full employee profile with edit/save/cancel across all tabs |
| `/admin/attendance` | Weekly attendance matrix (employees × dates) with legend |
| `/admin/leave` | Three-panel leave approval center — filter, review, approve/reject with comment |
| `/admin/payroll` | Salary table by month + slide-over salary editor with net preview |
| `/admin/reports` | Four Recharts visualizations (area, bar, line, progress bars) + 7D/30D/90D range selector + generate report cards |

---

## Design System

### Palette

All colors are **low-saturation and warm-toned**. No neon, no glow, no electric colors.

| Token | Hex | Usage |
|---|---|---|
| `ivory` | `#FDFAF5` | Page background |
| `cream` | `#F8F4EC` | Secondary background |
| `parchment` | `#F2EDE3` | Subtle sections |
| `sand` | `#EBE3D5` | Card backgrounds |
| `beige` | `#E2D9C8` | Borders, dividers |
| `taupe` | `#C8BDB0` | Muted borders |
| `stone` | `#A89F96` | Placeholder text |
| `warm-gray` | `#857D77` | Body text, secondary |
| `charcoal` | `#2C2825` | Primary text, buttons |
| `espresso` | `#1A1612` | Darkest text |
| `olive` | `#7A8B6E` | Primary accent |
| `sage` | `#9EAD92` | Secondary accent |
| `clay` | `#A07060` | Tertiary accent |

### Glassmorphism

```css
/* Base glass surface */
background: rgba(253, 250, 245, 0.72);
backdrop-filter: blur(20px) saturate(140%);
border: 1px solid rgba(200, 189, 176, 0.35);
box-shadow: 0 4px 32px 0 rgba(44, 40, 37, 0.08);
```

Warm frosted glass — not sci-fi holographic. Ivory/beige overlays, soft blur, taupe borders.

### Animation Principles

- **Page transitions:** fade + blur + subtle vertical movement (Framer Motion `AnimatePresence`)
- **Cards:** staggered entrance (delay per index), gentle lift on hover (`y: -2`)
- **Buttons:** `scale: 1.02` hover, `scale: 0.97` tap — spring physics
- **Check-in ring:** SVG `strokeDashoffset` animated with `easeOut`
- **Tab indicator:** `layoutId` shared element transition
- **Charts:** animate in on viewport entry (`useInView`)

---

## Mock Data & API Layer

All data lives in [`lib/mock-data.ts`](./lib/mock-data.ts) and is served through typed service functions in [`lib/api.ts`](./lib/api.ts).

### Service Functions (API-ready)

```typescript
// Drop-in replace with real API — just change the implementation, not the call sites
getEmployees(): Promise<Employee[]>
getEmployee(id: string): Promise<Employee | null>
getAttendance(employeeId: string): Promise<AttendanceRecord[]>
getLeaveRequests(employeeId?: string): Promise<LeaveRequest[]>
getLeaveBalance(employeeId: string): Promise<LeaveBalance | null>
submitLeaveRequest(data): Promise<LeaveRequest>
reviewLeaveRequest(id, action, comment?): Promise<LeaveRequest>
getPayroll(employeeId?, month?): Promise<PayrollRecord[]>
getPayrollKPIs(): Promise<KPIData>
getNotifications(): Promise<Notification[]>
getAttendanceTrend(days?): Promise<AttendanceTrend[]>
getLeaveTrend(): Promise<LeaveTrend[]>
getPayrollOverview(): Promise<PayrollOverview[]>
getAdminKPIs(): Promise<AdminKPIs>
signIn(email, password): Promise<AuthUser | null>
```

Each function simulates a network delay (300–800ms). When you're ready to connect a real backend, replace the body of each function with a `fetch()` call — the types and call sites stay exactly the same.

---

## Authentication

Authentication is simulated with a mock `AuthContext` that persists to `localStorage`.

- **Sign in** → stores user in state + localStorage
- **Sign out** → clears state + localStorage
- **Route guards** → each layout checks `user` and redirects to `/auth/signin` if unauthenticated
- **Admin guard** → `/admin/*` layouts additionally check `user.role === 'admin'`

```typescript
// Usage anywhere in the app
const { user, login, logout } = useAuth();
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run

```bash
# Navigate to the project
cd "day flow f/dayflow-build"

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## Connecting a Real Backend

1. **Replace service functions** in `lib/api.ts` with real `fetch` / `axios` calls
2. **Update `AuthContext`** in `lib/auth-context.tsx` to call your real auth endpoint and store a JWT
3. **Add middleware** (`middleware.ts` in project root) to enforce route protection server-side
4. **Remove mock data** from `lib/mock-data.ts` once APIs are live

The TypeScript interfaces in `lib/types.ts` define the exact shape your API should return. All UI components are typed against these interfaces — no changes needed to component code.

---

## Accessibility

- Semantic HTML throughout (`<nav>`, `<main>`, `<header>`, `<aside>`)
- All form fields have associated `<label>` elements
- Keyboard navigable — tabs, modals, drawers support `Escape` to close
- Visible focus rings on all interactive elements
- `aria-label` on icon-only buttons
- `aria-current="page"` on active nav items
- `role="switch"` + `aria-checked` on toggle controls

---

## Responsive Design

| Breakpoint | Layout |
|---|---|
| Mobile (`< 768px`) | Single column, bottom tab bar, no sidebar, tables → cards |
| Tablet (`768px–1024px`) | Collapsible sidebar, 2-column grids |
| Desktop (`> 1024px`) | Full sidebar (collapsible), multi-column layouts, full data tables |

---

## License

MIT — free to use, modify, and distribute.

---

*Built with DAYFLOW — quiet, human, and timeless.*
