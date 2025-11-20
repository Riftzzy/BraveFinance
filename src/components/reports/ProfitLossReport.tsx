import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { exportToExcel, exportToPDF } from "@/utils/exportData";

// Mock data
const plData = {
  period: "January 1, 2024 - November 14, 2024",
  revenue: [
    { name: "Product Sales", amount: 450000 },
    { name: "Service Revenue", amount: 185000 },
    { name: "Other Income", amount: 28000 },
  ],
  costOfGoodsSold: [
    { name: "Direct Materials", amount: 125000 },
    { name: "Direct Labor", amount: 95000 },
    { name: "Manufacturing Overhead", amount: 42000 },
  ],
  operatingExpenses: [
    { name: "Salaries & Wages", amount: 145000 },
    { name: "Rent", amount: 36000 },
    { name: "Utilities", amount: 12000 },
    { name: "Marketing & Advertising", amount: 28000 },
    { name: "Insurance", amount: 15000 },
    { name: "Depreciation", amount: 18000 },
    { name: "Office Supplies", amount: 8000 },
  ],
  otherExpenses: [
    { name: "Interest Expense", amount: 12000 },
    { name: "Tax Expense", amount: 35000 },
  ],
};

export function ProfitLossReport() {
  const totalRevenue = plData.revenue.reduce((sum, item) => sum + item.amount, 0);
  const totalCOGS = plData.costOfGoodsSold.reduce((sum, item) => sum + item.amount, 0);
  const grossProfit = totalRevenue - totalCOGS;
  const totalOperatingExpenses = plData.operatingExpenses.reduce((sum, item) => sum + item.amount, 0);
  const operatingIncome = grossProfit - totalOperatingExpenses;
  const totalOtherExpenses = plData.otherExpenses.reduce((sum, item) => sum + item.amount, 0);
  const netIncome = operatingIncome - totalOtherExpenses;

  const handleExport = (format: "pdf" | "excel") => {
    try {
      const exportData = [
        ...plData.revenue.map(item => ({ section: "Revenue", ...item })),
        ...plData.costOfGoodsSold.map(item => ({ section: "Cost of Goods Sold", ...item })),
        ...plData.operatingExpenses.map(item => ({ section: "Operating Expenses", ...item })),
        ...plData.otherExpenses.map(item => ({ section: "Other Expenses", ...item })),
      ];

      if (format === "excel") {
        exportToExcel(exportData, "profit-loss");
        toast.success("P&L Statement exported to Excel");
      } else {
        exportToPDF(exportData, "profit-loss", "Profit & Loss Statement");
        toast.success("P&L Statement exported as PDF");
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
            <CardTitle>Profit & Loss Statement</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{plData.period}</p>
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
        {/* Revenue */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-primary">REVENUE</h3>
          <div className="space-y-2 ml-4">
            {plData.revenue.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-mono-financial">${item.amount.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total Revenue</span>
              <span className="font-mono-financial text-success">${totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Cost of Goods Sold */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-primary">COST OF GOODS SOLD</h3>
          <div className="space-y-2 ml-4">
            {plData.costOfGoodsSold.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-mono-financial">${item.amount.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total COGS</span>
              <span className="font-mono-financial">${totalCOGS.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Gross Profit */}
        <div className="flex justify-between font-bold text-lg pt-2 border-t-2 border-primary bg-muted/30 p-3 rounded-lg">
          <span>GROSS PROFIT</span>
          <span className="font-mono-financial text-primary">${grossProfit.toLocaleString()}</span>
        </div>

        {/* Operating Expenses */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-primary">OPERATING EXPENSES</h3>
          <div className="space-y-2 ml-4">
            {plData.operatingExpenses.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-mono-financial">${item.amount.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total Operating Expenses</span>
              <span className="font-mono-financial">${totalOperatingExpenses.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Operating Income */}
        <div className="flex justify-between font-bold text-lg pt-2 border-t bg-muted/30 p-3 rounded-lg">
          <span>OPERATING INCOME</span>
          <span className="font-mono-financial text-primary">${operatingIncome.toLocaleString()}</span>
        </div>

        {/* Other Expenses */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-primary">OTHER EXPENSES</h3>
          <div className="space-y-2 ml-4">
            {plData.otherExpenses.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-mono-financial">${item.amount.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total Other Expenses</span>
              <span className="font-mono-financial">${totalOtherExpenses.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Net Income */}
        <div className="flex justify-between font-bold text-xl pt-4 border-t-2 border-primary bg-success/10 p-4 rounded-lg">
          <span>NET INCOME</span>
          <span className="font-mono-financial text-success">${netIncome.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
