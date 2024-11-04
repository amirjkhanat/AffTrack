"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import TrafficSourcesTab from "@/components/assets/traffic-sources-tab";
import LandingPagesTab from "@/components/assets/landing-pages-tab";
import AdPlacementsTab from "@/components/assets/ad-placements-tab";
import NetworksTab from "@/components/assets/networks-tab";
import OffersTab from "@/components/assets/offers-tab";
import TrackingLinksTab from "@/components/assets/tracking-links-tab";
import SplitTestsTab from "@/components/assets/split-tests-tab";
import TransferFeedTab from "@/components/assets/transfer-feed-tab";
import TransferPartnersTab from "@/components/assets/transfer-partners-tab";

export default function AssetsPage() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Asset Management</h1>
      </div>

      <Tabs defaultValue="traffic-sources" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4">
          <TabsTrigger value="traffic-sources">Traffic Sources</TabsTrigger>
          <TabsTrigger value="landing-pages">Landing Pages</TabsTrigger>
          <TabsTrigger value="ad-placements">Ad Placements</TabsTrigger>
          <TabsTrigger value="networks">Networks</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="split-tests">Split Tests</TabsTrigger>
          <TabsTrigger value="tracking">Tracking Links</TabsTrigger>
          <TabsTrigger value="transfer-feed">Transfer Feed</TabsTrigger>
          <TabsTrigger value="transfer-partners">Transfer Partners</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic-sources">
          <TrafficSourcesTab />
        </TabsContent>

        <TabsContent value="landing-pages">
          <LandingPagesTab />
        </TabsContent>

        <TabsContent value="ad-placements">
          <AdPlacementsTab />
        </TabsContent>

        <TabsContent value="networks">
          <NetworksTab />
        </TabsContent>

        <TabsContent value="offers">
          <OffersTab />
        </TabsContent>

        <TabsContent value="split-tests">
          <SplitTestsTab />
        </TabsContent>

        <TabsContent value="tracking">
          <TrackingLinksTab />
        </TabsContent>

        <TabsContent value="transfer-feed">
          <TransferFeedTab />
        </TabsContent>

        <TabsContent value="transfer-partners">
          <TransferPartnersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}