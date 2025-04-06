"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgressSteps } from "./progress-steps";
import { StepBasicInfo } from "./step-basic-info";
import { StepPrePing } from "./step-pre-ping";
import { StepRequestConfig } from "./step-request-config";
import { StepResponsePayout } from "./step-response-payout";
import { StepConditions } from "./step-conditions";
import { StepScheduling } from "./step-scheduling";
import { StepReview } from "./step-review";
import { FORM_STEPS } from "./form-steps";
import { TransferFeedFormData, FormDataPair } from "./types";

interface TransferFeedFormProps {
  onClose: () => void;
}

const initialFormData: TransferFeedFormData = {
  id: "",
  partnerId: "",
  name: "",
  description: "",
  method: "POST",
  webhookUrl: "",
  headers: "",
  bodyType: "json",
  jsonBody: "{\n  \n}",
  formDataPairs: [{ key: "", value: "" }],
  successSearch: "",
  payoutType: "static",
  payoutAmount: "",
  payoutPath: "",
  testMode: false,
  startDate: "",
  endDate: "",
  dayParting: {
    enabled: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
    startTime: "09:00",
    endTime: "17:00",
  },
  capConfig: {
    enabled: false,
    type: "daily",
    value: "100",
  },
  transferTiming: {
    enabled: false,
    type: "realtime",
  },
  conditions: {
    rules: []
  },
  prePing: {
    enabled: false,
    method: "POST",
    url: "",
    headers: '{"Content-Type": "application/json"}',
    bodyType: "json",
    jsonBody: "{\n  \n}",
    formDataPairs: [{ key: "", value: "" }],
    successSearch: "",
    responseMapping: {
      enabled: false,
      idPath: "",
      requestField: "prePingId"
    },
    urlParams: []
  },
};

function transformApiDataToFormData(apiData: any): TransferFeedFormData {
  return {
    id: apiData.id,
    partnerId: apiData.partnerId,
    name: apiData.name,
    description: apiData.description,
    method: apiData.method,
    webhookUrl: apiData.endpoint,
    headers: apiData.headers ? JSON.stringify(apiData.headers, null, 2) : "",
    bodyType: apiData.bodyType,
    jsonBody: apiData.bodyTemplate.startsWith('[') ? '{\n  \n}' : apiData.bodyTemplate,
    formDataPairs: apiData.bodyTemplate.startsWith('[') ? JSON.parse(apiData.bodyTemplate) : [{ key: "", value: "" }],
    successSearch: apiData.successPattern,
    payoutType: apiData.payoutType.toLowerCase(),
    payoutAmount: apiData.payoutValue?.toString() || "",
    payoutPath: apiData.payoutPath || "",
    testMode: false,
    startDate: apiData.scheduleConfig?.startDate || "",
    endDate: apiData.scheduleConfig?.endDate || "",
    dayParting: {
      enabled: apiData.scheduleConfig?.enabled || false,
      monday: apiData.scheduleConfig?.days?.includes("MONDAY") || false,
      tuesday: apiData.scheduleConfig?.days?.includes("TUESDAY") || false,
      wednesday: apiData.scheduleConfig?.days?.includes("WEDNESDAY") || false,
      thursday: apiData.scheduleConfig?.days?.includes("THURSDAY") || false,
      friday: apiData.scheduleConfig?.days?.includes("FRIDAY") || false,
      saturday: apiData.scheduleConfig?.days?.includes("SATURDAY") || false,
      sunday: apiData.scheduleConfig?.days?.includes("SUNDAY") || false,
      startTime: apiData.scheduleConfig?.timeStart || "09:00",
      endTime: apiData.scheduleConfig?.timeEnd || "17:00",
    },
    capConfig: {
      enabled: apiData.capConfig?.enabled ?? false,
      type: apiData.capConfig?.type.toLowerCase() ?? "daily",
      value: apiData.capConfig?.value ?? 100,
    },
    transferTiming: {
      enabled: apiData.transferTiming?.enabled || false,
      type: apiData.transferTiming?.type.toLowerCase() || "realtime",
    },
    conditions: {
      rules: Array.isArray(apiData.conditions?.rules) ? apiData.conditions.rules : []
    },
    prePing: {
      enabled: apiData.prePingEnabled || false,
      method: apiData.prePingConfig?.method || "POST",
      url: apiData.prePingConfig?.url || "",
      headers: apiData.prePingConfig?.headers ? apiData.prePingConfig.headers : '{"Content-Type": "application/json"}',
      bodyType: apiData.prePingConfig?.bodyType || 'json',
      jsonBody: apiData.prePingConfig?.bodyType === 'json' 
        ? (typeof apiData.prePingConfig.bodyTemplate === 'string' 
            ? apiData.prePingConfig.bodyTemplate 
            : JSON.stringify(apiData.prePingConfig.bodyTemplate, null, 2) || '{\n  \n}')
        : '{\n  \n}',
      formDataPairs: apiData.prePingConfig?.bodyType === 'formData'
        ? JSON.parse(apiData.prePingConfig.bodyTemplate || '[]')
        : [{ key: "", value: "" }],
      successSearch: apiData.prePingConfig?.successPattern || "",
      responseMapping: {
        enabled: apiData.prePingConfig?.responseMapping?.enabled || false,
        idPath: apiData.prePingConfig?.responseMapping?.idPath || "",
        requestField: "prePingId"
      },
    },
  };
}

