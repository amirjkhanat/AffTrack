"use client";

import { Plus, Link as LinkIcon, User as UserIcon, Eye, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";

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

export default function LandingPagesTab() {
  const [landingPages, setLandingPages] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    baseUrl: "",
    parameters: [] as Parameter[],
    description: "",
  });
  const [selectedInputIndex, setSelectedInputIndex] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [deletingPageId, setDeletingPageId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLandingPages = async () => {
      try {
        const response = await fetch('/api/assets/landing-pages');
        if (!response.ok) throw new Error('Failed to fetch landing pages');
        const data = await response.json();
        setLandingPages(data);
      } catch (error) {
        console.error('Error fetching landing pages:', error);
      }
    };

    fetchLandingPages();
  }, []);

  const handleAddParameter = () => {
    setFormData(prev => ({
      ...prev,
      parameters: [...prev.parameters, { key: "", value: "" }]
    }));
  };

  const handleRemoveParameter = (index: number) => {
    setFormData(prev => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index)
    }));
  };

  const handleParameterChange = (index: number, field: 'key' | 'value', value: string, event?: React.ChangeEvent<HTMLInputElement>) => {
    if (event) {
      setCursorPosition(event.target.selectionStart);
    }
    setFormData(prev => ({
      ...prev,
      parameters: prev.parameters.map((param, i) => 
        i === index ? { ...param, [field]: value } : param
      )
    }));
  };

  const handleParameterInsert = (paramKey: string, paramValue: string) => {
    if (selectedInputIndex !== null && cursorPosition !== null) {
      const currentParam = formData.parameters[selectedInputIndex];
      const currentValue = currentParam.value;
      
      // Insert the parameter value at cursor position
      const newValue = 
        currentValue.slice(0, cursorPosition) + 
        paramValue + 
        currentValue.slice(cursorPosition);

      handleParameterChange(selectedInputIndex, 'value', newValue);
    } else {
      // Fallback to adding new parameter if no input is selected
      setFormData(prev => ({
        ...prev,
        parameters: [...prev.parameters, { key: paramKey, value: paramValue }]
      }));
    }
  };

  const handleEdit = (page: any) => {
    setFormData({
      id: page.id,
      name: page.name,
      baseUrl: page.baseUrl,
      parameters: Array.isArray(page.parameters) 
        ? page.parameters 
        : Object.entries(page.parameters || {}).map(([key, value]) => ({
            key,
            value: String(value),
          })),
      description: page.description || '',
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/assets/landing-pages', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} landing page`);
      }
      const data = await response.json();
      if (isEditing) {
        setLandingPages(landingPages.map(page => 
          page.id === data.id ? data : page
        ));
      } else {
        setLandingPages([...landingPages, data]);
      }
      setIsDialogOpen(false);
      setIsEditing(false);
      setFormData({ id: '', name: '', baseUrl: '', parameters: [], description: '' });
    } catch (error) {
      console.error(`Failed to ${isEditing ? 'update' : 'create'} landing page:`, error);
    }
  };

  const handleInputFocus = (index: number, event: React.FocusEvent<HTMLInputElement>) => {
    setSelectedInputIndex(index);
    setCursorPosition(event.target.selectionStart);
  };

  const handleInputClick = (index: number, event: React.MouseEvent<HTMLInputElement>) => {
    setSelectedInputIndex(index);
    setCursorPosition((event.target as HTMLInputElement).selectionStart);
  };

  const handleView = (page: any) => {
    // Open the landing page in a new tab with isolated route
    window.open(`/l/${page.id}`, '_blank');
  };

  const handleDelete = async (pageId: string) => {
    try {
      // Try first approach - using query parameter
      const response = await fetch(`/api/assets/landing-pages?id=${pageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        // If the first approach fails, try the second approach with body
        const bodyResponse = await fetch('/api/assets/landing-pages', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: pageId })
        });
        
        if (!bodyResponse.ok) {
          throw new Error('Failed to delete landing page');
        }
      }
      
      // Remove the deleted page from the list
      setLandingPages(landingPages.filter(page => page.id !== pageId));
      
      // Show success message
      // If you have toast notifications, you could use them here
      // toast.success('Landing page deleted successfully');
    } catch (error) {
      console.error('Error deleting landing page:', error);
      // If you have toast notifications, you could show an error message
      // toast.error('Failed to delete landing page');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Landing Pages</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Landing Page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Landing Page' : 'Add New Landing Page'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter landing page name" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="baseUrl">Base URL</Label>
                <Input
                  id="baseUrl"
                  value={formData.baseUrl}
                  onChange={(e) => setFormData({...formData, baseUrl: e.target.value})}
                  placeholder="https://example.com/landing"
                  type="url"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Parameters</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <UserIcon className="h-4 w-4 mr-2" />
                          User Fields
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56" align="end">
                        <div className="space-y-1">
                          {USER_PARAMETERS.map((param) => (
                            <Button
                              key={param.value}
                              variant="ghost"
                              className="w-full justify-start text-left"
                              onClick={() => handleParameterInsert(
                                param.label.toLowerCase().replace(' ', '_'),
                                param.value
                              )}
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
                              onClick={() => handleParameterInsert(
                                param.label.toLowerCase().replace(' ', '_'),
                                param.value
                              )}
                            >
                              {param.label}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddParameter}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 
                    scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400
                    scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
                    {formData.parameters.map((param, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <Input
                            placeholder="Parameter name"
                            value={param.key}
                            onChange={(e) => handleParameterChange(index, 'key', e.target.value, e)}
                            onFocus={(e) => handleInputFocus(index, e)}
                            onClick={(e) => handleInputClick(index, e)}
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            placeholder="Parameter value"
                            value={param.value}
                            onChange={(e) => handleParameterChange(index, 'value', e.target.value, e)}
                            onFocus={(e) => handleInputFocus(index, e)}
                            onClick={(e) => handleInputClick(index, e)}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveParameter(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
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

              <Button type="submit" className="w-full">
                {isEditing ? 'Update Landing Page' : 'Add Landing Page'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {landingPages.map((page) => (
          <Card key={page.id}>
            <CardHeader>
              <CardTitle>{page.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Base URL: {page.baseUrl}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {page.description}
              </p>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleView(page)}
                  className="flex items-center"
                >
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEdit(page)}
                >
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the landing page "{page.name}". 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(page.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}