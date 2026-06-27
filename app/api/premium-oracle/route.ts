import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Premium Oracle endpoint active.",
    prophecy: "The chain remembers those who arrive before the crowd.",
    network: "Base Mainnet",
  });
}