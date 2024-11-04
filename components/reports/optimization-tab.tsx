"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LandingPagesAnalysis } from "./optimization/landing-pages-analysis";
import { PathsAnalysis } from "./optimization/paths-analysis";
import { PlacementsAnalysis } from "./optimization/placements-analysis";
import { SplitTestsAnalysis } from "./optimization/split-tests-analysis";

export default function OptimizationTab() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="landing-pages" className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-4">
          <TabsTrigger value="landing-pages">Landing Pages</TabsTrigger>
          <TabsTrigger value="paths">Paths</TabsTrigger>
          <TabsTrigger value="placements">Placements</TabsTrigger>
          <TabsTrigger value="split-tests">Split Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="landing-pages">
          <LandingPagesAnalysis />
        </TabsContent>

        <TabsContent value="paths">
          <PathsAnalysis />
        </TabsContent>

        <TabsContent value="placements">
          <PlacementsAnalysis />
        </TabsContent>

        <TabsContent value="split-tests">
          <SplitTestsAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
}