import { z } from "zod";

export const AvailabilityRuleSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "صيغة الوقت غير صالحة (HH:MM)"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "صيغة الوقت غير صالحة (HH:MM)"),
  slotMinutes: z.number().int().refine((val) => [15, 30, 45, 60].includes(val), {
    message: "مدة الجلسة يجب أن تكون 15، 30، 45 أو 60 دقيقة",
  }),
});

export const ReserveSlotSchema = z.object({
  serviceId: z.string().min(1, "معرف الخدمة مطلوب"),
  creatorId: z.string().min(1, "معرف صانع المحتوى مطلوب"),
  clientName: z.string().min(2, "الاسم يجب ألا يقل عن حرفين"),
  clientEmail: z.string().email("البريد الإلكتروني غير صالح"),
  clientPhone: z.string().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
}).refine((data) => data.endTime > data.startTime, {
  message: "وقت النهاية يجب أن يكون بعد وقت البداية",
  path: ["endTime"],
});

export type ReserveSlotSchemaType = z.infer<typeof ReserveSlotSchema>;
