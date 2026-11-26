import { Metadata } from "next";
import { NewsletterManagementStudio } from "@/features/newsletter";

export const metadata: Metadata = {
  title: "إدارة النشرة البريدية والمشتركين | AN LINKS",
  description: "استوديو إدارة النشرة البريدية وحملات البريد الإلكتروني للمبدعين",
};

export default function DashboardNewsletterPage() {
  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      <NewsletterManagementStudio />
    </div>
  );
}
