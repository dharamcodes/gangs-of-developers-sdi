import type { Metadata } from "next";
import HandbookReader from "../components/HandbookReader";
import { loadInitialSystemDesignData } from "../services/serverDataLoader";

export const metadata: Metadata = {
  title: "Free System Design Course & Interactive Handbook",
  description: "Free interactive System Design Handbook covering 13 core modules, 130 subtopics, scalability, distributed storage, caching tiers, and architecture blueprints.",
  alternates: {
    canonical: "https://www.gangsofdevelopers.com/free-course",
  },
  openGraph: {
    title: "Free System Design Course & Interactive Handbook",
    description:
      "Interactive System Design Handbook covering 13 core modules, 130 subtopics, and battle-tested distributed architecture blueprints.",
    url: "https://www.gangsofdevelopers.com/free-course",
    siteName: "Gangs of Developers (GOD)",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Course",
      "@id": "https://www.gangsofdevelopers.com/free-course#course",
      "name": "Free System Design Course & Interactive Handbook",
      "description":
        "Free comprehensive curriculum covering distributed systems, latency vs throughput, CAP theorem, consistent hashing, caching strategies, and FAANG interview questions.",
      "url": "https://www.gangsofdevelopers.com/free-course",
      "provider": {
        "@type": "Organization",
        "name": "Gangs of Developers",
        "sameAs": "https://www.gangsofdevelopers.com",
      },
      "isAccessibleForFree": true,
      "inLanguage": "en-US",
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "online",
        "courseWorkload": "PT30H",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.gangsofdevelopers.com/free-course#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.gangsofdevelopers.com",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Free System Design Course",
          "item": "https://www.gangsofdevelopers.com/free-course",
        },
      ],
    },
  ],
};

export default function FreeCoursePage() {
  const { initialIndex, initialSubtopic } = loadInitialSystemDesignData();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HandbookReader
        initialIndexData={initialIndex}
        initialSubtopicDetail={initialSubtopic}
      />
    </>
  );
}
