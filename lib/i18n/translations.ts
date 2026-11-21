export type Language = "en" | "kn" | "hi";

export interface Translations {
  // Navigation & Branding
  brandTagline: string;
  home: string;
  explore: string;
  farmers: string;
  howItWorks: string;
  about: string;
  cart: string;
  orders: string;
  profile: string;
  stock: string;
  login: string;
  register: string;
  logout: string;
  dashboard: string;
  sellOnFarmConnect: string;

  // Search & Filters
  searchPlaceholder: string;
  searchFarmsPlaceholder: string;
  categories: string;
  allCategories: string;
  vegetables: string;
  fruits: string;
  grains: string;
  pulses: string;
  dairy: string;
  herbs: string;
  sortNearest: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortNewest: string;
  clearFilters: string;
  filterByRadius: string;

  // Local Farmers & Map
  localFarmers: string;
  verifiedFarmersSubtitle: string;
  nearbyFarmers: string;
  viewAll: string;
  viewProfile: string;
  visitFarm: string;
  listView: string;
  mapView: string;
  locateMe: string;
  radiusKm: string;
  farmsFound: string;
  verifiedBadge: string;
  farmingPractices: string;
  freshToday: string;
  popularCategories: string;

  // Product & Ordering
  addToCart: string;
  addedToCart: string;
  pricePerUnit: string;
  inStock: string;
  limitedStock: string;
  outOfStock: string;
  harvestDate: string;
  directFromFarm: string;
  checkout: string;
  orderTotal: string;
  pickup: string;
  localDelivery: string;
  placeOrder: string;

  // Order Statuses
  statusRequested: string;
  statusAccepted: string;
  statusPreparing: string;
  statusReady: string;
  statusCompleted: string;

  // Roles
  roleFarmer: string;
  roleBuyer: string;
  roleBulkBuyer: string;
  roleAdmin: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brandTagline: "Know your farmer. Know your food.",
    home: "Home",
    explore: "Explore",
    farmers: "Farmers",
    howItWorks: "How It Works",
    about: "About",
    cart: "Cart",
    orders: "Orders",
    profile: "Profile",
    stock: "Stock",
    login: "Log in",
    register: "Register",
    logout: "Log out",
    dashboard: "Dashboard",
    sellOnFarmConnect: "Sell on FarmConnect",

    searchPlaceholder: "Search fresh vegetables, fruits, grains...",
    searchFarmsPlaceholder: "Search farms or farmers by name or place...",
    categories: "Categories",
    allCategories: "All Categories",
    vegetables: "Vegetables",
    fruits: "Fruits",
    grains: "Grains",
    pulses: "Pulses",
    dairy: "Dairy",
    herbs: "Herbs",
    sortNearest: "Nearest",
    sortPriceAsc: "Price: Low to High",
    sortPriceDesc: "Price: High to Low",
    sortNewest: "Recently Harvested",
    clearFilters: "Clear Filters",
    filterByRadius: "Distance Radius",

    localFarmers: "Local Farmers",
    verifiedFarmersSubtitle: "Verified local farmers growing with care in your community",
    nearbyFarmers: "Nearby Farmers",
    viewAll: "View All",
    viewProfile: "View Profile",
    visitFarm: "Visit Farm",
    listView: "List View",
    mapView: "Map View",
    locateMe: "My Location",
    radiusKm: "Radius",
    farmsFound: "farmers located in your area",
    verifiedBadge: "Verified Farm",
    farmingPractices: "Farming Practices",
    freshToday: "Fresh Today",
    popularCategories: "Popular Categories",

    addToCart: "Add to Cart",
    addedToCart: "Added",
    pricePerUnit: "per",
    inStock: "In Stock",
    limitedStock: "Limited Stock",
    outOfStock: "Sold Out",
    harvestDate: "Harvested",
    directFromFarm: "Direct from farm",
    checkout: "Checkout",
    orderTotal: "Total Amount",
    pickup: "Direct Farm Pickup",
    localDelivery: "Local Delivery",
    placeOrder: "Place Order",

    statusRequested: "Order Requested",
    statusAccepted: "Accepted by Farmer",
    statusPreparing: "Harvesting & Packing",
    statusReady: "Ready for Pickup",
    statusCompleted: "Order Completed",

