import { images } from "@/constants/images";
import { SUPPORTED_LANGUAGES } from "@/data/languages";
import { LESSONS } from "@/data/lessons";
import { getApiUrl } from "@/lib/api";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  NativeModules,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const FEEDBACK_ITEMS = [
  { label: "Speaking", value: "Excellent", color: "#22C55E" },
  { label: "Pronunciation", value: "Great", color: "#1683FF" },
  { label: "Grammar", value: "Good", color: "#5C43FF" },
];

const LESSON_TABS: {
  label: string;
  icon: IoniconName;
  isActive?: boolean;
  route:
    | "/(tabs)/home"
    | "/(tabs)/learn"
    | "/(tabs)/ai-teacher"
    | "/(tabs)/chat"
    | "/(tabs)/profile";
}[] = [
  { label: "Home", icon: "home-outline", route: "/(tabs)/home" },
  { label: "Learn", icon: "book", isActive: true, route: "/(tabs)/learn" },
  {
    label: "AI Teacher",
    icon: "sparkles-outline",
    route: "/(tabs)/ai-teacher",
  },
  { label: "Chat", icon: "chatbubble-outline", route: "/(tabs)/chat" },
  { label: "Profile", icon: "person-outline", route: "/(tabs)/profile" },
];

type StreamLessonSession = {
  apiKey: string;
  token: string;
  user: {
    id: string;
    name?: string;
    image?: string;
    type?: "authenticated";
  };
  call: {
    id: string;
    type: string;
  };
};

type StreamVideoModule = typeof import("@stream-io/video-react-native-sdk");
type StreamVideoClientInstance = InstanceType<
  StreamVideoModule["StreamVideoClient"]
>;
type StreamCallInstance = ReturnType<StreamVideoClientInstance["call"]>;

type LessonCallStatus =
  | "idle"
  | "loading"
  | "connecting"
  | "joined"
  | "muted"
  | "ended"
  | "error";

function getCallStatusLabel(status: LessonCallStatus) {
  switch (status) {
    case "loading":
      return "Preparing audio";
    case "connecting":
      return "Connecting";
    case "joined":
      return "Joined";
    case "muted":
      return "Muted";
    case "ended":
      return "Ended";
    case "error":
      return "Needs attention";
    default:
      return "Ready to start";
  }
}

function getPrimaryCallActionLabel(status: LessonCallStatus) {
  switch (status) {
    case "loading":
      return "Loading";
    case "connecting":
      return "Joining";
    case "joined":
    case "muted":
      return "Joined";
    case "ended":
      return "Join";
    case "error":
      return "Retry";
    default:
      return "Start";
  }
}

function getPrimaryCallIcon(status: LessonCallStatus): IoniconName {
  switch (status) {
    case "loading":
    case "connecting":
      return "hourglass-outline";
    case "joined":
    case "muted":
      return "checkmark";
    case "ended":
    case "error":
      return "refresh";
    default:
      return "radio-outline";
  }
}

function getFlagEmoji(flagCode: string): string {
  return String.fromCodePoint(
    ...flagCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0)),
  );
}

function hasLeftCall(call?: StreamCallInstance) {
  return call?.state.callingState === "left";
}

function getStreamVideoSetupMessage() {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    return "Stream audio calls require an Expo development build. They cannot run in Expo Go because WebRTC is a native module.";
  }

  return "Stream audio calls require a freshly rebuilt development build with WebRTC. Run npx expo prebuild --clean, then rebuild with npx expo run:android or npx expo run:ios.";
}

function ensureWebRtcNativeModule() {
  if (!NativeModules.WebRTCModule) {
    throw new Error(getStreamVideoSetupMessage());
  }
}

function getInitialCallStatus(): LessonCallStatus {
  return NativeModules.WebRTCModule ? "idle" : "error";
}

function getInitialCallError() {
  return NativeModules.WebRTCModule ? null : getStreamVideoSetupMessage();
}

async function loadStreamVideoSdk() {
  ensureWebRtcNativeModule();

  try {
    const streamVideoSdk = await import("@stream-io/video-react-native-sdk");

    if (!streamVideoSdk.StreamVideoClient?.getOrCreateInstance) {
      throw new Error(getStreamVideoSetupMessage());
    }

    return streamVideoSdk;
  } catch (error) {
    console.error("Failed to load Stream Video SDK", error);

    throw error instanceof Error
      ? error
      : new Error(getStreamVideoSetupMessage());
  }
}

