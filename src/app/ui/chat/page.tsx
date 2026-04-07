"use client"

import { useState } from "react"
import { UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";

export default function ChatPage() {
    const [input, setInput] = useState("");
    const { messages, sendMessage, isLoading, error, status } = useChat();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await sendMessage({ text: input });
        setInput("");
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

                    {messages.map((message: any) => (
                        <div key={message.id} className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} gap-1`}>
                            <span className="text-xs text-slate-400 dark:text-zinc-500 px-1">
                                {message.role === "user" ? "You" : "AI"}
                            </span>
                            <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} gap-3 w-full`}>
                            {message.role !== "user" && (
                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md mt-1">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V8a1 1 0 0 1 1-1zm0 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" /></svg>
                                </div>
                            )}
                            <div className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-sm transition-all duration-200 ${
                                message.role === "user"
                                    ? "bg-blue-600 text-white rounded-tr-none hover:shadow-md"
                                    : "bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-tl-none text-slate-700 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600"
                            }`}>
                                {message.parts?.map((part: any, index: number) => {
                                    switch (part.type) {
                                        case "text":
                                            return (
                                                <div
                                                    key={`${message.id}-${index}`}
                                                    className="whitespace-pre-wrap leading-relaxed"
                                                >
                                                    {part.text}
                                                </div>
                                            );
                                        default:
                                            return null;
                                    }
                                }) || (
                                    <div className="whitespace-pre-wrap leading-relaxed">
                                        {message.text || message.content}
                                    </div>
                                )}
                            </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Box - Fixed at bottom */}
            <div className="sticky bottom-0 w-full p-4 md:p-8 bg-linear-to-t from-slate-100 via-slate-100 to-transparent dark:from-black dark:via-black dark:to-transparent">
                <div className="max-w-3xl mx-auto">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-1">
                            {error.message}
                        </div>
                    )}
                    {(status === "submitted" || status === "streaming") && (
                        <div className="flex items-center gap-2 mb-4 px-2 tracking-wide font-medium text-slate-500 dark:text-zinc-400 text-xs animate-pulse">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            AI is thinking ...
                        </div>
                    )}

                    <form className="relative group" onSubmit={handleSubmit}>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="How can I help you?"
                                type="text"
                                id="prompt"
                                name="prompt"
                                className="flex h-14 w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl px-4 pr-16 py-4 text-base ring-offset-white placeholder:text-slate-500 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all dark:ring-offset-zinc-950 dark:placeholder:text-zinc-500 shadow-lg group-hover:shadow-xl dark:text-white"
                            />
                            <button
                                type="submit"
                                disabled={status !== "ready"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-lg dark:from-blue-600 dark:to-indigo-700"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 12l18-10v20L3 12zm5-7.268v14.536L16.975 12 8 7.268z" /></svg>
                            </button>
                        </form>
                </div>
            </div>
        </div>
    );
}