import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={cn("min-h-screen pb-20 bg-background", className)}>
      <div className="container mx-auto px-4 py-6 max-w-screen-xl">
        {children}
      </div>
    </div>
  );
};
