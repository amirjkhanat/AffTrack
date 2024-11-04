"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TransferAssetsView } from "@/components/assets/transfers/transfer-assets-view";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransferFeedForm } from "@/components/assets/transfer-feed/transfer-feed-form";
import { useState } from "react";

export default function TransfersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transfer Assets</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Transfer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <TransferFeedForm onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <TransferAssetsView />
    </div>
  );
}