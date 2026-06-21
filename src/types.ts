/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum PetType {
  DOG = "Dog",
  CAT = "Cat",
  BIRD = "Bird",
  RABBIT = "Rabbit",
  HAMSTER = "Hamster",
  PARROT = "Parrot",
  FISH = "Fish",
  OTHER = "Other"
}

export enum AnalysisMode {
  FUNNY = "funny",
  EXPERT = "expert",
  ALIEN = "alien"
}

export interface PetProfile {
  name: string;
  type: PetType;
  breed: string;
  age: string;
  gender: string;
}

export interface EmotionalState {
  happy: number;
  excited: number;
  curious: number;
  relaxed: number;
  playful: number;
  hungry: number;
  stressed: number;
  anxious: number;
  protective: number;
}

export interface PersonalityDNA {
  personalityType: string;
  energyLevel: number; // 0-100
  curiosityLevel: number; // 0-100
  intelligenceEstimate: number; // 0-100
  mischiefRating: number; // 0-100
  socialRating: number; // 0-100
  loyaltyRating: number; // 0-100
}

export interface Reputation {
  title: string;
  badgeEmoji: string;
  description: string;
}

export interface AnalysisResult {
  id: string;
  petProfile: PetProfile;
  mode: AnalysisMode;
  timestamp: string;
  whatPetSays: string;
  emotionalState: EmotionalState;
  moodScore: number;
  moodTitle: string;
  behaviorExplanation: string;
  suggestedHumanResponse: string[];
  confidenceLevel: number;
  personalityDNA: PersonalityDNA;
  horoscope: string;
  secretThoughts: string[];
  reputation: Reputation;
  imageDataUrl?: string; // Stored locally for reference
  situation: string;
}
