"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart3, DollarSign, Users, TrendingUp } from 'lucide-react';
import type { SalaryRecord } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard({ records }: { records: SalaryRecord[] }) {
  const [analytics, setAnalytics] = useState({
    totalSalary: 0,
    averageSalary: 0,
    totalWorkers: 0,
    departmentStats: [] as { name: string; value: number }[],
    monthlyTrend: [] as { month: string; amount: number }[]
  });

  useEffect(() => {
    if (records.length > 0) {
      // Calculate total and average salary
      const totalSalary = records.reduce((sum, record) => sum + record.basicSalary, 0);
      const averageSalary = totalSalary / records.length;

      // Calculate department statistics
      const departmentMap = new Map<string, number>();
      records.forEach(record => {
        const dept = record.department || 'Unassigned';
        departmentMap.set(dept, (departmentMap.get(dept) || 0) + record.basicSalary);
      });

      const departmentStats = Array.from(departmentMap.entries()).map(([name, value]) => ({
        name,
        value
      }));

      // Calculate monthly trends
      const monthlyMap = new Map<string, number>();
      records.forEach(record => {
        const month = record.salaryMonthYear;
        monthlyMap.set(month, (monthlyMap.get(month) || 0) + record.basicSalary);
      });

      const monthlyTrend = Array.from(monthlyMap.entries())
        .map(([month, amount]) => ({ month, amount }))
        .sort((a, b) => a.month.localeCompare(b.month));

      setAnalytics({
        totalSalary,
        averageSalary,
        totalWorkers: records.length,
        departmentStats,
        monthlyTrend
      });
    }
  }, [records]);

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Worker ID',
      'Worker Name',
      'Department',
      'Joining Date',
      'Salary Month Year',
      'Basic Salary',
      'Advance Payment',
      'Pending Balance',
      'Created At',
      'Updated At'
    ];

    const csvContent = [
      headers.join(','),
      ...records.map(record => [
        record.id,
        record.workerId,
        record.workerName,
        record.department || '',
        record.joiningDate,
        record.salaryMonthYear,
        record.basicSalary,
        record.advancePayment || 0,
        record.pendingBalance || 0,
        record.createdAt,
        record.updatedAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `salary_records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleExportCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{analytics.totalSalary.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{Math.round(analytics.averageSalary).toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalWorkers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salary Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.monthlyTrend.length > 0 ? '↑' : '-'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Salary Trend</CardTitle>
            <CardDescription>Salary distribution over months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#8884d8" name="Total Salary" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Salary distribution by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.departmentStats}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {analytics.departmentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 