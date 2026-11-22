"use client";

import React, { useState } from "react";
import { MapPin, ChevronDown, Check, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

const LOCATIONS = [
  { name: "Bantwal, Dakshina Kannada", distance: "2 km", active: true },
  { name: "Moodbidri, Dakshina Kannada", distance: "12 km", active: false },
  { name: "Mangalore Rural", distance: "18 km", active: false },
  { name: "Puttur, Dakshina Kannada", distance: "25 km", active: false },
  { name: "Belthangady, Dakshina Kannada", distance: "32 km", active: false },
];

export default function LocationSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(LOCATIONS[0]);

  return (
    <div className="relative">
      {/* Location Selector Pill */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-white border border-brand-border text-left shadow-2xs hover:bg-brand-cream/80 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-brand-light flex items-center justify-center flex-shrink-0 text-brand-green">
            <MapPin className="w-4 h-4 stroke-[2]" />
          </div>
          <div className="truncate">
            <p className="text-[10px] uppercase font-bold tracking-wider text-brand-muted">Delivering Near</p>
            <p className="text-xs font-semibold text-brand-text truncate">
              {selected.name} <span className="text-brand-muted font-normal">• {selected.distance}</span>
            </p>
          </div>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-brand-muted flex-shrink-0 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {/* Modal / Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white rounded-2xl border border-brand-border shadow-xl p-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-brand-border px-1">
              <span className="text-xs font-bold text-brand-dark flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-brand-green" />
                Select Farm Cluster
              </span>
              <span className="text-[10px] text-brand-muted">Karnataka</span>
            </div>
            <div className="space-y-1">
              {LOCATIONS.map((loc) => {
                const isCurrent = loc.name === selected.name;
                return (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => {
                      setSelected(loc);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left",
                      isCurrent
                        ? "bg-brand-light text-brand-green font-semibold"
                        : "text-brand-text hover:bg-brand-cream"
                    )}
                  >
                    <span className="truncate">{loc.name}</span>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-[10px] text-brand-muted">{loc.distance}</span>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-brand-green" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
