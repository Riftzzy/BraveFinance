import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, Calendar, Download } from "lucide-react";

const employees = [
  { id: 1, name: "John Smith", position: "Finance Manager", salary: 6500, status: "processed" },
  { id: 2, name: "Sarah Johnson", position: "Accountant", salary: 4800, status: "processed" },
  { id: 3, name: "Mike Williams", position: "Accounts Clerk", salary: 3200, status: "pending" },
  { id: 4, name: "Emily Brown", position: "Financial Analyst", salary: 5200, status: "pending" },
];

export default function Payroll() {
  const totalPayroll = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const processed = employees.filter((e) => e.status === "processed").length;
  const pending = employees.filter((e) => e.status === "pending").length;

  return (
    <PageContainer>
      <PageHeader
        title="Payroll"
        subtitle="Employee salary management"
        actions={
          <Button className="touch-target">
            <Calendar className="h-4 w-4" />
            Process Payroll
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Payroll</p>
                <p className="text-2xl font-bold font-mono-financial mt-1">
                  ${totalPayroll.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Employees</p>
                <p className="text-2xl font-bold font-mono-financial mt-1">
                  {employees.length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Period</p>
                <p className="text-sm font-medium mt-1">
                  Processed: {processed} | Pending: {pending}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payroll Summary</CardTitle>
            <Button variant="outline" size="sm" className="touch-target">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-smooth cursor-pointer touch-target"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{employee.name}</p>
                    <Badge
                      variant={
                        employee.status === "processed" ? "default" : "secondary"
                      }
                    >
                      {employee.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{employee.position}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono-financial font-semibold text-lg">
                    ${employee.salary.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Monthly</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t mt-6 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Monthly Payroll:</span>
              <span className="text-2xl font-bold font-mono-financial text-primary">
                ${totalPayroll.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
