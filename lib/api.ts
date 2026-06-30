import Constants from "expo-constants";
import { Platform } from "react-native";

const trimTrailingSlash = (value: string) => value.replace(/\/$/, "");

export function getApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const configuredBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  if (configuredBaseUrl) {
    return `${trimTrailingSlash(configuredBaseUrl)}${normalizedPath}`;
  }

  if (Platform.OS === "web") {
    return normalizedPath;
  }

  const hostUri = Constants.expoConfig?.hostUri;

  if (hostUri) {
    return `http://${hostUri}${normalizedPath}`;
  }

  return normalizedPath;
}