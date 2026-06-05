import OpenAI from "openai";

import { aiNoteResponseSchema } from "@/db/schemas/validation/notes";

const client = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_BASE_URL,
});

export type GenerateNoteInput = {
  subjectName: string;
  topic: string;
};

export type GenerateNoteResult = {
  title: string;
  content: string;
};

const SYSTEM_PROMPT = `
You are an expert educational content creator for students preparing for exams, interviews, and technical learning.

Generate high-quality study notes for the given subject and topic.

Return ONLY valid JSON with this shape:
{
  "title": "string",
  "content": "string"
}

Rules:
- "content" should be markdown with headings, bullet points, examples, and a short summary.
- Include practical examples and at least 5 interview or exam questions.
- Be clear, accurate, and beginner-friendly.
- Do not wrap the response in code blocks or add text outside the JSON.
`;

export async function generateNote(
  input: GenerateNoteInput,
): Promise<GenerateNoteResult> {
  const { subjectName, topic } = input;
  const response = await client.chat.completions.create({
    model: process.env.LLM_MODEL!,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Subject: ${subjectName}\nTopic: ${topic}\n\nGenerate detailed study notes.`,
      },
    ],
  });

  const raw = response.choices[0].message.content?.trim() ?? "";
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    throw new Error("AI returned malformed JSON. Please try again.");
  }

  const parsed = aiNoteResponseSchema.safeParse(parsedJson);
  if (!parsed.success) {
    throw new Error("AI returned invalid note content. Please try again.");
  }

  return parsed.data;
}
