import { SUPPORTED_LANGUAGES } from "@/data/languages";
import { useLanguageStore } from "@/store/language-store";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const { hasHydrated, selectedLanguageId } = useLanguageStore();

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

  const selectedLanguage = SUPPORTED_LANGUAGES.find(
    (language) => language.id === selectedLanguageId,
  );

  if (!selectedLanguage) {
    return <Redirect href="/language" />;
  }

  return <Redirect href="/home" />;
}
