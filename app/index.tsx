import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

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
    </View>
  );
}
