"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const MOCK_DATA = {
  landingPages: [
    { name: 'Weight Loss LP 1', visitors: 12500, leads: 625, conversionRate: '5.0%', revenue: 15625, trend: '+12.5%' },
    { name: 'Crypto Trading LP', visitors: 8900, leads: 356, conversionRate: '4.0%', revenue: 8900, trend: '-3.2%' },
    { name: 'Fitness Program LP', visitors: 7500, leads: 300, conversionRate: '4.0%', revenue: 7500, trend: '+8.7%' },
    { name: 'Investment Course LP', visitors: 6200, leads: 248, conversionRate: '4.0%', revenue: 6200, trend: '+1.5%' },
  ],
  performanceData: [
    { name: 'Mon', visitors: 1500, leads: 75 },
    { name: 'Tue', visitors: 1200, leads: 48 },
    { name: 'Wed', visitors: 1800, leads: 90 },
    { name: 'Thu', visitors: 1600, leads: 80 },
    { name: 'Fri', visitors: 1400, leads: 70 },
    { name: 'Sat', visitors: 1100, leads: 55 },
    { name: 'Sun', visitors: 1300, leads: 65 },
  ]
};

export function LandingPagesAnalysis() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Landing Page Performance</CardTitle>
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
                <Bar yAxisId="left" dataKey="visitors" fill="hsl(var(--primary))" name="visitors" />
                <Bar yAxisId="right" dataKey="leads" fill="hsl(var(--muted-foreground))" name="Leads" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Landing Pages Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Landing Page</TableHead>
                <TableHead className="text-right">visitors</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead className="text-right">Conv. Rate</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_DATA.landingPages.map((page, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{page.name}</TableCell>
                  <TableCell className="text-right">{page.visitors.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{page.leads.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{page.conversionRate}</TableCell>
                  <TableCell className="text-right">${page.revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <span className={`flex items-center justify-end ${page.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {page.trend.startsWith('+') ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                      {page.trend}
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