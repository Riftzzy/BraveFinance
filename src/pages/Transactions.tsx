import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { ExportButton } from "@/components/ExportButton";
import { useToast } from "@/hooks/use-toast";

export default function Transactions() {
  const { transactions, isLoading } = useTransactions();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredTransactions = transactions?.filter(transaction =>
    transaction.transaction_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewTransaction = () => {
    toast({
      title: "Coming Soon",
      description: "Transaction creation form will be available soon",
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "posted":
        return "default";
      case "draft":
        return "secondary";
      case "voided":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Transactions"
        subtitle="Manage your financial transactions"
        actions={
          <div className="flex gap-2">
            <ExportButton
              data={transactions || []}
              filename="transactions"
              disabled={!transactions || transactions.length === 0}
            />
            <Button onClick={handleNewTransaction} className="touch-target">
              <Plus className="h-4 w-4" />
              New Transaction
            </Button>
          </div>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-10 touch-target"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Transactions List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : filteredTransactions && filteredTransactions.length > 0 ? (
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{transaction.transaction_number}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(transaction.transaction_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(transaction.status || "draft")}>
                    {transaction.status || "draft"}
                  </Badge>
                </div>

                {transaction.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {transaction.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Debit</p>
                    <p className="font-mono-financial font-semibold text-success">
                      ${transaction.total_debit?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total Credit</p>
                    <p className="font-mono-financial font-semibold text-destructive">
                      ${transaction.total_credit?.toLocaleString() || "0"}
                    </p>
                  </div>
                </div>

                {transaction.reference_number && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Ref: {transaction.reference_number}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <p className="mb-2">No transactions found</p>
              <p className="text-sm">Create your first transaction to get started</p>
            </div>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
