const ROOT_URL = "https://mini.basedoracle.space";

/**
 * MiniApp configuration object. Must follow the mini app manifest specification.
 *
 * @see {@link https://docs.base.org/mini-apps/features/manifest}
 */
export const minikitConfig = {
  baseBuilder: {
    ownerAddress: "",
  },

  miniapp: {
    version: "1",
    name: "based-oracle-mini",
    subtitle: "Daily oracle on Base",
    description: "Reveal your fate with Based Oracle.",
    screenshotUrls: [`${ROOT_URL}/screenshot.png`],

    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#000000",

    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,

    primaryCategory: "social",

    tags: ["base", "oracle", "prophecy", "daily"],

    heroImageUrl: `${ROOT_URL}/hero.png`,

    tagline: "Reveal your fate.",

    ogTitle: "Based Oracle",
    ogDescription: "Daily prophecies powered by Base.",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;