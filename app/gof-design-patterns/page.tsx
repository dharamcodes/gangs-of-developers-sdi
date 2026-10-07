import type { Metadata } from "next";
import DesignPatternsReader from "../components/DesignPatternsReader";

export const metadata: Metadata = {
  title: "GoF Design Patterns | Gangs of Developers",
  description:
    "Master all 23 classic Gang of Four design patterns with UML diagrams and Java 21 examples.",
  alternates: {
    canonical: "/design-patterns",
  },
};

export default function GofDesignPatternsPage() {
  return <DesignPatternsReader />;
}
