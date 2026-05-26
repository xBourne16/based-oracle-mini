const ROOT_URL = "https://mini.basedoracle.space";

/**
 * MiniApp configuration object.
 * @see https://docs.base.org/mini-apps/features/manifest
 */
export const minikitConfig = {
  baseBuilder: {
    ownerAddress: "",
  },

  miniapp: {
    version: "1",

    name: "based-oracle-mini",
    subtitle: "Daily oracle on Base",

    description:
      "Reveal your fate with Based Oracle.",

    screenshotUrls: [
      `${ROOT_URL}/screenshot.png?v=4`,
    ],

    // NEW ICON
    iconUrl: `${ROOT_URL}/oracle-logo.png?v=4`,

    // SPLASH
    splashImageUrl: `${ROOT_URL}/splash.png?v=4`,
    splashBackgroundColor: "#000000",

    // APP URLS
    homeUrl: `${ROOT_URL}/?mini=1`,
    webhookUrl: `${ROOT_URL}/api/webhook`,

    // CATEGORY
    primaryCategory: "social",

    // TAGS
    tags: [
      "base",
      "oracle",
      "prophecy",
      "daily",
      "onchain",
    ],

    // HERO / OG
    heroImageUrl: `${ROOT_URL}/hero.png?v=4`,

    tagline: "Reveal your fate.",

    ogTitle: "Based Oracle",
    ogDescription:
      "Daily prophecies powered by Base.",

    ogImageUrl: `${ROOT_URL}/hero.png?v=4`,
  },
} as const;