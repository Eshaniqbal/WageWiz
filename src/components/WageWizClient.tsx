"use client";

import { useState, useEffect, useCallback } from 'react';
import AppHeader from '@/components/AppHeader';
import WorkerSalaryDialog from '@/components/WorkerSalaryDialog';
import SalaryTable from '@/components/SalaryTable';
import PreviewSlipDialog from '@/components/PreviewSlipDialog'; // Import the new dialog
import type { SalaryRecord } from '@/types';
import {
  getSalaryRecords as getRecordsFromLocal,
  addSalaryRecord as addRecordToLocal,
  updateSalaryRecord as updateRecordInLocal,
  deleteSalaryRecord as deleteRecordFromLocal,
} from '@/lib/localStorage';
import { generateSalarySlipPdf } from '@/lib/pdfGenerator';
import { syncRecordToMongoDB, deleteRecordFromMongoDB, fetchRecordsFromMongoDB } from '@/lib/mongodbService';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

export default function WageWizClient() {
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);
  const [isSalaryDialogOpen, setIsSalaryDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SalaryRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreviewSlipDialogOpen, setIsPreviewSlipDialogOpen] = useState(false);
  const [previewingRecord, setPreviewingRecord] = useState<SalaryRecord | null>(null);
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    workerId: '',
    workerName: '',
    department: '',
    joiningDate: '',
    salaryMonthYear: '',
    basicSalary: 0,
    advancePayment: 0,
    pendingBalance: 0,
  });

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

    const syncSuccess = await syncRecordToMongoDB(record);
    if (syncSuccess) {
      toast({ title: "Sync Successful", description: "Record synced with MongoDB.", variant: "default" });
    } else {
      toast({ title: "Sync Failed", description: "Failed to sync with MongoDB. Data saved locally.", variant: "destructive" });
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    const updatedRecords = deleteRecordFromLocal(recordId);
    setSalaryRecords(updatedRecords);
    
    const deleteSuccess = await deleteRecordFromMongoDB(recordId);
    if (deleteSuccess) {
      toast({ title: "Record Deleted", description: "Salary record deleted from database.", variant: "destructive" });
    } else {
      toast({ title: "Delete Failed", description: "Failed to delete from database. Record deleted locally.", variant: "destructive" });
    }
  };

  const handleDownloadSlip = (record: SalaryRecord) => {
    generateSalarySlipPdf(record)
      .then(() => {
        toast({ title: "Salary Slip Generated", description: `PDF slip for ${record.workerName} is downloading.` });
      })
      .catch(error => {
        console.error("PDF generation error:", error);
        toast({ title: "PDF Error", description: "Could not generate salary slip.", variant: "destructive"});
      });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
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
                onDownloadSlip={handleDownloadSlip}
                onPreviewSlip={handleOpenPreviewSlipDialog} // Pass the new handler
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
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Add New Worker</DialogTitle>
            <DialogDescription>
              Enter the worker's details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workerId">Worker ID</Label>
                <Input
                  id="workerId"
                  value={newRecord.workerId}
                  onChange={(e) => setNewRecord({ ...newRecord, workerId: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workerName">Worker Name</Label>
                <Input
                  id="workerName"
                  value={newRecord.workerName}
                  onChange={(e) => setNewRecord({ ...newRecord, workerName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newRecord.department}
                  onChange={(e) => setNewRecord({ ...newRecord, department: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input
                  id="joiningDate"
                  type="date"
                  value={newRecord.joiningDate}
                  onChange={(e) => setNewRecord({ ...newRecord, joiningDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMonthYear">Salary Month Year</Label>
                <Input
                  id="salaryMonthYear"
                  type="month"
                  value={newRecord.salaryMonthYear}
                  onChange={(e) => setNewRecord({ ...newRecord, salaryMonthYear: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="basicSalary">Basic Salary</Label>
                <Input
                  id="basicSalary"
                  type="number"
                  value={newRecord.basicSalary}
                  onChange={(e) => setNewRecord({ ...newRecord, basicSalary: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="advancePayment">Advance Payment</Label>
                <Input
                  id="advancePayment"
                  type="number"
                  value={newRecord.advancePayment}
                  onChange={(e) => setNewRecord({ ...newRecord, advancePayment: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pendingBalance">Pending Balance</Label>
                <Input
                  id="pendingBalance"
                  type="number"
                  value={newRecord.pendingBalance}
                  onChange={(e) => setNewRecord({ ...newRecord, pendingBalance: Number(e.target.value) })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Worker</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
       <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border mt-auto">
        WageWiz &copy; {new Date().getFullYear()} - Streamlined Salary Management
      </footer>
    </div>
  );
}
