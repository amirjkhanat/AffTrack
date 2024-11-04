"use client";

import { Plus, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";
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

const PARAMETERS = [
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
  { label: "UTM Term", value: "{utm_term}" },
  { label: "UTM Content", value: "{utm_content}" },
];

interface TrafficSource {
  id: string;
  name: string;
}

interface LandingPage {
  id: string;
  name: string;
}

interface TrackingLink {
  id: string;
  name: string;
  trafficSourceId: string;
  trafficSource: TrafficSource;
  landingPageId: string;
  landingPage: LandingPage;
  url: string;
  createdAt: string;
}

export default function TrackingLinksTab() {
  const [trackingLinks, setTrackingLinks] = useState<TrackingLink[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    trafficSourceId: "",
    landingPageId: "",
    parameters: [] as string[]
  });
  const [linkUrl, setLinkUrl] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [linksRes, sourcesRes, pagesRes] = await Promise.all([
        fetch('/api/assets/tracking-links'),
        fetch('/api/assets/traffic-sources'),
        fetch('/api/assets/landing-pages')
      ]);

      if (linksRes.ok) setTrackingLinks(await linksRes.json());
      if (sourcesRes.ok) setTrafficSources(await sourcesRes.json());
      if (pagesRes.ok) setLandingPages(await pagesRes.json());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (link: TrackingLink) => {
    setFormData({
      id: link.id,
      name: link.name,
      trafficSourceId: link.trafficSourceId,
      landingPageId: link.landingPageId,
      parameters: []
    });
    setLinkUrl(link.url || getBaseTrackingUrl(link.id));
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting with URL:', linkUrl);
      
      const response = await fetch('/api/assets/tracking-links', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          url: linkUrl
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      setIsDialogOpen(false);
      resetForm();
      await fetchData();
    } catch (error) {
      console.error('Error saving tracking link:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      trafficSourceId: "",
      landingPageId: "",
      parameters: []
    });
    setLinkUrl("");
    setIsEditing(false);
  };

  const handleParameterInsert = (parameter: string) => {
    const newUrl = linkUrl.slice(0, cursorPosition) + parameter + linkUrl.slice(cursorPosition);
    setLinkUrl(newUrl);
    setFormData(prev => ({
      ...prev,
      parameters: [...prev.parameters, parameter]
    }));
  };

  const getBaseTrackingUrl = (id: string) => {
    const trackingDomain = process.env.NEXT_PUBLIC_TRACKING_DOMAIN || 'https://localhost:3001';
    return `${trackingDomain}/t/${id}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Tracking Links</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Tracking Link' : 'Generate Tracking Link'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Link Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter link name"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="traffic-source">Traffic Source</Label>
                  <Select
                    value={formData.trafficSourceId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, trafficSourceId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select traffic source" />
                    </SelectTrigger>
                    <SelectContent>
                      {trafficSources.map((source) => (
                        <SelectItem key={source.id} value={source.id}>
                          {source.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landing-page">Landing Page</Label>
                  <Select
                    value={formData.landingPageId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, landingPageId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select landing page" />
                    </SelectTrigger>
                    <SelectContent>
                      {landingPages.map((page) => (
                        <SelectItem key={page.id} value={page.id}>
                          {page.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Generated Link</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Lead Parameters
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56" align="end">
                        <div className="space-y-1">
                          {PARAMETERS.map((param) => (
                            <Button
                              key={param.value}
                              variant="ghost"
                              className="w-full justify-start text-left"
                              onClick={() => handleParameterInsert(param.value)}
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
                          UTM Parameters
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56" align="end">
                        <div className="space-y-1">
                          {UTM_PARAMETERS.map((param) => (
                            <Button
                              key={param.value}
                              variant="ghost"
                              className="w-full justify-start text-left"
                              onClick={() => handleParameterInsert(param.value)}
                            >
                              {param.label}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Generated Link</Label>
                  <div className="flex flex-col gap-2">
                    <Textarea
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      onSelect={(e) => setCursorPosition(e.currentTarget.selectionStart || 0)}
                      onClick={(e) => setCursorPosition(e.currentTarget.selectionStart || 0)}
                      className="font-mono text-sm h-24"
                      placeholder="Generated tracking link will appear here..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setFormData({
                      name: "",
                      trafficSourceId: "",
                      landingPageId: "",
                      parameters: []
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update' : 'Generate'} Link
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {trackingLinks.map((link) => (
          <Card key={link.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {link.trafficSource.name} → {link.landingPage.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Tracking Link</Label>
                  <div className="flex items-bottom items-end gap-2">
                    <Textarea
                      rows={5}
                      readOnly
                      value={link.url || getBaseTrackingUrl(link.id)}
                      className="text-sm font-mono"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(link.url || getBaseTrackingUrl(link.id));
                      }}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(link)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && trackingLinks.length === 0 && (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No tracking links found. Generate one to get started.
          </div>
        )}
      </div>
    </div>
  );
}