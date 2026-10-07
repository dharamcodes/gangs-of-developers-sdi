import fs from "fs";
import path from "path";
import type { HandbookIndexResponse, SubtopicDetail } from "../types/handbook";

/**
 * Server-only data loaders for pre-rendering full HTML content during Next.js static build.
 * Bakes primary chapters into static HTML so search engine crawlers and LLMs discover complete
 * text, diagrams, code blocks, trade-off matrices, and interview guides instead of loading spinners.
 */

export function loadInitialSystemDesignData(): {
  initialIndex: HandbookIndexResponse;
  initialSubtopic: SubtopicDetail;
} {
  const rootDir = process.cwd();
  const indexPath = path.join(rootDir, "public", "api", "index.json");
  const subtopicPath = path.join(
    rootDir,
    "public",
    "api",
    "subtopics",
    "core-fundamentals",
    "latency-vs-throughput.json"
  );

  const initialIndex = JSON.parse(
    fs.readFileSync(indexPath, "utf8")
  ) as HandbookIndexResponse;

  const initialSubtopic = JSON.parse(
    fs.readFileSync(subtopicPath, "utf8")
  ) as SubtopicDetail;

  return { initialIndex, initialSubtopic };
}

export function loadInitialMicroservicesData(): {
  initialIndex: HandbookIndexResponse;
  initialSubtopic: SubtopicDetail;
} {
  const rootDir = process.cwd();
  const indexPath = path.join(rootDir, "public", "api", "microservices", "index.json");
  const subtopicPath = path.join(
    rootDir,
    "public",
    "api",
    "microservices",
    "subtopics",
    "foundations-boundaries",
    "monolith-vs-microservices.json"
  );

  const initialIndex = JSON.parse(
    fs.readFileSync(indexPath, "utf8")
  ) as HandbookIndexResponse;

  const initialSubtopic = JSON.parse(
    fs.readFileSync(subtopicPath, "utf8")
  ) as SubtopicDetail;

  return { initialIndex, initialSubtopic };
}

export function loadInitialDesignPatternsData(): {
  initialIndex: HandbookIndexResponse;
  initialSubtopic: SubtopicDetail;
} {
  const rootDir = process.cwd();
  const indexPath = path.join(rootDir, "public", "api", "design-patterns", "index.json");
  const subtopicPath = path.join(
    rootDir,
    "public",
    "api",
    "design-patterns",
    "subtopics",
    "creational-patterns",
    "singleton.json"
  );

  const initialIndex = JSON.parse(
    fs.readFileSync(indexPath, "utf8")
  ) as HandbookIndexResponse;

  const initialSubtopic = JSON.parse(
    fs.readFileSync(subtopicPath, "utf8")
  ) as SubtopicDetail;

  return { initialIndex, initialSubtopic };
}
