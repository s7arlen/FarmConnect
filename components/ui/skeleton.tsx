import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-brand-border/60",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Skeleton };
