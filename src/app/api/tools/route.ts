import {
    convertToModelMessages,
    streamText,
    tool,
    UIMessage,
    InferUITools,
    UIDataTypes,
    stepCountIs

} from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const tools = {
    getWeather: tool({
        description: "Get the weather for a specific location",
        inputSchema: z.object({
            city: z.string().describe("The city to get the weather for"),
        }),
        execute: async ({ city }: { city: string }) => {
            if (city === "Yangon") {
                return {
                    city,
                    temperature: "25°C",
                    condition: "Sunny",
                };
            } else if (city === "Mandalay") {
                return {
                    city,
                    temperature: "28°C",
                    condition: "Cloudy",
                };
            }
            else if (city === "Mawlamyine") {
                return {
                    city,
                    temperature: "27°C",
                    condition: "Rainy",
                };
            }
            else {
                return {
                    city,
                    temperature: "Unknown",
                    condition: "Unknown",
                };
            }
        },
    }),
};

export type Tools = InferUITools<typeof tools>;
export type Chatmessage = UIMessage<never, UIDataTypes, Tools>;

export async function POST(req: Request) {
    try {
        const { messages }: { messages: Chatmessage[] } = await req.json();

        const result = await streamText({
            model: google("gemini-3-flash-preview"),
            messages: [

                {
                    role: "system",
                    content: "You are a helpful coding assistant.Keep responsed under 3 sentencees and focus on practical examples,explain using Myanmar language"
                },
                ...await convertToModelMessages(messages),
            ],
            tools,
            stopWhen: stepCountIs(2),
        });

        return result.toUIMessageStreamResponse();
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
