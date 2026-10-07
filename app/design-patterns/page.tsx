import type { Metadata } from "next";
import DesignPatternsReader from "../components/DesignPatternsReader";

export const metadata: Metadata = {
  title: "GoF Design Patterns Handbook & UML Class Diagrams | Gangs of Developers",
  description:
    "Interactive GoF Design Patterns reference covering all 23 Creational, Structural, and Behavioral patterns with UML class diagrams, sequence workflows, and modern Java 21 production implementations.",
  alternates: {
    canonical: "/design-patterns",
  },
  openGraph: {
    title: "GoF Design Patterns Handbook & UML Class Diagrams",
    description:
      "Master all 23 Gang of Four design patterns with UML class diagrams, interaction sequence flows, production Java code, and architectural trade-off matrices.",
    url: "/design-patterns",
    siteName: "Gangs of Developers (GOD)",
    type: "website",
  },
};

export default function DesignPatternsPage() {
  return <DesignPatternsReader />;
}
