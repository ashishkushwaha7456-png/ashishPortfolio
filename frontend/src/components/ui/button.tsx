import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "transition-[transform,background-color,color,box-shadow,border-color] duration-200 ease-out",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:bg-primary/90 hover:shadow-[0_6px_24px_-6px_var(--primary)]",
        gradient:
          "text-white shadow-[0_8px_30px_-10px_var(--primary)] bg-[linear-gradient(120deg,oklch(0.58_0.23_275),oklch(0.6_0.21_320),oklch(0.68_0.16_205))] bg-[length:200%_auto] hover:bg-[position:100%_center]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70 border border-border",
        outline:
          "border border-border bg-background/40 backdrop-blur hover:bg-secondary/60 hover:border-foreground/20",
        ghost: "hover:bg-secondary/70 text-foreground/80 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        glass:
          "glass text-foreground hover:bg-[color-mix(in_oklch,var(--card)_88%,transparent)]",
      },
      size: {
        sm: "h-8 rounded-lg px-3 text-xs",
        default: "h-10 rounded-xl px-4 text-sm",
        lg: "h-12 rounded-xl px-6 text-[0.9375rem]",
        xl: "h-14 rounded-2xl px-8 text-base",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, children, disabled, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            <span className="sr-only">Loading</span>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
