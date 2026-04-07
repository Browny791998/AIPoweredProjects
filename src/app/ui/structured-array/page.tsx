"use client"

import { useState } from "react"
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { pokemonSchema } from "@/app/api/structured-array/schema";

export default function StructuredArrayPage() {
    const [type, setType] = useState("");

    const { submit, object: pokemonList, isLoading } = useObject({
        api: "/api/structured-array",
        schema: pokemonSchema, // Note: experimental_useObject with array output expects the item schema
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!type.trim()) return;
        await submit({ type });
        setType("");
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-12 pb-32">
                <header className="text-center space-y-4 pt-10">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-linear-to-r from-red-500 via-yellow-400 to-blue-500 bg-clip-text text-transparent uppercase py-2 drop-shadow-2xl">
                        Poké-Generator
                    </h1>
                    <p className="text-zinc-500 text-sm tracking-[.5em] uppercase font-black opacity-70">
                        Neural Network Ecosystem Reconstruction
                    </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {/* Render pokemon list when it's an array */}
                    {Array.isArray(pokemonList) ? (
                        pokemonList.map((pokemon: any, index: number) => (
                            <div 
                                key={index} 
                                className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl p-1 overflow-hidden transition-all duration-500 hover:scale-105 hover:border-yellow-500/50 hover:shadow-[0_0_40px_rgba(234,179,8,0.15)] animate-in fade-in zoom-in duration-500"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="absolute inset-0 bg-linear-to-br from-yellow-500/10 via-transparent to-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="relative bg-zinc-950 rounded-[calc(1.5rem-4px)] p-5 space-y-4 h-full flex flex-col">
                                    <div className="aspect-square bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/50 relative group-hover:border-yellow-500/20 transition-colors">
                                        {pokemon.image ? (
                                            <img
                                                src={pokemon.image}
                                                alt={pokemon.name}
                                                className="w-full h-full object-contain p-2"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-yellow-500 animate-spin" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-zinc-900/80 backdrop-blur-md px-2 py-1 rounded-lg border border-zinc-800 text-[8px] font-black uppercase text-zinc-400 tracking-tighter">
                                            ID: {index + 1}
                                        </div>
                                    </div>

                                    <div className="space-y-2 flex-1">
                                        <h2 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-yellow-400 transition-colors">
                                            {pokemon.name || "Extracting..."}
                                        </h2>
                                        
                                        <div className="flex flex-wrap gap-1.5 pt-2">
                                            {/* Note: using the misspelled 'abilitites' to match the schema */}
                                            {pokemon.abilitites?.map((ability: string, aIndex: number) => (
                                                <span 
                                                    key={aIndex}
                                                    className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-md text-[10px] font-bold text-zinc-400 uppercase tracking-tight group-hover:border-yellow-500/30 group-hover:text-yellow-200 transition-all"
                                                >
                                                    {ability}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-auto">
                                        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                                            <div className="h-full bg-linear-to-r from-yellow-500 to-red-500 animate-pulse" style={{ width: '85%' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : isLoading && (
                         /* Skeleton loaders */
                         [...Array(5)].map((_, i) => (
                            <div key={i} className="h-96 bg-zinc-900/50 border border-zinc-800 rounded-3xl animate-pulse" />
                        ))
                    )}
                </div>

                {!isLoading && !Array.isArray(pokemonList) && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-6 opacity-30 select-none pointer-events-none">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-8 border-zinc-800 border-t-transparent animate-spin duration-3000" />
                            <div className="w-4 h-4 bg-zinc-800 rounded-full" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-[0.5em]">System Idle - Awaiting Directive</p>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 p-6 bg-linear-to-t from-zinc-950 via-zinc-950/90 to-transparent backdrop-blur-xs">
                <div className="max-w-2xl mx-auto relative group">
                    <div className="absolute -inset-1 bg-linear-to-r from-red-600 via-yellow-500 to-blue-600 rounded-2xl blur-lg opacity-20 group-focus-within:opacity-50 transition-opacity duration-500" />
                    <div className="relative flex gap-3 p-3 bg-zinc-900/80 border border-zinc-800/50 rounded-2xl shadow-2xl backdrop-blur-2xl">
                        <input
                            type="text"
                            placeholder="Enter Pokémon Type (e.g. Electric, Dark, Dragon)"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            disabled={isLoading}
                            className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-hidden placeholder:text-zinc-500 font-bold tracking-tight disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !type.trim()}
                            className="relative overflow-hidden px-8 py-3 bg-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white border border-zinc-800 hover:border-yellow-500/50 transition-all disabled:opacity-50 group/btn active:scale-95"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                {isLoading ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Synthesizing
                                    </>
                                ) : (
                                    <>
                                        Capture
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse group-hover/btn:bg-yellow-400 group-hover/btn:shadow-[0_0_10px_rgba(234,179,8,1)] transition-colors" />
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
