import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily to prevent crash if key is missing on startup
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Using fallback mock content.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// -------------------------------------------------------------------------
// 1. AI Chatbot API Endpoint
// -------------------------------------------------------------------------
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.json({
      text: "Hello! I am the **BIPLOB AI Assistant**. Since the Gemini API Key is not configured in your Secrets panel, I am running in demo mode.\n\nI can help guide you through international career opportunities, required skill trade courses (Welder, Plumber, Plumber, Caregiver), and language preparation (Japanese, Korean, German, English). Feel free to ask me questions like 'How do I work as a caregiver in Japan?' or 'What training is needed for a welder?'."
    });
  }

  try {
    const ai = getGeminiClient();
    
    // Format history for Gemini chat if present, or just pass a system instruction
    const systemInstruction = `You are "BIPLOB AI Assistant", the friendly and professional career advisor for BIPLOB (Global Skills & Overseas Career Platform). 
Your goal is to guide skilled and unskilled workers from Bangladesh towards lucrative international careers.
Key rules:
1. Provide accurate and practical advice about overseas careers, vocational training, trade programs (Welder, Plumber, Electrician, HVAC, Caregiver, Hospitality, Commercial Cook), and language tests (IELTS, JLPT/NAT-TEST, TOPIK, German Goethe-Zertifikat, Arabic).
2. STICK STRICTLY to facts. DO NOT guarantee jobs or visa approvals.
3. ALWAYS state clearly that visa decisions are solely made by relevant government authorities and licensed employers.
4. Keep answers encouraging, scannable, and formatted in clear Markdown with bullet points where appropriate.
5. You must write answers in friendly English, but you can understand and mix in occasional Bangla expressions (e.g. "Assalamu Alaikum", "Apnar careere amra sahajjo korbo") to make users feel welcome.
6. Avoid giving legal immigration advice. Recommend official government portals or verified licensed recruitment partners when appropriate.`;

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    // In a simple stateless express route, we can send a single message or pass historical messages
    // Let's create a prompt containing history context to maintain state in this endpoint
    let formattedPrompt = "";
    if (history && Array.isArray(history) && history.length > 0) {
      formattedPrompt += "Here is the conversation history for context:\n";
      history.forEach((h: any) => {
        formattedPrompt += `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}\n`;
      });
      formattedPrompt += `\nNow, respond to the user's latest message:\nUser: ${message}`;
    } else {
      formattedPrompt = message;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedPrompt,
      config: {
        systemInstruction,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({ error: "Failed to generate AI response. Please try again." });
  }
});

