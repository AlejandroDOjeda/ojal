import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};

export function SectionCard({ title, description, className, children }: Props) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-6", className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="text-base font-semibold text-foreground">{title}</h2>}
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
