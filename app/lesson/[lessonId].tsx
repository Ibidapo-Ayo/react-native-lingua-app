import { images } from "@/constants/images";
import { SUPPORTED_LANGUAGES } from "@/data/languages";
import { LESSONS } from "@/data/lessons";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
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

function getFlagEmoji(flagCode: string): string {
  return String.fromCodePoint(
    ...flagCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0)),
  );
}

export default function LessonDetailScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  const lesson = LESSONS.find((item) => item.id === lessonId);
  const language = SUPPORTED_LANGUAGES.find(
    (item) => item.id === lesson?.languageId,
  );

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

  return (
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
              <View className="mr-1.5 h-2.5 w-2.5 rounded-full bg-[#18D318]" />
              <Text className="text-[12px] font-poppins-medium text-[#68718D]">
                Online
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
                    Live audio
                  </Text>
                </View>
                <Text className="mt-1 text-[13px] leading-5 font-poppins-medium text-[#07122F]">
                  {lesson.aiTeacherPrompt.openingLine}
                </Text>
                <Text className="mt-1 text-[10px] font-poppins-medium text-[#6B7280]">
                  Practice: {primaryPhrase?.text ?? lesson.title}
                </Text>
              </View>
            </View>
          </View>

          <View className="absolute bottom-24 left-4 right-4">
            <View className="flex-row items-center justify-between">
              <View className="items-center">
                <TouchableOpacity className="h-14.5 w-14.5 items-center justify-center rounded-full bg-white">
                  <Ionicons name="radio-outline" size={24} color="#071944" />
                </TouchableOpacity>
                <Text className="mt-1.5 text-[11px] font-poppins-semibold text-white">
                  Preview
                </Text>
              </View>

              <View className="items-center">
                <TouchableOpacity className="h-14.5 w-14.5 items-center justify-center rounded-full bg-white">
                  <Ionicons name="mic-outline" size={27} color="#071944" />
                </TouchableOpacity>
                <Text className="mt-1.5 text-[11px] font-poppins-semibold text-white">
                  Mic
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
                  onPress={() => router.back()}
                >
                  <Ionicons name="call" size={26} color="#FFFFFF" />
                </TouchableOpacity>
                <Text className="mt-1.5 text-[11px] font-poppins-semibold text-white">
                  End Call
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
}
