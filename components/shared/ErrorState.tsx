import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-4",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-brand-error/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-brand-error" />
      </div>
      <h3 className="text-base font-semibold text-brand-text mb-1">{title}</h3>
      <p className="text-sm text-brand-muted mb-4 max-w-sm">{description}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} size="sm">
          Try Again
        </Button>
      )}
    </div>
  );
}
