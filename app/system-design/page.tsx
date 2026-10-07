import type { Metadata } from "next";
import HandbookReader from "../components/HandbookReader";
import { loadInitialSystemDesignData } from "../services/serverDataLoader";

export const metadata: Metadata = {
  title: "System Design Handbook & Architecture Blueprints",
  description: "Explore 130+ interactive system design topics: distributed consensus, consistent hashing, database sharding, caching tiers, and event streaming architectures.",
  alternates: {
    canonical: "https://www.gangsofdevelopers.com/system-design",
  },
  openGraph: {
    title: "System Design Handbook & Architectural Blueprints",
    description:
      "Interactive System Design Handbook covering 13 core modules, 130 subtopics, architectural topology blueprints, and trade-off matrices.",
    url: "https://www.gangsofdevelopers.com/system-design",
    siteName: "Gangs of Developers (GOD)",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://www.gangsofdevelopers.com/system-design#article",
      "headline": "System Design Handbook & Architectural Blueprints",
      "description":
        "Interactive System Design Handbook covering 13 core modules, 130 subtopics, architectural topology blueprints, trade-off matrices, and FAANG interview failure modes.",
      "url": "https://www.gangsofdevelopers.com/system-design",
      "author": {
        "@type": "Person",
        "name": "Dharmendra Awasthi",
        "url": "https://www.gangsofdevelopers.com/author",
      },
      "publisher": {
        "@type": "Organization",
        "name": "Gangs of Developers",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.gangsofdevelopers.com/god_logo.png",
        },
      },
      "about": [
        "System Design",
        "Distributed Systems",
        "Scalability",
        "High Availability",
        "Software Architecture",
      ],
      "inLanguage": "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.gangsofdevelopers.com/system-design#breadcrumb",
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
          "name": "System Design Handbook",
          "item": "https://www.gangsofdevelopers.com/system-design",
        },
      ],
    },
  ],
};

export default function SystemDesignPage() {
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
