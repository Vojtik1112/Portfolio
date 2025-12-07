"use client";

import { Navbar } from "@/components/Navbar";
import { ProjectCard } from "@/components/ProjectCard";
import { SmokedGlass } from "@/components/ui/SmokedGlass";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Instagram, Mail } from "lucide-react";
import { useState } from "react";

type View = "home" | "work" | "about";

// Animation Variants
const contentVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
};

const staggerChildren: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const fadeInUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

export default function Page() {
  const [view, setView] = useState<View>("home");

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center p-4">
      <Navbar activeView={view} onNavigate={setView} />

      <AnimatePresence mode="wait">
        {view === "home" && (
          <motion.div
            key="home"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
            >
              Vojta Novak
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-2xl text-white/60 tracking-widest uppercase mb-10"
            >
              Creative Developer
            </motion.p>
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
                <SocialLink
                  icon={<Github />}
                  href="https://github.com/Vojtik1112"
                />
                <SocialLink
                  icon={<Instagram />}
                  href="https://www.instagram.com/schizvojta/"
                />
                <SocialLink
                  icon={<Mail />}
                  href="mailto:vojtechnovak84@gmail.com"
                />
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
    target="_blank"
    rel="noopener noreferrer"
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
