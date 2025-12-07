"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export const AuroraBackground = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900  text-slate-950 transition-bg",
          className
        )}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(
              `
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,#b8c6dc_10%,#dbeafe_15%,#e0e7ff_20%,#f3e8ff_25%,#b8c6dc_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform`,
              "hidden" // Keeping it simple custom below instead of complex CSS gradients
            )}
          />

          {/* Custom minimal aurora blobs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.2, 1],
              rotate: [0, 45, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[100px] mix-blend-multiply filter"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.1, 1],
              x: [0, 100, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-[20%] right-[-10%] w-[400px] h-[600px] bg-purple-200/30 rounded-full blur-[100px] mix-blend-multiply filter"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.3, 1],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
            className="absolute bottom-[-10%] left-[20%] w-[600px] h-[400px] bg-slate-200/40 rounded-full blur-[100px] mix-blend-multiply filter"
          />
        </div>
        <div className="relative z-10 w-full">{children}</div>
      </div>
    </main>
  );
};
