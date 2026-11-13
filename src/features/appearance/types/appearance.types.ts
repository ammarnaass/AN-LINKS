import { ProfileData } from "@/components/public/BioPageContent";

export type { ProfileData };

export interface AppearanceCustomizerProps {
  profile: ProfileData;
  onProfileChange: (newProfile: ProfileData) => void;
}
