"use client"

import { useState } from "react"
import Image from "next/image"

export default function ImageGenerationPage() {
    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [generatedImage, setGeneratedImage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [lastPrompt, setLastPrompt] = useState("")

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!prompt.trim()) {
            setError("Please enter a prompt")
            return
        }

        setLoading(true)
        setError(null)
        setGeneratedImage(null)
        setLastPrompt(prompt)

        try {
            const response = await fetch("/api/generate-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate image")
            }

            if (data.success && data.image) {
                setGeneratedImage(`data:image/jpeg;base64,${data.image}`)
            } else {
                throw new Error("No image was generated")
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred while generating the image")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-linear-to-b from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-black">
            <div className="flex-1 overflow-auto p-4 md:p-8 flex flex-col items-center justify-center">
                <div className="w-full max-w-2xl space-y-6">
                    <div className="text-center space-y-2 mb-12">
                        <h1 className="text-4xl font-bold tracking-tight dark:text-zinc-100 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            AI Image Generator
                        </h1>
                        <p className="text-slate-500 dark:text-zinc-400">Create stunning images with AI</p>
                    </div>

                    <form onSubmit={handleGenerate} className="space-y-4">
                        <div className="relative group">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe the image you want to generate..."
                                className="w-full min-h-[120px] rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl px-4 py-3 text-base ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all dark:ring-offset-zinc-950 dark:placeholder:text-zinc-500 shadow-lg group-hover:shadow-xl dark:text-white resize-none"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !prompt.trim()}
                                className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-pink-600 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-lg"
                            >
                                {loading ? (
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}

                    {loading && (
                        <div className="space-y-4 animate-in fade-in duration-500">
                            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200 dark:border-zinc-800 overflow-hidden">
                                <div className="aspect-square relative bg-slate-100 dark:bg-zinc-800 animate-pulse flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-purple-500 animate-bounce" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">Crafting your masterpiece...</p>
                                            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 italic">&quot; {lastPrompt} &quot;</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/50">
                                    <div className="h-8 bg-slate-200 dark:bg-zinc-700 rounded-lg w-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {generatedImage && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-500">
                            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200 dark:border-zinc-800 overflow-hidden">
                                <div className="aspect-square relative">
                                    <Image
                                        src={generatedImage}
                                        alt="Generated image"
                                        width={1024}
                                        height={1024}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-slate-600 dark:text-zinc-400 truncate flex-1 mr-4 italic">
                                            &quot;{lastPrompt}&quot;
                                        </p>
                                        <button
                                            onClick={() => {
                                                const link = document.createElement('a')
                                                link.href = generatedImage
                                                link.download = 'generated-image.png'
                                                link.click()
                                            }}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
