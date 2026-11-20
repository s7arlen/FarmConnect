/**
 * FarmConnect Mobile Design System
 * Visual Benchmark: GoParm Agricultural Application Reference
 */

export const Colors = {
  // Brand Greens
  primary: "#4D8B38",       // Vibrant harvest green for CTAs & active tabs
  darkGreen: "#28552B",     // Forest green for titles & strong accents
  lightGreen: "#E8F4D9",    // Pastel green for metric badges & card highlights
  accentGreen: "#3B6E2C",   // Intermediate green for status & icons

  // Neutral Backgrounds
  background: "#F7F9F2",    // GoParm off-white canvas
  surface: "#FFFFFF",       // White card surfaces
  surfaceHover: "#F0F5E9",  // Subtle hover/press state

  // Typography Colors
  text: "#202A20",          // High contrast primary text
  textSecondary: "#788276", // Muted labels, units, and timestamps
  textLight: "#A5AFA3",     // Placeholder and subtle hints
  textInverse: "#FFFFFF",   // White text on dark/green backgrounds

  // Dividers & Borders
  border: "#E7EDE2",        // Soft border for cards and dividers
  borderFocus: "#4D8B38",   // Focused input border

  // Status & Agricultural Indicators
  badgeFresh: "#E8F4D9",
  badgeFreshText: "#28552B",
  harvestAlert: "#E67E22",   // Harvest countdown amber
  harvestAlertBg: "#FDF2E9",
  error: "#D32F2F",
  errorBg: "#FFEBEE",
  warning: "#F57C00",
  warningBg: "#FFF3E0",
  success: "#388E3C",
  successBg: "#E8F5E9",
};

export const Typography = {
  fontFamily: {
    regular: "System",
    medium: "System",
    semibold: "System",
    bold: "System",
  },
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    hero: 30,
  },
  lineHeight: {
    xs: 15,
    sm: 18,
    md: 22,
    lg: 24,
    xl: 28,
    xxl: 32,
    hero: 38,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const Shadows = {
  card: {
    shadowColor: "#202A20",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  floating: {
    shadowColor: "#202A20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },
};
