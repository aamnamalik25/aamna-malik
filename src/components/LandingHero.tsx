/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Sparkles, Heart, Shield, Award, ArrowRight, Activity, Zap } from "lucide-react";

interface LandingHeroProps {
  onStartAnalysis: () => void;
  onViewHistory: () => void;
  historyCount: number;
}

export default function LandingHero({ onStartAnalysis, onViewHistory, historyCount }: LandingHeroProps) {
  // Generate random animated floating paws
  const floatingPaws = Array.from({ length: 8 }).map((_, idx) => ({
    id: idx,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 20 + 15,
    delay: Math.random() * 4,
    duration: Math.random() * 6 + 10,
  }));

  return (
    <div className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Floating Paws Animating */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {floatingPaws.map((paw) => (
          <motion.div
            key={paw.id}
            initial={{ opacity: 0, y: "110%" }}
            animate={{
              opacity: [0, 0.4, 0.4, 0],
              y: "-10%",
              x: `${paw.x + (Math.sin(paw.id) * 10)}%`,
            }}
            transition={{
              duration: paw.duration,
              repeat: Infinity,
              delay: paw.delay,
              ease: "linear",
            }}
            className="absolute text-violet-500/10 dark:text-violet-400/5"
            style={{
              left: `${paw.x}%`,
              bottom: "0px",
              width: paw.size,
              height: paw.size,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 14c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm4.5-5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-9 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm10 7c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-11 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" />
            </svg>
          </motion.div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Startup Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/5 border border-gray-200/50 dark:border-white/10 px-3.5 py-1.5 rounded-full w-fit mb-8 shadow-sm"
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-purple-500 animate-pulse"></span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-violet-605 dark:text-purple-400">Powered by Gemini AI 1.5 Pro</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
        >
          <span className="block text-gray-900 dark:text-white">Understand Your Pet</span>
          <span className="block mt-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-violet-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Like Never Before.
          </span>
        </motion.h1>

        {/* Hero Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed font-medium"
        >
          Upload a photo, describe behavior, and let our advanced neural engine reveal what your furry friend is really thinking.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <button
            id="btn_hero_analyze"
            onClick={onStartAnalysis}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl font-bold text-white text-lg shadow-xl shadow-purple-900/10 dark:shadow-purple-950/35 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>Analyze My Pet</span>
            <span className="text-xl">→</span>
          </button>

          {historyCount > 0 ? (
            <button
              id="btn_hero_history"
              onClick={onViewHistory}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 font-medium text-lg transition duration-250 flex items-center justify-center gap-2"
            >
              <span>View History ({historyCount})</span>
            </button>
          ) : null}
        </motion.div>

        {/* 12k+ Analyzed Segment for Sleek Interface */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex -space-x-3 items-center justify-center mb-16"
        >
          <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0A0118] bg-purple-950/20 flex items-center justify-center text-base shadow-sm">🐶</div>
          <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0A0118] bg-indigo-950/20 flex items-center justify-center text-base shadow-sm">🐱</div>
          <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0A0118] bg-pink-950/20 flex items-center justify-center text-base shadow-sm">🐰</div>
          <span className="pl-6 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">12k+ Analyzed Today</span>
        </motion.div>

        {/* Interactive Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-2xl glass-panel border border-white/20 dark:border-white/5 relative overflow-hidden group hover:border-violet-500/30 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-violet-500/20 transition-all duration-300" />
            <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-5 border border-violet-200/50 dark:border-violet-800/20">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Multimodal Translation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              We leverage sight, environment, posture, and contextual behavioral science to decode complex expressions.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-2xl glass-panel border border-white/20 dark:border-white/5 relative overflow-hidden group hover:border-pink-500/30 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-pink-500/20 transition-all duration-300" />
            <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-5 border border-pink-200/50 dark:border-pink-800/20">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">3 Interactive Decoders</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Toggle between humorous internal monologues, scientifically valid behaviorist insights, or extraterrestrial research data.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-2xl glass-panel border border-white/20 dark:border-white/5 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-amber-500/20 transition-all duration-300" />
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 border border-amber-200/50 dark:border-amber-800/20">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Pet DNA & Horoscope</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Explore custom rating profiles mapping mischief, curiosity levels, secret agendas, and customized daily celestial alignments.
            </p>
          </motion.div>
        </div>

        {/* Beautiful vector illustration frame representing pet translation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 relative rounded-3xl overflow-hidden shadow-2xl border border-white/30 dark:border-white/10"
        >
          {/* Interactive illustration mockup */}
          <div className="aspect-video w-full bg-gradient-to-tr from-violet-900/40 via-purple-900/20 to-neutral-900/50 p-8 flex flex-col justify-between relative text-left">
            {/* Top Bar controls */}
            <div className="flex items-center justify-between w-full relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="px-4 py-1.5 rounded-full text-xs font-mono bg-violet-950/60 text-violet-300 border border-violet-800/30">
                🐾 SECURE TELEMETRY INTERFACE V1.8
              </div>
            </div>

            {/* Illustration center content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-4 relative z-10">
              {/* Pet representation */}
              <div className="flex items-center justify-center relative">
                <div className="w-52 h-52 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-pink-500/20 to-violet-500/20 flex items-center justify-center border-2 border-white/10 relative">
                  {/* Glowing core */}
                  <div className="absolute inset-4 rounded-full bg-violet-600/10 blur-xl animate-pulse" />
                  
                  {/* Simulated target overlay */}
                  <div className="absolute inset-0 border-2 border-dashed border-violet-500/20 rounded-full animate-spin [animation-duration:90s]" />
                  
                  <span className="text-7xl md:text-8xl drop-shadow-md select-none animate-bounce">🐶</span>

                  {/* Sub-label indicators */}
                  <div className="absolute -top-2 -right-2 px-3 py-1 rounded-lg bg-pink-500 text-white text-xs font-semibold shadow-md flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-current" /> Happy 92%
                  </div>
                  <div className="absolute -bottom-2 -left-2 px-3 py-1 rounded-lg bg-violet-500 text-white text-xs font-semibold shadow-md flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Mischief Scale 98%
                  </div>
                </div>
              </div>

              {/* Text translation box mock */}
              <div className="flex flex-col gap-4">
                <div className="p-5 rounded-2xl glass-card border border-white/20 text-gray-800 dark:text-white">
                  <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" /> AI PET DECODER
                  </div>
                  <p className="font-sans italic text-base md:text-lg mb-3">
                    &ldquo;My scan confirms the treat cabinet handle has been operated. This constitutes a binding prompt. Please dispense protein units.&rdquo;
                  </p>
                  <div className="flex items-center justify-between border-t border-gray-200/50 dark:border-gray-700/50 pt-2.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">ID: Milo (Golden Retriever)</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">99.4% Accurate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom watermark */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-white/10 pt-4 mt-4 relative z-10 font-mono">
              <span>DESIGNED BY FURRFECTLY VENTURES</span>
              <span>ESTIMATED CONFIDENCE RATING 99%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
