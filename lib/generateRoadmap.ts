import OpenAI from "openai";
import { z } from "zod";

import { roadmapStepSchema } from "@/db/schemas/validation/roadmaps";
import type { RoadmapStep } from "@/db/schemas/roadmaps";

const client = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_BASE_URL,
});

export type GenerateRoadmapInput = {
  topic: string;
};

const SYSTEM_PROMPT = `
You are an expert learning path designer who creates structured, ordered roadmaps for students and self-learners.

Given a topic, generate a learning roadmap with 5-10 ordered steps that guide someone from beginner to proficient.

Return ONLY valid JSON with this shape:
{
  "steps": [
    {
      "order": 1,
      "title": "Step Title",
      "description": "A brief 1-2 sentence description of what to learn in this step and why it matters."
    }
  ]
}

Rules:
- Generate between 5 and 10 steps.
- Each step must have an "order" (1-indexed), "title", and "description".
- Steps must be logically ordered from foundational to advanced.
- Keep titles concise (2-5 words).
- Descriptions should be practical and actionable, 1-2 sentences max.
- Do not wrap the response in code blocks or add any text outside the JSON.
`;

export async function generateRoadmap(
  input: GenerateRoadmapInput,
): Promise<RoadmapStep[]> {
  const { topic } = input;

  const response = await client.chat.completions.create({
    model: process.env.LLM_MODEL!,
    temperature: 0.5,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Topic: ${topic}\n\nGenerate a learning roadmap for this topic.`,
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

  const envelope = parsedJson as { steps?: unknown };
  if (
    !envelope ||
    typeof envelope !== "object" ||
    !Array.isArray(envelope.steps)
  ) {
    throw new Error("AI returned invalid roadmap structure. Please try again.");
  }

  const steps: RoadmapStep[] = [];
  for (const step of envelope.steps) {
    const result = roadmapStepSchema.safeParse(step);
    if (!result.success) {
      throw new Error(
        "AI returned an invalid step format. Please try again.",
      );
    }
    steps.push(result.data);
  }

  if (steps.length < 3 || steps.length > 15) {
    throw new Error(
      `AI returned ${steps.length} steps instead of 5-10. Please try again.`,
    );
  }

  return steps;
}
