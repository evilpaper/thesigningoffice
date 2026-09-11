"use client";

import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/components/ui/cn";

const variantClasses = {
  primary: "border-0 bg-primary text-primary-foreground hover:opacity-90",
  secondary:
    "border border-border bg-muted text-foreground hover:bg-background",
  ghost: "border-0 bg-transparent text-foreground hover:bg-muted",
  destructive:
    "border-0 bg-destructive text-destructive-foreground hover:opacity-90",
} as const;

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  asChild?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex cursor-pointer items-center justify-center rounded-md font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (asChild) {
    return <Slot className={classes} {...props} />;
  }

  return <button type={type} className={classes} {...props} />;
}
