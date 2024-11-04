"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Offer = {
  id: string;
  name: string;
};

type SplitTest = {
  id: string;
  name: string;
};

interface AdPlacement {
  id: string;
  name: string;
  type: string;
  location: string;
  targetType: "OFFER" | "SPLIT_TEST";
  status: string;
  offerId?: string;
  offer?: Offer;
  splitTestId?: string;
  splitTest?: SplitTest;
  createdAt: string;
}

const getTrackingLink = (placementId: string) => {
  const trackingDomain = process.env.NEXT_PUBLIC_TRACKING_DOMAIN || 'https://track.yourdomain.com';
  return `${trackingDomain}/c/${placementId}?visit_id=\${visit_id}`;
};

export default function AdPlacementsTab() {
  const [targetType, setTargetType] = useState<"OFFER" | "SPLIT_TEST">("OFFER");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [splitTests, setSplitTests] = useState<SplitTest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [adPlacements, setAdPlacements] = useState<AdPlacement[]>([]);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    location: "",
    targetType: "OFFER" as "OFFER" | "SPLIT_TEST",
    targetId: ""
  });

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      type: "",
      location: "",
      targetType: "OFFER",
      targetId: ""
    });
    setIsEditing(false);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch all data in parallel
      const [placementsRes, offersRes, splitTestsRes] = await Promise.all([
        fetch('/api/assets/ad-placements'),
        fetch('/api/assets/offers'),
        fetch('/api/assets/split-tests')
      ]);

      // Add error checking and logging
      if (!offersRes.ok) console.error('Failed to fetch offers:', await offersRes.text());
      if (!splitTestsRes.ok) console.error('Failed to fetch split tests:', await splitTestsRes.text());
      if (!placementsRes.ok) console.error('Failed to fetch placements:', await placementsRes.text());

      // Parse the responses
      const placements = placementsRes.ok ? await placementsRes.json() : [];
      const offers = offersRes.ok ? await offersRes.json() : [];
      const splitTests = splitTestsRes.ok ? await splitTestsRes.json() : [];

      console.log('Fetched offers:', offers); // Debug log
      console.log('Fetched split tests:', splitTests); // Debug log

      // Update state with the fetched data
      setAdPlacements(placements);
      setOffers(offers);
      setSplitTests(splitTests);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Make sure we fetch on mount
  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/assets/ad-placements', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save ad placement');
      
      await fetchData();
      setIsDialogOpen(false);
      resetForm();
      toast.success(isEditing ? 'Ad placement updated' : 'Ad placement created');
    } catch (error) {
      console.error('Error saving ad placement:', error);
      toast.error('Failed to save ad placement');
    }
  };

  const handleEdit = (placement: AdPlacement) => {
    setFormData({
      id: placement.id,
      name: placement.name,
      type: placement.type,
      location: placement.location,
      targetType: placement.targetType,
      targetId: placement.targetType === "OFFER" ? placement.offerId! : placement.splitTestId!
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (placementId: string) => {
    try {
      const response = await fetch(`/api/assets/ad-placements/${placementId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete ad placement');
      
      await fetchData();
    } catch (error) {
      console.error('Error deleting ad placement:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Ad Placements</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setIsEditing(false);
              resetForm();
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Ad Placement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Ad Placement' : 'Create New Ad Placement'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter ad placement name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANNER">Banner</SelectItem>
                    <SelectItem value="NATIVE">Native</SelectItem>
                    <SelectItem value="POPUP">Popup</SelectItem>
                    <SelectItem value="WIDGET">Widget</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter placement location"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Target Type</Label>
                <RadioGroup 
                  value={formData.targetType}
                  onValueChange={(value: "OFFER" | "SPLIT_TEST") => {
                    setFormData(prev => ({ ...prev, targetType: value, targetId: "" }));
                  }}
                  className="flex items-center space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="OFFER" id="offer" />
                    <Label htmlFor="offer">Single Offer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="SPLIT_TEST" id="split-test" />
                    <Label htmlFor="split-test">Split Test</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetId">Select Target</Label>
                <Select 
                  value={formData.targetId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, targetId: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${formData.targetType.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.targetType === "OFFER" ? (
                      offers.map((offer) => (
                        <SelectItem key={offer.id} value={offer.id}>
                          {offer.name}
                        </SelectItem>
                      ))
                    ) : (
                      splitTests.map((test) => (
                        <SelectItem key={test.id} value={test.id}>
                          {test.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update' : 'Create'} Ad Placement
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adPlacements.map((placement) => (
          <Card key={placement.id}>
            <CardHeader>
              <CardTitle>{placement.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span>{placement.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location:</span>
                  <a 
                    href={placement.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View Placement
                  </a>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Target:</span>
                  <span className="text-primary">
                    {placement.targetType === "OFFER" 
                      ? placement.offer?.name 
                      : placement.splitTest?.name}
                  </span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground">Tracking Link:</span>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={getTrackingLink(placement.id)}
                      readOnly
                      className="text-xs"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(getTrackingLink(placement.id));
                        toast.success('Tracking link copied to clipboard');s
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(placement)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(placement.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && adPlacements.length === 0 && (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No ad placements found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}