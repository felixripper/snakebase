import { NextResponse } from 'next/server';
import { minikitConfig } from "../../../minikit.config";

export const dynamic = 'force-static';
export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
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

    return NextResponse.json(manifest, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    });
  } catch (error) {
    console.error('Manifest generation error:', error);
    return NextResponse.json(
      { error: 'Manifest generation failed' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
