"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown } from "lucide-react";

interface SourceData {
  name: string;
  value: number;
  revenue?: number;
  clicks?: number;
  conversions?: number;
  change?: string;
}

interface SourceAnalysisProps {
  data: SourceData[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--muted))',
  'hsl(var(--accent))',
  'hsl(var(--secondary))'
];

export function SourceAnalysis({ data }: SourceAnalysisProps) {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const renderTrend = (change: string) => {
    if (!change) return null;
    const isPositive = change.startsWith('+');
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        <span>{change}</span>
      </div>
    );
  };

  const totalValue = data.reduce((sum, item) => sum + (item.value || 0), 0);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Source</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={(_, index) => setSelectedSource(data[index].name)}
                  onMouseLeave={() => setSelectedSource(null)}
                >
                  {data.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      opacity={selectedSource && selectedSource !== data[index].name ? 0.5 : 1}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Source Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Share</TableHead>
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((source, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{source.name}</TableCell>
                  <TableCell className="text-right">
                    ${source.value?.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {((source.value / totalValue) * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {source.change && renderTrend(source.change)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}