export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink: string;
  demoLink: string;
  imageUrl: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "E-commerce API",
    description:
      "A robust scalable REST API for high-volume e-commerce platforms. Features JWT authentication, complex product filtering, and payment gateway integration.",
    techStack: ["PHP", "Laravel", "MySQL", "Redis"],
    githubLink: "#",
    demoLink: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "2",
    title: "Laravel CMS",
    description:
      "A headless CMS built with Laravel and flexible content modeling. Designed for performance and ease of use for content editors.",
    techStack: ["Laravel", "Vue.js", "Tailwind CSS"],
    githubLink: "#",
    demoLink: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "3",
    title: "Inventory System",
    description:
      "Real-time inventory tracking system for multi-warehouse logistics. Integrates with barcode scanners and provides predictive analytics.",
    techStack: ["PHP", "Symfony", "PostgreSQL", "Docker"],
    githubLink: "#",
    demoLink: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "4",
    title: "Payment Gateway Service",
    description:
      "A microservice for handling secure transactions. specific focus on PCI compliance and fault tolerance.",
    techStack: ["PHP", "Slim", "Redis", "Kafka"],
    githubLink: "#",
    demoLink: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800",
  },
];
