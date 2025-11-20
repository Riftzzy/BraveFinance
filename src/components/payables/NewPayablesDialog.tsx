import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Calendar, DollarSign, FileText } from "lucide-react";
import { format } from "date-fns";

interface Vendor {
  id: string;
  vendor_name: string;
  vendor_code: string;
}

interface NewPayablesDialogProps {
  onPayableAdded?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function NewPayablesDialog({ onPayableAdded, open, onOpenChange }: NewPayablesDialogProps) {
  const [isOpen, setIsOpen] = useState(open ?? false);
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState("");

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: format(new Date(), "yyyy-MM-dd"),
    dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    subtotal: "",
    taxRate: "10",
    notes: "",
  });

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const loadVendors = async () => {
    try {
      const { data, error } = await supabase
        .from("vendors")
        .select("id, vendor_name, vendor_code")
        .eq("is_active", true);

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error("Error loading vendors:", error);
      toast.error("Failed to load vendors");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVendor) {
      toast.error("Please select a vendor");
      return;
    }

    if (!formData.invoiceNumber) {
      toast.error("Please enter an invoice number");
      return;
    }

    if (!formData.subtotal) {
      toast.error("Please enter a subtotal amount");
      return;
    }

    setLoading(true);

    try {
      const subtotal = parseFloat(formData.subtotal);
      const taxRate = parseFloat(formData.taxRate) / 100;
      const taxAmount = subtotal * taxRate;
      const totalAmount = subtotal + taxAmount;

      const { error } = await supabase.from("invoices").insert({
        invoice_number: formData.invoiceNumber,
        invoice_type: "payable",
        invoice_date: formData.invoiceDate,
        due_date: formData.dueDate,
        vendor_id: selectedVendor,
        subtotal: subtotal,
        tax_rate: parseFloat(formData.taxRate),
        tax_amount: taxAmount,
        total_amount: totalAmount,
        paid_amount: 0,
        status: "draft",
        notes: formData.notes || null,
      });

      if (error) throw error;

      toast.success("Invoice created successfully");
      setIsOpen(false);
      onPayableAdded?.();

      setFormData({
        invoiceNumber: "",
        invoiceDate: format(new Date(), "yyyy-MM-dd"),
        dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
        subtotal: "",
        taxRate: "10",
        notes: "",
      });
      setSelectedVendor("");
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => {
          setIsOpen(true);
          loadVendors();
        }} className="touch-target">
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Payable Invoice</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vendor">
              <FileText className="inline h-4 w-4 mr-2" />
              Vendor
            </Label>
            <Select value={selectedVendor} onValueChange={setSelectedVendor}>
              <SelectTrigger id="vendor">
                <SelectValue placeholder="Select a vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.vendor_name} ({vendor.vendor_code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              placeholder="PAY-2024-001"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceDate">
                <Calendar className="inline h-4 w-4 mr-2" />
                Invoice Date
              </Label>
              <Input
                id="invoiceDate"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subtotal">
                <DollarSign className="inline h-4 w-4 mr-2" />
                Subtotal
              </Label>
              <Input
                id="subtotal"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={formData.subtotal}
                onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                placeholder="10"
                step="0.01"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="touch-target">
              {loading ? "Creating..." : "Create Invoice"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
