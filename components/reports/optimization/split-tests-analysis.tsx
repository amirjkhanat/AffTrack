"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Crown } from "lucide-react";

const MOCK_DATA = {
  splitTests: [
    { 
      name: 'Landing Page A/B Test',
      offers: [
        { name: 'Weight Loss Program A', clicks: 5000, revenue: 25000, isWinning: true },
        { name: 'Weight Loss Program B', clicks: 5000, revenue: 20000, isWinning: false }
      ],
      confidence: '95%'
    },
    { 
      name: 'CTA Button Test',
      offers: [
        { name: 'Crypto Trading Basic', clicks: 3000, revenue: 12000, isWinning: false },
        { name: 'Crypto Trading Pro', clicks: 3000, revenue: 15000, isWinning: true }
      ],
      confidence: '90%'
    }
  ]
};

export function SplitTestsAnalysis() {
  return (
    <div className="space-y-4">
      {MOCK_DATA.splitTests.map((test, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{test.name}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {test.confidence} confidence
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Offer</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {test.offers.map((offer, j) => (
                  <TableRow key={j}>
                    <TableCell>{offer.name}</TableCell>
                    <TableCell className="text-right">{offer.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${offer.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {offer.isWinning && (
                        <span className="flex items-center justify-end text-yellow-500">
                          <Crown className="h-4 w-4 mr-1" />
                          Winner
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}