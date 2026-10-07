import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dharmendra Awasthi - Distributed Systems Architect",
  description: "Dharmendra Awasthi is a distributed systems engineer and software architect specializing in high-throughput backend infrastructure and event-driven systems.",
  alternates: {
    canonical: "https://www.gangsofdevelopers.com/author",
  },
  openGraph: {
    title: "Dharmendra Awasthi (Dharam) - Distributed Systems Engineer & Architect",
    description:
      "Distributed systems engineer, software architect, and founder of Gangs of Developers (GOD).",
    url: "https://www.gangsofdevelopers.com/author",
    siteName: "Gangs of Developers (GOD)",
    type: "profile",
  },
  twitter: {
    card: "summary",
    title: "Dharmendra Awasthi (Dharam) - Distributed Systems Engineer & Architect",
    description:
      "Distributed systems engineer, software architect, and founder of Gangs of Developers (GOD).",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": "https://www.gangsofdevelopers.com/author#profile",
      "name": "Dharmendra Awasthi (Dharam) - Profile",
      "url": "https://www.gangsofdevelopers.com/author",
      "mainEntity": {
        "@type": "Person",
        "@id": "https://www.gangsofdevelopers.com/author#person",
        "name": "Dharmendra Awasthi",
        "alternateName": "Dharam",
        "jobTitle": "Distributed Systems Engineer & Architect",
        "description":
          "Distributed systems engineer, software architect, and founder of Gangs of Developers (GOD), specializing in distributed data tiers, high-throughput microservices, and design patterns.",
        "image": "https://www.gangsofdevelopers.com/author.jpg",
        "sameAs": [
          "https://www.linkedin.com/in/dharamcodes/",
          "https://github.com/dharamcodes",
          "https://medium.com/@dharamcodes",
          "https://www.linkedin.com/company/gangsofdevelopers/",
        ],
        "knowsAbout": [
          "Distributed Systems",
          "Software Architecture",
          "Microservices",
          "GoF Design Patterns",
          "Java 21",
          "Spring Boot",
          "Apache Kafka",
          "System Design Interviews",
        ],
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.gangsofdevelopers.com/author#breadcrumb",
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
          "name": "Author Profile",
          "item": "https://www.gangsofdevelopers.com/author",
        },
      ],
    },
  ],
};

export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
