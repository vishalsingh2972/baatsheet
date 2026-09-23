import { ICreateFormPayload } from "./form.interface";

export const normalizeQuestionType = (typeStr?: string): string => {
  const t = (typeStr || "").toLowerCase().trim();
  if (t.includes("check") || t === "checkboxes") return "checkbox";
  if (t.includes("multiple") || t.includes("choice") || t.includes("radio")) return "multiplechoice";
  if (t.includes("paragraph") || t === "textarea" || t === "long" || t.includes("essay")) return "paragraph";
  if (t.includes("drop") || t.includes("select")) return "dropdown";
  if (t.includes("short") || t.includes("text") || t.includes("input") || t.includes("name") || t.includes("email")) return "shortanswer";
  return "shortanswer";
};

export const generateFallbackForm = (promptText: string): ICreateFormPayload => {
  const cleanPrompt = promptText.trim();
  const titleCase = cleanPrompt.charAt(0).toUpperCase() + cleanPrompt.slice(1);
  const p = cleanPrompt.toLowerCase();

  // Keyword: Job / Hiring
  if (
    p.includes("job") ||
    p.includes("hire") ||
    p.includes("resume") ||
    p.includes("career") ||
    p.includes("interview") ||
    p.includes("application")
  ) {
    return {
      name: `${titleCase} Application`,
      title: `${titleCase} Application Form`,
      description: `Please complete this application form for ${cleanPrompt} with your background and qualifications.`,
      headerImage:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
      items: [
        { type: "question", questionTitle: "Full Name", questionType: "shortanswer", required: true },
        { type: "question", questionTitle: "Email Address", questionType: "shortanswer", required: true },
        { type: "question", questionTitle: "Phone Number", questionType: "shortanswer", required: true },
        {
          type: "question",
          questionTitle: "Years of Relevant Experience",
          questionType: "multiplechoice",
          options: ["0-1 years", "2-4 years", "5-8 years", "8+ years"],
          required: true,
        },
        {
          type: "question",
          questionTitle: "Primary Skills & Competencies",
          questionType: "checkbox",
          options: [
            "Core Technical Skills",
            "Project Management",
            "Communication & Teamwork",
            "Problem Solving",
          ],
          required: true,
        },
        { type: "question", questionTitle: "Portfolio or Resume Link", questionType: "shortanswer", required: false },
        {
          type: "question",
          questionTitle: "Why are you a great fit for this opportunity?",
          questionType: "paragraph",
          required: false,
        },
      ],
    };
  }

  // Keyword: Quiz / Test / Exam / School
  if (
    p.includes("quiz") ||
    p.includes("test") ||
    p.includes("exam") ||
    p.includes("math") ||
    p.includes("science") ||
    p.includes("history") ||
    p.includes("student")
  ) {
    return {
      name: `${titleCase} Quiz`,
      title: `${titleCase} Knowledge Assessment`,
      description: `Test your knowledge on ${cleanPrompt}. Answer all questions to the best of your ability.`,
      headerImage:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80",
      items: [
        { type: "question", questionTitle: "Participant / Student Name", questionType: "shortanswer", required: true },
        {
          type: "question",
          questionTitle: `Question 1: What is the fundamental concept behind ${cleanPrompt}?`,
          questionType: "multiplechoice",
          options: ["Core principle A", "Alternative concept B", "Theoretical approach C", "None of the above"],
          required: true,
        },
        {
          type: "question",
          questionTitle: `Question 2: Select all key attributes related to ${cleanPrompt}:`,
          questionType: "checkbox",
          options: ["Primary Attribute 1", "Secondary Attribute 2", "Attribute 3", "Attribute 4"],
          required: true,
        },
        {
          type: "question",
          questionTitle: `Question 3: Briefly explain your understanding of ${cleanPrompt} in your own words.`,
          questionType: "paragraph",
          required: true,
        },
        {
          type: "question",
          questionTitle: "Question 4: Rate your confidence level on this topic:",
          questionType: "multiplechoice",
          options: ["Very Confident", "Somewhat Confident", "Need More Practice"],
          required: false,
        },
      ],
    };
  }

  // Keyword: Event / RSVP / Party / Booking / Travel
  if (
    p.includes("rsvp") ||
    p.includes("event") ||
    p.includes("party") ||
    p.includes("trip") ||
    p.includes("travel") ||
    p.includes("wedding") ||
    p.includes("dinner") ||
    p.includes("conference") ||
    p.includes("workshop")
  ) {
    return {
      name: `${titleCase} RSVP`,
      title: `${titleCase} Registration Form`,
      description: `Please register your attendance for ${cleanPrompt} so we can make necessary arrangements.`,
      headerImage:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&auto=format&fit=crop&q=80",
      items: [
        { type: "question", questionTitle: "Your Name", questionType: "shortanswer", required: true },
        { type: "question", questionTitle: "Email Address", questionType: "shortanswer", required: true },
        {
          type: "question",
          questionTitle: "Will you attend?",
          questionType: "multiplechoice",
          options: ["Yes, I will attend", "No, I cannot attend", "Maybe / Tentative"],
          required: true,
        },
        {
          type: "question",
          questionTitle: "Number of guests attending with you:",
          questionType: "multiplechoice",
          options: ["0 (Just me)", "1 guest", "2 guests", "3+ guests"],
          required: true,
        },
        {
          type: "question",
          questionTitle: "Special preferences or requirements:",
          questionType: "checkbox",
          options: [
            "Vegetarian / Vegan",
            "Gluten-Free",
            "Accessibility Accommodations",
            "No special requirements",
          ],
          required: false,
        },
        {
          type: "question",
          questionTitle: "Any additional notes or questions for organizers?",
          questionType: "paragraph",
          required: false,
        },
      ],
    };
  }

  // Keyword: Survey / Feedback / Review / Rating / Poll
  if (
    p.includes("feedback") ||
    p.includes("survey") ||
    p.includes("review") ||
    p.includes("rating") ||
    p.includes("satisfaction") ||
    p.includes("poll")
  ) {
    return {
      name: `${titleCase}`,
      title: `${titleCase}`,
      description: `We appreciate your valuable feedback regarding ${cleanPrompt}.`,
      headerImage:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80",
      items: [
        { type: "question", questionTitle: "Name (Optional)", questionType: "shortanswer", required: false },
        {
          type: "question",
          questionTitle: `How would you rate your overall experience with ${cleanPrompt}?`,
          questionType: "multiplechoice",
          options: [
            "Excellent (5/5)",
            "Very Good (4/5)",
            "Average (3/5)",
            "Poor (2/5)",
            "Very Poor (1/5)",
          ],
          required: true,
        },
        {
          type: "question",
          questionTitle: `What did you like most about ${cleanPrompt}?`,
          questionType: "checkbox",
          options: [
            "Quality & Effectiveness",
            "Ease of Use",
            "Speed & Timeliness",
            "Customer Support",
            "Value for Money",
          ],
          required: true,
        },
        {
          type: "question",
          questionTitle: `Would you recommend ${cleanPrompt} to others?`,
          questionType: "multiplechoice",
          options: ["Definitely", "Probably", "Not Sure", "No"],
          required: true,
        },
        {
          type: "question",
          questionTitle: "How can we make improvements in the future?",
          questionType: "paragraph",
          required: false,
        },
      ],
    };
  }

  // Dynamic Contextual Form for ANY Custom Prompt
  return {
    name: `${titleCase} Form`,
    title: `${titleCase} Form`,
    description: `Please fill out this form regarding ${cleanPrompt}.`,
    headerImage:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80",
    items: [
      { type: "question", questionTitle: "Your Full Name", questionType: "shortanswer", required: true },
      { type: "question", questionTitle: "Contact Email", questionType: "shortanswer", required: true },
      {
        type: "question",
        questionTitle: `What is your primary interest in ${cleanPrompt}?`,
        questionType: "multiplechoice",
        options: [
          "General Interest",
          "Business / Professional",
          "Academic / Research",
          "Personal Project",
        ],
        required: true,
      },
      {
        type: "question",
        questionTitle: `Which aspects of ${cleanPrompt} are most relevant to you?`,
        questionType: "checkbox",
        options: [
          "Option A: Key Features",
          "Option B: Practical Application",
          "Option C: Pricing / Plans",
          "Option D: Consultation & Support",
        ],
        required: false,
      },
      {
        type: "question",
        questionTitle: `Please provide more details or thoughts about ${cleanPrompt}:`,
        questionType: "paragraph",
        required: false,
      },
    ],
  };
};
