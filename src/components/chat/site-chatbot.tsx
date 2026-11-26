"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const STARTER: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi — I’m the Ngaris Construction assistant. Ask about verified providers, selecting a team with us, or how we manage projects from abroad.",
};

const SUGGESTIONS = [
  "How do you verify providers?",
  "Can you manage a build from the diaspora?",
  "How does provider selection work?",
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function SiteChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([STARTER]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, open, pending]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function sendMessage(raw: string) {
    const content = raw.trim();
    if (!content || pending) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content,
    };
    const assistantId = createId();
    const history = [...messages, userMessage]
      .filter((message) => message.id !== "welcome")
      .map(({ role, content: text }) => ({ role, content: text }));

    setInput("");
    setError(null);
    setPending(true);
    setMessages((current) => [
      ...current,
      userMessage,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? "Unable to reply right now.");
      }

      if (!response.body) {
        throw new Error("Empty response from chat service.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assembled = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assembled += decoder.decode(value, { stream: true });
        const snapshot = assembled;
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? { ...message, content: snapshot }
              : message,
          ),
        );
      }

      if (!assembled.trim()) {
        throw new Error("No reply received. Please try again.");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to reply right now.";
      setError(message);
      setMessages((current) =>
        current.filter(
          (item) => item.id !== assistantId || item.content.trim().length > 0,
        ),
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open ? (
        <div className="pointer-events-auto flex h-[min(34rem,calc(100vh-6.5rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#032842]/10 bg-white shadow-[0_24px_60px_rgba(3,40,66,0.22)]">
          <div className="flex items-start justify-between gap-3 bg-[#022848] px-4 py-3.5 text-white">
            <div>
              <p className="text-sm font-semibold tracking-tight">
                Ngaris Assistant
              </p>
              <p className="mt-0.5 text-[11px] text-white/65">
                Providers · selection · managed projects
              </p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto bg-[#F4F7FA] px-3 py-3"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap",
                    message.role === "user"
                      ? "rounded-br-md bg-[#032842] text-white"
                      : "rounded-bl-md border border-[#032842]/6 bg-white text-[#032842] shadow-sm",
                  )}
                >
                  {message.content || (
                    <span className="inline-flex gap-1 text-[#032842]/40">
                      <span className="animate-pulse">●</span>
                      <span className="animate-pulse [animation-delay:120ms]">
                        ●
                      </span>
                      <span className="animate-pulse [animation-delay:240ms]">
                        ●
                      </span>
                    </span>
                  )}
                </div>
              </div>
            ))}

            {messages.length <= 1 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    disabled={pending}
                    className="rounded-full border border-[#032842]/10 bg-white px-3 py-1.5 text-left text-[11px] font-medium text-[#032842]/75 transition-colors hover:border-[#EDB254]/50 hover:text-[#032842]"
                    onClick={() => void sendMessage(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="border-t border-[#032842]/8 bg-white p-3">
            {error ? (
              <p className="mb-2 text-[11px] text-red-600" role="alert">
                {error}
              </p>
            ) : null}
            <form
              className="flex items-end gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                void sendMessage(input);
              }}
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                disabled={pending}
                placeholder="Ask about providers or management…"
                className="max-h-28 min-h-10 flex-1 resize-none rounded-xl border border-[#032842]/12 bg-[#F7F9FB] px-3 py-2.5 text-sm text-[#032842] outline-none placeholder:text-[#032842]/40 focus:border-[#EDB254] focus:ring-2 focus:ring-[#EDB254]/20"
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage(input);
                  }
                }}
              />
              <button
                type="submit"
                disabled={pending || !input.trim()}
                aria-label="Send message"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDB254] text-[#032842] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat"}
        className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#022848] text-white shadow-[0_16px_40px_rgba(2,40,72,0.35)] transition-transform hover:scale-[1.03]"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>
    </div>
  );
}
