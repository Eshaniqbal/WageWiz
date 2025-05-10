import WageWizClient from "@/components/WageWizClient";
import { fetchRecordsFromMongoDB } from "@/lib/mongodbService";

export default async function Home() {
  let records = [];
  
  try {
    records = await fetchRecordsFromMongoDB();
  } catch (error) {
    console.error('Error fetching records:', error);
  }

  return (
    <div className="p-6">
      <WageWizClient />
    </div>
  );
}
