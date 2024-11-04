"use client";

import { Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

interface TrafficSource {
  id: string;
  name: string;
  type: string;
  description: string;
}

export default function TrafficSourcesTab() {
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    description: "",
  });

  const handleEdit = (source: TrafficSource) => {
    setFormData({
      id: source.id,
      name: source.name,
      type: source.type,
      description: source.description,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/assets/traffic-sources', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} traffic source`);
      }
      
      const data = await response.json();
      
      if (isEditing) {
        setTrafficSources(trafficSources.map(source => 
          source.id === data.id ? data : source
        ));
      } else {
        setTrafficSources([...trafficSources, data]);
      }
      
      setIsDialogOpen(false);
      setIsEditing(false);
      setFormData({ id: "", name: "", type: "", description: "" });
    } catch (error) {
      console.error(`Failed to ${isEditing ? 'update' : 'create'} traffic source:`, error);
    }
  };

  useEffect(() => {
    const fetchTrafficSources = async () => {
      try {
        const response = await fetch('/api/assets/traffic-sources');
        if (response.ok) {
          const data = await response.json();
          setTrafficSources(data);
        }
      } catch (error) {
        console.error('Failed to fetch traffic sources:', error);
      }
    };

    fetchTrafficSources();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Traffic Sources</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setIsEditing(false);
            setFormData({ id: "", name: "", type: "", description: "" });
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Traffic Source
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Traffic Source' : 'Add New Traffic Source'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter traffic source name" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  onValueChange={(value) => setFormData({...formData, type: value})}
                  value={formData.type}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select traffic source type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="search">Search</SelectItem>
                    <SelectItem value="display">Display</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="native">Native</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="affiliate">Affiliate</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="push">Push Notifications</SelectItem>
                    <SelectItem value="popup">Pop-up/Pop-under</SelectItem>
                    <SelectItem value="in-app">In-App</SelectItem>
                    <SelectItem value="sms">SMS/Text</SelectItem>
                    <SelectItem value="direct">Direct Buy</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
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
              <Button type="submit" className="w-full">
                {isEditing ? 'Update Traffic Source' : 'Add Traffic Source'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trafficSources.map((source) => (
          <Card key={source.id}>
            <CardHeader>
              <CardTitle>{source.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {source.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                  {source.type}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEdit(source)}
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}