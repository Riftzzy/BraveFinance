import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useAccounts } from "@/hooks/useAccounts";
import { ExportButton } from "@/components/ExportButton";

export default function Ledger() {
  const navigate = useNavigate();
  const { accounts, isLoading } = useAccounts();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAccounts = accounts?.filter(account => 
    account.account_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.account_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer>
      <PageHeader
        title="General Ledger"
        subtitle="Chart of accounts and balances"
        actions={
          <div className="flex gap-2">
            <ExportButton 
              data={accounts || []} 
              filename="chart-of-accounts"
              disabled={!accounts || accounts.length === 0}
            />
            <Button onClick={() => navigate("/ledger/journal")} className="touch-target">
              <Plus className="h-4 w-4" />
              New Entry
            </Button>
          </div>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
            className="pl-10 touch-target"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : filteredAccounts && filteredAccounts.length > 0 ? (
            <div className="space-y-3">
              {filteredAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer touch-target"
                >
                  <div>
                    <p className="font-medium">{account.account_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {account.account_number}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {account.account_type}
                      </Badge>
                      {!account.is_active && (
                        <Badge variant="secondary" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono-financial font-semibold">
                      ${(account.current_balance || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Balance</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? "No accounts found matching your search" : "No accounts found"}
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
