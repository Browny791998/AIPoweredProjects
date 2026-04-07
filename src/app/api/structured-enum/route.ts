import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();
        const { object } = await generateObject({
            model: google("gemini-3-flash-preview"),
            output: "enum",
            enum: ["positive", "negative", "neutral"],
            prompt: `Classify the sentiment of the following text: ${text}`,
        });
        return Response.json({ value: object });
    } catch (error) {
        console.error("Error generating pokemon:", error);
        return new Response("Failed to generate pokemon", { status: 500 });
    }
}