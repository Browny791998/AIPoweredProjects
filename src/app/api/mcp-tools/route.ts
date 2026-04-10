import {
    convertToModelMessages,
    streamText,
    tool,
    UIMessage,
    InferUITools,
    UIDataTypes,
    stepCountIs,
} from "ai";
import { experimental_createMCPClient as createMcpClient } from "@ai-sdk/mcp";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";
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

        const httpTransport = new StreamableHTTPClientTransport(
            new URL("https://app.mockmcp.com/servers/hf0fejlgfbJV/mcp"),
            {
                requestInit: {
                    headers: {
                        Authorization: `Bearer ${process.env.MCP_API_KEY}`,
                    }
                }
            }
        );

        const mcpClient = createMcpClient({
            transport: httpTransport,
        });

        const mcpTools = await (await mcpClient).tools();

        const result = await streamText({
            model: google("gemini-3-flash-preview"),
            messages: [

                {
                    role: "system",
                    content: "You are a helpful coding assistant.Keep responsed under 3 sentencees and focus on practical examples,explain using Myanmar language"
                },
                ...await convertToModelMessages(messages),
            ],
            tools: {
                ...mcpTools,
                ...tools,
            },
            stopWhen: stepCountIs(2),
            onFinish: async () => {
                await (await mcpClient).close();
            },
            onError: async (error) => {
                await (await mcpClient).close();
                console.error("Error during streaming", error);
            },
        });

        return result.toUIMessageStreamResponse();
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
