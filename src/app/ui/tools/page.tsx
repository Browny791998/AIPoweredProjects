"use client"

import { useState } from "react"
import { UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Chatmessage } from "../../api/tools/route";

const WeatherIcon = ({ condition }: { condition: string }) => {
    switch (condition.toLowerCase()) {
        case 'sunny':
            return (
                <svg className="w-10 h-10 text-yellow-500 animate-spin-slow" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5" />
                    <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
            );
        case 'cloudy':
            return (
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
            );
        case 'rainy':
            return (
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 13a4 4 0 01-8 0 4 4 0 00-4-4V5a2 2 0 012-2h10a2 2 0 012 2v4a4 4 0 00-4 4z" />
                    <path strokeLinecap="round" d="M12 18v.01M12 22v.01M8 20v.01M16 20v.01" />
                </svg>
            );
        default:
            return (
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
                </svg>
            );
    }
};

export default function ToolsPage() {
    const [input, setInput] = useState("");
    const { messages, sendMessage, error, status } = useChat<Chatmessage>({
        transport: new DefaultChatTransport({
            api: "/api/tools",
        })
    });

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
                                <div className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-sm transition-all duration-200 ${message.role === "user"
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
                                            case "tool-getWeather":
                                                return (
                                                    <div key={`${message.id}-${index}`} className="my-2 rounded-2xl overflow-hidden border border-slate-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-xl max-w-sm animate-in fade-in zoom-in-95 duration-300">
                                                        {part.state === "input-streaming" || part.state === "input-available" ? (
                                                            <div className="flex items-center gap-4 p-5">
                                                                <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                                                    <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">Checking Weather</span>
                                                                    <span className="text-xs text-slate-500 dark:text-zinc-400">Fetching data for {part.input?.city}...</span>
                                                                </div>
                                                            </div>
                                                        ) : part.state === "output-available" ? (
                                                            <div className="relative">
                                                                <div className="absolute top-0 right-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl"></div>
                                                                
                                                                <div className="flex items-center gap-5 p-6">
                                                                    <div className="shrink-0 p-3.5 bg-slate-50 dark:bg-zinc-700/50 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-600">
                                                                        <WeatherIcon condition={part.output.condition} />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 tracking-tight">{part.input.city}</h3>
                                                                        <div className="flex items-end gap-2.5 mt-1.5">
                                                                            <span className="text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">{part.output.temperature}</span>
                                                                            <div className="flex flex-col mb-0.5">
                                                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Condition</span>
                                                                                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{part.output.condition}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="px-6 py-3.5 bg-slate-50/50 dark:bg-zinc-900/30 border-t border-slate-100 dark:border-zinc-700 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                        Updated now
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 text-green-600 dark:text-green-400">
                                                                        <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse"></div>
                                                                        Verified
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : part.state === "output-error" ? (
                                                            <div className="p-5 flex items-center gap-4 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/10">
                                                                <div className="shrink-0 h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-bold uppercase tracking-wider opacity-70">Error</span>
                                                                    <span className="text-sm font-semibold">{part.errorText}</span>
                                                                </div>
                                                            </div>
                                                        ) : null}
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