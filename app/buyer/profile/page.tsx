"use client";
import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { getInitials } from "@/lib/utils";

export default function BuyerProfilePage() {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-brand-text mb-6">Profile</h1>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center text-brand-green font-bold text-xl">
              {user ? getInitials(user.name) : <User className="w-8 h-8" />}
            </div>
            <div>
              <h2 className="font-bold text-brand-text text-lg">{user?.name || "Demo User"}</h2>
              <p className="text-brand-muted text-sm">{user?.email || "demo@farmconnect.in"}</p>
              <p className="text-xs text-brand-green font-medium capitalize mt-0.5">
                {user?.role?.replace("_", " ").toLowerCase() || "buyer"}
              </p>
            </div>
          </div>
          <p className="text-sm text-brand-muted">
            Profile management will be available after account setup.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
