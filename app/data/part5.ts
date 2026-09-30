import { TopicGroup } from "./types";
import { PART_5A_SUBTOPICS } from "./part5a";
import { PART_5B_SUBTOPICS } from "./part5b";
import { PART_5C_SUBTOPICS } from "./part5c";

export const PART_5_TOPICS: TopicGroup[] = [
  {
    id: "must-practice-designs",
    topicNumber: 13,
    title: "Must-Practice Designs",
    description:
      "End-to-end production system design blueprints following the 7-step GOD framework: 1. Requirement Gathering, 2. Scale Assumption, 3. QPS/Memory/5-Year Storage Estimation, 4. Java APIs & Entities + ER Diagram, 5. High-Level Box Diagram, 6. Deep Dive Flows 1 & 2, and 7. Further Improvements.",
    subtopics: [
      ...PART_5A_SUBTOPICS,
      ...PART_5B_SUBTOPICS,
      ...PART_5C_SUBTOPICS,
    ],
  },
];
