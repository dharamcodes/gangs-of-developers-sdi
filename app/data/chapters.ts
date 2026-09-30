import { Subtopic, TopicGroup } from "./types";
import { PART_1_TOPICS } from "./part1";
import { PART_2_TOPICS } from "./part2";
import { PART_3_TOPICS } from "./part3";
import { PART_4_TOPICS } from "./part4";
import { PART_5_TOPICS } from "./part5";

export type { Subtopic, TopicGroup } from "./types";

export const ALL_TOPIC_GROUPS: TopicGroup[] = [
  ...PART_1_TOPICS,
  ...PART_2_TOPICS,
  ...PART_3_TOPICS,
  ...PART_4_TOPICS,
  ...PART_5_TOPICS,
];

export const ALL_SUBTOPICS: Subtopic[] = ALL_TOPIC_GROUPS.flatMap(
  (group) => group.subtopics
);
