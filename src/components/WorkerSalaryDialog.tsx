
"use client";

import type { FC } from 'react';
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, IndianRupee, User, Users, MinusCircle, PlusCircle } from "lucide-react"; // Removed Briefcase
import { cn } from "@/lib/utils";
import type { SalaryRecord } from "@/types";

const formSchema = z.object({
  workerId: z.string().min(1, "Worker ID is required"),
  workerName: z.string().min(1, "Worker Name is required"),
  // department: z.string().min(1, "Department is required"), // Removed department
  joiningDate: z.date({ required_error: "Joining Date is required." }),
  salaryMonthYear: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Salary Month/Year must be YYYY-MM format"),
  basicSalary: z.coerce.number().positive("Basic Salary must be a positive number"),
  advancePayment: z.coerce.number().min(0, "Advance Payment cannot be negative").optional().default(0),
  pendingBalance: z.coerce.number().min(0, "Pending Balance cannot be negative").optional().default(0),
});

type FormData = z.infer<typeof formSchema>;

interface WorkerSalaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: SalaryRecord) => void;
  existingRecord?: SalaryRecord | null;
}

const WorkerSalaryDialog: FC<WorkerSalaryDialogProps> = ({ isOpen, onClose, onSave, existingRecord }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: existingRecord
      ? {
          // Spread existing record, department will be ignored if not in FormData
          ...existingRecord, 
          joiningDate: new Date(existingRecord.joiningDate),
          basicSalary: Number(existingRecord.basicSalary),
          advancePayment: Number(existingRecord.advancePayment || 0),
          pendingBalance: Number(existingRecord.pendingBalance || 0),
        }
      : {
          workerId: "",
          workerName: "",
          // department: "", // Removed department
          joiningDate: undefined,
          salaryMonthYear: format(new Date(), 'yyyy-MM'), // Default to current month
          basicSalary: 0,
          advancePayment: 0,
          pendingBalance: 0,
        },
  });

  const { register, handleSubmit, control, reset, formState: { errors } } = form;

  React.useEffect(() => {
    if (isOpen) {
      reset(
        existingRecord
        ? {
            ...existingRecord,
            joiningDate: new Date(existingRecord.joiningDate),
            basicSalary: Number(existingRecord.basicSalary),
            advancePayment: Number(existingRecord.advancePayment || 0),
            pendingBalance: Number(existingRecord.pendingBalance || 0),
          }
        : {
            workerId: "",
            workerName: "",
            // department: "", // Removed department
            joiningDate: undefined,
            salaryMonthYear: format(new Date(), 'yyyy-MM'),
            basicSalary: 0,
            advancePayment: 0,
            pendingBalance: 0,
          }
      );
    }
  }, [isOpen, existingRecord, reset]);

  const onSubmit = (data: FormData) => {
    const now = new Date().toISOString();
    const recordToSave: SalaryRecord = {
      id: existingRecord?.id || uuidv4(),
      ...data, // Data will not include department as it's removed from formSchema
      joiningDate: format(data.joiningDate, 'yyyy-MM-dd'),
      basicSalary: Number(data.basicSalary),
      advancePayment: Number(data.advancePayment || 0),
      pendingBalance: Number(data.pendingBalance || 0),
      createdAt: existingRecord?.createdAt || now,
      updatedAt: now,
      // If existingRecord had a department, and we want to preserve it when editing:
      ...(existingRecord && existingRecord.department && { department: existingRecord.department }),
    };
    onSave(recordToSave);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-card shadow-xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-accent">
            {existingRecord ? "Edit Salary Entry" : "Add New Salary Entry"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {existingRecord ? "Update the details for this salary record." : "Fill in the details to add a new salary record."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workerId"><Users className="inline-block mr-1 h-4 w-4" />Worker ID</Label>
              <Input id="workerId" {...register("workerId")} className="mt-1" placeholder="e.g., EMP001" />
              {errors.workerId && <p className="text-sm text-destructive mt-1">{errors.workerId.message}</p>}
            </div>
            <div>
              <Label htmlFor="workerName"><User className="inline-block mr-1 h-4 w-4" />Worker Name</Label>
              <Input id="workerName" {...register("workerName")} className="mt-1" placeholder="e.g., John Doe" />
              {errors.workerName && <p className="text-sm text-destructive mt-1">{errors.workerName.message}</p>}
            </div>
          </div>
          
          {/* Removed Department Field */}
          {/*
          <div>
            <Label htmlFor="department"><Briefcase className="inline-block mr-1 h-4 w-4" />Department</Label>
            <Input id="department" {...register("department")} className="mt-1" placeholder="e.g., Engineering" />
            {errors.department && <p className="text-sm text-destructive mt-1">{errors.department.message}</p>}
          </div>
          */}

          <div>
            <Label htmlFor="joiningDate"><CalendarIcon className="inline-block mr-1 h-4 w-4" />Joining Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !form.watch("joiningDate") && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch("joiningDate") ? format(form.watch("joiningDate"), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card">
                <Calendar
                  mode="single"
                  selected={form.watch("joiningDate")}
                  onSelect={(date) => form.setValue("joiningDate", date || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.joiningDate && <p className="text-sm text-destructive mt-1">{errors.joiningDate.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salaryMonthYear"><CalendarIcon className="inline-block mr-1 h-4 w-4" />Salary Month (YYYY-MM)</Label>
              <Input id="salaryMonthYear" {...register("salaryMonthYear")} className="mt-1" placeholder="e.g., 2023-12" />
              {errors.salaryMonthYear && <p className="text-sm text-destructive mt-1">{errors.salaryMonthYear.message}</p>}
            </div>
            <div>
              <Label htmlFor="basicSalary"><IndianRupee className="inline-block mr-1 h-4 w-4" />Basic Salary (₹)</Label>
              <Input id="basicSalary" type="number" step="0.01" {...register("basicSalary")} className="mt-1" placeholder="e.g., 50000" />
              {errors.basicSalary && <p className="text-sm text-destructive mt-1">{errors.basicSalary.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="advancePayment"><MinusCircle className="inline-block mr-1 h-4 w-4 text-orange-500" />Advance Payment (₹)</Label>
              <Input id="advancePayment" type="number" step="0.01" {...register("advancePayment")} className="mt-1" placeholder="e.g., 5000" />
              {errors.advancePayment && <p className="text-sm text-destructive mt-1">{errors.advancePayment.message}</p>}
            </div>
            <div>
              <Label htmlFor="pendingBalance"><PlusCircle className="inline-block mr-1 h-4 w-4 text-red-500" />Pending Balance (₹)</Label>
              <Input id="pendingBalance" type="number" step="0.01" {...register("pendingBalance")} className="mt-1" placeholder="e.g., 1000" />
              {errors.pendingBalance && <p className="text-sm text-destructive mt-1">{errors.pendingBalance.message}</p>}
            </div>
          </div>
          
          <DialogFooter className="mt-6 sticky bottom-0 bg-card py-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="default">
              {existingRecord ? "Save Changes" : "Add Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkerSalaryDialog;

