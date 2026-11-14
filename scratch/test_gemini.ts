import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

console.log("GEMINI_API_KEY is defined:", !!process.env.GEMINI_API_KEY);
if (process.env.GEMINI_API_KEY) {
  console.log("Key prefix:", process.env.GEMINI_API_KEY.slice(0, 5) + "...");
}

try {
  console.log("Testing GoogleGenAI initialization...");
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy_key" });
  console.log("Success! Instance created:", typeof ai.models.generateContent);
} catch (err) {
  console.error("Initialization failed:", err);
}
