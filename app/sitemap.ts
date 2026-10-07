import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.gangsofdevelopers.com";
  const currentDate = new Date().toISOString().split("T")[0];

  const routes = [
    { url: `${baseUrl}`, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/system-design`, priority: 0.95, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/distributed-systems`, priority: 0.95, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/microservices`, priority: 0.95, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/microservices-design-patterns`, priority: 0.95, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/design-patterns`, priority: 0.95, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/gof-design-patterns`, priority: 0.95, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/design-patterns/uml-class-diagrams`, priority: 0.90, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/backend-engineering`, priority: 0.90, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/java`, priority: 0.90, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/spring-boot`, priority: 0.90, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/kafka`, priority: 0.90, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/company-wise-problems`, priority: 0.90, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/free-course`, priority: 0.85, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/author`, priority: 0.80, changeFrequency: "monthly" as const },
  ];

  return routes.map((r) => ({
    url: r.url,
    lastModified: currentDate,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
