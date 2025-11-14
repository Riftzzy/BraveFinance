import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data
const balanceSheetData = {
  date: "November 14, 2024",
  assets: {
    current: [
      { name: "Cash and Cash Equivalents", amount: 125000 },
      { name: "Accounts Receivable", amount: 85000 },
      { name: "Inventory", amount: 45000 },
      { name: "Prepaid Expenses", amount: 12000 },
    ],
    fixed: [
      { name: "Property, Plant & Equipment", amount: 350000 },
      { name: "Less: Accumulated Depreciation", amount: -75000 },
      { name: "Intangible Assets", amount: 50000 },
    ],
  },
  liabilities: {
    current: [
      { name: "Accounts Payable", amount: 45000 },
      { name: "Short-term Debt", amount: 25000 },
      { name: "Accrued Expenses", amount: 18000 },
    ],
    longTerm: [
      { name: "Long-term Debt", amount: 150000 },
      { name: "Deferred Tax Liabilities", amount: 22000 },
    ],
  },
  equity: [
    { name: "Common Stock", amount: 200000 },
    { name: "Retained Earnings", amount: 132000 },
  ],
};

export function BalanceSheetReport() {
  const totalCurrentAssets = balanceSheetData.assets.current.reduce((sum, item) => sum + item.amount, 0);
  const totalFixedAssets = balanceSheetData.assets.fixed.reduce((sum, item) => sum + item.amount, 0);
  const totalAssets = totalCurrentAssets + totalFixedAssets;

  const totalCurrentLiabilities = balanceSheetData.liabilities.current.reduce((sum, item) => sum + item.amount, 0);
  const totalLongTermLiabilities = balanceSheetData.liabilities.longTerm.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

  const totalEquity = balanceSheetData.equity.reduce((sum, item) => sum + item.amount, 0);

  const handleExport = (format: "pdf" | "excel") => {
    toast({
      title: "Export Started",
      description: `Exporting Balance Sheet as ${format.toUpperCase()}...`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Balance Sheet</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">As of {balanceSheetData.date}</p>
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
        {/* Assets */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-primary">ASSETS</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Current Assets</h4>
              <div className="space-y-2 ml-4">
                {balanceSheetData.assets.current.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-mono-financial">${item.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-medium pt-2 border-t">
                  <span>Total Current Assets</span>
                  <span className="font-mono-financial">${totalCurrentAssets.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Fixed Assets</h4>
              <div className="space-y-2 ml-4">
                {balanceSheetData.assets.fixed.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-mono-financial">${item.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-medium pt-2 border-t">
                  <span>Total Fixed Assets</span>
                  <span className="font-mono-financial">${totalFixedAssets.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg pt-2 border-t-2 border-primary">
              <span>TOTAL ASSETS</span>
              <span className="font-mono-financial text-primary">${totalAssets.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Liabilities */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-primary">LIABILITIES</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Current Liabilities</h4>
              <div className="space-y-2 ml-4">
                {balanceSheetData.liabilities.current.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-mono-financial">${item.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-medium pt-2 border-t">
                  <span>Total Current Liabilities</span>
                  <span className="font-mono-financial">${totalCurrentLiabilities.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Long-term Liabilities</h4>
              <div className="space-y-2 ml-4">
                {balanceSheetData.liabilities.longTerm.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-mono-financial">${item.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-medium pt-2 border-t">
                  <span>Total Long-term Liabilities</span>
                  <span className="font-mono-financial">${totalLongTermLiabilities.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between font-bold pt-2 border-t">
              <span>TOTAL LIABILITIES</span>
              <span className="font-mono-financial">${totalLiabilities.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Equity */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-primary">EQUITY</h3>
          <div className="space-y-2 ml-4">
            {balanceSheetData.equity.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-mono-financial">${item.amount.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>TOTAL EQUITY</span>
              <span className="font-mono-financial">${totalEquity.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between font-bold text-lg pt-4 border-t-2 border-primary">
          <span>TOTAL LIABILITIES & EQUITY</span>
          <span className="font-mono-financial text-primary">${(totalLiabilities + totalEquity).toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
