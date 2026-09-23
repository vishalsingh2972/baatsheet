import { IFormItem, ICreateFormPayload } from "../form/form.interface";
import { IAIResponsesSummary } from "./ai.constants";

export const generateFallbackForm = (promptText: string): ICreateFormPayload => {
  const p = promptText.toLowerCase();

  if (p.includes("quiz") || p.includes("exam") || p.includes("test")) {
    return {
      name: "Knowledge Assessment Quiz",
      title: "Knowledge Assessment & Quiz",
      description: "Please answer all the questions below to test your knowledge.",
      headerImage: "",
      items: [
        {
          type: "question",
          questionTitle: "What is the primary topic covered in this assessment?",
          questionType: "multiplechoice",
          options: ["Core Fundamentals", "Advanced Concepts", "Practical Application", "All of the Above"],
          required: true,
        },
        {
          type: "question",
          questionTitle: "Select all concepts that apply:",
          questionType: "checkbox",
          options: ["Theoretical Principles", "Practical Techniques", "Case Studies", "Historical Context"],
          required: false,
        },
        {
          type: "question",
          questionTitle: "Please explain a key concept in your own words:",
          questionType: "paragraph",
          options: [],
          required: true,
        },
      ],
    };
  }

  return {
    name: promptText.slice(0, 30) || "Feedback Survey",
    title: promptText || "Feedback Survey Form",
    description: "Thank you for taking the time to complete this form. Your feedback is very valuable to us.",
    headerImage: "",
    items: [
      {
        type: "question",
        questionTitle: "How would you rate your overall experience?",
        questionType: "multiplechoice",
        options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
        required: true,
      },
      {
        type: "question",
        questionTitle: "What did you like most?",
        questionType: "checkbox",
        options: ["Ease of Use", "Speed & Performance", "Design & Aesthetics", "Customer Support", "Value for Money"],
        required: false,
      },
      {
        type: "question",
        questionTitle: "What areas do you think need improvement?",
        questionType: "paragraph",
        options: [],
        required: false,
      },
      {
        type: "question",
        questionTitle: "How likely are you to recommend this to a friend or colleague?",
        questionType: "multiplechoice",
        options: ["Extremely Likely", "Very Likely", "Somewhat Likely", "Not Likely"],
        required: true,
      },
      {
        type: "question",
        questionTitle: "Any additional comments or suggestions?",
        questionType: "paragraph",
        options: [],
        required: false,
      },
    ],
  };
};

export const getFallbackOptions = (questionTitle: string): string[] => {
  const q = questionTitle.toLowerCase();
  if (q.includes("experience") || q.includes("year")) {
    return ["Less than 1 year", "1-2 years", "3-5 years", "5+ years"];
  }
  if (q.includes("rate") || q.includes("satisfied") || q.includes("satisfaction") || q.includes("how was")) {
    return ["Very Satisfied", "Satisfied", "Neutral", "Unsatisfied", "Very Unsatisfied"];
  }
  if (q.includes("agree")) {
    return ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"];
  }
  if (q.includes("how often") || q.includes("frequency")) {
    return ["Daily", "Weekly", "Monthly", "Rarely", "Never"];
  }
  if (q.includes("gender")) {
    return ["Female", "Male", "Non-binary", "Prefer not to say"];
  }
  if (q.includes("recommend")) {
    return ["Definitely", "Probably", "Not Sure", "Probably Not", "Definitely Not"];
  }

  return ["Option 1", "Option 2", "Option 3", "Option 4"];
};

export const getFallbackQuestions = (promptText: string): IFormItem[] => {
  const cleanPrompt = promptText.trim();
  const matchNum = cleanPrompt.match(/(\d+)\s*(?:question|item)/i);
  const count = matchNum ? Math.min(Math.max(parseInt(matchNum[1], 10), 1), 5) : 2;
  const fallbackList: IFormItem[] = [];

  for (let i = 1; i <= count; i++) {
    fallbackList.push({
      type: "question",
      questionTitle: count === 1 ? cleanPrompt || "Untitled Question" : `Question ${i}: ${cleanPrompt}`,
      questionType: "multiplechoice",
      options: ["Strongly Agree", "Agree", "Neutral", "Disagree"],
      required: false,
    });
  }

  return fallbackList;
};

export const getFallbackSummary = (count: number, formTitle?: string): IAIResponsesSummary => {
  if (count === 0) {
    return {
      executiveSummary: "No responses have been submitted to this form yet.",
      sentiment: { positive: 0, neutral: 100, negative: 0 },
      keyThemes: ["Waiting for initial submissions"],
      recommendations: ["Share the form link to start collecting responses"],
      responseCount: 0,
    };
  }

  return {
    executiveSummary: `Analyzed ${count} response(s) for "${formTitle || 'this form'}". Respondents have provided initial feedback across all questions.`,
    sentiment: { positive: 65, neutral: 25, negative: 10 },
    keyThemes: [
      "Broad interest in the form's core topic",
      "Varied preferences across choices",
      "Constructive suggestions provided in open-ended fields",
    ],
    recommendations: [
      "Monitor response trends as more submissions arrive",
      "Follow up on specific respondent suggestions",
    ],
    responseCount: count,
  };
};
