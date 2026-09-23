import { Type } from "@google/genai";
import { IFormItem, ICreateFormPayload } from "../form/form.interface";
import { IAIResponsesSummary } from "./ai.constants";
import {
  callGeminiJson,
  normalizeQuestionType,
  sanitizeQuestionItems,
} from "./ai.helpers";
import {
  generateFallbackForm,
  getFallbackOptions,
  getFallbackQuestions,
  getFallbackSummary,
} from "./ai.fallbacks";

/**
 * 1. Generate Full Google Form from user prompt
 */
const generateFormWithAI = async (
  promptText: string,
  _userId?: string
): Promise<ICreateFormPayload> => {
  const parsed = await callGeminiJson<{
    name?: string;
    title?: string;
    description?: string;
    headerImage?: string;
    items?: any[];
  }>(
    `Create a complete Google Form for: "${promptText}". Provide relevant, high quality questions with clear options.`,
    {
      systemInstruction:
        "You are an expert Google Forms Architect. Your sole job is to design complete, realistic, professional Google Forms based on user prompts.\n\nCRITICAL LANGUAGE RULE:\n- ALWAYS detect the language and script of the user's prompt (e.g. Bengali / বাংলা, Spanish, French, Arabic, Hindi, English, etc.) and generate ALL form names, titles, descriptions, question titles, and options in that EXACT SAME language and script as the prompt.\n\nCRITICAL NAMING RULES:\n- 'name': The short document file name displayed in the top header in the prompt's language (2 to 4 words max).\n- 'title': The full, engaging title displayed on the main form card.\n\nQUESTION RULES:\n- Choose the most appropriate questionType ('multiplechoice', 'checkbox', 'shortanswer', 'paragraph').\n- Include 4 to 8 realistic questions. For multiplechoice/checkbox questions, always provide 3 to 6 logical options.",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                questionTitle: { type: Type.STRING },
                questionType: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                required: { type: Type.BOOLEAN },
              },
              required: ["type", "questionTitle", "questionType"],
            },
          },
        },
        required: ["name", "title", "description", "items"],
      },
    }
  );

  const fallback = generateFallbackForm(promptText);
  const data = parsed && Array.isArray(parsed.items) && parsed.items.length > 0 ? parsed : fallback;
  const sanitizedItems = sanitizeQuestionItems(data.items || []);

  return {
    name: (data.name || "").trim() || "Untitled form",
    title: (data.title || "").trim() || "Untitled form",
    description: data.description || "",
    headerImage: data.headerImage || "",
    items: sanitizedItems.length > 0 ? sanitizedItems : fallback.items,
  };
};

/**
 * 2. Generate Choice Options for a specific question
 */
const generateOptionsWithAI = async (
  questionTitle: string,
  questionType: string = "multiplechoice"
): Promise<{ options: string[] }> => {
  const parsed = await callGeminiJson<{ options: string[] }>(
    `Provide 4 to 6 logical, distinct, realistic answer choices for this survey question: "${questionTitle}" (Type: ${questionType}).`,
    {
      systemInstruction:
        "You are a survey and form design specialist. Provide 4 to 6 concise, realistic choice options in the EXACT SAME language and script as the provided question. Return only a JSON array of option strings.",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["options"],
      },
    }
  );

  if (parsed && Array.isArray(parsed.options) && parsed.options.length > 0) {
    return { options: parsed.options.map((opt) => String(opt).trim()) };
  }

  return { options: getFallbackOptions(questionTitle) };
};

/**
 * 3. Generate 1 or multiple Questions based on prompt & optional context
 */
