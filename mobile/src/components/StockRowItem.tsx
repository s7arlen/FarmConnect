import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors, Typography, BorderRadius, Spacing } from "../constants/theme";
import { ChevronRight, Plus, Minus } from "lucide-react-native";
import { Product } from "../types";

interface StockRowItemProps {
  product: Product;
  onPress?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  showControls?: boolean;
}

export const StockRowItem: React.FC<StockRowItemProps> = ({
  product,
  onPress,
  onIncrement,
  onDecrement,
  showControls = true,
}) => {
  const isAvailable = product.quantity > 0;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}
    >
      {/* Crop Thumbnail */}
      <View style={styles.thumbnailContainer}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.thumbnail} />
        ) : (
          <Text style={styles.emojiFallback}>🌱</Text>
        )}
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.subtext}>
          ₹{product.price} / {product.unit} · {product.category}
        </Text>
      </View>

      {/* Stock Quantity (GoParm style) */}
      <View style={styles.rightSection}>
        <Text style={[styles.quantityText, !isAvailable && styles.outOfStockText]}>
          {product.quantity.toLocaleString()} {product.unit}
        </Text>

        {showControls ? (
          <View style={styles.stepper}>
            <TouchableOpacity
              onPress={onDecrement}
              style={styles.stepperButton}
              disabled={product.quantity <= 0}
            >
              <Minus size={14} color={Colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onIncrement}
              style={[styles.stepperButton, styles.incrementButton]}
            >
              <Plus size={14} color={Colors.textInverse} />
            </TouchableOpacity>
          </View>
        ) : (
          <ChevronRight size={18} color={Colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  thumbnailContainer: {
    width: 46,
    height: 46,
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
  emojiFallback: {
    fontSize: 22,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: Typography.fontSize.md,
    fontWeight: "bold",
    color: Colors.text,
  },
  subtext: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    textTransform: "capitalize",
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: Typography.fontSize.md,
    fontWeight: "bold",
    color: Colors.darkGreen,
    marginBottom: 4,
  },
  outOfStockText: {
    color: Colors.error,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stepperButton: {
    width: 26,
    height: 26,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  incrementButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
});
