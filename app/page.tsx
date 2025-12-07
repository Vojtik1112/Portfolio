import { projects } from "@/app/data/projects";
import { AuroraBackground } from "@/components/AuroraBackground";
import { ContactSection } from "@/components/ContactSection";
import { ProjectCard } from "@/components/ProjectCard"; // Needs to be 'use client' for hover or imported in client component?
// ProjectCard is 'use client' inside the file, so it's fine to import here in server component.

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-slate-200 text-slate-900">
      {/* Hero Section */}
      <AuroraBackground>
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 mb-6 drop-shadow-sm animate-fade-in-up">
            Building robust <br /> backends with PHP.
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 tracking-wide font-light animate-fade-in-up delay-200">
            Full Stack Developer.
          </p>
        </div>
      </AuroraBackground>

      {/* Projects Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight mb-16 text-slate-900">
          Selected Work
        </h2>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />
    </main>
  );
}
