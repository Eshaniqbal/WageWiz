"use client";

import type { SalaryRecord } from '@/types';

const SALARY_RECORDS_KEY = 'wageWizSalaryRecords';

export function getSalaryRecords(): SalaryRecord[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const recordsJson = localStorage.getItem(SALARY_RECORDS_KEY);
  return recordsJson ? JSON.parse(recordsJson) : [];
}

export function saveSalaryRecords(records: SalaryRecord[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(SALARY_RECORDS_KEY, JSON.stringify(records));
}

export function addSalaryRecord(record: SalaryRecord): SalaryRecord[] {
  const records = getSalaryRecords();
  const updatedRecords = [...records, record];
  saveSalaryRecords(updatedRecords);
  return updatedRecords;
}

export function updateSalaryRecord(updatedRecord: SalaryRecord): SalaryRecord[] {
  let records = getSalaryRecords();
  records = records.map(record =>
    record.id === updatedRecord.id ? updatedRecord : record
  );
  saveSalaryRecords(records);
  return records;
}

export function deleteSalaryRecord(recordId: string): SalaryRecord[] {
  let records = getSalaryRecords();
  records = records.filter(record => record.id !== recordId);
  saveSalaryRecords(records);
  return records;
}
