import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_STUDIOAI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-01-21" });

export default async function studioAI(script: string) {
  const prompt = script;

  try {
    const result = await model.generateContent(prompt);
    const sugestao = result.response.text().trim();
    
    return sugestao;
  } catch (error) {
    console.error("Ops! Algo deu errado: ", error);
    return "Ops! Algo deu errado.";
  }
}
