/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { generateUmlDiagram } = require('./designPatternsSvgHelper');
const { CREATIONAL_PATTERNS } = require('./designPatternsMod1');
const { STRUCTURAL_PATTERNS } = require('./designPatternsMod2');
const { BEHAVIORAL_PATTERNS } = require('./designPatternsMod3');

const ALL_TOPICS = [
  CREATIONAL_PATTERNS,
  STRUCTURAL_PATTERNS,
  BEHAVIORAL_PATTERNS
];

const UI_CONFIG = {
  badgeText: "GOD",
  brandTitle: "Gangs of Developers",
  brandSubtitle: "GoF Design Patterns Handbook",
  tocHeading: "GoF 23 Patterns",
  searchPlaceholder: "Search 23 GoF design patterns...",
  noResultsText: "No design patterns match your search query.",
  expandAllTooltip: "Expand all categories",
  collapseAllTooltip: "Collapse all categories",
  lightModeTooltip: "Switch to Book Paper Mode",
  darkModeTooltip: "Switch to Dark Mode",
  keyTakeawaysHeading: "Key Takeaways",
  visualDiagramHeading: "UML Class Architecture & Structural Topology",
  asciiDiagramTabLabel: "ASCII UML Blueprint",
  visualDiagramTabLabel: "UML Class Diagram",
  tradeOffMatrixHeading: "Architectural Trade-Off Matrix",
  tradeOffHeaders: {
    option: "Pattern / Approach",
    pros: "Key Architectural Advantages",
    cons: "Trade-Offs & Complexity",
    bestFor: "Production Recommendation"
  },
  interviewTipHeading: "GOD Architecture Interview Pro-Tip",
  previousLabel: "Previous Pattern",
  nextLabel: "Next Pattern",
  partPrefix: "Category",
  sectionPrefix: "Pattern",
  subtopicsBarSuffix: "Patterns",
  footerStatsTemplate: "3 Canonical Categories • 23 Classic GoF Patterns"
};

// Target directories
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_API_DIR = path.join(ROOT_DIR, 'public', 'api', 'design-patterns');
const TOPICS_API_DIR = path.join(PUBLIC_API_DIR, 'topics');
const SUBTOPICS_API_DIR = path.join(PUBLIC_API_DIR, 'subtopics');
const DIAGRAMS_DIR = path.join(ROOT_DIR, 'public', 'diagrams', 'design-patterns');
const DATA_DIR = path.join(ROOT_DIR, 'data');

