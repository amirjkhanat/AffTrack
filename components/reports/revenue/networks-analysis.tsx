"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface NetworkData {
  name: string;
  offers: number;
  clicks: number;
  conversions: number;
  revenue: number;
  change: string;
}

interface NetworksAnalysisProps {
  data?: NetworkData[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

const formatNumber = (value?: number) => {
  return value?.toLocaleString() ?? '0';
};

const formatCurrency = (value?: number) => {
  return `$${formatNumber(value)}`;
};

export function NetworksAnalysis({ data = [] }: NetworksAnalysisProps) {
  const pieData = data.map(item => ({
    name: item.name,
    value: item.revenue
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
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {data.slice(0, 4).map((network, i) => (
                <div key={i} className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium">{network.name}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Revenue</span>
                    <span className="font-medium">{formatCurrency(network.revenue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Conversions</span>
                    <span className="font-medium">{formatNumber(network.conversions)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Network</TableHead>
                <TableHead className="text-right">Active Offers</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((network, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{network.name}</TableCell>
                  <TableCell className="text-right">{formatNumber(network.offers)}</TableCell>
                  <TableCell className="text-right">{formatNumber(network.clicks)}</TableCell>
                  <TableCell className="text-right">{formatNumber(network.conversions)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(network.revenue)}</TableCell>
                  <TableCell className="text-right">{renderTrend(network.change)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}