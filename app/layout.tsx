import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gangs of Developers (GOD) - System Design Handbook",
  description:
    "Interactive System Design Handbook by Gangs of Developers (GOD) covering scalability, distributed systems, and real-world architecture blueprints.",
  icons: {
    icon: "/favicon.ico",
  },
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
