"use client";

import { useState, useEffect } from "react";
import { Plus, Percent } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Variant {
  id?: string;
  name: string;
  offerId: string;
  weight: number;
}

interface SplitTest {
  id: string;
  name: string;
  description?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  variants: Variant[];
}

export default function SplitTestsTab() {
  const [splitTests, setSplitTests] = useState<SplitTest[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    status: "ACTIVE",
    startDate: "",
    endDate: "",
    variants: [] as Variant[]
  });

  useEffect(() => {
    fetchSplitTests();
    fetchOffers();
  }, []);

  const fetchSplitTests = async () => {
    try {
      const response = await fetch('/api/assets/split-tests');
      if (!response.ok) throw new Error('Failed to fetch split tests');
      const data = await response.json();
      setSplitTests(data);
    } catch (error) {
      console.error('Error fetching split tests:', error);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/assets/offers');
      if (!response.ok) throw new Error('Failed to fetch offers');
      const data = await response.json();
      setOffers(data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { name: "", offerId: "", weight: 1 }]
    }));
  };

  const handleRemoveVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/assets/split-tests', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} split test`);
      }
      
      const data = await response.json();
      
      if (isEditing) {
        setSplitTests(splitTests.map(test => 
          test.id === data.id ? data : test
        ));
      } else {
        setSplitTests([...splitTests, data]);
      }
      
      setIsDialogOpen(false);
      setIsEditing(false);
      setFormData({
        id: "",
        name: "",
        description: "",
        status: "ACTIVE",
        startDate: "",
        endDate: "",
        variants: []
      });
    } catch (error) {
      console.error(`Failed to ${isEditing ? 'update' : 'create'} split test:`, error);
    }
  };

  const handleEdit = (test: SplitTest) => {
    console.log('Editing test:', test); // Debug log
    setFormData({
      id: test.id,
      name: test.name,
      description: test.description || "",
      status: test.status,
      startDate: test.startDate || "",
      endDate: test.endDate || "",
      variants: test.variants.map(variant => ({
        id: variant.id,
        name: variant.name || "",
        offerId: variant.offerId,
        weight: variant.weight
      }))
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Split Tests</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setIsEditing(false);
              setFormData({
                id: "",
                name: "",
                description: "",
                status: "ACTIVE",
                startDate: "",
                endDate: "",
                variants: []
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Split Test
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Split Test' : 'Create New Split Test'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Test Name</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter split test name" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter test description"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Variants</Label>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={handleAddVariant}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Offer
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Offer</TableHead>
                      <TableHead className="w-[100px]">Weight</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.variants.map((variant, index) => (
                      <TableRow key={variant.id || index}>
                        <TableCell>
                          <Select
                            value={variant.offerId}
                            onValueChange={(value) => handleVariantChange(index, 'offerId', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select offer" />
                            </SelectTrigger>
                            <SelectContent>
                              {offers.map((offer) => (
                                <SelectItem key={offer.id} value={offer.id}>
                                  {offer.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="1"
                              value={variant.weight}
                              onChange={(e) => handleVariantChange(index, 'weight', parseInt(e.target.value))}
                              className="w-16"
                            />
                            <Percent className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive"
                            onClick={() => handleRemoveVariant(index)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setIsEditing(false);
                    setFormData({
                      id: "",
                      name: "",
                      description: "",
                      status: "ACTIVE",
                      startDate: "",
                      endDate: "",
                      variants: []
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update' : 'Create'} Split Test
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {splitTests.map((test) => (
          <Card key={test.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">{test.name}</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleEdit(test)}
              >
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {test.description && (
                  <p className="text-sm text-muted-foreground">
                    {test.description}
                  </p>
                )}

                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Offer</TableHead>
                        <TableHead>Weight</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {test.variants.map((variant) => (
                        <TableRow key={variant.id}>
                          <TableCell>
                            {offers.find(o => o.id === variant.offerId)?.name || 'Unknown Offer'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {variant.weight}%
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Status: {test.status}</span>
                    <span>
                      {test.startDate && `Started: ${new Date(test.startDate).toLocaleDateString()}`}
                      {test.endDate && ` • Ends: ${new Date(test.endDate).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {splitTests.length === 0 && (
          <div className="col-span-2 text-center py-10 text-muted-foreground">
            No split tests found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}