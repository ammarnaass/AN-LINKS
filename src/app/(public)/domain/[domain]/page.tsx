import { notFound } from "next/navigation";
import {
  getPublicProfileByDomain,
  generateProfileMetadata,
  BioPageContent,
  ProfileJsonLd,
} from "@/features/bio";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ domain: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain } = await params;
  const data = await getPublicProfileByDomain(domain);

  if (!data) {
    return {
      title: "النطاق غير مهيأ | AN LINKS",
      description: "هذا النطاق غير مرتبط أو بانتظار التحقق",
    };
  }

  const meta = generateProfileMetadata({
    displayName: data.profile.displayName,
    bio: data.profile.bio,
    username: data.user.username,
    avatarUrl: data.profile.avatarUrl,
  });

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.openGraph.title,
      description: meta.openGraph.description,
      images: meta.openGraph.images,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: meta.twitter.title,
      description: meta.twitter.description,
      images: meta.twitter.images,
    },
  };
}

export default async function CustomDomainBioPage({ params }: PageProps) {
  const { domain } = await params;
  const data = await getPublicProfileByDomain(domain);

  if (!data) {
    notFound();
  }

  return (
    <main className="w-full min-h-screen">
      <ProfileJsonLd
        profile={data.profile}
        username={data.user.username}
        socials={data.socials}
        canonicalOrigin={`https://${domain}`}
      />
      <BioPageContent
        profile={data.profile}
        username={data.user.username}
        links={data.links}
        socials={data.socials}
        isPreview={false}
      />
    </main>
  );
}
