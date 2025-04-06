import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Code } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { faker } from "@faker-js/faker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransferFeedFormData } from "./types";

interface StepReviewProps {
  formData: TransferFeedFormData;
  updateFormData: (field: keyof TransferFeedFormData, value: any) => void;
}

export function StepReview({ formData, updateFormData }: StepReviewProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [sampleData, setSampleData] = useState({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zip: faker.location.zipCode(),
    dob_dd: faker.date.birthdate().getDate().toString().padStart(2,'0'),
    dob_mm: (faker.date.birthdate().getMonth() + 1).toString().padStart(2,'0'),
    dob_yyyy: faker.date.birthdate().getFullYear().toString(),
  });
  const [additionalFields, setAdditionalFields] = useState([]);

  const handleAddField = () => {
    setAdditionalFields([...additionalFields, { key: "", value: "" }]);
  };

  const handleSend = async () => {
    setLoading(true);
    try {
      const additionalFieldsObject = additionalFields.reduce((acc, field) => {
        acc[field.key] = field.value;
        return acc;
      }, {});

      const response = await fetch("/api/test-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transferFeedId: formData.id,
          ...sampleData,
          ...additionalFieldsObject,
        }),
      });
      const data = await response.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: "Failed to send data" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4 space-y-4 h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
        
          <div>
            <Label className="text-muted-foreground">Feed Name</Label>
            <p className="font-medium">{formData.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 bg-blue-100 p-3 rounded-lg">
            {formData.prePing.enabled && (
              <>
              <div>
                <Label className="text-muted-foreground">Pre-Ping Method</Label>
                <pre className="font-mono">{formData.prePing.method}</pre>
              </div>

              <div>
                <Label className="text-muted-foreground">Pre-Ping URL</Label>
                <pre className="font-medium ">{formData.prePing.url}</pre>
              </div>

              <div>
                <Label className="text-muted-foreground">Pre-Ping Headers</Label>
                <pre className="text-sm font-mono p-2 rounded-md">
                  {formData.prePing.headers}
                </pre>
              </div>

              <div>
                <Label className="text-muted-foreground">
                  Pre-Ping Body ({formData.prePing.bodyType})
                </Label>
                <pre className="text-sm font-mono p-2 rounded-md">
                  {formData.prePing.bodyType === "json"
                    ? formData.prePing.jsonBody
                    : formData.prePing.formDataPairs
                        .map((pair) => `${pair.key}: ${pair.value}`)
                        .join('\n')}
                </pre>
              </div>

              <div>
                <Label className="text-muted-foreground">Pre-Ping Success Pattern</Label>
                <pre className="font-mono">{formData.prePing.successSearch}</pre>
              </div>

              {formData.prePing.responseMapping.enabled && (
                <div>
                  <Label className="text-muted-foreground">Pre-Ping Response ID Mapping</Label>
                  <pre className="font-mono">{formData.prePing.responseMapping.idPath}</pre>
                </div>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">HTTP Method</Label>
            <p className="font-medium">{formData.method}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">Webhook URL</Label>
            <p className="font-medium">{formData.webhookUrl}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">Headers</Label>
            <pre className="text-sm font-mono bg-muted p-2 rounded-md">
              {formData.headers}
          </pre>
        </div>

          <div>
            <Label className="text-muted-foreground">
              Request Body ({formData.bodyType})
            </Label>
            <pre className="text-sm font-mono bg-muted p-2 rounded-md">
              {formData.bodyType === "json"
                ? formData.jsonBody
              : formData.formDataPairs
                  .map((pair) => `${pair.key}: ${pair.value}`)
                  .join('\n')}
            </pre>
          </div>

          <div>
            <Label className="text-muted-foreground">Success Pattern</Label>
            <pre className="font-mono">{formData.successSearch}</pre>
          </div>

          <div>
            <Label className="text-muted-foreground">Payout</Label>
            <pre className="font-medium">
            {formData.payoutType === "static"
              ? `$${formData.payoutAmount} (Static)`
              : `Dynamic: ${formData.payoutPath}`}
            </pre>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg">
        <Switch
          id="test-mode"
          checked={formData.testMode}
          onCheckedChange={(checked) => {
            updateFormData("testMode", checked);
            updateFormData("status", checked ? "TESTING" : "ACTIVE");
          }}
        />
        <Label htmlFor="test-mode">Enable Test Mode</Label>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Code className="h-4 w-4 mr-2" />
            Test Webhook
          </Button>
        </DialogTrigger>
        <DialogContent className="p-6 space-y-4 min-w-[800px]">
          <DialogHeader>
            <DialogTitle>Test Webhook</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <pre className="bg-gray-100 p-4 rounded max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">{JSON.stringify(response, null, 2)}</pre>
          )}
          <form className="space-y-4 max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400" >
            {Object.entries(sampleData).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <Label>{key.replace(/_/g, ' ')}</Label>
                <input
                  type="text"
                  className="border p-2 rounded"
                  value={value}
                  onChange={(e) => setSampleData({ ...sampleData, [key]: e.target.value })}
                />
              </div>
            ))}
            {additionalFields.map((field, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Key"
                  className="border p-2 rounded flex-1"
                  value={field.key}
                  onChange={(e) => {
                    const newFields = [...additionalFields];
                    newFields[index].key = e.target.value;
                    setAdditionalFields(newFields);
                  }}
                />
                <input
                  type="text"
                  placeholder="Value"
                  className="border p-2 rounded flex-1"
                  value={field.value}
                  onChange={(e) => {
                    const newFields = [...additionalFields];
                    newFields[index].value = e.target.value;
                    setAdditionalFields(newFields);
                  }}
                />
              </div>
            ))}
            <Button type="button" onClick={handleAddField}>
              Add Field
            </Button>
            <Button type="button" onClick={handleSend}>
              Send
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}