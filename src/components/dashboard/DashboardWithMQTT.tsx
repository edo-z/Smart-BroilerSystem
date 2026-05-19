"use client";

import { ReactNode } from "react";
import { MQTTProvider } from "@/contexts/MQTTContext";
import DashboardPage from "@/app/(dashboard)/dashboard/page";

export default function DashboardWithMQTT() {
  return (
    <MQTTProvider>
      <DashboardPage />
    </MQTTProvider>
  );
}