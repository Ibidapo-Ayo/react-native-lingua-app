import { SUPPORTED_LANGUAGES } from "@/data/languages";
import { useLanguageStore } from "@/store/language-store";
import { useAuth } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { hasHydrated, selectedLanguageId, clearSelectedLanguageId } =
    useLanguageStore();
  const router = useRouter();
  const selectedLanguage = SUPPORTED_LANGUAGES.find(
    (language) => language.id === selectedLanguageId,
  );

  const handleSignOut = async () => {
    await signOut();
    router.replace("/onboarding");
  };

  if (!isLoaded) {
    return null;
  }

  if (!hasHydrated) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  if (!selectedLanguageId) {
    return <Redirect href="/language" />;
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-h2">Screen Title</Text>
      <Text className="text-body-md text-text-secondary mb-6">
        This is the main screen of the app.
      </Text>
      <Text className="mb-6 font-poppins-medium text-body-md text-text-primary">
        Selected language: {selectedLanguage?.name ?? selectedLanguageId}
      </Text>
      <TouchableOpacity
        className="bg-purple rounded-2xl px-8 py-4"
        onPress={() => router.push("/onboarding")}
      >
        <Text className="text-white font-poppins-semibold text-body-lg">
          Open Onboarding
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-4 rounded-2xl border-2 border-deep-purple px-8 py-4"
        onPress={() => router.push("/language")}
      >
        <Text className="font-poppins-semibold text-body-lg text-deep-purple">
          Choose Language
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-4 rounded-2xl border-2 border-purple px-8 py-4"
        onPress={handleSignOut}
      >
        <Text className="font-poppins-semibold text-body-lg text-purple">
          Sign Out
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-4 rounded-2xl border-2 border-red-500 px-8 py-4"
        onPress={async () => {
          await AsyncStorage.removeItem("language-storage");
          clearSelectedLanguageId();
          router.replace("/language");
        }}
      >
        <Text className="font-poppins-semibold text-body-lg text-red-500">
          Clear AsyncStorage
        </Text>
      </TouchableOpacity>
    </View>
  );
}
