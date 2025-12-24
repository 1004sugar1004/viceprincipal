
import { GoogleGenAI, Type } from "@google/genai";
import { Blessing } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateBlessing = async (theme: string, recipientName: string): Promise<Blessing | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a deeply moving, tear-jerkingly beautiful New Year's blessing for 2026. 
      Recipient: "${recipientName}" (Vice Principal at Jeungpyeong Elementary School - 증평초등학교).
      
      Key Context to include:
      1. She came to Jeungpyeong Elementary (증평초) in the **AUTUMN (가을)** of 2025. 
      2. Since then, she worked incredibly hard in a new environment, navigating the busy end-of-year season. Do NOT use "four seasons" (사계절) or "one year" (1년) phrases.
      3. Congratulate and bless her "new journey" as a Vice Principal (교감으로서의 새 인생).
      4. Theme: "${theme}". 
      
      Strict Instructions:
      1. Length: Exactly 2-3 short, impactful sentences.
      2. Impact: Focus on how she quickly became a warm light for the school despite arriving late in the year (Autumn).
      3. Tone: Poetic, metaphorical, and profoundly respectful (Korean 명조체 감성). 
      4. Example vibe: "증평초의 가을 바람과 함께 오셔서, 짧은 시간 동안 우리에게 가장 깊은 온기를 나누어 주신 노고를 기억합니다. 교감으로서 내딛으신 이 귀한 새 걸음이 2026년에는 눈부신 꽃길로 이어지길 간절히 소망합니다."
      
      Include one very meaningful emoji.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            emoji: { type: Type.STRING },
          },
          required: ["title", "content", "emoji"],
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        id: Math.random(),
        theme,
        ...data,
      };
    }
    return null;
  } catch (error) {
    console.error("Error generating blessing:", error);
    return null;
  }
};
