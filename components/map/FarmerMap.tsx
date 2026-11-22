"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { type Farmer } from "@/types/farmer";
import { DEMO_PRODUCTS } from "@/data/demo";
import { MapPin, Navigation, Compass, Layers, CheckCircle, Star, ArrowRight } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

interface FarmerMapProps {
  farmers: Farmer[];
  selectedFarmerId?: string | null;
  onSelectFarmer?: (farmerId: string) => void;
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
}

// Default regional center: Dakshina Kannada cluster (Mangalore / Bantwal)
const DEFAULT_CENTER: [number, number] = [12.92, 75.02];
const DEFAULT_ZOOM = 11;

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeImageUrl(url: string | undefined): string {
  if (!url || typeof url !== "string") {
    return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80";
  }
  const trimmed = url.trim();
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://") || trimmed.startsWith("/")) {
    return escapeHtml(trimmed);
  }
  return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80";
}

export default function FarmerMap({
  farmers,
  selectedFarmerId,
  onSelectFarmer,
  className = "",
  initialCenter = DEFAULT_CENTER,
  initialZoom = DEFAULT_ZOOM,
}: FarmerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const circleRef = useRef<L.Circle | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [activeRadius, setActiveRadius] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const { t } = useLanguageStore();

  // Create custom Farm Marker Icon
  const createFarmIcon = (farmer: Farmer, isSelected: boolean) => {
    return L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div style="
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: ${isSelected ? "#28552B" : "#4D8B38"};
            box-shadow: 0 4px 14px rgba(40,85,43,0.35);
            border: 2.5px solid #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform: ${isSelected ? "scale(1.2)" : "scale(1)"};
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
          </div>
          <div style="
            position: absolute;
            bottom: -4px;
            width: 8px;
            height: 8px;
            background: ${isSelected ? "#28552B" : "#4D8B38"};
            transform: rotate(45deg);
            border-right: 2px solid white;
            border-bottom: 2px solid white;
          "></div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 42],
      popupAnchor: [0, -40],
    });
  };

  // Create User Location Marker Icon
  const createUserIcon = () => {
    return L.divIcon({
      className: "custom-user-marker",
      html: `
        <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
          <div style="
            position: absolute;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: rgba(59, 130, 246, 0.25);
            animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #2563EB;
            border: 2.5px solid #ffffff;
            box-shadow: 0 2px 6px rgba(37,99,235,0.4);
          "></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: true,
    });

    // Clean OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Zoom controls at bottom right for easy mobile thumb reach
    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [initialCenter, initialZoom]);

  // Update Markers when farmers change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    farmers.forEach((farmer) => {
      if (!farmer.latitude || !farmer.longitude) return;

      const isSelected = farmer.id === selectedFarmerId;
      const marker = L.marker([farmer.latitude, farmer.longitude], {
        icon: createFarmIcon(farmer, isSelected),
        title: farmer.farmName,
      });

      // Find available products for this farm
      const farmProducts = DEMO_PRODUCTS.filter((p) => p.farmerId === farmer.id)
        .slice(0, 3)
        .map((p) => escapeHtml(p.name))
        .join(", ");

      const safeFarmName = escapeHtml(farmer.farmName);
      const safeAddress = escapeHtml(farmer.address);
      const safeFarmerId = encodeURIComponent(farmer.id);
      const safeImage = sanitizeImageUrl(farmer.coverImage || farmer.profileImage);

      const popupContent = document.createElement("div");
      popupContent.style.minWidth = "230px";
      popupContent.style.maxWidth = "280px";
      popupContent.style.fontFamily = "inherit";
      popupContent.innerHTML = `
        <div style="border-radius: 12px; overflow: hidden; padding: 2px;">
          <div style="position: relative; height: 90px; border-radius: 8px; overflow: hidden; margin-bottom: 8px; background: #E8F4D9;">
            <img src="${safeImage}" 
                 style="width: 100%; height: 100%; object-fit: cover;" 
                 alt="${safeFarmName}"/>
            <span style="position: absolute; top: 6px; right: 6px; background: rgba(255,255,255,0.92); backdrop-filter: blur(4px); font-size: 10px; font-weight: 700; color: #4D8B38; padding: 2px 7px; border-radius: 999px; display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 1px 4px rgba(0,0,0,0.1);">
              ✓ Verified Farm
            </span>
          </div>
          
          <h4 style="margin: 0 0 2px 0; font-size: 14px; font-weight: 700; color: #1c261c; line-height: 1.2;">
            ${safeFarmName}
          </h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b; display: flex; align-items: center; gap: 4px;">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            ${safeAddress}
          </p>

          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
            <span style="background: #FEF3C7; color: #D97706; font-size: 11px; font-weight: 700; padding: 1px 6px; border-radius: 5px; display: inline-flex; align-items: center; gap: 3px;">
              ★ ${farmer.rating}
            </span>
            <span style="font-size: 10px; color: #94a3b8;">(${farmer.reviewCount} reviews)</span>
          </div>

          ${
            farmProducts
              ? `<div style="font-size: 11px; color: #334155; margin-bottom: 10px; line-height: 1.3;">
                  <strong>Harvest:</strong> ${farmProducts}
                </div>`
              : ""
          }

          <a href="/buyer/farmers/${safeFarmerId}" 
             style="display: block; width: 100%; text-align: center; background: #4D8B38; color: white; padding: 7px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; text-decoration: none; box-shadow: 0 2px 6px rgba(77,139,56,0.3); transition: background 0.2s;">
            View Farm & Harvest →
          </a>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: "custom-farm-popup",
        maxWidth: 290,
      });

      marker.on("click", () => {
        if (onSelectFarmer) onSelectFarmer(farmer.id);
      });

      marker.addTo(map);
      markersRef.current[farmer.id] = marker;
    });

    // Auto-fit bounds if we have valid farmers
    const validCoords = farmers
      .filter((f) => f.latitude && f.longitude)
      .map((f) => [f.latitude!, f.longitude!] as [number, number]);

    if (validCoords.length > 0 && !selectedFarmerId) {
      const bounds = L.latLngBounds(validCoords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [farmers, selectedFarmerId, onSelectFarmer]);

  // Handle selected farmer focus
  useEffect(() => {
    if (!selectedFarmerId || !mapInstanceRef.current) return;
    const marker = markersRef.current[selectedFarmerId];
    if (marker) {
      const latLng = marker.getLatLng();
      mapInstanceRef.current.setView(latLng, 14, { animate: true });
      marker.openPopup();
    }
  }, [selectedFarmerId]);

  // Handle GPS Locate Me
  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) return;
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        const coords: [number, number] = [latitude, longitude];
        setUserLocation(coords);

        const map = mapInstanceRef.current;
        if (!map) return;

        // Place or update user marker
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng(coords);
        } else {
          userMarkerRef.current = L.marker(coords, {
            icon: createUserIcon(),
            title: "Your Location",
          }).addTo(map);
        }

        map.setView(coords, 12, { animate: true });

        // Apply 10km radius circle if none selected
        applyRadius(activeRadius || 15, coords);
      },
      (err) => {
        setIsLocating(false);
        // Fallback to regional center
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(DEFAULT_CENTER, 12, { animate: true });
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Handle Radius Filter Circle
  const applyRadius = (radiusKm: number | null, centerCoords?: [number, number]) => {
    setActiveRadius(radiusKm);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (circleRef.current) {
      circleRef.current.remove();
      circleRef.current = null;
    }

    if (!radiusKm) return;

    const center = centerCoords || userLocation || DEFAULT_CENTER;
    const radiusMeters = radiusKm * 1000;

    circleRef.current = L.circle(center, {
      radius: radiusMeters,
      color: "#4D8B38",
      weight: 1.5,
      opacity: 0.8,
      fillColor: "#4D8B38",
      fillOpacity: 0.08,
      dashArray: "4, 6",
    }).addTo(map);

    map.fitBounds(circleRef.current.getBounds(), { padding: [30, 30] });
  };

  const resetView = () => {
    if (!mapInstanceRef.current) return;
    setActiveRadius(null);
    if (circleRef.current) {
      circleRef.current.remove();
      circleRef.current = null;
    }
    const validCoords = farmers
      .filter((f) => f.latitude && f.longitude)
      .map((f) => [f.latitude!, f.longitude!] as [number, number]);
    if (validCoords.length > 0) {
      mapInstanceRef.current.fitBounds(L.latLngBounds(validCoords), { padding: [40, 40] });
    } else {
      mapInstanceRef.current.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    }
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-brand-border shadow-xs bg-zinc-100 ${className}`}>
      {/* Map Target Canvas */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px] lg:min-h-[600px] z-0" />

      {/* Floating Top Controls Toolbar */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto z-10 flex flex-wrap items-center gap-2 pointer-events-none">
        {/* GPS Locate Me Button */}
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-brand-border text-brand-dark hover:bg-brand-light text-xs font-bold shadow-md transition-all active:scale-95"
          title="Locate my position on map"
        >
          <Navigation className={`w-3.5 h-3.5 text-blue-600 ${isLocating ? "animate-spin" : ""}`} />
          <span>{isLocating ? "Locating..." : t("locateMe")}</span>
        </button>

        {/* Radius Selector Pills */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-xl bg-white/95 backdrop-blur-md border border-brand-border shadow-md">
          <span className="text-[10px] font-bold text-brand-muted uppercase px-2 tracking-wider flex items-center gap-1">
            <Compass className="w-3 h-3 text-brand-green" />
            {t("radiusKm")}:
          </span>
          {[5, 15, 30].map((r) => (
            <button
              key={r}
              onClick={() => applyRadius(activeRadius === r ? null : r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                activeRadius === r
                  ? "bg-brand-green text-white shadow-2xs"
                  : "text-brand-text hover:bg-brand-light"
              }`}
            >
              {r} km
            </button>
          ))}
          {activeRadius && (
            <button
              onClick={() => applyRadius(null)}
              className="px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg"
            >
              ✕
            </button>
          )}
        </div>

        {/* Reset View Button */}
        <button
          type="button"
          onClick={resetView}
          className="pointer-events-auto flex items-center gap-1 px-2.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-brand-border text-brand-muted hover:text-brand-dark text-xs font-semibold shadow-md transition-all"
          title="Reset map view"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Floating Bottom Left Badge — Farm Count */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-brand-border text-brand-dark text-xs font-bold shadow-md">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
          <span>
            {farmers.length} {t("farmsFound")}
          </span>
        </div>
      </div>
    </div>
  );
}
