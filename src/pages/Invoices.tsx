import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { CurrencyInput } from "@/components/forms/CurrencyInput";
import { DatePicker } from "@/components/forms/DatePicker";
import { FormField } from "@/components/forms/FormField";
import { FileUpload } from "@/components/forms/FileUpload";

export default function Invoices() {
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>();
  const [attachments, setAttachments] = useState<any[]>([]);
  const [lineItems, setLineItems] = useState([
    { id: 1, description: "", quantity: 1, rate: 0, amount: 0 },
  ]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: lineItems.length + 1, description: "", quantity: 1, rate: 0, amount: 0 },
    ]);
  };

  const removeLineItem = (id: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <PageContainer>
      <PageHeader
        title="Create Invoice"
        subtitle="New customer invoice"
        showBack
      />

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Customer" htmlFor="customer" required>
              <Input id="customer" placeholder="Select customer..." className="touch-target" />
            </FormField>
            <FormField label="Invoice Date" htmlFor="invoiceDate" required>
              <DatePicker value={invoiceDate} onChange={(d) => d && setInvoiceDate(d)} />
            </FormField>
            <FormField label="Due Date" htmlFor="dueDate" required>
              <DatePicker value={dueDate} onChange={setDueDate} />
            </FormField>
            <FormField label="Invoice Number" htmlFor="invoiceNumber" required>
              <Input id="invoiceNumber" placeholder="INV-001" className="touch-target" />
            </FormField>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Line Items</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLineItem}
                className="touch-target"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {lineItems.map((item) => (
                <div key={item.id} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Description"
                      className="touch-target"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        placeholder="Qty"
                        type="number"
                        min="1"
                        className="touch-target"
                      />
                      <CurrencyInput
                        placeholder="0.00"
                        className="touch-target"
                      />
                      <CurrencyInput
                        placeholder="0.00"
                        disabled
                        className="touch-target"
                      />
                    </div>
                  </div>
                  {lineItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLineItem(item.id)}
                      className="mt-1 touch-target text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Attachments */}
          <FormField label="Attachments" htmlFor="attachments">
            <FileUpload
              value={attachments}
              onChange={setAttachments}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={5}
              maxFiles={3}
            />
          </FormField>

          {/* Notes */}
          <FormField label="Notes" htmlFor="notes">
            <Textarea
              id="notes"
              placeholder="Additional notes or payment terms..."
              className="touch-target"
            />
          </FormField>

          {/* Totals */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-mono-financial font-semibold">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (10%):</span>
              <span className="font-mono-financial font-semibold">
                ${tax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="font-mono-financial text-primary">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1 touch-target">
              Save Draft
            </Button>
            <Button className="flex-1 touch-target">
              Send Invoice
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
