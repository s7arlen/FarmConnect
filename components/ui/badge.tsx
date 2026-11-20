import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-green/10 text-brand-green",
        verified:
          "border-transparent bg-brand-green text-white",
        limited:
          "border-transparent bg-amber-100 text-amber-700",
        unavailable:
          "border-transparent bg-gray-100 text-gray-500",
        warning:
          "border-transparent bg-brand-warning/10 text-brand-warning",
        error:
          "border-transparent bg-brand-error/10 text-brand-error",
        secondary:
          "border-brand-border text-brand-muted",
        outline:
          "border-brand-border text-brand-text",
        fresh:
          "border-transparent bg-emerald-100 text-emerald-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