    roleFarmer: "Farmer",
    roleBuyer: "Retail Consumer",
    roleBulkBuyer: "Bulk Procurer",
    roleAdmin: "Administrator",
  },

  kn: {
    brandTagline: "ನಿಮ್ಮ ರೈತರನ್ನು ತಿಳಿಯಿರಿ. ನಿಮ್ಮ ಆಹಾರವನ್ನು ತಿಳಿಯಿರಿ.",
    home: "ಮುಖಪುಟ",
    explore: "ಅನ್ವೇಷಿಸಿ",
    farmers: "ರೈತರು",
    howItWorks: "ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
    about: "ನಮ್ಮ ಬಗ್ಗೆ",
    cart: "ಕಾರ್ಟ್",
    orders: "ಆದೇಶಗಳು",
    profile: "ಪ್ರೊಫೈಲ್",
    stock: "ದಾಸ್ತಾನು",
    login: "ಲಾಗಿನ್",
    register: "ನೋಂದಣಿ",
    logout: "ಲಾಗ್ ಔಟ್",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    sellOnFarmConnect: "ಫಾರ್ಮ್‌ಕನೆಕ್ಟ್‌ನಲ್ಲಿ ಮಾರಾಟ ಮಾಡಿ",

    searchPlaceholder: "ತಾಜಾ ತರಕಾರಿಗಳು, ಹಣ್ಣುಗಳು, ಧಾನ್ಯಗಳನ್ನು ಹುಡುಕಿ...",
    searchFarmsPlaceholder: "ರೈತರು ಅಥವಾ ಫಾರ್ಮ್ ಹೆಸರನ್ನು ಹುಡುಕಿ...",
    categories: "ವರ್ಗಗಳು",
    allCategories: "ಎಲ್ಲಾ ವರ್ಗಗಳು",
    vegetables: "ತರಕಾರಿಗಳು",
    fruits: "ಹಣ್ಣುಗಳು",
    grains: "ಧಾನ್ಯಗಳು",
    pulses: "ಕಾಳುಗಳು",
    dairy: "ಡೈರಿ",
    herbs: "ಮೂಲಿಕೆಗಳು",
    sortNearest: "ಅತ್ಯಂತ ಹತ್ತಿರ",
    sortPriceAsc: "ಕಡಿಮೆ ಬೆಲೆ ಮೊದಲು",
    sortPriceDesc: "ಹೆಚ್ಚು ಬೆಲೆ ಮೊದಲು",
    sortNewest: "ಇತ್ತೀಚಿನ ಫಸಲು",
    clearFilters: "ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ",
    filterByRadius: "ದೂರದ ವ್ಯಾಪ್ತಿ",

    localFarmers: "ಸ್ಥಳೀಯ ರೈತರು",
    verifiedFarmersSubtitle: "ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ನೈಸರ್ಗಿಕವಾಗಿ ಬೆಳೆಯುವ ದೃಢೀಕೃತ ರೈತರು",
    nearbyFarmers: "ಹತ್ತಿರದ ರೈತರು",
    viewAll: "ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ",
    viewProfile: "ಪ್ರೊಫೈಲ್ ವೀಕ್ಷಿಸಿ",
    visitFarm: "ಫಾರ್ಮ್ ವೀಕ್ಷಿಸಿ",
    listView: "ಪಟ್ಟಿ ನೋಟ",
    mapView: "ನಕ್ಷೆ ನೋಟ",
    locateMe: "ನನ್ನ ಸ್ಥಳ",
    radiusKm: "ವ್ಯಾಪ್ತಿ",
    farmsFound: "ಸ್ಥಳೀಯ ರೈತರು ಲಭ್ಯವಿದ್ದಾರೆ",
    verifiedBadge: "ದೃಢೀಕೃತ ಫಾರ್ಮ್",
    farmingPractices: "ಕೃಷಿ ವಿಧಾನಗಳು",
    freshToday: "ಇಂದಿನ ತಾಜಾ ಫಸಲು",
    popularCategories: "ಜನಪ್ರಿಯ ವರ್ಗಗಳು",

    addToCart: "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
    addedToCart: "ಸೇರಿಸಲಾಗಿದೆ",
    pricePerUnit: "ಪ್ರತಿ",
    inStock: "ದಾಸ್ತಾನು ಇದೆ",
    limitedStock: "ಸೀಮಿತ ದಾಸ್ತಾನು",
    outOfStock: "ಮುಗಿದಿದೆ",
    harvestDate: "ಕೊಯ್ಲು ದಿನಾಂಕ",
    directFromFarm: "ನೇರವಾಗಿ ಹೊಲದಿಂದ",
    checkout: "ಚೆಕ್‌ಔಟ್",
    orderTotal: "ಒಟ್ಟು ಮೊತ್ತ",
    pickup: "ನೇರ ಹೊಲದ ಪಿಕಪ್",
    localDelivery: "ಸ್ಥಳೀಯ ವಿತರಣೆ",
    placeOrder: "ಆದೇಶ ನೀಡಿ",

    statusRequested: "ಆದೇಶ ಕೋರಲಾಗಿದೆ",
    statusAccepted: "ರೈತರಿಂದ ಸ್ವೀಕರಿಸಲಾಗಿದೆ",
    statusPreparing: "ಕೊಯ್ಲು ಮತ್ತು ಪ್ಯಾಕಿಂಗ್",
    statusReady: "ಪಿಕಪ್‌ಗೆ ಸಿದ್ಧವಾಗಿದೆ",
    statusCompleted: "ಆದೇಶ ಪೂರ್ಣಗೊಂಡಿದೆ",

    roleFarmer: "ರೈತ",
    roleBuyer: "ಗ್ರಾಹಕ",
    roleBulkBuyer: "ಸಗಟು ಖರೀದಿದಾರ",
    roleAdmin: "ನಿರ್ವಾಹಕ",
  },

  hi: {
    brandTagline: "अपने किसान को जानें। अपने भोजन को पहचानें।",
    home: "होम",
    explore: "उत्पाद खोजें",
    farmers: "किसान",
    howItWorks: "यह कैसे काम करता है",
    about: "हमारे बारे में",
    cart: "कार्ट",
    orders: "ऑर्डर",
    profile: "प्रोफ़ाइल",
    stock: "स्टॉक",
    login: "लॉग इन",
    register: "रजिस्टर",
    logout: "लॉग आउट",
    dashboard: "डैशबोर्ड",
    sellOnFarmConnect: "फार्मकनेक्ट पर बेचें",

    searchPlaceholder: "ताजा सब्जियां, फल, अनाज खोजें...",
    searchFarmsPlaceholder: "किसान या खेत का नाम खोजें...",
    categories: "श्रेणियां",
    allCategories: "सभी श्रेणियां",
    vegetables: "सब्जियां",
    fruits: "फल",
    grains: "अनाज",
    pulses: "दालें",
    dairy: "डेयरी",
    herbs: "जड़ी-बूटियां",
    sortNearest: "निकटतम",
    sortPriceAsc: "कम कीमत पहले",
    sortPriceDesc: "अधिक कीमत पहले",
    sortNewest: "ताजा कटी फसल",
    clearFilters: "फ़िल्टर हटाएं",
    filterByRadius: "दूरी दायरा",

    localFarmers: "स्थानीय किसान",
    verifiedFarmersSubtitle: "आपके क्षेत्र में जिम्मेदारी से खेती करने वाले सत्यापित किसान",
    nearbyFarmers: "निकटवर्ती किसान",
    viewAll: "सभी देखें",
    viewProfile: "प्रोफ़ाइल देखें",
    visitFarm: "खेत देखें",
    listView: "सूची दृश्य",
    mapView: "नक्शा दृश्य",
    locateMe: "मेरा स्थान",
    radiusKm: "दायरा",
    farmsFound: "किसान आपके क्षेत्र में उपलब्ध हैं",
    verifiedBadge: "सत्यापित खेत",
    farmingPractices: "खेती के तरीके",
    freshToday: "आज का ताज़ा",
    popularCategories: "लोकप्रिय श्रेणियां",

    addToCart: "कार्ट में जोड़ें",
    addedToCart: "जोड़ा गया",
    pricePerUnit: "प्रति",
    inStock: "उपलब्ध",
    limitedStock: "सीमित स्टॉक",
    outOfStock: "स्टॉक समाप्त",
    harvestDate: "फसल कटाई",
    directFromFarm: "सीधे खेत से",
    checkout: "चेकआउट",
    orderTotal: "कुल राशि",
    pickup: "सीधे खेत से पिकअप",
    localDelivery: "स्थानीय डिलीवरी",
    placeOrder: "ऑर्डर दें",

    statusRequested: "ऑर्डर का अनुरोध किया",
    statusAccepted: "किसान द्वारा स्वीकृत",
    statusPreparing: "कटाई और पैकिंग",
    statusReady: "पिकअप के लिए तैयार",
    statusCompleted: "ऑर्डर पूरा हुआ",

    roleFarmer: "किसान",
    roleBuyer: "उपभोक्ता",
    roleBulkBuyer: "थोक खरीदार",
    roleAdmin: "प्रशासक",
  },
};
