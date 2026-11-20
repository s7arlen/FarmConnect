import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Colors,
  Typography,
  BorderRadius,
  Spacing,
  Shadows,
} from "../src/constants/theme";
import { useAuthStore } from "../src/store/authStore";
import { useStockStore } from "../src/store/stockStore";
import { useCartStore } from "../src/store/cartStore";
import { FarmHeroCard } from "../src/components/FarmHeroCard";
import { StockRowItem } from "../src/components/StockRowItem";
import { UpcomingHarvestCard } from "../src/components/UpcomingHarvestCard";
import { RoleSwitcherBar } from "../src/components/RoleSwitcherBar";
import { AddProductModal } from "../src/components/AddProductModal";
import { ProductDetailModal } from "../src/components/ProductDetailModal";
import { FarmerProfileModal } from "../src/components/FarmerProfileModal";
import { AuthModal } from "../src/components/AuthModal";
import { ProfileModal } from "../src/components/ProfileModal";
import { Product, FarmerProfile } from "../src/types";
import { MOCK_FARMERS, MOCK_ORDERS, MOCK_BULK_REQUIREMENTS } from "../src/constants/mockData";
import {
  Bell,
  Search,
  ShoppingCart,
  Plus,
  Package,
  Layers,
  CheckCircle,
  Clock,
  MapPin,
  Home,
  User as UserIcon,
  ShoppingBag,
  Boxes,
  FileText,
  Share2,
} from "lucide-react-native";

