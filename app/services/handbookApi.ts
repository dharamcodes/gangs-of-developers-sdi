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
    subtopicCache.set(sub.id, sub);
  }
  return data;
}

export async function fetchSubtopicData(
  topicId: string,
  subtopicId: string
): Promise<SubtopicDetail> {
  const cached = subtopicCache.get(subtopicId);
  if (cached) {
    return cached;
  }
  const res = await fetch(`/api/subtopics/${topicId}/${subtopicId}.json`);
  if (!res.ok) {
    throw new Error(
      `Failed to load /api/subtopics/${topicId}/${subtopicId}.json: ${res.status}`
    );
  }
  const data = (await res.json()) as SubtopicDetail;
  subtopicCache.set(subtopicId, data);
  return data;
}
