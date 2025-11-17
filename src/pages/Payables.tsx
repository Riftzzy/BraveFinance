import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInvoices } from "@/hooks/useInvoices";
import { ExportButton } from "@/components/ExportButton";
import { format } from "date-fns";

export default function Payables() {
  const navigate = useNavigate();
  const { invoices, isLoading } = useInvoices("payable");

  const totalOutstanding = invoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
  const overdueInvoices = invoices?.filter(inv => 
    inv.status === 'overdue' || (new Date(inv.due_date) < new Date() && inv.status !== 'paid')
  ) || [];
  const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);

  return (
    <PageContainer>
      <PageHeader
        title="Accounts Payable"
        subtitle="Manage vendor invoices and payments"
        actions={
          <div className="flex gap-2">
            <ExportButton 
              data={invoices || []} 
              filename="payables"
              disabled={!invoices || invoices.length === 0}
            />
            <Button className="touch-target">
              <Plus className="h-4 w-4" />
              New Invoice
            </Button>
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
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-warning" />
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
                <AlertCircle className="h-6 w-6 text-destructive" />
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

      {/* Invoices Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoices</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/payables/vendors")}
              className="touch-target"
            >
              <Users className="h-4 w-4 mr-2" />
              Vendors
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="overdue" className="flex-1">Overdue</TabsTrigger>
              <TabsTrigger value="pending" className="flex-1">Pending</TabsTrigger>
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
                          Vendor: <span className="font-medium text-foreground">
                            {invoice.vendor?.vendor_name || "N/A"}
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

            <TabsContent value="pending" className="mt-4">
              {isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  {invoices?.filter(inv => inv.status === 'pending').length || 0} pending invoice
                  {invoices?.filter(inv => inv.status === 'pending').length !== 1 ? "s" : ""}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