export default function LessonDetailScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const [streamClient, setStreamClient] = useState<StreamVideoClientInstance>();
  const [activeCall, setActiveCall] = useState<StreamCallInstance>();
  const [callStatus, setCallStatus] =
    useState<LessonCallStatus>(getInitialCallStatus);
  const [isMuted, setIsMuted] = useState(false);
  const [callError, setCallError] = useState<string | null>(
    getInitialCallError,
  );
  const clientRef = useRef<StreamVideoClientInstance | undefined>(undefined);
  const callRef = useRef<StreamCallInstance | undefined>(undefined);

  const lesson = LESSONS.find((item) => item.id === lessonId);
  const language = SUPPORTED_LANGUAGES.find(
    (item) => item.id === lesson?.languageId,
  );

  useEffect(() => {
    return () => {
      const currentCall = callRef.current;
      const currentClient = clientRef.current;

      if (!hasLeftCall(currentCall)) {
        currentCall?.leave().catch((error) => {
          console.error("Failed to leave lesson call", error);
        });
      }

      currentClient?.disconnectUser().catch((error) => {
        console.error("Failed to disconnect Stream user", error);
      });
    };
  }, []);

  const setCurrentClient = (client: StreamVideoClientInstance | undefined) => {
    clientRef.current = client;
    setStreamClient(client);
  };

  const setCurrentCall = (call: StreamCallInstance | undefined) => {
    callRef.current = call;
    setActiveCall(call);
  };

  const fetchStreamLessonSession = async () => {
    if (!lesson || !language) {
      throw new Error("Choose a valid lesson before starting audio.");
    }

    if (!clerkUser?.id) {
      throw new Error("Sign in to start this audio lesson.");
    }

    const response = await fetch(getApiUrl("/api/stream-call"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lessonId: lesson.id,
        languageId: language.id,
        userId: clerkUser.id,
        userName:
          clerkUser?.fullName ?? clerkUser?.primaryEmailAddress?.emailAddress,
        userImage: clerkUser?.imageUrl,
      }),
    });
    const body = (await response.json().catch(() => null)) as
      | (StreamLessonSession & { error?: string })
      | null;

    if (!response.ok || !body) {
      console.log("Failed to fetch Stream lesson session", {
        status: response.status,
        statusText: response.statusText,
        body,
      });
      throw new Error(body?.error ?? "Unable to prepare the lesson call.");
    }

    return body;
  };

  const handleStartOrJoinCall = async () => {
    if (callStatus === "loading" || callStatus === "connecting") {
      return;
    }

    if (!isSignedIn) {
      setCallStatus("error");
      setCallError("Sign in to start this audio lesson.");
      return;
    }

    try {
      ensureWebRtcNativeModule();
      setCallError(null);
      setCallStatus("loading");
      const { StreamVideoClient } = await loadStreamVideoSdk();
      const session = await fetchStreamLessonSession();
      const tokenProvider = async () => {
        const freshSession = await fetchStreamLessonSession();

        return freshSession.token;
      };
      const client = StreamVideoClient.getOrCreateInstance({
        apiKey: session.apiKey,
        user: session.user,
        token: session.token,
        tokenProvider,
        options: { rejectCallWhenBusy: true },
      });
      setCurrentClient(client);
      setCallStatus("connecting");
      const call = client.call(session.call.type, session.call.id, {
        reuseInstance: true,
      });
      setCurrentCall(call);
      call.setDisconnectionTimeout(120);
      await call.join();
      await call.camera.disable();
      await call.microphone.enable();
      setIsMuted(false);
      setCallStatus("joined");
    } catch (error) {
      console.error("Failed to start lesson audio call", error);
      setCallStatus("error");
      setCallError(
        error instanceof Error
          ? error.message
          : "Unable to start the lesson audio call.",
      );
    }
  };

  const handleToggleMute = async () => {
    if (!activeCall || (callStatus !== "joined" && callStatus !== "muted")) {
      return;
    }

    try {
      const nextMuted = !isMuted;

      if (nextMuted) {
        await activeCall.microphone.disable();
      } else {
        await activeCall.microphone.enable();
      }

      setIsMuted(nextMuted);
      setCallStatus(nextMuted ? "muted" : "joined");
      setCallError(null);
    } catch (error) {
      console.error("Failed to toggle lesson microphone", error);
      setCallStatus("error");
      setCallError("Unable to update your microphone.");
    }
  };

  const handleEndCall = async () => {
    if (!activeCall && !streamClient) {
      router.back();
      return;
    }

    try {
      if (!hasLeftCall(activeCall)) {
        await activeCall?.leave();
      }

      await streamClient?.disconnectUser();
      setCurrentCall(undefined);
      setCurrentClient(undefined);
      setIsMuted(false);
      setCallStatus("ended");
      setCallError(null);
    } catch (error) {
      console.error("Failed to end lesson audio call", error);
      setCallStatus("error");
      setCallError("Unable to end the audio call. Try again.");
    }
  };

  if (!lesson) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-h3 text-center">Lesson not found</Text>
          <TouchableOpacity
            className="mt-4 rounded-2xl bg-purple px-5 py-2.5"
            onPress={() => router.back()}
          >
            <Text className="font-poppins-semibold text-[14px] text-white">
              Go back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const primaryPhrase = lesson.phrases[0];
  const languageLabel = language
    ? `${getFlagEmoji(language.flagCode)} ${language.name}`
    : "Language lesson";
  const callStatusLabel = getCallStatusLabel(callStatus);
  const primaryCallActionLabel = getPrimaryCallActionLabel(callStatus);
  const primaryCallIcon = getPrimaryCallIcon(callStatus);
  const isCallBusy = callStatus === "loading" || callStatus === "connecting";
  const isCallActive = callStatus === "joined" || callStatus === "muted";
  const learnerLabel =
    clerkUser?.fullName ?? clerkUser?.primaryEmailAddress?.emailAddress;

  const screenContent = (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 px-4 pb-2 pt-1">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-10 w-9 items-start justify-center"
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={28} color="#07122F" />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="text-[21px] leading-6 font-poppins-semibold text-[#07122F]">
              AI Teacher
            </Text>
            <View className="mt-0.5 flex-row items-center">
              <View
                className={`mr-1.5 h-2.5 w-2.5 rounded-full ${
                  callStatus === "error"
                    ? "bg-[#FF3B42]"
                    : isCallActive
                      ? "bg-[#18D318]"
                      : "bg-[#FFC800]"
                }`}
              />
              <Text className="text-[12px] font-poppins-medium text-[#68718D]">
                {callStatusLabel}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <View className="h-11 w-11 items-center justify-center rounded-full border border-[#ECEFF6] bg-white">
              <Ionicons name="volume-high" size={20} color="#081433" />
            </View>
            <View className="h-11 w-11 items-center justify-center rounded-full border border-[#ECEFF6] bg-white">
              <Text className="text-[16px] font-poppins-semibold text-[#07122F]">
                {lesson.estimatedMinutes}
              </Text>
            </View>
            <View className="h-11 w-11 items-center justify-center rounded-full border border-[#ECEFF6] bg-white">
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#081433"
              />
            </View>
          </View>
        </View>

        <View className="mt-3 flex-1 overflow-hidden rounded-[26px] bg-[#D8CEC2]">
          <View className="absolute -left-10 -right-10 top-32 bottom-27 items-center justify-center">
            <Image
              source={images.mascotWelcome}
              resizeMode="contain"
              className="h-full w-full"
            />
          </View>
          <View className="absolute inset-0 bg-black/5" />

          <View className="absolute right-4 top-4 h-24 w-20 overflow-hidden rounded-[18px] border-2 border-white bg-[#F4EFE6]">
            <Image
              source={images.mascotAuth}
              resizeMode="contain"
              className="h-full w-full"
            />
          </View>

          <View className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5">
            <Text className="text-[11px] font-poppins-semibold text-[#07122F]">
              {languageLabel}
            </Text>
          </View>

          <View className="absolute left-4 right-4 top-29.5 rounded-[20px] bg-white px-3.5 py-2">
            <View className="flex-row items-start">
              <View className="mr-2.5 h-8 w-8 items-center justify-center rounded-full bg-[#F1EEFF]">
                <Ionicons name="volume-high" size={17} color="#5945FF" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[10px] font-poppins-semibold uppercase text-[#6D748C]">
                    Teacher says
                  </Text>
                  <Text className="text-[10px] font-poppins-semibold text-[#18A34A]">
                    {isMuted
                      ? "Muted"
                      : isCallActive
                        ? "Live audio"
                        : callStatusLabel}
                  </Text>
                </View>
                <Text className="mt-1 text-[13px] leading-5 font-poppins-medium text-[#07122F]">
                  {lesson.aiTeacherPrompt.openingLine}
                </Text>
                <Text className="mt-1 text-[10px] font-poppins-medium text-[#6B7280]">
                  {learnerLabel ? `${learnerLabel} - ` : ""}Practice:{" "}
                  {primaryPhrase?.text ?? lesson.title}
                </Text>
                {callError ? (
                  <Text className="mt-1 text-[10px] font-poppins-semibold text-[#FF3B42]">
                    {callError}
                  </Text>
                ) : null}
                {callStatus === "ended" ? (
                  <Text className="mt-1 text-[10px] font-poppins-semibold text-[#6B7280]">
                    Audio session ended. Join again when you are ready.
                  </Text>
                ) : null}
              </View>
            </View>
          </View>

          <View className="absolute bottom-24 left-4 right-4">
            <View className="flex-row items-center justify-between">
              <View className="items-center">
                <TouchableOpacity
                  className={`h-14.5 w-14.5 items-center justify-center rounded-full ${
                    isCallActive ? "bg-[#21C16B]" : "bg-white"
                  } ${isCallBusy ? "opacity-80" : ""}`}
                  onPress={handleStartOrJoinCall}
                  disabled={isCallBusy || isCallActive}
                  accessibilityRole="button"
                  accessibilityLabel={`${primaryCallActionLabel} audio lesson call`}
                >
                  {isCallBusy ? (
                    <ActivityIndicator
                      color={isCallActive ? "#FFFFFF" : "#071944"}
                    />
                  ) : (
                    <Ionicons
                      name={primaryCallIcon}
                      size={24}
                      color={isCallActive ? "#FFFFFF" : "#071944"}
                    />
                  )}
                </TouchableOpacity>
                <Text className="mt-1.5 text-[11px] font-poppins-semibold text-white">
                  {primaryCallActionLabel}
                </Text>
              </View>

              <View className="items-center">
                <TouchableOpacity
                  className={`h-14.5 w-14.5 items-center justify-center rounded-full ${
                    isMuted ? "bg-[#FFC800]" : "bg-white"
                  } ${!isCallActive ? "opacity-70" : ""}`}
                  onPress={handleToggleMute}
                  disabled={!isCallActive}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isMuted ? "Unmute microphone" : "Mute microphone"
                  }
                >
                  <Ionicons
                    name={isMuted ? "mic-off-outline" : "mic-outline"}
                    size={27}
                    color="#071944"
                  />
                </TouchableOpacity>
                <Text className="mt-1.5 text-[11px] font-poppins-semibold text-white">
                  {isMuted ? "Muted" : "Mic"}
                </Text>
              </View>

              <View className="items-center">
                <TouchableOpacity className="h-14.5 w-14.5 items-center justify-center rounded-full bg-white">
                  <Ionicons name="language" size={26} color="#071944" />
                </TouchableOpacity>
                <Text className="mt-1.5 text-[11px] font-poppins-semibold text-white">
                  Subtitles
                </Text>
              </View>

              <View className="items-center">
                <TouchableOpacity
                  className="h-14.5 w-14.5 items-center justify-center rounded-full bg-[#FF3B42]"
                  onPress={handleEndCall}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isCallActive ? "End audio call" : "Close lesson"
                  }
                >
                  <Ionicons name="call" size={26} color="#FFFFFF" />
                </TouchableOpacity>
                <Text className="mt-1.5 text-[11px] font-poppins-semibold text-white">
                  {activeCall ? "End Call" : "Close"}
                </Text>
              </View>
            </View>
          </View>

          <View className="absolute bottom-4 left-4 right-4 rounded-[18px] bg-white px-3 py-3">
            <View className="flex-row">
              {FEEDBACK_ITEMS.map((item, index) => (
                <View
                  key={item.label}
                  className={`flex-1 items-center ${
                    index > 0 ? "border-l border-[#E8EAF2]" : ""
                  }`}
                >
                  <Text className="text-[11px] font-poppins-semibold text-[#07122F]">
                    {item.label}
                  </Text>
                  <Text
                    className="mt-1.5 text-[12px] font-poppins-bold"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="mt-2.5 flex-row rounded-[28px] bg-white px-2 py-1.5">
          {LESSON_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.label}
              className="flex-1 items-center justify-center py-1.5"
              onPress={() => router.push(tab.route)}
            >
              <Ionicons
                name={tab.icon}
                size={20}
                color={tab.isActive ? "#6C4EF5" : "#5D667F"}
              />
              <Text
                className={`mt-0.5 text-[10px] font-poppins-medium ${
                  tab.isActive ? "text-purple" : "text-[#5D667F]"
                }`}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );

  return screenContent;
}
