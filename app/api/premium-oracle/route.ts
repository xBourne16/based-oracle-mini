import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "x402-next";

const handler = async (_request: NextRequest) => {
  return NextResponse.json({
    success: true,
    message: "🔮 Premium Oracle unlocked via x402 on Base.",
    prophecy:
      "The chain remembers those who arrive before the crowd.",
    network: "Base Mainnet",
    paid: true,
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