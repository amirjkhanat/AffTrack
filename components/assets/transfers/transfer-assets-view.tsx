"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  AlertCircle,
  Clock,
  Code,
  Link2,
  MoreVertical,
  Pause,
  Play,
  Settings,
  Trash2,
  Webhook
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateTransferAssets } from "@/lib/mock-data/assets/transfers";
import type { TransferAsset } from "@/lib/mock-data/assets/transfers";

export function TransferAssetsView() {
  const [transfers] = useState<TransferAsset[]>(() => generateTransferAssets(5));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500";
      case "paused":
        return "bg-yellow-500/10 text-yellow-500";
      case "expired":
        return "bg-red-500/10 text-red-500";
      default:
        return "";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const formatDuration = (ms: number) => {
    return `${ms}ms`;
  };

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="grid gap-4">
        {transfers.map((transfer) => (
          <Card key={transfer.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">
                <div className="flex items-center gap-2">
                  {transfer.name}
                  <Badge variant="outline" className={getStatusColor(transfer.status)}>
                    {transfer.status}
                  </Badge>
                </div>
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Configuration
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Code className="h-4 w-4 mr-2" />
                    Test Transfer
                  </DropdownMenuItem>
                  {transfer.status === "active" ? (
                    <DropdownMenuItem>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause Transfer
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>
                      <Play className="h-4 w-4 mr-2" />
                      Activate Transfer
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Transfer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Webhook className="h-4 w-4 mr-2" />
                      Endpoint
                    </div>
                    <p className="text-sm font-mono">{transfer.endpoint}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Link2 className="h-4 w-4 mr-2" />
                      Network
                    </div>
                    <p className="text-sm font-medium">{transfer.network}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Activity className="h-4 w-4 mr-2" />
                      Success Rate
                    </div>
                    <p className="text-sm font-medium">
                      {transfer.stats.successRate}%
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      Response Time
                    </div>
                    <p className="text-sm font-medium">
                      {formatDuration(transfer.stats.avgResponseTime)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Configuration</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pre-ping:</span>
                        <span>{transfer.prePing.enabled ? "Enabled" : "Disabled"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Transfer Type:</span>
                        <span className="capitalize">{transfer.timing.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Day Parting:</span>
                        <span>
                          {transfer.timing.dayParting.enabled
                            ? `${transfer.timing.dayParting.startTime} - ${transfer.timing.dayParting.endTime}`
                            : "Disabled"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Caps:</span>
                        <span>
                          {transfer.timing.caps.enabled
                            ? `${transfer.timing.caps.limit} ${transfer.timing.caps.type}`
                            : "Disabled"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Payout:</span>
                        <span>
                          {transfer.payout.type === "static"
                            ? `$${transfer.payout.value}`
                            : "Dynamic"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Recent Activity</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Transfers:</span>
                        <span>{transfer.stats.totalTransfers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Transfer:</span>
                        <span>{formatDate(transfer.stats.lastTransfer)}</span>
                      </div>
                      {transfer.stats.recentErrors.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground mb-2">Recent Errors:</p>
                          <div className="space-y-2">
                            {transfer.stats.recentErrors.map((error, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-2 text-sm bg-destructive/5 text-destructive rounded-md p-2"
                              >
                                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                <div className="flex-1">
                                  <p>{error.message}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {formatDate(error.timestamp)} • {error.count} occurrences
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}