import OpenAI from "openai";

import { quizQuestionSchema } from "@/db/schemas/validation/quizzes";
import type { QuizQuestion } from "@/db/schemas/quizzes";

const client = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_BASE_URL,
});

export type GenerateQuizInput = {
  noteContent: string;
  noteTitle: string;
};

const SYSTEM_PROMPT = `
You are an expert quiz creator for students preparing for exams and interviews.

Generate exactly 10 multiple-choice questions (MCQs) based on the study note content provided.

Return ONLY valid JSON with this shape:
{
  "questions": [
    {
      "question": "string",
      "options": ["option A", "option B", "option C", "option D"],
      "correctAnswer": 0
    }
  ]
}

Rules:
- Generate exactly 10 questions.
- Each question must have exactly 4 options (array of 4 strings).
- "correctAnswer" is the 0-based index (0, 1, 2, or 3) of the correct option.
- Questions should cover a variety of concepts from the note.
- Options should be plausible and not obviously wrong.
- Do not wrap the response in code blocks or add any text outside the JSON.
`;

export async function generateQuiz(
  input: GenerateQuizInput,
): Promise<QuizQuestion[]> {
  const { noteContent, noteTitle } = input;

  const response = await client.chat.completions.create({
    model: process.env.LLM_MODEL!,
    temperature: 0.5,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Note Title: ${noteTitle}\n\nNote Content:\n${noteContent}\n\nGenerate 10 MCQ questions based on this note.`,
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

  const envelope = parsedJson as { questions?: unknown };
  if (!envelope || typeof envelope !== "object" || !Array.isArray(envelope.questions)) {
    throw new Error("AI returned invalid quiz structure. Please try again.");
  }

  const questions: QuizQuestion[] = [];
  for (const q of envelope.questions) {
    const result = quizQuestionSchema.safeParse(q);
    if (!result.success) {
      throw new Error("AI returned an invalid question format. Please try again.");
    }
    questions.push(result.data);
  }

  if (questions.length !== 10) {
    throw new Error(`AI returned ${questions.length} questions instead of 10. Please try again.`);
  }

  return questions;
}