const generateQuestionWithAI = async (
  promptText: string,
  context?: string
): Promise<{ questions: IFormItem[] }> => {
  const cleanPrompt = promptText.trim();
  const effectiveContext = context && context.trim() !== "Untitled form" ? context.trim() : "";

  const parsed = await callGeminiJson<{ questions?: any[]; question?: any }>(
    `Create Google Form questions for: "${cleanPrompt}". ${effectiveContext ? `Form Context / Topic: "${effectiveContext}".` : "Context: General project / survey topic"}`,
    {
      systemInstruction:
        "You are an expert Google Forms Architect.\n\nCRITICAL QUESTION COUNT RULES:\n- If the user prompt requests a specific number of questions (e.g. '1 question', '2 questions', '3 questions', '5 questions'), generate EXACTLY that number of questions.\n- If NO number of questions is specified, generate 2 to 4 diverse, high-quality questions.\n- Only generate 1 single question if the prompt explicitly asks for 1 question.\n\nCRITICAL LANGUAGE RULE:\n- ALWAYS match the language and script of the user's prompt (e.g. Bengali / বাংলা).\n\nQUESTION RULES:\n- Never output placeholder names like 'Option 1'. Always create realistic, relevant options.\n- Select the best questionType ('multiplechoice', 'checkbox', 'shortanswer', 'paragraph').",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                questionTitle: { type: Type.STRING },
                questionType: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                required: { type: Type.BOOLEAN },
              },
              required: ["type", "questionTitle", "questionType"],
            },
          },
        },
        required: ["questions"],
      },
    }
  );

  const rawQuestions = parsed?.questions || (parsed?.question ? [parsed.question] : []);
  if (Array.isArray(rawQuestions) && rawQuestions.length > 0) {
    return { questions: sanitizeQuestionItems(rawQuestions) };
  }

  return { questions: getFallbackQuestions(cleanPrompt) };
};

/**
 * 4. Edit or Refine an existing Question or Form Header
 */
const editQuestionWithAI = async (
  instruction: string,
  currentQuestion: Partial<IFormItem> & { isHeader?: boolean; title?: string },
  formTitle?: string
): Promise<{ question?: IFormItem; header?: { title: string; description: string } }> => {
  const isHeader = Boolean(currentQuestion.isHeader || (currentQuestion.type as string) === "header");

  if (isHeader) {
    const parsed = await callGeminiJson<{ title?: string; description?: string }>(
      `Refine/rewrite the following Google Form Title and Description based on the user's instruction.\nInstruction: "${instruction}"\nCurrent Form Title: "${currentQuestion.title || currentQuestion.questionTitle || formTitle || "Untitled form"}"\nCurrent Form Description: "${currentQuestion.description || ""}"`,
      {
        systemInstruction:
          "You are an expert Google Forms Architect. Polish or rewrite the form title and description to make it professional, engaging, and clear. CRITICAL: Preserve and use the same language and script (e.g. Bengali / বাংলা). Return JSON with 'title' and 'description'.",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ["title", "description"],
        },
      }
    );

    return {
      header: {
        title: parsed?.title || currentQuestion.title || currentQuestion.questionTitle || formTitle || "Untitled form",
        description: parsed?.description ?? (currentQuestion.description || ""),
      },
    };
  }

  const parsed = await callGeminiJson<any>(
    `Modify and refine the following Google Form question according to the user's instruction.\nInstruction: "${instruction}"\nCurrent Question Title: "${currentQuestion.questionTitle || "Untitled Question"}"\nCurrent Question Type: "${currentQuestion.questionType || "multiplechoice"}"\nCurrent Options: ${JSON.stringify(currentQuestion.options || [])}\n${formTitle ? `Form Context: "${formTitle}"` : ""}`,
    {
      systemInstruction:
        "You are an expert Google Forms Architect. Your job is to edit, refine, polish, or rewrite the provided question according to the user's instructions (improving tone, changing question type, rephrasing, or generating better options). Always return a complete question object.",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questionTitle: { type: Type.STRING },
          questionType: { type: Type.STRING },
          description: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          required: { type: Type.BOOLEAN },
        },
        required: ["questionTitle", "questionType"],
      },
    }
  );

  if (parsed) {
    const qType = normalizeQuestionType(parsed.questionType || currentQuestion.questionType);
    const needsOptions = ["multiplechoice", "checkbox", "dropdown"].includes(qType);

    return {
      question: {
        type: "question",
        questionTitle: parsed.questionTitle || currentQuestion.questionTitle || "Untitled Question",
        questionType: qType,
        description: parsed.description ?? currentQuestion.description ?? "",
        options: needsOptions
          ? Array.isArray(parsed.options) && parsed.options.length > 0
            ? parsed.options
            : currentQuestion.options || ["Option 1", "Option 2"]
          : [],
        required: Boolean(parsed.required ?? currentQuestion.required),
      },
    };
  }

  return {
    question: {
      type: "question",
      questionTitle: currentQuestion.questionTitle || "Untitled Question",
      questionType: currentQuestion.questionType || "multiplechoice",
      description: currentQuestion.description || "",
      options: currentQuestion.options || ["Option 1", "Option 2"],
      required: Boolean(currentQuestion.required),
    },
  };
};

/**
 * 5. Generate High-Res Image with AI (Base64 Data URI Conversion)
 */
