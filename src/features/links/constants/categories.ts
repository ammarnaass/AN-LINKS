export interface LinkCategory {
  id: string;
  label: string;
  color: string;
}

export const CATEGORIES: LinkCategory[] = [
  { id: "store", label: "متجر تجاري", color: "bg-primary/20 text-primary border-primary/30" },
  { id: "video", label: "فيديو مميّز", color: "bg-tertiary-container/30 text-tertiary border-tertiary/30" },
  { id: "chat", label: "محادثة فورية", color: "bg-primary-container/20 text-primary-fixed border-primary/30" },
  { id: "blog", label: "مدونة تقنية", color: "bg-secondary-container/20 text-secondary border-secondary/30" },
  { id: "link", label: "رابط مخصص", color: "bg-surface-container-highest text-on-surface-variant border-outline-variant/30" },
];
