import type { Metadata } from "next";
import HomePageView from "./components/HomePageView";

export const metadata: Metadata = {
  title: "Gangs of Developers (GOD) — System Design, Microservices & Architecture Reference",
  description:
    "The engineering authority for software engineers and systems architects. Deep architectural blueprints, 130+ system design topics, 32 microservices design patterns, 23 GoF patterns with Java & UML, and Tier-1 FAANG interview breakdowns.",
  alternates: {
    canonical: "https://www.gangsofdevelopers.com",
  },
  openGraph: {
    title: "Gangs of Developers (GOD) — System Design, Microservices & Architecture Reference",
    description:
      "Deep architectural blueprints, 130+ system design topics, 32 microservices design patterns, 23 GoF patterns with Java & UML, and Tier-1 FAANG interview breakdowns.",
    url: "https://www.gangsofdevelopers.com",
    siteName: "Gangs of Developers (GOD)",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gangs of Developers (GOD) — System Design, Microservices & Architecture Reference",
    description:
      "Deep architectural blueprints, 130+ system design topics, 32 microservices design patterns, 23 GoF patterns with Java & UML, and Tier-1 FAANG interview breakdowns.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.gangsofdevelopers.com/#website",
      "url": "https://www.gangsofdevelopers.com",
      "name": "Gangs of Developers (GOD)",
      "description":
        "Comprehensive engineering guide for software engineers and systems architects covering System Design, Microservices, and GoF Patterns.",
      "publisher": {
        "@type": "Person",
        "name": "Dharmendra Awasthi",
        "alternateName": "Dharam",
        "url": "https://www.gangsofdevelopers.com/author",
      },
    },
    {
      "@type": "EducationalOrganization",
      "@id": "https://www.gangsofdevelopers.com/#organization",
      "name": "Gangs of Developers",
      "url": "https://www.gangsofdevelopers.com",
      "logo": "https://www.gangsofdevelopers.com/icon.svg",
      "founder": {
        "@type": "Person",
        "name": "Dharmendra Awasthi",
        "jobTitle": "Distributed Systems Engineer & Architect",
      },
      "sameAs": [
        "https://www.linkedin.com/company/gangsofdevelopers/",
        "https://www.linkedin.com/in/dharamcodes/",
        "https://github.com/dharamcodes",
        "https://medium.com/@dharamcodes",
      ],
    },
    {
      "@type": "Course",
      "@id": "https://www.gangsofdevelopers.com/free-course#course",
      "name": "System Design & Distributed Systems Handbook",
      "description":
        "Comprehensive interactive handbook covering 13 modules, 130+ subtopics, distributed storage, caching tiers, event streaming, and FAANG architectural blueprints.",
      "provider": {
        "@id": "https://www.gangsofdevelopers.com/#organization",
      },
      "isAccessibleForFree": true,
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePageView />
    </>
  );
}
