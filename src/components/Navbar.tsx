"use client";
import { SmokedGlass } from "@/components/ui/SmokedGlass";

export const Navbar = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-6 left-0 w-full z-40 flex justify-center pointer-events-none fade-in-nav">
      <SmokedGlass className="pointer-events-auto flex items-center gap-8 py-3 px-8 rounded-full">
        <button
          onClick={() => scrollTo("hero")}
          className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest text-[10px]"
        >
          Home
        </button>
        <div className="w-px h-3 bg-white/10" />
        <button
          onClick={() => scrollTo("work")}
          className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest text-[10px]"
        >
          Work
        </button>
        <div className="w-px h-3 bg-white/10" />
        <button
          onClick={() => scrollTo("about")}
          className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest text-[10px]"
        >
          About
        </button>
      </SmokedGlass>
    </nav>
  );
};
