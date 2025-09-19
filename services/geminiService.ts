
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { ProcessedFile } from '../types';

const MODEL_NAME = "gemini-2.5-flash";

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
  }
  return apiKey;
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const summarizeDocuments = async (files: ProcessedFile[]): Promise<string> => {
  if (!files || files.length === 0) {
    throw new Error("No files provided for summarization.");
  }

  const prompt = `
    You are an expert document analyst. Your task is to provide a concise and comprehensive summary of the content presented in the following document pages/images.
    Analyze all the provided images, which may be pages from one or more documents (PDFs, images, etc.).
    Synthesize the information to create a single, coherent summary.
    Focus on key points, main arguments, and important data.
    The summary should be well-structured, easy to read, and capture the essence of the documents.
    Format your output using markdown for clarity (e.g., headings, bullet points).
  `;

  const imageParts = files.map(file => ({
    inlineData: {
      mimeType: file.mimeType,
      data: file.data,
    },
  }));

  const contents = {
    parts: [
      { text: prompt },
      ...imageParts,
    ],
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate summary from Gemini API. Please check the console for details.");
  }
};
