import { Monitor } from "lucide-react";

export const MobileBlocker = () => {
  return (
    <div className="md:hidden fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-white/5 p-6 rounded-full mb-6 border border-white/10">
        <Monitor className="w-12 h-12 text-white/40" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-4">
        Desktop Experience Only
      </h2>
      <p className="text-white/40 max-w-xs leading-relaxed">
        This immersive portfolio is designed for larger screens. Please visit on
        a desktop or laptop for the best experience.
      </p>

      <div className="fixed bottom-8 text-[10px] text-white/20 tracking-[0.3em] font-mono select-none">
        SYSTEM LOCKED
      </div>
    </div>
  );
};
