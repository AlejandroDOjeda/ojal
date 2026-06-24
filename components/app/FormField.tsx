import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

type Props = {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
};

export function FormField({ label, required, error, className, children }: Props) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label>
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