const generateImageWithAI = async (
  promptText: string,
  aspectRatio: string = "16:9",
  style?: string
): Promise<{ imageUrl: string }> => {
  const cleanPrompt = promptText.trim();
  const styleInstruction = style ? `, in ${style} aesthetic style` : "";
  const enhancedPrompt = `${cleanPrompt}${styleInstruction}, clean high resolution, professional quality for Google Form`;

  const width = aspectRatio === "16:9" ? 1200 : aspectRatio === "4:3" ? 800 : 800;
  const height = aspectRatio === "16:9" ? 675 : aspectRatio === "4:3" ? 600 : 800;
  const seed = Math.floor(Math.random() * 999999);
  const encodedPrompt = encodeURIComponent(enhancedPrompt);
  const generatorUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const response = await fetch(generatorUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      if (buffer && buffer.byteLength > 0) {
        const base64 = Buffer.from(buffer).toString("base64");
        const mimeType = response.headers.get("content-type") || "image/jpeg";
        return { imageUrl: `data:${mimeType};base64,${base64}` };
      }
    }
  } catch (err: any) {
    console.warn("Direct image buffer download fallback:", err?.message);
  }

  return { imageUrl: generatorUrl };
};

/**
 * 6. Summarize Form Responses & Calculate Sentiment Insights
 */
const summarizeResponsesWithAI = async (
  formTitle: string,
  questions: any[] = [],
  responses: any[] = []
): Promise<IAIResponsesSummary> => {
  const count = responses.length;
  if (count === 0) {
    return getFallbackSummary(0, formTitle);
  }

  const questionsMap: Record<number, string> = {};
  questions.forEach((q, idx) => {
    if (q.questionTitle) questionsMap[idx] = q.questionTitle;
  });

  const formattedResponses = responses
    .slice(0, 100)
    .map((r, rIdx) => {
      const answersText = Array.isArray(r.answers)
        ? r.answers
            .map((a: any) => {
              const qTitle = questionsMap[a.itemIndex] || `Question ${a.itemIndex + 1}`;
              const val = Array.isArray(a.value) ? a.value.join(", ") : String(a.value ?? "");
              return `  - ${qTitle}: "${val}"`;
            })
            .join("\n")
        : "  No answers recorded";
      return `Response #${rIdx + 1}:\n${answersText}`;
    })
    .join("\n\n");

  const parsed = await callGeminiJson<IAIResponsesSummary>(
    `Analyze the following responses submitted for the form titled: "${formTitle || 'Untitled Form'}".\n\nTotal Responses Submitted: ${count}\nSample Submissions:\n${formattedResponses}\n\nGenerate an analytical summary in JSON with executiveSummary, sentiment ({ positive, neutral, negative }), keyThemes (string[]), and recommendations (string[]).`,
    {
      systemInstruction:
        "You are a professional survey research and business intelligence analyst. Generate a comprehensive analytical summary in strict JSON format. Sentiment positive + neutral + negative must equal 100.",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          executiveSummary: { type: Type.STRING },
          sentiment: {
            type: Type.OBJECT,
            properties: {
              positive: { type: Type.NUMBER },
              neutral: { type: Type.NUMBER },
              negative: { type: Type.NUMBER },
            },
            required: ["positive", "neutral", "negative"],
          },
          keyThemes: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["executiveSummary", "sentiment", "keyThemes", "recommendations"],
      },
    }
  );

  if (parsed && parsed.executiveSummary) {
    return {
      executiveSummary: parsed.executiveSummary,
      sentiment: {
        positive: typeof parsed.sentiment?.positive === "number" ? parsed.sentiment.positive : 70,
        neutral: typeof parsed.sentiment?.neutral === "number" ? parsed.sentiment.neutral : 20,
        negative: typeof parsed.sentiment?.negative === "number" ? parsed.sentiment.negative : 10,
      },
      keyThemes: Array.isArray(parsed.keyThemes) && parsed.keyThemes.length > 0
        ? parsed.keyThemes
        : ["Consistent respondent engagement", "Clear preferences identified"],
      recommendations: Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0
        ? parsed.recommendations
        : ["Continue collecting responses for deeper statistical trends", "Implement top requested improvements"],
      responseCount: count,
    };
  }

  return getFallbackSummary(count, formTitle);
};

export const AiService = {
  generateFormWithAI,
  generateOptionsWithAI,
  generateQuestionWithAI,
  editQuestionWithAI,
  generateImageWithAI,
  summarizeResponsesWithAI,
};
