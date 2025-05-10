import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import type { SalaryRecord } from '@/types';

const client = new MongoClient(process.env.MONGODB_URI!);
const dbName = 'salary-management';

async function connectToDatabase() {
  if (!client.connect()) {
    await client.connect();
  }
  return client.db(dbName);
}

export async function POST(request: Request) {
  try {
    const record: SalaryRecord = await request.json();
    const db = await connectToDatabase();
    const collection = db.collection('salary-records');

    await collection.updateOne(
      { id: record.id },
      { $set: record },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to sync record:', error);
    return NextResponse.json({ success: false, error: 'Failed to sync record' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const db = await connectToDatabase();
    const collection = db.collection('salary-records');

    const result = await collection.deleteOne({ id });
    return NextResponse.json({ success: result.deletedCount > 0 });
  } catch (error) {
    console.error('Failed to delete record:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete record' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('salary-records');
    const records = await collection.find({}).toArray();
    return NextResponse.json(records);
  } catch (error) {
    console.error('Failed to fetch records:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch records' }, { status: 500 });
  }
} 