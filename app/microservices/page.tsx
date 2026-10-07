import type { Metadata } from "next";
import MicroservicesReader from "../components/MicroservicesReader";

export const metadata: Metadata = {
  title: "Microservices Architecture & Distributed Patterns Handbook | Gangs of Developers",
  description:
    "Comprehensive Microservices & Distributed Systems Reference covering API Gateways, Service Mesh, Sagas, Outbox, Event-Driven Architectures, Distributed Consistency, and Fault Tolerance.",
  alternates: {
    canonical: "/microservices",
  },
  openGraph: {
    title: "Microservices Architecture & Distributed Patterns Handbook",
    description:
      "Master microservices architecture, distributed transactions, resilience patterns, and event streaming with in-depth production blueprints and trade-off matrices.",
    url: "/microservices",
    siteName: "Gangs of Developers (GOD)",
    type: "website",
  },
};

export default function MicroservicesPage() {
  return <MicroservicesReader />;
}
