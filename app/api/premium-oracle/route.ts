import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http, parseUnits } from "viem";
import { base } from "viem/chains";

const publicClient = createPublicClient({
  chain: base,
  transport: http("https://mainnet.base.org"),
});

const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const RECEIVER = "0x602628CaDb00F0c466aF885b854c37984b5A8356";
const REQUIRED_AMOUNT = parseUnits("0.001", 6);

const USDC_TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

const premiumMessages = [
  "The chain does not forget. Neither should you.",
  "Your wallet is your identity. Guard it like your soul.",
  "The next cycle belongs to those who held when others fled.",
  "Consensus is not agreement — it is survival.",
  "You arrived early. That is the only edge that matters.",
  "The oracle sees what the market cannot: your conviction.",
  "Blocks pass. Diamonds remain.",
  "Not your keys, not your fate.",
  "The ones who built in silence will speak in all-time highs.",
  "Every transaction is a prayer to the network.",
];

export async function GET(request: NextRequest) {
  const txHash = request.headers.get("X-PAYMENT");

  if (!txHash) {
    return NextResponse.json({ error: "Payment required" }, { status: 402 });
  }

  try {
    const receipt = await publicClient.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

    if (!receipt || receipt.status !== "success") {
      return NextResponse.json({ error: "Transaction failed" }, { status: 402 });
    }

    const transferLog = receipt.logs.find((log) => {
      const isUSDC = log.address.toLowerCase() === USDC_BASE.toLowerCase();
      const isTransfer = log.topics[0] === USDC_TRANSFER_TOPIC;
      const isToReceiver =
        log.topics[2]?.toLowerCase() ===
        `0x000000000000000000000000${RECEIVER.slice(2).toLowerCase()}`;
      return isUSDC && isTransfer && isToReceiver;
    });

    if (!transferLog) {
      return NextResponse.json({ error: "No valid USDC transfer found" }, { status: 402 });
    }

    const transferredAmount = BigInt(transferLog.data);
    if (transferredAmount < REQUIRED_AMOUNT) {
      return NextResponse.json({ error: "Insufficient payment amount" }, { status: 402 });
    }

    // TX hash'e göre her seferinde farklı mesaj seç
    const index = parseInt(txHash.slice(-4), 16) % premiumMessages.length;
    const message = premiumMessages[index];

    return NextResponse.json({
      success: true,
      paid: true,
      title: "🔮 Premium Oracle Transmission",
      message,
      network: "Base Mainnet",
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error("TX verification error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}