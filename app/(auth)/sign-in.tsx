import PrimaryButton from "@/components/PrimaryButton";
import VerificationModal from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MASCOT_SIZE = SCREEN_HEIGHT < 700 ? 100 : SCREEN_HEIGHT < 800 ? 120 : 140;

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleSignIn = () => {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    setShowVerification(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            className="px-5 pt-2 pb-2"
            onPress={() => router.back()}
            style={{ alignSelf: "flex-start" }}
          >
            <Ionicons name="chevron-back" size={26} color="#0D132B" />
          </TouchableOpacity>

          <View className="px-6 flex-1 justify-between">
            <View>
              {/* Heading */}
              <Text className="text-h2">Welcome back</Text>
              <Text className="text-body-lg text-text-secondary mb-2">
                Continue your language journey ✨
              </Text>

              {/* Mascot with decorative stars */}
              <View className="items-center mb-2">
                <View className="relative">
                  {/* Top-left yellow star */}
                  <Text
                    className="absolute text-warning"
                    style={{ top: 4, left: -6, fontSize: 18 }}
                  >
                    ✦
                  </Text>
                  {/* Top-right blue star */}
                  <Text
                    className="absolute text-blue"
                    style={{ top: 0, right: -4, fontSize: 14 }}
                  >
                    ✦
                  </Text>
                  {/* Bottom-right yellow star */}
                  <Text
                    className="absolute text-warning"
                    style={{ bottom: 20, right: -10, fontSize: 16 }}
                  >
                    ✦
                  </Text>

                  <Image
                    source={images.mascotAuth}
                    style={{ width: MASCOT_SIZE, height: MASCOT_SIZE }}
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* Email Input */}
              <View className="auth-input mb-1">
                <Text className="text-caption text-text-secondary mb-1">
                  Email
                </Text>
                <TextInput
                  className="text-body-lg text-text-primary font-poppins"
                  placeholder="alex@gmail.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError("");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ padding: 0 }}
                />
              </View>
              {emailError ? (
                <Text className="text-caption text-error mb-3">
                  {emailError}
                </Text>
              ) : (
                <View className="mb-3" />
              )}

              {/* Sign In Button */}
              <PrimaryButton
                title="Sign In"
                onPress={handleSignIn}
                className="mb-4"
              />

              {/* Divider */}
              <View className="flex-row items-center mb-4">
                <View className="flex-1 h-px bg-border" />
                <Text className="mx-4 text-body-sm text-text-secondary">
                  or continue with
                </Text>
                <View className="flex-1 h-px bg-border" />
              </View>

              {/* Social Buttons */}
              <View className="gap-2.5">
                <TouchableOpacity className="auth-social-btn">
                  <Ionicons name="logo-google" size={20} color="#DB4437" />
                  <Text className="ml-4 text-body-md font-poppins-medium text-text-primary">
                    Continue with Google
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="auth-social-btn">
                  <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                  <Text className="ml-4 text-body-md font-poppins-medium text-text-primary">
                    Continue with Facebook
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="auth-social-btn">
                  <Ionicons name="logo-apple" size={20} color="#000000" />
                  <Text className="ml-4 text-body-md font-poppins-medium text-text-primary">
                    Continue with Apple
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View className="flex-row items-center justify-center py-4">
              <Text className="text-body-md text-text-secondary">
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => router.replace("/(auth)/sign-up")}
              >
                <Text className="text-body-md text-purple font-poppins-semibold">
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Verification Modal */}
      <VerificationModal
        visible={showVerification}
        onClose={() => setShowVerification(false)}
        email={email}
      />
    </SafeAreaView>
  );
}
