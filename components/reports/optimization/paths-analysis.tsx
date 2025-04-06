"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const MOCK_DATA = {
  paths: [
    { path: '/weight-loss/keto', clicks: 8500, conversions: 425, revenue: 12750, trend: '+12.5%' },
    { path: '/crypto/bitcoin', clicks: 6200, conversions: 248, revenue: 7440, trend: '-3.2%' },
    { path: '/fitness/hiit', clicks: 5100, conversions: 204, revenue: 6120, trend: '+8.7%' },
    { path: '/invest/stocks', clicks: 4200, conversions: 168, revenue: 5040, trend: '+1.5%' }
  ],
  trendData: [
    { date: 'Mon', clicks: 850, conversions: 42 },
    { date: 'Tue', clicks: 740, conversions: 37 },
    { date: 'Wed', clicks: 920, conversions: 46 },
    { date: 'Thu', clicks: 880, conversions: 44 },
    { date: 'Fri', clicks: 810, conversions: 40 },
    { date: 'Sat', clicks: 750, conversions: 37 },
    { date: 'Sun', clicks: 790, conversions: 39 }
  ]
};

export function PathsAnalysis() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Path Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_DATA.trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" name="Clicks" />
                <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="hsl(var(--muted-foreground))" name="Conversions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Path Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Path</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_DATA.paths.map((path, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{path.path}</TableCell>
                  <TableCell className="text-right">{path.clicks.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{path.conversions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${path.revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <span className={`flex items-center justify-end ${path.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {path.trend.startsWith('+') ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                      {path.trend}
                    </span>
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