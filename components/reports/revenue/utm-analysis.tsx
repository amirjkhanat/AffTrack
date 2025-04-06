"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UTMData {
  campaign: string;
  medium: string;
  source: string;
  visitors: number;
  clicks: number;
  leads: number;
  revenue: number;
  conversions: number;
}

interface UTMAnalysisProps {
  data: UTMData[];
}

export function UTMAnalysis({ data }: UTMAnalysisProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"campaign" | "medium" | "source">("campaign");

  const renderTrend = (change?: string) => {
    if (!change) return null;
    const isPositive = change.startsWith('+');
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        <span>{change}</span>
      </div>
    );
  };

  const filteredData = data.filter(item => {
    const searchValue = item[filterType].toLowerCase();
    return searchValue.includes(searchTerm.toLowerCase());
  });

  const totalvisitors = filteredData.reduce((sum, item) => sum + item.visitors, 0);
  const totalClicks = filteredData.reduce((sum, item) => sum + item.clicks, 0);
  const totalLeads = filteredData.reduce((sum, item) => sum + item.leads, 0);
  const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
  const totalConversions = filteredData.reduce((sum, item) => sum + item.conversions, 0);

  const aggregateByField = (field: "campaign" | "medium" | "source") => {
    const aggregated = new Map<string, { visitors: number; clicks: number; leads: number; revenue: number; conversions: number }>();

    filteredData.forEach(item => {
      const key = item[field];
      const existing = aggregated.get(key) || { visitors: 0, clicks: 0, leads: 0, revenue: 0, conversions: 0 };
      aggregated.set(key, {
        visitors: existing.visitors + item.visitors,
        clicks: existing.clicks + item.clicks,
        leads: existing.leads + item.leads,
        revenue: existing.revenue + item.revenue,
        conversions: existing.conversions + item.conversions
      });
    });

    return Array.from(aggregated.entries()).map(([key, value]) => ({
      name: key,
      ...value,
      share: (value.revenue / totalRevenue * 100).toFixed(1)
    }));
  };

  const aggregatedData = aggregateByField(filterType);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalvisitors.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>UTM Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select
              value={filterType}
              onValueChange={(value: "campaign" | "medium" | "source") => setFilterType(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="campaign">Campaign</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="source">Source</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">visitors</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Leads</TableHead>
                  <TableHead className="text-right">Conversions</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aggregatedData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">{item.visitors.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.leads.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.conversions.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${item.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.share}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}