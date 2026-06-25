import { images } from "@/constants/images";
import { SUPPORTED_LANGUAGES } from "@/data/languages";
import { useLanguageStore } from "@/store/language-store";
import type { SupportedLanguage } from "@/types/learning";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LANGUAGE_LEARNERS: Record<string, string> = {
  spanish: "28.4M learners",
  french: "19.4M learners",
  japanese: "12.7M learners",
};

const EARTH_IMAGE_HEIGHT_RATIO = 0.5;
const USE_FLAG_IMAGE_FALLBACK = Platform.OS === "android";

function getFlagEmoji(flagCode: string): string {
  return String.fromCodePoint(
    ...flagCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0)),
  );
}

function getFlagImageUri(flagCode: string): string {
  return `https://flagcdn.com/w80/${flagCode.toLowerCase()}.png`;
}

export default function LanguageScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const { selectedLanguageId, setSelectedLanguageId } = useLanguageStore();
  const [searchQuery, setSearchQuery] = useState("");
  const earthImageHeight = Math.min(
    Math.round(screenWidth * EARTH_IMAGE_HEIGHT_RATIO),
    220,
  );
  const footerSpace = Math.max(earthImageHeight - 24, 70);

  const handleLanguageSelect = (languageId: SupportedLanguage["id"]) => {
    setSelectedLanguageId(languageId);
    router.replace("/");
  };

  const visibleLanguages = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    if (!trimmedQuery) {
      return SUPPORTED_LANGUAGES;
    }

    return SUPPORTED_LANGUAGES.filter((language) => {
      return (
        language.name.toLowerCase().includes(trimmedQuery) ||
        language.nativeName.toLowerCase().includes(trimmedQuery)
      );
    });
  }, [searchQuery]);

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: "#ffffff" }}
    >
      <View className="relative flex-1 px-5">
        <View style={{ paddingBottom: footerSpace }}>
          <View className="mb-4 mt-1 flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="h-10 w-10 items-start justify-center"
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={28} color="#0D132B" />
            </TouchableOpacity>

            <Text className="flex-1 pr-10 text-center text-h4">
              Choose a language
            </Text>
          </View>

          <View className="mb-5 flex-row items-center rounded-3xl border border-border bg-surface px-4 py-1">
            <Ionicons name="search-outline" size={20} color="#6B7280" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search languages"
              placeholderTextColor="#6B7280"
              className="ml-3 flex-1 text-body-md"
              selectionColor="#6C4EF5"
            />
          </View>

          <Text className="mb-3 text-h4">Popular</Text>

          <View className="gap-2.5">
            {visibleLanguages.map((language) => {
              const isSelected = language.id === selectedLanguageId;

              return (
                <TouchableOpacity
                  key={language.id}
                  className={`flex-row items-center rounded-3xl border px-4 py-3 ${
                    isSelected ? "border-purple" : "border-border"
                  }`}
                  onPress={() => handleLanguageSelect(language.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${language.name}`}
                >
                  <View className="h-11 w-11 items-center justify-center rounded-full border border-border bg-white">
                    {USE_FLAG_IMAGE_FALLBACK ? (
                      <Image
                        source={{ uri: getFlagImageUri(language.flagCode) }}
                        style={{ height: 24, width: 24, borderRadius: 12 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={{ fontSize: 24 }}>
                        {getFlagEmoji(language.flagCode)}
                      </Text>
                    )}
                  </View>

                  <View className="ml-4 flex-1">
                    <Text className="text-h4">{language.name}</Text>
                    <Text className="text-body-md text-text-secondary">
                      {LANGUAGE_LEARNERS[language.id] ?? "New learners"}
                    </Text>
                  </View>

                  {isSelected ? (
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-purple">
                      <Ionicons name="checkmark" size={18} color="#ffffff" />
                    </View>
                  ) : (
                    <Ionicons
                      name="chevron-forward"
                      size={22}
                      color="#6B7280"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Image
          source={images.earth}
          className="absolute bottom-0 left-0 right-0 w-full self-center"
          style={{ height: earthImageHeight, width: screenWidth }}
          resizeMode="cover"
        />
      </View>
    </SafeAreaView>
  );
}
