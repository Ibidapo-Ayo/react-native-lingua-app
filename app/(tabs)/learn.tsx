import { images } from "@/constants/images";
import { SUPPORTED_LANGUAGES } from "@/data/languages";
import { LESSONS } from "@/data/lessons";
import { UNITS } from "@/data/units";
import { useLanguageStore } from "@/store/language-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LessonStatus = "completed" | "in-progress" | "not-started";

function getFlagEmoji(flagCode: string): string {
  return String.fromCodePoint(
    ...flagCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0)),
  );
}

function getLessonStatus(index: number): LessonStatus {
  if (index <= 1) {
    return "completed";
  }

  if (index === 2) {
    return "in-progress";
  }

  return "not-started";
}

export default function LearnScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<"lessons" | "practice">("lessons");
  const { hasHydrated, selectedLanguageId } = useLanguageStore();

  const selectedLanguage = useMemo(
    () =>
      SUPPORTED_LANGUAGES.find(
        (language) => language.id === selectedLanguageId,
      ) ?? null,
    [selectedLanguageId],
  );

  const selectedUnit = useMemo(() => {
    if (!selectedLanguage) {
      return null;
    }

    return (
      UNITS.filter((unit) => unit.languageId === selectedLanguage.id).sort(
        (a, b) => a.order - b.order,
      )[0] ?? null
    );
  }, [selectedLanguage]);

  const lessons = useMemo(() => {
    if (!selectedUnit) {
      return [];
    }

    return selectedUnit.lessonIds
      .map((lessonId) => LESSONS.find((lesson) => lesson.id === lessonId))
      .filter((lesson): lesson is (typeof LESSONS)[number] => Boolean(lesson))
      .sort((a, b) => a.order - b.order);
  }, [selectedUnit]);

  const featuredLesson = lessons[2] ?? lessons[0] ?? null;

  if (!hasHydrated) {
    return null;
  }

  if (!selectedLanguage || !selectedUnit || !featuredLesson) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-h3 text-center">Choose a language first</Text>
          <TouchableOpacity
            className="mt-4 rounded-2xl bg-purple px-5 py-2.5"
            onPress={() => router.push("/language")}
          >
            <Text className="font-poppins-semibold text-[14px] text-white">
              Go to Language Selection
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const completedCount = lessons.filter(
    (_, index) => getLessonStatus(index) === "completed",
  ).length;
  const activeLessonIndex = lessons.findIndex(
    (_, index) => getLessonStatus(index) === "in-progress",
  );
  const completionPercent = Math.max(
    10,
    Math.round((completedCount / lessons.length) * 100),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFF" }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 22 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pb-1 pt-2">
          <View className="flex-row items-center">
            <TouchableOpacity
              className="h-10 w-10 items-center justify-center rounded-full border border-[#E8ECF4] bg-white"
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={22} color="#0D132B" />
            </TouchableOpacity>

            <View className="ml-3 flex-1">
              <Text className="text-[25px] leading-7.5 font-poppins-bold text-[#0D132B]">
                {featuredLesson.title}
              </Text>
              <Text className="mt-0.5 text-[12px] font-poppins-medium text-[#6B7280]">
                Unit {selectedUnit.order} • {completedCount} / {lessons.length}{" "}
                lessons
              </Text>
            </View>

            <TouchableOpacity
              className="h-9 min-w-14 flex-row items-center justify-center rounded-full border border-[#E4E8F3] bg-white px-2.5"
              onPress={() => router.push("/language")}
              accessibilityRole="button"
              accessibilityLabel="Choose language"
            >
              <Text style={{ fontSize: 16 }}>
                {getFlagEmoji(selectedLanguage.flagCode)}
              </Text>
              <Ionicons
                name="swap-horizontal"
                size={13}
                color="#5C46F6"
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          className="mx-5 mt-3 overflow-hidden rounded-3xl"
          style={{ height: Math.min(238, width * 0.5) }}
        >
          <Image
            source={images.mascotWelcome}
            resizeMode="cover"
            className="w-full h-full"
          />

          <View
            pointerEvents="none"
            className="absolute bottom-0 left-0 right-0 h-24"
          />

          <View className="absolute bottom-3 left-3 right-3 rounded-2xl bg-white/95 px-3.5 py-2.5">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-[11px] font-poppins-medium text-[#6E7490]">
                  Learning Progress
                </Text>
                <Text className="mt-0.5 text-[14px] font-poppins-semibold text-[#111936]">
                  {completionPercent}% completed
                </Text>
              </View>

              <Text className="text-[11px] font-poppins-medium text-[#5C46F6]">
                Lesson {Math.max(activeLessonIndex + 1, 1)} active
              </Text>
            </View>

            <View className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#E8EBF5]">
              <View
                className="h-full rounded-full bg-[#5C46F6]"
                style={{ width: `${completionPercent}%` }}
              />
            </View>
          </View>
        </View>

        <View className="mx-5 mt-3 rounded-[20px] border border-[#E9ECF5] bg-white p-1.5">
          <View className="flex-row rounded-2xl bg-[#F2F4FA] p-1">
            <TouchableOpacity
              className={`flex-1 items-center rounded-[14px] py-3 ${
                activeTab === "lessons" ? "bg-white" : "bg-transparent"
              }`}
              style={
                activeTab === "lessons"
                  ? {
                      shadowColor: "#3E4D7C",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.12,
                      shadowRadius: 7,
                      elevation: 3,
                    }
                  : undefined
              }
              onPress={() => setActiveTab("lessons")}
            >
              <Text
                className={`text-[14px] font-poppins-medium ${
                  activeTab === "lessons" ? "text-purple" : "text-[#4C5674]"
                }`}
              >
                Lessons
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 items-center rounded-[14px] py-3 ${
                activeTab === "practice" ? "bg-white" : "bg-transparent"
              }`}
              style={
                activeTab === "practice"
                  ? {
                      shadowColor: "#3E4D7C",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.12,
                      shadowRadius: 7,
                      elevation: 3,
                    }
                  : undefined
              }
              onPress={() => setActiveTab("practice")}
            >
              <Text
                className={`text-[14px] font-poppins-medium ${
                  activeTab === "practice" ? "text-purple" : "text-[#4C5674]"
                }`}
              >
                Practice
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-4 px-5">
          {activeTab === "lessons" ? (
            <View className="gap-3">
              {lessons.map((lesson, index) => {
                const status = getLessonStatus(index);
                const isInProgress = status === "in-progress";
                const isCompleted = status === "completed";
                const statusLabel = isCompleted
                  ? "Completed"
                  : isInProgress
                    ? "In progress"
                    : "Not started";
                const badgeClasses = isCompleted
                  ? "bg-[#E9F8EF] text-[#1FA855]"
                  : isInProgress
                    ? "bg-[#ECE9FF] text-[#5D43F7]"
                    : "bg-[#EEF1F8] text-[#6D748C]";

                return (
                  <TouchableOpacity
                    key={lesson.id}
                    className={`rounded-[20px] border bg-white px-4 py-3.5 ${
                      isInProgress
                        ? "border-[#8271FF] bg-[#F6F4FF]"
                        : "border-[#E8EBF3]"
                    }`}
                    style={{
                      shadowColor: "#151B2B",
                      shadowOffset: { width: 0, height: 5 },
                      shadowOpacity: isInProgress ? 0.12 : 0.05,
                      shadowRadius: 10,
                      elevation: isInProgress ? 4 : 2,
                    }}
                    onPress={() =>
                      router.push({
                        pathname: "/lesson/[lessonId]",
                        params: { lessonId: lesson.id },
                      })
                    }
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1 pr-3">
                        <View className="mb-1.5 flex-row items-center">
                          <Text
                            className={`text-[12px] font-poppins-semibold ${
                              isInProgress ? "text-[#5D43F7]" : "text-[#6D748C]"
                            }`}
                          >
                            Lesson {index + 1}
                          </Text>

                          <View className="ml-2 rounded-full px-2 py-1">
                            <Text
                              className={`text-[10px] font-poppins-semibold ${badgeClasses}`}
                            >
                              {statusLabel}
                            </Text>
                          </View>
                        </View>

                        <Text className="text-[18px] leading-5.5 font-poppins-semibold text-[#121A39]">
                          {lesson.title}
                        </Text>

                        {isInProgress ? (
                          <Text className="mt-1 text-[12px] font-poppins-medium text-[#5D43F7]">
                            Continue where you left off
                          </Text>
                        ) : null}

                        <View className="mt-2 flex-row items-center gap-3">
                          <View className="flex-row items-center">
                            <Ionicons
                              name="time-outline"
                              size={13}
                              color="#7A849F"
                            />
                            <Text className="ml-1 text-[11px] font-poppins-medium text-[#7A849F]">
                              {lesson.estimatedMinutes} min
                            </Text>
                          </View>

                          <View className="flex-row items-center">
                            <Ionicons name="flash" size={13} color="#FF8A00" />
                            <Text className="ml-1 text-[11px] font-poppins-medium text-[#7A849F]">
                              {lesson.xpReward} XP
                            </Text>
                          </View>
                        </View>
                      </View>

                      {isCompleted ? (
                        <View className="h-8 w-8 items-center justify-center rounded-full bg-[#34C759]">
                          <Ionicons
                            name="checkmark"
                            size={19}
                            color="#FFFFFF"
                          />
                        </View>
                      ) : null}

                      {isInProgress ? (
                        <Image
                          source={images.treasure}
                          resizeMode="contain"
                          style={{ width: 31, height: 31 }}
                        />
                      ) : null}

                      {status === "not-started" ? (
                        <Ionicons
                          name="lock-closed-outline"
                          size={20}
                          color="#7180AD"
                        />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View className="gap-2.5">
              <View className="rounded-[20px] border border-[#E8EBF3] bg-white px-4 py-3.5">
                <Text className="text-[14px] font-poppins-semibold text-[#111936]">
                  Vocabulary Sprint
                </Text>
                <Text className="mt-1 text-[12px] font-poppins-medium text-[#6B7280]">
                  12 quick cards based on this unit
                </Text>
              </View>

              <View className="rounded-[20px] border border-[#E8EBF3] bg-white px-4 py-3.5">
                <Text className="text-[14px] font-poppins-semibold text-[#111936]">
                  Listening Boost
                </Text>
                <Text className="mt-1 text-[12px] font-poppins-medium text-[#6B7280]">
                  Train your ear with short prompts
                </Text>
              </View>

              <View className="rounded-[20px] border border-[#E8EBF3] bg-white px-4 py-3.5">
                <Text className="text-[14px] font-poppins-semibold text-[#111936]">
                  Speaking Rehearsal
                </Text>
                <Text className="mt-1 text-[12px] font-poppins-medium text-[#6B7280]">
                  Repeat and record common phrases
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
