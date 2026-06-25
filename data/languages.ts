import type { SupportedLanguage } from "@/types/learning";

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  {
    id: "spanish",
    code: "es",
    name: "Spanish",
    nativeName: "Espanol",
    flagCode: "ES",
    isEnabled: true,
    defaultVoiceHint: "Warm Latin American teacher voice",
  },
  {
    id: "french",
    code: "fr",
    name: "French",
    nativeName: "Francais",
    flagCode: "FR",
    isEnabled: true,
    defaultVoiceHint: "Friendly Parisian tutor voice",
  },
  {
    id: "japanese",
    code: "ja",
    name: "Japanese",
    nativeName: "Nihongo",
    flagCode: "JP",
    isEnabled: true,
    defaultVoiceHint: "Calm Japanese coach voice",
  },
];
