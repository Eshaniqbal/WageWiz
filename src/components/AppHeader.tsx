"use client";

import type { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Briefcase, PlusCircle, Download, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AppHeaderProps {
  onAddEntry: () => void;
}

const AppHeader: FC<AppHeaderProps> = ({ onAddEntry }) => {
  return (
    <header className="bg-transparent p-4 sticky top-0 z-50 w-full">
      <div className="container mx-auto flex justify-between items-center gap-4 max-w-7xl">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-crimson" />
            <Input placeholder="Search records..." className="pl-8 text-crimson placeholder:text-crimson/70" />
          </div>
          <Button className="text-crimson border-crimson hover:bg-crimson hover:text-white transition-colors duration-200" variant="ghost">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button className="text-crimson border-crimson hover:bg-crimson hover:text-white transition-colors duration-200" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
        <Button 
          onClick={onAddEntry} 
          className="bg-[#DC143C] text-white hover:bg-[#DC143C]/80 transition-colors duration-200 font-semibold"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Add Salary Entry
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
