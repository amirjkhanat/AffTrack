"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LandingPageData {
  name: string;
  visitors: number;
  conversions: number;
  revenue: number;
  conversionRate: string;
  change: string;
}

interface LandingPagesAnalysisProps {
  data: LandingPageData[];
}

export function LandingPagesAnalysis({ data }: LandingPagesAnalysisProps) {
  const chartData = data.map(item => ({
    name: item.name.split(' ')[0], // Truncate name for chart
    revenue: item.revenue,
    conversions: item.conversions
  }));

  const renderTrend = (change: string) => {
    const isPositive = change.startsWith('+');
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        <span>{change}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Landing Page Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  className="text-sm" 
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  className="text-sm" 
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
                <Bar dataKey="conversions" fill="hsl(var(--secondary))" name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Landing Page</TableHead>
                <TableHead className="text-right">visitors</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">Conv. Rate</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((page, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{page.name}</TableCell>
                  <TableCell className="text-right">{page.visitors.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{page.conversions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{page.conversionRate}</TableCell>
                  <TableCell className="text-right">${page.revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{renderTrend(page.change)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}