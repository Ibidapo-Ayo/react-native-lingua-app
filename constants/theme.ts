/**
 * Lingua Design System Tokens
 * Based on the brand design theme
 */

export const colors = {
  // Primary
  primary: {
    purple: "#6C4EF5",
    deepPurple: "#5B3BF6",
    blue: "#4D8BFF",
    green: "#21C16B",
  },

  // Semantic
  semantic: {
    success: "#21C16B",
    warning: "#FFC800",
    streak: "#FF8A00",
    error: "#FF4D4F",
    info: "#4D8BFF",
  },

  // Neutrals
  neutral: {
    textPrimary: "#0D132B",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    surface: "#F6F7FB",
    background: "#FFFFFF",
  },
} as const;

export const typography = {
  fontFamily: {
    regular: "Poppins-Regular",
    medium: "Poppins-Medium",
    semibold: "Poppins-SemiBold",
    bold: "Poppins-Bold",
  },

  // H1 - Page / Screen Title
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
    lineHeight: 1.2,
  },

  // H2 - Section Title
  h2: {
    fontSize: 24,
    fontWeight: "600" as const,
    lineHeight: 1.3,
  },

  // H3 - Card / Module Title
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 1.3,
  },

  // H4 - Subheading
  h4: {
    fontSize: 16,
    fontWeight: "500" as const,
    lineHeight: 1.4,
  },

  // Body Large - Important content
  bodyLarge: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 1.6,
  },

  // Body Medium - Body text
  bodyMedium: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 1.6,
  },

  // Body Small - Supporting text
  bodySmall: {
    fontSize: 13,
    fontWeight: "400" as const,
    lineHeight: 1.6,
  },

  // Caption - Labels, meta text
  caption: {
    fontSize: 11,
    fontWeight: "400" as const,
    lineHeight: 1.4,
  },
} as const;
