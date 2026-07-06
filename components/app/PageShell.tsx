import { cn } from "@/lib/utils";

type Props = {
  title: string;
  action?: React.ReactNode;
  back?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function PageShell({ title, action, back, className, children }: Props) {
  return (
    <div className={cn("p-8 flex flex-col w-full mx-auto h-full min-h-0", className)}>
      <div className="mb-6">
        {back && <div className="mb-3">{back}</div>}
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {action && <div className="ml-4 shrink-0">{action}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}
