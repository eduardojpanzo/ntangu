import { cn } from "@/lib/utils";

export interface ResponsiveGridProps {
  columns?: number;
  columnMinSize?: string;
  className?: string;
  children?: React.ReactNode;
}

export function ResponsiveGrid({
  columns = 3,
  columnMinSize = "340px",
  className = "",
  children,
}: ResponsiveGridProps) {
  const gridTemplateColumns = `repeat(auto-fit, minmax(min(100%/${columns}, max(${columnMinSize}, 100%/${
    columns + 1
  })), 1fr))`;

  return (
    <div
      className={cn("grid gap-2", className)}
      style={{ gridTemplateColumns }}
    >
      {children}
    </div>
  );
}
