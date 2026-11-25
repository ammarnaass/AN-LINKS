import type {
  ProfileData,
  ButtonStyle,
  ButtonShadow,
  BorderRadius,
  FontFamily,
  BackgroundType,
  SocialPosition,
  CardStyle,
  AvatarFrameShape,
  AvatarBorderWidth,
  BadgeShape,
  BadgeSize,
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
  AvatarFrameShape,
  AvatarBorderWidth,
  BadgeShape,
  BadgeSize,
};

export interface AppearanceCustomizerProps {
  profile: ProfileData;
  onProfileChange: (newProfile: ProfileData) => void;
}

