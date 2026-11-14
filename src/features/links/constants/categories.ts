export interface LinkCategory {
  id: string;
  label: string;
  color: string;
  icon?: string;
}

export const CATEGORIES: LinkCategory[] = [
  { id: "store", label: "متجر تجاري", color: "bg-primary/20 text-primary border-primary/30", icon: "local_mall" },
  { id: "video", label: "فيديو مميّز", color: "bg-secondary-container/20 text-secondary border-secondary/30", icon: "videocam" },
  { id: "podcast", label: "بودكاست صوتي", color: "bg-tertiary-container/20 text-tertiary border-tertiary/30", icon: "podcasts" },
  { id: "consultation", label: "استشارة وحجز", color: "bg-primary-container/20 text-primary border-primary/30", icon: "calendar_month" },
  { id: "chat", label: "محادثة فورية", color: "bg-primary-container/20 text-primary-fixed border-primary/30", icon: "chat" },
  { id: "blog", label: "مدونة ومقال", color: "bg-secondary-container/20 text-secondary border-secondary/30", icon: "article" },
  { id: "link", label: "رابط مخصص", color: "bg-surface-container-highest text-on-surface-variant border-outline-variant/30", icon: "link" },
];