// -------------------------------------------------------------------------
// 2. AI Career Assessment API Endpoint
// -------------------------------------------------------------------------
app.post("/api/career-assessment", async (req, res) => {
  const profile = req.body;
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Return standard mock assessment if key is missing
    return res.json({
      suitableOccupations: [
        "Certified Professional Caregiver / Support Worker",
        "Hospitality and Food Services Assistant"
      ],
      recommendedCountries: [
        { name: "Japan", demandLevel: "Very High", averageSalary: "$1,800 - $2,500 / month" },
        { name: "Germany", demandLevel: "High", averageSalary: "€2,200 - €3,000 / month" },
        { name: "Saudi Arabia", demandLevel: "Stable", averageSalary: "$600 - $1,000 / month" }
      ],
      trainingRecommendation: "Enroll in the standard Caregiver 3-Month Trade Program at BIPLOB Language & Trade Academy, including basic medical terms and safety guidelines.",
      languageRoadmap: [
        { language: "Japanese", levelRequired: "N5 Level (JLPT / NAT-TEST)", timeline: "3 - 4 Months intensive coaching", focus: "Basic listening, patient interaction phrases" },
        { language: "German", levelRequired: "A2 Level (Goethe-Zertifikat)", timeline: "5 - 6 Months intensive coaching", focus: "Conversational fluency, medical vocabulary" }
      ],
      budgetAnalysis: {
        trainingFees: "BDT 15,000",
        languageCourseFees: "BDT 10,000",
        examAndCertification: "BDT 8,000",
        estimatedVisaAirfare: "BDT 120,000 - 250,000 (Varies by employer sponsorships)",
        totalEstimatedBudget: "BDT 153,000 - 283,000",
        tips: "Many Japanese employers sponsor airfare and visa expenses under the Specified Skilled Worker (SSW) program. German vocational programs (Ausbildung) are tuition-free and offer a monthly allowance."
      },
      estimatedTimelineMonths: 6,
      preparationChecklist: [
        { step: "Enroll in BIPLOB Caregiver trade program", duration: "3 Months", status: "Recommended" },
        { step: "Start Japanese N5 or German A2 language prep", duration: "4-5 Months", status: "Recommended" },
        { step: "Register and sit for the language & trade tests", duration: "1 Month", status: "Critical Path" },
        { step: "Prepare standardized CV & submit to verified BIPLOB Recruitment Partners", duration: "2 Weeks", status: "Placement" },
        { step: "Attend Employer Interviews (Virtual/In-person)", duration: "1 Month", status: "Interview" },
        { step: "Visa processing & Employer Contract Signing", duration: "2-3 Months", status: "Finalization" }
      ],
      disclaimer: "This roadmap is generated based on public requirements. Visa and placement outcomes depend entirely on official authority and licensed employer sponsorships. BIPLOB does not guarantee jobs or visas."
    });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Perform a comprehensive, realistic overseas career assessment based on this user profile:
${JSON.stringify(profile, null, 2)}

Provide the assessment in clean JSON adhering strictly to this schema:
{
  "suitableOccupations": ["String", "String"],
  "recommendedCountries": [
    { "name": "String", "demandLevel": "String (e.g. High, Medium)", "averageSalary": "String" }
  ],
  "trainingRecommendation": "String summarizing specific trade courses",
  "languageRoadmap": [
    { "language": "String", "levelRequired": "String", "timeline": "String", "focus": "String" }
  ],
  "budgetAnalysis": {
    "trainingFees": "String in BDT",
    "languageCourseFees": "String in BDT",
    "examAndCertification": "String in BDT",
    "estimatedVisaAirfare": "String in BDT",
    "totalEstimatedBudget": "String in BDT",
    "tips": "String detailing cost saving or sponsorship tips"
  },
  "estimatedTimelineMonths": 6,
  "preparationChecklist": [
    { "step": "String", "duration": "String", "status": "String" }
  ],
  "disclaimer": "String clearly stating that visa decisions are made by relevant government authorities and employers."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suitableOccupations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendedCountries: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  demandLevel: { type: Type.STRING },
                  averageSalary: { type: Type.STRING }
                },
                required: ["name", "demandLevel", "averageSalary"]
              }
            },
            trainingRecommendation: { type: Type.STRING },
            languageRoadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  language: { type: Type.STRING },
                  levelRequired: { type: Type.STRING },
                  timeline: { type: Type.STRING },
                  focus: { type: Type.STRING }
                },
                required: ["language", "levelRequired", "timeline", "focus"]
              }
            },
            budgetAnalysis: {
              type: Type.OBJECT,
              properties: {
                trainingFees: { type: Type.STRING },
                languageCourseFees: { type: Type.STRING },
                examAndCertification: { type: Type.STRING },
                estimatedVisaAirfare: { type: Type.STRING },
                totalEstimatedBudget: { type: Type.STRING },
                tips: { type: Type.STRING }
              },
              required: ["trainingFees", "languageCourseFees", "examAndCertification", "estimatedVisaAirfare", "totalEstimatedBudget", "tips"]
            },
            estimatedTimelineMonths: { type: Type.INTEGER },
            preparationChecklist: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  status: { type: Type.STRING }
                },
                required: ["step", "duration", "status"]
              }
            },
            disclaimer: { type: Type.STRING }
          },
          required: [
            "suitableOccupations",
            "recommendedCountries",
            "trainingRecommendation",
            "languageRoadmap",
            "budgetAnalysis",
            "estimatedTimelineMonths",
            "preparationChecklist",
            "disclaimer"
          ]
        },
        temperature: 0.3,
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Career Assessment API Error:", error);
    res.status(500).json({ error: "Failed to generate AI Career Assessment. Please try again." });
  }
});

