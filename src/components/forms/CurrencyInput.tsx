import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number;
  onChange?: (value: number) => void;
  currency?: string;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value = 0, onChange, currency = "USD", ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(
      value ? value.toFixed(2) : "0.00"
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setDisplayValue(value.toFixed(2));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.replace(/[^0-9.]/g, "");
      
      // Allow only one decimal point
      const parts = inputValue.split(".");
      if (parts.length > 2) return;
      
      setDisplayValue(inputValue);
      
      const numericValue = parseFloat(inputValue) || 0;
      onChange?.(numericValue);
    };

    const handleBlur = () => {
      const numericValue = parseFloat(displayValue) || 0;
      setDisplayValue(numericValue.toFixed(2));
      onChange?.(numericValue);
    };

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
          $
        </span>
        <Input
          ref={ref}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn("pl-7 font-mono-financial touch-target", className)}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
