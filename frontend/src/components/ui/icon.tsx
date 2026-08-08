import * as React from "react";
import * as Lucide from "lucide-react";
import { cn } from "@/lib/utils";

export type IconName = keyof typeof Lucide;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  /** Any Lucide icon name; falls back to a neutral shape if it doesn't exist. */
  name?: string;
  size?: number;
}

/**
 * Content stored in MongoDB references icons by name, so this resolves a string
 * to a component at render time instead of forcing the admin to write JSX.
 */
export function Icon({ name, size = 20, className, ...props }: IconProps) {
  const Fallback = Lucide.Sparkles;
  const Component = (name && (Lucide as unknown as Record<string, unknown>)[name]) as
    | React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number }>
    | undefined;

  const Resolved =
    typeof Component === "function" || typeof Component === "object"
      ? (Component as typeof Fallback)
      : Fallback;

  return <Resolved size={size} className={cn("shrink-0", className)} {...props} />;
}
