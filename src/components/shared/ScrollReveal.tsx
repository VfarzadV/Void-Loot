"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: "fade-up" | "fade-right" | "fade-left" | "zoom-in";
  delay?: number;
  duration?: number;
}

export default function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 0.5,
}: ScrollRevealProps) {
  const variants = {
    hidden: {
      opacity: 0,
      y: animation === "fade-up" ? 40 : 0,
      x: animation === "fade-right" ? -40 : animation === "fade-left" ? 40 : 0,
      scale: animation === "zoom-in" ? 0.9 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease: [0.25, 1, 0.5, 1] }}
      variants={variants}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
