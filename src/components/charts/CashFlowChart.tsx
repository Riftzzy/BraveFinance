import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Mock data
const data = [
  { month: "Jan", inflow: 45000, outflow: 32000 },
  { month: "Feb", inflow: 52000, outflow: 35000 },
  { month: "Mar", inflow: 48000, outflow: 38000 },
  { month: "Apr", inflow: 61000, outflow: 42000 },
  { month: "May", inflow: 55000, outflow: 39000 },
  { month: "Jun", inflow: 67000, outflow: 45000 },
  { month: "Jul", inflow: 72000, outflow: 48000 },
  { month: "Aug", inflow: 68000, outflow: 46000 },
  { month: "Sep", inflow: 75000, outflow: 51000 },
  { month: "Oct", inflow: 81000, outflow: 53000 },
  { month: "Nov", inflow: 78000, outflow: 55000 },
];

export function CashFlowChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="inflow"
              stroke="hsl(var(--success))"
              fillOpacity={1}
              fill="url(#colorInflow)"
              name="Cash Inflow"
            />
            <Area
              type="monotone"
              dataKey="outflow"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorOutflow)"
              name="Cash Outflow"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
