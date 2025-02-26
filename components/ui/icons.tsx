// components/ui/icons.tsx
import { LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import dynamic from "next/dynamic";

export const Icons = {
  spinner: dynamic(() => import("lucide-react").then((mod) => mod.Loader2)),
  // Add more icons as needed
};