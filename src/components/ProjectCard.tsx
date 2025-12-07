"use client";
import { SmokedGlass } from "@/components/ui/SmokedGlass";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  href?: string;
}

export const ProjectCard = ({
  title,
  description,
  tags,
  href = "#",
}: ProjectCardProps) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <SmokedGlass className="h-full flex flex-col justify-between p-8 hover:border-white/40 transition-colors hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] group relative">
        <div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-white group-hover:text-violet-200 transition-colors">
              {title}
            </h3>
            <ArrowUpRight className="text-white/30 group-hover:text-white transition-colors" />
          </div>
          <p className="text-white/60 text-base leading-relaxed mb-6">
            {description}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 text-white/50 border border-white/5 group-hover:border-white/20 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </SmokedGlass>
    </motion.a>
  );
};
