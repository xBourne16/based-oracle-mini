import type { Metadata, Viewport } from "next";
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
      url: "https://mini.basedoracle.space/share-bg.png",
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
  images: [
    "https://mini.basedoracle.space/share-bg.png",
  ],
},
other: {
  "fc:miniapp": JSON.stringify({
    version: "1",
    imageUrl: "https://mini.basedoracle.space/share-bg.png?v=1001",
    button: {
      title: "Launch Based Oracle",
      action: {
        type: "launch_miniapp",
        name: "Based Oracle",
        url: "https://mini.basedoracle.space/?mini=1&v=1001",
        splashImageUrl: "https://mini.basedoracle.space/splash.png?v=1001",
        splashBackgroundColor: "#000000",
      },
    },
  }),
  "fc:frame": JSON.stringify({
    version: "1",
    imageUrl: "https://mini.basedoracle.space/share-bg.png?v=1001",
    button: {
      title: "Launch Based Oracle",
      action: {
        type: "launch_miniapp",
        name: "Based Oracle",
        url: "https://mini.basedoracle.space/?mini=1&v=1001",
        splashImageUrl: "https://mini.basedoracle.space/splash.png?v=1001",
        splashBackgroundColor: "#000000",
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