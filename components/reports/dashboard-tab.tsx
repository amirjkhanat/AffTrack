"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, MousePointerClick, UserCheck2, DollarSign, ArrowRightLeft, Target, TrendingDown, TrendingUp } from "lucide-react";

// Define types for our API response
type MetricsData = {
  visitors: number;
  clicks: number;
  leads: number;
  transfers: number;
  conversions: number;
  revenue: number;
};

type TrendData = {
  date: string;
  visitors: number;
  leads: number;
  transfers: number;
  conversions: number;
  revenue: number;
}[];

// Update metrics array (remove clicks as it's not in the API)
const metrics = [
  {
    title: "Total visitors",
    value: (metrics: MetricsData) => metrics.visitors.toLocaleString(),
    icon: Users,
    description: "Unique visitors to landing pages"
  },
  {
    title: "Total Clicks",
    value: (metrics: MetricsData) => metrics.clicks.toLocaleString(),
    icon: MousePointerClick,
    description: "Total click events tracked"
  },
  {
    title: "Total Leads",
    value: (metrics: MetricsData) => metrics.leads.toLocaleString(),
    icon: UserCheck2,
    description: "Captured lead information"
  },
  {
    title: "Total Transfers",
    value: (metrics: MetricsData) => metrics.transfers.toLocaleString(),
    icon: ArrowRightLeft,
    description: "Successful lead sales"
  },
  {
    title: "Total Conversions",
    value: (metrics: MetricsData) => metrics.conversions.toLocaleString(),
    icon: Target,
    description: "Successful offer conversions"
  },
  {
    title: "Total Revenue",
    value: (metrics: MetricsData) => `$${metrics.revenue.toLocaleString()}`,
    icon: DollarSign,
    description: "Total revenue generated"
  }
];

interface DashboardTabProps {
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export default function DashboardTab({ dateRange }: DashboardTabProps) {
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  const [trendData, setTrendData] = useState<TrendData>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const params = new URLSearchParams();
        if (dateRange?.from) {
          params.append('startDate', dateRange.from.toISOString());
        }
        if (dateRange?.to) {
          params.append('endDate', dateRange.to.toISOString());
        }

        const response = await fetch(`/api/reports/dashboard?${params.toString()}`);
        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(responseData.details || responseData.error || 'Failed to fetch dashboard data');
        }
        
        setMetricsData(responseData.data.metrics);
        setTrendData(responseData.data.trend.map((item: any) => ({
          ...item,
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        })));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [dateRange]); // Re-fetch when date range changes

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="animate-pulse h-4 w-1/2 bg-muted rounded" />
                  <div className="animate-pulse h-8 w-3/4 bg-muted rounded" />
                  <div className="animate-pulse h-3 w-2/3 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse h-[400px] bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }
  if (error) return <div className="flex justify-center p-8 text-red-500">Error: {error}</div>;
  if (!metricsData) return null;

  const hasData = Object.values(metricsData).some(value => value > 0) || trendData.length > 0;

  return (
    <div className="space-y-8">
      {!hasData && (
        <div className="text-center p-4 text-muted-foreground">
          No data available for the selected period. Start tracking visitors and conversions to see metrics here.
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium">{metric.title}</p>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="text-2xl font-bold">{metric.value(metricsData)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metric.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          {!hasData ? (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              No trend data available
            </div>
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-sm" 
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    className="text-sm" 
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => `${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="hsl(var(--primary))" 
                    name="visitors"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="leads" 
                    stroke="hsl(var(--secondary))" 
                    name="Leads"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="transfers" 
                    stroke="hsl(var(--accent))" 
                    name="Transfers"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="conversions" 
                    stroke="hsl(var(--muted-foreground))" 
                    name="Conversions"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(145, 80%, 40%)" 
                    name="Revenue"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="hsl(var(--warning))" 
                    name="Clicks"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}