import type { Metadata } from "next";
import DesignPatternsReader from "../components/DesignPatternsReader";
import { loadInitialDesignPatternsData } from "../services/serverDataLoader";

export const metadata: Metadata = {
  title: "GoF Design Patterns Handbook & UML Class Diagrams",
  description: "Interactive GoF Design Patterns reference: all 23 Creational, Structural, and Behavioral patterns with modern Java code, UML diagrams, and trade-off matrices.",
  alternates: {
    canonical: "https://www.gangsofdevelopers.com/design-patterns",
  },
  openGraph: {
    title: "GoF Design Patterns Handbook & UML Class Diagrams",
    description:
      "Master all 23 Gang of Four design patterns with UML class diagrams, interaction sequence flows, production Java code, and architectural trade-off matrices.",
    url: "https://www.gangsofdevelopers.com/design-patterns",
    siteName: "Gangs of Developers (GOD)",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://www.gangsofdevelopers.com/design-patterns#article",
      "headline": "GoF Design Patterns Handbook & UML Class Diagrams",
      "description":
        "Interactive GoF Design Patterns reference covering all 23 Creational, Structural, and Behavioral patterns with UML class diagrams, sequence workflows, and modern Java 21 production implementations.",
      "url": "https://www.gangsofdevelopers.com/design-patterns",
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
        "GoF Design Patterns",
        "Gang of Four",
        "UML Class Diagrams",
        "Creational Patterns",
        "Structural Patterns",
        "Behavioral Patterns",
        "Java 21",
      ],
      "inLanguage": "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.gangsofdevelopers.com/design-patterns#breadcrumb",
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
          "name": "GoF Design Patterns Handbook",
          "item": "https://www.gangsofdevelopers.com/design-patterns",
        },
      ],
    },
  ],
};

export default function DesignPatternsPage() {
  const { initialIndex, initialSubtopic } = loadInitialDesignPatternsData();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DesignPatternsReader
        initialIndexData={initialIndex}
        initialSubtopicDetail={initialSubtopic}
      />
    </>
  );
}
