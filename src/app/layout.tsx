import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/auth";
import { cookies } from "next/headers";
import {
  I18nProvider,
  LOCALE_COOKIE_NAME,
  normalizeLocale,
  getDirection,
} from "@/shared/i18n";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://anlinks.dev"),
  title: "AN LINKS | أسرع منصة لروابط الـ Bio بالعربية",
  description: "اجمع كل روابطك وحساباتك في صفحة واحدة احترافية وسريعة مصممة خصيصاً للمحتوى العربي.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/logo-icon.svg",
  },
  openGraph: {
    title: "AN LINKS | المنصة الأكثر تطوراً لصفحات الروابط والـ Bio",
    description: "اجمع كل روابطك وقنواتك ومتجرك في صفحة واحدة احترافية وسريعة مصممة للمحتوى العربي.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "AN LINKS Platform" }],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const initialLocale = normalizeLocale(rawLocale);
  const initialDir = getDirection(initialLocale);

  return (
    <html
      lang={initialLocale}
      dir={initialDir}
      className={`dark ${cairo.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('theme_mode') || 'dark';
                  if (mode === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="font-plex antialiased min-h-screen bg-surface-container-lowest text-on-surface selection:bg-primary-container selection:text-on-primary-container">
        <AuthProvider>
          <I18nProvider initialLocale={initialLocale}>
            {children}
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
