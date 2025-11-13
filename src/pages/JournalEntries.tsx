import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function JournalEntries() {
  const [date, setDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState([
    { id: 1, account: "", debit: "", credit: "" },
    { id: 2, account: "", debit: "", credit: "" },
  ]);

  const addEntry = () => {
    setEntries([...entries, { id: entries.length + 1, account: "", debit: "", credit: "" }]);
  };

  const removeEntry = (id: number) => {
    if (entries.length > 2) {
      setEntries(entries.filter((e) => e.id !== id));
    }
  };

  const totalDebit = entries.reduce((sum, e) => sum + (parseFloat(e.debit) || 0), 0);
  const totalCredit = entries.reduce((sum, e) => sum + (parseFloat(e.credit) || 0), 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  return (
    <PageContainer>
      <PageHeader
        title="Journal Entry"
        subtitle="Create new journal entry"
        showBack
      />

      <Card>
        <CardHeader>
          <CardTitle>Entry Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal touch-target",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} />
              </PopoverContent>
            </Popover>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter transaction description..."
              className="touch-target"
            />
          </div>

          {/* Journal Entries */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Journal Entries</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEntry}
                className="touch-target"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Line
              </Button>
            </div>

            <div className="space-y-3">
              {entries.map((entry) => (
                <div key={entry.id} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <Input placeholder="Account" className="touch-target" />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Debit"
                        type="number"
                        className="touch-target font-mono-financial"
                      />
                      <Input
                        placeholder="Credit"
                        type="number"
                        className="touch-target font-mono-financial"
                      />
                    </div>
                  </div>
                  {entries.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEntry(entry.id)}
                      className="mt-1 touch-target text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Total Debit:</span>
                <span className="font-mono-financial font-semibold">
                  ${totalDebit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Total Credit:</span>
                <span className="font-mono-financial font-semibold">
                  ${totalCredit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span>Difference:</span>
                <span
                  className={cn(
                    "font-mono-financial",
                    isBalanced ? "text-success" : "text-destructive"
                  )}
                >
                  ${Math.abs(totalDebit - totalCredit).toFixed(2)}
                </span>
              </div>
              {!isBalanced && totalDebit + totalCredit > 0 && (
                <p className="text-xs text-destructive">
                  Entry must be balanced (debits = credits)
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1 touch-target">
              Save Draft
            </Button>
            <Button
              className="flex-1 touch-target"
              disabled={!isBalanced}
            >
              Post Entry
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
