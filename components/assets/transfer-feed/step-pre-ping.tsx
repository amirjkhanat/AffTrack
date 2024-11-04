"use client";

import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, LinkIcon, UserIcon } from "lucide-react";
import { TransferFeedFormData, FormDataPair } from "./types";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  USER_PARAMETERS,
  UTM_PARAMETERS,
  TRACKING_PARAMETERS,
} from "./parameters";
import { useState, useRef } from "react";

interface StepPrePingProps {
  formData: TransferFeedFormData;
  updateFormData: (
    field: keyof TransferFeedFormData,
    value: any
  ) => void;
  addFormDataPair: (type?: "main" | "prePing") => void;
  updateFormDataPair: (
    index: number,
    field: keyof FormDataPair,
    value: string,
    type?: "main" | "prePing"
  ) => void;
  removeFormDataPair: (
    index: number,
    type?: "main" | "prePing"
  ) => void;
}

export function StepPrePing({
  formData,
  updateFormData,
  addFormDataPair,
  updateFormDataPair,
  removeFormDataPair,
}: StepPrePingProps) {
  const focusedInputRef = useRef<
    HTMLInputElement | HTMLTextAreaElement | null
  >(null);

  // Convert headers object to string if necessary
  if (
    typeof formData.prePing.headers === "object" &&
    formData.prePing.headers !== null
  ) {
    formData.prePing.headers = JSON.stringify(
      formData.prePing.headers,
      null,
      2
    );
  }

  // Track focus events on inputs
  const handleFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    focusedInputRef.current = e.target;
  };

  const updatePrePing = (
    field: keyof typeof formData.prePing,
    value: any
  ) => {
    let updatedPrePing = { ...formData.prePing, [field]: value };

    // Handle switching between body types
    if (field === 'bodyType' && value === 'json') {
      // Initialize jsonBody if empty
      if (!formData.prePing.jsonBody) {
        updatedPrePing.jsonBody = '{\n  \n}';
      }
    } else if (field === 'bodyType' && value === 'formData') {
      // Initialize formDataPairs if empty
      if (
        !formData.prePing.formDataPairs ||
        formData.prePing.formDataPairs.length === 0
      ) {
        updatedPrePing.formDataPairs = [{ key: '', value: '' }];
      }
    }

    updateFormData('prePing', updatedPrePing);
  };

  const updateResponseMapping = (
    field: keyof typeof formData.prePing.responseMapping,
    value: any
  ) => {
    updatePrePing("responseMapping", {
      ...formData.prePing.responseMapping,
      [field]: value,
    });
  };

  const addUrlParam = () => {
    updatePrePing("urlParams", [...formData.prePing.urlParams, { key: "", value: "" }]);
  };

  const updateUrlParam = (index: number, field: keyof FormDataPair, value: string) => {
    const newParams = [...formData.prePing.urlParams];
    newParams[index] = { ...newParams[index], [field]: value };
    updatePrePing("urlParams", newParams);
  };

  const removeUrlParam = (index: number) => {
    const newParams = formData.prePing.urlParams.filter((_, i) => i !== index);
    updatePrePing("urlParams", newParams);
  };

  const insertParameter = (paramValue: string) => {
    const input = focusedInputRef.current;
    if (!input) return;

    if (input.tagName.toLowerCase() === 'textarea') {
      // Handle JSON textarea
      const cursorPos = input.selectionStart || 0;
      const currentValue = input.value;
      const newValue =
        currentValue.substring(0, cursorPos) +
        paramValue +
        currentValue.substring(cursorPos);
      updatePrePing("jsonBody", newValue);
    } else {
      // Handle form data input
      const currentValue = input.value;
      const newValue = currentValue + paramValue;
      const index = parseInt(input.getAttribute('data-index') || '0');
      updateFormDataPair(index, "value", newValue, "prePing");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Pre-ping Validation</h3>
          <p className="text-sm text-muted-foreground">
            Validate leads before sending to the main endpoint
          </p>
        </div>
        <Switch
          checked={formData.prePing.enabled}
          onCheckedChange={(checked) => updatePrePing("enabled", checked)}
        />
      </div>

      {formData.prePing.enabled && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>HTTP Method</Label>
              <Select
                value={formData.prePing.method}
                onValueChange={(value) => updatePrePing("method", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pre-Ping URL</Label>
              <Input
                type="url"
                placeholder="https://api.partner.com/validate"
                value={formData.prePing.url}
                onChange={(e) => updatePrePing("url", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Headers</Label>
            <Input
              value={formData.prePing.headers}
              onChange={(e) => updatePrePing("headers", e.target.value)}
              placeholder='{"Content-Type": "application/json", "Authorization": "Bearer token"}'
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Send Data</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="bodyType" className="text-sm">Format:</Label>
                  <Select
                    value={formData.prePing.bodyType}
                    onValueChange={(value: "json" | "formData") => updatePrePing("bodyType", value)}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="formData">Form Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
            </div>

            {formData.prePing.bodyType === "json" ? (
              <Textarea
                value={formData.prePing.jsonBody}
                onChange={(e) => updatePrePing("jsonBody", e.target.value)}
                onFocus={handleFocus}
                className="font-mono text-sm min-h-[200px]"
                placeholder="Enter JSON request body"
              />
            ) : (
              <div className="max-h-40 pr-2 pt-2 pl-2 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
                <div className="space-y-4">
                  {formData.prePing.formDataPairs.map((pair, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="flex-1">
                        <Input
                          placeholder="Parameter name"
                          value={pair.key}
                          onChange={(e) =>
                            updateFormDataPair(index, "key", e.target.value, "prePing")
                          }
                          onFocus={handleFocus}
                          data-index={index}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Value or {parameter}"
                          value={pair.value}
                          onChange={(e) =>
                            updateFormDataPair(index, "value", e.target.value, "prePing")
                          }
                          onFocus={handleFocus}
                          data-index={index}
                        />
                      </div>
                      <div>
                        <Button
                          onClick={() => {
                            removeFormDataPair(index, "prePing");
                          }}
                          variant="ghost"
                          size="icon"
                          disabled={formData.prePing.formDataPairs.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => addFormDataPair("prePing")}
                  >
                    Add Field
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Success Pattern</Label>
            <Input
              value={formData.prePing.successSearch}
              onChange={(e) => updatePrePing("successSearch", e.target.value)}
              placeholder="valid: true"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Text to search for in the response to determine if the lead is valid
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Response ID Mapping</Label>
                <p className="text-sm text-muted-foreground">
                  Map the pre-ping response ID to the main request
                </p>
              </div>
              <Switch
                checked={formData.prePing.responseMapping.enabled}
                onCheckedChange={(checked) => updateResponseMapping("enabled", checked)}
              />
            </div>

            {formData.prePing.responseMapping.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Response ID Path</Label>
                  <Input
                    placeholder="response.data.id"
                    value={formData.prePing.responseMapping.idPath}
                    onChange={(e) => updateResponseMapping("idPath", e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    JSON path to the ID in the pre-ping response
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Main Request Field</Label>
                  <Input
                    value="prePingId"
                    disabled
                    className="font-mono bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Field name that will be used in the main request
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}