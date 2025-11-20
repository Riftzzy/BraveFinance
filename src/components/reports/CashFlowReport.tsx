import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { exportToExcel, exportToPDF } from "@/utils/exportData";

// Mock data
const cashFlowData = {
  period: "January 1, 2024 - November 14, 2024",
  operating: [
    { name: "Net Income", amount: 149000 },
    { name: "Depreciation & Amortization", amount: 18000 },
    { name: "Changes in Accounts Receivable", amount: -15000 },
    { name: "Changes in Inventory", amount: -8000 },
    { name: "Changes in Accounts Payable", amount: 12000 },
    { name: "Changes in Accrued Expenses", amount: 5000 },
  ],
  investing: [
    { name: "Purchase of Equipment", amount: -85000 },
    { name: "Sale of Investments", amount: 25000 },
    { name: "Acquisition of Intangible Assets", amount: -15000 },
  ],
  financing: [
    { name: "Proceeds from Long-term Debt", amount: 50000 },
    { name: "Repayment of Short-term Debt", amount: -15000 },
    { name: "Dividends Paid", amount: -20000 },
    { name: "Issuance of Common Stock", amount: 30000 },
  ],
  beginning: 95000,
};

export function CashFlowReport() {
  const netOperating = cashFlowData.operating.reduce((sum, item) => sum + item.amount, 0);
  const netInvesting = cashFlowData.investing.reduce((sum, item) => sum + item.amount, 0);
  const netFinancing = cashFlowData.financing.reduce((sum, item) => sum + item.amount, 0);
  const netChange = netOperating + netInvesting + netFinancing;
  const endingCash = cashFlowData.beginning + netChange;

  const handleExport = (format: "pdf" | "excel") => {
    try {
      const exportData = [
        ...cashFlowData.operating.map(item => ({ activity: "Operating", ...item })),
        ...cashFlowData.investing.map(item => ({ activity: "Investing", ...item })),
        ...cashFlowData.financing.map(item => ({ activity: "Financing", ...item })),
      ];

      if (format === "excel") {
        exportToExcel(exportData, "cash-flow");
        toast.success("Cash Flow Statement exported to Excel");
      } else {
        exportToPDF(exportData, "cash-flow", "Cash Flow Statement");
        toast.success("Cash Flow Statement exported as PDF");
      }
    } catch (error) {
      toast.error("Failed to export report");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cash Flow Statement</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{cashFlowData.period}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("excel")} className="touch-target">
              <Download className="h-4 w-4 mr-1" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("pdf")} className="touch-target">
              <Download className="h-4 w-4 mr-1" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="touch-target">
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Operating Activities */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-primary">CASH FLOW FROM OPERATING ACTIVITIES</h3>
          <div className="space-y-2 ml-4">
            {cashFlowData.operating.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.name}</span>
                <span className={`font-mono-financial ${item.amount < 0 ? 'text-destructive' : ''}`}>
                  {item.amount < 0 ? '-' : ''}${Math.abs(item.amount).toLocaleString()}
                </span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Net Cash from Operating Activities</span>
              <span className={`font-mono-financial ${netOperating < 0 ? 'text-destructive' : 'text-success'}`}>
                ${netOperating.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Investing Activities */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-primary">CASH FLOW FROM INVESTING ACTIVITIES</h3>
          <div className="space-y-2 ml-4">
            {cashFlowData.investing.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.name}</span>
                <span className={`font-mono-financial ${item.amount < 0 ? 'text-destructive' : ''}`}>
                  {item.amount < 0 ? '-' : ''}${Math.abs(item.amount).toLocaleString()}
                </span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Net Cash from Investing Activities</span>
              <span className={`font-mono-financial ${netInvesting < 0 ? 'text-destructive' : 'text-success'}`}>
                {netInvesting < 0 ? '-' : ''}${Math.abs(netInvesting).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Financing Activities */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-primary">CASH FLOW FROM FINANCING ACTIVITIES</h3>
          <div className="space-y-2 ml-4">
            {cashFlowData.financing.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.name}</span>
                <span className={`font-mono-financial ${item.amount < 0 ? 'text-destructive' : ''}`}>
                  {item.amount < 0 ? '-' : ''}${Math.abs(item.amount).toLocaleString()}
                </span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Net Cash from Financing Activities</span>
              <span className={`font-mono-financial ${netFinancing < 0 ? 'text-destructive' : 'text-success'}`}>
                ${netFinancing.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Net Change in Cash */}
        <div className="flex justify-between font-bold text-lg pt-2 border-t-2 border-primary bg-muted/30 p-3 rounded-lg">
          <span>NET CHANGE IN CASH</span>
          <span className={`font-mono-financial ${netChange < 0 ? 'text-destructive' : 'text-success'}`}>
            ${netChange.toLocaleString()}
          </span>
        </div>

        {/* Cash Reconciliation */}
        <div className="space-y-3 bg-primary/5 p-4 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Cash at Beginning of Period</span>
            <span className="font-mono-financial">${cashFlowData.beginning.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Net Change in Cash</span>
            <span className={`font-mono-financial ${netChange < 0 ? 'text-destructive' : 'text-success'}`}>
              ${netChange.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between font-bold text-xl pt-3 border-t-2 border-primary">
            <span>CASH AT END OF PERIOD</span>
            <span className="font-mono-financial text-primary">${endingCash.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
