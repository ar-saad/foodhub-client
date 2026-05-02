"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface OrderStatusData {
  status: string;
  count: number;
}

interface OrderStatusChartProps {
  data: OrderStatusData[];
}

const COLORS = [
  "#2563eb", // Blue
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#6366f1", // Indigo
];

export default function OrderStatusChart({ data }: OrderStatusChartProps) {
  // Filter out zero counts
  const filteredData = data.filter((item) => item.count > 0);

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
        <CardDescription>Distribution of all orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
                nameKey="status"
              >
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <p className="text-[10px] uppercase text-muted-foreground">
                          {payload[0].name}
                        </p>
                        <p className="font-bold">{payload[0].value} Orders</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-xs text-muted-foreground capitalize">
                    {value.toLowerCase().replace(/_/g, " ")}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
