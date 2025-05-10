"use client";

import { useState, useEffect, useCallback } from 'react';
import AppHeader from '@/components/AppHeader';
import WorkerSalaryDialog from '@/components/WorkerSalaryDialog';
import SalaryTable from '@/components/SalaryTable';
import PreviewSlipDialog from '@/components/PreviewSlipDialog';
import type { SalaryRecord } from '@/types';
import {
  getSalaryRecords as getRecordsFromLocal,
  addSalaryRecord as addRecordToLocal,
  updateSalaryRecord as updateRecordInLocal,
  deleteSalaryRecord as deleteRecordFromLocal,
} from '@/lib/localStorage';
import { generatePDF } from '@/lib/pdfGenerator';
import { syncRecordToMongoDB, deleteRecordFromMongoDB, fetchRecordsFromMongoDB } from '@/lib/mongodbService';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function WageWizClient() {
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);
  const [isSalaryDialogOpen, setIsSalaryDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SalaryRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreviewSlipDialogOpen, setIsPreviewSlipDialogOpen] = useState(false);
  const [previewingRecord, setPreviewingRecord] = useState<SalaryRecord | null>(null);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const mongoRecords = await fetchRecordsFromMongoDB();
      if (mongoRecords.length > 0) {
        setSalaryRecords(mongoRecords);
        // Update local storage with MongoDB data
        mongoRecords.forEach(record => {
          addRecordToLocal(record);
        });
      } else {
        // Fallback to local storage if no MongoDB records
        const localRecords = getRecordsFromLocal();
        setSalaryRecords(localRecords);
      }
    } catch (error) {
      console.error('Failed to load data from MongoDB:', error);
      // Fallback to local storage
      const localRecords = getRecordsFromLocal();
      setSalaryRecords(localRecords);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenSalaryDialog = (record?: SalaryRecord) => {
    setEditingRecord(record || null);
    setIsSalaryDialogOpen(true);
  };

  const handleCloseSalaryDialog = () => {
    setIsSalaryDialogOpen(false);
    setEditingRecord(null);
  };

  const handleOpenPreviewSlipDialog = (record: SalaryRecord) => {
    setPreviewingRecord(record);
    setIsPreviewSlipDialogOpen(true);
  };

  const handleClosePreviewSlipDialog = () => {
    setIsPreviewSlipDialogOpen(false);
    setPreviewingRecord(null);
  };

  const handleSaveRecord = async (record: SalaryRecord) => {
    let updatedRecords;
    if (editingRecord) {
      updatedRecords = updateRecordInLocal(record);
      toast({ title: "Record Updated", description: `${record.workerName}'s salary for ${record.salaryMonthYear} updated locally.` });
    } else {
      updatedRecords = addRecordToLocal(record);
      toast({ title: "Record Added", description: `${record.workerName}'s salary for ${record.salaryMonthYear} added locally.` });
    }
    setSalaryRecords(updatedRecords);

    try {
      await syncRecordToMongoDB(record);
      toast({ title: "Sync Successful", description: "Record synced with MongoDB.", variant: "default" });
    } catch (error) {
      toast({ title: "Sync Failed", description: "Failed to sync with MongoDB. Data saved locally.", variant: "destructive" });
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    const updatedRecords = deleteRecordFromLocal(recordId);
    setSalaryRecords(updatedRecords);
    
    try {
      await deleteRecordFromMongoDB(recordId);
      toast({ title: "Record Deleted", description: "Salary record deleted from database.", variant: "destructive" });
    } catch (error) {
      toast({ title: "Delete Failed", description: "Failed to delete from database. Record deleted locally.", variant: "destructive" });
    }
  };

  const handleGeneratePDF = async (record: SalaryRecord) => {
    try {
      await generatePDF(record);
      toast({
        title: "Success",
        description: "PDF generated successfully",
      });
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader onAddEntry={() => handleOpenSalaryDialog()} />
      <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-accent" />
            <p className="ml-4 text-lg text-muted-foreground">Loading salary data...</p>
          </div>
        ) : (
          <Card className="shadow-2xl rounded-xl overflow-hidden border-border">
            <CardHeader className="bg-muted/30 border-b border-border">
              <CardTitle className="text-2xl font-bold text-accent">Salary Ledger</CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage and view all employee salary records.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <SalaryTable
                records={salaryRecords}
                onEdit={handleOpenSalaryDialog}
                onDelete={handleDeleteRecord}
                onDownloadSlip={handleGeneratePDF}
                onPreviewSlip={handleOpenPreviewSlipDialog}
              />
            </CardContent>
          </Card>
        )}
      </main>
      <WorkerSalaryDialog
        isOpen={isSalaryDialogOpen}
        onClose={handleCloseSalaryDialog}
        onSave={handleSaveRecord}
        existingRecord={editingRecord}
      />
      <PreviewSlipDialog
        isOpen={isPreviewSlipDialogOpen}
        onClose={handleClosePreviewSlipDialog}
        record={previewingRecord}
      />
      <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border mt-auto">
        WageWiz &copy; {new Date().getFullYear()} - Streamlined Salary Management
      </footer>
    </div>
  );
}
