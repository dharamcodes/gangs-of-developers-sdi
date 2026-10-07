import type { Metadata } from "next";
import HandbookReader from "../components/HandbookReader";

export const metadata: Metadata = {
  title: "Free System Design Course & Interactive Handbook | Gangs of Developers",
  description:
    "Free, interactive System Design Handbook covering scalability, high availability, distributed storage, caching tiers, messaging, and real-world system architecture blueprints.",
  alternates: {
    canonical: "/free-course",
  },
  openGraph: {
    title: "Free System Design Course & Interactive Handbook",
    description:
      "Interactive System Design Handbook covering 13 core modules, 130 subtopics, and battle-tested distributed architecture blueprints.",
    url: "/free-course",
    siteName: "Gangs of Developers (GOD)",
    type: "website",
  },
};

export default function FreeCoursePage() {
  return <HandbookReader />;
}
