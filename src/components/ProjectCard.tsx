"use client";
import { SmokedGlass } from "@/components/ui/SmokedGlass";

interface ProjectCardProps {
  title: string;
  description: string;
  code: string;
  tags: string[];
}

export const ProjectCard = ({
  title,
  description,
  code,
  tags,
}: ProjectCardProps) => {
  const highlightedCode = code
    .replace(
      /(class|function|public|return|echo|use|namespace|extends|new)/g,
      '<span class="text-violet-400">$1</span>'
    )
    .replace(/(\$[a-zA-Z0-9_]+)/g, '<span class="text-blue-300">$1</span>')
    .replace(/('.*?'|".*?")/g, '<span class="text-green-300">$1</span>')
    .replace(/(\/\/.*)/g, '<span class="text-slate-500">$1</span>')
    .replace(/(-&gt;)/g, '<span class="text-pink-400">$1</span>')
    .replace(/(\:\:)/g, '<span class="text-pink-400">$1</span>');

  return (
    <SmokedGlass className="p-0 overflow-hidden group hover:border-white/30 transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.1)]">
      {/* Window Top Bar */}
      <div className="bg-white/5 border-b border-white/5 px-4 py-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/20 group-hover:bg-red-500/80 transition-colors" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500/80 transition-colors" />
        <div className="w-3 h-3 rounded-full bg-green-500/20 group-hover:bg-green-500/80 transition-colors" />
        <div className="ml-auto text-xs text-white/20 font-mono group-hover:text-white/50 transition-colors">
          routes.php
        </div>
      </div>

      {/* Code Area */}
      <div className="p-6 bg-black/40 font-mono text-sm leading-relaxed overflow-x-auto">
        <pre>
          <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </pre>
      </div>

      {/* Info */}
      <div className="p-6 border-t border-white/5 bg-gradient-to-t from-white/5 to-transparent">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/60 text-sm mb-4">{description}</p>
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-sm bg-white/5 text-white/50 border border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </SmokedGlass>
  );
};
