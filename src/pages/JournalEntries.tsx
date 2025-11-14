import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CurrencyInput } from "@/components/forms/CurrencyInput";
import { AccountSelector } from "@/components/forms/AccountSelector";
import { DatePicker } from "@/components/forms/DatePicker";
import { FormField } from "@/components/forms/FormField";

export default function JournalEntries() {
  const [date, setDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState([
    { id: 1, account: "", debit: 0, credit: 0 },
    { id: 2, account: "", debit: 0, credit: 0 },
  ]);

  const addEntry = () => {
    setEntries([...entries, { id: entries.length + 1, account: "", debit: 0, credit: 0 }]);
  };

  const removeEntry = (id: number) => {
    if (entries.length > 2) {
      setEntries(entries.filter((e) => e.id !== id));
    }
  };

  const totalDebit = entries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = entries.reduce((sum, e) => sum + e.credit, 0);
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
          {/* Entry Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Date" htmlFor="date" required>
              <DatePicker value={date} onChange={(d) => d && setDate(d)} />
            </FormField>
            <FormField label="Reference" htmlFor="reference">
              <Input
                id="reference"
                placeholder="JE-001"
                className="touch-target"
              />
            </FormField>
          </div>

          {/* Description */}
          <FormField label="Description" htmlFor="description">
            <Textarea
              id="description"
              placeholder="Enter transaction description..."
              className="touch-target"
            />
          </FormField>

          {/* Journal Entries */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Journal Entries</span>
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
              {entries.map((entry, index) => (
                <div key={entry.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-muted/30 rounded-lg">
                  <div className="md:col-span-5">
                    <FormField label="Account" htmlFor={`account-${entry.id}`} required>
                      <AccountSelector
                        value={entry.account}
                        onChange={(accountId) => {
                          const newEntries = [...entries];
                          newEntries[index].account = accountId;
                          setEntries(newEntries);
                        }}
                      />
                    </FormField>
                  </div>
                  <div className="md:col-span-3">
                    <FormField label="Debit" htmlFor={`debit-${entry.id}`}>
                      <CurrencyInput
                        id={`debit-${entry.id}`}
                        value={entry.debit}
                        onChange={(value) => {
                          const newEntries = [...entries];
                          newEntries[index].debit = value;
                          newEntries[index].credit = 0;
                          setEntries(newEntries);
                        }}
                      />
                    </FormField>
                  </div>
                  <div className="md:col-span-3">
                    <FormField label="Credit" htmlFor={`credit-${entry.id}`}>
                      <CurrencyInput
                        id={`credit-${entry.id}`}
                        value={entry.credit}
                        onChange={(value) => {
                          const newEntries = [...entries];
                          newEntries[index].credit = value;
                          newEntries[index].debit = 0;
                          setEntries(newEntries);
                        }}
                      />
                    </FormField>
                  </div>
                  {entries.length > 2 && (
                    <div className="md:col-span-1 flex items-end pb-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEntry(entry.id)}
                        className="touch-target text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