[PUBLIC_API_DIR, TOPICS_API_DIR, SUBTOPICS_API_DIR, DIAGRAMS_DIR, DATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

console.log("=== BUILDING GOF DESIGN PATTERNS HANDBOOK ===");

let totalSubtopicsCount = 0;
const indexTopics = [];

ALL_TOPICS.forEach((topic) => {
  const topicSubtopicsList = [];
  const fullSubtopicsList = [];
  const topicSubtopicsDir = path.join(SUBTOPICS_API_DIR, topic.id);
  if (!fs.existsSync(topicSubtopicsDir)) fs.mkdirSync(topicSubtopicsDir, { recursive: true });

  topic.subtopics.forEach((sub) => {
    totalSubtopicsCount++;

    // 1. Generate Block SVG (UML Class Diagram)
    const blockSvgPath = path.join(DIAGRAMS_DIR, `${sub.id}-block.svg`);
    const blockSvgContent = generateUmlDiagram(
      1000,
      500,
      `${sub.title} — UML Architecture`,
      sub.subtitle,
      sub.accent || '#38bdf8',
      'UML Class Architecture',
      sub.blockNodes || [],
      sub.blockConns || [],
      false
    );
    fs.writeFileSync(blockSvgPath, blockSvgContent, 'utf8');

    // 2. Generate Flow SVG (Sequence Flow Diagram)
    const flowSvgPath = path.join(DIAGRAMS_DIR, `${sub.id}-flow.svg`);
    const flowSvgContent = generateUmlDiagram(
      1000,
      400,
      `${sub.title} — Execution Pipeline`,
      'Step-by-step object interaction sequence and state dispatching',
      sub.accent || '#10b981',
      'Sequence Flow',
      sub.flowNodes || [],
      sub.flowConns || [],
      true
    );
    fs.writeFileSync(flowSvgPath, flowSvgContent, 'utf8');

    // 3. Assemble Subtopic JSON
    const subtopicDetail = {
      id: sub.id,
      topicId: topic.id,
      topicTitle: topic.title,
      topicNumber: topic.topicNumber,
      subtopicNumber: sub.subtopicNumber,
      title: sub.title,
      subtitle: sub.subtitle,
      readingTime: sub.readingTime,
      difficulty: sub.difficulty,
      keyTakeaways: sub.keyTakeaways,
      architectureDiagram: sub.ascii,
      diagramImageUrl: `/diagrams/design-patterns/${sub.id}-block.svg`,
      flowDiagramUrl: `/diagrams/design-patterns/${sub.id}-flow.svg`,
      sections: (sub.sections || []).map((sec, sIdx) => ({
        ...sec,
        diagramImageUrl: sIdx === 0 ? `/diagrams/design-patterns/${sub.id}-block.svg` : sec.diagramImageUrl,
        flowDiagramUrl: sIdx === 0 ? `/diagrams/design-patterns/${sub.id}-flow.svg` : sec.flowDiagramUrl
      })),
      tradeOffs: sub.tradeOffs,
      interviewTip: sub.interviewTip,
      jsonUrl: `/api/design-patterns/subtopics/${topic.id}/${sub.id}.json`
    };

    const subtopicJsonPath = path.join(topicSubtopicsDir, `${sub.id}.json`);
    fs.writeFileSync(subtopicJsonPath, JSON.stringify(subtopicDetail, null, 2), 'utf8');

    fullSubtopicsList.push(subtopicDetail);

    topicSubtopicsList.push({
      id: sub.id,
      topicId: topic.id,
      topicTitle: topic.title,
      topicNumber: topic.topicNumber,
      subtopicNumber: sub.subtopicNumber,
      title: sub.title,
      subtitle: sub.subtitle,
      readingTime: sub.readingTime,
      difficulty: sub.difficulty,
      jsonUrl: `/api/design-patterns/subtopics/${topic.id}/${sub.id}.json`
    });
  });

  // Topic master file
  const topicMaster = {
    id: topic.id,
    topicNumber: topic.topicNumber,
    title: topic.title,
    description: topic.description,
    subtopics: fullSubtopicsList
  };
  fs.writeFileSync(path.join(TOPICS_API_DIR, `${topic.id}.json`), JSON.stringify(topicMaster, null, 2), 'utf8');

  indexTopics.push({
    id: topic.id,
    topicNumber: topic.topicNumber,
    title: topic.title,
    description: topic.description,
    topicJsonUrl: `/api/design-patterns/topics/${topic.id}.json`,
    subtopics: topicSubtopicsList
  });
});

// Write index.json
const indexPayload = {
  ui: UI_CONFIG,
  topics: indexTopics
};
fs.writeFileSync(path.join(PUBLIC_API_DIR, 'index.json'), JSON.stringify(indexPayload, null, 2), 'utf8');

// Write data/designPatternsHandbook.json
fs.writeFileSync(path.join(DATA_DIR, 'designPatternsHandbook.json'), JSON.stringify(indexPayload, null, 2), 'utf8');

console.log(`Successfully generated GoF Design Patterns Handbook:`);
console.log(` - 3 Canonical Categories`);
console.log(` - ${totalSubtopicsCount} Design Patterns`);
console.log(` - ${totalSubtopicsCount * 2} Themed SVG Diagrams in public/diagrams/design-patterns/`);

// Validate SVGs with xmllint
console.log("Validating all generated SVGs with xmllint...");
try {
  execSync('for f in public/diagrams/design-patterns/*.svg; do /usr/bin/xmllint --noout "$f" || exit 1; done', { stdio: 'inherit' });
  console.log("All 46 SVGs passed xmllint validation with zero XML syntax errors!");
} catch (e) {
  console.error("xmllint error:", e.message);
  process.exit(1);
}
