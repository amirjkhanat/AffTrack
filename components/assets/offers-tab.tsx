"use client";

import { Plus, Link as LinkIcon, User as UserIcon } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Parameter {
  key: string;
  value: string;
}

const USER_PARAMETERS = [
  { label: "First Name", value: "{firstName}" },
  { label: "Last Name", value: "{lastName}" },
  { label: "Email", value: "{email}" },
  { label: "Phone", value: "{phone}" },
  { label: "Address", value: "{address}" },
  { label: "City", value: "{city}" },
  { label: "State", value: "{state}" },
  { label: "Zip Code", value: "{zipcode}" },
  { label: "Birth Month", value: "{dob_mm}" },
  { label: "Birth Day", value: "{dob_dd}" },
  { label: "Birth Year", value: "{dob_yyyy}" },
];

const UTM_PARAMETERS = [
  { label: "UTM Source", value: "{utm_source}" },
  { label: "UTM Medium", value: "{utm_medium}" },
  { label: "UTM Campaign", value: "{utm_campaign}" },
  { label: "UTM Content", value: "{utm_content}" },
  { label: "UTM Term", value: "{utm_term}" },
];

const TRACKING_PARAMETERS = [
  { label: "Click ID", value: "{click_id}" },
  { label: "Offer ID", value: "{offer_id}" },
  { label: "Network ID", value: "{network_id}" },
  { label: "Source ID", value: "{source_id}" },
  { label: "Campaign ID", value: "{campaign_id}" },
  { label: "Affiliate ID", value: "{affiliate_id}" }
];

interface Offer {
  id: string;
  name: string;
  networkId: string;
  type: string;
  payout: number;
  payoutType: string;
  description: string;
  status: string;
  createdAt: Date;
}

interface Network {
  id: string;
  name: string;
  website: string;
  loginUrl: string;
  status: string;
  _count: {
    offers: number;
  };
}

export default function OffersTab() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [offerUrl, setOfferUrl] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    network: "",
    type: "CPA",
    payout: 0,
    description: "",
    status: "ACTIVE",
    url: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchOffers();
    fetchNetworks();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/assets/offers');
      if (!response.ok) throw new Error('Failed to fetch offers');
      const data = await response.json();
      console.log('Fetched offers:', data);
      setOffers(data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const fetchNetworks = async () => {
    try {
      const response = await fetch('/api/assets/networks');
      if (!response.ok) throw new Error('Failed to fetch networks');
      const data = await response.json();
      setNetworks(data);
    } catch (error) {
      console.error('Error fetching networks:', error);
    }
  };

  const handleEdit = (offer: any) => {
    console.log('Editing offer:', offer);
    setFormData({
      id: offer.id,
      name: offer.name,
      network: offer.network || "",
      type: offer.type || "CPA",
      payout: parseFloat(offer.payout) || 0,
      description: offer.description || "",
      status: offer.status || "ACTIVE"
    });
    setOfferUrl(offer.url || "");
    setIsEditing(true);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', { ...formData, url: offerUrl });
    try {
      const response = await fetch('/api/assets/offers', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          url: offerUrl
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} offer`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (isEditing) {
        setOffers(offers.map(offer => 
          offer.id === data.id ? { ...data, url: offerUrl } : offer
        ));
      } else {
        setOffers([...offers, { ...data, url: offerUrl }]);
      }
      
      setOpen(false);
      setIsEditing(false);
      setFormData({
        id: "",
        name: "",
        network: "",
        type: "CPA",
        payout: 0,
        description: "",
        status: "ACTIVE"
      });
      setOfferUrl("");
    } catch (error) {
      console.error(`Failed to ${isEditing ? 'update' : 'create'} offer:`, error);
    }
  };

  const insertParameter = (paramValue: string) => {
    const newUrl = offerUrl.slice(0, cursorPosition) + paramValue + offerUrl.slice(cursorPosition);
    setOfferUrl(newUrl);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Affiliate Offers</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Offer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Offer' : 'Add New Offer'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter offer name" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="network">Network</Label>
                <Select
                  value={formData.network}
                  onValueChange={(value) => setFormData({ ...formData, network: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    {networks?.map((network) => (
                      <SelectItem key={network.id} value={network.id}>
                        {network.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payout">Payout</Label>
                  <Input
                    id="payout"
                    type="number"
                    step="0.01"
                    value={formData.payout}
                    onChange={(e) => setFormData({...formData, payout: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Offer Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CPA">CPA</SelectItem>
                      <SelectItem value="CPL">CPL</SelectItem>
                      <SelectItem value="CPC">CPC</SelectItem>
                      <SelectItem value="REVSHARE">Revenue Share</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter description"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="url">Offer URL</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <UserIcon className="h-4 w-4 mr-2" />
                          User
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56" align="end">
                        <div className="space-y-1">
                          {USER_PARAMETERS.map((param) => (
                            <Button
                              key={param.value}
                              variant="ghost"
                              className="w-full justify-start text-left"
                              onClick={() => insertParameter(param.value)}
                            >
                              {param.label}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <LinkIcon className="h-4 w-4 mr-2" />
                          UTM
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56" align="end">
                        <div className="space-y-1">
                          {UTM_PARAMETERS.map((param) => (
                            <Button
                              key={param.value}
                              variant="ghost"
                              className="w-full justify-start text-left"
                              onClick={() => insertParameter(param.value)}
                            >
                              {param.label}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Track
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56" align="end">
                        <div className="space-y-1">
                          {TRACKING_PARAMETERS.map((param) => (
                            <Button
                              key={param.value}
                              variant="ghost"
                              className="w-full justify-start text-left"
                              onClick={() => insertParameter(param.value)}
                            >
                              {param.label}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <Textarea
                  id="url"
                  value={offerUrl}
                  onChange={(e) => setOfferUrl(e.target.value)}
                  onSelect={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    setCursorPosition(target.selectionStart || 0);
                  }}
                  placeholder="https://example.com/offer"
                  className="min-h-[100px] font-mono text-sm"
                />
              </div>

              <Button type="submit" className="w-full">
                {isEditing ? 'Update Offer' : 'Add Offer'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer) => {
          const network = networks.find(n => n.id === offer.network);
          return (
            <Card key={offer.id}>
              <CardHeader>
                <CardTitle>{offer.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Network:</span>
                    <span>{network?.name || offer.network}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{offer.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payout:</span>
                    <span className="font-medium text-primary">
                      ${offer.payout?.toFixed(2)}
                    </span>
                  </div>
                  {offer.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {offer.description}
                    </p>
                  )}
                  <div className="flex justify-end mt-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(offer)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}