import PrimaryButton from "@/components/PrimaryButton";
import { images } from "@/constants/images";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="flex-1 items-center px-6 pt-8">
        {/* Logo */}
        <View className="flex-row items-center gap-2 mb-6">
          <Image
            source={images.mascotLogo}
            className="w-10 h-10"
            resizeMode="contain"
          />
          <Text className="text-h2">muolingo</Text>
        </View>

        {/* Heading */}
        <View className="w-full mb-2">
          <Text className="text-h1">
            Your AI language{"\n"}
            <Text className="text-purple">teacher</Text>.
          </Text>
        </View>

        {/* Subtitle */}
        <View className="w-full mb-6">
          <Text className="text-body-lg text-text-secondary">
            Real conversations, personalized{"\n"}lessons, anytime, anywhere.
          </Text>
        </View>

        {/* Mascot with speech bubbles */}
        <View className="flex-1 items-center justify-center w-full relative">
          {/* Hello bubble - top left, slight counter-clockwise tilt */}
          <View className="absolute left-2 top-8 z-10 rotate-[-5deg]">
            <View className="bg-gray-50 rounded-2xl px-5 py-2.5 shadow-md">
              <Text className="text-body-lg font-poppins-bold text-text-primary">
                Hello!
              </Text>
            </View>
            <View className="w-0 h-0 border-l-8 border-r-8 border-t-10 border-l-transparent border-r-transparent border-t-gray-50 self-end mr-4" />
          </View>

          {/* Hola bubble - top right, slight clockwise tilt */}
          <View className="absolute right-6 top-0 z-10 rotate-[4deg]">
            <View className="bg-blue-50 rounded-2xl px-5 py-2.5 shadow-md">
              <Text className="text-body-lg font-poppins-bold text-blue">
                ¡Hola!
              </Text>
            </View>
            <View className="w-0 h-0 border-l-8 border-r-8 border-t-10 border-l-transparent border-r-transparent border-t-blue-50 self-start ml-4" />
          </View>

          {/* 你好 bubble - mid right, below Hola, above mascot hand */}
          <View className="absolute right-4 top-[38%] z-10 rotate-3">
            <View className="w-0 h-0 border-l-8 border-r-8 border-b-10 border-l-transparent border-r-transparent border-b-red-50 self-start ml-5" />
            <View className="bg-red-50 rounded-2xl px-5 py-2.5 shadow-md">
              <Text className="text-body-lg font-poppins-bold text-red-500">
                你好!
              </Text>
            </View>
          </View>

          {/* Mascot image */}
          <Image
            source={images.mascotWelcome}
            className="w-72 h-72"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Get Started Button */}
      <View className="px-6 pb-8">
        <PrimaryButton
          title="Get Started"
          onPress={() => router.push("/(auth)/sign-up")}
        />
      </View>
    </SafeAreaView>
  );
}
