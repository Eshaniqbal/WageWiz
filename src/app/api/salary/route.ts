import { NextResponse } from 'next/server';
import { MongoClient, MongoClientOptions } from 'mongodb';
import type { SalaryRecord } from '@/types';

async function getCollection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please add your Mongo URI to .env.local');
  }
  const options: MongoClientOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    authSource: 'admin',
    retryWrites: true
  };

  let client: MongoClient;
  let clientPromise: Promise<MongoClient>;

  if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

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