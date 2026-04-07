"use client"

import { useState } from "react"
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { recipeSchema } from "@/app/api/structured-data/schema";

export default function StructuredDataPage() {
    const [dish, setDish] = useState("");

    const { submit, object, isLoading } = useObject({
        api: "/api/structured-data",
        schema: recipeSchema,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await submit({ dish });
        setDish("");
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
            <div className="max-w-3xl mx-auto space-y-12 pb-32">
                <header className="text-center space-y-4 pt-10">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-linear-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent uppercase py-2">
                        AI Recipe Engine
                    </h1>
                    <p className="text-zinc-500 text-sm tracking-widest uppercase font-bold opacity-50 italic">
                        AI-Engineered Molecular Gastronomy
                    </p>
                </header>

                {isLoading && !object?.recipe && (
                    <div className="animate-in fade-in duration-500 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/10 p-8 space-y-8">
                        <div className="h-8 w-2/3 bg-zinc-800 rounded-lg animate-pulse" />
                        <div className="space-y-3">
                            <div className="h-4 w-1/3 bg-emerald-900/40 rounded animate-pulse" />
                            {[1,2,3,4].map(i => (
                                <div key={i} className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-xl border border-zinc-800/50">
                                    <div className="h-3 w-1/3 bg-zinc-700 rounded animate-pulse" />
                                    <div className="h-5 w-16 bg-zinc-700 rounded-lg animate-pulse" />
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <div className="h-4 w-1/3 bg-emerald-900/40 rounded animate-pulse" />
                            {[1,2,3].map(i => (
                                <div key={i} className="flex gap-6">
                                    <div className="flex-none w-8 h-8 bg-zinc-800 rounded-xl animate-pulse" />
                                    <div className="flex-1 space-y-2 pt-1">
                                        <div className="h-3 bg-zinc-800 rounded animate-pulse" />
                                        <div className="h-3 w-4/5 bg-zinc-800 rounded animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {object?.recipe && (
                    <article className="animate-in fade-in slide-in-from-bottom-5 duration-700 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/10">
                        <div className="p-8 space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-3xl font-black text-white tracking-tight uppercase border-l-4 border-emerald-500 pl-4">
                                    {object.recipe.name}
                                </h2>
                            </div>



                            <div className="space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-4 text-emerald-500">
                                    Ingredients Matrix
                                    <span className="flex-1 h-px bg-zinc-800" />
                                </h3>
                                <div className="grid gap-3">
                                    {object.recipe.ingredients?.map((ingredient: any, index: number) => (
                                        <div key={index} className="flex justify-between items-center text-sm p-3 bg-zinc-800/30 rounded-xl border border-zinc-800/50 hover:bg-zinc-800/50 transition-all group">
                                            <span className="text-zinc-300 group-hover:text-white transition-colors capitalize font-medium">{ingredient.name}</span>
                                            <span className="font-mono text-[10px] font-black px-3 py-1 bg-zinc-950 rounded-lg border border-zinc-700 text-emerald-400 uppercase tracking-tighter shadow-inner">
                                                {ingredient.amount}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6 pt-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-4 text-emerald-500">
                                    Assembly Directives
                                    <span className="flex-1 h-px bg-zinc-800" />
                                </h3>
                                <div className="space-y-6">
                                    {object.recipe.steps?.map((step, index) => (
                                        step && (
                                            <div key={index} className="flex gap-6 group">
                                                <span className="flex-none w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-950 text-[10px] font-black text-emerald-500 border border-zinc-800 group-hover:bg-emerald-500 group-hover:text-zinc-950 group-hover:border-emerald-400 transition-all shadow-lg transform group-hover:rotate-6">
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <p className="text-sm text-zinc-400 leading-relaxed font-medium group-hover:text-zinc-200 transition-colors pt-1">
                                                    {step}
                                                </p>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    </article>
                )}
            </div>

            <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 p-6 bg-linear-to-t from-zinc-950 via-zinc-950/90 to-transparent">
                <div className="max-w-2xl mx-auto relative group">
                    <div className="absolute -inset-1 bg-linear-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-md opacity-20 group-focus-within:opacity-40 transition-opacity" />
                    <div className="relative flex gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
                        <input
                            type="text"
                            placeholder="Input target dish (e.g. Lobster Thermidor)"
                            value={dish}
                            onChange={(e) => setDish(e.target.value)}
                            disabled={isLoading}
                            className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-hidden placeholder:text-zinc-500 font-bold tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-2 bg-linear-to-br from-emerald-500 to-cyan-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-950 shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-3 h-3 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                                    Processing
                                </>
                            ) : "Execute"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}