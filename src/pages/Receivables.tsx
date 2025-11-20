import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, TrendingUp } from "lucide-react";
import { useInvoices } from "@/hooks/useInvoices";
import { ExportButton } from "@/components/ExportButton";
import { NewReceivablesDialog } from "@/components/receivables/NewReceivablesDialog";
import { format } from "date-fns";

export default function Receivables() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { invoices, isLoading, refetch } = useInvoices("receivable");

  const totalOutstanding = invoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
  const overdueInvoices = invoices?.filter(inv =>
    inv.status === 'overdue' || (new Date(inv.due_date) < new Date() && inv.status !== 'paid')
  ) || [];
  const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);

  return (
    <PageContainer>
      <PageHeader
        title="Accounts Receivable"
        subtitle="Manage customer invoices and payments"
        actions={
          <div className="flex gap-2">
            <ExportButton
              data={invoices || []}
              filename="receivables"
              disabled={!invoices || invoices.length === 0}
            />
            <NewReceivablesDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              onReceivableAdded={() => {
                setDialogOpen(false);
                refetch?.();
              }}
            />
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Outstanding</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-32 mt-1" />
                ) : (
                  <p className="text-2xl font-bold font-mono-financial mt-1">
                    ${totalOutstanding.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-32 mt-1" />
                ) : (
                  <p className="text-2xl font-bold font-mono-financial mt-1 text-destructive">
                    ${overdueAmount.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold font-mono-financial mt-1">
                    {invoices?.length || 0}
                  </p>
                )}
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Customer Invoices</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="touch-target"
            >
              Aging Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="overdue" className="flex-1">Overdue</TabsTrigger>
              <TabsTrigger value="outstanding" className="flex-1">Outstanding</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : invoices && invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer touch-target"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold">{invoice.invoice_number}</p>
                        <Badge
                          variant={
                            invoice.status === "overdue" ? "destructive" :
                            invoice.status === "paid" ? "default" :
                            "secondary"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Customer: <span className="font-medium text-foreground">
                            {invoice.customer?.customer_name || "N/A"}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Due: <span className="font-medium text-foreground">
                            {format(new Date(invoice.due_date), "MMM dd, yyyy")}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono-financial font-bold text-lg">
                        ${(invoice.total_amount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No invoices found
                </div>
              )}
            </TabsContent>

            <TabsContent value="overdue" className="mt-4">
              {isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  {overdueInvoices.length} overdue invoice{overdueInvoices.length !== 1 ? "s" : ""}
                </div>
              )}
            </TabsContent>

            <TabsContent value="outstanding" className="mt-4">
              {isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  {invoices?.filter(inv => inv.status === 'outstanding' || inv.status === 'pending').length || 0} outstanding invoice
                  {invoices?.filter(inv => inv.status === 'outstanding' || inv.status === 'pending').length !== 1 ? "s" : ""}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
