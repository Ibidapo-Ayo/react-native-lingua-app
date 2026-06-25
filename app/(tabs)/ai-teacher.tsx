import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AITeacherScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-h2 mb-2">AI Teacher</Text>
        <Text className="text-body-md text-text-secondary text-center">
          AI Teacher screen placeholder.
        </Text>
      </View>
    </SafeAreaView>
  );
}
