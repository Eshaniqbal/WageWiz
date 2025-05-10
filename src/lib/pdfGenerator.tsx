import type { SalaryRecord } from '@/types';
import { createRoot } from 'react-dom/client';
import { SalarySlipTemplate } from './SalarySlipTemplate';

interface Html2PdfOptions {
  margin?: number;
  filename?: string;
  image?: { type?: string; quality?: number };
  html2canvas?: { scale?: number; useCORS?: boolean };
  jsPDF?: { unit?: string; format?: string; orientation?: string };
}

type Html2PdfFunction = (element?: HTMLElement, options?: Html2PdfOptions) => any;

async function getHtml2Pdf(): Promise<Html2PdfFunction | null> {
  if (typeof window !== 'undefined') {
    try {
      const html2pdfModule = await import('html2pdf.js');
      return html2pdfModule.default || html2pdfModule;
    } catch (error) {
      console.error('Failed to load html2pdf:', error);
      return null;
    }
  }
  return null;
}

export async function generatePDF(record: SalaryRecord): Promise<void> {
  const html2pdf = await getHtml2Pdf();
  if (!html2pdf) {
    throw new Error('PDF generation is not available');
  }

  // Create a container for the React component
  const container = document.createElement('div');
  document.body.appendChild(container);

  // Render the SalarySlipTemplate component
  const root = createRoot(container);
  root.render(<SalarySlipTemplate record={record} />);

  // Wait for the component to render
  await new Promise(resolve => setTimeout(resolve, 100));

  const options: Html2PdfOptions = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: `salary-slip-${record.workerId}-${record.salaryMonthYear}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'in', 
      format: 'a4', 
      orientation: 'portrait'
    }
  };

  try {
    await html2pdf()
      .set(options)
      .from(container)
      .save();
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw new Error('Failed to generate PDF');
  } finally {
    // Clean up
    root.unmount();
    document.body.removeChild(container);
  }
}

