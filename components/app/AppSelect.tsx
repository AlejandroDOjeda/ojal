import { cn } from "@/lib/utils";

export function AppSelect({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm",
        "focus:outline-none focus:ring-3 focus:ring-ring/50 focus:border-ring transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}
