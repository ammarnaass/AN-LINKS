"use client";

import React from "react";
import { useSettingsProfile } from "../hooks/useSettingsProfile";
import { AvatarUploadCard } from "./profile/AvatarUploadCard";
import { ProfileFieldsForm } from "./profile/ProfileFieldsForm";
import { MarketingPixelsCard } from "./profile/MarketingPixelsCard";
import { CustomDomainCard } from "./profile/CustomDomainCard";
import { SubscribersListCard } from "./profile/SubscribersListCard";
import { DigitalProductsCard } from "./profile/DigitalProductsCard";

export interface ProfileTabProps {
  displayName?: string;
  setDisplayName?: (val: string) => void;
  username?: string;
  setUsername?: (val: string) => void;
  email?: string;
  setEmail?: (val: string) => void;
  phone?: string;
  setPhone?: (val: string) => void;
  location?: string;
  setLocation?: (val: string) => void;
  bio?: string;
  setBio?: (val: string) => void;
  seoIndexing?: boolean;
  setSeoIndexing?: (val: boolean) => void;
}

export function ProfileTab(props?: ProfileTabProps) {
  const {
    profile: hookProfile,
    setProfile: hookSetProfile,
    avatarUrl,
    isLoading,
    isSaving,
    statusMessage,
    handleUpdate,
  } = useSettingsProfile();

  const profile = {
    ...hookProfile,
    displayName: props?.displayName !== undefined && props?.displayName !== "" ? props.displayName : hookProfile.displayName,
    username: props?.username !== undefined && props?.username !== "" ? props.username : hookProfile.username,
    email: props?.email !== undefined && props?.email !== "" ? props.email : hookProfile.email,
    phone: props?.phone !== undefined && props?.phone !== "" ? props.phone : hookProfile.phone,
    location: props?.location !== undefined && props?.location !== "" ? props.location : hookProfile.location,
    bio: props?.bio !== undefined && props?.bio !== "" ? props.bio : hookProfile.bio,
  };

  const setProfile: React.Dispatch<React.SetStateAction<typeof hookProfile>> = (val) => {
    const next = typeof val === "function" ? val(profile) : val;
    hookSetProfile(next);
    if (props?.setDisplayName) props.setDisplayName(next.displayName);
    if (props?.setUsername) props.setUsername(next.username);
    if (props?.setEmail) props.setEmail(next.email);
    if (props?.setPhone && next.phone) props.setPhone(next.phone);
    if (props?.setLocation && next.location) props.setLocation(next.location);
    if (props?.setBio && next.bio) props.setBio(next.bio);
  };

  if (isLoading && !props?.displayName) {
    return (
      <div className="flex items-center justify-center p-12 text-on-surface-variant text-sm">
        جاري تحميل بيانات الملف الشخصي...
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4">
          <AvatarUploadCard
            displayName={profile.displayName}
            username={profile.username}
            avatarUrl={avatarUrl}
          />
        </div>
        <div className="lg:col-span-8">
          <ProfileFieldsForm
            profile={profile}
            setProfile={setProfile}
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(profile);
            }}
            isSaving={isSaving}
            statusMessage={statusMessage}
          />
        </div>
      </div>

      <MarketingPixelsCard
        profile={profile}
        setProfile={setProfile}
        onSave={() => handleUpdate(profile)}
        isSaving={isSaving}
      />

      <CustomDomainCard />

      <SubscribersListCard />

      <DigitalProductsCard />
    </section>
  );
}
