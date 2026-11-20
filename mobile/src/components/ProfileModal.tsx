import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Colors, Typography, BorderRadius, Spacing, Shadows } from "../constants/theme";
import { useAuthStore } from "../store/authStore";
import { X, User, ShieldCheck, LogOut, Settings, Award, Heart, HelpCircle, RefreshCw } from "lucide-react-native";

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  onClose,
  onOpenAuth,
}) => {
  const { user, role, logout, setRole } = useAuthStore();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => {
          logout();
          onClose();
          onOpenAuth();
        },
      },
    ]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Account Profile</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* User Info Card */}
            <View style={styles.userCard}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitial}>{user?.name?.[0] || "U"}</Text>
                </View>
              )}

              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user?.name || "Ramesh Gowda"}</Text>
                <Text style={styles.userEmail}>{user?.email || "ramesh.farmer@mandya.org"}</Text>
                <View style={styles.roleTag}>
                  <Text style={styles.roleTagText}>{role.replace("_", " ")}</Text>
                </View>
              </View>
            </View>

            {/* Quick Switch Role Bar */}
            <View style={styles.switchBox}>
              <Text style={styles.switchBoxTitle}>Quick Switch Active Role (Demo Mode)</Text>
              <View style={styles.switchRow}>
                <TouchableOpacity
                  onPress={() => setRole("FARMER")}
                  style={[styles.switchChip, role === "FARMER" && styles.switchChipActive]}
                >
                  <Text style={[styles.switchChipText, role === "FARMER" && styles.switchChipTextActive]}>
                    Farmer
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setRole("BUYER")}
                  style={[styles.switchChip, role === "BUYER" && styles.switchChipActive]}
                >
                  <Text style={[styles.switchChipText, role === "BUYER" && styles.switchChipTextActive]}>
                    Buyer
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setRole("BULK_BUYER")}
                  style={[styles.switchChip, role === "BULK_BUYER" && styles.switchChipActive]}
                >
                  <Text style={[styles.switchChipText, role === "BULK_BUYER" && styles.switchChipTextActive]}>
                    Bulk
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Verification Status Banner */}
            <View style={styles.verifiedCard}>
              <ShieldCheck size={20} color={Colors.darkGreen} />
              <View style={styles.verifiedInfo}>
                <Text style={styles.verifiedTitle}>Agricultural Identity Verified</Text>
                <Text style={styles.verifiedSub}>
                  Linked with Mandya District Farmer Producer Organisation (FPO #KA-2024-891).
                </Text>
              </View>
            </View>

            {/* College Project Meta Card */}
            <View style={styles.metaCard}>
              <View style={styles.metaHeader}>
                <Award size={16} color={Colors.primary} />
                <Text style={styles.metaTitle}>College Community Project</Text>
              </View>
              <Text style={styles.metaDesc}>
                FarmConnect — Eliminating Middlemen in Indian Agriculture via Direct-to-Consumer & Bulk Institutional Marketplace.
              </Text>
              <Text style={styles.metaVersion}>Version 2.0.0 (Native React Native Expo)</Text>
            </View>

            {/* Actions List */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => Alert.alert("Settings", "App preferences & notification toggles.")}
            >
              <Settings size={18} color={Colors.text} />
              <Text style={styles.actionText}>App Settings & Vernacular Language</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => Alert.alert("Support", "Connecting to local Krishi Vigyan Kendra (KVK) helpline...")}
            >
              <HelpCircle size={18} color={Colors.text} />
              <Text style={styles.actionText}>Help & Mandi Price Advisory</Text>
            </TouchableOpacity>

            {/* Logout / Switch Account */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <LogOut size={18} color="#D32F2F" />
              <Text style={styles.logoutBtnText}>Sign Out / Change Account</Text>
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
    maxHeight: "85%",
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
  closeBtn: {
    padding: 6,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.lg,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.lightGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: Typography.fontSize.lg,
    fontWeight: "bold",
    color: Colors.darkGreen,
  },
  userInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  userName: {
    fontSize: Typography.fontSize.md,
    fontWeight: "bold",
    color: Colors.text,
  },
  userEmail: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  roleTag: {
    alignSelf: "flex-start",
    backgroundColor: Colors.lightGreen,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
    marginTop: 6,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.darkGreen,
  },
  switchBox: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  switchBoxTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.textSecondary,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  switchRow: {
    flexDirection: "row",
    gap: 8,
  },
  switchChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BorderRadius.pill,
    alignItems: "center",
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  switchChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  switchChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  switchChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  verifiedCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightGreen,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: 10,
    marginBottom: Spacing.md,
  },
  verifiedInfo: {
    flex: 1,
  },
  verifiedTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "bold",
    color: Colors.darkGreen,
  },
  verifiedSub: {
    fontSize: 10,
    color: Colors.darkGreen,
    marginTop: 2,
    lineHeight: 14,
  },
  metaCard: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  metaHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  metaTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "bold",
    color: Colors.primary,
  },
  metaDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  metaVersion: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 6,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  actionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: "500",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: Spacing.lg,
    paddingVertical: 12,
    borderRadius: BorderRadius.pill,
    backgroundColor: "#FFEBEE",
  },
  logoutBtnText: {
    color: "#D32F2F",
    fontSize: Typography.fontSize.sm,
    fontWeight: "bold",
  },
});
