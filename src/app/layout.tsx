import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, Briefcase } from "lucide-react";
import Link from "next/link";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'WageWiz - Employee Salary Management',
  description: 'Streamlined Employee Salary Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen">
          {/* Sidebar Navigation */}
          <aside className="w-64 border-r bg-background">
            <div className="h-16 flex items-center gap-2 px-4 border-b">
              <Briefcase className="h-8 w-8 text-accent" />
              <h1 className="text-2xl font-bold text-accent">WageWiz</h1>
            </div>
            <nav className="p-2">
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" />
                  Salary Records
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics Dashboard
                </Button>
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
