import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAANG System Design Problems & Solutions",
  description: "Curated real-world system design interview problems asked at Google, Amazon, Meta, Netflix, Uber, and Apple with comprehensive architectural solutions.",
  alternates: {
    canonical: "https://www.gangsofdevelopers.com/company-wise-problems",
  },
  openGraph: {
    title: "FAANG System Design Interview Problems & Architecture Solutions",
    description:
      "Curated collection of real-world system design interview problems asked at top tech companies with architectural blueprints and failure mode analyses.",
    url: "https://www.gangsofdevelopers.com/company-wise-problems",
    siteName: "Gangs of Developers (GOD)",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAANG System Design Interview Problems & Architecture Solutions",
    description:
      "Curated collection of real-world system design interview problems asked at top tech companies with architectural blueprints.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://www.gangsofdevelopers.com/company-wise-problems#collection",
      "name": "FAANG System Design Interview Problems & Architecture Solutions",
      "description":
        "Curated collection of real-world system design interview problems asked at Google, Meta, Amazon, Netflix, Uber, and Apple.",
      "url": "https://www.gangsofdevelopers.com/company-wise-problems",
      "publisher": {
        "@type": "Organization",
        "name": "Gangs of Developers",
        "url": "https://www.gangsofdevelopers.com",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.gangsofdevelopers.com/company-wise-problems#breadcrumb",
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
          "name": "FAANG System Design Problems",
          "item": "https://www.gangsofdevelopers.com/company-wise-problems",
        },
      ],
    },
  ],
};

export default function CompanyProblemsLayout({
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
