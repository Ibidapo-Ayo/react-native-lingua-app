import type { Lesson } from "@/types/learning";

export const LESSONS: Lesson[] = [
  {
    id: "es-l1-hello",
    languageId: "spanish",
    unitId: "es-a1-basics",
    title: "Say Hello",
    description: "Learn your first Spanish greetings.",
    order: 1,
    estimatedMinutes: 6,
    xpReward: 10,
    goals: [
      { id: "es-l1-g1", text: "Say hello and goodbye naturally." },
      { id: "es-l1-g2", text: "Use polite phrases in simple chats." },
    ],
    vocabulary: [
      {
        id: "es-v-hola",
        term: "hola",
        translation: "hello",
        pronunciation: "OH-lah",
        example: "Hola, Ana.",
      },
      {
        id: "es-v-adios",
        term: "adios",
        translation: "goodbye",
        pronunciation: "ah-dee-OHS",
        example: "Adios, hasta luego.",
      },
      {
        id: "es-v-gracias",
        term: "gracias",
        translation: "thank you",
        pronunciation: "GRAH-see-ahs",
        example: "Gracias por tu ayuda.",
      },
    ],
    phrases: [
      {
        id: "es-p-1",
        text: "Hola, mucho gusto.",
        translation: "Hello, nice to meet you.",
      },
      {
        id: "es-p-2",
        text: "Gracias, adios.",
        translation: "Thank you, goodbye.",
      },
    ],
    activities: [
      {
        id: "es-l1-a1",
        type: "vocabulary",
        instruction: "Match each word with its English meaning.",
        items: [
          {
            id: "es-v-hola",
            term: "hola",
            translation: "hello",
            pronunciation: "OH-lah",
            example: "Hola, Ana.",
          },
          {
            id: "es-v-adios",
            term: "adios",
            translation: "goodbye",
            pronunciation: "ah-dee-OHS",
            example: "Adios, hasta luego.",
          },
        ],
      },
      {
        id: "es-l1-a2",
        type: "translation",
        instruction: "Translate into Spanish.",
        prompts: [
          { id: "es-l1-t1", from: "hello", to: "hola" },
          { id: "es-l1-t2", from: "thank you", to: "gracias" },
        ],
      },
      {
        id: "es-l1-a3",
        type: "speaking",
        instruction: "Say a short greeting out loud.",
        prompt: "Greet your teacher and say goodbye.",
        expectedKeywords: ["hola", "adios"],
      },
    ],
    aiTeacherPrompt: {
      role: "Beginner Spanish speaking coach",
      systemPrompt:
        "You are teaching absolute beginners. Keep replies short, encouraging, and spoken at slow speed. Correct one error at a time.",
      openingLine:
        "Hola. I am your Spanish teacher. Let us practice one short phrase at a time.",
      focusAreas: ["greetings", "pronunciation", "confidence"],
      correctionStyle: "gentle",
      shortReplyExamples: [
        {
          learnerInput: "hola teacher",
          teacherReply: "Great start. Say: Hola, profesora.",
        },
        {
          learnerInput: "gracias adios",
          teacherReply: "Nice. Add a pause: Gracias. Adios.",
        },
      ],
    },
  },
  {
    id: "es-l2-introductions",
    languageId: "spanish",
    unitId: "es-a1-basics",
    title: "Introduce Yourself",
    description: "Share your name and ask someone theirs.",
    order: 2,
    estimatedMinutes: 8,
    xpReward: 12,
    goals: [
      { id: "es-l2-g1", text: "Say your name in Spanish." },
      { id: "es-l2-g2", text: "Ask another person their name." },
    ],
    vocabulary: [
      {
        id: "es-v-me-llamo",
        term: "me llamo",
        translation: "my name is",
        pronunciation: "meh YAH-moh",
        example: "Me llamo Sam.",
      },
      {
        id: "es-v-como-te-llamas",
        term: "como te llamas",
        translation: "what is your name",
        pronunciation: "KOH-moh teh YAH-mahs",
        example: "Como te llamas?",
      },
    ],
    phrases: [
      {
        id: "es-p-3",
        text: "Me llamo Alex.",
        translation: "My name is Alex.",
      },
      {
        id: "es-p-4",
        text: "Como te llamas?",
        translation: "What is your name?",
      },
    ],
    activities: [
      {
        id: "es-l2-a1",
        type: "phrase_practice",
        instruction: "Read and repeat each introduction phrase.",
        phrases: [
          {
            id: "es-p-3",
            text: "Me llamo Alex.",
            translation: "My name is Alex.",
          },
          {
            id: "es-p-4",
            text: "Como te llamas?",
            translation: "What is your name?",
          },
        ],
      },
      {
        id: "es-l2-a2",
        type: "listening",
        instruction: "Listen and answer with your name.",
        sourceText: "Hola, como te llamas?",
        expectedResponse: "Me llamo ...",
      },
    ],
    aiTeacherPrompt: {
      role: "Spanish conversation partner for first-time learners",
      systemPrompt:
        "Run a simple two-turn conversation. Ask the learner their name, then respond positively. Keep language under 8 words when possible.",
      openingLine: "Hola. Como te llamas?",
      focusAreas: ["introductions", "question forms", "listening"],
      correctionStyle: "balanced",
      shortReplyExamples: [
        {
          learnerInput: "Me llama Ben",
          teacherReply: "Close. Say: Me llamo Ben.",
        },
      ],
    },
  },
  {
    id: "fr-l1-hello",
    languageId: "french",
    unitId: "fr-a1-basics",
    title: "Say Bonjour",
    description: "Use your first French greetings.",
    order: 1,
    estimatedMinutes: 6,
    xpReward: 10,
    goals: [
      { id: "fr-l1-g1", text: "Greet someone in French." },
      { id: "fr-l1-g2", text: "Use basic polite words." },
    ],
    vocabulary: [
      {
        id: "fr-v-bonjour",
        term: "bonjour",
        translation: "hello",
        pronunciation: "bohn-ZHOOR",
        example: "Bonjour, Marie.",
      },
      {
        id: "fr-v-merci",
        term: "merci",
        translation: "thank you",
        pronunciation: "mehr-SEE",
        example: "Merci beaucoup.",
      },
    ],
    phrases: [
      {
        id: "fr-p-1",
        text: "Bonjour, ca va?",
        translation: "Hello, how are you?",
      },
      {
        id: "fr-p-2",
        text: "Merci, au revoir.",
        translation: "Thank you, goodbye.",
      },
    ],
    activities: [
      {
        id: "fr-l1-a1",
        type: "vocabulary",
        instruction: "Tap the correct meaning for each French word.",
        items: [
          {
            id: "fr-v-bonjour",
            term: "bonjour",
            translation: "hello",
            pronunciation: "bohn-ZHOOR",
            example: "Bonjour, Marie.",
          },
          {
            id: "fr-v-merci",
            term: "merci",
            translation: "thank you",
            pronunciation: "mehr-SEE",
            example: "Merci beaucoup.",
          },
        ],
      },
      {
        id: "fr-l1-a2",
        type: "speaking",
        instruction: "Say a greeting and thank-you phrase.",
        prompt: "Say: Bonjour, merci.",
        expectedKeywords: ["bonjour", "merci"],
      },
    ],
    aiTeacherPrompt: {
      role: "Supportive French pronunciation coach",
      systemPrompt:
        "Help beginner learners pronounce short French words. Encourage slowly and use simple phonetic hints in English.",
      openingLine: "Bonjour. Let us practice two words together.",
      focusAreas: ["pronunciation", "greetings"],
      correctionStyle: "gentle",
      shortReplyExamples: [
        {
          learnerInput: "bonjur",
          teacherReply: "Good try. Round the end: bonjour.",
        },
      ],
    },
  },
  {
    id: "fr-l2-introductions",
    languageId: "french",
    unitId: "fr-a1-basics",
    title: "Simple Introductions",
    description: "Tell your name and ask someone theirs in French.",
    order: 2,
    estimatedMinutes: 8,
    xpReward: 12,
    goals: [
      { id: "fr-l2-g1", text: "Say your name with je m'appelle." },
      { id: "fr-l2-g2", text: "Ask comment tu t'appelles?" },
    ],
    vocabulary: [
      {
        id: "fr-v-je-mappelle",
        term: "je m'appelle",
        translation: "my name is",
        pronunciation: "zhuh mah-PELL",
        example: "Je m'appelle Nina.",
      },
      {
        id: "fr-v-comment-tu-tappelles",
        term: "comment tu t'appelles",
        translation: "what is your name",
        pronunciation: "koh-MAHN too tah-PELL",
        example: "Comment tu t'appelles?",
      },
    ],
    phrases: [
      {
        id: "fr-p-3",
        text: "Je m'appelle Nina.",
        translation: "My name is Nina.",
      },
      {
        id: "fr-p-4",
        text: "Comment tu t'appelles?",
        translation: "What is your name?",
      },
    ],
    activities: [
      {
        id: "fr-l2-a1",
        type: "translation",
        instruction: "Translate into French.",
        prompts: [
          { id: "fr-l2-t1", from: "my name is Leo", to: "je m'appelle Leo" },
          {
            id: "fr-l2-t2",
            from: "what is your name",
            to: "comment tu t'appelles",
          },
        ],
      },
      {
        id: "fr-l2-a2",
        type: "listening",
        instruction: "Listen and answer the question.",
        sourceText: "Bonjour, comment tu t'appelles?",
        expectedResponse: "Je m'appelle ...",
      },
    ],
    aiTeacherPrompt: {
      role: "French beginner dialogue tutor",
      systemPrompt:
        "Guide a short intro dialogue. Ask one question, wait for answer, then provide one correction and one praise.",
      openingLine: "Bonjour. Comment tu t'appelles?",
      focusAreas: ["introductions", "sentence rhythm"],
      correctionStyle: "balanced",
      shortReplyExamples: [
        {
          learnerInput: "Je mappelle Tom",
          teacherReply: "Great. Add apostrophe sound: Je m'appelle Tom.",
        },
      ],
    },
  },
  {
    id: "ja-l1-hello",
    languageId: "japanese",
    unitId: "ja-a1-basics",
    title: "Basic Greetings",
    description: "Learn common Japanese greetings.",
    order: 1,
    estimatedMinutes: 7,
    xpReward: 10,
    goals: [
      { id: "ja-l1-g1", text: "Say hello and thank you in Japanese." },
      { id: "ja-l1-g2", text: "Recognize polite greeting usage." },
    ],
    vocabulary: [
      {
        id: "ja-v-konnichiwa",
        term: "konnichiwa",
        translation: "hello",
        pronunciation: "kohn-nee-chee-wah",
        example: "Konnichiwa, Yuki.",
      },
      {
        id: "ja-v-arigato",
        term: "arigato",
        translation: "thank you",
        pronunciation: "ah-ree-gah-toh",
        example: "Arigato gozaimasu.",
      },
    ],
    phrases: [
      {
        id: "ja-p-1",
        text: "Konnichiwa. Genki desu ka?",
        translation: "Hello. How are you?",
      },
      {
        id: "ja-p-2",
        text: "Arigato. Sayonara.",
        translation: "Thank you. Goodbye.",
      },
    ],
    activities: [
      {
        id: "ja-l1-a1",
        type: "vocabulary",
        instruction: "Match romaji to meaning.",
        items: [
          {
            id: "ja-v-konnichiwa",
            term: "konnichiwa",
            translation: "hello",
            pronunciation: "kohn-nee-chee-wah",
            example: "Konnichiwa, Yuki.",
          },
          {
            id: "ja-v-arigato",
            term: "arigato",
            translation: "thank you",
            pronunciation: "ah-ree-gah-toh",
            example: "Arigato gozaimasu.",
          },
        ],
      },
      {
        id: "ja-l1-a2",
        type: "speaking",
        instruction: "Practice greeting the teacher.",
        prompt: "Say: Konnichiwa. Arigato.",
        expectedKeywords: ["konnichiwa", "arigato"],
      },
    ],
    aiTeacherPrompt: {
      role: "Japanese beginner voice coach",
      systemPrompt:
        "Use very short lines and clear pacing for beginners. Prioritize confidence, then pronunciation. Keep corrections to one point.",
      openingLine: "Konnichiwa. We will practice two easy words.",
      focusAreas: ["greetings", "rhythm", "confidence"],
      correctionStyle: "gentle",
      shortReplyExamples: [
        {
          learnerInput: "konichiwa",
          teacherReply: "Nice try. Stretch middle sound: kon-ni-chi-wa.",
        },
      ],
    },
  },
  {
    id: "ja-l2-introductions",
    languageId: "japanese",
    unitId: "ja-a1-basics",
    title: "Meet Someone",
    description: "Give your name and ask another person politely.",
    order: 2,
    estimatedMinutes: 9,
    xpReward: 12,
    goals: [
      { id: "ja-l2-g1", text: "Use watashi wa ... desu for your name." },
      { id: "ja-l2-g2", text: "Ask onamae wa nan desu ka?" },
    ],
    vocabulary: [
      {
        id: "ja-v-watashi-wa",
        term: "watashi wa",
        translation: "I am",
        pronunciation: "wah-tah-shee wah",
        example: "Watashi wa Ken desu.",
      },
      {
        id: "ja-v-onamae",
        term: "onamae",
        translation: "name",
        pronunciation: "oh-nah-mah-eh",
        example: "Onamae wa nan desu ka?",
      },
    ],
    phrases: [
      {
        id: "ja-p-3",
        text: "Watashi wa Ken desu.",
        translation: "I am Ken.",
      },
      {
        id: "ja-p-4",
        text: "Onamae wa nan desu ka?",
        translation: "What is your name?",
      },
    ],
    activities: [
      {
        id: "ja-l2-a1",
        type: "phrase_practice",
        instruction: "Repeat each phrase with steady rhythm.",
        phrases: [
          {
            id: "ja-p-3",
            text: "Watashi wa Ken desu.",
            translation: "I am Ken.",
          },
          {
            id: "ja-p-4",
            text: "Onamae wa nan desu ka?",
            translation: "What is your name?",
          },
        ],
      },
      {
        id: "ja-l2-a2",
        type: "listening",
        instruction: "Listen and answer with your introduction.",
        sourceText: "Onamae wa nan desu ka?",
        expectedResponse: "Watashi wa ... desu.",
      },
    ],
    aiTeacherPrompt: {
      role: "Japanese intro dialogue teacher",
      systemPrompt:
        "Run a beginner roleplay. Ask for learner name, then model a natural reply. Keep vocabulary at A1 level and avoid complex grammar.",
      openingLine: "Hajimemashite. Onamae wa nan desu ka?",
      focusAreas: ["self-introduction", "question response", "politeness"],
      correctionStyle: "balanced",
      shortReplyExamples: [
        {
          learnerInput: "Watashi Ken",
          teacherReply: "Good start. Say full phrase: Watashi wa Ken desu.",
        },
      ],
    },
  },
];
