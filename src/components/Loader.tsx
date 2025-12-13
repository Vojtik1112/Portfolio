"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export const Loader = () => {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);

  // Fake loading progress since we removed Three.js loader
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random increment for organic feel
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Smooth unmounting when complete
  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(t);
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          <div className="w-48 text-center">
            <div className="h-1 w-full bg-white/10 rounded-full mb-4 overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-white/40 font-mono tracking-widest uppercase">
              Loading System...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
