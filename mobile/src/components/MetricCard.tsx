import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Typography, BorderRadius, Spacing } from "../constants/theme";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  variant?: "light" | "surface";
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  subtitle,
  variant = "light",
}) => {
  return (
    <View
      style={[
        styles.card,
        variant === "light" ? styles.lightCard : styles.surfaceCard,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 84,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  lightCard: {
    backgroundColor: Colors.lightGreen,
  },
  surfaceCard: {
    backgroundColor: Colors.surface,
  },
  iconContainer: {
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: Typography.fontSize.lg,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: Typography.fontFamily.bold,
  },
  label: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    fontFamily: Typography.fontFamily.medium,
  },
  subtitle: {
    fontSize: 10,
    color: Colors.primary,
    marginTop: 2,
    fontWeight: "600",
  },
});
