import { GoogleGenAI, Type } from '@google/genai';
import { PriorityClass } from '../types';

let aiInstance: GoogleGenAI | null = null;

function getAi() {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiInstance = new GoogleGenAI({ apiKey: key });
  }
  return aiInstance;
}

export interface AiTaskAnalysis {
  suggestedPriority: PriorityClass;
  riskAnalysis: string;
  clarityFeedback: string;
}

export async function analyzeTask(
  title: string,
  summary: string,
  timingTarget: string,
  unitTag: string
): Promise<AiTaskAnalysis> {
  const ai = getAi();
  
  const prompt = `
    Analyze the following task based on our standard operating procedures.
    
    Task Title: ${title}
    Summary: ${summary}
    Timing Target: ${timingTarget}
    Assigned Unit: ${unitTag}
    
    Priority SOP logic:
    - Critical: Requires rapid action. Launch impact, client impact, cash impact, or studio risk.
    - High: Strong impact but lacking critical urgency.
    - Standard: Daily activity tasks.
    - Low: Minimal urgency.
    
    Provide:
    1. A suggested PriorityClass.
    2. A risk analysis indicating if there is a 'risky delay possibility'.
    3. Clarity feedback (assist rapid clarity if the task wording is unclear or vague).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestedPriority: {
            type: Type.STRING,
            enum: ['Critical', 'High', 'Standard', 'Low'],
            description: 'The AI suggested priority based on the SOP.',
          },
          riskAnalysis: {
            type: Type.STRING,
            description: 'Note on delay risks, impact of not completing soon, and potential blocking points.',
          },
          clarityFeedback: {
            type: Type.STRING,
            description: 'Feedback on the task wording visibility - suggestions to make it more direct and action-driven.',
          },
        },
        required: ['suggestedPriority', 'riskAnalysis', 'clarityFeedback'],
      },
    },
  });

  if (!response.text) {
    throw new Error('No response from AI');
  }

  return JSON.parse(response.text) as AiTaskAnalysis;
}
