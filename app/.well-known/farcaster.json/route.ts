import { NextResponse } from "next/server";

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL || "https://brc20-explorer.app";
  return NextResponse.json({
    accountAssociation: {
      header: "",
      payload: "",
      signature: ""
    },
    miniapp: {
      version: "1",
      name: "BRC-20 Explorer & Ledger",
      homeUrl: URL,
      iconUrl: `${URL}/icon.png`,
      splashImageUrl: `${URL}/splash.png`,
      splashBackgroundColor: "#020617",
      webhookUrl: `${URL}/api/webhook`,
      subtitle: "BRC-20 & Base B20 Explorer",
      description: "Explore, index, and manage BRC-20 ordinal inscriptions, Base B20 tokens, and order reconciliations.",
      primaryCategory: "finance",
      tags: ["brc20", "bitcoin", "ordinals", "baseapp", "miniapp", "farcaster"],
      heroImageUrl: `${URL}/hero.png`,
      tagline: "Index BRC-20 & B20 Instantly",
      ogTitle: "BRC-20 Explorer & Ledger",
      ogDescription: "Track BRC-20 inscriptions and Base B20 payment reconciliations on Base.",
      ogImageUrl: `${URL}/hero.png`,
      noindex: false
    }
  });
}
