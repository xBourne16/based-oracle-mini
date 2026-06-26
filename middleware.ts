import { paymentMiddleware } from "x402-next";

const x402Middleware = paymentMiddleware(
  "0x602628CaDb00F0c466aF885b854c37984b5A8356",
  {
    "/api/premium-oracle": {
      price: "$0.001",
      network: "base",
      config: {
        description: "Based Oracle premium x402 reading",
      },
    },
  }
);

export default x402Middleware;

export const config = {
  matcher: ["/api/premium-oracle"],
};