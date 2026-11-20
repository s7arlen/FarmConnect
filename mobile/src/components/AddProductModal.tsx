import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Colors, Typography, BorderRadius, Spacing, Shadows } from "../constants/theme";
import { Product, ProductUnit } from "../types";
import { X, Plus, Sparkles, Check } from "lucide-react-native";

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onAddProduct: (product: Partial<Product>) => void;
}

const CATEGORIES = [
  { id: "VEGETABLES", label: "Vegetables", icon: "🥦" },
  { id: "FRUITS", label: "Fruits", icon: "🍎" },
  { id: "GRAINS", label: "Grains", icon: "🌾" },
  { id: "DAIRY", label: "Dairy", icon: "🥛" },
  { id: "HERBS", label: "Herbs & Spices", icon: "🌿" },
];

const UNITS: ProductUnit[] = ["kg", "quintal", "crate", "bundle", "piece", "bag"];

export const AddProductModal: React.FC<AddProductModalProps> = ({
  visible,
  onClose,
  onAddProduct,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("VEGETABLES");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<ProductUnit>("kg");
  const [harvestDate, setHarvestDate] = useState("Freshly Harvested Today");
  const [description, setDescription] = useState("");
  const [isOrganic, setIsOrganic] = useState(true);

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Missing Information", "Please enter the crop or produce name.");
      return;
    }
    const numPrice = parseFloat(price);
    const numQty = parseFloat(quantity);

    if (isNaN(numPrice) || numPrice <= 0) {
      Alert.alert("Invalid Price", "Please enter a valid price per unit.");
      return;
    }
    if (isNaN(numQty) || numQty <= 0) {
      Alert.alert("Invalid Quantity", "Please enter an available quantity.");
      return;
    }

    onAddProduct({
      name: name.trim(),
      category,
      price: numPrice,
      quantity: numQty,
      unit,
      harvestDate,
      description: description.trim() || `${isOrganic ? "Certified 100% Organic produce. " : ""}Direct from local farm.`,
      status: "AVAILABLE",
    });

    // Reset fields
    setName("");
    setPrice("");
    setQuantity("");
    setDescription("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>List New Crop / Produce</Text>
              <Text style={styles.subtitle}>Directly updates your digital stock & marketplace</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Category Selector */}
            <Text style={styles.label}>Select Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setCategory(cat.id)}
                    style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                  >
                    <Text style={styles.catIcon}>{cat.icon}</Text>
                    <Text style={[styles.catText, isSelected && styles.catTextActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Produce Name */}
            <Text style={styles.label}>Crop / Produce Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Organic Roma Tomatoes, Alfonso Mangoes"
              placeholderTextColor={Colors.textSecondary}
              value={name}
              onChangeText={setName}
            />

            {/* Pricing & Units */}
            <View style={styles.row}>
              <View style={[styles.col, { flex: 1.2 }]}>
                <Text style={styles.label}>Price (₹) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 45"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>

              <View style={[styles.col, { flex: 1 }]}>
                <Text style={styles.label}>Unit</Text>
                <View style={styles.unitSelector}>
                  {UNITS.slice(0, 3).map((u) => (
                    <TouchableOpacity
                      key={u}
                      onPress={() => setUnit(u)}
                      style={[styles.unitBtn, unit === u && styles.unitBtnActive]}
                    >
                      <Text style={[styles.unitText, unit === u && styles.unitTextActive]}>
                        /{u}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Quantity Available */}
            <View style={styles.row}>
              <View style={[styles.col, { flex: 1 }]}>
                <Text style={styles.label}>Available Stock ({unit}) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 150"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
                />
              </View>

              <View style={[styles.col, { flex: 1.2 }]}>
                <Text style={styles.label}>Harvest Status</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Today / In 2 days"
                  placeholderTextColor={Colors.textSecondary}
                  value={harvestDate}
                  onChangeText={setHarvestDate}
                />
              </View>
            </View>

            {/* Organic Switcher */}
            <TouchableOpacity
              onPress={() => setIsOrganic(!isOrganic)}
              style={[styles.organicPill, isOrganic && styles.organicPillActive]}
            >
              <View style={styles.organicRow}>
                <Sparkles size={16} color={isOrganic ? Colors.primary : Colors.textSecondary} />
                <Text style={[styles.organicText, isOrganic && styles.organicTextActive]}>
                  {isOrganic ? "Certified Organic Farming (Zero Chemical Pesticides)" : "Conventional Farm Produce"}
                </Text>
              </View>
              {isOrganic && <Check size={16} color={Colors.primary} />}
            </TouchableOpacity>

            {/* Description */}
            <Text style={styles.label}>Farm Notes & Variety (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g. Naturally sun-ripened, hand-picked this morning. Ideal for retail and home kitchens."
              placeholderTextColor={Colors.textSecondary}
              multiline
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
            />

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Plus size={18} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>List Produce on Marketplace</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    maxHeight: "88%",
    ...Shadows.floating,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: "bold",
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 6,
    marginTop: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: "row",
    marginBottom: Spacing.sm,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.pill,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.primary,
  },
  catIcon: {
    marginRight: 6,
    fontSize: 14,
  },
  catText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  catTextActive: {
    color: Colors.darkGreen,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
  },
  textArea: {
    height: 70,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  col: {
    flex: 1,
  },
  unitSelector: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 2,
  },
  unitBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: BorderRadius.sm,
  },
  unitBtnActive: {
    backgroundColor: Colors.primary,
  },
  unitText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  unitTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  organicPill: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  organicPillActive: {
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.primary,
  },
  organicRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  organicText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: "500",
    flex: 1,
  },
  organicTextActive: {
    color: Colors.darkGreen,
    fontWeight: "700",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
    paddingVertical: 14,
    marginTop: Spacing.lg,
    ...Shadows.card,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: Typography.fontSize.sm,
    fontWeight: "bold",
  },
});
