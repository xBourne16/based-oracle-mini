import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

const publicClient = createPublicClient({
  chain: base,
  transport: http("https://mainnet.base.org"),
});

export async function GET(request: NextRequest) {
  const txHash = request.headers.get("X-PAYMENT");

  if (!txHash) {
    return NextResponse.json({ error: "Payment required" }, { status: 402 });
  }

  const receipt = await publicClient.getTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  if (!receipt || receipt.status !== "success") {
    return NextResponse.json({ error: "Invalid payment" }, { status: 402 });
  }

  return NextResponse.json({
    success: true,
    paid: true,
    title: "🔮 Based Oracle x402 Transmission",
    message: "Bu premium içerik x402 ile açıldı.",
    network: "Base Mainnet",
    timestamp: new Date().toISOString(),
  });
}