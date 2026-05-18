"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import OTAComponent from "@/components/dashboard/OTAComponent";

export default function OTAPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  const userId = (session.user as any)?.id;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <OTAComponent userId={userId} />
      </div>
    </div>
  );
}