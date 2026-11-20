import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors, Typography, BorderRadius, Spacing, Shadows } from "../constants/theme";
import { Calendar, ChevronRight } from "lucide-react-native";

interface UpcomingHarvestCardProps {
  cropName: string;
  harvestCountdown: string;
  targetQuantity: string;
  imageUrl?: string;
  onPress?: () => void;
}

export const UpcomingHarvestCard: React.FC<UpcomingHarvestCardProps> = ({
  cropName,
  harvestCountdown,
  targetQuantity,
  imageUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.thumbnailContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
        ) : (
          <Text style={styles.emoji}>🌱</Text>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.cropName}>{cropName}</Text>
        <View style={styles.badgeRow}>
          <Calendar size={12} color={Colors.harvestAlert} />
          <Text style={styles.countdownText}>{harvestCountdown}</Text>
        </View>
        <Text style={styles.targetText}>Est. Output: {targetQuantity}</Text>
      </View>

      <ChevronRight size={18} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  thumbnailContainer: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.lightGreen,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginRight: Spacing.md,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  emoji: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  cropName: {
    fontSize: Typography.fontSize.md,
    fontWeight: "bold",
    color: Colors.text,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  countdownText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.harvestAlert,
    fontWeight: "600",
    marginLeft: 4,
  },
  targetText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
