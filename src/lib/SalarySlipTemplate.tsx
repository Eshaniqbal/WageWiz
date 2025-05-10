import type { SalaryRecord } from '@/types';

export function SalarySlipTemplate({ record }: { record: SalaryRecord }) {
  const advancePayment = record.advancePayment || 0;
  const pendingBalance = record.pendingBalance || 0;
  const netSalary = record.basicSalary - advancePayment - pendingBalance;
  const salaryMonthDate = new Date(record.salaryMonthYear + '-01');

  return (
    <div className="p-4 bg-white rounded w-[210mm]" style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <style>{`
        .slip-container-pdf { 
          padding: 20px; 
          border: 1px solid #ccc; 
          border-radius: 8px; 
          background-color: #fff; 
          width: 100%; 
          box-sizing: border-box; 
        }
        .slip-header-pdf { 
          text-align: center; 
          margin-bottom: 20px; 
          border-bottom: 2px solid #008080;
          padding-bottom: 10px;
        }
        .slip-header-pdf h1 { 
          margin: 0; 
          font-size: 24px; 
          color: #008080; 
          font-weight: bold;
        }
        .slip-header-pdf p { 
          margin: 5px 0; 
          font-size: 14px; 
          color: #555; 
        }
        .slip-details-grid-pdf { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 12px 24px; 
          margin-bottom: 20px; 
          font-size: 14px;
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 6px;
        }
        .slip-details-grid-pdf div { 
          padding: 4px 0; 
        }
        .slip-details-grid-pdf strong { 
          color: #000; 
          font-weight: 600;
        }
        .slip-section-pdf h2 { 
          font-size: 18px; 
          color: #008080; 
          border-bottom: 2px solid #eee; 
          padding-bottom: 6px; 
          margin-bottom: 12px; 
          margin-top: 20px;
          font-weight: 600;
        }
        .slip-table-pdf { 
          width: 100%; 
          border-collapse: collapse; 
          font-size: 14px; 
          margin-bottom: 10px;
        }
        .slip-table-pdf th, 
        .slip-table-pdf td { 
          text-align: left; 
          padding: 8px; 
          border-bottom: 1px solid #eee; 
        }
        .slip-table-pdf th { 
          background-color: #f5f5f5; 
          font-weight: 600;
          color: #333;
        }
        .slip-table-pdf td:last-child { 
          text-align: right; 
          font-weight: 500;
        }
        .slip-total-pdf { 
          text-align: right; 
          margin-top: 20px; 
          font-size: 18px; 
          font-weight: bold;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 6px;
        }
        .slip-total-pdf span { 
          color: #008080; 
          margin-left: 10px;
        }
        .slip-footer-pdf { 
          text-align: center; 
          margin-top: 30px; 
          font-size: 12px; 
          color: #777;
          border-top: 1px solid #eee;
          padding-top: 15px;
        }
      `}</style>
      <div className="slip-container-pdf">
        <div className="slip-header-pdf">
          <h1>Salary Slip</h1>
          <p>For the month of {salaryMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
        </div>

        <div className="slip-details-grid-pdf">
          <div><strong>Worker ID:</strong> {record.workerId}</div>
          <div><strong>Worker Name:</strong> {record.workerName}</div>
          {record.phoneNumber && <div><strong>Phone:</strong> {record.phoneNumber}</div>}
          {record.department && <div><strong>Department:</strong> {record.department}</div>}
          <div><strong>Joining Date:</strong> {new Date(record.joiningDate).toLocaleDateString()}</div>
          <div><strong>Generated On:</strong> {new Date().toLocaleDateString()}</div>
        </div>

        <div className="slip-section-pdf">
          <h2>Earnings</h2>
          <table className="slip-table-pdf">
            <thead>
              <tr><th>Description</th><th>Amount (₹)</th></tr>
            </thead>
            <tbody>
              <tr><td>Basic Salary</td><td>{record.basicSalary.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
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
                  <tr><td>Advance Payment</td><td>{advancePayment.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
                )}
                {pendingBalance > 0 && (
                  <tr><td>Pending Balance</td><td>{pendingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="slip-total-pdf">
          Net Salary Payable: <span>₹{netSalary.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>

        <div className="slip-footer-pdf">
          <p>This is a computer-generated salary slip and does not require a signature.</p>
          <p>WageWiz &copy; {new Date().getFullYear()} - Streamlined Salary Management</p>
        </div>
      </div>
    </div>
  );
} 