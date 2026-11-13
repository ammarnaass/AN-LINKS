"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SocialItem } from "../types/links.types";
import { SOCIAL_ICON_MAP } from "@/shared/ui";

interface SocialLinksEditorProps {
  socials: SocialItem[];
  onSocialsChange: (newSocials: SocialItem[]) => void;
}

const AVAILABLE_NETWORKS = [
  { id: "instagram", name: "إنستغرام", placeholder: "https://instagram.com/username" },
  { id: "x", name: "منصة إكس", placeholder: "https://x.com/username" },
  { id: "youtube", name: "يوتيوب", placeholder: "https://youtube.com/@channel" },
  { id: "tiktok", name: "تيك توك", placeholder: "https://tiktok.com/@username" },
  { id: "whatsapp", name: "واتساب", placeholder: "https://wa.me/966xxxxxxxxx" },
  { id: "telegram", name: "تيليجرام", placeholder: "https://t.me/username" },
  { id: "linkedin", name: "لينكد إن", placeholder: "https://linkedin.com/in/username" },
  { id: "github", name: "جيت هاب", placeholder: "https://github.com/username" },
];

export function SocialLinksEditor({ socials, onSocialsChange }: SocialLinksEditorProps) {
  const [selectedNetwork, setSelectedNetwork] = useState(AVAILABLE_NETWORKS[0].id);
  const [networkUrl, setNetworkUrl] = useState("");

  const handleSelectNetwork = (netId: string) => {
    setSelectedNetwork(netId);
    const existing = socials.find((s) => s.network.toLowerCase() === netId.toLowerCase());
    if (existing) {
      setNetworkUrl(existing.url);
    } else {
      setNetworkUrl("");
    }
  };

  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!networkUrl.trim()) return;

    let cleanUrl = networkUrl.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const existingIndex = socials.findIndex(
      (s) => s.network.toLowerCase() === selectedNetwork.toLowerCase()
    );

    if (existingIndex >= 0) {
      const updated = [...socials];
      updated[existingIndex].url = cleanUrl;
      onSocialsChange(updated);
    } else {
      const newSocial: SocialItem = {
        id: `social-${Date.now()}`,
        network: selectedNetwork,
        url: cleanUrl,
      };
      onSocialsChange([...socials, newSocial]);
    }
  };

  const handleDelete = (id: string) => {
    onSocialsChange(socials.filter((s) => s.id !== id));
  };

  const currentNetObj = AVAILABLE_NETWORKS.find((n) => n.id === selectedNetwork) || AVAILABLE_NETWORKS[0];

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-surface-container-low p-4 shadow-lg border border-outline-variant/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
            <h3 className="font-bold text-on-surface text-base">شبكات التواصل السريعة</h3>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-xs">
              {socials.length} منصات متصلة
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 pt-1">
          {AVAILABLE_NETWORKS.map((net) => {
            const isConnected = socials.some((s) => s.network.toLowerCase() === net.id);
            const isSelected = selectedNetwork === net.id;
            const Icon = SOCIAL_ICON_MAP[net.id] || SOCIAL_ICON_MAP.other;

            return (
              <button
                key={net.id}
                type="button"
                onClick={() => handleSelectNetwork(net.id)}
                className={`flex flex-col items-center p-2.5 rounded-xl transition-all border ${
                  isSelected
                    ? "bg-surface-container-high border-primary shadow-[0_0_12px_rgba(78,222,163,0.2)]"
                    : "bg-surface-container border-outline-variant/20 hover:bg-surface-container-high hover:border-outline-variant/40"
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 transition-transform ${
                  isSelected ? "scale-110" : ""
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-on-surface truncate w-full text-center">
                  {net.name}
                </span>
                <span className={`text-[10px] mt-0.5 font-semibold ${
                  isConnected ? "text-primary" : "text-on-surface-variant/50"
                }`}>
                  {isConnected ? "نشط ✓" : "+ إضافة"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={handleAddSocial}
        className="rounded-xl bg-surface-container p-4 border border-outline-variant/30 shadow-md space-y-3"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">edit_link</span>
            <span>تحديث رابط: {currentNetObj.name}</span>
          </span>
          {socials.some((s) => s.network === selectedNetwork) && (
            <button
              type="button"
              onClick={() => {
                const item = socials.find((s) => s.network === selectedNetwork);
                if (item) handleDelete(item.id);
                setNetworkUrl("");
              }}
              className="text-xs text-error hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>إزالة المنصة</span>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder={currentNetObj.placeholder}
            value={networkUrl}
            onChange={(e) => setNetworkUrl(e.target.value)}
            dir="ltr"
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/40 text-on-surface placeholder-on-surface-variant/40 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary text-right"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary-container hover:bg-primary text-on-primary font-bold rounded-xl text-sm transition shadow-md shrink-0 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>حفظ المنصة</span>
          </button>
        </div>
      </form>
    </div>
  );
}
