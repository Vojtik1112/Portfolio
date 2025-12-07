"use client";

import { Copy, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "./ui/button";

export const ContactSection = () => {
  const email = "hello@example.com"; // Replace with actual email

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    toast.success("Email copied to clipboard!");
  };

  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-12">
          Let&apos;s work together.
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Button
            onClick={handleCopy}
            className="h-14 px-8 text-lg rounded-full"
          >
            <Mail className="w-5 h-5 mr-3" />
            {email}
            <Copy className="w-4 h-4 ml-3 opacity-70" />
          </Button>

          <div className="flex gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14 rounded-full"
              asChild
            >
              <Link href="https://github.com" target="_blank">
                <Github className="w-6 h-6" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14 rounded-full"
              asChild
            >
              <Link href="https://linkedin.com" target="_blank">
                <Linkedin className="w-6 h-6" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
