import { cn } from "@/lib/utils";

type Props = {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function FormField({ label, required, className, children }: Props) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-sm font-medium text-foreground">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
