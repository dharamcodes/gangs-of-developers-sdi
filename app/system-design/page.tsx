import type { Metadata } from "next";
import HandbookReader from "../components/HandbookReader";

export const metadata: Metadata = {
  title: "System Design Handbook & Architectural Blueprints | Gangs of Developers",
  description:
    "Interactive System Design Handbook by Gangs of Developers (GOD) covering 13 topics and 130 subtopics with visual architecture diagrams and trade-off matrices.",
  alternates: {
    canonical: "/system-design",
  },
};

export default function SystemDesignPage() {
  return <HandbookReader />;
}
