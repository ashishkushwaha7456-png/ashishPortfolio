import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/10 text-primary",
        secondary: "border-border bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground/75",
        success: "border-transparent bg-[color-mix(in_oklch,var(--success)_15%,transparent)] text-[var(--success)]",
        warning: "border-transparent bg-[color-mix(in_oklch,var(--warning)_18%,transparent)] text-[var(--warning)]",
        destructive: "border-transparent bg-destructive/12 text-destructive",
        glass: "glass text-foreground/80",
        gradient:
          "border-transparent text-white bg-[linear-gradient(110deg,oklch(0.58_0.23_275),oklch(0.66_0.17_205))]",
      },
      size: {
        sm: "px-2 py-0.5 text-[0.6875rem]",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
