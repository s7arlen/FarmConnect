import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Colors, Typography, BorderRadius, Spacing, Shadows } from "../constants/theme";
import { Product } from "../types";
import { X, CheckCircle, MapPin, Clock, Plus, Minus, ShoppingCart, ShieldCheck, Heart } from "lucide-react-native";

interface ProductDetailModalProps {
  product: Product | null;
  visible: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  visible,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) return null;

  const handleIncrement = () => {
    if (quantity < product.quantity) {
      setQuantity((prev) => prev + 1);
    } else {
      Alert.alert("Stock Limit", `Only ${product.quantity} ${product.unit} available from this harvest.`);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAdd = () => {
    onAddToCart(product, quantity);
    Alert.alert("Added to Basket", `${quantity} ${product.unit} of ${product.name} added to your basket.`);
    setQuantity(1);
    onClose();
  };

  const subtotal = product.price * quantity;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Top Floating Controls */}
          <View style={styles.topControls}>
            <TouchableOpacity onPress={onClose} style={styles.circleBtn}>
              <X size={18} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsWishlisted(!isWishlisted)}
              style={styles.circleBtn}
            >
              <Heart
                size={18}
                color={isWishlisted ? "#E53935" : Colors.text}
                fill={isWishlisted ? "#E53935" : "transparent"}
              />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Produce Hero Image */}
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri:
                    product.image ||
                    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80",
                }}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <View style={styles.freshnessTag}>
                <Clock size={12} color="#FFFFFF" />
                <Text style={styles.freshnessText}>
                  {product.harvestDate || "Harvested Today"}
                </Text>
              </View>
            </View>

            {/* Farm Origin Badge */}
            <View style={styles.farmOriginCard}>
              <View style={styles.farmOriginLeft}>
                <Text style={styles.farmOriginTitle}>{product.farmName || "Green Valley Organic Farm"}</Text>
                <View style={styles.locationRow}>
                  <MapPin size={12} color={Colors.textSecondary} />
                  <Text style={styles.locationText}>
                    {product.farmerAddress || "Mandya, Karnataka"} • {product.distanceKm || 4.2} km away
                  </Text>
                </View>
              </View>
              {product.farmerVerified !== false && (
                <View style={styles.verifiedBadge}>
                  <ShieldCheck size={14} color={Colors.darkGreen} />
                  <Text style={styles.verifiedText}>Verified Farm</Text>
                </View>
              )}
            </View>

            {/* Product Title & Pricing */}
            <View style={styles.infoSection}>
              <View style={styles.nameCategoryRow}>
                <Text style={styles.productName}>{product.name}</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{product.category}</Text>
                </View>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>₹{product.price}</Text>
                <Text style={styles.unitText}>/ {product.unit}</Text>
                <View style={styles.stockPill}>
                  <CheckCircle size={12} color={Colors.darkGreen} />
                  <Text style={styles.stockText}>{product.quantity} {product.unit} available</Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <View style={styles.descSection}>
              <Text style={styles.sectionHeader}>About This Harvest</Text>
              <Text style={styles.descriptionText}>
                {product.description ||
                  "Freshly picked directly from the farm at dawn. Free of synthetic waxes and harmful chemical sprays. Transported with optimal temperature preservation to retain full nutritional density and aroma."}
              </Text>
            </View>

            {/* Fair-Trade Direct Impact Card */}
            <View style={styles.impactCard}>
              <Text style={styles.impactTitle}>🤝 Direct Farmer Benefit</Text>
              <Text style={styles.impactSub}>
                100% of this purchase goes directly to the farmer without middleman deductions or commission losses.
              </Text>
            </View>
          </ScrollView>

          {/* Bottom Bar: Stepper + Add to Basket */}
          <View style={styles.footerBar}>
            <View style={styles.stepperContainer}>
              <TouchableOpacity onPress={handleDecrement} style={styles.stepperBtn}>
                <Minus size={16} color={Colors.text} />
              </TouchableOpacity>
              <Text style={styles.stepperValue}>
                {quantity} {product.unit}
              </Text>
              <TouchableOpacity onPress={handleIncrement} style={styles.stepperBtn}>
                <Plus size={16} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addToCartBtn} onPress={handleAdd}>
              <ShoppingCart size={18} color="#FFFFFF" />
              <View style={styles.cartBtnLabels}>
                <Text style={styles.cartBtnText}>Add to Basket</Text>
                <Text style={styles.cartBtnSub}>₹{subtotal}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: "92%",
    paddingTop: Spacing.sm,
    ...Shadows.floating,
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    zIndex: 10,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 220,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  freshnessTag: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(40, 85, 43, 0.9)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
  },
  freshnessText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  farmOriginCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.lightGreen,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  farmOriginLeft: {
    flex: 1,
  },
  farmOriginTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "bold",
    color: Colors.darkGreen,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.darkGreen,
  },
  infoSection: {
    marginBottom: Spacing.md,
  },
  nameCategoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  productName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: "bold",
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 6,
    gap: 6,
  },
  priceText: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: "bold",
    color: Colors.primary,
  },
  unitText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginRight: 10,
  },
  stockPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.lightGreen,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  stockText: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.darkGreen,
  },
  descSection: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  impactCard: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  impactTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 2,
  },
  impactSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  footerBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
    ...Shadows.floating,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "bold",
    color: Colors.text,
    paddingHorizontal: 8,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    ...Shadows.card,
  },
  cartBtnLabels: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cartBtnText: {
    color: "#FFFFFF",
    fontSize: Typography.fontSize.sm,
    fontWeight: "bold",
  },
  cartBtnSub: {
    color: "#FFFFFF",
    fontSize: Typography.fontSize.xs,
    opacity: 0.9,
    fontWeight: "600",
  },
});
