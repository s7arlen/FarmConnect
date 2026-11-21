"use client";

import dynamic from "next/dynamic";
import React from "react";
import { Loader2 } from "lucide-react";
import { type Farmer } from "@/types/farmer";

interface FarmerMapProps {
  farmers: Farmer[];
  selectedFarmerId?: string | null;
  onSelectFarmer?: (farmerId: string) => void;
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
}

const DynamicFarmerMap = dynamic(() => import("./FarmerMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[460px] lg:h-[600px] rounded-2xl bg-brand-light/40 border border-brand-border flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
      <p className="text-xs font-semibold text-brand-muted">
        Loading agricultural interactive map...
      </p>
    </div>
  ),
});

export default function SafeFarmerMap(props: FarmerMapProps) {
  return <DynamicFarmerMap {...props} />;
}
