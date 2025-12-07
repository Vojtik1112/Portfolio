"use client";
import { SmokedGlass } from "@/components/ui/SmokedGlass";
import { cn } from "@/lib/utils";

type View = "home" | "work" | "about";

interface NavbarProps {
  activeView: View;
  onNavigate: (view: View) => void;
} 

export function Navbar({ activeView, onNavigate }: NavbarProps) {
  const navItems: View[] = ["home", "work", "about"];

  return (
    <nav className="fixed top-8 left-0 w-full z-50 flex justify-center pointer-events-none fade-in-nav">
      <SmokedGlass className="pointer-events-auto flex items-center gap-1 p-1 rounded-full bg-black/50 backdrop-blur-xl border-white/10">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => onNavigate(item)}
            className={cn(
              "px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-medium transition-all duration-300",
              activeView === item
                ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            {item}
          </button>
        ))}
      </SmokedGlass>
    </nav>
  );
}
