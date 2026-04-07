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
            const response = await fetch(
                `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${encodeURIComponent(city)}&aqi=no`
            );
            const data = await response.json();
            return {
                city: data.location.name,
                country: data.location.country,
                temperature: data.current.temp_c,
                feelsLike: data.current.feelslike_c,
                condition: data.current.condition.text,
                humidity: data.current.humidity,
                windKph: data.current.wind_kph,
            };
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
                    content: "You are a helpful weather assistant.Response using Myanmar language"
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
