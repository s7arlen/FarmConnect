"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Leaf, Bell, User, Check, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

export default function HomeMobileHeader() {
  const user = useAuthStore((s) => s.user);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: "Fresh Harvest Alert", desc: "Vine-ripened tomatoes harvested this morning in Bantwal.", time: "10m ago" },
    { id: 2, title: "Marketplace Update", desc: "Maria's Organic Farm added 8 new leafy green bundles.", time: "1h ago" },
  ];

  return (
    <>
      <header className="lg:hidden sticky top-0 z-40 bg-brand-dark text-white px-4 py-3 flex items-center justify-between shadow-sm">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-green rounded-xl flex items-center justify-center shadow-inner">
            <Leaf className="w-4 h-4 text-white stroke-[2.2]" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">FarmConnect</span>
        </Link>

        {/* Right Actions: Language Switcher + Notification Bell + Avatar */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <LanguageSwitcher variant="navbar" isHeroPage={false} />

          {/* Notification Bell */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View notifications"
            className="relative p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <Bell className="w-5 h-5 stroke-[1.8]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-green rounded-full ring-2 ring-brand-dark" />
          </button>

          {/* User Profile Avatar / Sign In */}
          {user ? (
            <Link
              href={
                user.role === "FARMER"
                  ? "/farmer/dashboard"
                  : user.role === "ADMIN"
                  ? "/admin/dashboard"
                  : user.role === "BULK_BUYER"
                  ? "/bulk-buyer/dashboard"
                  : "/buyer/dashboard"
              }
              className="relative"
            >
              <Avatar className="w-8 h-8 ring-2 ring-brand-green/60">
                <AvatarFallback className="bg-brand-light text-brand-dark text-xs font-bold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-brand-dark" />
            </Link>
          ) : (
            <Link href="/login" className="relative group">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <User className="w-4 h-4" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-brand-green rounded-full ring-2 ring-brand-dark" />
            </Link>
          )}
        </div>
      </header>

      {/* Slide-out Mobile Notification Sheet */}
      {showNotifications && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-start pt-14">
          <div className="bg-white rounded-b-3xl shadow-xl border-b border-brand-border p-4 max-h-[75vh] overflow-y-auto animate-in slide-in-from-top-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-green" />
                <h3 className="text-sm font-bold text-brand-dark">Notifications</h3>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 rounded-full text-brand-muted hover:text-brand-dark hover:bg-brand-light"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-brand-border/60 py-1">
              {notifications.map((n) => (
                <div key={n.id} className="py-3 flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-green mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-brand-dark">{n.title}</p>
                      <span className="text-[10px] text-brand-muted">{n.time}</span>
                    </div>
                    <p className="text-xs text-brand-muted mt-0.5">{n.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowNotifications(false)}
                className="w-full py-2 bg-brand-light text-brand-green text-xs font-bold rounded-xl hover:bg-brand-green hover:text-white transition-colors"
              >
                Mark all as read
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
