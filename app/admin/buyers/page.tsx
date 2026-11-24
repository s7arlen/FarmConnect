"use client";

import React, { useState } from "react";
import { Users, Search, ShoppingBag, ShieldCheck, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const DEMO_BUYERS = [
  {
    id: "buyer-1",
    name: "Demo Buyer",
    email: "buyer@demo.com",
    phone: "+91 98765 43210",
    role: "BUYER",
    ordersCount: 4,
    totalSpent: "₹1,450",
    status: "ACTIVE",
    joinedDate: new Date("2024-01-15"),
  },
  {
    id: "buyer-2",
    name: "Grand Hotel & Resorts",
    email: "bulk@demo.com",
    phone: "+91 98888 12345",
    role: "BULK_BUYER",
    ordersCount: 12,
    totalSpent: "₹48,200",
    status: "ACTIVE",
    joinedDate: new Date("2024-02-05"),
  },
  {
    id: "buyer-3",
    name: "Spice Garden Restaurant",
    email: "spicegarden@demo.com",
    phone: "+91 97777 65432",
    role: "BULK_BUYER",
    ordersCount: 7,
    totalSpent: "₹26,800",
    status: "ACTIVE",
    joinedDate: new Date("2024-03-12"),
  },
  {
    id: "buyer-4",
    name: "Anita Rao",
    email: "anita.rao@example.com",
    phone: "+91 99999 00000",
    role: "BUYER",
    ordersCount: 2,
    totalSpent: "₹650",
    status: "ACTIVE",
    joinedDate: new Date("2024-04-01"),
  },
];

export default function AdminBuyersPage() {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "BUYER" | "BULK_BUYER">("ALL");

  const filtered = DEMO_BUYERS.filter((b) => {
    const matchesQuery =
      b.name.toLowerCase().includes(query.toLowerCase()) ||
      b.email.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === "ALL" || b.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text mb-1">Buyer Management</h1>
          <p className="text-brand-muted text-sm">
            Overview of regular consumers and institutional bulk buyers
          </p>
        </div>

        <div className="flex gap-2">
          {(["ALL", "BUYER", "BULK_BUYER"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                roleFilter === r
                  ? "bg-brand-green text-white border-brand-green"
                  : "bg-white border-brand-border text-brand-muted hover:border-brand-green"
              }`}
            >
              {r === "ALL" ? "All Buyers" : r === "BULK_BUYER" ? "Bulk Buyers" : "Retail Buyers"}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 max-w-md">
        <Input
          placeholder="Search buyers by name or email..."
          leftIcon={<Search className="w-4 h-4" />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((b) => (
          <Card key={b.id} className="hover:border-brand-green/50 transition-colors shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-brand-text text-base">{b.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-brand-muted mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {b.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {b.phone}
                    </span>
                  </div>
                </div>

                <Badge variant={b.role === "BULK_BUYER" ? "default" : "secondary"}>
                  {b.role === "BULK_BUYER" ? "Bulk Institutional" : "Consumer"}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-brand-light/50 p-2.5 rounded-lg text-xs mt-4">
                <div>
                  <span className="text-brand-muted block">Orders:</span>
                  <span className="font-semibold text-brand-text">{b.ordersCount}</span>
                </div>
                <div>
                  <span className="text-brand-muted block">Total Spent:</span>
                  <span className="font-semibold text-brand-green">{b.totalSpent}</span>
                </div>
                <div>
                  <span className="text-brand-muted block">Joined:</span>
                  <span className="font-semibold text-brand-text">{formatDate(b.joinedDate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
