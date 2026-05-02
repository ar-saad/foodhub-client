"use client";

import {
  Bar,
  BarChart,
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

interface TopMealData {
  name: string;
  sales: number;
}

interface TopMealsChartProps {
  data: TopMealData[];
}

export default function TopMealsChart({ data }: TopMealsChartProps) {
  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle>Top Selling Meals</CardTitle>
        <CardDescription>Most popular items in your restaurant</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#888" }}
                width={80}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <p className="text-[10px] uppercase text-muted-foreground">
                          {label}
                        </p>
                        <p className="font-bold text-primary">
                          {payload[0].value} Sold
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="sales"
                fill="#f97316"
                radius={[0, 4, 4, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
