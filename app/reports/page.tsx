"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { Download, RefreshCcw } from "lucide-react";
import DashboardTab from "@/components/reports/dashboard-tab";
import RealtimeTab from "@/components/reports/realtime-tab";
import RevenueTab from "@/components/reports/revenue-tab";
import OptimizationTab from "@/components/reports/optimization-tab";
import { startOfMonth } from "date-fns";

export default function ReportsPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date()
  });

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div data-tab-content="realtime" className="hidden">
            <Button variant="outline" size="icon">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
          <div data-tab-content="not-realtime" className="flex gap-2">
            <DatePickerWithRange date={date} setDate={setDate} />
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <Tabs 
        defaultValue="dashboard" 
        className="space-y-4"
        onValueChange={(value) => {
          const isRealtime = value === "realtime";
          document.querySelector('[data-tab-content="realtime"]')?.classList.toggle('hidden', !isRealtime);
          document.querySelector('[data-tab-content="not-realtime"]')?.classList.toggle('hidden', isRealtime);
        }}
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="realtime">Real-Time</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardTab />
        </TabsContent>

        <TabsContent value="realtime">
          <RealtimeTab />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueTab />
        </TabsContent>

        <TabsContent value="optimization">
          <OptimizationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}