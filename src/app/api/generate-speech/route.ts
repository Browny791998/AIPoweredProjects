export async function POST(req: Request) {
    try {
        const { text, voice = "en-US-Neural2-F" } = await req.json();

        if (!text) {
            return Response.json({ error: "Text is required" }, { status: 400 });
        }

        const response = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    input: { text },
                    voice: { languageCode: "en-US", name: voice },
                    audioConfig: { audioEncoding: "MP3" },
                }),
            }
        );

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || "Failed to generate speech");
        }

        const data = await response.json();

        return Response.json({
            success: true,
            audio: data.audioContent,
            contentType: "audio/mp3",
        });
    } catch (error: any) {
        console.error("Speech generation error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
