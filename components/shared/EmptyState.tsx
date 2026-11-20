import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-4",
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center mb-4 text-brand-green">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-brand-text mb-2">{title}</h3>
      {description && (
        <p className="text-brand-muted text-sm max-w-sm mb-6">{description}</p>
      )}
      {action && (
        action.href ? (
          <a href={action.href}>
            <Button variant="outline">{action.label}</Button>
          </a>
        ) : (
          <Button variant="outline" onClick={action.onClick}>
            {action.label}
          </Button>
        )
      )}
    </div>
  );
}
