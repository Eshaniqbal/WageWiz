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
import { CalendarIcon, IndianRupee, User, Users, MinusCircle, PlusCircle, Phone } from "lucide-react"; // Removed Briefcase
import { cn } from "@/lib/utils";
import type { SalaryRecord } from "@/types";

type FormData = {
  workerName: string;
  phoneNumber: string;
  joiningDate: Date;
  salaryMonthYear: string;
  basicSalary: number;
  advancePayment: number;
  pendingBalance: number;
};

const formSchema = z.object({
  workerName: z.string().min(1, 'Worker name is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^\d+$/, 'Phone number must contain only digits'),
  joiningDate: z.date({
    required_error: 'Joining date is required',
  }),
  salaryMonthYear: z.string().min(1, 'Salary month/year is required'),
  basicSalary: z.coerce.number().min(0, 'Basic salary must be positive'),
  advancePayment: z.coerce.number().min(0, 'Advance payment must be positive'),
  pendingBalance: z.coerce.number().min(0, 'Pending balance must be positive'),
});

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
          workerName: existingRecord.workerName,
          phoneNumber: existingRecord.phoneNumber || '',
          joiningDate: new Date(existingRecord.joiningDate),
          salaryMonthYear: existingRecord.salaryMonthYear,
          basicSalary: Number(existingRecord.basicSalary),
          advancePayment: Number(existingRecord.advancePayment || 0),
          pendingBalance: Number(existingRecord.pendingBalance || 0),
        }
      : {
          workerName: "",
          phoneNumber: "",
          joiningDate: undefined,
          salaryMonthYear: format(new Date(), 'yyyy-MM'),
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
            workerName: "",
            phoneNumber: "",
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
    const workerId = existingRecord?.workerId || `EMP${Math.floor(1000 + Math.random() * 9000)}`;
    const recordToSave: SalaryRecord = {
      id: existingRecord?.id || uuidv4(),
      workerId,
      workerName: data.workerName,
      phoneNumber: data.phoneNumber,
      department: 'General', // Default department
      joiningDate: format(data.joiningDate, 'yyyy-MM-dd'),
      salaryMonthYear: format(data.salaryMonthYear, 'yyyy-MM'),
      basicSalary: Number(data.basicSalary),
      advancePayment: Number(data.advancePayment),
      pendingBalance: Number(data.pendingBalance),
      createdAt: existingRecord?.createdAt || now,
      updatedAt: now,
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
              <Label htmlFor="workerName"><User className="inline-block mr-1 h-4 w-4" />Worker Name</Label>
              <Input id="workerName" {...register("workerName")} className="mt-1" placeholder="e.g., John Doe" />
              {errors.workerName && <p className="text-sm text-destructive mt-1">{errors.workerName.message}</p>}
            </div>
            <div>
              <Label htmlFor="phoneNumber"><Phone className="inline-block mr-1 h-4 w-4" />Phone Number</Label>
              <Input id="phoneNumber" {...register("phoneNumber")} className="mt-1" placeholder="e.g., 9876543210" />
              {errors.phoneNumber && <p className="text-sm text-destructive mt-1">{errors.phoneNumber.message}</p>}
            </div>
          </div>

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
              <Input id="basicSalary" type="number" step="0.01" {...register("basicSalary", { valueAsNumber: true })} className="mt-1" placeholder="e.g., 50000" />
              {errors.basicSalary && <p className="text-sm text-destructive mt-1">{errors.basicSalary.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="advancePayment"><MinusCircle className="inline-block mr-1 h-4 w-4 text-orange-500" />Advance Payment (₹)</Label>
              <Input id="advancePayment" type="number" step="0.01" {...register("advancePayment", { valueAsNumber: true })} className="mt-1" placeholder="e.g., 5000" />
              {errors.advancePayment && <p className="text-sm text-destructive mt-1">{errors.advancePayment.message}</p>}
            </div>
            <div>
              <Label htmlFor="pendingBalance"><PlusCircle className="inline-block mr-1 h-4 w-4 text-red-500" />Pending Balance (₹)</Label>
              <Input id="pendingBalance" type="number" step="0.01" {...register("pendingBalance", { valueAsNumber: true })} className="mt-1" placeholder="e.g., 1000" />
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

