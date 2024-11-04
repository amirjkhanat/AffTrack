"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const MOCK_DATA = {
  placements: [
    { name: 'Homepage Banner', clicks: 15000, conversions: 750, revenue: 18750, epc: "$1.25", trend: '+12.5%' },
    { name: 'Sidebar Ad', clicks: 8900, conversions: 356, revenue: 8900, epc: "$1.00", trend: '-3.2%' },
    { name: 'In-Content', clicks: 7500, conversions: 300, revenue: 7500, epc: "$1.00", trend: '+8.7%' },
    { name: 'Footer Banner', clicks: 6200, conversions: 248, revenue: 6200, epc: "$1.00", trend: '+1.5%' }
  ],
  performanceData: [
    { name: 'Mon', impressions: 15000, clicks: 750 },
    { name: 'Tue', impressions: 12000, clicks: 480 },
    { name: 'Wed', impressions: 18000, clicks: 900 },
    { name: 'Thu', impressions: 16000, clicks: 800 },
    { name: 'Fri', impressions: 14000, clicks: 700 },
    { name: 'Sat', impressions: 11000, clicks: 550 },
    { name: 'Sun', impressions: 13000, clicks: 650 }
  ]
};

export function PlacementsAnalysis() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Placement Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DATA.performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="impressions" fill="hsl(var(--primary))" name="Impressions" />
                <Bar yAxisId="right" dataKey="clicks" fill="hsl(var(--muted-foreground))" name="Clicks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Placements Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placement</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">EPC</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_DATA.placements.map((placement, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{placement.name}</TableCell>
                  <TableCell className="text-right">{placement.clicks.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{placement.conversions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{placement.epc}</TableCell>
                  <TableCell className="text-right">${placement.revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <span className={`flex items-center justify-end ${placement.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {placement.trend.startsWith('+') ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                      {placement.trend}
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