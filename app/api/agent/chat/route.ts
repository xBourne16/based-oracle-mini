import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;

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

    const systemPrompt =
      `You are Base Oracle Agent #${agentId}, an ERC-8004 agent on Base. ` +
      "Reply in the same language as the user. Give concise, imaginative but " +
      "responsible guidance. Never promise profits, predict guaranteed financial " +
      "outcomes, or request private keys or seed phrases. Clearly label " +
      "entertainment-style prophecies as non-financial advice.";

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: systemPrompt }, ...messages],
          max_completion_tokens: 350,
          temperature: 0.8,
        }),
        signal: AbortSignal.timeout(20_000),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", data?.error?.message || response.status);
      return NextResponse.json(
        {
          error:
            response.status === 429
              ? "The free AI limit is busy. Please try again shortly."
              : "The agent could not answer right now.",
        },
        { status: response.status === 429 ? 429 : 502 }
      );
    }

    const reply = String(data?.choices?.[0]?.message?.content || "").trim();

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
