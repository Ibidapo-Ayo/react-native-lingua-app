import { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  email: string;
  onSubmitCode: (code: string) => Promise<void> | void;
  onResend: () => Promise<void> | void;
  loading?: boolean;
  errorMessage?: string;
}

const CODE_LENGTH = 6;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const INPUT_SIZE = Math.min((SCREEN_WIDTH - 80) / CODE_LENGTH, 48);

export default function VerificationModal({
  visible,
  onClose,
  email,
  onSubmitCode,
  onResend,
  loading = false,
  errorMessage,
}: VerificationModalProps) {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (visible) {
      setCode(Array(CODE_LENGTH).fill(""));
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 300);
    }
  }, [visible]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];

    // Handle pasting full code
    if (text.length > 1) {
      const digits = text.replace(/\D/g, "").slice(0, CODE_LENGTH);
      for (let i = 0; i < CODE_LENGTH; i++) {
        newCode[i] = digits[i] || "";
      }
      setCode(newCode);
      if (digits.length === CODE_LENGTH) {
        void submitCode(digits);
      } else {
        inputRefs.current[digits.length]?.focus();
      }
      return;
    }

    newCode[index] = text;
    setCode(newCode);

    if (text && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (text && index === CODE_LENGTH - 1) {
      const fullCode = newCode.join("");
      if (fullCode.length === CODE_LENGTH) {
        void submitCode(fullCode);
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitCode = async (fullCode: string) => {
    if (isSubmittingRef.current || loading || fullCode.length !== CODE_LENGTH) {
      return;
    }

    isSubmittingRef.current = true;
    Keyboard.dismiss();

    try {
      await onSubmitCode(fullCode);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-end bg-black/50">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View className="bg-white rounded-t-3xl px-6 pt-8 pb-10">
              {/* Header */}
              <View className="items-center mb-6">
                <Text className="text-h2 mb-2">Verify your email</Text>
                <Text className="text-body-md text-text-secondary text-center">
                  We&apos;ve sent a verification code to{"\n"}
                  <Text className="text-text-primary font-poppins-medium">
                    {email || "your email"}
                  </Text>
                </Text>
              </View>

              {/* Code Input */}
              <View className="flex-row justify-center mb-8">
                {Array(CODE_LENGTH)
                  .fill(0)
                  .map((_, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => {
                        inputRefs.current[index] = ref;
                      }}
                      style={{
                        width: INPUT_SIZE,
                        height: INPUT_SIZE + 8,
                        borderWidth: 2,
                        borderRadius: 12,
                        borderColor: code[index] ? "#6C4EF5" : "#E5E7EB",
                        color: "#0D132B",
                        textAlign: "center",
                        fontSize: 20,
                        fontFamily: "Poppins-Bold",
                        marginHorizontal: 4,
                      }}
                      value={code[index]}
                      onChangeText={(text) => handleCodeChange(text, index)}
                      onKeyPress={({ nativeEvent }) =>
                        handleKeyPress(nativeEvent.key, index)
                      }
                      keyboardType="number-pad"
                      maxLength={index === 0 ? CODE_LENGTH : 1}
                      selectTextOnFocus
                    />
                  ))}
              </View>

              {/* Resend */}
              <View className="flex-row items-center justify-center">
                <Text className="text-body-md text-text-secondary">
                  Didn&apos;t receive the code?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => void onResend()}
                  disabled={loading}
                >
                  <Text className="text-body-md text-purple font-poppins-semibold">
                    Resend
                  </Text>
                </TouchableOpacity>
              </View>
              {errorMessage ? (
                <Text className="text-caption text-error text-center mt-3">
                  {errorMessage}
                </Text>
              ) : null}
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
