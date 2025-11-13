import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const invoices = [
  { id: "INV-001", vendor: "Office Supplies Co", amount: 1250, dueDate: "2025-11-20", status: "overdue" },
  { id: "INV-002", vendor: "Tech Solutions Ltd", amount: 5400, dueDate: "2025-11-25", status: "pending" },
  { id: "INV-003", vendor: "Utilities Provider", amount: 890, dueDate: "2025-11-28", status: "pending" },
  { id: "INV-004", vendor: "Marketing Agency", amount: 3200, dueDate: "2025-12-05", status: "scheduled" },
];

export default function Payables() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <PageHeader
        title="Accounts Payable"
        subtitle="Manage vendor invoices and payments"
        actions={
          <Button className="touch-target">
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Outstanding</p>
                <p className="text-2xl font-bold font-mono-financial mt-1">
                  $10,740
                </p>
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
                <p className="text-2xl font-bold font-mono-financial mt-1 text-destructive">
                  $1,250
                </p>
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
                <p className="text-sm text-muted-foreground">Active Vendors</p>
                <p className="text-2xl font-bold font-mono-financial mt-1">24</p>
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
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-smooth cursor-pointer touch-target"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{invoice.id}</p>
                      <Badge
                        variant={
                          invoice.status === "overdue"
                            ? "destructive"
                            : invoice.status === "scheduled"
                            ? "secondary"
                            : "default"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{invoice.vendor}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {invoice.dueDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono-financial font-semibold text-lg">
                      ${invoice.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="overdue">
              <p className="text-center text-muted-foreground py-8">
                {invoices.filter((i) => i.status === "overdue").length} overdue invoice(s)
              </p>
            </TabsContent>

            <TabsContent value="pending">
              <p className="text-center text-muted-foreground py-8">
                {invoices.filter((i) => i.status === "pending").length} pending invoice(s)
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
