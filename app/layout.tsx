import type { Metadata, Viewport } from "next";
import { minikitConfig } from "@/minikit.config";
import { RootProvider } from "./rootProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Based Oracle",
    description:
      "Decrypt your fate on Base. Oracle-powered onchain prophecy experience.",

    icons: {
      icon: "/favicon.ico",
    },

    openGraph: {
      title: "Based Oracle",
      description:
        "Decrypt your fate on Base. Oracle-powered onchain prophecy experience.",
      url: "https://mini.basedoracle.space",
      siteName: "Based Oracle",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Based Oracle",
        },
      ],
      locale: "en_US",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: "Based Oracle",
      description:
        "Decrypt your fate on Base. Oracle-powered onchain prophecy experience.",
      images: ["/og-image.png"],
    },

    other: {
      "fc:miniapp": JSON.stringify({
        version: minikitConfig.miniapp.version,
        imageUrl: minikitConfig.miniapp.heroImageUrl,
        button: {
          title: `Launch ${minikitConfig.miniapp.name}`,
          action: {
            name: `Launch ${minikitConfig.miniapp.name}`,
            type: "launch_miniapp",
          },
        },
      }),
    },
  };
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
<body
  suppressHydrationWarning={true}
  style={{ touchAction: "auto" }}
>
  <RootProvider>
    {children}
  </RootProvider>
</body>
    </html>
  );
}