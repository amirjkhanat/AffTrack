import { FORM_STEPS } from "./form-steps";

interface ProgressStepsProps {
  currentStep: number;
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <div className="flex justify-between mb-8">
      {FORM_STEPS.map((step, index) => (
        <div
          key={index}
          className={`flex flex-col items-center w-1/4 relative ${
            index <= currentStep ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              index <= currentStep
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            {index + 1}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">{step}</p>
          </div>
          {index < FORM_STEPS.length - 1 && (
            <div
              className={`absolute top-4 left-1/2 w-full h-[2px] ${
                index < currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}