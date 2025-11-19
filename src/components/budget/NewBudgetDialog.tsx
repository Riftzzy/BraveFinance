import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/forms/DatePicker";
import { CurrencyInput } from "@/components/forms/CurrencyInput";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useBudgets } from "@/hooks/useBudgets";

interface NewBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewBudgetDialog({ open, onOpenChange }: NewBudgetDialogProps) {
  const { refetch } = useBudgets();
  const [loading, setLoading] = useState(false);
  const [budgetName, setBudgetName] = useState("");
  const [description, setDescription] = useState("");
  const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>();
  const [totalAmount, setTotalAmount] = useState(0);

  const handleSubmit = async () => {
    if (!budgetName.trim()) {
      toast.error("Budget name is required");
      return;
    }

    if (!endDate) {
      toast.error("End date is required");
      return;
    }

    if (endDate <= startDate) {
      toast.error("End date must be after start date");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("budgets")
        .insert({
          budget_name: budgetName,
          description: description || null,
          fiscal_year: fiscalYear,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          total_amount: totalAmount,
          status: "draft",
        });

      if (error) throw error;

      toast.success("Budget created successfully");
      onOpenChange(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error creating budget:", error);
      toast.error("Failed to create budget");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBudgetName("");
    setDescription("");
    setFiscalYear(new Date().getFullYear());
    setStartDate(new Date());
    setEndDate(undefined);
    setTotalAmount(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Budget</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budgetName">Budget Name *</Label>
            <Input
              id="budgetName"
              placeholder="e.g., Annual Budget 2024"
              value={budgetName}
              onChange={(e) => setBudgetName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter budget description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fiscalYear">Fiscal Year *</Label>
              <Input
                id="fiscalYear"
                type="number"
                min="2000"
                max="2100"
                value={fiscalYear}
                onChange={(e) => setFiscalYear(parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <DatePicker value={startDate} onChange={(d) => d && setStartDate(d)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <DatePicker value={endDate} onChange={setEndDate} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalAmount">Total Budget Amount</Label>
            <CurrencyInput
              id="totalAmount"
              value={totalAmount}
              onChange={setTotalAmount}
              placeholder="0.00"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Budget"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
