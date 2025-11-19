import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useBudgets } from "@/hooks/useBudgets";
import { ExportButton } from "@/components/ExportButton";
import { NewBudgetDialog } from "@/components/budget/NewBudgetDialog";

export default function Budget() {
  const { budgets, isLoading } = useBudgets();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredBudgets = budgets?.filter(budget =>
    budget.budget_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    budget.fiscal_year.toString().includes(searchQuery)
  );

  const handleNewBudget = () => {
    setDialogOpen(true);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "draft":
        return "secondary";
      case "closed":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <PageContainer>
      <NewBudgetDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <PageHeader
        title="Budget"
        subtitle="Budget planning and analysis"
        actions={
          <div className="flex gap-2">
            <ExportButton
              data={budgets || []}
              filename="budgets"
              disabled={!budgets || budgets.length === 0}
            />
            <Button onClick={handleNewBudget} className="touch-target">
              <Plus className="h-4 w-4" />
              New Budget
            </Button>
          </div>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search budgets..."
            className="pl-10 touch-target"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Budgets List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : filteredBudgets && filteredBudgets.length > 0 ? (
        <div className="space-y-3">
          {filteredBudgets.map((budget) => (
            <Card key={budget.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{budget.budget_name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Fiscal Year {budget.fiscal_year}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(budget.status || "draft")}>
                    {budget.status || "draft"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {budget.description && (
                    <p className="text-sm text-muted-foreground">{budget.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Period</p>
                      <p className="text-sm font-medium">
                        {new Date(budget.start_date).toLocaleDateString()} - {new Date(budget.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total Amount</p>
                      <p className="font-mono-financial text-lg font-semibold text-primary">
                        ${budget.total_amount?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <p className="mb-2">No budgets found</p>
              <p className="text-sm">Create your first budget to get started</p>
            </div>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
