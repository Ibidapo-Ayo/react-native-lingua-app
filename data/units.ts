import type { LearningUnit } from "@/types/learning";

export const UNITS: LearningUnit[] = [
  {
    id: "es-a1-basics",
    languageId: "spanish",
    title: "Spanish Basics",
    description: "Greetings, simple introductions, and polite expressions.",
    order: 1,
    cefrLevel: "A1",
    lessonIds: ["es-l1-hello", "es-l2-introductions"],
  },
  {
    id: "fr-a1-basics",
    languageId: "french",
    title: "French Basics",
    description: "Say hello, ask simple questions, and be polite.",
    order: 1,
    cefrLevel: "A1",
    lessonIds: ["fr-l1-hello", "fr-l2-introductions"],
  },
  {
    id: "ja-a1-basics",
    languageId: "japanese",
    title: "Japanese Basics",
    description: "Core greetings and first-time meeting phrases.",
    order: 1,
    cefrLevel: "A1",
    lessonIds: ["ja-l1-hello", "ja-l2-introductions"],
  },
];
