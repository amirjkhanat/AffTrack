import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TransferFeedFormData } from "./types";

interface StepResponsePayoutProps {
  formData: TransferFeedFormData;
  updateFormData: (field: keyof TransferFeedFormData, value: any) => void;
}

export function StepResponsePayout({ formData, updateFormData }: StepResponsePayoutProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="successSearch">Success Response Search</Label>
        <Input
          id="successSearch"
          value={formData.successSearch}
          onChange={(e) => updateFormData("successSearch", e.target.value)}
          placeholder="success: true"
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">
          Text to search for in the response to determine success
        </p>
      </div>

      <div className="space-y-4">
        <Label>Payout Configuration</Label>
        <RadioGroup
          value={formData.payoutType}
          onValueChange={(value: "static" | "dynamic") => updateFormData("payoutType", value)}
          className="grid grid-cols-2 gap-4 mb-4"
        >
          <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg">
            <RadioGroupItem value="static" id="static" />
            <Label htmlFor="static">Static Amount</Label>
          </div>
          <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg">
            <RadioGroupItem value="dynamic" id="dynamic" />
            <Label htmlFor="dynamic">Dynamic (Response Object)</Label>
          </div>
        </RadioGroup>

        {formData.payoutType === "static" ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.payoutAmount}
              onChange={(e) => updateFormData("payoutAmount", e.target.value)}
              className="w-32"
            />
            <span className="text-sm text-muted-foreground">USD</span>
          </div>
        ) : (
          <Input
            placeholder="response.data.payout"
            value={formData.payoutPath}
            onChange={(e) => updateFormData("payoutPath", e.target.value)}
            className="font-mono"
          />
        )}
      </div>
    </div>
  );
}