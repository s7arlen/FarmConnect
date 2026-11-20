import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors, Typography, BorderRadius, Spacing, Shadows } from "../constants/theme";
import { MapPin, CheckCircle, ChevronRight } from "lucide-react-native";

interface FarmHeroCardProps {
  farmName: string;
  location: string;
  areaSize?: string;
  cropCount: number;
  temperature?: string;
  weather?: string;
  imageUrl?: string;
  onPress?: () => void;
}

export const FarmHeroCard: React.FC<FarmHeroCardProps> = ({
  farmName,
  location,
  areaSize = "12 Acres",
  cropCount,
  temperature = "29°C",
  weather = "Sunny",
  imageUrl = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.container}
    >
      <Image source={{ uri: imageUrl }} style={styles.backgroundImage} />

      {/* Floating Card Overlay (GoParm style) */}
      <View style={styles.floatingCard}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
              <Text style={styles.farmTitle} numberOfLines={1}>
                {farmName}
              </Text>
              <CheckCircle size={15} color={Colors.primary} style={{ marginLeft: 6 }} />
            </View>

            <View style={styles.locationRow}>
              <MapPin size={12} color={Colors.textSecondary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {location} · {areaSize}
              </Text>
            </View>
          </View>
          <ChevronRight size={18} color={Colors.textSecondary} />
        </View>

        {/* Metric Pills Row */}
        <View style={styles.metricRow}>
          <View style={styles.metricPill}>
            <Text style={styles.metricValue}>{cropCount}</Text>
            <Text style={styles.metricLabel}>Active Crops</Text>
          </View>

          <View style={styles.metricPill}>
            <Text style={styles.metricValue}>{temperature}</Text>
            <Text style={styles.metricLabel}>{weather}</Text>
          </View>

          <View style={styles.metricPill}>
            <Text style={styles.metricValue}>Good</Text>
            <Text style={styles.metricLabel}>Soil Moisture</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    height: 250,
    backgroundColor: Colors.surface,
    position: "relative",
    ...Shadows.card,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  floatingCard: {
    position: "absolute",
    bottom: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: "rgba(231, 237, 226, 0.8)",
    ...Shadows.floating,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  farmTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: "bold",
    color: Colors.text,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  locationText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  metricRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  metricPill: {
    flex: 1,
    backgroundColor: Colors.lightGreen,
    borderRadius: BorderRadius.sm,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  metricValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "bold",
    color: Colors.darkGreen,
  },
  metricLabel: {
    fontSize: 10,
    color: Colors.darkGreen,
    opacity: 0.8,
    marginTop: 1,
  },
});
