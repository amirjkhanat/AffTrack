"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TransferFeedForm } from "./transfer-feed-form";

export default function TransferFeedTab() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Transfer Feed</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Transfer Feed
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Transfer Feed</DialogTitle>
            </DialogHeader>
            <TransferFeedForm onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Partner API Integration</CardTitle>
              <Badge variant="outline" className="bg-green-500/10 text-green-500">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Webhook URL</p>
                  <p className="font-mono">https://api.partner.com/webhook</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Method</p>
                  <p className="font-medium">POST</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Success Pattern</p>
                  <p className="font-mono text-xs">status: "approved"</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payout</p>
                  <p className="font-medium">$45.00 (Static)</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Request Body</p>
                <div className="bg-muted p-3 rounded-md">
                  <pre className="text-xs font-mono whitespace-pre-wrap">
{`{
  "firstName": "{firstName}",
  "lastName": "{lastName}",
  "email": "{email}",
  "campaign": "{utm_campaign}"
}`}
                  </pre>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Last transfer: 2 minutes ago</span>
                </div>
                <Button variant="outline" size="sm">
                  Test Webhook
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}