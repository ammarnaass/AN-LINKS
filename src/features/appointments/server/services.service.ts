import { prisma } from "@/shared/db";
import { ConsultationServiceItem } from "../types/appointments.types";

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
    isActive: s.isActive,
    createdAt: s.createdAt,
  }));
}

export interface ServiceInput {
  title: string;
  description?: string;
  durationMinutes: number;
  price: number;
  currency: string;
  isActive?: boolean;
}

export async function createCreatorService(creatorId: string, data: ServiceInput) {
  return await prisma.consultationService.create({
    data: {
      creatorId,
      title: data.title.trim(),
      description: data.description?.trim() || null,
      durationMinutes: Number(data.durationMinutes) || 30,
      price: Math.max(0, Number(data.price) || 0),
      currency: data.currency || "SAR",
      isActive: data.isActive !== false,
    },
  });
}

export async function updateCreatorService(
  creatorId: string,
  serviceId: string,
  data: Partial<ServiceInput>
) {
  return await prisma.consultationService.update({
    where: { id: serviceId, creatorId },
    data: {
      ...(data.title && { title: data.title.trim() }),
      ...(data.description !== undefined && { description: data.description?.trim() || null }),
      ...(data.durationMinutes !== undefined && { durationMinutes: Number(data.durationMinutes) }),
      ...(data.price !== undefined && { price: Math.max(0, Number(data.price)) }),
      ...(data.currency && { currency: data.currency }),
      ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
    },
  });
}

export async function deleteCreatorService(creatorId: string, serviceId: string) {
  return await prisma.consultationService.delete({
    where: { id: serviceId, creatorId },
  });
}
