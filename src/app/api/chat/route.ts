import { NextResponse } from "next/server";

import { NGARIS_CHAT_SYSTEM_PROMPT } from "@/lib/chat/system-prompt";
import { CHAT_MODEL, getOpenAIClient } from "@/lib/openai";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { chatRequestSchema } from "@/lib/validations/chat";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`chat:${ip}`, 30, 15 * 60 * 1000);

  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many messages. Please try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(1, Math.ceil((limited.resetAt - Date.now()) / 1000)),
          ),
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const last = parsed.data.messages.at(-1);
  if (!last || last.role !== "user") {
    return NextResponse.json(
      { error: "The latest message must come from the user." },
      { status: 400 },
    );
  }

  try {
    const openai = getOpenAIClient();
    const stream = await openai.chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0.5,
      max_tokens: 500,
      stream: true,
      messages: [
        { role: "system", content: NGARIS_CHAT_SYSTEM_PROMPT },
        ...parsed.data.messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          console.error("[api/chat] stream failed", error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[api/chat] failed", error);

    const missingKey =
      error instanceof Error && error.message.includes("OPENAI_API_KEY");

    return NextResponse.json(
      {
        error: missingKey
          ? "Chat is temporarily unavailable."
          : "Unable to reply right now. Please try again.",
      },
      { status: missingKey ? 503 : 502 },
    );
  }
}
