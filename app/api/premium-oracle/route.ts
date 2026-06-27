import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "x402-next";

const handler = async (_request: NextRequest) => {
  return NextResponse.json({
    success: true,
    paid: true,
    title: "🔮 Based Oracle x402 Transmission",
    message: "This premium response was unlocked with x402 on Base.",
    network: "Base Mainnet",
    timestamp: new Date().toISOString(),
  });
};

export const GET = withX402(
  handler,
  "0x602628CaDb00F0c466aF885b854c37984b5A8356",
  {
    price: "$0.001",
    network: "base",
    config: {
      description: "Based Oracle premium x402 reading",
    },
  }
);