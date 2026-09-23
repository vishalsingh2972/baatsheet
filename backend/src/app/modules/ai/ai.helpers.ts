import { GoogleGenAI } from "@google/genai";
import config from "../../../config";
import { CANDIDATE_GEMINI_MODELS } from "./ai.constants";
import { IFormItem } from "../form/form.interface";

export interface IGeminiJsonOptions {
  systemInstruction?: string;
  responseSchema?: any;
}

export const callGeminiJson = async <T>(
  prompt: string,
  options: IGeminiJsonOptions = {}
): Promise<T | null> => {
  if (!config.gemini_api_key || config.gemini_api_key.trim() === "") {
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: config.gemini_api_key.trim() });

  for (const modelName of CANDIDATE_GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: options.systemInstruction,
          responseMimeType: "application/json",
          responseSchema: options.responseSchema,
        },
      });

      const rawText = response.text;
      if (rawText) {
        const cleanText = rawText
          .replace(/```(?:json)?/gi, "")
          .replace(/```/g, "")
          .trim();

        const parsed = JSON.parse(cleanText);
        if (parsed) {
          return parsed as T;
        }
      }
    } catch (err: any) {
      console.warn(`Attempt with ${modelName} failed (${err?.message}), trying next model...`);
    }
  }

  return null;
};

export const normalizeQuestionType = (raw: string | undefined): string => {
  if (!raw) return "multiplechoice";
  const lower = raw.toLowerCase().replace(/[-_\s]/g, "");
  if (
    lower.includes("multi") ||
    lower === "mcq" ||
    lower === "radio" ||
    lower.includes("drop") ||
    lower.includes("select")
  ) {
    return "multiplechoice";
  }
  if (lower.includes("check") || lower.includes("box")) return "checkbox";
  if (lower.includes("para") || lower.includes("long") || lower.includes("area")) {
    return "paragraph";
  }
  if (lower.includes("short") || lower.includes("text") || lower.includes("input")) {
    return "shortanswer";
  }
  return "multiplechoice";
};

export const sanitizeQuestionItem = (item: any): IFormItem => {
  const qType = normalizeQuestionType(item.questionType);
  const needsOptions = ["multiplechoice", "checkbox", "dropdown"].includes(qType);

  return {
    type: "question",
    questionTitle: (item.questionTitle || item.title || "Untitled Question").trim(),
    questionType: qType,
    description: item.description || "",
    options: needsOptions
      ? Array.isArray(item.options) && item.options.length > 0
        ? item.options.map((opt: any) => String(opt).trim())
        : ["Option 1", "Option 2", "Option 3"]
      : [],
    required: Boolean(item.required),
  };
};

export const sanitizeQuestionItems = (items: any[]): IFormItem[] => {
  if (!Array.isArray(items) || items.length === 0) return [];
  return items.map(sanitizeQuestionItem);
};
