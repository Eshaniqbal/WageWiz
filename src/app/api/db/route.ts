import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import type { SalaryRecord } from '@/types';

async function getCollection() {
  try {
    const client = await clientPromise;
    const db = client.db('wagewiz');
    return db.collection<SalaryRecord>('salaryRecords');
  } catch (error) {
    console.error('Failed to get collection:', error);
    throw new Error('Database connection failed');
  }
}

export async function GET() {
  try {
    const collection = await getCollection();
    const records = await collection.find({}).toArray();
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch records' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const record: SalaryRecord = await request.json();
    const collection = await getCollection();
    
    await collection.updateOne(
      { id: record.id },
      { $set: record },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error syncing record:', error);
    return NextResponse.json(
      { error: 'Failed to sync record' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const collection = await getCollection();
    
    const result = await collection.deleteOne({ id });
    return NextResponse.json({ success: result.deletedCount > 0 });
  } catch (error) {
    console.error('Error deleting record:', error);
    return NextResponse.json(
      { error: 'Failed to delete record' },
      { status: 500 }
    );
  }
} 