"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link2, Trash2, UserIcon } from "lucide-react";
import { USER_PARAMETERS, UTM_PARAMETERS, TRACKING_PARAMETERS } from "./parameters";
import { TransferFeedFormData, FormDataPair } from "./types";

interface StepRequestConfigProps {
  formData: TransferFeedFormData;
  updateFormData: (field: keyof TransferFeedFormData, value: any) => void;
  addFormDataPair: (type?: "main" | "prePing") => void;
  updateFormDataPair: (
    index: number,
    field: keyof FormDataPair,
    value: string,
    type?: "main" | "prePing"
  ) => void;
  removeFormDataPair: (index: number, type?: "main" | "prePing") => void;
}

export function StepRequestConfig({
  formData,
  updateFormData,
  addFormDataPair,
  updateFormDataPair,
  removeFormDataPair,
}: StepRequestConfigProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>HTTP Method</Label>
          <Select
            value={formData.method}
            onValueChange={(value) => updateFormData("method", value)}
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
          <Label>Webhook URL</Label>
          <Input
            type="url"
            value={formData.webhookUrl}
            onChange={(e) => updateFormData("webhookUrl", e.target.value)}
            placeholder="https://api.partner.com/webhook"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Headers</Label>
        <Input
          value={formData.headers}
          onChange={(e) => updateFormData("headers", e.target.value)}
          placeholder='{"Content-Type": "application/json", "Authorization": "Bearer token"}'
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Request Body</Label>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="bodyType" className="text-sm">
                Format:
              </Label>
              <Select
                value={formData.bodyType}
                onValueChange={(value: "json" | "formData") =>
                  updateFormData("bodyType", value)
                }
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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <UserIcon className="h-4 w-4 mr-2" />
                  User
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-1 p-1">
                    {USER_PARAMETERS.map((param) => (
                      <Button
                        key={param.value}
                        variant="ghost"
                        className="w-full justify-start text-left"
                        onClick={() => {
                          if (formData.bodyType === "json") {
                            const textArea = document.querySelector(
                              "textarea"
                            ) as HTMLTextAreaElement;
                            const cursorPos = textArea?.selectionStart || 0;
                            const currentValue = formData.jsonBody;
                            const newValue =
                              currentValue.substring(0, cursorPos) +
                              param.value +
                              currentValue.substring(cursorPos);
                            updateFormData("jsonBody", newValue);
                          }
                        }}
                      >
                        {param.label}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Link2 className="h-4 w-4 mr-2" />
                  UTM
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-1 p-1">
                    {UTM_PARAMETERS.map((param) => (
                      <Button
                        key={param.value}
                        variant="ghost"
                        className="w-full justify-start text-left"
                        onClick={() => {
                          if (formData.bodyType === "json") {
                            const textArea = document.querySelector(
                              "textarea"
                            ) as HTMLTextAreaElement;
                            const cursorPos = textArea?.selectionStart || 0;
                            const currentValue = formData.jsonBody;
                            const newValue =
                              currentValue.substring(0, cursorPos) +
                              param.value +
                              currentValue.substring(cursorPos);
                            updateFormData("jsonBody", newValue);
                          }
                        }}
                      >
                        {param.label}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Link2 className="h-4 w-4 mr-2" />
                  Track
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-1 p-1">
                    {TRACKING_PARAMETERS.map((param) => (
                      <Button
                        key={param.value}
                        variant="ghost"
                        className="w-full justify-start text-left"
                        onClick={() => {
                          if (formData.bodyType === "json") {
                            const textArea = document.querySelector(
                              "textarea"
                            ) as HTMLTextAreaElement;
                            const cursorPos = textArea?.selectionStart || 0;
                            const currentValue = formData.jsonBody;
                            const newValue =
                              currentValue.substring(0, cursorPos) +
                              param.value +
                              currentValue.substring(cursorPos);
                            updateFormData("jsonBody", newValue);
                          }
                        }}
                      >
                        {param.label}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {formData.bodyType === "json" ? (
          <Textarea
            value={formData.jsonBody}
            onChange={(e) => updateFormData("jsonBody", e.target.value)}
            className="font-mono text-sm min-h-[200px]"
            placeholder="Enter JSON request body"
          />
        ) : (
          <div className="max-h-40 pr-2 pt-2 pl-2 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
            <div className="space-y-4">
              {formData.formDataPairs.map((pair, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <Input
                      placeholder="Key"
                      value={pair.key}
                      onChange={(e) =>
                        updateFormDataPair(index, "key", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Value"
                      value={pair.value}
                      onChange={(e) =>
                        updateFormDataPair(index, "value", e.target.value)
                      }
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => removeFormDataPair(index)}
                    disabled={formData.formDataPairs.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => addFormDataPair()}
              >
                Add Field
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}