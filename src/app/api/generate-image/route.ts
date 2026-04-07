export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return Response.json({ error: "Prompt is required" }, { status: 400 });
        }

        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err);
        }

        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");

        return Response.json({ success: true, image: base64, prompt });
    } catch (error: unknown) {
        console.error("Image generation error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to generate image";
        return Response.json({ error: errorMessage }, { status: 500 });
    }
}
