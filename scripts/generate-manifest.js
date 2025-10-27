const fs = require('fs');
const path = require('path');

const ROOT_URL = process.env.NEXT_PUBLIC_URL || 'https://snakebase.vercel.app';

const manifest = {
  accountAssociation: {
    "header": "eyJmaWQiOjQ0MTYxMywidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEFBODFmMGY0OTVCOEIyRDJCNEY1OEM4NTNBOGM3MzExZjAxYzFFNUMifQ",
    "payload": "eyJkb21haW4iOiJzbmFrZWJhc2UudmVyY2VsLmFwcCJ9",
    "signature": "phvP5vda301efC+3JII4QcWFdQBnr4NMJNZX4nOsnuI2G+wX8SQYvnMYI+J8+DFMl/EZq7xG0nGUdc2M1EEBCRw="
  },
  frame: {
    version: "1",
    name: "Snake",
    iconUrl: `${ROOT_URL}/blue-icon.png`,
    homeUrl: ROOT_URL,
    imageUrl: `${ROOT_URL}/blue-hero.png`,
    buttonTitle: "Play",
    splashImageUrl: `${ROOT_URL}/blue-hero.png`,
    splashBackgroundColor: "#000000",
    webhookUrl: `${ROOT_URL}/api/webhook`,
  },
  baseBuilder: {
    ownerAddress: "0x4caA73f2D477B38795e8b6f9A7FB4ed493882684",
  },
};

const publicDir = path.join(__dirname, '..', 'public');
const wellKnownDir = path.join(publicDir, '.well-known');

// Create .well-known directory if it doesn't exist
if (!fs.existsSync(wellKnownDir)) {
  fs.mkdirSync(wellKnownDir, { recursive: true });
}

// Write manifest file
fs.writeFileSync(
  path.join(wellKnownDir, 'farcaster.json'),
  JSON.stringify(manifest, null, 2)
);

console.log('✅ Farcaster manifest generated at public/.well-known/farcaster.json');
