import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

const accounts = [
  { id: "1000", name: "Cash", type: "Asset", balance: 125430 },
  { id: "1100", name: "Accounts Receivable", type: "Asset", balance: 48290 },
  { id: "2000", name: "Accounts Payable", type: "Liability", balance: 32180 },
  { id: "3000", name: "Owner's Equity", type: "Equity", balance: 250000 },
  { id: "4000", name: "Revenue", type: "Revenue", balance: 185000 },
  { id: "5000", name: "Operating Expenses", type: "Expense", balance: 52300 },
];

export default function Ledger() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <PageHeader
        title="General Ledger"
        subtitle="Chart of accounts and balances"
        actions={
          <Button onClick={() => navigate("/ledger/journal")} className="touch-target">
            <Plus className="h-4 w-4" />
            New Entry
          </Button>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
            className="pl-10 touch-target"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Button
          variant="outline"
          className="h-20 flex-col gap-2 touch-target"
          onClick={() => navigate("/ledger/journal")}
        >
          <FileText className="h-5 w-5" />
          <span className="text-sm">Journal Entries</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex-col gap-2 touch-target"
        >
          <Search className="h-5 w-5" />
          <span className="text-sm">Account Search</span>
        </Button>
      </div>

      {/* Chart of Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Chart of Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer touch-target"
              >
                <div>
                  <p className="font-medium">{account.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {account.id}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {account.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono-financial font-semibold">
                    ${account.balance.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Balance</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
