import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gangs of Developers (GOD) - System Design Hand Book",
  description:
    "Interactive System Design Handbook by Gangs of Developers (GOD) covering scalability, distributed systems, and real-world architecture blueprints.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
}
