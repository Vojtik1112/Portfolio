"use client";

import { Project } from "@/app/data/projects";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden break-inside-avoid mb-6 flex flex-col"
    >
      <div className="relative w-full h-48 sm:h-64 bg-slate-100">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {project.title}
        </h3>
        <p className="text-slate-600 text-sm mb-4 leading-relaxed flex-grow">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md font-medium"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-auto">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href={project.githubLink} target="_blank">
              <Github className="w-4 h-4 mr-2" />
              Code
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="flex-1">
            <Link href={project.demoLink} target="_blank">
              <ExternalLink className="w-4 h-4 mr-2" />
              Demo
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
