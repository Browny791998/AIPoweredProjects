import { convertToModelMessages, streamText, UIMessage } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
    try {
        const { messages }: { messages: UIMessage[] } = await req.json();

        const result = await streamText({
            model: google("gemini-3-flash-preview"),
            messages: [

                {
                    role: "system",
                    content: "You are a helpful coding assistant.Keep responsed under 3 sentencees and focus on practical examples,explain using Myanmar language"
                },
                ...await convertToModelMessages(messages),
            ],
        });

        return result.toUIMessageStreamResponse();
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
