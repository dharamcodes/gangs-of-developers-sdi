import type {
  HandbookIndexResponse,
  SubtopicDetail,
  TopicFullPayload,
} from "../types/handbook";

let indexCache: HandbookIndexResponse | null = null;
const topicCache = new Map<string, TopicFullPayload>();
const subtopicCache = new Map<string, SubtopicDetail>();

export async function fetchHandbookIndex(): Promise<HandbookIndexResponse> {
  if (indexCache) {
    return indexCache;
  }
  const res = await fetch("/api/index.json");
  if (!res.ok) {
    throw new Error(`Failed to load /api/index.json: ${res.status}`);
  }
  const data = (await res.json()) as HandbookIndexResponse;
  indexCache = data;
  return data;
}

export async function fetchTopicData(
  topicId: string
): Promise<TopicFullPayload> {
  const cached = topicCache.get(topicId);
  if (cached) {
    return cached;
  }
  const res = await fetch(`/api/topics/${topicId}.json`);
  if (!res.ok) {
    throw new Error(`Failed to load /api/topics/${topicId}.json: ${res.status}`);
  }
  const data = (await res.json()) as TopicFullPayload;
  topicCache.set(topicId, data);
  for (const sub of data.subtopics) {
    if (sub && Array.isArray((sub as SubtopicDetail).sections) && (sub as SubtopicDetail).sections.length > 0) {
      subtopicCache.set(`${topicId}/${sub.id}`, sub as SubtopicDetail);
    }
  }
  return data;
}

export async function fetchSubtopicData(
  topicId: string,
  subtopicId: string
): Promise<SubtopicDetail> {
  const cacheKey = `${topicId}/${subtopicId}`;
  const cached = subtopicCache.get(cacheKey);
  if (cached && Array.isArray(cached.sections) && cached.sections.length > 0) {
    return cached;
  }
  const res = await fetch(`/api/subtopics/${topicId}/${subtopicId}.json`);
  if (!res.ok) {
    throw new Error(
      `Failed to load /api/subtopics/${topicId}/${subtopicId}.json: ${res.status}`
    );
  }
  const data = (await res.json()) as SubtopicDetail;
  subtopicCache.set(cacheKey, data);
  return data;
}

// Microservices API Cache & Accessors
let msIndexCache: HandbookIndexResponse | null = null;
const msTopicCache = new Map<string, TopicFullPayload>();
const msSubtopicCache = new Map<string, SubtopicDetail>();

export async function fetchMicroservicesIndex(): Promise<HandbookIndexResponse> {
  if (msIndexCache) {
    return msIndexCache;
  }
  const res = await fetch("/api/microservices/index.json");
  if (!res.ok) {
    throw new Error(`Failed to load /api/microservices/index.json: ${res.status}`);
  }
  const data = (await res.json()) as HandbookIndexResponse;
  msIndexCache = data;
  return data;
}

export async function fetchMicroservicesTopicData(
  topicId: string
): Promise<TopicFullPayload> {
  const cached = msTopicCache.get(topicId);
  if (cached) {
    return cached;
  }
  const res = await fetch(`/api/microservices/topics/${topicId}.json`);
  if (!res.ok) {
    throw new Error(`Failed to load /api/microservices/topics/${topicId}.json: ${res.status}`);
  }
  const data = (await res.json()) as TopicFullPayload;
  msTopicCache.set(topicId, data);
  for (const sub of data.subtopics) {
    if (sub && Array.isArray((sub as SubtopicDetail).sections) && (sub as SubtopicDetail).sections.length > 0) {
      msSubtopicCache.set(`${topicId}/${sub.id}`, sub as SubtopicDetail);
    }
  }
  return data;
}

export async function fetchMicroservicesSubtopicData(
  topicId: string,
  subtopicId: string
): Promise<SubtopicDetail> {
  const cacheKey = `${topicId}/${subtopicId}`;
  const cached = msSubtopicCache.get(cacheKey);
  if (cached && Array.isArray(cached.sections) && cached.sections.length > 0) {
    return cached;
  }
  const res = await fetch(`/api/microservices/subtopics/${topicId}/${subtopicId}.json`);
  if (!res.ok) {
    throw new Error(
      `Failed to load /api/microservices/subtopics/${topicId}/${subtopicId}.json: ${res.status}`
    );
  }
  const data = (await res.json()) as SubtopicDetail;
  msSubtopicCache.set(cacheKey, data);
  return data;
}

// GoF Design Patterns API Cache & Accessors
let dpIndexCache: HandbookIndexResponse | null = null;
const dpTopicCache = new Map<string, TopicFullPayload>();
const dpSubtopicCache = new Map<string, SubtopicDetail>();

export async function fetchDesignPatternsIndex(): Promise<HandbookIndexResponse> {
  if (dpIndexCache) {
    return dpIndexCache;
  }
  const res = await fetch("/api/design-patterns/index.json");
  if (!res.ok) {
    throw new Error(`Failed to load /api/design-patterns/index.json: ${res.status}`);
  }
  const data = (await res.json()) as HandbookIndexResponse;
  dpIndexCache = data;
  return data;
}

export async function fetchDesignPatternsTopicData(
  topicId: string
): Promise<TopicFullPayload> {
  const cached = dpTopicCache.get(topicId);
  if (cached) {
    return cached;
  }
  const res = await fetch(`/api/design-patterns/topics/${topicId}.json`);
  if (!res.ok) {
    throw new Error(`Failed to load /api/design-patterns/topics/${topicId}.json: ${res.status}`);
  }
  const data = (await res.json()) as TopicFullPayload;
  dpTopicCache.set(topicId, data);
  for (const sub of data.subtopics) {
    if (sub && Array.isArray((sub as SubtopicDetail).sections) && (sub as SubtopicDetail).sections.length > 0) {
      dpSubtopicCache.set(`${topicId}/${sub.id}`, sub as SubtopicDetail);
    }
  }
  return data;
}

export async function fetchDesignPatternsSubtopicData(
  topicId: string,
  subtopicId: string
): Promise<SubtopicDetail> {
  const cacheKey = `${topicId}/${subtopicId}`;
  const cached = dpSubtopicCache.get(cacheKey);
  if (cached && Array.isArray(cached.sections) && cached.sections.length > 0) {
    return cached;
  }
  const res = await fetch(`/api/design-patterns/subtopics/${topicId}/${subtopicId}.json`);
  if (!res.ok) {
    throw new Error(
      `Failed to load /api/design-patterns/subtopics/${topicId}/${subtopicId}.json: ${res.status}`
    );
  }
  const data = (await res.json()) as SubtopicDetail;
  dpSubtopicCache.set(cacheKey, data);
  return data;
}

