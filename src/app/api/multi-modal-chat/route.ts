import { convertToModelMessages, streamText, UIMessage } from "ai";
import { google } from "@ai-sdk/google";

function dataUrlToBase64Part(dataUrl: string) {
    const [header, base64] = dataUrl.split(",");
    const mimeType = header.replace("data:", "").replace(";base64", "");
    return { data: Buffer.from(base64, "base64"), mimeType };
}

// Pre-process UIMessages: replace data: URLs with base64 buffers in file parts
function preprocessMessages(messages: UIMessage[]): UIMessage[] {
    return messages.map((msg) => ({
        ...msg,
        parts: msg.parts?.map((part: any) => {
            if (part.type === "file" && typeof part.url === "string" && part.url.startsWith("data:")) {
                const { data, mimeType } = dataUrlToBase64Part(part.url);
                return { ...part, url: data, mediaType: mimeType };
            }
            return part;
        }),
    }));
}

export async function POST(req: Request) {
    try {
        const { messages }: { messages: UIMessage[] } = await req.json();

        const result = await streamText({
            model: google("gemini-2.5-flash"),
            messages: await convertToModelMessages(preprocessMessages(messages)),
        });

        return result.toUIMessageStreamResponse();
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
