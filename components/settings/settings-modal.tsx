"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  AlertTriangle,
  Calendar,
  Trash2,
  ArchiveRestore
} from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    title: string;
    description: string;
    type: string;
  } | null>(null);

  const [autoCleanup, setAutoCleanup] = useState(false);
  const [retentionPeriods, setRetentionPeriods] = useState({
    visitors: "30",
    clicks: "60",
    leads: "90",
    transfers: "180",
    conversions: "365"
  });

  const handleCleanup = (type: string) => {
    const actions = {
      visitors: {
        title: "Clean visitors Data",
        description: "This will permanently delete all visit records older than the specified retention period. This action cannot be undone.",
        type: "visitors"
      },
      clicks: {
        title: "Clean Clicks Data",
        description: "This will permanently delete all click records older than the specified retention period. This action cannot be undone.",
        type: "clicks"
      },
      leads: {
        title: "Clean Leads Data",
        description: "This will permanently delete all lead records older than the specified retention period. This action cannot be undone.",
        type: "leads"
      },
      transfers: {
        title: "Clean Transfers Data",
        description: "This will permanently delete all transfer records older than the specified retention period. This action cannot be undone.",
        type: "transfers"
      },
      conversions: {
        title: "Clean Conversions Data",
        description: "This will permanently delete all conversion records older than the specified retention period. This action cannot be undone.",
        type: "conversions"
      }
    };

    setSelectedAction(actions[type as keyof typeof actions]);
    setShowConfirmDialog(true);
  };

  const executeCleanup = () => {
    // Here we would implement the actual cleanup logic
    console.log(`Cleaning up ${selectedAction?.type} data...`);
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ArchiveRestore className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">Automatic Data Cleanup</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically remove old data based on retention periods
                  </p>
                </div>
                <Switch
                  checked={autoCleanup}
                  onCheckedChange={setAutoCleanup}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(retentionPeriods).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="capitalize">{key} Retention</Label>
                    <Select
                      value={value}
                      onValueChange={(newValue) => 
                        setRetentionPeriods(prev => ({...prev, [key]: newValue}))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">365 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Manual Data Cleanup</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(retentionPeriods).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium capitalize">{key}</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {value} days retention
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCleanup(key)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clean
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {selectedAction?.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedAction?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeCleanup}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Clean Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}