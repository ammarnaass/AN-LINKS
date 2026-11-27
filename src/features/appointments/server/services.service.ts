import { prisma } from "@/shared/db";
import { ConsultationServiceItem, ServiceInput } from "../types/appointments.types";
import { validateServiceInput } from "../validators/appointments.validator";

export async function getCreatorAppointmentQuota(creatorId: string) {
  const [user, sub] = await Promise.all([
    prisma.user.findUnique({ where: { id: creatorId }, select: { role: true } }),
    prisma.userSubscription.findFirst({
      where: { userId: creatorId, status: { in: ["ACTIVE", "TRIAL"] } },
      include: { plan: { include: { quotas: true } } },
    }),
  ]);

  const isAdmin = user?.role === "ADMIN";
  const allowAppointments = isAdmin || Boolean(sub?.plan?.quotas?.allowAppointments);
  const storeCommissionRate = sub?.plan?.quotas?.storeCommissionRate ?? (sub ? 5.0 : 10.0);

  return {
    allowAppointments,
    maxServices: allowAppointments ? 100 : 1,
    allowPaidServices: allowAppointments,
    storeCommissionRate,
  };
}

export async function getCreatorServices(creatorId: string): Promise<ConsultationServiceItem[]> {
  const services = await prisma.consultationService.findMany({
    where: { creatorId },
    orderBy: { createdAt: "desc" },
  });
  return services.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    durationMinutes: s.durationMinutes,
    price: s.price,
    currency: s.currency,
    meetingType: s.meetingType,
    meetingLocation: s.meetingLocation,
    bufferMinutes: s.bufferMinutes,
    intakePrompt: s.intakePrompt,
    isActive: s.isActive,
    createdAt: s.createdAt,
  }));
}

export async function createCreatorService(creatorId: string, data: ServiceInput) {
  const check = validateServiceInput(data);
  if (!check.isValid) throw new Error(check.error);

  const quota = await getCreatorAppointmentQuota(creatorId);
  const currentCount = await prisma.consultationService.count({ where: { creatorId } });

  if (!quota.allowAppointments) {
    if (currentCount >= quota.maxServices) {
      throw new Error("QUOTA_SERVICE_LIMIT: الباقة المجانية تسمح بباقة استشارة تجريبية واحدة فقط. قم بالترقية لإضافة المزيد.");
    }
    if (Number(data.price) > 0) {
      throw new Error("QUOTA_PAID_BLOCKED: الاستشارات المدفوعة متاحة بدءاً من باقة صناع المحتوى وما فوق.");
    }
  }

  return await prisma.consultationService.create({
    data: {
      creatorId,
      title: data.title.trim(),
      description: data.description?.trim() || null,
      durationMinutes: Number(data.durationMinutes) || 30,
      price: Math.max(0, Number(data.price) || 0),
      currency: (data.currency || "SAR").toUpperCase(),
      meetingType: data.meetingType || "ONLINE",
      meetingLocation: data.meetingLocation?.trim() || null,
      bufferMinutes: Math.max(0, Number(data.bufferMinutes ?? 10)),
      intakePrompt: data.intakePrompt?.trim() || null,
      isActive: data.isActive !== false,
    },
  });
}

export async function updateCreatorService(
  creatorId: string,
  serviceId: string,
  data: Partial<ServiceInput>
) {
  const existing = await prisma.consultationService.findFirst({
    where: { id: serviceId, creatorId },
  });
  if (!existing) throw new Error("الخدمة غير موجودة");

  const merged: ServiceInput = {
    title: data.title ?? existing.title,
    description: data.description !== undefined ? data.description : existing.description || undefined,
    durationMinutes: data.durationMinutes ?? existing.durationMinutes,
    price: data.price ?? existing.price,
    currency: data.currency ?? existing.currency,
    meetingType: (data.meetingType as ServiceInput["meetingType"]) ?? (existing.meetingType as ServiceInput["meetingType"]),
    meetingLocation: data.meetingLocation !== undefined ? data.meetingLocation : existing.meetingLocation || undefined,
    bufferMinutes: data.bufferMinutes ?? existing.bufferMinutes,
    intakePrompt: data.intakePrompt !== undefined ? data.intakePrompt : existing.intakePrompt || undefined,
    isActive: data.isActive ?? existing.isActive,
  };

  const check = validateServiceInput(merged);
  if (!check.isValid) throw new Error(check.error);

  const quota = await getCreatorAppointmentQuota(creatorId);
  if (!quota.allowAppointments && Number(merged.price) > 0) {
    throw new Error("QUOTA_PAID_BLOCKED: الاستشارات المدفوعة تتطلب الترقية إلى باقة مدفوعة.");
  }

  return await prisma.consultationService.update({
    where: { id: serviceId },
    data: {
      title: merged.title.trim(),
      description: merged.description?.trim() || null,
      durationMinutes: Number(merged.durationMinutes),
      price: Math.max(0, Number(merged.price)),
      currency: merged.currency.toUpperCase(),
      meetingType: merged.meetingType || "ONLINE",
      meetingLocation: merged.meetingLocation?.trim() || null,
      bufferMinutes: Math.max(0, Number(merged.bufferMinutes ?? 10)),
      intakePrompt: merged.intakePrompt?.trim() || null,
      isActive: merged.isActive !== false,
    },
  });
}

export async function deleteOrArchiveCreatorService(creatorId: string, serviceId: string) {
  const existing = await prisma.consultationService.findFirst({
    where: { id: serviceId, creatorId },
    include: { _count: { select: { bookings: true } } },
  });
  if (!existing) throw new Error("الخدمة غير موجودة");

  if (existing._count.bookings > 0) {
    const archived = await prisma.consultationService.update({
      where: { id: serviceId },
      data: { isActive: false },
    });
    return { archived: true, service: archived };
  }

  await prisma.consultationService.delete({ where: { id: serviceId } });
  return { archived: false, service: null };
}
