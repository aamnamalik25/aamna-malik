/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  Camera,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Smile,
  BrainCircuit,
  Globe,
  X,
  RefreshCw,
  Video
} from "lucide-react";
import { PetType, AnalysisMode, PetProfile } from "../types";

// Setup standard pet types with matching emojis and themes
const PET_DEFS = [
  { type: PetType.DOG, emoji: "🐶", label: "Dog", color: "from-amber-400 to-orange-500" },
  { type: PetType.CAT, emoji: "🐱", label: "Cat", color: "from-violet-400 to-indigo-500" },
  { type: PetType.BIRD, emoji: "🐦", label: "Bird", color: "from-sky-400 to-blue-500" },
  { type: PetType.RABBIT, emoji: "🐰", label: "Rabbit", color: "from-emerald-400 to-teal-500" },
  { type: PetType.HAMSTER, emoji: "🐹", label: "Hamster", color: "from-rose-400 to-red-500" },
  { type: PetType.PARROT, emoji: "🦜", label: "Parrot", color: "from-yellow-400 to-green-500" },
  { type: PetType.FISH, emoji: "🐠", label: "Fish", color: "from-cyan-400 to-blue-500" },
  { type: PetType.OTHER, emoji: "🐾", label: "Other", color: "from-gray-400 to-gray-600" },
];

const BEHAVIOR_PRESETS = [
  "Staring at me with unblinking eyes",
  "Meowing/Barking repeatedly and walking back and forth",
  "Running at maximum speed in circles around the house",
  "Hiding under the couch/furniture",
  "Looking at their empty bowl with deep existential sorrow",
  "Sleeping in a highly unusual, pretzel-like posture",
  "Scratching at the door and making small murmurs",
  "Following me into every room, including the bathroom"
];

interface AnalysisFlowProps {
  onAnalysisSuccess: (result: any) => void;
  onCancel: () => void;
}

