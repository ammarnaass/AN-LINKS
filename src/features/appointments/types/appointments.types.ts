export type AppointmentStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "CANCELLED"
  | "EXPIRED";

export interface AvailabilityRuleInput {
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  slotMinutes: number; // 15, 30, 45, 60
  isActive?: boolean;
}

export interface ExistingBookingStub {
  startTime: Date;
  endTime: Date;
  status: string;
  lockedUntil?: Date | null;
}

export interface ConsultationSlot {
  slotDate: string; // YYYY-MM-DD
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  startDateTime: Date;
  endDateTime: Date;
  isAvailable: boolean;
}

export interface ReserveSlotInput {
  serviceId: string;
  creatorId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  startTime: Date;
  endTime: Date;
  customMeetingUrl?: string | null;
  autoConfirm?: boolean;
}

export interface ConsultationServiceItem {
  id: string;
  title: string;
  description?: string | null;
  durationMinutes: number;
  price: number;
  currency: string;
  isActive: boolean;
  createdAt?: Date;
}

export interface BookingOverviewStats {
  totalBookings: number;
  upcomingConfirmed: number;
  completedBookings: number;
  totalRevenue: number;
  currency: string;
}
