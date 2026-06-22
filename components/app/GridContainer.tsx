import { cn } from "@/lib/utils";

type State = "default" | "empty" | "loading";

type Props = {
  state?: State;
  className?: string;
  children: React.ReactNode;
};

export function GridContainer({ state = "default", className, children }: Props) {
  return (
    <div
      className={cn(
        "flex-1 rounded-lg bg-card border",
        state === "default" && "border-border overflow-hidden",
        state === "empty" &&
          "border-dashed border-border flex flex-col items-center justify-center text-center p-8",
        state === "loading" && "border-border flex items-center justify-center p-20",
        className
      )}
    >
      {children}
    </div>
  );
}
