"use client";

import React, { useState } from "react";
import { Search, UserX, UserCheck, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials, formatDate } from "@/lib/utils";
import { toast } from "sonner";

type UserStatus = "ACTIVE" | "SUSPENDED";

const DEMO_USERS = [
  { id: "1", name: "Demo Buyer", email: "buyer@demo.com", role: "BUYER", status: "ACTIVE" as UserStatus, createdAt: new Date("2024-01-15") },
  { id: "2", name: "Joseph D'Souza", email: "farmer@demo.com", role: "FARMER", status: "ACTIVE" as UserStatus, createdAt: new Date("2023-12-01") },
  { id: "3", name: "Maria Saldanha", email: "maria@demo.farmconnect.in", role: "FARMER", status: "ACTIVE" as UserStatus, createdAt: new Date("2023-11-10") },
  { id: "4", name: "Grand Hotel", email: "bulk@demo.com", role: "BULK_BUYER", status: "ACTIVE" as UserStatus, createdAt: new Date("2024-02-05") },
  { id: "5", name: "Admin User", email: "admin@demo.com", role: "ADMIN", status: "ACTIVE" as UserStatus, createdAt: new Date("2023-01-01") },
];

const ROLE_COLORS: Record<string, string> = {
  FARMER: "bg-brand-light text-brand-green",
  BUYER: "bg-blue-50 text-blue-600",
  BULK_BUYER: "bg-purple-50 text-purple-600",
  ADMIN: "bg-red-50 text-brand-error",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState(DEMO_USERS);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const filtered = users.filter((u) => {
    const matchesQuery = !query || u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  async function toggleStatus(id: string) {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    // Optimistic update
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, status: newStatus }),
      });
      if (res.ok) {
        toast.success(`${user.name} ${newStatus === "SUSPENDED" ? "suspended" : "activated"}`);
      } else {
        throw new Error();
      }
    } catch {
      toast.success(`${user.name} ${newStatus === "SUSPENDED" ? "suspended" : "activated"} (Demo mode)`);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-text mb-1">User Management</h1>
        <p className="text-brand-muted text-sm">{users.length} registered users</p>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search users..."
            leftIcon={<Search className="w-4 h-4" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["All", "FARMER", "BUYER", "BULK_BUYER", "ADMIN"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                roleFilter === role
                  ? "bg-brand-dark text-white border-brand-dark"
                  : "bg-white border-brand-border text-brand-muted hover:border-brand-dark"
              }`}
            >
              {role === "All" ? "All" : role.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center text-brand-green font-semibold text-sm flex-shrink-0">
                {getInitials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-brand-text text-sm">{user.name}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ROLE_COLORS[user.role]}`}>
                    {user.role.replace("_", " ")}
                  </span>
                  {user.status === "SUSPENDED" && (
                    <Badge variant="error" className="text-[10px]">Suspended</Badge>
                  )}
                </div>
                <p className="text-xs text-brand-muted">{user.email}</p>
                <p className="text-xs text-brand-muted">Joined {formatDate(user.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="p-2 rounded-lg hover:bg-brand-light text-brand-muted hover:text-brand-green transition-colors" title="View user">
                  <Eye className="w-4 h-4" />
                </button>
                {user.role !== "ADMIN" && (
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      user.status === "ACTIVE"
                        ? "hover:bg-red-50 text-brand-muted hover:text-brand-error"
                        : "hover:bg-brand-light text-amber-500 hover:text-brand-green"
                    }`}
                    title={user.status === "ACTIVE" ? "Suspend user" : "Activate user"}
                  >
                    {user.status === "ACTIVE" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
