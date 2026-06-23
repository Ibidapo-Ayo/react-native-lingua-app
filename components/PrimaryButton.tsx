import { Text, TouchableOpacity } from "react-native";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
  accessibilityLabel?: string;
}

export default function PrimaryButton({
  title,
  onPress,
  className = "",
  accessibilityLabel,
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      className={`btn-primary ${className}`}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
    >
      <Text className="text-white text-body-lg font-poppins-semibold">
        {title}
      </Text>
    </TouchableOpacity>
  );
}
