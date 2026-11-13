import { notFound } from "next/navigation";
import { getPublicProfileData, generateProfileMetadata } from "@/lib/profile-service";
import { BioPageContent } from "@/components/public/BioPageContent";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const data = await getPublicProfileData(username);

  if (!data) {
    return {
      title: "الصفحة غير موجودة | AN LINKS",
      description: "المستخدم غير موجود أو تم إيقاف حسابه",
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

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const data = await getPublicProfileData(username);

  if (!data) {
    notFound();
  }

  return (
    <main className="w-full min-h-screen">
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

