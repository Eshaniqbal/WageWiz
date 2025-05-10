export interface Payment {
  id: string;
  amount: number;
  date: string;
  type: 'salary' | 'advance' | 'bonus';
  notes?: string;
}

export interface SalaryRecord {
  id: string; // UUID for the salary record
  workerId: string;
  workerName: string;
  phoneNumber: string;
  department: string;
  joiningDate: string; // YYYY-MM-DD
  salaryMonthYear: string; // YYYY-MM
  basicSalary: number;
  advancePayment: number;
  pendingBalance: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

