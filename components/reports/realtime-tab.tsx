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
  const data = realtimeData.generateFeed(activeTab);

  const filteredItems = data.items.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    
    // Common fields to search
    const commonFields = [
      item.ipAddress,
      item.location,
      Object.values(item.utmTags || {}).join(" ")
    ].join(" ").toLowerCase();

    // Type-specific fields
    switch (activeTab) {
      case "visitors":
        return commonFields.includes(searchLower) ||
          item.sourceName.toLowerCase().includes(searchLower) ||
          item.landingPage.name.toLowerCase().includes(searchLower);
      
      case "leads":
        return commonFields.includes(searchLower) ||
          item.leadDetails?.firstName?.toLowerCase().includes(searchLower) ||
          item.leadDetails?.lastName?.toLowerCase().includes(searchLower) ||
          item.leadDetails?.email?.toLowerCase().includes(searchLower);
      
      case "clicks":
        return commonFields.includes(searchLower) ||
          item.placement.name.toLowerCase().includes(searchLower) ||
          item.offer.name.toLowerCase().includes(searchLower);
      
      case "transfers":
        return commonFields.includes(searchLower) ||
          item.network.toLowerCase().includes(searchLower) ||
          item.offer.toLowerCase().includes(searchLower);
      
      case "conversions":
        return commonFields.includes(searchLower) ||
          item.offer.name.toLowerCase().includes(searchLower) ||
          item.placement.toLowerCase().includes(searchLower);
      
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