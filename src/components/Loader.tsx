"use client";
import { useProgress } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export const Loader = () => {
  const { progress, total } = useProgress();
  const [show, setShow] = useState(true);

  // Smooth unmounting
  useEffect(() => {
    // If loading is complete (100%) OR there are no assets to load (total === 0), typical for procedural scenes
    if (progress === 100 || total === 0) {
      // Small delay to ensure smooth exit
      const t = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(t);
    }
  }, [progress, total]);

  // Safety fallback: Force close after 5 seconds if something gets stuck
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(t);
  }, []);

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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
