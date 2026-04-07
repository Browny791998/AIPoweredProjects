import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();
        const result = await streamText({
            model: google("gemini-3-flash-preview"),
            prompt,
        });

        result.usage.then((usage) => {
            console.log({
                inputTokens: usage.inputTokens,
                outputTokens: usage.outputTokens,
                totalTokens: usage.totalTokens,
            });
        });

        return result.toUIMessageStreamResponse();
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}