export default function MobileAppRoot() {
  const { role, user } = useAuthStore();
  const { products, activeTab: stockTab, setActiveTab: setStockTab, updateStock } = useStockStore();
  const { items: cartItems, addItem: addToCart, updateQuantity: updateCartQty, getTotalAmount } = useCartStore();

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [farmerOrders, setFarmerOrders] = useState(MOCK_ORDERS);

  // Interactive Modals State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [selectedFarmerProfile, setSelectedFarmerProfile] = useState<FarmerProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleAddProduct = (newProd: Partial<Product>) => {
    const fullProd: Omit<Product, "id"> = {
      farmerId: user?.id || "f_1",
      name: newProd.name || "Fresh Crop",
      category: newProd.category || "VEGETABLES",
      price: newProd.price || 40,
      quantity: newProd.quantity || 100,
      unit: newProd.unit || "kg",
      status: "AVAILABLE",
      harvestDate: newProd.harvestDate || "Harvested Today",
      description: newProd.description,
      farmName: "Joseph's Agro Farm",
      farmerAddress: "Bantwal, Dakshina Kannada",
      farmerVerified: true,
      distanceKm: 2.5,
      image:
        newProd.category === "FRUITS"
          ? "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=500&q=80"
          : newProd.category === "GRAINS"
          ? "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80"
          : "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80",
    };
    useStockStore.getState().addProduct(fullProd);
    Alert.alert("Success", `${fullProd.name} added to your farm stock & published to buyers!`);
  };

  // Quick order status progression for demonstration
  const advanceOrderStatus = (orderId: string) => {
    setFarmerOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const nextStatus = ord.status === "PREPARING" ? "READY" : "COMPLETED";
          Alert.alert("Status Updated", `Order #${ord.id} marked as ${nextStatus}!`);
          return { ...ord, status: nextStatus };
        }
        return ord;
      })
    );
  };

  // --------------------------------------------------------------------------
  // TOP APP BAR (GoParm Brand Header)
  // --------------------------------------------------------------------------
  const renderHeader = () => (
    <View style={styles.topBar}>
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoLeaf}>🌱</Text>
        </View>
        <Text style={styles.brandName}>FarmConnect</Text>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconButton} onPress={() => Alert.alert("Notifications", "You have 2 new harvest updates.")}>
          <Bell size={20} color={Colors.text} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsProfileOpen(true)}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarInitial}>{user?.name?.[0] || "U"}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  // --------------------------------------------------------------------------
  // FARMER SCREENS
  // --------------------------------------------------------------------------
  const renderFarmerHome = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Farm Hero Card */}
      <View style={styles.section}>
        <FarmHeroCard
          farmName="Joseph's Agro Farm"
          location="Bantwal, Dakshina Kannada"
          cropCount={products.length}
          temperature="29°C"
          weather="Sunny"
          onPress={() => setSelectedFarmerProfile(MOCK_FARMERS[0])}
        />
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.quickActionRow}>
        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={() => setCurrentTab("stock")}
        >
          <Layers size={18} color={Colors.primary} />
          <Text style={styles.quickActionText}>Manage Stock</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={() => setCurrentTab("orders")}
        >
          <Package size={18} color={Colors.primary} />
          <Text style={styles.quickActionText}>View Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={() => setIsAddProductOpen(true)}
        >
          <Plus size={18} color={Colors.primary} />
          <Text style={styles.quickActionText}>Add Crop</Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Harvest Section (GoParm Reference Screen 2) */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>🌱 Upcoming Harvest</Text>
          <Text style={styles.sectionSubtitle}>Estimated Ready Dates</Text>
        </View>

        <View style={{ gap: Spacing.sm }}>
          <UpcomingHarvestCard
            cropName="Red Onion (Cured)"
            harvestCountdown="Ready in 4 days (Nov 24)"
            targetQuantity="600 Kg"
            imageUrl="https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80"
          />
          <UpcomingHarvestCard
            cropName="Sweet Golden Corn"
            harvestCountdown="Ready in 8 days (Nov 28)"
            targetQuantity="800 Stalks"
            imageUrl="https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80"
          />
        </View>
      </View>

      {/* Recent Orders Alert */}
      <View style={[styles.section, { marginBottom: Spacing.xxxl }]}>
        <Text style={styles.sectionTitle}>📦 Active Orders to Fulfill</Text>
        {farmerOrders.slice(0, 1).map((ord) => (
          <TouchableOpacity
            key={ord.id}
            style={styles.orderAlertCard}
            onPress={() => setCurrentTab("orders")}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.orderAlertHeader}>
                <Text style={styles.orderAlertTitle}>Order #{ord.id}</Text>
                <Text style={styles.orderBadge}>{ord.status}</Text>
              </View>
              <Text style={styles.orderSubtext}>Buyer: {ord.buyerName} · ₹{ord.totalAmount}</Text>
              <Text style={styles.orderItemsPreview}>
                {ord.items.map((i) => `${i.quantity} ${i.productUnit} ${i.productName}`).join(", ")}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderFarmerStock = () => (
    <View style={{ flex: 1 }}>
      {/* GoParm Screen 3: Stock Segment Switcher */}
      <View style={styles.stockHeader}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: Spacing.sm }}>
          <View>
            <Text style={styles.stockHeaderTitle}>Inventory & Stock</Text>
            <Text style={styles.stockHeaderSubtitle}>Real-time agricultural supply control</Text>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: Colors.primary,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: BorderRadius.pill,
            }}
            onPress={() => setIsAddProductOpen(true)}
          >
            <Plus size={14} color="#FFFFFF" />
            <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "bold" }}>Add Crop</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.switcherTab, stockTab === "crops" && styles.switcherTabActive]}
            onPress={() => setStockTab("crops")}
          >
            <Text style={[styles.switcherText, stockTab === "crops" && styles.switcherTextActive]}>
              Harvested Crops ({products.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.switcherTab, stockTab === "warehouse" && styles.switcherTabActive]}
            onPress={() => setStockTab("warehouse")}
          >
            <Text style={[styles.switcherText, stockTab === "warehouse" && styles.switcherTextActive]}>
              Warehouse Storage
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stock Items List with Stepper */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {products.map((prod) => (
          <StockRowItem
            key={prod.id}
            product={prod}
            onIncrement={() => updateStock(prod.id, prod.quantity + 10)}
            onDecrement={() => updateStock(prod.id, prod.quantity - 10)}
          />
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );

  const renderFarmerOrders = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Incoming Farm Orders</Text>
      <Text style={styles.pageSubtitle}>Accept, prepare and dispatch buyer orders</Text>

      <View style={{ gap: Spacing.md, marginTop: Spacing.md }}>
        {farmerOrders.map((ord) => (
          <View key={ord.id} style={styles.orderCard}>
            <View style={styles.orderHeaderRow}>
              <View>
                <Text style={styles.orderCardTitle}>Order #{ord.id}</Text>
                <Text style={styles.orderDate}>{ord.preferredDate} · {ord.fulfillmentMethod}</Text>
              </View>
              <View style={[styles.statusTag, ord.status === "COMPLETED" ? styles.statusSuccess : styles.statusPending]}>
                <Text style={styles.statusText}>{ord.status}</Text>
              </View>
            </View>

            <View style={styles.orderDivider} />

            <Text style={styles.orderBuyerText}>Buyer: {ord.buyerName}</Text>
            {ord.notes && <Text style={styles.orderNotes}>&ldquo;{ord.notes}&rdquo;</Text>}

            <View style={{ marginVertical: Spacing.sm }}>
              {ord.items.map((item) => (
                <View key={item.id} style={styles.orderItemRow}>
                  <Text style={styles.orderItemName}>{item.quantity} {item.productUnit} × {item.productName}</Text>
                  <Text style={styles.orderItemPrice}>₹{item.subtotal}</Text>
                </View>
              ))}
            </View>

            <View style={styles.orderDivider} />

            <View style={styles.orderFooterRow}>
              <Text style={styles.totalLabel}>Total Amount: <Text style={styles.totalValue}>₹{ord.totalAmount}</Text></Text>

              {ord.status !== "COMPLETED" && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => advanceOrderStatus(ord.id)}
                >
                  <Text style={styles.actionButtonText}>
                    {ord.status === "PREPARING" ? "Mark Ready" : "Complete"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  // --------------------------------------------------------------------------
  // BUYER SCREENS
  // --------------------------------------------------------------------------
  const renderBuyerHome = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Location Banner */}
      <View style={styles.locationBanner}>
        <MapPin size={16} color={Colors.primary} />
        <Text style={styles.locationBannerText}>Delivering to: <Text style={{ fontWeight: "bold" }}>Panaji, Goa</Text></Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Search size={18} color={Colors.textSecondary} />
        <TextInput
          placeholder="Search fresh tomatoes, onions, leafy greens..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.textLight}
        />
      </View>

      {/* Categories Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {[
          { id: "all", label: "🌱 All Produce" },
          { id: "vegetables", label: "🥕 Vegetables" },
          { id: "leafy_greens", label: "🥬 Leafy Greens" },
          { id: "fruits", label: "🍎 Plantation Fruits" },
        ].map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setSelectedCategory(cat.id)}
            style={[styles.categoryChip, selectedCategory === cat.id && styles.categoryChipActive]}
          >
            <Text style={[styles.categoryChipText, selectedCategory === cat.id && styles.categoryChipTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Fresh Today Produce Carousel */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>✨ Fresh Picked Today</Text>
          <Text style={styles.sectionSubtitle}>Directly From Farm Gate</Text>
        </View>

        <View style={styles.productGrid}>
          {products
            .filter((p) => selectedCategory === "all" || p.category === selectedCategory)
            .map((prod) => (
              <TouchableOpacity
                key={prod.id}
                style={styles.productCard}
                activeOpacity={0.85}
                onPress={() => setSelectedDetailProduct(prod)}
              >
                <Image source={{ uri: prod.image }} style={styles.productImage} />
                <View style={styles.productBody}>
                  <Text style={styles.cropBadge}>{prod.harvestDate}</Text>
                  <Text style={styles.productCardTitle} numberOfLines={1}>{prod.name}</Text>
                  <Text style={styles.productFarmText}>{prod.farmName}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>₹{prod.price} <Text style={styles.priceUnit}>/ {prod.unit}</Text></Text>
                    <TouchableOpacity
                      style={styles.addCartBtn}
                      onPress={() => {
                        addToCart(prod, 1);
                        Alert.alert("Added to Cart", `${prod.name} added to your basket!`);
                      }}
                    >
                      <Plus size={16} color={Colors.textInverse} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </View>

      {/* Nearby Verified Farms */}
      <View style={[styles.section, { marginBottom: Spacing.xxxl }]}>
        <Text style={styles.sectionTitle}>🏡 Nearby Verified Farms</Text>
        {MOCK_FARMERS.map((farmer) => (
          <TouchableOpacity
            key={farmer.id}
            style={styles.farmerCard}
            activeOpacity={0.85}
            onPress={() => setSelectedFarmerProfile(farmer)}
          >
            <Image source={{ uri: farmer.coverImage }} style={styles.farmerCover} />
            <View style={styles.farmerBody}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.farmerName}>{farmer.farmName}</Text>
                <CheckCircle size={14} color={Colors.primary} style={{ marginLeft: 4 }} />
              </View>
              <Text style={styles.farmerDesc} numberOfLines={2}>{farmer.description}</Text>
              <Text style={styles.farmerLocation}>{farmer.address} · ★ {farmer.rating} ({farmer.reviewCount} reviews)</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderBuyerCart = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Your Harvest Basket</Text>
      <Text style={styles.pageSubtitle}>Direct procurement from local farmers</Text>

      {cartItems.length === 0 ? (
        <View style={styles.emptyCartBox}>
          <Text style={{ fontSize: 40, marginBottom: 8 }}>🧺</Text>
          <Text style={styles.emptyCartTitle}>Your basket is empty</Text>
          <Text style={styles.emptyCartDesc}>Browse fresh local produce and add directly from farmers.</Text>
        </View>
      ) : (
        <View style={{ gap: Spacing.md, marginTop: Spacing.md }}>
          {cartItems.map((item) => (
            <View key={item.product.id} style={styles.cartItemRow}>
              <Image source={{ uri: item.product.image }} style={styles.cartItemImg} />
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <Text style={styles.cartItemName}>{item.product.name}</Text>
                <Text style={styles.cartItemFarm}>{item.product.farmName}</Text>
                <Text style={styles.cartItemPrice}>₹{item.product.price} / {item.product.unit}</Text>
              </View>
              <View style={styles.qtyControl}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateCartQty(item.product.id, item.quantity - 1)}
                >
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateCartQty(item.product.id, item.quantity + 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Checkout Breakdown */}
          <View style={styles.checkoutCard}>
            <View style={styles.checkoutRow}>
              <Text style={styles.checkoutLabel}>Total Produce Cost:</Text>
              <Text style={styles.checkoutValue}>₹{getTotalAmount()}</Text>
            </View>
            <View style={styles.checkoutRow}>
              <Text style={styles.checkoutLabel}>Fulfillment Method:</Text>
              <Text style={styles.checkoutValue}>Direct Farm Pickup</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() =>
                Alert.alert(
                  "Order Request Sent",
                  "Your request has been dispatched directly to the farmer for acceptance."
                )
              }
            >
              <Text style={styles.checkoutButtonText}>Submit Order Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  // --------------------------------------------------------------------------
  // BULK BUYER SCREENS
  // --------------------------------------------------------------------------
  const renderBulkHome = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Bulk Procurement Desk</Text>
      <Text style={styles.pageSubtitle}>For Restaurants, Hotels, Hostels & Institutions</Text>

      {/* Active Requirements */}
      <View style={{ gap: Spacing.md, marginTop: Spacing.md }}>
        {MOCK_BULK_REQUIREMENTS.map((req) => (
          <View key={req.id} style={styles.bulkReqCard}>
            <View style={styles.bulkReqHeader}>
              <View>
                <Text style={styles.bulkReqTitle}>{req.productName}</Text>
                <Text style={styles.bulkReqSub}>Required: {req.quantity} {req.unit} · Max ₹{req.maxPrice}/{req.unit}</Text>
              </View>
              <View style={styles.matchScoreBadge}>
                <Text style={styles.matchScoreText}>{req.matchScore}% Match</Text>
              </View>
            </View>

            <Text style={styles.bulkReqDate}>Target Fulfillment: {req.requiredDate}</Text>
            <View style={styles.orderDivider} />
            <Text style={styles.matchedFarmersText}>Matched with 3 local farms in Dakshina Kannada</Text>
          </View>
        ))}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  // --------------------------------------------------------------------------
  // BOTTOM TAB NAVIGATION (GoParm Reference Style)
  // --------------------------------------------------------------------------
  const renderBottomNav = () => {
    let tabs: { id: string; label: string; icon: any }[] = [];

    if (role === "FARMER") {
      tabs = [
        { id: "home", label: "Home", icon: Home },
        { id: "stock", label: "Stock", icon: Layers },
        { id: "orders", label: "Orders", icon: Package },
      ];
    } else if (role === "BUYER") {
      tabs = [
        { id: "home", label: "Market", icon: Home },
        { id: "cart", label: "Basket", icon: ShoppingCart },
        { id: "orders", label: "Orders", icon: ShoppingBag },
      ];
    } else {
      tabs = [
        { id: "home", label: "Overview", icon: Home },
        { id: "requirements", label: "Requirements", icon: Boxes },
        { id: "orders", label: "Shipments", icon: FileText },
      ];
    }

    return (
      <View style={styles.bottomNavContainer}>
        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setCurrentTab(tab.id)}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                activeOpacity={0.8}
              >
                <Icon
                  size={20}
                  color={isActive ? Colors.primary : Colors.textSecondary}
                />
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={["top", "bottom"]}>
      {renderHeader()}
      <RoleSwitcherBar />

      <View style={{ flex: 1 }}>
        {role === "FARMER" && (
          <>
            {currentTab === "home" && renderFarmerHome()}
            {currentTab === "stock" && renderFarmerStock()}
            {currentTab === "orders" && renderFarmerOrders()}
          </>
        )}

        {role === "BUYER" && (
          <>
            {currentTab === "home" && renderBuyerHome()}
            {currentTab === "cart" && renderBuyerCart()}
            {currentTab === "orders" && renderFarmerOrders()}
          </>
        )}

        {role === "BULK_BUYER" && (
          <>
            {currentTab === "home" && renderBulkHome()}
            {currentTab === "requirements" && renderBulkHome()}
            {currentTab === "orders" && renderFarmerOrders()}
          </>
        )}
      </View>

      {renderBottomNav()}

      {/* Interactive Flow Modals */}
      <AddProductModal
        visible={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddProduct}
      />

      <ProductDetailModal
        product={selectedDetailProduct}
        visible={!!selectedDetailProduct}
        onClose={() => setSelectedDetailProduct(null)}
        onAddToCart={(prod, qty) => addToCart(prod, qty)}
      />

      <FarmerProfileModal
        farmer={selectedFarmerProfile}
        products={products.filter((p) => p.farmerId === selectedFarmerProfile?.id || true)}
        visible={!!selectedFarmerProfile}
        onClose={() => setSelectedFarmerProfile(null)}
        onSelectProduct={(prod) => {
          setSelectedFarmerProfile(null);
          setSelectedDetailProduct(prod);
        }}
      />

      <AuthModal
        visible={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <ProfileModal
        visible={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />
    </SafeAreaView>
  );
}

// ----------------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------------
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.lightGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  logoLeaf: {
    fontSize: 18,
  },
  brandName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: "bold",
    color: Colors.darkGreen,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    position: "absolute",
    top: 8,
    right: 8,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.pill,
  },
  avatarFallback: {
    backgroundColor: Colors.lightGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontWeight: "bold",
    color: Colors.darkGreen,
    fontSize: 16,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionHeaderRow: {
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: "bold",
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  quickActionRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
    ...Shadows.card,
  },
  quickActionText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "bold",
    color: Colors.darkGreen,
  },
  orderAlertCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
    ...Shadows.card,
  },
  orderAlertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderAlertTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: "bold",
    color: Colors.text,
  },
  orderBadge: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.primary,
    backgroundColor: Colors.lightGreen,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.pill,
  },
  orderSubtext: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  orderItemsPreview: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "600",
    color: Colors.darkGreen,
    marginTop: 6,
  },
  stockHeader: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  stockHeaderTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: "bold",
    color: Colors.text,
  },
  stockHeaderSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tabSwitcher: {
    flexDirection: "row",
    marginTop: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.pill,
    padding: 4,
  },
  switcherTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: BorderRadius.pill,
  },
  switcherTabActive: {
    backgroundColor: Colors.primary,
  },
  switcherText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  switcherTextActive: {
    color: Colors.textInverse,
    fontWeight: "bold",
  },
  pageTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: "bold",
    color: Colors.text,
  },
  pageSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  orderHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  orderCardTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: "bold",
    color: Colors.text,
  },
  orderDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusTag: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.pill,
  },
  statusPending: {
    backgroundColor: Colors.harvestAlertBg,
  },
  statusSuccess: {
    backgroundColor: Colors.lightGreen,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.darkGreen,
  },
  orderDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  orderBuyerText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "600",
    color: Colors.text,
  },
  orderNotes: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontStyle: "italic",
    marginTop: 2,
  },
  orderItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  orderItemName: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text,
  },
  orderItemPrice: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "bold",
    color: Colors.darkGreen,
  },
  orderFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: Typography.fontSize.md,
    fontWeight: "bold",
    color: Colors.darkGreen,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.pill,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "bold",
    color: Colors.textInverse,
  },
  locationBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightGreen,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    gap: 6,
  },
  locationBannerText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.darkGreen,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    height: 44,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
  },
  categoryScroll: {
    flexDirection: "row",
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  categoryChipTextActive: {
    color: Colors.textInverse,
    fontWeight: "bold",
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  productCard: {
    width: "48%",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  productImage: {
    width: "100%",
    height: 110,
  },
  productBody: {
    padding: Spacing.sm,
  },
  cropBadge: {
    fontSize: 9,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 2,
  },
  productCardTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "bold",
    color: Colors.text,
  },
  productFarmText: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginVertical: 2,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  productPrice: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "bold",
    color: Colors.darkGreen,
  },
  priceUnit: {
    fontSize: 10,
    fontWeight: "normal",
    color: Colors.textSecondary,
  },
  addCartBtn: {
    width: 26,
    height: 26,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  farmerCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
    ...Shadows.card,
  },
  farmerCover: {
    width: "100%",
    height: 100,
  },
  farmerBody: {
    padding: Spacing.md,
  },
  farmerName: {
    fontSize: Typography.fontSize.md,
    fontWeight: "bold",
    color: Colors.text,
  },
  farmerDesc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginVertical: 4,
  },
  farmerLocation: {
    fontSize: 10,
    color: Colors.darkGreen,
    fontWeight: "600",
  },
  emptyCartBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyCartTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: "bold",
    color: Colors.text,
  },
  emptyCartDesc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
  cartItemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  cartItemImg: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
  },
  cartItemName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "bold",
    color: Colors.text,
  },
  cartItemFarm: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  cartItemPrice: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "bold",
    color: Colors.darkGreen,
    marginTop: 2,
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.text,
  },
  qtyValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "bold",
  },
  checkoutCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.md,
    ...Shadows.card,
  },
  checkoutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  checkoutLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  checkoutValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "bold",
    color: Colors.text,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.pill,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  checkoutButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "bold",
    color: Colors.textInverse,
  },
  bulkReqCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  bulkReqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  bulkReqTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: "bold",
    color: Colors.text,
  },
  bulkReqSub: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  matchScoreBadge: {
    backgroundColor: Colors.lightGreen,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.pill,
  },
  matchScoreText: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.darkGreen,
  },
  bulkReqDate: {
    fontSize: 10,
    color: Colors.harvestAlert,
    fontWeight: "600",
    marginTop: 6,
  },
  matchedFarmersText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.darkGreen,
    fontWeight: "600",
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 12,
    left: 20,
    right: 20,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.pill,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.floating,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
  },
  tabButtonActive: {
    backgroundColor: Colors.lightGreen,
  },
  tabLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: "600",
  },
  tabLabelActive: {
    color: Colors.darkGreen,
    fontWeight: "bold",
  },
});
