"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewMetrics } from "./revenue/overview-metrics";
import { RevenueChart } from "./revenue/revenue-chart";
import { SourceAnalysis } from "./revenue/source-analysis";
import { UTMAnalysis } from "./revenue/utm-analysis";
import { NetworksAnalysis } from "./revenue/networks-analysis";
import { OffersAnalysis } from "./revenue/offers-analysis";
import { revenueData } from "@/lib/mock-data/reports/revenue";

export default function RevenueTab() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-5 gap-4 h-auto p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="utm">UTM Analysis</TabsTrigger>
          <TabsTrigger value="networks">Networks</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewMetrics metrics={revenueData.metrics} />
          <RevenueChart data={revenueData.chartData} />
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <SourceAnalysis data={revenueData.sourceData} />
        </TabsContent>

        <TabsContent value="utm" className="space-y-4">
          <UTMAnalysis data={revenueData.utmData} />
        </TabsContent>

        <TabsContent value="networks" className="space-y-4">
          <NetworksAnalysis data={revenueData.networksData} />
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          <OffersAnalysis 
            data={revenueData.offersData.data} 
            trendData={revenueData.offersData.trendData} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}