import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();
        const { text } = await generateText({
            model: google("gemini-3-flash-preview"),
            prompt,
        });
        return Response.json({ text });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}