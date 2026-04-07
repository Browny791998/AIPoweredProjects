"use client"

import { useState } from "react"

type Sentiment = "positive" | "negative" | "neutral" | null;

const sentimentConfig = {
    positive: {
        label: "Positive",
        color: "from-emerald-500 to-green-400",
        border: "border-emerald-500/50",
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        icon: "😊",
    },
    negative: {
        label: "Negative",
        color: "from-red-500 to-rose-400",
        border: "border-red-500/50",
        bg: "bg-red-500/10",
        text: "text-red-400",
        icon: "😞",
    },
    neutral: {
        label: "Neutral",
        color: "from-zinc-400 to-slate-400",
        border: "border-zinc-500/50",
        bg: "bg-zinc-500/10",
        text: "text-zinc-400",
        icon: "😐",
    },
};

export default function StructuredEnumPage() {
    const [text, setText] = useState("");
    const [sentiment, setSentiment] = useState<Sentiment>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        setIsLoading(true);
        setError("");
        setSentiment(null);
        try {
            const res = await fetch("/api/structured-enum", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });
            if (!res.ok) throw new Error("Failed to analyze sentiment");
            const data = await res.json();
            setSentiment(data.value as Sentiment);
            setText("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const config = sentiment ? sentimentConfig[sentiment] : null;

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 flex flex-col">
            <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col space-y-10 pt-10 pb-32">
                <header className="text-center space-y-3">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-linear-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent uppercase py-2">
                        Sentiment Analyzer
                    </h1>
                    <p className="text-zinc-500 text-sm tracking-widest uppercase font-bold opacity-60">
                        AI-Powered Emotion Classification
                    </p>
                </header>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl text-sm">
                        {error}
                    </div>
                )}

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-16 space-y-6 animate-in fade-in duration-300">
                        <div className="relative w-20 h-20">
                            <div className="absolute inset-0 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
                            <div className="absolute inset-3 rounded-full border-4 border-pink-500/20 border-b-pink-500 animate-spin" style={{ animationDirection: "reverse" }} />
                        </div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 animate-pulse">
                            Analyzing sentiment...
                        </p>
                    </div>
                )}

                {!isLoading && config && (
                    <div className={`animate-in fade-in zoom-in duration-500 rounded-3xl border ${config.border} ${config.bg} p-8 flex flex-col items-center gap-6`}>
                        <div className="text-7xl">
                            {config.icon}
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Detected Sentiment</p>
                            <p className={`text-5xl font-black uppercase tracking-tight ${config.text}`}>
                                {config.label}
                            </p>
                        </div>
                        <div className={`h-1.5 w-32 rounded-full bg-linear-to-r ${config.color}`} />
                    </div>
                )}

                {!isLoading && !sentiment && (
                    <div className="flex flex-col items-center justify-center py-16 space-y-4 opacity-20 select-none pointer-events-none">
                        <div className="text-6xl">🧠</div>
                        <p className="text-xs font-black uppercase tracking-[0.4em]">Awaiting Input</p>
                    </div>
                )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-linear-to-t from-zinc-950 via-zinc-950/90 to-transparent">
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative group">
                    <div className="absolute -inset-1 bg-linear-to-r from-violet-500 to-pink-500 rounded-2xl blur-md opacity-20 group-focus-within:opacity-40 transition-opacity" />
                    <div className="relative flex gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
                        <input
                            type="text"
                            placeholder="Enter text to analyze (e.g. I love this!)"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            disabled={isLoading}
                            className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none placeholder:text-zinc-500 font-medium tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !text.trim()}
                            className="px-8 py-2 bg-linear-to-br from-violet-500 to-pink-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg hover:shadow-violet-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Analyzing
                                </>
                            ) : "Analyze"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
