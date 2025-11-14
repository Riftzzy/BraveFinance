import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "debit" | "credit";
  date: string;
  category: string;
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "1",
    description: "Office Supplies Purchase",
    amount: 1250.00,
    type: "debit",
    date: "2024-11-13",
    category: "Expenses",
  },
  {
    id: "2",
    description: "Client Payment - Project Alpha",
    amount: 15000.00,
    type: "credit",
    date: "2024-11-12",
    category: "Revenue",
  },
  {
    id: "3",
    description: "Vendor Payment - Tech Solutions",
    amount: 5600.00,
    type: "debit",
    date: "2024-11-11",
    category: "Payables",
  },
  {
    id: "4",
    description: "Monthly Rent Payment",
    amount: 3200.00,
    type: "debit",
    date: "2024-11-10",
    category: "Expenses",
  },
  {
    id: "5",
    description: "Sales Revenue - Product Line",
    amount: 8900.00,
    type: "credit",
    date: "2024-11-09",
    category: "Revenue",
  },
];

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg touch-target"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    transaction.type === "credit"
                      ? "bg-success/10"
                      : "bg-muted"
                  }`}
                >
                  {transaction.type === "credit" ? (
                    <ArrowDownRight className="h-5 w-5 text-success" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{transaction.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    <Badge variant="outline" className="text-xs">
                      {transaction.category}
                    </Badge>
                  </div>
                </div>
              </div>
              <p
                className={`font-mono-financial font-semibold flex-shrink-0 ml-2 ${
                  transaction.type === "credit" ? "text-success" : "text-foreground"
                }`}
              >
                {transaction.type === "credit" ? "+" : "-"}$
                {transaction.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
