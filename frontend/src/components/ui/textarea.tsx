import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      aria-invalid={error || undefined}
      className={cn(
        "flex min-h-28 w-full rounded-xl border border-input bg-background/60 px-3.5 py-3 text-sm",
        "placeholder:text-muted-foreground/70 resize-y",
        "transition-[border-color,box-shadow] duration-200",
        "focus-visible:outline-none focus-visible:border-primary/60 focus-visible:ring-4 focus-visible:ring-primary/12",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-destructive/70 focus-visible:ring-destructive/15",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
