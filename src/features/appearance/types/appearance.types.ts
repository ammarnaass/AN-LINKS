import type {
  ProfileData,
  ButtonStyle,
  ButtonShadow,
  BorderRadius,
  FontFamily,
  BackgroundType,
  SocialPosition,
  CardStyle,
} from "@/features/bio";

export type {
  ProfileData,
  ButtonStyle,
  ButtonShadow,
  BorderRadius,
  FontFamily,
  BackgroundType,
  SocialPosition,
  CardStyle,
};

export interface AppearanceCustomizerProps {
  profile: ProfileData;
  onProfileChange: (newProfile: ProfileData) => void;
}

