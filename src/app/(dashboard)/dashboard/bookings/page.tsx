import { Metadata } from "next";
import { AppointmentsStudio } from "@/features/appointments/components/AppointmentsStudio";

export const metadata: Metadata = {
  title: "حجز المواعيد والاستشارات | AN LINKS",
  description: "إدارة باقات الخدمات وحجوزات المواعيد وجدول العمل الأسبوعي",
};

export default function AppointmentsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <AppointmentsStudio />
    </div>
  );
}
