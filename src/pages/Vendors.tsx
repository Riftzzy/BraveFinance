import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Mail, Phone } from "lucide-react";

const vendors = [
  { id: 1, name: "Office Supplies Co", email: "contact@officesupplies.com", phone: "+1 234 567 8900", balance: 1250, status: "active" },
  { id: 2, name: "Tech Solutions Ltd", email: "info@techsolutions.com", phone: "+1 234 567 8901", balance: 5400, status: "active" },
  { id: 3, name: "Utilities Provider", email: "billing@utilities.com", phone: "+1 234 567 8902", balance: 890, status: "active" },
  { id: 4, name: "Marketing Agency", email: "hello@marketing.com", phone: "+1 234 567 8903", balance: 0, status: "active" },
];

export default function Vendors() {
  return (
    <PageContainer>
      <PageHeader
        title="Vendors"
        subtitle="Manage vendor contacts and terms"
        showBack
        actions={
          <Button className="touch-target">
            <Plus className="h-4 w-4" />
            New Vendor
          </Button>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            className="pl-10 touch-target"
          />
        </div>
      </div>

      {/* Vendors List */}
      <div className="space-y-3">
        {vendors.map((vendor) => (
          <Card key={vendor.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{vendor.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Vendor ID: {vendor.id.toString().padStart(4, "0")}
                  </p>
                </div>
                {vendor.balance > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Outstanding</p>
                    <p className="font-mono-financial font-semibold text-warning">
                      ${vendor.balance.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{vendor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{vendor.phone}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 touch-target">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1 touch-target">
                  Transactions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
