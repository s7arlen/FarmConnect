// DEMO DATA — These are fictional farmers for demonstration purposes only.
// Not representative of real registered businesses.

import type { Farmer } from "@/types/farmer";
import type { Product } from "@/types/product";
import type { Order } from "@/types/order";
import type { Review } from "@/types/review";

export const DEMO_FARMERS: Farmer[] = [
  {
    id: "demo-farmer-1",
    userId: "demo-user-1",
    farmName: "Joseph's Farm",
    description:
      "A family-run farm spanning 12 acres in the foothills of Bantwal, specializing in fresh vegetables and tropical fruits using traditional farming methods.",
    address: "Bantwal, Dakshina Kannada, Karnataka",
    latitude: 12.8921,
    longitude: 75.0028,
    verified: true,
    rating: 4.8,
    reviewCount: 47,
    verificationStatus: "VERIFIED",
    coverImage:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
    profileImage:
      "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=400&q=80",
    farmingPractices:
      "We use organic-friendly techniques, minimal pesticides, and traditional composting. Our water comes from natural springs.",
    establishedYear: 2008,
    ownerName: "Joseph D'Souza",
    ownerEmail: "joseph@demo.farmconnect.in",
    ownerPhone: "+91 94482 00001",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-06-01"),
  },
  {
    id: "demo-farmer-2",
    userId: "demo-user-2",
    farmName: "Maria's Organic Farm",
    description:
      "Certified organic farm in Moodbidri growing rare leafy greens, heirloom vegetables, and fresh herbs. Over two decades of sustainable farming.",
    address: "Moodbidri, Dakshina Kannada, Karnataka",
    latitude: 13.0641,
    longitude: 74.9931,
    verified: true,
    rating: 4.9,
    reviewCount: 83,
    verificationStatus: "VERIFIED",
    coverImage:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80",
    profileImage:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80",
    farmingPractices:
      "Fully organic. Zero synthetic pesticides. Rainwater harvesting. Soil-first approach.",
    establishedYear: 2001,
    ownerName: "Maria Saldanha",
    ownerEmail: "maria@demo.farmconnect.in",
    ownerPhone: "+91 94482 00002",
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2024-07-15"),
  },
  {
    id: "demo-farmer-3",
    userId: "demo-user-3",
    farmName: "Antony's Agro Farm",
    description:
      "A modern mixed-crop farm in Puttur focusing on high-demand vegetables, rice varieties, and seasonal produce. Supplying local markets for over 15 years.",
    address: "Puttur, Dakshina Kannada, Karnataka",
    latitude: 12.7605,
    longitude: 75.2016,
    verified: true,
    rating: 4.6,
    reviewCount: 62,
    verificationStatus: "VERIFIED",
    coverImage:
      "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=1200&q=80",
    profileImage:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&q=80",
    farmingPractices:
      "Integrated pest management, drip irrigation, and seasonal crop rotation.",
    establishedYear: 2009,
    ownerName: "Antony Pais",
    ownerEmail: "antony@demo.farmconnect.in",
    ownerPhone: "+91 94482 00003",
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2024-08-01"),
  },
  {
    id: "demo-farmer-4",
    userId: "demo-user-4",
    farmName: "Lakshmi Farms",
    description:
      "Specializing in tropical fruits and spices from the fertile lands near Mangalore. Known for alphonso mangoes and banana varieties.",
    address: "Mangalore Rural, Dakshina Kannada, Karnataka",
    latitude: 12.9141,
    longitude: 74.856,
    verified: true,
    rating: 4.7,
    reviewCount: 39,
    verificationStatus: "VERIFIED",
    coverImage:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80",
    profileImage:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&q=80",
    farmingPractices:
      "Traditional Tulu Nadu farming methods. Natural fertilizers from own cattle.",
    establishedYear: 1995,
    ownerName: "Lakshmi Shetty",
    ownerEmail: "lakshmi@demo.farmconnect.in",
    ownerPhone: "+91 94482 00004",
    createdAt: new Date("2023-04-20"),
    updatedAt: new Date("2024-09-10"),
  },
];

