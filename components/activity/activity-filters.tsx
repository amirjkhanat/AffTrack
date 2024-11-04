"use client";

import { ActivityType, ActivityAction } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { useState } from "react";

interface ActivityFiltersProps {
  onFiltersChange: (filters: {
    types: ActivityType[];
    actions: ActivityAction[];
  }) => void;
}

export function ActivityFilters({ onFiltersChange }: ActivityFiltersProps) {
  const [selectedActions, setSelectedActions] = useState<ActivityAction[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([]);

  const handleActionChange = (action: ActivityAction, checked: boolean) => {
    const newActions = checked
      ? [...selectedActions, action]
      : selectedActions.filter((a) => a !== action);
    setSelectedActions(newActions);
    onFiltersChange({ types: selectedTypes, actions: newActions });
  };

  const handleTypeChange = (type: ActivityType, checked: boolean) => {
    const newTypes = checked
      ? [...selectedTypes, type]
      : selectedTypes.filter((t) => t !== type);
    setSelectedTypes(newTypes);
    onFiltersChange({ types: newTypes, actions: selectedActions });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Filter by Action</DropdownMenuLabel>
        {Object.values(ActivityAction).map((action) => (
          <DropdownMenuCheckboxItem
            key={action}
            checked={selectedActions.includes(action)}
            onCheckedChange={(checked) => handleActionChange(action, checked)}
          >
            {action.toLowerCase()}
          </DropdownMenuCheckboxItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
        {Object.values(ActivityType).map((type) => (
          <DropdownMenuCheckboxItem
            key={type}
            checked={selectedTypes.includes(type)}
            onCheckedChange={(checked) => handleTypeChange(type, checked)}
          >
            {type.toLowerCase().replace('_', ' ')}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}