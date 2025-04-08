"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Plus, AlertCircle } from "lucide-react";
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
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Network {
  id: string;
  name: string;
  website: string;
  loginUrl: string;
  username: string;
  password: string;
  createdAt: Date;
  _count: {
    offers: number;
  };
}

export default function NetworksTab() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    loginUrl: "",
    username: "",
    password: ""
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isNameChecking, setIsNameChecking] = useState(false);
  const [isNameTaken, setIsNameTaken] = useState(false);

  useEffect(() => {
    fetchNetworks();
  }, []);

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

  const checkNetworkName = async (name: string) => {
    if (!name.trim()) {
      setIsNameTaken(false);
      return;
    }
    
    setIsNameChecking(true);
    try {
      const exists = networks.some(
        network => network.name.toLowerCase() === name.toLowerCase()
      );
      setIsNameTaken(exists);
    } finally {
      setIsNameChecking(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData({ ...formData, name: newName });
    checkNetworkName(newName);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isNameTaken) {
      setFormError("A network with this name already exists");
      return;
    }
    
    setFormError(null);
    try {
      const response = await fetch("/api/assets/networks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        if (errorData.code === "P2002" && errorData.meta?.target?.includes("name")) {
          setFormError("A network with this name already exists");
          return;
        } else {
          throw new Error(errorData.message || "Failed to create network");
        }
      }
      
      setOpen(false);
      
      setFormData({
        name: "",
        website: "",
        loginUrl: "",
        username: "",
        password: ""
      });
      setIsNameTaken(false);

      await fetchNetworks();
      
    } catch (error) {
      console.error("Failed to create network:", error);
      setFormError(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Networks</h2>
        <Dialog open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setFormData({
              name: "",
              website: "",
              loginUrl: "",
              username: "",
              password: ""
            });
            setFormError(null);
            setIsNameTaken(false);
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Network
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Affiliate Network</DialogTitle>
              </DialogHeader>
              {formError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Network Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter network name"
                    value={formData.name}
                    onChange={handleNameChange}
                    className={isNameTaken ? "border-red-500" : ""}
                    required
                  />
                  {isNameTaken && (
                    <p className="text-sm text-red-500 mt-1">
                      This network name is already taken
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    placeholder="https://network.com" 
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginUrl">Login URL</Label>
                  <Input 
                    id="loginUrl" 
                    placeholder="https://network.com/login" 
                    type="url"
                    value={formData.loginUrl}
                    onChange={(e) => setFormData({ ...formData, loginUrl: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isNameTaken || isNameChecking}
                >
                  Save Network
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {networks.map((network) => (
          <Card key={network.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {network.name}
              </CardTitle>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Website:</span>{" "}
                  <a 
                    href={network.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {network.website}
                  </a>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Login URL:</span>{" "}
                  <a 
                    href={network.loginUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {network.loginUrl}
                  </a>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Username:</span>{" "}
                  {network.username}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Password:</span>{" "}
                  <span className="flex items-center space-x-2">
                    <span>{showPassword ? network.password : "••••••••"}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Offers: {network._count?.offers || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Added on {new Date(network.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}