export interface SubtopicSection {
  heading: string;
  body: string;
  bullets?: string[];
  erDiagramUrl?: string;
  diagramImageUrl?: string;
  flowDiagramUrl?: string;
  asciiDiagram?: string;
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

export interface SubtopicSummary {
  id: string;
  topicId: string;
  topicTitle: string;
  topicNumber: number;
  subtopicNumber: string;
  title: string;
  subtitle: string;
  readingTime: string;
  difficulty: "Foundational" | "Intermediate" | "Advanced" | "Expert" | "Staff+";
  diagramImageUrl?: string;
  flowDiagramUrl?: string;
  jsonUrl: string;
}

export interface SubtopicDetail extends SubtopicSummary {
  keyTakeaways: string[];
  architectureDiagram: string;
  sections: SubtopicSection[];
  tradeOffs?: TradeOffRow[];
  interviewTip: string;
}

export interface TopicIndexItem {
  id: string;
  topicNumber: number;
  title: string;
  description: string;
  topicJsonUrl: string;
  subtopics: SubtopicSummary[];
}

export interface TopicFullPayload {
  id: string;
  topicNumber: number;
  title: string;
  description: string;
  jsonUrl: string;
  subtopics: SubtopicDetail[];
}

export interface HandbookUiConfig {
  badgeText: string;
  brandTitle: string;
  brandSubtitle: string;
  tocHeading: string;
  searchPlaceholder: string;
  noResultsText: string;
  expandAllTooltip: string;
  collapseAllTooltip: string;
  lightModeTooltip: string;
  darkModeTooltip: string;
  keyTakeawaysHeading: string;
  visualDiagramHeading: string;
  asciiDiagramTabLabel: string;
  visualDiagramTabLabel: string;
  tradeOffMatrixHeading: string;
  tradeOffHeaders: {
    option: string;
    pros: string;
    cons: string;
    bestFor: string;
  };
  interviewTipHeading: string;
  previousLabel: string;
  nextLabel: string;
  partPrefix: string;
  sectionPrefix: string;
  subtopicsBarSuffix: string;
  footerStatsTemplate: string;
}

export interface HandbookIndexResponse {
  ui: HandbookUiConfig;
  topics: TopicIndexItem[];
}
