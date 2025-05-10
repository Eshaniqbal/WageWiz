import type { SalaryRecord } from '@/types';
import { createRoot } from 'react-dom/client';

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

  const element = document.createElement('div');
  element.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1 style="color: #333; text-align: center;">Salary Slip</h1>
      <div style="margin-top: 20px;">
        <p><strong>Worker ID:</strong> ${record.id}</p>
        <p><strong>Name:</strong> ${record.workerName}</p>
        <p><strong>Department:</strong> ${record.department}</p>
        <p><strong>Month:</strong> ${record.salaryMonthYear}</p>
        <p><strong>Basic Salary:</strong> ${record.basicSalary}</p>
        <p><strong>Advance Payment:</strong> ${record.advancePayment}</p>
        <p><strong>Pending Balance:</strong> ${record.pendingBalance}</p>
      </div>
    </div>
  `;

  const options: Html2PdfOptions = {
    margin: 1,
    filename: `salary-slip-${record.id}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  try {
    await html2pdf().set(options).from(element).save();
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}

export function SalarySlipTemplate({ record }: { record: SalaryRecord }) {
  const advancePayment = record.advancePayment || 0;
  const pendingBalance = record.pendingBalance || 0;
  const netSalary = record.basicSalary - advancePayment - pendingBalance;
  const salaryMonthDate = new Date(record.salaryMonthYear + '-01'); // Ensure correct date parsing for month/year

  return (
    <div className="p-4 bg-white rounded w-[210mm]" style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}> {/* Removed hidden print:block, added base styling */}
      <style>{`
        .slip-container-pdf { padding: 20px; border: 1px solid #ccc; border-radius: 8px; background-color: #fff; width: 100%; box-sizing: border-box; }
        .slip-header-pdf { text-align: center; margin-bottom: 20px; }
        .slip-header-pdf h1 { margin: 0; font-size: 22px; color: #008080; } /* Teal */
        .slip-header-pdf p { margin: 5px 0; font-size: 14px; color: #555; }
        .slip-details-grid-pdf { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; margin-bottom: 20px; font-size: 13px;}
        .slip-details-grid-pdf div { padding: 4px 0; }
        .slip-details-grid-pdf strong { color: #000; }
        .slip-section-pdf h2 { font-size: 16px; color: #008080; border-bottom: 1px solid #eee; padding-bottom: 4px; margin-bottom: 8px; margin-top: 15px;}
        .slip-table-pdf { width: 100%; border-collapse: collapse; font-size: 13px; }
        .slip-table-pdf th, .slip-table-pdf td { text-align: left; padding: 6px; border-bottom: 1px solid #eee; }
        .slip-table-pdf th { background-color: #f9f9f9; font-weight: 600; }
        .slip-table-pdf td:last-child { text-align: right; }
        .slip-total-pdf { text-align: right; margin-top: 20px; font-size: 16px; font-weight: bold; }
        .slip-total-pdf span { color: #4CAF50; } /* Green */
        .slip-footer-pdf { text-align: center; margin-top: 30px; font-size: 10px; color: #777; }
      `}</style>
      <div className="slip-container-pdf">
        <div className="slip-header-pdf">
          <h1>Salary Slip</h1>
          <p>For the month of {salaryMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
        </div>

        <div className="slip-details-grid-pdf">
          <div><strong>Worker ID:</strong> {record.workerId}</div>
          <div><strong>Worker Name:</strong> {record.workerName}</div>
          {record.department && <div><strong>Department:</strong> {record.department}</div>}
          <div><strong>Joining Date:</strong> {new Date(record.joiningDate).toLocaleDateString()}</div>
        </div>

        <div className="slip-section-pdf">
          <h2>Earnings</h2>
          <table className="slip-table-pdf">
            <thead>
              <tr><th>Description</th><th>Amount (₹)</th></tr>
            </thead>
            <tbody>
              <tr><td>Basic Salary</td><td>{record.basicSalary.toFixed(2)}</td></tr>
            </tbody>
          </table>
        </div>

        {(advancePayment > 0 || pendingBalance > 0) && (
          <div className="slip-section-pdf">
            <h2>Deductions</h2>
            <table className="slip-table-pdf">
              <thead>
                <tr><th>Description</th><th>Amount (₹)</th></tr>
              </thead>
              <tbody>
                {advancePayment > 0 && (
                  <tr><td>Advance Payment</td><td>{advancePayment.toFixed(2)}</td></tr>
                )}
                {pendingBalance > 0 && (
                  <tr><td>Pending Balance</td><td>{pendingBalance.toFixed(2)}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="slip-total-pdf">
          Net Salary Payable: <span>₹{netSalary.toFixed(2)}</span>
        </div>

        <div className="slip-footer-pdf">
          This is a computer-generated salary slip. WageWiz &copy; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}

