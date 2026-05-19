export type HrCategory = "payslips" | "vacations" | "expenses";

export type Payslip = {
  date: string;
  grossSalary: number;
  netSalary: number;
  bonuses: number | null;
  deductions: number;
  currency: string;
  department: string;
};

export type VacationEntry = {
  startDate: string;
  endDate: string;
  durationDays: number;
  type: string;
};

export type VacationSummary = {
  totalDaysAvailable: number;
  totalDaysTaken: number;
  remainingDays: number;
  vacationsTaken: VacationEntry[];
};

export type ExpenseItem = {
  date: string;
  description: string;
  amount: number;
  paymentMethod: string;
};

export type ExpenseCategory = {
  name: string;
  items: ExpenseItem[];
};

export type Expenses = {
  month: string;
  totalAmount: number;
  categories: ExpenseCategory[];
};

export type EmployeeRecord = {
  name: string;
  department: string;
  payslips: Payslip[];
  vacations: VacationSummary;
  expenses: Expenses;
};

export type HrMockData = {
  employees: EmployeeRecord[];
};

export type HrInsightsProps = {
  "jcr:title"?: string;
  "eui:description"?: string;
  "eui:category"?: HrCategory;
};
