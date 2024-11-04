import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransferFeedFormData } from "./types";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface StepSchedulingProps {
  formData: TransferFeedFormData;
  updateFormData: (field: keyof TransferFeedFormData, value: any) => void;
}

const DAYS_OF_WEEK = [
  { label: "Mon", value: "monday" },
  { label: "Tue", value: "tuesday" },
  { label: "Wed", value: "wednesday" },
  { label: "Thu", value: "thursday" },
  { label: "Fri", value: "friday" },
  { label: "Sat", value: "saturday" },
  { label: "Sun", value: "sunday" },
];

export function StepScheduling({ formData, updateFormData }: StepSchedulingProps) {
  const updateDayParting = (field: keyof typeof formData.dayParting, value: any) => {
    updateFormData("dayParting", {
      ...formData.dayParting,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? (
                  format(new Date(formData.startDate), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate ? new Date(formData.startDate) : undefined}
                onSelect={(date) => {
                  if (date) {
                    console.log('Selected start date:', date.toISOString());
                    updateFormData("startDate", date.toISOString());
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? (
                  format(new Date(formData.endDate), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.endDate ? new Date(formData.endDate) : undefined}
                onSelect={(date) => updateFormData("endDate", date?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Day Parting</Label>
          <Switch
            id="dayParting"
            checked={formData.dayParting.enabled}
            onCheckedChange={(checked) => updateDayParting("enabled", checked)}
          />
        </div>

        {formData.dayParting.enabled && (
          <>
            <div className="grid grid-cols-7 gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.value} className="text-center">
                  <Button
                    variant={formData.dayParting[day.value as keyof typeof formData.dayParting] ? "default" : "outline"}
                    className="w-full"
                    onClick={() => updateDayParting(day.value as keyof typeof formData.dayParting, !formData.dayParting[day.value as keyof typeof formData.dayParting])}
                  >
                    {day.label}
                  </Button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                  <Input
                    type="time"
                    value={formData.dayParting.startTime}
                    onChange={(e) => updateDayParting("startTime", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                  <Input
                    type="time"
                    value={formData.dayParting.endTime}
                    onChange={(e) => updateDayParting("endTime", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Transfer Caps</Label>
          <Switch
            checked={formData.capConfig.enabled}
            onCheckedChange={(checked) =>
              updateFormData("capConfig", { ...formData.capConfig, enabled: checked })
            }
          />
        </div>

        {formData.capConfig.enabled && (
          <div className="space-y-4">
            <Select
              value={formData.capConfig.type}
              onValueChange={(value: "daily" | "weekly" | "monthly" | "none") =>
                updateFormData("capConfig", { ...formData.capConfig, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cap type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily Cap</SelectItem>
                <SelectItem value="weekly">Weekly Cap</SelectItem>
                <SelectItem value="monthly">Monthly Cap</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                value={formData.capConfig.value}
                onChange={(e) =>
                  updateFormData("capConfig", {
                    ...formData.capConfig,
                    value: parseInt(e.target.value),
                  })
                }
                className="w-32"
              />
              <span className="text-sm text-muted-foreground">transfers</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Aged Transfers</Label>
          <Switch
            checked={formData.transferTiming.enabled}
            onCheckedChange={(checked) =>
              updateFormData("transferTiming", {
                ...formData.transferTiming,
                enabled: checked,
                type: checked ? "aged30" : "realtime",
              })
            }
          />
        </div>

        {formData.transferTiming.enabled && (
          console.log("Type" + formData.transferTiming.type),
          <Select
            value={formData.transferTiming.type.toLowerCase()}
            onValueChange={(value: "aged30" | "aged60" | "aged90") =>
              updateFormData("transferTiming", {
                ...formData.transferTiming,
                type: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select aging period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aged30">30 Days</SelectItem>
              <SelectItem value="aged60">60 Days</SelectItem>
              <SelectItem value="aged90">90 Days</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}