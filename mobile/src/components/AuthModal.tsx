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
import { useAuthStore } from "../store/authStore";
import { UserRole } from "../types";
import { X, LogIn, UserPlus, Shield, User, ShoppingBag, Truck } from "lucide-react-native";

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose }) => {
  const { setRole, setUser } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("FARMER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleAuthSubmit = () => {
    if (isRegister && !name.trim()) {
      Alert.alert("Missing Name", "Please enter your full name.");
      return;
    }
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing Credentials", "Please enter your email and password.");
      return;
    }

    // Set user in store
    setRole(selectedRole);
    setUser({
      id: "u_" + Math.random().toString(36).substring(7),
      name: name.trim() || (selectedRole === "FARMER" ? "Ramesh Gowda" : "Priya Sharma"),
      email: email.trim(),
      phone: phone.trim() || "+91 98450 12345",
      role: selectedRole,
    });

    Alert.alert(
      "Success",
      `Welcome to FarmConnect as ${selectedRole.replace("_", " ")}!`,
      [{ text: "OK", onPress: onClose }]
    );
  };

  const handleQuickDemo = (role: UserRole) => {
    setRole(role);
    Alert.alert("Demo Mode", `Switched to ${role.replace("_", " ")} demo session.`);
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
              <Text style={styles.title}>{isRegister ? "Join FarmConnect" : "Welcome Back"}</Text>
              <Text style={styles.subtitle}>
                {isRegister
                  ? "Create a direct agricultural trade account"
                  : "Sign in to access your farm, market or procurement portal"}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Quick Demo Switcher Section */}
            <View style={styles.quickDemoBox}>
              <Text style={styles.quickDemoTitle}>🚀 Instant One-Tap College Demo Logins:</Text>
              <View style={styles.quickDemoButtons}>
                <TouchableOpacity
                  style={[styles.demoBtn, { backgroundColor: Colors.lightGreen }]}
                  onPress={() => handleQuickDemo("FARMER")}
                >
                  <Text style={[styles.demoBtnText, { color: Colors.darkGreen }]}>Farmer Demo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.demoBtn, { backgroundColor: "#E3F2FD" }]}
                  onPress={() => handleQuickDemo("BUYER")}
                >
                  <Text style={[styles.demoBtnText, { color: "#1565C0" }]}>Buyer Demo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.demoBtn, { backgroundColor: "#FFF3E0" }]}
                  onPress={() => handleQuickDemo("BULK_BUYER")}
                >
                  <Text style={[styles.demoBtnText, { color: "#E65100" }]}>Bulk Demo</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Role Selection */}
            <Text style={styles.label}>Select Your Account Role</Text>
            <View style={styles.roleGrid}>
              <TouchableOpacity
                onPress={() => setSelectedRole("FARMER")}
                style={[styles.roleCard, selectedRole === "FARMER" && styles.roleCardActive]}
              >
                <User size={18} color={selectedRole === "FARMER" ? Colors.primary : Colors.textSecondary} />
                <Text style={[styles.roleTitle, selectedRole === "FARMER" && styles.roleTitleActive]}>
                  Farmer
                </Text>
                <Text style={styles.roleDesc}>Sell crops & manage stock</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelectedRole("BUYER")}
                style={[styles.roleCard, selectedRole === "BUYER" && styles.roleCardActive]}
              >
                <ShoppingBag
                  size={18}
                  color={selectedRole === "BUYER" ? Colors.primary : Colors.textSecondary}
                />
                <Text style={[styles.roleTitle, selectedRole === "BUYER" && styles.roleTitleActive]}>
                  Consumer
                </Text>
                <Text style={styles.roleDesc}>Buy fresh farm harvest</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelectedRole("BULK_BUYER")}
                style={[styles.roleCard, selectedRole === "BULK_BUYER" && styles.roleCardActive]}
              >
                <Truck
                  size={18}
                  color={selectedRole === "BULK_BUYER" ? Colors.primary : Colors.textSecondary}
                />
                <Text style={[styles.roleTitle, selectedRole === "BULK_BUYER" && styles.roleTitleActive]}>
                  Commercial
                </Text>
                <Text style={styles.roleDesc}>Wholesale & restaurants</Text>
              </TouchableOpacity>
            </View>

            {/* Input Fields */}
            {isRegister && (
              <>
                <Text style={styles.label}>Full Name / Farm / Business Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Ramesh Gowda"
                  placeholderTextColor={Colors.textSecondary}
                  value={name}
                  onChangeText={setName}
                />
              </>
            )}

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. farmer@farmconnect.org"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            {isRegister && (
              <>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+91 98450 12345"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </>
            )}

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.textSecondary}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleAuthSubmit}>
              {isRegister ? <UserPlus size={18} color="#FFFFFF" /> : <LogIn size={18} color="#FFFFFF" />}
              <Text style={styles.submitBtnText}>{isRegister ? "Create Account" : "Sign In"}</Text>
            </TouchableOpacity>

            {/* Toggle Sign-In vs Register */}
            <TouchableOpacity onPress={() => setIsRegister(!isRegister)} style={styles.toggleRow}>
              <Text style={styles.toggleText}>
                {isRegister ? "Already have an account? " : "New to FarmConnect? "}
                <Text style={styles.toggleTextBold}>{isRegister ? "Sign In" : "Register Now"}</Text>
              </Text>
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
    maxHeight: "90%",
    ...Shadows.floating,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
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
  quickDemoBox: {
    backgroundColor: Colors.background,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  quickDemoTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 6,
  },
  quickDemoButtons: {
    flexDirection: "row",
    gap: 8,
  },
  demoBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  demoBtnText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  label: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
    marginTop: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  roleGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: Spacing.xs,
  },
  roleCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  roleCardActive: {
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.primary,
  },
  roleTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: 4,
  },
  roleTitleActive: {
    color: Colors.darkGreen,
  },
  roleDesc: {
    fontSize: 9,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 2,
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
  toggleRow: {
    alignItems: "center",
    marginTop: Spacing.md,
    paddingVertical: 4,
  },
  toggleText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  toggleTextBold: {
    color: Colors.primary,
    fontWeight: "bold",
  },
});
