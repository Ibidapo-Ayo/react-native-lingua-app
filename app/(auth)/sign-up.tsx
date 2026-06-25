import PrimaryButton from "@/components/PrimaryButton";
import VerificationModal from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { useSignUp, useSSO } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
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

WebBrowser.maybeCompleteAuthSession();

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MASCOT_SIZE = SCREEN_HEIGHT < 700 ? 100 : SCREEN_HEIGHT < 800 ? 120 : 140;

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [verificationError, setVerificationError] = useState("");

  const isLoading = !isLoaded;

  const handleSignUp = async () => {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setEmailError("");
      return;
    }

    setEmailError("");
    setVerificationError("");

    const { error } = await signUp.create({
      emailAddress: trimmed,
      password,
    });

    if (error) {
      setEmailError(error.message || "Unable to sign up. Please try again.");
      return;
    }

    const sendResult = await signUp.prepareEmailAddressVerification({
      strategy: "email_code",
    });
    if (sendResult.error) {
      setEmailError(
        sendResult.error.message || "Unable to send verification code.",
      );
      return;
    }

    setShowVerification(true);
  };

  const handleVerifyCode = async (code: string) => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive!({
          session: completeSignUp.createdSessionId,
        });

        setShowVerification(false);
        router.replace("/");
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));

      setVerificationError(
        err?.errors?.[0]?.longMessage ||
          err?.errors?.[0]?.message ||
          "Invalid code.",
      );
    }
  };

  const handleResendCode = async () => {
    const resend = await signUp.prepareEmailAddressVerification({
      strategy: "email_code",
    });
    if (resend.error) {
      setVerificationError(resend.error.message || "Unable to resend code.");
      return;
    }

    setVerificationError("");
  };

  const handleSocialSignIn = async (
    strategy: "oauth_google" | "oauth_facebook" | "oauth_apple",
  ) => {
    const redirectUrl = Linking.createURL("/(auth)/sign-up");

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch {
      setEmailError("Unable to continue with social sign-in right now.");
    }
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
          <TouchableOpacity
            className="px-5 pt-2 pb-2"
            onPress={() => router.back()}
            style={{ alignSelf: "flex-start" }}
          >
            <Ionicons name="chevron-back" size={26} color="#0D132B" />
          </TouchableOpacity>

          <View className="px-6 flex-1 justify-between">
            <View>
              <Text className="text-h2">Create your account</Text>
              <Text className="text-body-lg text-text-secondary mb-2">
                Start your language journey today ✨
              </Text>

              <View className="items-center mb-2">
                <View className="relative">
                  <Text
                    className="absolute text-warning"
                    style={{ top: 4, left: -6, fontSize: 18 }}
                  >
                    ✦
                  </Text>
                  <Text
                    className="absolute text-blue"
                    style={{ top: 0, right: -4, fontSize: 14 }}
                  >
                    ✦
                  </Text>
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
                <Text className="text-caption text-error mb-1">
                  {emailError}
                </Text>
              ) : (
                <View className="mb-1" />
              )}

              <View className="auth-input mb-4">
                <Text className="text-caption text-text-secondary mb-1">
                  Password
                </Text>
                <View className="flex-row items-center">
                  <TextInput
                    className="flex-1 text-body-lg text-text-primary font-poppins"
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={{ padding: 0 }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={showPassword ? "eye" : "eye-outline"}
                      size={22}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <PrimaryButton
                title={isLoading ? "Signing Up..." : "Sign Up"}
                onPress={handleSignUp}
                className="mb-4"
              />

              <View className="flex-row items-center mb-4">
                <View className="flex-1 h-px bg-border" />
                <Text className="mx-4 text-body-sm text-text-secondary">
                  or continue with
                </Text>
                <View className="flex-1 h-px bg-border" />
              </View>

              <View className="gap-2.5">
                <TouchableOpacity
                  className="auth-social-btn"
                  onPress={() => void handleSocialSignIn("oauth_google")}
                >
                  <Ionicons name="logo-google" size={20} color="#DB4437" />
                  <Text className="ml-4 text-body-md font-poppins-medium text-text-primary">
                    Continue with Google
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="auth-social-btn"
                  onPress={() => void handleSocialSignIn("oauth_facebook")}
                >
                  <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                  <Text className="ml-4 text-body-md font-poppins-medium text-text-primary">
                    Continue with Facebook
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="auth-social-btn"
                  onPress={() => void handleSocialSignIn("oauth_apple")}
                >
                  <Ionicons name="logo-apple" size={20} color="#000000" />
                  <Text className="ml-4 text-body-md font-poppins-medium text-text-primary">
                    Continue with Apple
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row items-center justify-center py-4">
              <Text className="text-body-md text-text-secondary">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => router.replace("/(auth)/sign-in")}
              >
                <Text className="text-body-md text-purple font-poppins-semibold">
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationModal
        visible={showVerification}
        onClose={() => setShowVerification(false)}
        email={email}
        onSubmitCode={handleVerifyCode}
        onResend={handleResendCode}
        loading={isLoading}
        errorMessage={verificationError}
      />

      <View nativeID="clerk-captcha" />
    </SafeAreaView>
  );
}
