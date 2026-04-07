"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Chatmessage } from "../../api/api-tool/route"

const WeatherIcon = ({ condition }: { condition: string }) => {
    const c = condition.toLowerCase();
    if (c.includes("sun") || c.includes("clear")) return (
        <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" /><path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
    );
    if (c.includes("rain") || c.includes("drizzle")) return (
        <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            <path strokeLinecap="round" d="M8 19v2M12 21v2M16 19v2" />
        </svg>
    );
    if (c.includes("cloud") || c.includes("overcast")) return (
        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
    );
    if (c.includes("snow")) return (
        <svg className="w-10 h-10 text-blue-200" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M18.364 5.636L5.636 18.364" />
        </svg>
    );
    return (
        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
    );
};

export default function ApiToolPage() {
    const [input, setInput] = useState("");
    const { messages, sendMessage, error, status } = useChat<Chatmessage>({
        transport: new DefaultChatTransport({ api: "/api/api-tool" }),
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await sendMessage({ text: input });
        setInput("");
    };

    return (
        <div className="flex flex-col min-h-screen bg-linear-to-b from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-black">
            <div className="flex-1 overflow-auto p-4 md:p-8 flex flex-col items-center justify-center">
                <div className="w-full max-w-3xl space-y-4">
                    <div className="text-center space-y-2 mb-12">
                        <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
                            Weather Assistant
                        </h1>
                        <p className="text-slate-500 dark:text-zinc-400">Ask about weather anywhere in the world</p>
                    </div>

                    {messages.map((message: any) => (
                        <div key={message.id} className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} gap-1`}>
                            <span className="text-xs text-slate-400 dark:text-zinc-500 px-1">
                                {message.role === "user" ? "You" : "AI"}
                            </span>
                            <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} gap-3 w-full`}>
                                {message.role !== "user" && (
                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-sky-500 to-cyan-600 flex items-center justify-center shrink-0 shadow-md mt-1">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V8a1 1 0 0 1 1-1zm0 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" /></svg>
                                    </div>
                                )}
                                <div className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-sm transition-all duration-200 ${message.role === "user"
                                    ? "bg-sky-600 text-white rounded-tr-none"
                                    : "bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-tl-none text-slate-700 dark:text-zinc-200"
                                    }`}>
                                    {message.parts?.map((part: any, index: number) => {
                                        switch (part.type) {
                                            case "text":
                                                return (
                                                    <div key={`${message.id}-${index}`} className="whitespace-pre-wrap leading-relaxed">
                                                        {part.text}
                                                    </div>
                                                );
                                            case "tool-getWeather":
                                                return (
                                                    <div key={`${message.id}-${index}`} className="my-2 rounded-2xl overflow-hidden border border-slate-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-xl max-w-sm animate-in fade-in zoom-in-95 duration-300">
                                                        {part.state === "input-streaming" || part.state === "input-available" ? (
                                                            <div className="flex items-center gap-4 p-5">
                                                                <div className="h-12 w-12 rounded-2xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center">
                                                                    <div className="h-6 w-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">Checking Weather</span>
                                                                    <span className="text-xs text-slate-500 dark:text-zinc-400">Fetching data for {part.input?.city}...</span>
                                                                </div>
                                                            </div>
                                                        ) : part.state === "output-available" ? (
                                                            <div>
                                                                <div className="flex items-center gap-5 p-6">
                                                                    <div className="shrink-0 p-3 bg-slate-50 dark:bg-zinc-700/50 rounded-2xl border border-slate-100 dark:border-zinc-600">
                                                                        <WeatherIcon condition={part.output.condition} />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100">
                                                                            {part.output.city}
                                                                            <span className="text-sm font-normal text-slate-400 dark:text-zinc-500 ml-2">{part.output.country}</span>
                                                                        </h3>
                                                                        <div className="flex items-end gap-2 mt-1">
                                                                            <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">{part.output.temperature}°C</span>
                                                                        </div>
                                                                        <span className="text-sm font-medium text-sky-600 dark:text-sky-400 capitalize">{part.output.condition}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-zinc-700 border-t border-slate-100 dark:border-zinc-700">
                                                                    <div className="px-4 py-3 text-center">
                                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Feels Like</p>
                                                                        <p className="text-sm font-bold text-slate-700 dark:text-zinc-200 mt-0.5">{part.output.feelsLike}°C</p>
                                                                    </div>
                                                                    <div className="px-4 py-3 text-center">
                                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Humidity</p>
                                                                        <p className="text-sm font-bold text-slate-700 dark:text-zinc-200 mt-0.5">{part.output.humidity}%</p>
                                                                    </div>
                                                                    <div className="px-4 py-3 text-center">
                                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Wind</p>
                                                                        <p className="text-sm font-bold text-slate-700 dark:text-zinc-200 mt-0.5">{part.output.windKph} km/h</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : part.state === "output-error" ? (
                                                            <div className="p-5 flex items-center gap-4 text-red-600 dark:text-red-400">
                                                                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                <span className="text-sm font-semibold">{part.errorText}</span>
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

            <div className="sticky bottom-0 w-full p-4 md:p-8 bg-linear-to-t from-slate-100 via-slate-100 to-transparent dark:from-black dark:via-black dark:to-transparent">
                <div className="max-w-3xl mx-auto">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                            {error.message}
                        </div>
                    )}
                    {(status === "submitted" || status === "streaming") && (
                        <div className="flex items-center gap-2 mb-4 px-2 text-slate-500 dark:text-zinc-400 text-xs animate-pulse">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
                            </span>
                            AI is thinking...
                        </div>
                    )}
                    <form className="relative group" onSubmit={handleSubmit}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about weather (e.g. What's the weather in Tokyo?)"
                            type="text"
                            className="flex h-14 w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl px-4 pr-16 py-4 text-base placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 transition-all dark:placeholder:text-zinc-500 shadow-lg dark:text-white"
                        />
                        <button
                            type="submit"
                            disabled={status !== "ready"}
                            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-sky-500 to-cyan-600 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 12l18-10v20L3 12zm5-7.268v14.536L16.975 12 8 7.268z" /></svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
