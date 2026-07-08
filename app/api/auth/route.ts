import { Errors, createClient } from "@farcaster/quick-auth";
import { NextRequest, NextResponse } from "next/server";

const client = createClient();

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("Authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Missing token" },
      { status: 401 }
    );
  }

  try {
    const payload = await client.verifyJwt({
      token: authorization.split(" ")[1] as string,
      domain: getUrlHost(request),
    });

    return NextResponse.json({
      userFid: payload.sub,
    });
  } catch (error) {
    if (error instanceof Errors.InvalidTokenError) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Unknown error" },
      { status: 500 }
    );
  }
}

function getUrlHost(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (origin) {
    try {
      return new URL(origin).host;
    } catch {
      console.warn("Invalid origin header:", origin);
    }
  }

  const host = request.headers.get("host");

  if (host) {
    return host;
  }

  let urlValue = "http://localhost:3000";

  if (process.env.VERCEL_ENV === "production") {
    urlValue =
      process.env.NEXT_PUBLIC_URL ||
      "https://mini.basedoracle.space";
  } else if (process.env.VERCEL_URL) {
    urlValue = `https://${process.env.VERCEL_URL}`;
  }

  return new URL(urlValue).host;
}