export function TransferFeedForm({ onClose, initialData, isEditing = false }: TransferFeedFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<TransferFeedFormData>(
    initialData ? transformApiDataToFormData(initialData) : initialFormData
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: keyof TransferFeedFormData, value: any) => {
    console.log(`Updating ${field} to`, value);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log('Submitting form data:', formData);

      const response = await fetch('/api/assets/transfer-feed', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: initialData?.id,
          name: formData.name,
          partnerId: formData.partnerId,
          description: formData.description,
          method: formData.method,
          webhookUrl: formData.webhookUrl,
          headers: formData.headers ? JSON.parse(formData.headers) : null,
          bodyType: formData.bodyType,
          bodyTemplate: formData.bodyType === 'json' 
            ? formData.jsonBody 
            : JSON.stringify(formData.formDataPairs),
          successSearch: formData.successSearch,
          prePingEnabled: formData.prePing.enabled,
          prePing: formData.prePing.enabled ? {
            method: formData.prePing.method,
            url: formData.prePing.url,
            headers: formData.prePing.headers,
            bodyType: formData.prePing.bodyType,
            bodyTemplate: formData.prePing.bodyType === 'json' 
              ? formData.prePing.jsonBody 
              : JSON.stringify(formData.prePing.formDataPairs),
            successPattern: formData.prePing.successSearch,
            responseMapping: formData.prePing.responseMapping
          } : null,
          payoutType: formData.payoutType.toUpperCase(),
          payoutValue: formData.payoutAmount ? parseFloat(formData.payoutAmount) : null,
          payoutPath: formData.payoutPath || null,
          transferTiming: {
            enabled: formData.transferTiming?.enabled ?? false,
            type: (formData.transferTiming?.type || 'realtime').toUpperCase()
          },
          scheduleConfig: formData.dayParting.enabled ? {
            enabled: true,
            days: [
              formData.dayParting.monday && 'MONDAY',
              formData.dayParting.tuesday && 'TUESDAY',
              formData.dayParting.wednesday && 'WEDNESDAY',
              formData.dayParting.thursday && 'THURSDAY',
              formData.dayParting.friday && 'FRIDAY',
              formData.dayParting.saturday && 'SATURDAY',
              formData.dayParting.sunday && 'SUNDAY'
            ].filter(Boolean),
            timeStart: formData.dayParting.startTime,
            timeEnd: formData.dayParting.endTime,
            startDate: formData.startDate || null,
            endDate: formData.endDate || null
          } : null,
          capConfig: formData.capConfig.enabled ? {
            enabled: true,
            type: formData.capConfig.type.toUpperCase(),
            value: parseInt(formData.capConfig.value)
          } : null,
          conditions: formData.conditions,
          status: formData.testMode ? "TESTING" : "ACTIVE"
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} transfer feed`);
      }

      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addFormDataPair = (type: "main" | "prePing" = "main") => {
    setFormData((prev) => ({
      ...prev,
      [type === "main" ? "formDataPairs" : "prePing"]: type === "main" 
        ? [...prev.formDataPairs, { key: "", value: "" }]
        : {
            ...prev.prePing,
            formDataPairs: [...prev.prePing.formDataPairs, { key: "", value: "" }]
          }
    }));
  };

  const updateFormDataPair = (index: number, field: keyof FormDataPair, value: string, type: "main" | "prePing" = "main") => {
    setFormData((prev) => {
      if (type === "main") {
        return {
          ...prev,
          formDataPairs: prev.formDataPairs.map((pair, i) => 
            i === index ? { ...pair, [field]: value } : pair
          )
        };
      } else {
        return {
          ...prev,
          prePing: {
            ...prev.prePing,
            formDataPairs: prev.prePing.formDataPairs.map((pair, i) => 
              i === index ? { ...pair, [field]: value } : pair
            )
          }
        };
      }
    });
  };

  const removeFormDataPair = (index: number, type?: 'main' | 'prePing') => {
    setFormData((prevFormData) => {
      if (type === 'prePing') {
        const newPairs = [...prevFormData.prePing.formDataPairs];
        newPairs.splice(index, 1);
        if (newPairs.length === 0) {
          newPairs.push({ key: '', value: '' }); // Ensure there's always at least one pair
        }
        return {
          ...prevFormData,
          prePing: {
            ...prevFormData.prePing,
            formDataPairs: newPairs,
          },
        };
      } else {
        const newPairs = [...prevFormData.formDataPairs];
        newPairs.splice(index, 1);
        if (newPairs.length === 0) {
          newPairs.push({ key: '', value: '' }); // Ensure there's always at least one pair
        }
        return {
          ...prevFormData,
          formDataPairs: newPairs,
        };
      }
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepBasicInfo
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 1:
        return (
          <StepPrePing 
            formData={formData} 
            updateFormData={updateFormData}
            addFormDataPair={addFormDataPair}
            updateFormDataPair={updateFormDataPair}
            removeFormDataPair={removeFormDataPair}
          />
        );
      case 2:
        return (
          <StepRequestConfig 
            formData={formData} 
            updateFormData={updateFormData}
            addFormDataPair={addFormDataPair}
            updateFormDataPair={updateFormDataPair}
            removeFormDataPair={removeFormDataPair}
          />
        );
      case 3:
        return <StepResponsePayout formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <StepConditions formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <StepScheduling formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <StepReview formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  // Update the form title in the parent component
  const formTitle = isEditing ? 'Edit Transfer Feed' : 'Create Transfer Feed';

  return (
    <div className="space-y-6">
      <ProgressSteps currentStep={currentStep} />
      
      <div className="min-h-[400px]">
        {renderStep()}
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0 || isSubmitting}
        >
          Previous
        </Button>
        <Button 
          onClick={handleNext}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Saving..."
          ) : (
            currentStep === FORM_STEPS.length - 1 ? (isEditing ? "Save Changes" : "Create Feed") : "Next"
          )}
        </Button>
      </div>
    </div>
  );
}