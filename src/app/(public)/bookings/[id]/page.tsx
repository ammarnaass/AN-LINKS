import { ClientBookingPortal } from "@/features/appointments/components/ClientBookingPortal";

interface BookingPortalPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function BookingPortalPage({
  params,
  searchParams,
}: BookingPortalPageProps) {
  const { id } = await params;
  const { token } = await searchParams;

  return <ClientBookingPortal bookingId={id} initialToken={token || ""} />;
}
