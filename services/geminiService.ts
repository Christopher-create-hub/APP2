
import { GoogleGenAI, Type } from "@google/genai";
import { InspectionSession } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateTechnicalReport(session: InspectionSession, storeName: string) {
  const model = 'gemini-3-flash-preview';
  
  const checklistSummary = session.checklist
    .map(item => `- ${item.category}: ${item.requirement} [${item.status}] ${item.observation ? `(Obs: ${item.observation})` : ''}`)
    .join('\n');

  const prompt = `
    Atue como um Engenheiro de Segurança contra Incêndio experiente.
    Analise os dados da vistoria abaixo para a loja "${storeName}" e gere uma conclusão técnica formal e recomendações de correção.
    
    DADOS DA VISTORIA:
    Data: ${session.date}
    Vistoriador: ${session.inspectorName}
    
    CHECKLIST:
    ${checklistSummary}
    
    RESPONDA EM FORMATO JSON:
    {
      "summary": "Resumo executivo do estado da loja",
      "recommendations": "Lista de ações imediatas necessárias para regularização"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: { type: Type.STRING }
          },
          required: ["summary", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Erro ao gerar relatório com Gemini:", error);
    return {
      summary: "Falha ao gerar resumo automático. Por favor, revise manualmente.",
      recommendations: "Verifique todos os itens marcados como NÃO CONFORME."
    };
  }
}
