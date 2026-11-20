import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, Typography, BorderRadius, Spacing } from "../constants/theme";
import { useAuthStore } from "../store/authStore";
import { UserRole } from "../types";

export const RoleSwitcherBar: React.FC = () => {
  const { role, loginDemo } = useAuthStore();

  const roles: { label: string; value: UserRole }[] = [
    { label: "🌾 Farmer", value: "FARMER" },
    { label: "🛒 Buyer", value: "BUYER" },
    { label: "📦 Bulk Buyer", value: "BULK_BUYER" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.headerLabel}>Demo Role Preview:</Text>
      <View style={styles.pillRow}>
        {roles.map((r) => {
          const isActive = role === r.value;
          return (
            <TouchableOpacity
              key={r.value}
              onPress={() => loginDemo(r.value)}
              style={[styles.pill, isActive && styles.activePill]}
              activeOpacity={0.8}
            >
              <Text style={[styles.pillText, isActive && styles.activePillText]}>
                {r.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  pillRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  pill: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  activePill: {
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.primary,
  },
  pillText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  activePillText: {
    color: Colors.darkGreen,
    fontWeight: "bold",
  },
});
