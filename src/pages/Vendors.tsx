import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useVendors } from "@/hooks/useVendors";
import { ExportButton } from "@/components/ExportButton";
import { useToast } from "@/hooks/use-toast";

export default function Vendors() {
  const { vendors, isLoading } = useVendors();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredVendors = vendors?.filter(vendor =>
    vendor.vendor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewVendor = () => {
    toast({
      title: "Coming Soon",
      description: "Vendor creation form will be available soon",
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Vendors"
        subtitle="Manage vendor contacts and terms"
        showBack
        actions={
          <div className="flex gap-2">
            <ExportButton 
              data={vendors || []} 
              filename="vendors"
              disabled={!vendors || vendors.length === 0}
            />
            <Button onClick={handleNewVendor} className="touch-target">
              <Plus className="h-4 w-4" />
              New Vendor
            </Button>
          </div>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            className="pl-10 touch-target"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Vendors List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : filteredVendors && filteredVendors.length > 0 ? (
        <div className="space-y-3">
          {filteredVendors.map((vendor) => (
            <Card key={vendor.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{vendor.vendor_name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {vendor.vendor_code ? `Code: ${vendor.vendor_code}` : "No code"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={vendor.is_active ? "default" : "secondary"}>
                      {vendor.is_active ? "Active" : "Inactive"}
                    </Badge>
                    {vendor.current_balance && vendor.current_balance > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Outstanding</p>
                        <p className="font-mono-financial font-semibold text-warning">
                          ${vendor.current_balance.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {vendor.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{vendor.email}</span>
                    </div>
                  )}
                  {vendor.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{vendor.phone}</span>
                    </div>
                  )}
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
      ) : (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            {searchQuery ? "No vendors found matching your search" : "No vendors found"}
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
