import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
}

// Mock data - will be replaced with real data from backend
const mockAccounts: Account[] = [
  { id: "1", code: "1000", name: "Cash", type: "Asset" },
  { id: "2", code: "1100", name: "Accounts Receivable", type: "Asset" },
  { id: "3", code: "1200", name: "Inventory", type: "Asset" },
  { id: "4", code: "2000", name: "Accounts Payable", type: "Liability" },
  { id: "5", code: "2100", name: "Notes Payable", type: "Liability" },
  { id: "6", code: "3000", name: "Owner's Equity", type: "Equity" },
  { id: "7", code: "4000", name: "Sales Revenue", type: "Revenue" },
  { id: "8", code: "5000", name: "Cost of Goods Sold", type: "Expense" },
  { id: "9", code: "6000", name: "Operating Expenses", type: "Expense" },
];

interface AccountSelectorProps {
  value?: string;
  onChange?: (accountId: string) => void;
  placeholder?: string;
  accounts?: Account[];
  className?: string;
}

export function AccountSelector({
  value,
  onChange,
  placeholder = "Select account...",
  accounts = mockAccounts,
  className,
}: AccountSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const selectedAccount = accounts.find((account) => account.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between touch-target", className)}
        >
          {selectedAccount ? (
            <span className="flex items-center gap-2">
              <span className="font-mono-financial text-muted-foreground">
                {selectedAccount.code}
              </span>
              <span>{selectedAccount.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-popover" align="start">
        <Command>
          <CommandInput placeholder="Search accounts..." className="touch-target" />
          <CommandList>
            <CommandEmpty>No account found.</CommandEmpty>
            <CommandGroup>
              {accounts.map((account) => (
                <CommandItem
                  key={account.id}
                  value={`${account.code} ${account.name}`}
                  onSelect={() => {
                    onChange?.(account.id);
                    setOpen(false);
                  }}
                  className="touch-target"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === account.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-mono-financial text-muted-foreground min-w-[60px]">
                      {account.code}
                    </span>
                    <span className="flex-1">{account.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {account.type}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
