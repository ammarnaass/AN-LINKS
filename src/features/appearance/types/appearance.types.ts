import type {
  ProfileData,
  ButtonStyle,
  ButtonShadow,
  BorderRadius,
  FontFamily,
  BackgroundType,
  SocialPosition,
} from "@/features/bio";

export type {
  ProfileData,
  ButtonStyle,
  ButtonShadow,
  BorderRadius,
  FontFamily,
  BackgroundType,
  SocialPosition,
};

export interface AppearanceCustomizerProps {
  profile: ProfileData;
  onProfileChange: (newProfile: ProfileData) => void;
}

