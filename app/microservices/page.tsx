import type { Metadata } from "next";
import MicroservicesReader from "../components/MicroservicesReader";
import { loadInitialMicroservicesData } from "../services/serverDataLoader";

export const metadata: Metadata = {
  title: "Microservices Architecture & Distributed Patterns",
  description: "Comprehensive guide to microservices architecture: service discovery, API gateways, Saga orchestrations, event-driven choreographies, and CQRS patterns.",
  alternates: {
    canonical: "https://www.gangsofdevelopers.com/microservices",
  },
  openGraph: {
    title: "Microservices Architecture & Distributed Patterns Handbook",
    description:
      "Master microservices architecture, distributed transactions, resilience patterns, and event streaming with in-depth production blueprints and trade-off matrices.",
    url: "https://www.gangsofdevelopers.com/microservices",
    siteName: "Gangs of Developers (GOD)",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://www.gangsofdevelopers.com/microservices#article",
      "headline": "Microservices Architecture & Distributed Patterns Handbook",
      "description":
        "Comprehensive Microservices & Distributed Systems Reference covering API Gateways, Service Mesh, Sagas, Outbox, Event-Driven Architectures, Distributed Consistency, and Fault Tolerance.",
      "url": "https://www.gangsofdevelopers.com/microservices",
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
        "Microservices Architecture",
        "Distributed Systems Patterns",
        "Saga Pattern",
        "Transactional Outbox",
        "API Gateway",
        "Resilience4j",
      ],
      "inLanguage": "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.gangsofdevelopers.com/microservices#breadcrumb",
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
          "name": "Microservices Handbook",
          "item": "https://www.gangsofdevelopers.com/microservices",
        },
      ],
    },
  ],
};

export default function MicroservicesPage() {
  const { initialIndex, initialSubtopic } = loadInitialMicroservicesData();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MicroservicesReader
        initialIndexData={initialIndex}
        initialSubtopicDetail={initialSubtopic}
      />
    </>
  );
}
