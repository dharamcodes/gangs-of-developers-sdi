export interface SubtopicSection {
  heading: string;
  body: string;
  bullets?: string[];
  codeSnippet?: {
    title: string;
    code: string;
  };
}

export interface TradeOffRow {
  option: string;
  pros: string;
  cons: string;
  bestFor: string;
}

export interface Subtopic {
  id: string;
  topicId: string;
  topicTitle: string;
  topicNumber: number;
  subtopicNumber: string; // e.g., "1.1", "1.2"
  title: string;
  subtitle: string;
  readingTime: string;
  difficulty: "Foundational" | "Intermediate" | "Advanced" | "Staff+";
  keyTakeaways: string[];
  architectureDiagram: string;
  sections: SubtopicSection[];
  tradeOffs?: TradeOffRow[];
  interviewTip: string;
}

export interface TopicGroup {
  id: string;
  topicNumber: number;
  title: string;
  description: string;
  subtopics: Subtopic[];
}
