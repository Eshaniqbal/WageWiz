export interface SalaryRecord {
  id: string; // UUID for the salary record
  workerId: string;
  workerName: string;
  department?: string; // Made optional
  joiningDate: string; // YYYY-MM-DD
  salaryMonthYear: string; // YYYY-MM
  basicSalary: number;
  advancePayment?: number; // Optional: amount paid in advance
  pendingBalance?: number; // Optional: pending amount employee owes company
  // netSalary is calculated: basicSalary - (advancePayment || 0) - (pendingBalance || 0)
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

