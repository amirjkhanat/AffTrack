"use client";

import { useState, useEffect } from "react";
import { Plus, Clock, Target, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { TransferFeedForm } from "./transfer-feed/transfer-feed-form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

interface TransferFeed {
  id: string;
  name: string;
  partnerId: string;
  partner: {
    id: string;
    name: string;
  };
  method: string;
  endpoint: string;
  headers?: any;
  bodyTemplate: string;
  successPattern: string;
  prePingEnabled: boolean;
  prePingConfig?: any;
  payoutType: 'STATIC' | 'DYNAMIC';
  payoutValue?: number;
  payoutPath?: string;
  transferTiming: {
    enabled: boolean;
    type: 'REALTIME' | 'AGED30' | 'AGED60' | 'AGED90';
  };
  scheduleConfig?: {
    enabled: boolean;
    days: string[];
    timeStart: string;
    timeEnd: string;
  };
  capConfig?: {
    enabled?: boolean;
    type?: string;
    value?: number;
  };
  conditions?: {
    rules: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  };
  status: 'ACTIVE' | 'INACTIVE' | 'TESTING';
}

export default function TransferFeedTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feeds, setFeeds] = useState<TransferFeed[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFeed, setCurrentFeed] = useState<TransferFeed | null>(null);

  useEffect(() => {
    fetchFeeds();
  }, []);

  const fetchFeeds = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/assets/transfer-feed');
      if (response.ok) {
        const data = await response.json();
        setFeeds(data);
      }
    } catch (error) {
      console.error('Failed to fetch feeds:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (feed: TransferFeed) => {
    try {
      const newStatus = feed.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      setFeeds(prevFeeds => prevFeeds.map(f => 
        f.id === feed.id ? { ...f, status: newStatus } : f
      ));

      const response = await fetch('/api/assets/transfer-feed', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...feed,
          status: newStatus
        })
      });

      if (!response.ok) {
        setFeeds(prevFeeds => prevFeeds.map(f => 
          f.id === feed.id ? { ...f, status: feed.status } : f
        ));
        throw new Error('Failed to update status');
      }

      toast.success(`Feed ${newStatus === 'ACTIVE' ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update feed status');
    }
  };

  const handleEdit = (feed: TransferFeed) => {
    console.log('Feed:', feed);
    const formattedFeed = {
      ...feed,
      webhookUrl: feed.endpoint,
      dayParting: {
        enabled: !!feed.scheduleConfig,
        monday: feed.scheduleConfig?.days.includes('MONDAY') || false,
        tuesday: feed.scheduleConfig?.days.includes('TUESDAY') || false,
        wednesday: feed.scheduleConfig?.days.includes('WEDNESDAY') || false,
        thursday: feed.scheduleConfig?.days.includes('THURSDAY') || false,
        friday: feed.scheduleConfig?.days.includes('FRIDAY') || false,
        saturday: feed.scheduleConfig?.days.includes('SATURDAY') || false,
        sunday: feed.scheduleConfig?.days.includes('SUNDAY') || false,
        startTime: feed.scheduleConfig?.timeStart || "09:00",
        endTime: feed.scheduleConfig?.timeEnd || "17:00",
      },
      capConfig: {
        enabled: feed.capConfig?.enabled ?? false,
        type: feed.capConfig?.type || "DAILY",
        value: feed.capConfig?.value || 100,
      },
      transferTiming: {
        enabled: feed.transferTiming?.enabled ?? false,
        type: feed.transferTiming?.type.toLowerCase() || '',
      },
      payoutType: feed.payoutType?.toLowerCase() || '',
      payoutAmount: feed.payoutValue?.toString() || '',
      payoutPath: feed.payoutPath || '',
      status: feed.status || 'ACTIVE',
    };

    setCurrentFeed(formattedFeed);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleFormClose = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setCurrentFeed(null);
    fetchFeeds();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Transfer Feed</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Transfer Feed
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Transfer Feed' : 'Add New Transfer Feed'}</DialogTitle>
            </DialogHeader>
            <TransferFeedForm 
              onClose={handleFormClose} 
              initialData={currentFeed}
              isEditing={isEditing}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {feeds.map((feed) => (
          <Card key={feed.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{feed.name}</CardTitle>
                <Switch 
                  checked={feed.status === 'ACTIVE'}
                  onCheckedChange={() => handleStatusToggle(feed)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Partner</p>
                    <p className="font-medium">{feed.partner.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payout</p>
                    <p className="font-medium">
                      {feed.payoutType === 'STATIC' 
                        ? `$${feed.payoutValue?.toFixed(2)} CPA`
                        : 'Dynamic Payout'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium">{feed.status}</p>
                  </div>
                </div>

                <Separator />

                {feed.scheduleConfig && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Scheduling</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{feed.scheduleConfig.days.join(', ')}</Badge>
                      <Badge variant="outline">
                        {feed.scheduleConfig.timeStart} - {feed.scheduleConfig.timeEnd}
                      </Badge>
                      <Badge variant="outline">{feed.transferTiming.type}</Badge>
                    </div>
                  </div>
                )}

                {feed.capConfig && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Caps</span>
                    </div>
                    {feed.capConfig.dailyCap && (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                        Daily Cap: {feed.capConfig.dailyCap} transfers
                      </Badge>
                    )}
                  </div>
                )}

                {feed.conditions && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Conditions</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(feed.conditions?.rules) ? feed.conditions.rules : []).map((rule, index) => (
                        <Badge key={index} variant="outline">
                          {rule.field} {rule.operator} {rule.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(feed)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && feeds.length === 0 && (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No transfer feeds found. Add one to get started.
          </div>
        )}
      </div>
    </div>
  );
}