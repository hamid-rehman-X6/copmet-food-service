"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminProfileTab } from "@/components/admin/settings/AdminProfileTab";
import { StoreSettingsTab } from "@/components/admin/settings/StoreSettingsTab";
import { WhatsappNumbersTab } from "@/components/admin/settings/WhatsappNumbersTab";

const TABS = [
  { id: "store", label: "Store" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "profile", label: "Profile" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// Tabbed admin settings: store pricing, WhatsApp ordering numbers, admin profile.
export function AdminSettings() {
  const [tab, setTab] = useState<TabId>("store");

  return (
    <div className="space-y-8">
      <AdminPageHeader
        description="Manage store pricing, the WhatsApp numbers that receive orders, and your admin profile."
        eyebrow="Configuration"
        title="Settings"
      />

      <div className="flex gap-1 border-b border-border/60">
        {TABS.map((item) => (
          <button
            className={cn(
              "relative px-4 py-2.5 text-sm font-semibold transition-colors",
              tab === item.id ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
            key={item.id}
            onClick={() => setTab(item.id)}
            type="button"
          >
            {item.label}
            {tab === item.id ? <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" /> : null}
          </button>
        ))}
      </div>

      {tab === "store" ? <StoreSettingsTab /> : null}
      {tab === "whatsapp" ? <WhatsappNumbersTab /> : null}
      {tab === "profile" ? <AdminProfileTab /> : null}
    </div>
  );
}
