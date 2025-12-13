"use client";

import { Navbar } from "@/components/Navbar";
import { SocialLink } from "@/components/SocialLink";
import { SmokedGlass } from "@/components/ui/SmokedGlass";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Github, Instagram, Mail } from "lucide-react";
import { useState } from "react";

type View = "home" | "work" | "about";

// Animation Variants
const contentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.1, ease: [0.25, 0.1, 0.25, 1.0] },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
};

const staggerChildren: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
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
            <div className="relative z-10 p-8 md:p-12 max-w-4xl mx-auto">
              <motion.div
                variants={fadeInUp}
                className="inline-flex flex-col items-center"
              >
                {/* Available Badge */}
                <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] md:text-xs text-emerald-300 font-semibold uppercase tracking-[0.2em]">
                    Available for Work
                  </span>
                </div>

                {/* Main Hero Text */}
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 text-white drop-shadow-2xl">
                  Vojta<span className="text-white/40">.</span>Novak
                </h1>

                {/* Subtitle */}
                <p className="text-sm md:text-base text-white/50 font-mono tracking-[0.5em] uppercase mb-12 border-b border-white/10 pb-4">
                  Full Stack Developer
                </p>

                {/* Glass Quote Card */}
                <SmokedGlass className="max-w-md mx-auto !bg-black/40 !border-white/5 !backdrop-blur-xl">
                  <p className="text-lg md:text-xl text-white/80 font-light italic leading-relaxed">
                    &quot;Genius, Billionaire, Playboy, Philanthropist.&quot;
                  </p>
                </SmokedGlass>
              </motion.div>
            </div>
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
            className="max-w-3xl w-full my-auto px-4"
          >
            <SmokedGlass className="relative overflow-hidden p-8 md:p-12 border-white/10 bg-black/60 shadow-2xl backdrop-blur-2xl rounded-3xl">
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left Column: Profile & Connect */}
                <div className="flex flex-col justify-between space-y-8">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
                      Let&apos;s
                      <br />
                      Connect
                    </h2>
                    <p className="text-white/60 font-light leading-relaxed max-w-sm">
                      I&apos;m currently open to new opportunities and
                      collaborations. Whether you have a question or just want
                      to say hi, I&apos;ll try my best to get back to you!
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <SocialLink
                      icon={<Github className="w-5 h-5" />}
                      href="https://github.com/Vojtik1112"
                    />
                    <SocialLink
                      icon={<Instagram className="w-5 h-5" />}
                      href="https://www.instagram.com/schizvojta/"
                    />
                    <SocialLink
                      icon={<Mail className="w-5 h-5" />}
                      href="mailto:vojtechnovak84@gmail.com"
                    />
                  </div>
                </div>

                {/* Right Column: Skills Matrix */}
                <div className="space-y-8 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-12">
                  <div>
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <span className="w-8 h-[1px] bg-white/20"></span>
                      Tech Stack
                    </h3>

                    <div className="space-y-6">
                      {/* Systems */}
                      <div>
                        <span className="text-[10px] text-white/30 uppercase tracking-wider font-mono mb-3 block">
                          Core & Systems
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {["C++", "C#", "PHP", "Python"].map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 text-xs font-mono text-white/80 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Frontend */}
                      <div>
                        <span className="text-[10px] text-white/30 uppercase tracking-wider font-mono mb-3 block">
                          Frontend & Design
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "React",
                            "Next.js",
                            "Tailwind",
                            "Framer Motion",
                            "Spline",
                          ].map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 text-xs font-mono text-purple-200/80 bg-purple-500/5 border border-purple-500/10 rounded-full hover:bg-purple-500/10 hover:border-purple-500/20 transition-all cursor-default"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Data */}
                      <div>
                        <span className="text-[10px] text-white/30 uppercase tracking-wider font-mono mb-3 block">
                          Data & Tools
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {["JSON", "XML", "Git", "VS Code"].map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 text-xs font-mono text-blue-200/80 bg-blue-500/5 border border-blue-500/10 rounded-full hover:bg-blue-500/10 hover:border-blue-500/20 transition-all cursor-default"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
