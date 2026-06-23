import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

type Props = {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function FormField({ label, required, className, children }: Props) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label>
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}
