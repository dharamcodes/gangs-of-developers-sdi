import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gangsofdevelopers.com"),
  title: {
    default: "Gangs of Developers (GOD) — System Design, Microservices & Architecture Reference",
    template: "%s | Gangs of Developers",
  },
  description:
    "Authoritative engineering knowledge platform for software engineers and systems architects. In-depth system design blueprints, microservices patterns, GoF design patterns, and FAANG interview architectures.",
  keywords: [
    "system design",
    "system design interview",
    "distributed systems",
    "microservices architecture",
    "microservices design patterns",
    "GoF design patterns",
    "software architecture",
    "high level design",
    "low level design",
    "Java backend architecture",
    "Kafka architecture",
    "Gangs of Developers",
  ],
  authors: [{ name: "Dharmendra Awasthi (Dharam)", url: "https://www.gangsofdevelopers.com/author" }],
  creator: "Dharmendra Awasthi",
  publisher: "Gangs of Developers",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Gangs of Developers (GOD) — System Design, Microservices & Architecture Reference",
    description:
      "Deep architectural blueprints, 130+ system design topics, 33 microservices design patterns, 23 GoF patterns with Java & UML, and FAANG interview breakdowns.",
    url: "https://www.gangsofdevelopers.com",
    siteName: "Gangs of Developers (GOD)",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gangs of Developers (GOD) — System Design, Microservices & Architecture Reference",
    description:
      "Deep architectural blueprints, 130+ system design topics, 33 microservices design patterns, 23 GoF patterns with Java & UML, and FAANG interview breakdowns.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.gangsofdevelopers.com/#website",
      "url": "https://www.gangsofdevelopers.com",
      "name": "Gangs of Developers",
      "description":
        "Authoritative engineering knowledge platform for System Design, Microservices, Distributed Systems, GoF Design Patterns, and Backend Engineering.",
      "publisher": {
        "@id": "https://www.gangsofdevelopers.com/#organization",
      },
      "inLanguage": "en-US",
    },
    {
      "@type": "Organization",
      "@id": "https://www.gangsofdevelopers.com/#organization",
      "name": "Gangs of Developers",
      "url": "https://www.gangsofdevelopers.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.gangsofdevelopers.com/god_logo.png",
      },
      "sameAs": [
        "https://www.linkedin.com/company/gangsofdevelopers/",
        "https://github.com/dharamcodes",
        "https://www.linkedin.com/groups/40968099/",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteSchema),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var m = localStorage.getItem('god_handbook_theme_mode');
                if (!m) {
                  m = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                document.documentElement.setAttribute('data-theme', m);
                document.documentElement.style.colorScheme = m;
                document.documentElement.style.backgroundColor = m === 'dark' ? '#070b14' : '#f4f1ea';
              } catch(e){}
            })();`,
          }}
        />
      </head>
      <body>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
