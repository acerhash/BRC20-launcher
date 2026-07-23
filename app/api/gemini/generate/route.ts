import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Ensure Gemini API client is initialized server-side using lazy pattern to avoid crashing if key is missing.
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, ticker, maxSupply, mintLimit, concept, customSlogan } = body;
    const ai = getAiClient();

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "analyze") {
      systemPrompt = `You are an elite, witty onchain crypto researcher and meme-economy quantitative analyst.
Analyze the user's proposed BRC-20 token on the Base chain and return a structured JSON response.
Do NOT include markdown formatting or backticks around the JSON. Return raw, clean JSON ONLY.

JSON Schema should be:
{
  "ticker": "string (uppercase 4-5 chars)",
  "memeScore": "number (0-100)",
  "memeAnalysis": "string (witty 2-sentence critique)",
  "onchainScore": "number (0-100)",
  "onchainViability": "string (2-sentence utility/distribution feedback)",
  "suggestedSlogans": ["string", "string", "string"],
  "aiRecommendedPriceFloor": "string (creative micro-ETH target, e.g. 0.00004 ETH)",
  "bullishScenario": "string (1-sentence funny moon scenario)",
  "bearishScenario": "string (1-sentence funny rug/dump scenario)"
}`;

      userPrompt = `Please analyze this token:
Ticker: ${ticker}
Max Supply: ${maxSupply}
Mint Limit per Transaction: ${mintLimit}
Concept Description: ${concept || "A pure fair-launch meme token on Base Chain."}
${customSlogan ? `Custom Slogan: "${customSlogan}"` : ""}`;

    } else if (action === "suggest") {
      systemPrompt = `You are a high-speed AI ticker generator and meme architect on the Base chain.
Based on the user's concept prompt, generate 3 unique BRC-20 style token proposals.
Do NOT include markdown formatting or backticks around the JSON. Return raw, clean JSON ONLY.

JSON Schema should be:
{
  "proposals": [
    {
      "ticker": "string (uppercase 4-5 chars, e.g., GIGA, BASE, SLOW)",
      "name": "string (token name, e.g., GigaChad Base, SlowMint)",
      "maxSupply": "number (e.g. 21000000, 1000000000)",
      "mintLimit": "number (e.g. 1000, 5000)",
      "tagline": "string (funny, viral tagline)",
      "concept": "string (short description of the meme or utility)"
    }
  ]
}`;

      userPrompt = `Generate BRC-20 token ideas based on this theme/concept: "${concept || "hyper-optimized Base memecoin"}"`;
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Use standard flash model
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\nUser request:\n${userPrompt}` }] }
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    }
    let data;
    try {
      data = JSON.parse(cleanedText);
    } catch {
      data = { error: "Failed to parse AI response as JSON", rawText: responseText };
    }
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate AI insights", 
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}
