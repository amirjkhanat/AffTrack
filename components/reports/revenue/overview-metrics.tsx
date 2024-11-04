"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, MousePointerClick, Users, Target } from "lucide-react";

interface Metric {
  name: string;
  value: string;
  change: string;
  icon: any;
}

interface OverviewMetricsProps {
  metrics: Metric[];
}

export function OverviewMetrics({ metrics }: OverviewMetricsProps) {
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">EPV</p>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-2xl font-bold">$1.25</div>
              <p className="text-xs text-muted-foreground mt-1">
                Earnings per Visitor
              </p>
            </div>
            {renderTrend("+12.5%")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">EPC</p>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-2xl font-bold">$2.50</div>
              <p className="text-xs text-muted-foreground mt-1">
                Earnings per Click
              </p>
            </div>
            {renderTrend("+8.7%")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">EPL</p>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-2xl font-bold">$15.75</div>
              <p className="text-xs text-muted-foreground mt-1">
                Earnings per Lead
              </p>
            </div>
            {renderTrend("-3.2%")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">CVR</p>
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-2xl font-bold">4.8%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Conversion Rate
              </p>
            </div>
            {renderTrend("+5.3%")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}