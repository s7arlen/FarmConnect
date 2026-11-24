"use client";
import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { getInitials } from "@/lib/utils";

export default function BulkBuyerProfilePage() {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-brand-text mb-6">Profile</h1>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-brand-light flex items-center justify-center text-brand-green font-bold text-xl">
              {user ? getInitials(user.name) : <User className="w-7 h-7" />}
            </div>
            <div>
              <h2 className="font-bold text-brand-text">{user?.name || "Bulk Buyer"}</h2>
              <p className="text-brand-muted text-sm">{user?.email}</p>
              <p className="text-xs text-brand-green font-medium mt-0.5">Bulk Buyer Account</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
