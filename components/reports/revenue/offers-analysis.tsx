"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OfferData {
  name: string;
  network: string;
  clicks: number;
  conversions: number;
  revenue: number;
  type: string;
  change: string;
}

interface OffersAnalysisProps {
  data: OfferData[];
  trendData: Array<{
    date: string;
    revenue: number;
    transfers: number;
  }>;
}

export function OffersAnalysis({ data = [], trendData = [] }: OffersAnalysisProps) {
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

  const getTypeColor = (type: string = '') => {
    switch (type.toUpperCase()) {
      case 'CPA':
        return "bg-blue-500/10 text-blue-500";
      case 'CPL':
        return "bg-green-500/10 text-green-500";
      case 'CPC':
        return "bg-purple-500/10 text-purple-500";
      case 'REVSHARE':
        return "bg-orange-500/10 text-orange-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Offer Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-sm" 
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  yAxisId="left"
                  className="text-sm" 
                  stroke="hsl(var(--primary))"
                  tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  className="text-sm" 
                  stroke="hsl(var(--secondary))"
                  tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  name="Revenue"
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="transfers" 
                  stroke="hsl(var(--secondary))" 
                  name="Transfers"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offer</TableHead>
                <TableHead>Network</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((offer, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{offer.name}</TableCell>
                  <TableCell>{offer.network}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeColor(offer.type)}>
                      {offer.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{(offer.clicks || 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{(offer.conversions || 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right">${(offer.revenue || 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{renderTrend(offer.change)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}