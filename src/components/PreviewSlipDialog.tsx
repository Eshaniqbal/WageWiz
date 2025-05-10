"use client";

import type { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose, // Import DialogClose for the close button
  DialogFooter, // Added DialogFooter import
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // For the close button
import { ScrollArea } from "@/components/ui/scroll-area"; // To make content scrollable
import type { SalaryRecord } from "@/types";
import { SalarySlipTemplate } from '@/lib/SalarySlipTemplate';
import { X } from 'lucide-react';


interface PreviewSlipDialogProps {
  isOpen: boolean;
  onClose: () => void;
  record: SalaryRecord | null;
}

const PreviewSlipDialog: FC<PreviewSlipDialogProps> = ({ isOpen, onClose, record }) => {
  if (!record) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[800px] md:max-w-[calc(210mm+40px)] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-semibold text-accent">
            Salary Slip Preview
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preview for {record.workerName} - {new Date(record.salaryMonthYear + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow overflow-y-auto p-6 pt-2">
           {/* The SalarySlipTemplate itself will be 210mm wide. We ensure the scroll area provides space. */}
          <div className="mx-auto" style={{width: '210mm'}}> 
            <SalarySlipTemplate record={record} />
          </div>
        </ScrollArea>
        
        <DialogFooter className="p-6 pt-2 border-t bg-muted/50">
           <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewSlipDialog;
