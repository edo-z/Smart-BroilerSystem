"use client";

import { ReactNode } from "react";
import { MQTTProvider } from "@/contexts/MQTTContext";

export default function DashboardClientLayout({ children }: { children: ReactNode }) {
  return (
    <MQTTProvider>
      {children}
    </MQTTProvider>
  );
}