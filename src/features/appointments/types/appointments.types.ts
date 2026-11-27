export type AppointmentStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

export type MeetingType = "ONLINE" | "PHONE" | "IN_PERSON";

export interface AvailabilityRuleInput {
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  slotMinutes: number; // 15, 30, 45, 60
  isActive?: boolean;
}

export interface AvailabilityExceptionItem {
  id: string;
  date: string; // "YYYY-MM-DD"
  reason?: string | null;
}

export interface ExistingBookingStub {
  id?: string;
  startTime: Date;
  endTime: Date;
  status: string;
  lockedUntil?: Date | null;
  bufferMinutes?: number;
}

export interface ConsultationSlot {
  slotDate: string; // YYYY-MM-DD in creator timezone
  startTime: string; // "09:00" in creator timezone
  endTime: string; // "10:00" in creator timezone
  startDateTime: Date; // exact UTC Date
  endDateTime: Date; // exact UTC Date
  isAvailable: boolean;
}

export interface ReserveSlotInput {
  serviceId: string;
  creatorId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientNotes?: string;
  clientTimezone?: string;
  gatewayCode?: string;
  startTime: Date;
  endTime?: Date;
  customMeetingUrl?: string | null;
  skipScheduleCheck?: boolean;
}

export interface ServiceInput {
  title: string;
  description?: string;
  durationMinutes: number;
  price: number;
  currency: string;
  meetingType?: MeetingType;
  meetingLocation?: string;
  bufferMinutes?: number;
  intakePrompt?: string;
  isActive?: boolean;
}

export interface ConsultationServiceItem {
  id: string;
  title: string;
  description?: string | null;
  durationMinutes: number;
  price: number;
  currency: string;
  meetingType?: MeetingType | string;
  meetingLocation?: string | null;
  bufferMinutes?: number;
  intakePrompt?: string | null;
  isActive: boolean;
  createdAt?: Date;
}

export interface BookingOverviewStats {
  totalBookings: number;
  upcomingConfirmed: number;
  completedBookings: number;
  totalRevenue: number;
  netRevenue?: number;
  currency: string;
}

export interface PublicGatewayOption {
  code: string;
  nameAr: string;
  nameEn: string;
  category: string;
  isTestMode: boolean;
  supportedCurrencies: string[];
}
