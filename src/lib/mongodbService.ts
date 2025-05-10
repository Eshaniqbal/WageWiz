import type { SalaryRecord } from '@/types';

// Get the base URL based on environment
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser should use relative path
    return '';
  }
  
  if (process.env.VERCEL_URL) {
    // Reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  }
  
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    // Reference for vercel.com
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  
  // Assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

const API_BASE_URL = getBaseUrl();

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
      const error = await response.json();
      throw new Error(error.error || 'Failed to sync record');
    }

    return true;
  } catch (error) {
    console.error('Error syncing to MongoDB:', error);
    throw error;
  }
}

export async function fetchRecordsFromMongoDB(): Promise<SalaryRecord[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/salary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch records');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching from MongoDB:', error);
    throw error;
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
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete record');
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error deleting from MongoDB:', error);
    throw error;
  }
} 