interface DocsHeaderProps {
  heading: string;
  text?: string;
}

export function DocsHeader({ heading, text }: DocsHeaderProps) {
  return (
    <div className="space-y-4 pb-4 border-b">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
        {heading}
      </h1>
      {text && (
        <p className="text-lg text-muted-foreground leading-7">
          {text}
        </p>
      )}
    </div>
  );
}