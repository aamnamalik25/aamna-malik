/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Quote,
  Sparkles,
  Award,
  Heart,
  Lightbulb,
  CheckCircle,
  Copy,
  ChevronLeft,
  Calendar,
  Compass,
  FileSpreadsheet,
  Share2,
  Trash2,
  Download,
  Flame,
  Info,
  X
} from "lucide-react";
import { AnalysisResult, AnalysisMode } from "../types";

interface ReportViewProps {
  result: AnalysisResult;
  onBack: () => void;
  onDelete?: (id: string) => void;
}

export default function ReportView({ result, onBack, onDelete }: ReportViewProps) {
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const {
    id,
    petProfile,
    mode,
    timestamp,
    whatPetSays,
    emotionalState,
    moodScore,
    moodTitle,
    behaviorExplanation,
    suggestedHumanResponse,
    confidenceLevel,
    personalityDNA,
    horoscope,
    secretThoughts,
    reputation,
    imageDataUrl,
    situation
  } = result;

  const modeBadgeColor = 
    mode === AnalysisMode.FUNNY
      ? "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 border-violet-200/50 dark:border-violet-800/30"
      : mode === AnalysisMode.ALIEN
      ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/30"
      : "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border-pink-200/50 dark:border-pink-800/30";

  const modeLabel = 
    mode === AnalysisMode.FUNNY
      ? "Comedy Translation"
      : mode === AnalysisMode.ALIEN
      ? "Alien Telemetry"
      : "Expert Behaviourist";

  // Emoji for pet category fallback
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

  const handleCopyShareText = () => {
    const text = `🐾 Furrfectly Translated ${petProfile.name}'s thoughts!
    
" ${whatPetSays} "

Mood Score: ${moodScore}/100 [${moodTitle}]
Reputation: ${reputation.title} ${reputation.badgeEmoji}
DNA Type: ${personalityDNA.personalityType}

De-code your own pet's secret voice with Furrfectly AI!`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">
      {/* Header operations bar */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delete this analysis permanently?")) {
                  onDelete(id);
                }
              }}
              title="Delete item"
              className="p-2.5 rounded-xl border border-red-200 hover:bg-red-50 dark:border-red-950 dark:hover:bg-red-950/20 text-red-650 transition"
            >
              <Trash2 className="w-4.5 h-4.5 text-red-500" />
            </button>
          )}

          <button
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition flex items-center gap-2 shadow-md hover:shadow-lg hover:shadow-violet-500/10 active:translate-y-0.5"
          >
            <Share2 className="w-4 h-4" />
            <span>Generate Share Card</span>
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT PANEL: Pet Profile card summary & reputation badge */}
        <div className="lg:col-span-1 space-y-6">
          {/* Pet Photo / Bio Card */}
          <div className="glass-panel rounded-3xl p-6 border border-white/20 dark:border-white/5 shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/10 rounded-full blur-2xl -mr-6 -mt-6" />

            <div className="mx-auto w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-violet-500/15 mb-4 relative flex items-center justify-center bg-gray-100 dark:bg-gray-850">
              {imageDataUrl ? (
                <img src={imageDataUrl} alt={petProfile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl drop-shadow">{getPetEmoji(petProfile.type)}</span>
              )}
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center gap-1.5 leading-none mb-1">
              {petProfile.name}
              <span className="text-lg filter drop-shadow">{getPetEmoji(petProfile.type)}</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-wide uppercase mb-4">
              {petProfile.breed} &bull; {petProfile.age}
            </p>

            {/* Quick Stats list */}
            <div className="grid grid-cols-2 gap-2 text-left text-xs border-t border-gray-100 dark:border-gray-800 pt-4">
              <div className="p-2.5 rounded-xl bg-gray-50/50 dark:bg-gray-950/20">
                <span className="block text-gray-400 uppercase font-bold tracking-wider mb-0.5" style={{ fontSize: "10px" }}>Gender</span>
                <span className="font-semibold text-gray-800 dark:text-gray-300">{petProfile.gender}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50/50 dark:bg-gray-950/20">
                <span className="block text-gray-400 uppercase font-bold tracking-wider mb-0.5" style={{ fontSize: "10px" }}>Species</span>
                <span className="font-semibold text-gray-800 dark:text-gray-300">{petProfile.type}</span>
              </div>
            </div>
          </div>

          {/* Core Reputation System Badge */}
          <div className="glass-panel rounded-3xl p-6 border border-white/20 dark:border-white/5 shadow-xl relative overflow-hidden group">
            {/* Glowing amber halo */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                {reputation.badgeEmoji}
              </div>
              <div>
                <span className="block text-xs font-bold text-amber-500 uppercase tracking-widest mb-0.5">Pet Reputation Achieved</span>
                <h4 className="text-lg font-extrabold text-gray-900 dark:text-white leading-tight">
                  {reputation.title}
                </h4>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
              &ldquo;{reputation.description}&rdquo;
            </p>
          </div>

          {/* Horoscope Card */}
          <div className="glass-panel rounded-3xl p-6 border border-white/20 dark:border-white/5 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-pink-500" />
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Astro-Pet Horoscope</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
              {horoscope}
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: Translation quotes, Emotional breakdown, personality dna, suggested actions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Primary Translation Box */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/35 dark:border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-tr from-violet-600/5 via-transparent to-pink-600/5">
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border ${modeBadgeColor} flex items-center gap-1.5`}>
              <span className="inline-block w-2 h-2 rounded-full bg-violet-500" />
              <span>{modeLabel}</span>
            </div>

            <Quote className="w-12 h-12 text-violet-500/20 mb-3" />
            
            {/* The First-Person Quote */}
            <blockquote className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-relaxed mb-6 italic">
              &ldquo;{whatPetSays}&rdquo;
            </blockquote>

            {/* Context situation recap */}
            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-5">
              <div className="flex items-center gap-2">
                <Compass className="w-4.5 h-4.5 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Situation Context: <strong className="text-gray-700 dark:text-gray-300">{situation}</strong>
                </span>
              </div>

              {/* Confidence badge */}
              <div className="text-right">
                <span className="block text-xs font-mono text-gray-400 uppercase tracking-widest" style={{ fontSize: "10px" }}>AI Confidence</span>
                <span className="font-bold text-sm text-emerald-500">{confidenceLevel}% Verified</span>
              </div>
            </div>
          </div>

          {/* Behavior scientific breakdown */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/20 dark:border-white/5 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">Scientific Behavior Breakdown</h4>
            </div>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
              {behaviorExplanation}
            </p>

            {/* Recommendations Row */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Recommended Human Actions</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedHumanResponse.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50/70 dark:bg-gray-950/20 border border-gray-100 dark:border-gray-850">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-gray-850 dark:text-gray-300 leading-tight">
                      {rec}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Animated Personality DNA Cards */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/20 dark:border-white/5 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-violet-500" />
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">Pet Personality DNA</h4>
            </div>

            <div className="mb-6 p-4 rounded-xl bg-violet-500/5 text-violet-705 border border-violet-500/10 flex items-center justify-between text-sm text-violet-800 dark:text-violet-300">
              <span className="font-semibold">Core Archetype Type:</span>
              <span className="font-extrabold uppercase font-mono tracking-wider">{personalityDNA.personalityType}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Energy Level */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500">⚡ Energy Level</span>
                  <span className="text-gray-800 dark:text-white font-mono">{personalityDNA.energyLevel}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${personalityDNA.energyLevel}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-orange-400"
                  />
                </div>
              </div>

              {/* Curiosity Level */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500">🔭 Curiosity Level</span>
                  <span className="text-gray-800 dark:text-white font-mono">{personalityDNA.curiosityLevel}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${personalityDNA.curiosityLevel}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-violet-500"
                  />
                </div>
              </div>

              {/* Intelligence Estimate */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500">🧠 Intelligence Estimate</span>
                  <span className="text-gray-800 dark:text-white font-mono">{personalityDNA.intelligenceEstimate}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${personalityDNA.intelligenceEstimate}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-sky-500"
                  />
                </div>
              </div>

              {/* Mischief Rating */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500">😈 Mischief Rating</span>
                  <span className="text-gray-800 dark:text-white font-mono">{personalityDNA.mischiefRating}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${personalityDNA.mischiefRating}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-pink-500"
                  />
                </div>
              </div>

              {/* Social Rating */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500">🤝 Social Rating</span>
                  <span className="text-gray-800 dark:text-white font-mono">{personalityDNA.socialRating}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${personalityDNA.socialRating}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              </div>

              {/* Loyalty Rating */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500">💖 Loyalty Rating</span>
                  <span className="text-gray-800 dark:text-white font-mono">{personalityDNA.loyaltyRating}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${personalityDNA.loyaltyRating}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Emotional State Bars List */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/20 dark:border-white/5 shadow-xl relative overflow-hidden">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-1.5">
              <Heart className="w-5 h-5 text-pink-500 fill-current" />
              <span>Calibrated Emotional State</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
              {Object.entries(emotionalState).map(([emoKey, emoValue]) => (
                <div key={emoKey} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide">
                    <span className="text-gray-500">{emoKey}</span>
                    <span className="text-gray-900 dark:text-gray-300 font-mono font-bold">{emoValue}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-850 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${emoValue}%` }}
                      transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-violet-500 to-pink-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secret Pet Thoughts List */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/20 dark:border-white/5 shadow-xl relative">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-1.5">
              <span>🤫 Secret Pet Thoughts</span>
            </h4>
            <div className="space-y-3">
              {secretThoughts.map((thought, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-950/20 border border-gray-100 dark:border-gray-850 italic text-sm text-gray-700 dark:text-gray-300 relative flex items-center gap-3"
                >
                  <span className="text-lg shrink-0 select-none">💭</span>
                  <span>&ldquo;{thought}&rdquo;</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SHARE CARD OVERLAY MODAL */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-850 relative"
            >
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105 transition"
              >
                <X className="w-4 h-4" />
              </button>

              {/* CARD PREVIEW */}
              <div className="p-6">
                <span className="block text-xs font-mono text-gray-400 dark:text-gray-500 mb-4 text-center uppercase tracking-wider">
                  Social Share Preview (Square / Aspect 1:1)
                </span>

                {/* THE CARD BOX TO SCREENSHOT */}
                <div id="share-graphic-box" className="aspect-square w-full rounded-2xl bg-gradient-to-tr from-violet-600 via-pink-500 to-amber-500 p-6 flex flex-col justify-between text-white relative shadow-lg overflow-hidden select-none">
                  {/* Glowing background shapes */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Paw silhouette absolute back */}
                  <div className="absolute -right-16 -top-16 text-white/5 w-64 h-64 pointer-events-none">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 14c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm4.5-5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-9 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm10 7c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-11 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" />
                    </svg>
                  </div>

                  {/* Top segment: header watermarking & logo */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-1">
                      <span className="text-xl">🐾</span>
                      <span className="font-extrabold text-sm tracking-tight">Furrfectly AI</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-white/20 uppercase tracking-widest leading-none font-bold">
                      {petProfile.gender} Breed
                    </span>
                  </div>

                  {/* Middle: first-person translated quote inside bubble layout */}
                  <div className="my-auto relative z-10 px-2 text-center">
                    <p className="text-base sm:text-lg font-bold leading-relaxed italic line-clamp-4 filter drop-shadow">
                      &ldquo;{whatPetSays}&rdquo;
                    </p>
                  </div>

                  {/* Bottom layout: Pet meta + reputation badge */}
                  <div className="flex items-center justify-between relative z-10 pt-4 border-t border-white/20">
                    <div className="flex items-center gap-3">
                      {imageDataUrl ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
                          <img src={imageDataUrl} alt={petProfile.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl border border-white/20">
                          {getPetEmoji(petProfile.type)}
                        </div>
                      )}
                      <div className="text-left leading-tight">
                        <span className="block text-sm font-black uppercase tracking-wide">{petProfile.name}</span>
                        <span className="block text-[10px] text-white/70 font-mono tracking-wider">{petProfile.breed} ({petProfile.age})</span>
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="text-right flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/15">
                      <span className="text-lg">{reputation.badgeEmoji}</span>
                      <div className="text-left leading-none">
                        <span className="block text-[9px] font-bold text-white/60 font-mono uppercase">Reputation</span>
                        <span className="text-[10px] font-black">{reputation.title}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="p-6 bg-gray-50 dark:bg-gray-950 border-t border-gray-150 dark:border-gray-850 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyShareText}
                  className="w-full py-3 rounded-xl bg-violet-605 hover:bg-violet-750 text-white bg-violet-650 flex items-center justify-center gap-2 font-bold text-sm transition relative"
                >
                  {copied ? (
                    <span>Copied successfully! 🐾</span>
                  ) : (
                    <>
                      <Copy className="w-4.5 h-4.5" />
                      <span>Copy Report Clipboard</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="w-full py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 text-xs font-semibold tracking-wide transition"
                >
                  Dismiss Share Card
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
