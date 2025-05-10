import type { SalaryRecord } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function syncRecordToMongoDB(record: SalaryRecord): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/salary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      throw new Error('Failed to sync record');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Failed to sync record to MongoDB:', error);
    return false;
  }
}

export async function fetchRecordsFromMongoDB(): Promise<SalaryRecord[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/salary`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch records');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch records from MongoDB:', error);
    return [];
  }
}

export async function deleteRecordFromMongoDB(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/salary`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete record');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Failed to delete record from MongoDB:', error);
    return false;
  }
} 