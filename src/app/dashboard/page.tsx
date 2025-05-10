import Dashboard from "@/components/Dashboard";
import { fetchRecordsFromMongoDB } from "@/lib/mongodbService";
import type { SalaryRecord } from "@/types";

export default async function DashboardPage() {
  let records: SalaryRecord[] = [];
  
  try {
    records = await fetchRecordsFromMongoDB();
  } catch (error) {
    console.error('Error fetching records:', error);
  }

  return (
    <div className="p-6">
      <Dashboard records={records} />
    </div>
  );
}