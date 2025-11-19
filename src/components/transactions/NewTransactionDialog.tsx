import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/forms/DatePicker";
import { CurrencyInput } from "@/components/forms/CurrencyInput";
import { AccountSelector } from "@/components/forms/AccountSelector";
import { Plus, Trash2 } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { toast } from "sonner";

interface NewTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TransactionLine {
  id: number;
  account_id: string;
  debit: number;
  credit: number;
  description: string;
}

export function NewTransactionDialog({ open, onOpenChange }: NewTransactionDialogProps) {
  const { createTransaction } = useTransactions();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [lines, setLines] = useState<TransactionLine[]>([
    { id: 1, account_id: "", debit: 0, credit: 0, description: "" },
    { id: 2, account_id: "", debit: 0, credit: 0, description: "" },
  ]);

  const totalDebit = lines.reduce((sum, line) => sum + line.debit, 0);
  const totalCredit = lines.reduce((sum, line) => sum + line.credit, 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const addLine = () => {
    setLines([...lines, { id: lines.length + 1, account_id: "", debit: 0, credit: 0, description: "" }]);
  };

  const removeLine = (id: number) => {
    if (lines.length > 2) {
      setLines(lines.filter((line) => line.id !== id));
    }
  };

  const updateLine = (id: number, field: keyof TransactionLine, value: any) => {
    setLines(lines.map((line) => {
      if (line.id === id) {
        const updated = { ...line, [field]: value };
        if (field === "debit" && value > 0) {
          updated.credit = 0;
        } else if (field === "credit" && value > 0) {
          updated.debit = 0;
        }
        return updated;
      }
      return line;
    }));
  };

  const handleSubmit = async () => {
    if (!isBalanced) {
      toast.error("Transaction must be balanced (debits = credits)");
      return;
    }

    const transactionNumber = `TXN-${Date.now()}`;

    setLoading(true);
    try {
      await createTransaction({
        transaction_number: transactionNumber,
        transaction_date: date.toISOString().split('T')[0],
        description,
        reference_number: referenceNumber || null,
        status: "draft",
        total_debit: totalDebit,
        total_credit: totalCredit,
      });

      toast.success("Transaction created successfully");
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to create transaction");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDate(new Date());
    setDescription("");
    setReferenceNumber("");
    setLines([
      { id: 1, account_id: "", debit: 0, credit: 0, description: "" },
      { id: 2, account_id: "", debit: 0, credit: 0, description: "" },
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <DatePicker value={date} onChange={(d) => d && setDate(d)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Reference Number</Label>
              <Input
                id="reference"
                placeholder="REF-001"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter transaction description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Transaction Lines</Label>
              <Button type="button" variant="outline" size="sm" onClick={addLine}>
                <Plus className="h-4 w-4 mr-1" />
                Add Line
              </Button>
            </div>

            {lines.map((line, index) => (
              <div key={line.id} className="p-4 border rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Account *</Label>
                    <AccountSelector
                      value={line.account_id}
                      onChange={(value) => updateLine(line.id, "account_id", value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="Line description"
                      value={line.description}
                      onChange={(e) => updateLine(line.id, "description", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Debit</Label>
                    <CurrencyInput
                      value={line.debit}
                      onChange={(value) => updateLine(line.id, "debit", value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Credit</Label>
                    <CurrencyInput
                      value={line.credit}
                      onChange={(value) => updateLine(line.id, "credit", value)}
                    />
                  </div>
                </div>
                {lines.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLine(line.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove Line
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Debit:</span>
              <span className="font-mono-financial font-semibold">${totalDebit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Credit:</span>
              <span className="font-mono-financial font-semibold">${totalCredit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Difference:</span>
              <span className={`font-mono-financial ${isBalanced ? "text-success" : "text-destructive"}`}>
                ${Math.abs(totalDebit - totalCredit).toFixed(2)}
              </span>
            </div>
            {!isBalanced && totalDebit + totalCredit > 0 && (
              <p className="text-xs text-destructive">Transaction must be balanced</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !isBalanced}>
            {loading ? "Creating..." : "Create Transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
