"use client";
import { useState } from "react";

export default function CompletionPage() {
    const [prompt, setPrompt] = useState("");
    const [completion, setCompletion] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const complete = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setPrompt("");
        try {
            const response = await fetch("/api/completion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }
            setCompletion(data.text);
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Something went wrong");
            }
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex flex-col min-h-screen bg-linear-to-b from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-black">
            {/* Main Content / Messages Area */}
            <div className="flex-1 overflow-auto p-4 md:p-8 flex flex-col items-center justify-center">
                <div className="w-full max-w-3xl space-y-4">
                    <div className="text-center space-y-2 mb-12">
                        <h1 className="text-4xl font-bold tracking-tight dark:text-zinc-100 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI Assistant</h1>
                        <p className="text-slate-500 dark:text-zinc-400">Next-gen AI content generation</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm">{error}</div>
                    )}

                    {isLoading ? (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V8a1 1 0 0 1 1-1zm0 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
                            </div>
                            <div className="bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0ms]"></span>
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
                            </div>
                        </div>
                    ) : completion ? (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V8a1 1 0 0 1 1-1zm0 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
                            </div>
                            <div className="bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm text-slate-700 dark:text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">
                                {completion}
                            </div>
                        </div>
                    ) : (
                        <div className="mx-auto max-w-lg text-center p-8 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
                            <p className="text-slate-400 dark:text-zinc-500 text-sm italic">Enter your prompt below to get started</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Box - Fixed at bottom */}
            <div className="sticky bottom-0 w-full p-4 md:p-8 bg-linear-to-t from-slate-100 via-slate-100 to-transparent dark:from-black dark:via-black dark:to-transparent">
                <div className="max-w-3xl mx-auto">
                    <form className="relative group" onSubmit={complete}>
                        <input
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="How can I help you?"
                            type="text"
                            id="prompt"
                            name="prompt"
                            className="flex h-14 w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl px-4 pr-16 py-4 text-base ring-offset-white placeholder:text-slate-500 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all dark:ring-offset-zinc-950 dark:placeholder:text-zinc-500 shadow-lg group-hover:shadow-xl dark:text-white"
                        />
                        <button
                            disabled={isLoading}
                            type="submit"
                            title="Send Prompt"
                            className="absolute right-2 top-2 p-3 h-10 w-10 flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 z-10"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5"
                            >
                                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                            </svg>
                        </button>
                    </form>
                    <p className="mt-3 text-center text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-medium">
                        Powered by AI-SDK
                    </p>
                </div>
            </div>
        </div>
    );
}