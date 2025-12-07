import { cn } from "@/lib/utils";
import React from "react";

interface SmokedGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SmokedGlass = ({
  children,
  className,
  ...props
}: SmokedGlassProps) => {
  return (
    <div
      className={cn(
        "bg-black/30 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] text-slate-200 rounded-2xl p-6 transition-all duration-300 hover:border-white/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
