/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Sun, Moon, History, Play, Home, Shield, Github, RefreshCw } from "lucide-react";
import LandingHero from "./components/LandingHero";
import AnalysisFlow from "./components/AnalysisFlow";
import ReportView from "./components/ReportView";
import HistoryList from "./components/HistoryList";
import { AnalysisResult } from "./types";

export default function App() {
  const [activeView, setActiveView] = useState<"landing" | "analysis" | "report" | "history">("landing");
  const [currentReport, setCurrentReport] = useState<AnalysisResult | null>(null);
  const [historyCount, setHistoryCount] = useState<number>(0);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Sync historical count of records
  const updateHistoryCount = () => {
    try {
      const rawHist = localStorage.getItem("furrfectly_history");
      const list = rawHist ? JSON.parse(rawHist) : [];
      setHistoryCount(list.length);
    } catch {
      setHistoryCount(0);
    }
  };

  useEffect(() => {
    updateHistoryCount();
    
    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleAnalysisSuccess = (result: AnalysisResult) => {
    setCurrentReport(result);
    updateHistoryCount();
    setActiveView("report");
  };

  const handleReopenReport = (report: AnalysisResult) => {
    setCurrentReport(report);
    setActiveView("report");
  };

  const handleDeleteReport = (id: string) => {
    try {
      const rawHist = localStorage.getItem("furrfectly_history");
      const list: AnalysisResult[] = rawHist ? JSON.parse(rawHist) : [];
      const updated = list.filter((item) => item.id !== id);
      localStorage.setItem("furrfectly_history", JSON.stringify(updated));
      updateHistoryCount();
      setCurrentReport(null);
      setActiveView("history");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={theme}>
      <div className="min-h-screen bg-neutral-50 dark:bg-[#0A0118] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 relative flex flex-col justify-between">
        
        {/* Glowing Decorative Background Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "12s" }} />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "15s" }} />
        </div>

        {/* TOP HEADER SECTION */}
        <header className="sticky top-0 z-40 border-b border-gray-200/40 dark:border-white/10 bg-white/70 dark:bg-[#0A0118]/70 backdrop-blur-md transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            
            {/* Brand Logo Layout */}
            <button
              id="btn_brand_logo"
              onClick={() => {
                setCurrentReport(null);
                setActiveView("landing");
              }}
              className="flex items-center gap-2 text-left group hover:opacity-90 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white text-xl shadow-md border border-white/20 dark:border-white/5 group-hover:scale-105 transition duration-200">
                🐾
              </div>
              <div>
                <span className="block font-black text-xl leading-none tracking-tight bg-gradient-to-r from-violet-605 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                  Furrfectly
                </span>
                <span className="block italic text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-0.5">
                  Ventures AI Translator
                </span>
              </div>
            </button>

            {/* Middle Nav Items */}
            <nav className="hidden sm:flex items-center gap-1 bg-gray-100/80 dark:bg-gray-900/50 p-1 rounded-xl border border-gray-200/50 dark:border-gray-800/50 relative z-10">
              <button
                id="btn_nav_home"
                onClick={() => {
                  setCurrentReport(null);
                  setActiveView("landing");
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  activeView === "landing"
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>

              <button
                id="btn_nav_translate"
                onClick={() => setActiveView("analysis")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  activeView === "analysis"
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Translate</span>
              </button>

              <button
                id="btn_nav_history"
                onClick={() => {
                  setCurrentReport(null);
                  setActiveView("history");
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  activeView === "history"
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>History ({historyCount})</span>
              </button>
            </nav>

            {/* Actions segment right */}
            <div className="flex items-center gap-3 relative z-10">
              {/* Dark mode switcher button */}
              <button
                id="btn_toggle_theme"
                onClick={toggleTheme}
                title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition shadow-sm"
              >
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              {/* Mobile Translate Direct CTA */}
              <button
                id="btn_translate_direct_header"
                onClick={() => setActiveView("analysis")}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white font-bold text-xs shadow-md shadow-violet-500/10 transition"
              >
                Translate Pet Now
              </button>
            </div>
          </div>
        </header>

        {/* MAIN BODY NAVIGATION TRANSITION WRAPPER */}
        <main className="flex-grow py-6 sm:py-8 lg:py-12 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {activeView === "landing" && (
                <LandingHero
                  onStartAnalysis={() => setActiveView("analysis")}
                  onViewHistory={() => setActiveView("history")}
                  historyCount={historyCount}
                />
              )}

              {activeView === "analysis" && (
                <AnalysisFlow
                  onAnalysisSuccess={handleAnalysisSuccess}
                  onCancel={() => {
                    setCurrentReport(null);
                    setActiveView("landing");
                  }}
                />
              )}

              {activeView === "report" && currentReport && (
                <ReportView
                  result={currentReport}
                  onBack={() => {
                    setCurrentReport(null);
                    updateHistoryCount();
                    setActiveView("landing");
                  }}
                  onDelete={handleDeleteReport}
                />
              )}

              {activeView === "history" && (
                <HistoryList
                  onReopen={handleReopenReport}
                  onRefresh={updateHistoryCount}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* PERSISTENT FOOTER SECTION WITH IMPORTANT SAFETY RULE DISCLAIMER */}
        <footer className="border-t border-gray-200/50 dark:border-white/5 bg-white/40 dark:bg-[#0A0118]/45 py-8 transition-colors duration-300">
          <div className="max-w-5xl mx-auto px-4 space-y-4">
            
            {/* Human Safety Veterinary Disclaimer */}
            <div className="p-4 rounded-2xl bg-orange-500/5 dark:bg-orange-500/3 border border-orange-500/10 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
              <Shield className="w-5 h-5 text-orange-500 shrink-0" />
              <p className="text-xs text-gray-550 dark:text-gray-400 font-medium leading-relaxed max-w-3xl text-left">
                <strong className="text-orange-500">Important safety guidance:</strong> Results are AI-generated interpretations based on visual cues and user-provided behavior descriptions and should be considered entertainment and educational insights rather than actual translation. Never substitute professional veterinarian recommendations or qualified animal behaviorist consulting.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-850">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-gray-400" style={{ fontSize: "10px" }}>
                <span>&copy; 2026 FURRFECTLY INC.</span>
                <span>&bull;</span>
                <span>BUILD V1.65 SECURE</span>
              </div>

              <div className="flex items-center gap-4">
                <a href="#privacy" className="hover:text-gray-800 dark:hover:text-white transition">Privacy Telemetry</a>
                <a href="#terms" className="hover:text-gray-800 dark:hover:text-white transition">Veterinary Terms</a>
                <a href="#support" className="hover:text-gray-800 dark:hover:text-white transition">Venture Support</a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
