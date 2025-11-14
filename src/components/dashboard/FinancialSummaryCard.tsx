import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialSummaryCardProps {
  title: string;
  amount: number;
  change?: number;
  icon: LucideIcon;
  trend?: "up" | "down";
  className?: string;
}

export function FinancialSummaryCard({
  title,
  amount,
  change,
  icon: Icon,
  trend,
  className,
}: FinancialSummaryCardProps) {
  return (
    <Card className={cn("touch-target", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold font-mono-financial">
              ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            {change !== undefined && (
              <p
                className={cn(
                  "text-xs font-medium",
                  trend === "up" ? "text-success" : "text-destructive"
                )}
              >
                {trend === "up" ? "+" : "-"}{Math.abs(change).toFixed(1)}% from last month
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
