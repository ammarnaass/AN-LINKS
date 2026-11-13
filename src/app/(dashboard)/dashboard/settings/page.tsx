"use client";

import React, { useState } from "react";
import {
  SettingsTab,
  validateSettingsProfile,
  SettingsHeader,
  SettingsTabsNav,
  ProfileTab,
  SubscriptionTab,
  PayoutsTab,
  SecurityTab,
  DangerZoneTab,
} from "@/features/settings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const [displayName, setDisplayName] = useState("فيصل عبد العزيز المنصور");
  const [username, setUsername] = useState("faisal");
  const [email, setEmail] = useState("faisal@almansour.sa");
  const [phone, setPhone] = useState("+966 54 889 1234");
  const [bio, setBio] = useState(
    "صانع محتوى في التقنية وريادة الأعمال، مؤسس بودكاست «أبعاد رقمية». أشارككم مصادري الحصرية واستشاراتي الاستثمارية الأسبوعية."
  );
  const [seoIndexing, setSeoIndexing] = useState(true);

  // Save states
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = () => {
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

    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full">
      <SettingsHeader
        onSave={handleSaveProfile}
        isSaving={isSaving}
        savedSuccess={savedSuccess}
      />

      <SettingsTabsNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

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

      {activeTab === "subscription" && <SubscriptionTab />}

      {activeTab === "payouts" && <PayoutsTab />}

      {activeTab === "security" && <SecurityTab />}

      {activeTab === "danger" && <DangerZoneTab />}
    </div>
  );
}
