import { GoogleGenAI } from "@google/genai";

export const generateLoveNote = async (partnerName: string = "石雨馨"): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "石雨馨，新年快乐！愿我们的爱像烟花一样绚烂。(需要 API Key 才能生成更多情话)";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Updated prompt for High School romance context and specific name
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a touching, deeply romantic New Year's message for my girlfriend named "${partnerName}". 
      Context: High school romance (高中), youth, innocent love.
      Keywords to include: Fireworks (烟花), Future (未来), Together forever.
      Tone: Sincere, poetic, sweet.
      Length: Under 60 words.
      Output language: Chinese (Simplified).`,
    });

    return response.text || "石雨馨，新年快乐。愿我们的青春永不散场，年年岁岁都在一起看烟花。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "石雨馨，即使星光暗淡，我对你的爱依旧闪耀。新年快乐！";
  }
};