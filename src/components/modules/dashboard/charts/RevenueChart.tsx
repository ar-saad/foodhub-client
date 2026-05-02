"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RevenueData {
  date: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  title?: string;
  description?: string;
}

export default function RevenueChart({
  data,
  title = "Revenue Overview",
  description = "Daily revenue for the last 30 days",
}: RevenueChartProps) {
  // Format date for display (e.g., "May 02")
  const formattedData = data.map((item) => {
    const date = new Date(item.date);
    return {
      ...item,
      displayDate: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
  });

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="displayDate"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#888" }}
                minTickGap={30}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#888" }}
                tickFormatter={(value) => `৳${value}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <p className="text-[10px] uppercase text-muted-foreground">
                          {label}
                        </p>
                        <p className="font-bold text-primary">
                          ৳{payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
