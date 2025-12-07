"use client";

import { Navbar } from "@/components/Navbar";
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
              className="text-lg md:text-2xl text-white/60 tracking-widest uppercase mb-6"
            >
              IT Student
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mb-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-400 font-medium uppercase tracking-wider">
                Available for Freelancing
              </span>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-white/80 font-light italic max-w-lg mx-auto"
            >
              "Genius, Billionaire, Playboy, Philanthropist."
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
            className="w-full flex flex-col items-center justify-start min-h-[70vh] pt-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full px-4">
              {/* PHP Project Card */}
              <SmokedGlass className="group relative overflow-hidden rounded-2xl border-white/10 bg-black/40 hover:bg-black/60 transition-colors p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:text-purple-300 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 12h18" />
                      <path d="M5 12V7a5 5 0 0 1 10 0v5" />
                    </svg>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 border border-white/10 px-2 py-1 rounded-full">
                    Assignment
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                    PHP Data Manager
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed font-light">
                    A simple PHP application demonstrating XML/JSON parsing and
                    a basic text editor with file persistence.
                  </p>
                </div>

                <div className="mt-auto pt-6 flex gap-4 text-xs font-mono text-white/40 uppercase tracking-wider">
                  <span>PHP</span>
                  <span>XML</span>
                  <span>JSON</span>
                </div>

                <a
                  href="http://localhost:8080"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-20 focus:outline-none"
                  aria-label="View PHP Project"
                >
                  <span className="sr-only">View Component</span>
                </a>
              </SmokedGlass>
            </div>
          </motion.div>
        )}

        {view === "about" && (
          <motion.div
            key="about"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-2xl w-full my-auto"
          >
            <SmokedGlass className="text-center py-12 px-8 md:py-20 md:px-12 border-white/20 bg-black/60">
              <h2 className="text-4xl font-bold mb-8 text-white">Contact Me</h2>

              <div className="mb-12 space-y-8">
                <div className="text-left">
                  <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">
                    Tech Stack
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-white/80 text-xs uppercase mb-2">
                        Systems
                      </h4>
                      <p className="text-white/60 font-mono text-sm">
                        C++, C#, PHP
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white/80 text-xs uppercase mb-2">
                        Frontend
                      </h4>
                      <p className="text-white/60 font-mono text-sm">
                        HTML, CSS, JS
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white/80 text-xs uppercase mb-2">
                        Data
                      </h4>
                      <p className="text-white/60 font-mono text-sm">JSON</p>
                    </div>
                  </div>
                </div>
              </div>

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
}) => {
  const isMailto = href.startsWith("mailto:");
  return (
    <motion.a
      href={href}
      target={isMailto ? undefined : "_blank"}
      rel={isMailto ? undefined : "noopener noreferrer"}
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
};
