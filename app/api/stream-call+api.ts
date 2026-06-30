import { SUPPORTED_LANGUAGES } from "@/data/languages";
import { LESSONS } from "@/data/lessons";
import { StreamClient } from "@stream-io/node-sdk";

type StreamCallRequestBody = {
  lessonId?: string;
  languageId?: string;
  userId?: string;
  userName?: string;
  userImage?: string;
};

const streamApiKey = process.env.STREAM_API_KEY;
const streamApiSecret = process.env.STREAM_API_SECRET;

function getMissingEnvironmentVariables() {
  return [
    ["STREAM_API_KEY", streamApiKey],
    ["STREAM_API_SECRET", streamApiSecret],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);
}

function createCallId(lessonId: string, userId: string) {
  const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, "-");

  return `lesson-${lessonId}-${safeUserId}`.slice(0, 64);
}

function isValidUserId(userId?: string): userId is string {
  return Boolean(userId && /^[a-zA-Z0-9_-]{3,80}$/.test(userId));
}

function getUserName(userName?: string) {
  const trimmedUserName = userName?.trim();

  return trimmedUserName ? trimmedUserName.slice(0, 80) : "Language learner";
}

function getUserImage(userImage?: string) {
  if (!userImage) {
    return undefined;
  }

  try {
    const parsedUrl = new URL(userImage);

    return parsedUrl.protocol === "https:" ? userImage : undefined;
  } catch {
    return undefined;
  }
}

export async function POST(request: Request) {
  const missingEnvironmentVariables = getMissingEnvironmentVariables();

  if (missingEnvironmentVariables.length > 0) {
    return Response.json(
      {
        error: `Missing server environment variables: ${missingEnvironmentVariables.join(
          ", ",
        )}.`,
      },
      { status: 500 },
    );
  }

  const apiKey = streamApiKey;
  const apiSecret = streamApiSecret;

  if (!apiKey || !apiSecret) {
    return Response.json(
      { error: "Missing Stream server environment variables." },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as StreamCallRequestBody;
    const lesson = LESSONS.find((item) => item.id === body.lessonId);

    if (!lesson) {
      return Response.json({ error: "Lesson not found." }, { status: 404 });
    }

    if (body.languageId && body.languageId !== lesson.languageId) {
      return Response.json(
        { error: "Selected language does not match this lesson." },
        { status: 400 },
      );
    }

    const language = SUPPORTED_LANGUAGES.find(
      (item) => item.id === lesson.languageId,
    );

    if (!language) {
      return Response.json(
        { error: "Lesson language not found." },
        { status: 404 },
      );
    }

    const requestUserId = body.userId;

    if (!isValidUserId(requestUserId)) {
      return Response.json(
        { error: "Sign in to start this lesson call." },
        { status: 401 },
      );
    }

    const userId = requestUserId;
    const userName = getUserName(body.userName);
    const userImage = getUserImage(body.userImage);
    const callType = "audio_room";
    const callId = createCallId(lesson.id, userId);
    const streamClient = new StreamClient(apiKey, apiSecret);

    await streamClient.upsertUsers([
      {
        id: userId,
        name: userName,
        image: userImage,
        custom: {
          clerkUserId: userId,
          selectedLanguage: language.name,
        },
      },
    ]);

    const call = streamClient.video.call(callType, callId);

    await call.getOrCreate({
      data: {
        created_by_id: userId,
        members: [{ user_id: userId, role: "admin" }],
        custom: {
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          languageId: language.id,
          languageName: language.name,
          teacherRole: lesson.aiTeacherPrompt.role,
          openingLine: lesson.aiTeacherPrompt.openingLine,
        },
      },
    });

    const token = streamClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: 60 * 60 * 4,
    });

    return Response.json({
      apiKey,
      token,
      user: {
        id: userId,
        name: userName,
        image: userImage,
      },
      call: {
        id: callId,
        type: callType,
      },
      lesson: {
        id: lesson.id,
        title: lesson.title,
      },
      language: {
        id: language.id,
        name: language.name,
      },
    });
  } catch (error) {
    console.error("Stream call setup failed", error);

    return Response.json(
      { error: "Unable to prepare the lesson audio call." },
      { status: 500 },
    );
  }
}