export default function AnalysisFlow({ onAnalysisSuccess, onCancel }: AnalysisFlowProps) {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form States
  const [selectedPet, setSelectedPet] = useState<PetType | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  
  const [name, setName] = useState<string>("");
  const [breed, setBreed] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("Female");

  const [behavior, setBehavior] = useState<string>("");
  const [selectedMode, setSelectedMode] = useState<AnalysisMode>(AnalysisMode.FUNNY);

  // Camera capture states
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Drag and drop states
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Step check validations
  const isStep1Valid = selectedPet !== null;
  const isStep2Valid = name.trim().length > 0;
  const isStep3Valid = behavior.trim().length > 0;

  // Handle image upload and base64 parsing
  const processFile = (file: File) => {
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg("File is too large. Please select an image under 8MB.");
      return;
    }

    const type = file.type.startsWith("video/") ? "video" : "image";
    setMediaType(type);
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // Live Camera controls
  const startCamera = async () => {
    setErrorMsg(null);
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error("Camera connection error:", err);
      // Give advice
      setErrorMsg("Unable to access the camera. Please double-check permissions or upload a file.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setImagePreview(dataUrl);
        setMimeType("image/jpeg");
        setMediaType("image");
      }
      stopCamera();
    }
  };

  // Submit flow to Gemini Backend
  const triggerTranslation = async () => {
    setLoading(true);
    setErrorMsg(null);

    // Sequential premium startup loader messages
    const messages = [
      "Synchronizing neural paw telemetry...",
      "Calibrating facial-micro posture vectors...",
      "Cross-referencing behavioral canine data science...",
      "Decrypting vocalized frequencies...",
      "Synthesizing first-person perspective translator..."
    ];

    let currentMsgIdx = 0;
    setLoadingMessage(messages[0]);
    const messageInterval = setInterval(() => {
      currentMsgIdx++;
      if (currentMsgIdx < messages.length) {
        setLoadingMessage(messages[currentMsgIdx]);
      }
    }, 1500);

    try {
      const petProfileObj: PetProfile = {
        name: name,
        type: selectedPet!,
        breed: breed || "Mixed Breed",
        age: age || "Unknown",
        gender: gender,
      };

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petProfile: petProfileObj,
          situation: behavior,
          mode: selectedMode,
          imageBase64: imagePreview,
          mimeType: mimeType || "image/jpeg"
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const result = await response.json();
      
      // Store locally inside image result for display if it isn't returned from server
      if (imagePreview && !result.imageDataUrl) {
        result.imageDataUrl = imagePreview;
      }

      // Add to localStorage history list
      try {
        const rawHist = localStorage.getItem("furrfectly_history");
        const hist = rawHist ? JSON.parse(rawHist) : [];
        hist.unshift(result);
        localStorage.setItem("furrfectly_history", JSON.stringify(hist));
      } catch (localStoreErr) {
        console.error("Local hist saving error: ", localStoreErr);
      }

      clearInterval(messageInterval);
      onAnalysisSuccess(result);
    } catch (err: any) {
      console.error("Translation api error:", err);
      setErrorMsg(err.message || "Something went wrong during translation.");
    } finally {
      clearInterval(messageInterval);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 relative z-10 py-4">
      {/* Back button and status bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={step > 1 ? () => setStep(step - 1) : onCancel}
          className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{step > 1 ? "Previous Step" : "Cancel"}</span>
        </button>

        {/* Custom progress indicators */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                s === step
                  ? "w-8 bg-violet-600"
                  : s < step
                  ? "w-2.5 bg-violet-400"
                  : "w-2.5 bg-gray-200 dark:bg-gray-800"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Glassmorphic Form Card */}
      <motion.div
        layout
        className="glass-panel rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl border border-white/30 dark:border-white/5"
      >
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm p-4 rounded-2xl mb-6 flex items-center justify-between"
            >
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg(null)} className="p-1 hover:bg-red-500/10 rounded">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* LOADING STATE - neural overlay */}
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 flex flex-col items-center justify-center text-center focus-none"
            >
              <div className="relative mb-8">
                {/* Rotating glow ring */}
                <div className="w-24 h-24 rounded-full border-4 border-violet-500/20 border-t-violet-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl animate-bounce">🧬</span>
                </div>
              </div>
              <motion.h4
                key={loadingMessage}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-bold text-gray-900 dark:text-white mb-2"
              >
                {loadingMessage}
              </motion.h4>
              <p className="text-xs text-violet-600/70 dark:text-violet-400/70 font-mono tracking-widest uppercase">
                DO NOT CLOSE THIS WINDOW
              </p>
            </motion.div>
          ) : step === 1 ? (
            /* STEP 1: PET SELECTOR & MEDIA UPLOAD */
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: -20, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Identify Your Pet</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Select the species and upload/capture an image to assist our multimodal model structure.
                </p>
              </div>

              {/* Pet Type Select List */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Species Type <span className="text-pink-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PET_DEFS.map((pet) => {
                    const isSelected = selectedPet === pet.type;
                    return (
                      <button
                        key={pet.type}
                        id={`pet_select_${pet.type.toLowerCase()}`}
                        type="button"
                        onClick={() => setSelectedPet(pet.type)}
                        className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition duration-200 border text-center ${
                          isSelected
                            ? "bg-violet-600/10 border-violet-500 text-violet-700 dark:text-violet-300 ring-2 ring-violet-500/20"
                            : "glass-card hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800"
                        }`}
                      >
                        <span className="text-3xl filter drop-shadow">{pet.emoji}</span>
                        <span className="text-sm font-semibold">{pet.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upload or Camera Capture Interface */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Pet Visual Context <span className="text-gray-400 font-normal">(Optional but highly recommended)</span>
                </label>

                {cameraActive ? (
                  /* Active Camera Device Screen */
                  <div className="rounded-2xl overflow-hidden bg-black relative border border-gray-800">
                    <video ref={videoRef} className="w-full h-64 md:h-80 object-cover" autoPlay playsInline />
                    <div className="absolute bottom-4 inset-x-4 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-4 py-2.5 rounded-xl bg-gray-900/80 hover:bg-gray-950 text-white font-medium text-xs transition border border-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="p-4 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-lg transition border-4 border-white/20 animate-pulse"
                      >
                        <Camera className="w-6 h-6" />
                      </button>
                      <div className="w-16" /> {/* Spacer */}
                    </div>
                  </div>
                ) : imagePreview ? (
                  /* Pre-render of uploaded/captured picture */
                  <div className="relative rounded-2xl overflow-hidden glass-card p-2 border border-gray-200 dark:border-gray-800 max-w-sm mx-auto">
                    {mediaType === "video" ? (
                      <video src={imagePreview} className="w-full h-56 object-cover rounded-xl" controls />
                    ) : (
                      <img src={imagePreview} alt="Pet custom upload preview" className="w-full h-56 object-cover rounded-xl" />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setMimeType(null);
                      }}
                      className="absolute top-4 right-4 p-2 rounded-full bg-red-650 text-white hover:bg-red-750 shadow-md backdrop-blur-sm transition bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* Standard Drag-Drop container card */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* File Drop Area */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer p-4 transition duration-200 ${
                        isDragging
                          ? "border-violet-500 bg-violet-500/5"
                          : "border-gray-300 hover:border-violet-400 dark:border-gray-800 dark:hover:border-violet-800"
                      }`}
                      onClick={() => document.getElementById("file-picker-input")?.click()}
                    >
                      <Upload className="w-8 h-8 text-violet-500 mb-3" />
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Drag photo / short video here
                      </p>
                      <p className="text-xs text-gray-500 mt-1">or browse files (under 8MB)</p>
                      <input
                        type="file"
                        id="file-picker-input"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>

                    {/* Camera Trigger Area */}
                    <button
                      type="button"
                      onClick={startCamera}
                      className="h-40 rounded-2xl border border-gray-200 hover:border-violet-400 dark:border-gray-800 dark:hover:border-violet-800 glass-card flex flex-col items-center justify-center text-center p-4 transition duration-200"
                    >
                      <Camera className="w-8 h-8 text-pink-500 mb-3" />
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Snap Photo Instantly</p>
                      <p className="text-xs text-gray-500 mt-1">Use web camera to analyze now</p>
                    </button>
                  </div>
                )}
              </div>

              {/* NEXT ACTION BUTTON STEP 1 */}
              <div className="pt-4 flex justify-end">
                <button
                  id="btn_step1_next"
                  type="button"
                  disabled={!isStep1Valid}
                  onClick={() => setStep(2)}
                  className={`px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition duration-250 cursor-pointer ${
                    isStep1Valid
                      ? "bg-violet-600 hover:bg-violet-700 text-white shadow-md active:translate-y-0.5"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <span>Build Pet Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : step === 2 ? (
            /* STEP 2: PROFILE DATA */
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: -20, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pet Biography</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Tell us who we are translating. The biography data calibrates scientific translation charts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pet Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Pet Name <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="pet_name_input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Luna, Rocky, Barnaby"
                    required
                    className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-gray-950/40 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium"
                  />
                </div>

                {/* Pet Breed */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Breed</label>
                  <input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    placeholder="e.g. Golden Retriever, Siamese, Unknown"
                    className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-gray-950/40 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium"
                  />
                </div>

                {/* Pet Age */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Age / Lifecycle stage</label>
                  <input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 18 months, Senior, Puppy"
                    className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-gray-950/40 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium"
                  />
                </div>

                {/* Gender Segmented Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Gender Identity</label>
                  <div className="grid grid-cols-4 gap-2 bg-gray-100 dark:bg-gray-950 p-1.5 rounded-xl border border-gray-200 dark:border-gray-800">
                    {["Female", "Male", "Spayed", "Neutered"].map((g) => {
                      const isSel = gender === g;
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={`py-2 rounded-lg text-xs font-bold transition ${
                            isSel
                              ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                              : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ACTION ROW STEP 2 */}
              <div className="pt-4 flex justify-end">
                <button
                  id="btn_step2_next"
                  type="button"
                  disabled={!isStep2Valid}
                  onClick={() => setStep(3)}
                  className={`px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition duration-250 cursor-pointer ${
                    isStep2Valid
                      ? "bg-violet-600 hover:bg-violet-700 text-white shadow-md active:translate-y-0.5"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <span>Contextual Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            /* STEP 3: BEHAVIORS & TRANSLATOR MODE */
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: -20, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Behavior & Scenario</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  What is {name || "your pet"} doing right now to capture your attention? Enter a brief situation.
                </p>
              </div>

              {/* Behavior Prompt input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Pet Behavior Situation <span className="text-pink-500">*</span>
                </label>
                <textarea
                  id="behavior_textarea"
                  value={behavior}
                  onChange={(e) => setBehavior(e.target.value)}
                  rows={4}
                  placeholder="Describe posture, gaze direction, ears, tail, or current activities..."
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-gray-950/40 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium text-sm"
                />

                {/* Sugestion Quick buttons */}
                <div className="space-y-1.5 mt-2">
                  <span className="text-xs text-gray-500 font-medium">Quick Preset Templates:</span>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                    {BEHAVIOR_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setBehavior(preset)}
                        className="px-3 py-1.5 rounded-lg text-xs bg-gray-150 hover:bg-violet-100 dark:bg-gray-950 dark:hover:bg-violet-950/40 hover:text-violet-700 dark:hover:text-violet-300 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 transition text-left"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Premium Core AI Translation Translator Modes */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Select Translation Engine
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Mode 1 */}
                  <button
                    id="btn_mode_funny"
                    type="button"
                    onClick={() => setSelectedMode(AnalysisMode.FUNNY)}
                    className={`p-4 rounded-2xl flex flex-col items-start gap-1 border text-left cursor-pointer transition ${
                      selectedMode === AnalysisMode.FUNNY
                        ? "bg-violet-600/10 border-violet-500 text-violet-700 dark:text-violet-300 ring-2 ring-violet-500/20"
                        : "glass-card hover:bg-gray-150 hover:border-gray-350 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1 rounded bg-violet-100 dark:bg-violet-900/60 text-violet-600 dark:text-violet-400">
                        <Smile className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold">Funny Mode</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Decodes hilarious inner monologues, sass, and opportunistic demands.
                    </span>
                  </button>

                  {/* Mode 2 */}
                  <button
                    id="btn_mode_expert"
                    type="button"
                    onClick={() => setSelectedMode(AnalysisMode.EXPERT)}
                    className={`p-4 rounded-2xl flex flex-col items-start gap-1 border text-left cursor-pointer transition ${
                      selectedMode === AnalysisMode.EXPERT
                        ? "bg-violet-600/10 border-violet-500 text-violet-700 dark:text-violet-300 ring-2 ring-violet-500/20"
                        : "glass-card hover:bg-gray-150 hover:border-gray-350 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1 rounded bg-pink-100 dark:bg-pink-900/60 text-pink-600 dark:text-pink-400">
                        <BrainCircuit className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold">Expert Behaviorist</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Translates indicators scientifically into animal cognitive insights.
                    </span>
                  </button>

                  {/* Mode 3 */}
                  <button
                    id="btn_mode_alien"
                    type="button"
                    onClick={() => setSelectedMode(AnalysisMode.ALIEN)}
                    className={`p-4 rounded-2xl flex flex-col items-start gap-1 border text-left cursor-pointer transition ${
                      selectedMode === AnalysisMode.ALIEN
                        ? "bg-violet-600/10 border-violet-500 text-violet-700 dark:text-violet-300 ring-2 ring-violet-500/20"
                        : "glass-card hover:bg-gray-150 hover:border-gray-350 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400">
                        <Globe className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold">Alien Specimen</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      AI analyzes subjects as clinical alien biological payloads researching primates.
                    </span>
                  </button>
                </div>
              </div>

              {/* ACTION ROW STEP 3 */}
              <div className="pt-6 flex justify-between border-t border-gray-250 dark:border-gray-850">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition"
                >
                  Back
                </button>

                <button
                  id="btn_commence_analysis"
                  type="button"
                  disabled={!isStep3Valid}
                  onClick={triggerTranslation}
                  className={`px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition duration-250 cursor-pointer ${
                    isStep3Valid
                      ? "bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white shadow-lg shadow-violet-500/15 active:translate-y-0.5"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Translate with AI</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
