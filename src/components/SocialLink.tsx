"use client";

import { motion } from "framer-motion";
import React from "react";

interface SocialLinkProps {
  icon: React.ReactNode;
  href: string;
}

export const SocialLink = ({ icon, href }: SocialLinkProps) => {
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
