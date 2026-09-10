import type { LabelHTMLAttributes } from "react";
import { cn } from "@/components/ui/cn";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    // Association is provided by callers via htmlFor or nested controls.
    // biome-ignore lint/a11y/noLabelWithoutControl: reusable Label; control is not a child here
    <label
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}
