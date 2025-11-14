import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BalanceSheetReport } from "@/components/reports/BalanceSheetReport";
import { ProfitLossReport } from "@/components/reports/ProfitLossReport";
import { CashFlowReport } from "@/components/reports/CashFlowReport";

export default function Reports() {
  return (
    <PageContainer>
      <PageHeader
        title="Financial Reports"
        subtitle="Comprehensive financial statements and analytics"
      />

      <Tabs defaultValue="balance-sheet" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="balance-sheet" className="touch-target">
            Balance Sheet
          </TabsTrigger>
          <TabsTrigger value="profit-loss" className="touch-target">
            Profit & Loss
          </TabsTrigger>
          <TabsTrigger value="cash-flow" className="touch-target">
            Cash Flow
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balance-sheet">
          <BalanceSheetReport />
        </TabsContent>

        <TabsContent value="profit-loss">
          <ProfitLossReport />
        </TabsContent>

        <TabsContent value="cash-flow">
          <CashFlowReport />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
