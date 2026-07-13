import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "AI backend is not configured." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const agentId = String(body.agentId || "unknown").slice(0, 80);
    const messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter(
        (message: ChatMessage) =>
          (message?.role === "user" || message?.role === "assistant") &&
          typeof message?.content === "string"
      )
      .slice(-10)
      .map((message: ChatMessage) => ({
        role: message.role,
        content: message.content.slice(0, 1200),
      }));

    if (!messages.length) {
      return NextResponse.json(
        { error: "A message is required." },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        instructions:
          `You are Base Oracle Agent #${agentId}, an ERC-8004 agent on Base. ` +
          "Give concise, imaginative but responsible guidance. Never promise profits, " +
          "predict guaranteed financial outcomes, or request private keys or seed phrases. " +
          "Clearly label entertainment-style prophecies as non-financial advice.",
        input: messages,
        max_output_tokens: 350,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data?.error?.message || response.status);
      return NextResponse.json(
        { error: "The agent could not answer right now." },
        { status: 502 }
      );
    }

    const reply = (data.output || [])
      .flatMap((item: { content?: Array<{ type?: string; text?: string }> }) =>
        item.content || []
      )
      .filter((item: { type?: string }) => item.type === "output_text")
      .map((item: { text?: string }) => item.text || "")
      .join("\n")
      .trim();

    return NextResponse.json({
      reply: reply || "The oracle is silent. Ask again.",
    });
  } catch (error) {
    console.error("Agent chat error:", error);
    return NextResponse.json(
      { error: "Invalid agent request." },
      { status: 400 }
    );
  }
}
