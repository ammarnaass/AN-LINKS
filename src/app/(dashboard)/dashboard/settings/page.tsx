"use client";

import React, { useState, useEffect } from "react";
import {
  SettingsTab,
  validateSettingsProfile,
  SettingsHeader,
  SettingsTabsNav,
  ProfileTab,
  NewsletterTab,
  SubscriptionTab,
  PayoutsTab,
  SecurityTab,
  DangerZoneTab,
} from "@/features/settings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as SettingsTab | null;
      if (
        tabParam &&
        ["profile", "newsletter", "subscription", "payouts", "security", "danger"].includes(tabParam)
      ) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [seoIndexing, setSeoIndexing] = useState(true);

  // Save states
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.profile) {
          setDisplayName(data.profile.displayName || "");
          setUsername(data.profile.username || "");
          setEmail(data.profile.email || "");
          setPhone(data.profile.phone || "");
          setBio(data.profile.bio || "");
          setSeoIndexing(data.profile.seoIndexing !== false);
        }
      })
      .catch((err) => console.error("Settings profile fetch error:", err));
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const validation = validateSettingsProfile({
      displayName,
      email,
      username,
      bio,
      phone,
    });

    if (!validation.valid) {
      alert(validation.error);
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          bio,
          phone,
          seoIndexing,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert("فشل حفظ التعديلات في قاعدة البيانات");
      }
    } catch {
      alert("حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full">
      <SettingsHeader
        onSave={handleSaveProfile}
        isSaving={isSaving}
        savedSuccess={savedSuccess}
      />

      <SettingsTabsNav activeTab={activeTab} onSelectTab={setActiveTab} />

      <main>
        {activeTab === "profile" && (
          <ProfileTab
            displayName={displayName}
            setDisplayName={setDisplayName}
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            bio={bio}
            setBio={setBio}
            seoIndexing={seoIndexing}
            setSeoIndexing={setSeoIndexing}
          />
        )}

        {activeTab === "newsletter" && <NewsletterTab />}

        {activeTab === "subscription" && <SubscriptionTab />}
        {activeTab === "payouts" && <PayoutsTab />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "danger" && <DangerZoneTab />}
      </main>
    </div>
  );
}
