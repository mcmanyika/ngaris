"use client";

import { usePathname } from "next/navigation";

import { SiteChatbot } from "@/components/chat/site-chatbot";

export function ConditionalChatbot() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <SiteChatbot />;
}
