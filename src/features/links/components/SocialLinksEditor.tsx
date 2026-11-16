"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SocialItem, PlatformDTO } from "../types/links.types";
import { SOCIAL_ICON_MAP, GenericLinkIcon, getSocialIcon } from "@/shared/ui";

interface SocialLinksEditorProps {
  socials: SocialItem[];
  onSocialsChange: (newSocials: SocialItem[]) => void;
}

interface NetworkConfig {
  id: string;
  name: string;
  placeholder: string;
  brandColor?: string;
}

const DEFAULT_NETWORKS: NetworkConfig[] = [
  { id: "instagram", name: "إنستغرام", placeholder: "https://instagram.com/username", brandColor: "#E1306C" },
  { id: "x", name: "منصة إكس", placeholder: "https://x.com/username", brandColor: "#000000" },
  { id: "youtube", name: "يوتيوب", placeholder: "https://youtube.com/@channel", brandColor: "#FF0000" },
  { id: "tiktok", name: "تيك توك", placeholder: "https://tiktok.com/@username", brandColor: "#000000" },
  { id: "snapchat", name: "سناب شات", placeholder: "https://snapchat.com/add/username", brandColor: "#FFFC00" },
  { id: "whatsapp", name: "واتساب", placeholder: "https://wa.me/966500000000", brandColor: "#25D366" },
  { id: "telegram", name: "تيليجرام", placeholder: "https://t.me/username", brandColor: "#0088CC" },
  { id: "linkedin", name: "لينكد إن", placeholder: "https://linkedin.com/in/username", brandColor: "#0A66C2" },
  { id: "github", name: "جيت هاب", placeholder: "https://github.com/username", brandColor: "#24292E" },
  { id: "spotify", name: "سبوتيفاي", placeholder: "https://open.spotify.com/artist/...", brandColor: "#1DB954" },
  { id: "apple-music", name: "أبل ميوزك", placeholder: "https://music.apple.com/artist/...", brandColor: "#FA2D48" },
  { id: "soundcloud", name: "ساوند كلاود", placeholder: "https://soundcloud.com/artist", brandColor: "#FF5500" },
  { id: "anghami", name: "أنغامي", placeholder: "https://play.anghami.com/artist/...", brandColor: "#7928CA" },
  { id: "salla", name: "سلة", placeholder: "https://salla.sa/mystore", brandColor: "#00B4D8" },
  { id: "zid", name: "زد", placeholder: "https://zid.store/mystore", brandColor: "#6C5CE7" },
  { id: "discord", name: "ديسكورد", placeholder: "https://discord.gg/inviteCode", brandColor: "#5865F2" },
  { id: "twitch", name: "تويتش", placeholder: "https://twitch.tv/channel", brandColor: "#9146FF" },
  { id: "facebook", name: "فيسبوك", placeholder: "https://facebook.com/username", brandColor: "#1877F2" },
  { id: "pinterest", name: "بينترست", placeholder: "https://pinterest.com/username", brandColor: "#E60023" },
  { id: "custom", name: "رابط مخصص", placeholder: "https://example.com", brandColor: "#4EDEA3" },
];

export function SocialLinksEditor({ socials, onSocialsChange }: SocialLinksEditorProps) {
  const [networks, setNetworks] = useState<NetworkConfig[]>(DEFAULT_NETWORKS);
  const [selectedNetwork, setSelectedNetwork] = useState(DEFAULT_NETWORKS[0].id);
  const [networkUrl, setNetworkUrl] = useState("");
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/platforms")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: PlatformDTO[]) => {
        if (!active || !Array.isArray(data) || data.length === 0) return;
        setNetworks(
          data.map((p) => ({
            id: p.slug,
            name: p.nameAr,
            placeholder: p.urlPlaceholder || `https://${p.slug}.com/...`,
            brandColor: p.brandColor,
          }))
        );
      })
      .catch(() => {
        // Fallback gracefully to default networks
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSelectNetwork = (netId: string) => {
    setSelectedNetwork(netId);
    const existing = socials.find((s) => s.network.toLowerCase() === netId.toLowerCase());
    setNetworkUrl(existing ? existing.url : "");
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

    const currentNet = networks.find((n) => n.id === selectedNetwork);

    if (existingIndex >= 0) {
      const updated = [...socials];
      updated[existingIndex].url = cleanUrl;
      updated[existingIndex].platformId = currentNet?.id || selectedNetwork;
      onSocialsChange(updated);
    } else {
      const newSocial: SocialItem = {
        id: `social-${Date.now()}`,
        network: selectedNetwork,
        url: cleanUrl,
        platformId: currentNet?.id || selectedNetwork,
      };
      onSocialsChange([...socials, newSocial]);
    }
  };

  const handleDelete = (id: string) => {
    onSocialsChange(socials.filter((s) => s.id !== id));
  };

  const currentNetObj = networks.find((n) => n.id === selectedNetwork) || networks[0];

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-surface-container-low p-4 shadow-lg border border-outline-variant/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
            <h3 className="font-bold text-on-surface text-base">شبكات التواصل والمنصات</h3>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-xs">
              {`${socials.length} منصات متصلة`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsReordering(!isReordering)}
            className="flex items-center gap-1 text-on-surface-variant hover:text-primary text-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>{isReordering ? "حفظ الترتيب" : "ترتيب الأيقونات"}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2 pt-1 max-h-72 overflow-y-auto p-1">
          {networks.map((net) => {
            const isConnected = socials.some((s) => s.network.toLowerCase() === net.id.toLowerCase());
            const isSelected = selectedNetwork.toLowerCase() === net.id.toLowerCase();
            const Icon = SOCIAL_ICON_MAP[net.id.toLowerCase()] || GenericLinkIcon;

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
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 transition-transform ${
                    isSelected ? "scale-110" : ""
                  }`}
                  style={net.brandColor ? { color: net.brandColor } : undefined}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-on-surface truncate w-full text-center">
                  {net.name}
                </span>
                <span
                  className={`text-[10px] mt-0.5 font-semibold ${
                    isConnected ? "text-primary" : "text-on-surface-variant/50"
                  }`}
                >
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
          {socials.some((s) => s.network.toLowerCase() === selectedNetwork.toLowerCase()) && (
            <button
              type="button"
              onClick={() => {
                const item = socials.find((s) => s.network.toLowerCase() === selectedNetwork.toLowerCase());
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
