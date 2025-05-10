"use client";

import type { FC } from 'react';
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit3, Trash2, Download, Filter, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { SalaryRecord } from "@/types";

interface SalaryTableProps {
  records: SalaryRecord[];
  onEdit: (record: SalaryRecord) => void;
  onDelete: (recordId: string) => void;
  onDownloadSlip: (record: SalaryRecord) => void;
  onPreviewSlip: (record: SalaryRecord) => void;
}

const ITEMS_PER_PAGE = 10;

const SalaryTable: FC<SalaryTableProps> = ({ records, onEdit, onDelete, onDownloadSlip, onPreviewSlip }) => {
  const [filterName, setFilterName] = useState("");
  const [filterMonth, setFilterMonth] = useState(""); // YYYY-MM
  const [currentPage, setCurrentPage] = useState(1);
  const [recordToDelete, setRecordToDelete] = useState<SalaryRecord | null>(null);

  const calculateNetSalary = (record: SalaryRecord): number => {
    return record.basicSalary - (record.advancePayment || 0) - (record.pendingBalance || 0);
  };

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const nameMatch = record.workerName.toLowerCase().includes(filterName.toLowerCase());
      const monthMatch = filterMonth ? record.salaryMonthYear.startsWith(filterMonth) : true;
      return nameMatch && monthMatch;
    }).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [records, filterName, filterMonth]);

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRecords, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  const handleDeleteConfirm = () => {
    if (recordToDelete) {
      onDelete(recordToDelete.id);
      setRecordToDelete(null);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 p-4 sm:p-6 md:p-8 bg-card shadow-lg rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4 items-center p-4 border border-border rounded-lg bg-background/50">
          <Filter className="h-6 w-6 text-muted-foreground sm:mr-2" />
          <Input
            placeholder="Filter by Worker Name..."
            value={filterName}
            onChange={(e) => { setFilterName(e.target.value); setCurrentPage(1); }}
            className="flex-grow max-w-xs"
            aria-label="Filter by Worker Name"
          />
          <Input
            placeholder="Filter by Salary Month (YYYY-MM)..."
            value={filterMonth}
            onChange={(e) => { setFilterMonth(e.target.value); setCurrentPage(1); }}
            className="flex-grow max-w-xs"
            type="text" 
            pattern="\d{4}-(0[1-9]|1[0-2])?" 
            aria-label="Filter by Salary Month"
          />
        </div>

        {paginatedRecords.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p className="text-xl">No salary records found.</p>
            <p>Try adjusting your filters or adding new entries.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/60">
                  <TableHead className="font-semibold">Worker Name</TableHead>
                  <TableHead className="font-semibold">Salary Month</TableHead>
                  <TableHead className="font-semibold text-right">Basic Salary (₹)</TableHead>
                  <TableHead className="font-semibold text-right">Advance (₹)</TableHead>
                  <TableHead className="font-semibold text-right">Pending Bal (₹)</TableHead>
                  <TableHead className="font-semibold text-right">Net Salary (₹)</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.map((record) => (
                  <TableRow key={record.id} className="hover:bg-muted/30">
                    <TableCell>{record.workerName}</TableCell>
                    <TableCell>{record.salaryMonthYear}</TableCell>
                    <TableCell className="text-right">₹{record.basicSalary.toFixed(2)}</TableCell>
                    <TableCell className="text-right">₹{(record.advancePayment || 0).toFixed(2)}</TableCell>
                    <TableCell className="text-right">₹{(record.pendingBalance || 0).toFixed(2)}</TableCell>
                    <TableCell className="text-right">₹{calculateNetSalary(record).toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-1 sm:space-x-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => onPreviewSlip(record)} className="text-indigo-600 hover:text-indigo-700" aria-label={`Preview salary slip for ${record.workerName}`}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                           <TooltipContent className="bg-background border-border shadow-lg">
                            <p>Preview Slip</p>
                          </TooltipContent>
                        </Tooltip>
                         <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => onEdit(record)} className="text-blue-600 hover:text-blue-700" aria-label={`Edit record for ${record.workerName}`}>
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-background border-border shadow-lg">
                            <p>Edit Record</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setRecordToDelete(record)} 
                              className="text-red-600 hover:text-red-700" 
                              aria-label={`Delete record for ${record.workerName}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-background border-border shadow-lg">
                            <p>Delete Record</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => onDownloadSlip(record)} className="text-green-600 hover:text-green-700" aria-label={`Download salary slip for ${record.workerName}`}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                           <TooltipContent className="bg-background border-border shadow-lg">
                            <p>Download Slip</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <span className="text-sm text-muted-foreground" aria-live="polite">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
        
        <AlertDialog open={!!recordToDelete} onOpenChange={(open) => { if (!open) setRecordToDelete(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the salary record for {recordToDelete?.workerName} for month {recordToDelete?.salaryMonthYear}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setRecordToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};

export default SalaryTable;
