"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { LiveFeed } from "./realtime/live-feed";
import { realtimeData } from "@/lib/mock-data/realtime";
import { FeedType } from "./realtime/types";

export default function RealtimeTab() {
  const [activeTab, setActiveTab] = useState<FeedType>("visitors");
  const [searchTerm, setSearchTerm] = useState("");
  const data = activeTab === "clicks"
    ? { metrics: {}, items: [] } // отключаем mock-данные для кликов
    : realtimeData.generateFeed(activeTab);

  const filteredItems = data.items.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    // Common fields to search
    const commonFields = [
      item.ipAddress,
      item.location,
      Object.values(item.utmTags || {}).join(" ")
    ].join(" ").toLowerCase();

    switch (activeTab) {
      case "visitors":
        return commonFields.includes(searchLower) ||
          (typeof item.sourceName === 'string' && item.sourceName.toLowerCase().includes(searchLower)) ||
          (typeof item.landingPage === 'string' && item.landingPage.toLowerCase().includes(searchLower)) ||
          (typeof item.landingPage === 'object' && item.landingPage?.name && item.landingPage.name.toLowerCase().includes(searchLower));
      case "leads":
        return commonFields.includes(searchLower) ||
          (item.leadDetails?.firstName && item.leadDetails.firstName.toLowerCase().includes(searchLower)) ||
          (item.leadDetails?.lastName && item.leadDetails.lastName.toLowerCase().includes(searchLower)) ||
          (item.leadDetails && 'email' in item.leadDetails && item.leadDetails.email && item.leadDetails.email.toLowerCase().includes(searchLower));
      case "clicks":
        return commonFields.includes(searchLower) ||
          (item.placement && typeof item.placement === 'object' && item.placement.name && item.placement.name.toLowerCase().includes(searchLower)) ||
          (item.offer && typeof item.offer === 'object' && item.offer.name && item.offer.name.toLowerCase().includes(searchLower));
      case "transfers":
        return commonFields.includes(searchLower) ||
          (typeof item.network === 'string' && item.network.toLowerCase().includes(searchLower)) ||
          (typeof item.offer === 'string' && item.offer.toLowerCase().includes(searchLower));
      case "conversions":
        return commonFields.includes(searchLower) ||
          (item.offer && typeof item.offer === 'object' && item.offer.name && item.offer.name.toLowerCase().includes(searchLower)) ||
          (typeof item.placement === 'string' && item.placement.toLowerCase().includes(searchLower)) ||
          (item.placement && typeof item.placement === 'object' && item.placement.name && item.placement.name.toLowerCase().includes(searchLower));
      default:
        return true;
    }
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Real-Time Activity</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FeedType)} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="visitors">visitors</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="clicks">Clicks</TabsTrigger>
              <TabsTrigger value="transfers">Transfers</TabsTrigger>
              <TabsTrigger value="conversions">Conversions</TabsTrigger>
            </TabsList>

            <TabsContent value="visitors">
              <LiveFeed type="visitors" items={filteredItems} metrics={data.metrics} />
            </TabsContent>

            <TabsContent value="leads">
              <LiveFeed type="leads" items={filteredItems} />
            </TabsContent>

            <TabsContent value="clicks">
              <LiveFeed type="clicks" items={filteredItems} />
            </TabsContent>

            <TabsContent value="transfers">
              <LiveFeed type="transfers" items={filteredItems} />
            </TabsContent>

            <TabsContent value="conversions">
              <LiveFeed type="conversions" items={filteredItems} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}