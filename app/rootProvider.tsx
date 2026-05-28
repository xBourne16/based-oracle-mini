"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { useEffect, useState } from "react";

export function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}