export const DEMO_PRODUCTS: Product[] = [
  {
    id: "demo-product-1",
    farmerId: "demo-farmer-1",
    name: "Fresh Tomatoes",
    category: "vegetables",
    description:
      "Vine-ripened tomatoes harvested this morning. Deep red, firm, and full of flavour. Perfect for cooking or salads.",
    price: 35,
    quantity: 120,
    unit: "kg",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80",
    harvestDate: new Date(),
    status: "AVAILABLE",
    farmerName: "Joseph D'Souza",
    farmName: "Joseph's Farm",
    farmerVerified: true,
    distanceKm: 3.2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "demo-product-2",
    farmerId: "demo-farmer-1",
    name: "Red Onions",
    category: "vegetables",
    description:
      "Large, pungent red onions grown without artificial inputs. Excellent shelf life.",
    price: 28,
    quantity: 200,
    unit: "kg",
    image:
      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80",
    harvestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "AVAILABLE",
    farmerName: "Joseph D'Souza",
    farmName: "Joseph's Farm",
    farmerVerified: true,
    distanceKm: 3.2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "demo-product-3",
    farmerId: "demo-farmer-2",
    name: "Organic Spinach",
    category: "leafy",
    description:
      "Tender, organically grown spinach leaves. Harvested fresh each morning.",
    price: 45,
    quantity: 30,
    unit: "kg",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80",
    harvestDate: new Date(),
    status: "LIMITED",
    farmerName: "Maria Saldanha",
    farmName: "Maria's Organic Farm",
    farmerVerified: true,
    distanceKm: 8.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "demo-product-4",
    farmerId: "demo-farmer-2",
    name: "French Beans",
    category: "vegetables",
    description:
      "Fresh, slender French beans. Crisp texture and excellent flavour. Organically grown.",
    price: 60,
    quantity: 25,
    unit: "kg",
    image:
      "https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=600&q=80",
    harvestDate: new Date(),
    status: "AVAILABLE",
    farmerName: "Maria Saldanha",
    farmName: "Maria's Organic Farm",
    farmerVerified: true,
    distanceKm: 8.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "demo-product-5",
    farmerId: "demo-farmer-3",
    name: "Cucumber",
    category: "vegetables",
    description:
      "Long, crisp cucumbers ideal for salads and cooking. Low-pesticide cultivation.",
    price: 22,
    quantity: 80,
    unit: "kg",
    image:
      "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=600&q=80",
    harvestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: "AVAILABLE",
    farmerName: "Antony Pais",
    farmName: "Antony's Agro Farm",
    farmerVerified: true,
    distanceKm: 14.7,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "demo-product-6",
    farmerId: "demo-farmer-3",
    name: "Sona Masoori Rice",
    category: "grains",
    description:
      "Premium quality Sona Masoori rice. Light, aromatic, and perfect for everyday cooking.",
    price: 58,
    quantity: 500,
    unit: "kg",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
    harvestDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    status: "AVAILABLE",
    farmerName: "Antony Pais",
    farmName: "Antony's Agro Farm",
    farmerVerified: true,
    distanceKm: 14.7,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "demo-product-7",
    farmerId: "demo-farmer-4",
    name: "Alphonso Mangoes",
    category: "fruits",
    description:
      "The king of mangoes! Sweet, pulpy Alphonso mangoes from our 30-year-old trees.",
    price: 180,
    quantity: 60,
    unit: "kg",
    image:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=80",
    harvestDate: new Date(),
    status: "LIMITED",
    farmerName: "Lakshmi Shetty",
    farmName: "Lakshmi Farms",
    farmerVerified: true,
    distanceKm: 5.1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "demo-product-8",
    farmerId: "demo-farmer-4",
    name: "Nendran Bananas",
    category: "fruits",
    description:
      "Large, starchy Nendran bananas — great for cooking or eating ripe. Freshly harvested bunches.",
    price: 55,
    quantity: 90,
    unit: "dozen",
    image:
      "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&q=80",
    harvestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: "AVAILABLE",
    farmerName: "Lakshmi Shetty",
    farmName: "Lakshmi Farms",
    farmerVerified: true,
    distanceKm: 5.1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const DEMO_REVIEWS: Review[] = [
  {
    id: "review-1",
    buyerId: "buyer-1",
    farmerId: "demo-farmer-1",
    productId: "demo-product-1",
    orderId: "order-1",
    rating: 5,
    comment:
      "Freshest tomatoes I've ever bought. You can tell they were picked the same morning.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    buyerName: "Priya Menon",
    buyerAvatar: undefined,
  },
  {
    id: "review-2",
    buyerId: "buyer-2",
    farmerId: "demo-farmer-1",
    orderId: "order-2",
    rating: 5,
    comment:
      "Joseph is very responsive and the farm is well-maintained. Will order again.",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    buyerName: "Rahul Prabhu",
    buyerAvatar: undefined,
  },
  {
    id: "review-3",
    buyerId: "buyer-3",
    farmerId: "demo-farmer-2",
    productId: "demo-product-3",
    orderId: "order-3",
    rating: 5,
    comment:
      "Maria's organic spinach is exceptional. Genuinely different from supermarket greens.",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    buyerName: "Anita Rao",
    buyerAvatar: undefined,
  },
];

export const DEMO_ORDERS: Order[] = [
  {
    id: "demo-order-1",
    buyerId: "demo-buyer-1",
    farmerId: "demo-farmer-1",
    totalAmount: 350,
    fulfillmentMethod: "PICKUP",
    paymentMethod: "UPI",
    paymentStatus: "PENDING",
    paymentReference: "UPI982374615234",
    preferredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: "PREPARING",
    notes: "Please pack in a cardboard box.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    buyerName: "Demo Buyer",
    farmerName: "Joseph D'Souza",
    farmName: "Joseph's Farm",
    items: [
      {
        id: "item-1",
        orderId: "demo-order-1",
        productId: "demo-product-1",
        quantity: 10,
        unitPrice: 35,
        subtotal: 350,
        productName: "Fresh Tomatoes",
        productImage:
          "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=600&q=80",
      },
    ],
  },
  {
    id: "demo-order-2",
    buyerId: "demo-buyer-1",
    farmerId: "demo-farmer-2",
    totalAmount: 270,
    fulfillmentMethod: "PICKUP",
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    preferredDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: "REQUESTED",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(),
    buyerName: "Demo Buyer",
    farmerName: "Maria Saldanha",
    farmName: "Maria's Organic Farm",
    items: [
      {
        id: "item-2",
        orderId: "demo-order-2",
        productId: "demo-product-3",
        quantity: 6,
        unitPrice: 45,
        subtotal: 270,
        productName: "Organic Spinach",
        productImage:
          "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80",
      },
    ],
  },
];
