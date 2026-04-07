import { streamObject } from "ai";
import { google } from "@ai-sdk/google";
import { recipeSchema } from "./schema";

export async function POST(req: Request) {
    try {
        const { dish } = await req.json();
        const result = await streamObject({
            model: google("gemini-3-flash-preview"),
            schema: recipeSchema,
            prompt: `Generate a recipe for ${dish}`,
        });

        return result.toTextStreamResponse();
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}