import { minikitConfig } from "../../../minikit.config";

export async function GET() {
  try {
    // Return manifest directly without validation wrapper
    const manifest = {
      accountAssociation: minikitConfig.accountAssociation,
      frame: {
        version: minikitConfig.miniapp.version,
        name: minikitConfig.miniapp.name,
        iconUrl: minikitConfig.miniapp.iconUrl,
        homeUrl: minikitConfig.miniapp.homeUrl,
        imageUrl: minikitConfig.miniapp.splashImageUrl,
        buttonTitle: "Play",
        splashImageUrl: minikitConfig.miniapp.splashImageUrl,
        splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
        webhookUrl: minikitConfig.miniapp.webhookUrl,
      },
      ...(minikitConfig.baseBuilder ? { baseBuilder: minikitConfig.baseBuilder } : {}),
    };

    return Response.json(manifest, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    console.error('Manifest error:', error);
    return Response.json(
      { error: 'Failed to generate manifest' },
      { status: 500 }
    );
  }
}
