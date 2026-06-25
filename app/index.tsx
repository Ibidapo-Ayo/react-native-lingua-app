import { useAuth } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/onboarding");
  };

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-h2">Screen Title</Text>
      <Text className="text-body-md text-text-secondary mb-6">
        This is the main screen of the app.
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
        className="mt-4 rounded-2xl border-2 border-purple px-8 py-4"
        onPress={handleSignOut}
      >
        <Text className="font-poppins-semibold text-body-lg text-purple">
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}
