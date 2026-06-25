export type CEFRLevel = "A0" | "A1" | "A2";

export type ActivityType =
  | "vocabulary"
  | "phrase_practice"
  | "translation"
  | "listening"
  | "speaking";

export interface SupportedLanguage {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  flagCode: string;
  isEnabled: boolean;
  defaultVoiceHint: string;
}

export interface LessonGoal {
  id: string;
  text: string;
}

export interface VocabularyItem {
  id: string;
  term: string;
  translation: string;
  pronunciation?: string;
  example: string;
}

export interface PhraseItem {
  id: string;
  text: string;
  translation: string;
  pronunciation?: string;
  usageNote?: string;
}

export interface TranslationPrompt {
  id: string;
  from: string;
  to: string;
}

export interface AIShortReplyExample {
  learnerInput: string;
  teacherReply: string;
}

export interface AITeacherPrompt {
  role: string;
  systemPrompt: string;
  openingLine: string;
  focusAreas: string[];
  correctionStyle: "gentle" | "balanced" | "strict";
  shortReplyExamples: AIShortReplyExample[];
}

interface BaseLessonActivity {
  id: string;
  type: ActivityType;
  instruction: string;
}

export interface VocabularyActivity extends BaseLessonActivity {
  type: "vocabulary";
  items: VocabularyItem[];
}

export interface PhrasePracticeActivity extends BaseLessonActivity {
  type: "phrase_practice";
  phrases: PhraseItem[];
}

export interface TranslationActivity extends BaseLessonActivity {
  type: "translation";
  prompts: TranslationPrompt[];
}

export interface ListeningActivity extends BaseLessonActivity {
  type: "listening";
  sourceText: string;
  expectedResponse: string;
}

export interface SpeakingActivity extends BaseLessonActivity {
  type: "speaking";
  prompt: string;
  expectedKeywords: string[];
}

export type LessonActivity =
  | VocabularyActivity
  | PhrasePracticeActivity
  | TranslationActivity
  | ListeningActivity
  | SpeakingActivity;

export interface LearningUnit {
  id: string;
  languageId: string;
  title: string;
  description: string;
  order: number;
  cefrLevel: CEFRLevel;
  lessonIds: string[];
}

export interface Lesson {
  id: string;
  languageId: string;
  unitId: string;
  title: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  xpReward: number;
  goals: LessonGoal[];
  vocabulary: VocabularyItem[];
  phrases: PhraseItem[];
  activities: LessonActivity[];
  aiTeacherPrompt: AITeacherPrompt;
}
