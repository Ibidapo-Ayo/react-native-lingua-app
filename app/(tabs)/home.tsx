import { images } from "@/constants/images";
import { SUPPORTED_LANGUAGES } from "@/data/languages";
import { LESSONS } from "@/data/lessons";
import { UNITS } from "@/data/units";
import { useLanguageStore } from "@/store/language-store";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DAILY_GOAL_XP = 20;

function getFlagEmoji(flagCode: string): string {
  return String.fromCodePoint(
    ...flagCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0)),
  );
}

const GREETINGS: Record<string, string> = {
  spanish: "Hola",
  french: "Salut",
  japanese: "Konnichiwa",
};

export default function HomeScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user } = useUser();
  const { hasHydrated, selectedLanguageId } = useLanguageStore();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    try {
      await signOut();
      router.replace("/onboarding");
    } catch (error) {
      console.error("Unable to sign out", error);
      setIsSigningOut(false);
    }
  };

  if (!hasHydrated) {
    return null;
  }

  const selectedLanguage = SUPPORTED_LANGUAGES.find(
    (language) => language.id === selectedLanguageId,
  );

  if (!selectedLanguage) {
    return null;
  }

  const languageLessons = LESSONS.filter(
    (lesson) => lesson.languageId === selectedLanguage.id,
  ).sort((a, b) => a.order - b.order);

  const currentLesson = languageLessons[0];

  if (!currentLesson) {
    return null;
  }

  const currentUnit =
    UNITS.find((unit) => unit.id === currentLesson.unitId) ??
    UNITS.find((unit) => unit.languageId === selectedLanguage.id);

  if (!currentUnit) {
    return null;
  }

  const earnedXp = Math.min(
    DAILY_GOAL_XP,
    currentLesson.vocabulary.length * 3 + currentLesson.goals.length * 3,
  );
  const goalProgress = Math.max(0.08, earnedXp / DAILY_GOAL_XP);

  const streakCount = Math.max(1, languageLessons.length * 6);
  const lessonUnitNumber = currentUnit.order + currentLesson.order + 1;

  const displayName =
    user?.firstName ??
    user?.username ??
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ??
    "Learner";

  const greeting = GREETINGS[selectedLanguage.id] ?? "Hello";
  const avatarUri =
    user?.imageUrl ?? "https://picsum.photos/seed/lingua-coach/200/200";

  const todayPlan = [
    {
      id: "lesson",
      title: "Lesson",
      subtitle: currentLesson.title,
      icon: "book",
      color: "#6454F5",
      done: true,
    },
    {
      id: "conversation",
      title: "AI Conversation",
      subtitle: `Practice ${currentLesson.aiTeacherPrompt.focusAreas[0] ?? "speaking"}`,
      icon: "headset",
      color: "#6454F5",
      done: false,
    },
    {
      id: "new-words",
      title: "New words",
      subtitle: `${currentLesson.vocabulary.length} words`,
      icon: "chatbubble-ellipses",
      color: "#FF6868",
      done: false,
    },
  ] as const;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 18,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              className="relative h-10 w-10 items-center justify-center rounded-full border border-[#ECECF1] bg-white"
              onPress={() => router.push("/language")}
              accessibilityRole="button"
              accessibilityLabel="Choose language"
            >
              <Text style={{ fontSize: 23 }}>
                {getFlagEmoji(selectedLanguage.flagCode)}
              </Text>
              <View className="absolute -bottom-1 -right-1 h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#5B45F6]">
                <Ionicons name="globe-outline" size={11} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <Text
              className="ml-3 max-w-[205px] text-[14px] font-poppins-semibold text-[#1E2344]"
              numberOfLines={1}
            >
              {greeting}, {displayName}! 👋
            </Text>
          </View>

          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center">
              <Image
                source={images.streakFire}
                resizeMode="contain"
                style={{ width: 22, height: 22 }}
              />
              <Text className="ml-1 text-[15px] font-poppins-medium text-[#51597A]">
                {streakCount}
              </Text>
            </View>

            <TouchableOpacity
              className="h-8 w-8 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Notifications"
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#3E4469"
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="h-8 w-8 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Log out"
              disabled={isSigningOut}
              onPress={handleSignOut}
            >
              <Ionicons name="log-out-outline" size={22} color="#3E4469" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-5 rounded-[24px] bg-[#F7F0E8] px-5 py-3.5">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-2">
              <Text className="text-[14px] font-poppins-medium text-[#344064]">
                Daily goal
              </Text>
              <View className="mt-1 flex-row items-end">
                <Text className="text-[28px] font-poppins-semibold text-[#1A2343]">
                  {earnedXp}
                </Text>
                <Text className="mb-0.5 ml-1.5 text-[16px] font-poppins-medium text-[#6C7695]">
                  / {DAILY_GOAL_XP} XP
                </Text>
              </View>
            </View>

            <Image
              source={images.treasure}
              resizeMode="contain"
              style={{ width: 74, height: 74 }}
            />
          </View>

          <View className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-[#EADBC5]">
            <View
              className="h-full rounded-full bg-[#FF8A00]"
              style={{ width: `${Math.round(goalProgress * 100)}%` }}
            />
          </View>
        </View>

        <View className="mt-4 overflow-hidden rounded-[24px] bg-[#5B45F6] px-5 py-4">
          <View
            className="absolute -right-8 -top-8 h-36 w-36 rounded-full"
            style={{ backgroundColor: "rgba(156, 141, 255, 0.22)" }}
          />
          <View
            className="absolute right-20 top-14 h-16 w-16 rounded-full"
            style={{ backgroundColor: "rgba(156, 141, 255, 0.14)" }}
          />

          <View className="pr-28">
            <Text className="text-[13px] font-poppins-medium text-[#D9D8FF]">
              Continue learning
            </Text>
            <Text className="mt-0.5 text-[22px] font-poppins-semibold text-white">
              {selectedLanguage.name}
            </Text>
            <Text className="mt-0.5 text-[14px] font-poppins-medium text-[#D9D8FF]">
              {currentUnit.cefrLevel} • Unit {lessonUnitNumber}
            </Text>

            <TouchableOpacity
              className="mt-3 self-start rounded-2xl bg-white px-5 py-2"
              onPress={() => router.push("/learn")}
            >
              <Text className="text-[15px] font-poppins-semibold text-[#5C45F6]">
                Continue
              </Text>
            </TouchableOpacity>
          </View>

          <Image
            source={images.palace}
            resizeMode="contain"
            style={{
              position: "absolute",
              right: -12,
              bottom: 0,
              width: 126,
              height: 114,
            }}
          />
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-[16px] font-poppins-semibold text-[#1F2645]">
            Today&apos;s plan
          </Text>
          <TouchableOpacity onPress={() => router.push("/learn")}>
            <Text className="text-[14px] font-poppins-semibold text-[#5E48F6]">
              View all
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-1 gap-2.5">
          {todayPlan.map((item) => (
            <View key={item.id} className="flex-row items-center py-1">
              <View
                className="h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: item.color }}
              >
                <Ionicons name={item.icon} size={20} color="#FFFFFF" />
              </View>

              <View className="ml-3.5 flex-1">
                <Text className="text-[15px] font-poppins-semibold text-[#1E2344]">
                  {item.title}
                </Text>
                <Text className="text-[12px] font-poppins-medium text-[#6B728F]">
                  {item.subtitle}
                </Text>
              </View>

              {item.done ? (
                <View className="h-7 w-7 items-center justify-center rounded-full bg-[#6454F5]">
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                </View>
              ) : (
                <View className="h-7 w-7 rounded-full border-2 border-[#A7ADC4]" />
              )}
            </View>
          ))}
        </View>

        <View className="mt-4 flex-row items-center rounded-[24px] bg-[#F3F8EC] px-5 py-3.5">
          <View className="flex-1 pr-3">
            <Text className="text-[12px] font-poppins-medium text-[#4B5275]">
              Next up
            </Text>
            <Text className="mt-1 text-[21px] font-poppins-semibold text-[#1E2344]">
              AI Video Call
            </Text>
            <Text className="text-[14px] font-poppins-medium text-[#5C6488]">
              Practice speaking
            </Text>
          </View>

          <View className="mr-2 h-16 w-16 overflow-hidden rounded-full border-4 border-[#EAF2DF] bg-[#EAF2DF]">
            <Image
              source={{ uri: avatarUri }}
              resizeMode="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </View>

          <View className="h-11 w-11 items-center justify-center rounded-full bg-[#56BE13]">
            <Ionicons name="videocam" size={19} color="#FFFFFF" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
