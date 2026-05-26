import { withValidManifest } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "../../../minikit.config";

export async function GET() {
  const manifest = withValidManifest(minikitConfig);

  return Response.json({
    ...manifest,
    accountAssociation: {
      header:
        "eyJmaWQiOjI5NDM4MCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDBiMzBDZUUxMEIwMDc5YmY5OWQ0OGVFZjIzOGYyMGRiNjJhNDFhOTUifQ",
      payload:
        "eyJkb21haW4iOiJtaW5pLmJhc2Vkb3JhY2xlLnNwYWNlIn0",
      signature:
        "lRBHzAEqtosD0kZOF822Vb6sjD906h1Z6qHp3BhuO5IFkWSlejTlDNPNJz0wrRdpjkp6dFFV2O0VrOAxCNsSnRw=",
    },
  });
}