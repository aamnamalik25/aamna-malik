/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Filter, RefreshCw, Calendar, Trash2, ArrowUpRight, Compass, Sparkles } from "lucide-react";
import { AnalysisResult, PetType, AnalysisMode } from "../types";

const PET_TYPES_ARRAY = Object.values(PetType);
const MODES_ARRAY = Object.values(AnalysisMode);

interface HistoryListProps {
  onReopen: (entry: AnalysisResult) => void;
  onRefresh: () => void;
}

export default function HistoryList({ onReopen, onRefresh }: HistoryListProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("All");
  const [filterMode, setFilterMode] = useState<string>("All");

  // Retrieve current items
  const rawHist = localStorage.getItem("furrfectly_history");
  const list: AnalysisResult[] = rawHist ? JSON.parse(rawHist) : [];

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this pet translation from history?")) {
      const updated = list.filter((item) => item.id !== id);
      localStorage.setItem("furrfectly_history", JSON.stringify(updated));
      onRefresh();
    }
  };

  const handleClearAll = () => {
    if (confirm("WARNING: This will wipe your pet translation history permanently. Continue?")) {
      localStorage.removeItem("furrfectly_history");
      onRefresh();
    }
  };

  // Filter items matching state
  const filteredList = list.filter((item) => {
    const matchesSearch =
      item.petProfile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.petProfile.breed && item.petProfile.breed.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.situation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "All" || item.petProfile.type === filterType;
    const matchesMode = filterMode === "All" || item.mode === filterMode;

    return matchesSearch && matchesType && matchesMode;
  });

  const getPetEmoji = (type: string) => {
    switch (type.toLowerCase()) {
      case "dog": return "🐶";
      case "cat": return "🐱";
      case "bird": return "🐦";
      case "rabbit": return "🐰";
      case "hamster": return "🐹";
      case "parrot": return "🦜";
      case "fish": return "🐠";
      default: return "🐾";
    }
  };

  return (
    <div className="space-y-6 relative z-10 max-w-5xl mx-auto px-4">
      {/* Filters bar */}
      <div className="glass-panel p-5 rounded-2xl border border-white/20 dark:border-white/5 shadow-lg flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between">
        
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-4.5 h-4.5 absolute left-3 w-4 h-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, breed, or situation..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-gray-950/40 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium"
          />
        </div>

        {/* Option Filters */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
          
          {/* Species Category Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-semibold text-gray-400">Species:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-gray-950/40 px-2.5 py-2 text-gray-750 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="All">All Species</option>
              {PET_TYPES_ARRAY.map((pt) => (
                <option key={pt} value={pt}>{pt}</option>
              ))}
            </select>
          </div>

          {/* Mode Category Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-semibold text-gray-400">Translation:</span>
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-gray-950/40 px-2.5 py-2 text-gray-750 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="All">All Modes</option>
              {MODES_ARRAY.map((m) => (
                <option key={m} value={m}>{m === "funny" ? "Comedy" : m === "alien" ? "Alien" : "Expert behaviorist"}</option>
              ))}
            </select>
          </div>

          {/* Clear button if list exists */}
          {list.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 dark:border-red-950/30 dark:hover:bg-red-950/20 text-red-650 text-xs font-bold transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid gallery */}
      {filteredList.length === 0 ? (
        <div className="py-16 text-center rounded-3xl glass-panel border border-white/20 dark:border-white/5 flex flex-col items-center justify-center">
          <span className="text-5xl mb-4 text-gray-400">🗂️</span>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No past logs located</h4>
          <p className="text-sm text-gray-500 max-w-sm">
            {searchTerm || filterType !== "All" || filterMode !== "All"
              ? "Modify your search parameters or query filters to locate stored records."
              : "Kick off your first translation analysis to see reports stored inside this history drawer."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item) => (
            <div
              key={item.id}
              onClick={() => onReopen(item)}
              className="glass-panel rounded-3xl p-5 border border-white/20 dark:border-white/5 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
            >
              <div>
                {/* Header segment list info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-violet-500/10 flex items-center justify-center bg-gray-100 dark:bg-gray-850">
                      {item.imageDataUrl ? (
                        <img src={item.imageDataUrl} alt={item.petProfile.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl filter drop-shadow">{getPetEmoji(item.petProfile.type)}</span>
                      )}
                    </div>
                    <div className="text-left leading-tight">
                      <h4 className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-violet-600 transition truncate w-32">
                        {item.petProfile.name}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {item.petProfile.type} &bull; {item.petProfile.breed}
                      </span>
                    </div>
                  </div>

                  {/* Mode tag indicator */}
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${
                    item.mode === "funny"
                      ? "bg-violet-100/60 text-violet-750 dark:bg-violet-950/20 border-violet-200"
                      : item.mode === "alien"
                      ? "bg-amber-100/60 text-amber-750 dark:bg-amber-950/20 border-amber-200"
                      : "bg-pink-100/60 text-pink-705 dark:bg-pink-950/20 border-pink-200"
                  }`}>
                    {item.mode === "funny" ? "Comedy" : item.mode === "alien" ? "Alien" : "Behaviourist"}
                  </span>
                </div>

                {/* Body translated snippet */}
                <p className="text-sm italic text-gray-650 dark:text-gray-300 leading-relaxed line-clamp-3 mb-4 font-medium">
                  &ldquo;{item.whatPetSays}&rdquo;
                </p>

                {/* Custom tags/badges indices */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold flex items-center gap-0.5 border border-amber-500/10 shrink-0">
                    🏆 {item.reputation.title}
                  </span>
                  <span className="px-2 py-1 rounded bg-violet-500/10 text-violet-605 dark:text-violet-400 text-[10px] font-semibold flex items-center gap-0.5 border border-violet-500/10 shrink-0">
                    🐾 Score: {item.moodScore}
                  </span>
                </div>
              </div>

              {/* Card Footer actions */}
              <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800/80 pt-3.5 mt-auto">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    title="Delete item"
                    className="p-1 px-1.5 rounded bg-red-100/20 hover:bg-red-150 text-red-650 hover:text-red-750 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>

                  <div className="p-1.5 rounded-full bg-violet-100/50 dark:bg-violet-950/25 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
