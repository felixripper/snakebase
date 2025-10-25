const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
   "header": "eyJmaWQiOjQ0MTYxMywidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEFBODFmMGY0OTVCOEIyRDJCNEY1OEM4NTNBOGM3MzExZjAxYzFFNUMifQ",
    "payload": "eyJkb21haW4iOiJzbmFrZWJhc2UudmVyY2VsLmFwcCJ9",
    "signature": "phvP5vda301efC+3JII4QcWFdQBnr4NMJNZX4nOsnuI2G+wX8SQYvnMYI+J8+DFMl/EZq7xG0nGUdc2M1EEBCRw="
  },
  miniapp: {
    version: "1",
    name: "Cubey",
    subtitle: "Your AI Ad Companion",
    description: "Ads",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/blue-icon.png`,
    splashImageUrl: `${ROOT_URL}/blue-hero.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "games",
    tags: ["game", "base", "miniapp", "neynar"],
    heroImageUrl: `${ROOT_URL}/blue-hero.png`, 
    tagline: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: `${ROOT_URL}/blue-hero.png`,
  },
  baseBuilder: {
    ownerAddress: "0x4caA73f2D477B38795e8b6f9A7FB4ed493882684",
  },
} as const;

