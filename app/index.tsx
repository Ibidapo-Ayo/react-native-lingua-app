import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-h2">Screen Title</Text>
      <Text className="text-bodyMedium text-gray-500">
        This is the main screen of the app.
      </Text>
    </View>
  );
}
