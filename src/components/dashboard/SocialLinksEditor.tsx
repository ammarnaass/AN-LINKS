"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SocialItem } from "../public/ProfileCard";

interface SocialLinksEditorProps {
  socials: SocialItem[];
  onSocialsChange: (newSocials: SocialItem[]) => void;
}

const AVAILABLE_NETWORKS = [
  { id: "instagram", name: "إنستغرام (Instagram)", placeholder: "https://instagram.com/username" },
  { id: "x", name: "منصة إكس (X / Twitter)", placeholder: "https://x.com/username" },
  { id: "tiktok", name: "تيك توك (TikTok)", placeholder: "https://tiktok.com/@username" },
  { id: "whatsapp", name: "واتساب (WhatsApp)", placeholder: "https://wa.me/966xxxxxxxxx" },
  { id: "youtube", name: "يوتيوب (YouTube)", placeholder: "https://youtube.com/@channel" },
  { id: "telegram", name: "تيليجرام (Telegram)", placeholder: "https://t.me/username" },
  { id: "linkedin", name: "لينكد إن (LinkedIn)", placeholder: "https://linkedin.com/in/username" },
  { id: "github", name: "جيت هاب (GitHub)", placeholder: "https://github.com/username" },
  { id: "facebook", name: "فيسبوك (Facebook)", placeholder: "https://facebook.com/page" },
];

export function SocialLinksEditor({ socials, onSocialsChange }: SocialLinksEditorProps) {
  const [selectedNetwork, setSelectedNetwork] = useState(AVAILABLE_NETWORKS[0].id);
  const [networkUrl, setNetworkUrl] = useState("");

  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!networkUrl.trim()) return;

    // Check if network already exists
    const existingIndex = socials.findIndex(
      (s) => s.network.toLowerCase() === selectedNetwork.toLowerCase()
    );

    let cleanUrl = networkUrl.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }

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

    setNetworkUrl("");
  };

  const handleDelete = (id: string) => {
    onSocialsChange(socials.filter((s) => s.id !== id));
  };

  const currentPlaceholder =
    AVAILABLE_NETWORKS.find((n) => n.id === selectedNetwork)?.placeholder || "https://...";

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
      <h3 className="font-bold text-gray-900 text-base">شبكات التواصل الاجتماعي</h3>

      <form onSubmit={handleAddSocial} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {AVAILABLE_NETWORKS.map((net) => (
              <option key={net.id} value={net.id}>
                {net.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder={currentPlaceholder}
            value={networkUrl}
            onChange={(e) => setNetworkUrl(e.target.value)}
            dir="ltr"
            className="sm:col-span-2 px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة أو تحديث حساب التواصل</span>
        </button>
      </form>

      {/* Socials List */}
      <div className="space-y-2 pt-2">
        {socials.map((social) => (
          <div
            key={social.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
          >
            <div>
              <span className="font-semibold text-xs text-gray-800 uppercase block">
                {social.network}
              </span>
              <span className="text-xs text-gray-500 font-mono truncate block" dir="ltr">
                {social.url}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleDelete(social.id)}
              className="text-red-500 p-1.5 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

