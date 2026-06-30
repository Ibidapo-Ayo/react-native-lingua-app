import "@/global.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { PostHogProvider } from "posthog-react-native";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to .env");
}

const posthogApiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY!;
const posthogHost = process.env.EXPO_PUBLIC_POSTHOG_HOST!;

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PostHogProvider apiKey={posthogApiKey} options={{ host: posthogHost }}>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="language" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </ClerkProvider>
    </PostHogProvider>
  );
}