// -------------------------------------------------------------------------
// 3. AI Resume Builder API Endpoint
// -------------------------------------------------------------------------
app.post("/api/resume-builder", async (req, res) => {
  const resumeDetails = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.json({
      resumeMarkdown: `# ${resumeDetails.fullName || 'Muhammad Rafiq'}\n\n**Trade:** Professional Caregiver / Technical Support Worker  \n**Location:** Dhaka, Bangladesh | **Email:** ${resumeDetails.email || 'rafiq@example.com'} | **Phone:** ${resumeDetails.phone || '+880 1712-345678'}\n\n---\n\n### PROFESSIONAL SUMMARY\nHighly motivated and skilled caregiver with certified vocational training from BIPLOB Skills Academy. Proficient in elderly care, medical safety guidelines, and fluent in conversational Japanese (N5 preparation). Eager to contribute to high-quality healthcare operations in Japan.\n\n### EDUCATION & CERTIFICATION\n- **Professional Caregiver Trade Certification** – BIPLOB Skills Academy (Dhaka) | 2026\n- **Secondary School Certificate (SSC)** – Dhaka Board | Grade: GPA 4.2/5.0\n- **Basic First Aid & Elderly Care Specialist** – National Skill Development Authority (NSDA)\n\n### TECHNICAL SKILLS\n- Elderly Support & Rehabilitation Assistance\n- Vital Sign Monitoring & Medical Hygiene\n- Emergency Response, Safety Compliance & CPR\n- Patient Dignity & Companionship Care\n- Japanese Language (Conversational - N5 ongoing)\n\n### EXPERIENCE\n**Volunteer Healthcare Assistant**  \n*Dhaka Community Medical Center* | Jan 2025 – Dec 2025  \n- Assisted senior nursing staff in patient care, transport, and non-clinical hygiene.\n- Maintained sterile patient environments and coordinated meal service schedules.\n\n### LANGUAGES\n- **Bengali:** Native\n- **English:** Conversational (IELTS 5.5 equivalent)\n- **Japanese:** Beginner (NAT-TEST N5 Level Ongoing)\n\n---`,
      coverLetterMarkdown: `Dear Hiring Team,\n\nI am writing to express my eager interest in the Caregiver opportunities available in Japan through your verified recruitment program. Having completed a rigorous 3-month Professional Caregiver Trade Course at BIPLOB Academy, combined with hands-on volunteer clinic experience in Dhaka, I am fully equipped to join your healthcare team under the Specified Skilled Worker (SSW) pathway.\n\nMy training has certified me in essential caregiving procedures, including vital signs tracking, senior mobility support, and emergency medical hygiene. Crucially, I am studying Japanese intensively (N5 preparation) to communicate warmly and effectively with residents and staff. I believe my work ethic, patience, and technical preparation make me a strong candidate.\n\nThank you for your time and consideration. I look forward to an opportunity to discuss how I can bring my passion and skills to your organization.\n\nSincerely,\n${resumeDetails.fullName || 'Muhammad Rafiq'}`
    });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `You are a certified professional CV and resume coach specialized in helping skilled Bangladeshi workers match overseas job profiles in countries like Japan, Germany, Middle East, Korea, and EU countries.
Based on this raw information:
${JSON.stringify(resumeDetails, null, 2)}

Generate two things returned in a strict JSON format with exactly these two keys:
1. "resumeMarkdown": A beautifully structured resume in Markdown format. Use professional headers, dividers, bold lists, and structured bullet points. Translate raw details into impressive, action-oriented descriptions. Keep it highly standard, clean, and employer-ready.
2. "coverLetterMarkdown": A professional, warm cover letter in Markdown format addressed to prospective international employers in their preferred target country/trade. Highlighting their commitment to safety, language skills, and readiness for migration.

The output JSON must strictly be:
{
  "resumeMarkdown": "String containing markdown for the CV",
  "coverLetterMarkdown": "String containing markdown for the Cover Letter"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resumeMarkdown: { type: Type.STRING },
            coverLetterMarkdown: { type: Type.STRING }
          },
          required: ["resumeMarkdown", "coverLetterMarkdown"]
        },
        temperature: 0.5,
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Gemini Resume Builder API Error:", error);
    res.status(500).json({ error: "Failed to generate resume. Please try again." });
  }
});

// -------------------------------------------------------------------------
// 4. Training Quality Feedback API Endpoint
// -------------------------------------------------------------------------
app.post("/api/feedback", async (req, res) => {
  const { courseId, courseTitle, lessonId, lessonTitle, ratings, recommend, comments } = req.body;

  if (!courseTitle || !ratings) {
    return res.status(400).json({ error: "Missing required feedback fields" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Generate high-quality simulated personalized response based on user inputs
    let sentiment = "Positive";
    const avgRating = (Number(ratings.contentClarity) + Number(ratings.quizDifficulty) + Number(ratings.instructorQuality)) / 3;
    if (avgRating < 3.2) {
      sentiment = "Negative";
    } else if (avgRating < 4.2) {
      sentiment = "Neutral";
    }

    let responseStr = `Assalamu Alaikum! Thank you for taking the time to share your insights on the "${courseTitle}" program${lessonTitle ? ` (Lesson: ${lessonTitle})` : ""}. `;
    
    if (avgRating >= 4) {
      responseStr += `We are thrilled that you rated our content clarity and instructor standards at ${avgRating.toFixed(1)}/5. This is a testament to our specialized curriculum. `;
    } else {
      responseStr += `We appreciate your honest rating of ${avgRating.toFixed(1)}/5, which highlights areas where we can improve. `;
    }

    if (comments && comments.trim().length > 0) {
      responseStr += `Regarding your comments: "${comments}", our Chief Training Officer will review this immediately to refine our lesson notes and simulated quiz questions. `;
    } else {
      responseStr += `Your input will guide our ongoing syllabus audit as we align our classes with international certification requirements for Japan, South Korea, and Germany. `;
    }

    responseStr += `We wish you the very best of luck in completing your skill goals and unlocking your digital certificate!`;

    return res.json({
      personalizedThankYou: responseStr,
      sentiment
    });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `You are the Director of BIPLOB Skills Academy (Global Skills & Overseas Career Platform). A student has completed a training component and submitted feedback:
Course: ${courseTitle}
${lessonTitle ? `Lesson: ${lessonTitle}` : ""}
Ratings:
- Content Clarity: ${ratings.contentClarity}/5
- Quiz Alignment: ${ratings.quizDifficulty}/5
- Instructor Standard: ${ratings.instructorQuality}/5
Recommend to Others: ${recommend}
Student Comments: "${comments || "No specific comments written."}"

Please generate a professional, encouraging response in JSON format. The response should thank the student, provide specific action/mention based on their comments (if any) or course, and state how BIPLOB Academy is continually refining this specific curriculum to ensure high success rates for international placements (e.g. in Japan, Germany, Korea). Keep the tone warm, welcoming, and executive.

Output format MUST be strict JSON:
{
  "personalizedThankYou": "The warm response text from the Academy Director.",
  "sentiment": "Positive" | "Neutral" | "Negative"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalizedThankYou: { type: Type.STRING },
            sentiment: { type: Type.STRING }
          },
          required: ["personalizedThankYou", "sentiment"]
        },
        temperature: 0.6,
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Gemini Feedback API Error:", error);
    res.status(500).json({ error: "Failed to process feedback. Please try again." });
  }
});

// -------------------------------------------------------------------------
// 5. Vite Integration & Static Assets Serving
// -------------------------------------------------------------------------
async function startServer() {
  // Only mount Vite or listen if not in a Vercel/serverless context
  if (process.env.VERCEL !== "1") {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`BIPLOB Platform Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export { app };
