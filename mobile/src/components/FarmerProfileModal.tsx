import React from "react";
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
import { FarmerProfile, Product } from "../types";
import { X, ShieldCheck, MapPin, Star, Award, Phone, Calendar, Leaf } from "lucide-react-native";

interface FarmerProfileModalProps {
  farmer: FarmerProfile | null;
  products?: Product[];
  visible: boolean;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const FarmerProfileModal: React.FC<FarmerProfileModalProps> = ({
  farmer,
  products = [],
  visible,
  onClose,
  onSelectProduct,
}) => {
  if (!farmer) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Top Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Farm Cover Banner */}
            <View style={styles.bannerWrapper}>
              <Image
                source={{
                  uri:
                    farmer.coverImage ||
                    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80",
                }}
                style={styles.coverImage}
              />
              <View style={styles.coverGradient} />
            </View>

            {/* Farm Info Card */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarRow}>
                <Image
                  source={{
                    uri:
                      farmer.profileImage ||
                      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80",
                  }}
                  style={styles.avatar}
                />
                <View style={styles.badgeRow}>
                  {farmer.verified && (
                    <View style={styles.verifiedTag}>
                      <ShieldCheck size={14} color="#FFFFFF" />
                      <Text style={styles.verifiedText}>FPO Verified</Text>
                    </View>
                  )}
                  <View style={styles.ratingTag}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.ratingText}>
                      {farmer.rating?.toFixed(1) || "4.9"} ({farmer.reviewCount || 34})
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.farmName}>{farmer.farmName}</Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color={Colors.textSecondary} />
                <Text style={styles.locationText}>
                  {farmer.address || "Mandya Taluk, Mandya District, Karnataka"}
                </Text>
              </View>

              <Text style={styles.description}>
                {farmer.description ||
                  "Multi-generational family farm dedicated to chemical-free sustainable farming. We practice drip irrigation, vermicomposting, and heirloom crop preservation to provide nutrient-rich produce directly to our local communities."}
              </Text>
            </View>

            {/* Farm Highlights & Metrics */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Leaf size={18} color={Colors.primary} />
                <Text style={styles.metricValue}>100% Organic</Text>
                <Text style={styles.metricLabel}>Practices</Text>
              </View>
              <View style={styles.metricCard}>
                <Calendar size={18} color={Colors.primary} />
                <Text style={styles.metricValue}>Est. {farmer.establishedYear || 2018}</Text>
                <Text style={styles.metricLabel}>Heritage</Text>
              </View>
              <View style={styles.metricCard}>
                <Award size={18} color={Colors.primary} />
                <Text style={styles.metricValue}>Grade A</Text>
                <Text style={styles.metricLabel}>Govt Mandi Rank</Text>
              </View>
            </View>

            {/* Active Produce from this Farmer */}
            <View style={styles.produceSection}>
              <Text style={styles.sectionTitle}>Fresh Harvests from this Farm</Text>
              {products.length === 0 ? (
                <View style={styles.emptyProduceBox}>
                  <Text style={styles.emptyText}>All current season harvests have been reserved.</Text>
                </View>
              ) : (
                products.map((prod) => (
                  <TouchableOpacity
                    key={prod.id}
                    style={styles.produceCard}
                    onPress={() => {
                      if (onSelectProduct) onSelectProduct(prod);
                    }}
                  >
                    <Image
                      source={{
                        uri:
                          prod.image ||
                          "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&q=80",
                      }}
                      style={styles.produceThumb}
                    />
                    <View style={styles.produceInfo}>
                      <Text style={styles.produceName}>{prod.name}</Text>
                      <Text style={styles.produceDate}>{prod.harvestDate || "Harvested Today"}</Text>
                      <Text style={styles.producePrice}>
                        ₹{prod.price} <Text style={styles.produceUnit}>/ {prod.unit}</Text>
                      </Text>
                    </View>
                    <View style={styles.stockStatus}>
                      <Text style={styles.stockQty}>{prod.quantity} {prod.unit}</Text>
                      <Text style={styles.stockAvail}>in stock</Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>

            {/* Direct Contact Button */}
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={() => Alert.alert("Farmer Connect", `Dialing direct farm helpline for ${farmer.farmName}...`)}
            >
              <Phone size={18} color="#FFFFFF" />
              <Text style={styles.contactBtnText}>Contact Farm Helpline</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: "94%",
    overflow: "hidden",
    ...Shadows.floating,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: BorderRadius.pill,
    padding: 8,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  bannerWrapper: {
    position: "relative",
    width: "100%",
    height: 160,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  profileHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    marginTop: -32,
  },
  avatarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    backgroundColor: Colors.border,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  verifiedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  verifiedText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  ratingTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  ratingText: {
    color: Colors.text,
    fontSize: 11,
    fontWeight: "bold",
  },
  farmName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: "bold",
    color: Colors.text,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
    marginBottom: Spacing.sm,
  },
  locationText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  description: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  metricsGrid: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    gap: 10,
    marginTop: Spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.lightGreen,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: "center",
  },
  metricValue: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "bold",
    color: Colors.darkGreen,
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  produceSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptyProduceBox: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  emptyText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  produceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  produceThumb: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
  },
  produceInfo: {
    flex: 1,
    marginLeft: 10,
  },
  produceName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "bold",
    color: Colors.text,
  },
  produceDate: {
    fontSize: 10,
    color: Colors.harvestAlert,
    marginTop: 2,
  },
  producePrice: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: 2,
  },
  produceUnit: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: "normal",
  },
  stockStatus: {
    alignItems: "flex-end",
  },
  stockQty: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "bold",
    color: Colors.text,
  },
  stockAvail: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.darkGreen,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    paddingVertical: 14,
    borderRadius: BorderRadius.pill,
    ...Shadows.card,
  },
  contactBtnText: {
    color: "#FFFFFF",
    fontSize: Typography.fontSize.sm,
    fontWeight: "bold",
  },
});
