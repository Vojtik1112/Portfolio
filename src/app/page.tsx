"use client";

import { Navbar } from "@/components/Navbar";
import { ProjectCard } from "@/components/ProjectCard";
import { SmokedGlass } from "@/components/ui/SmokedGlass";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { useState } from "react";

type View = "home" | "work" | "about";

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5 },
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    filter: "blur(10px)",
    transition: { duration: 0.3 },
  },
};

export default function Home() {
  const [view, setView] = useState<View>("home");

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center p-4">
      <Navbar activeView={view} onNavigate={setView} />

      <AnimatePresence mode="wait">
        {view === "home" && (
          <motion.div
            key="home"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center text-center max-w-4xl"
          >
            <h1 className="text-8xl md:text-[12rem] font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20 mb-8 leading-none select-none">
              VOJTIK
            </h1>
            <p className="text-xl md:text-2xl text-white/60 tracking-[0.5em] uppercase font-light">
              Creative Developer
            </p>
          </motion.div>
        )}

        {view === "work" && (
          <motion.div
            key="work"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-6xl grid md:grid-cols-2 lg:grid-cols-3 gap-6 h-[70vh]"
          >
            <ProjectCard
              title="Quantum E-Commerce"
              description="High-frequency trading interface for digital assets. Optimized for <10ms latency."
              tags={["Next.js", "WebGL", "Socket.io"]}
              href="#"
            />
            <ProjectCard
              title="Neural Visualization"
              description="Interactive 3D visualization of LLM attention heads using instanced mesh rendering."
              tags={["Three.js", "Python", "WebGPU"]}
              href="#"
            />
            <ProjectCard
              title="Cyberpunk API"
              description="Robust backend infrastructure for a dystopian city management game."
              tags={["Laravel", "Postgres", "Redis"]}
              href="#"
            />
          </motion.div>
        )}

        {view === "about" && (
          <motion.div
            key="about"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-2xl w-full"
          >
            <SmokedGlass className="text-center py-20 px-12 border-white/20 bg-black/60">
              <h2 className="text-4xl font-bold mb-8 text-white">
                Initialize Contact
              </h2>
              <p className="text-white/70 mb-12 text-lg leading-relaxed font-light">
                Specializing in high-performance WebGL interfaces and robust
                backend architecture. Building the future of the web, one frame
                at a time.
              </p>

              <div className="flex justify-center gap-6">
                <SocialLink icon={<Github />} href="#" />
                <SocialLink icon={<Mail />} href="#" />
                <SocialLink icon={<Linkedin />} href="#" />
              </div>
            </SmokedGlass>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-8 text-[10px] text-white/20 tracking-[0.3em] font-mono select-none">
        SYSTEM VERSION 3.0.0
      </div>
    </main>
  );
}

const SocialLink = ({
  icon,
  href,
}: {
  icon: React.ReactNode;
  href: string;
}) => (
  <motion.a
    href={href}
    whileHover={{
      scale: 1.1,
      color: "#fff",
      borderColor: "rgba(255,255,255,0.5)",
    }}
    className="p-4 rounded-full bg-white/5 text-white/50 border border-white/5 transition-colors"
  >
    {icon}
  </motion.a>
);
