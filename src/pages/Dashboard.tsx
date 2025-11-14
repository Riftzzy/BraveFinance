import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { FinancialSummaryCard } from "@/components/dashboard/FinancialSummaryCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { CashFlowChart } from "@/components/charts/CashFlowChart";
import { RevenueExpenseChart } from "@/components/charts/RevenueExpenseChart";

export default function Dashboard() {
  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to BraveFinance"
        actions={
          <Button size="icon" className="touch-target">
            <Plus className="h-5 w-5" />
          </Button>
        }
      />

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <FinancialSummaryCard
          title="Cash Position"
          amount={125430}
          change={12.5}
          trend="up"
          icon={DollarSign}
        />
        <FinancialSummaryCard
          title="Accounts Receivable"
          amount={85000}
          change={5.2}
          trend="up"
          icon={TrendingUp}
        />
        <FinancialSummaryCard
          title="Accounts Payable"
          amount={45000}
          change={-3.1}
          trend="down"
          icon={AlertCircle}
        />
        <FinancialSummaryCard
          title="Pending Approvals"
          amount={8}
          icon={Clock}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CashFlowChart />
        <RevenueExpenseChart />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </PageContainer>
  );
}

