import { LinkData, SocialItem, CreateLinkInput, UpdateLinkInput, BatchReorderInput } from "../types/links.types";

export async function fetchUserLinks(): Promise<{ links: LinkData[]; socials: SocialItem[] }> {
  const res = await fetch("/api/links");
  if (!res.ok) throw new Error("فشل جلب الروابط");
  const data = await res.json();
  return { links: data.links || [], socials: data.socials || [] };
}

export async function createLinkClient(input: CreateLinkInput): Promise<LinkData> {
  const res = await fetch("/api/links", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("فشل إنشاء الرابط");
  const data = await res.json();
  return data.link;
}

export async function updateLinkClient(id: string, input: UpdateLinkInput): Promise<LinkData> {
  const res = await fetch(`/api/links/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("فشل تحديث الرابط");
  const data = await res.json();
  return data.link;
}

export async function deleteLinkClient(id: string): Promise<void> {
  const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("فشل حذف الرابط");
}

export async function batchReorderLinksClient(payload: BatchReorderInput): Promise<void> {
  const res = await fetch("/api/links", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("فشل حفظ الترتيب الجديد");
}

