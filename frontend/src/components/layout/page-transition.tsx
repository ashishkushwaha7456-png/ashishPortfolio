"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Route-change transition. Keyed on pathname so React remounts the subtree and
 * the enter animation replays; deliberately short so it never delays reading.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
