import { withValidManifest } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "../../../minikit.config";

export async function GET() {
  const manifest = withValidManifest(minikitConfig);
  const baseBuilder = minikitConfig.baseBuilder;

  return Response.json({
    ...manifest,
    ...(baseBuilder ? { baseBuilder } : {}),
  });
}
