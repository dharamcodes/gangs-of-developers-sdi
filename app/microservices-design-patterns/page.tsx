import type { Metadata } from "next";
import MicroservicesReader from "../components/MicroservicesReader";

export const metadata: Metadata = {
  title: "Microservices Design Patterns | Gangs of Developers",
  description:
    "Comprehensive Microservices Design Patterns reference: Sagas, CQRS, Outbox, API Gateway, Circuit Breaker, and Distributed Resilience.",
  alternates: {
    canonical: "/microservices",
  },
};

export default function MicroservicesDesignPatternsPage() {
  return <MicroservicesReader />;
}
