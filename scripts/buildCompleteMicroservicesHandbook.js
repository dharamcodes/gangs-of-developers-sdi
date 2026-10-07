/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { generateSvgDiagram } = require('./microservicesSvgHelper');

const { MODULE_1_FOUNDATIONS } = require('./microservicesMod1');
const { MODULE_2_INGRESS } = require('./microservicesMod2');
const { MODULE_3_DATA } = require('./microservicesMod3');
const { MODULE_4_RESILIENCE } = require('./microservicesMod4');
const { MODULE_5_EVENTS } = require('./microservicesMod5');
const { MODULE_6_OPERATIONS } = require('./microservicesMod6');
require('./generateOAuthFlowDiagrams');

const rootDir = path.join(__dirname, '..');
const apiDir = path.join(rootDir, 'public', 'api', 'microservices');
const diagramsDir = path.join(rootDir, 'public', 'diagrams', 'microservices');
const dataDir = path.join(rootDir, 'data');

fs.mkdirSync(path.join(apiDir, 'topics'), { recursive: true });
fs.mkdirSync(diagramsDir, { recursive: true });
fs.mkdirSync(dataDir, { recursive: true });

const ALL_MODULES = [
  MODULE_1_FOUNDATIONS,
  MODULE_2_INGRESS,
  MODULE_3_DATA,
  MODULE_4_RESILIENCE,
  MODULE_5_EVENTS,
  MODULE_6_OPERATIONS
];

// Master UI Configuration
const UI_CONFIG = {
  badgeText: "GOD",
  brandTitle: "Gangs of Developers",
  brandSubtitle: "Microservices Architecture Handbook",
  tocHeading: "Microservices Curriculum",
  searchPlaceholder: "Search 33 microservices topics & patterns...",
  noResultsText: "No microservices patterns match your search.",
  expandAllTooltip: "Expand all topics",
  collapseAllTooltip: "Collapse all topics",
  lightModeTooltip: "Switch to Book Paper Mode",
  darkModeTooltip: "Switch to Dark Mode",
  keyTakeawaysHeading: "Key Takeaways",
  visualDiagramHeading: "Distributed Topology & Component Architecture",
  asciiDiagramTabLabel: "ASCII Architecture Blueprint",
  visualDiagramTabLabel: "Visual Diagram",
  tradeOffMatrixHeading: "Architectural Trade-Off Matrix",
  tradeOffHeaders: {
    option: "Architecture / Strategy",
    pros: "Key Advantages",
    cons: "Trade-Offs & Failure Modes",
    bestFor: "Production Recommendation"
  },
  interviewTipHeading: "GOD Microservices Interview Pro-Tip",
  previousLabel: "Previous",
  nextLabel: "Next",
  partPrefix: "Part",
  sectionPrefix: "Chapter",
  subtopicsBarSuffix: "Patterns",
  footerStatsTemplate: "6 Modules • 33 In-Depth Patterns & Concepts"
};

console.log("Starting Complete Microservices Handbook Build...");

let totalSubtopicsCount = 0;
const indexTopics = [];

ALL_MODULES.forEach((mod) => {
  const modSubtopicSummaries = mod.subtopics.map((sub) => ({
    id: sub.id,
    topicId: mod.id,
    topicTitle: mod.title,
    topicNumber: mod.topicNumber,
    subtopicNumber: sub.subtopicNumber,
    title: sub.title,
    subtitle: sub.subtitle,
    readingTime: sub.readingTime,
    difficulty: sub.difficulty,
    jsonUrl: `/api/microservices/subtopics/${mod.id}/${sub.id}.json`
  }));

  indexTopics.push({
    id: mod.id,
    topicNumber: mod.topicNumber,
    title: mod.title,
    description: mod.description,
    topicJsonUrl: `/api/microservices/topics/${mod.id}.json`,
    subtopics: modSubtopicSummaries
  });

  // Write Topic JSON
  const topicFullPayload = {
    id: mod.id,
    topicNumber: mod.topicNumber,
    title: mod.title,
    description: mod.description,
    jsonUrl: `/api/microservices/topics/${mod.id}.json`,
    subtopics: mod.subtopics.map((sub) => ({
      ...sub,
      topicId: mod.id,
      topicTitle: mod.title,
      topicNumber: mod.topicNumber,
      architectureDiagram: sub.ascii,
      diagramImageUrl: `/diagrams/microservices/${sub.id}-block.svg`,
      flowDiagramUrl: `/diagrams/microservices/${sub.id}-flow.svg`,
      sections: (sub.sections || []).map((sec, sIdx) => ({
        ...sec,
        diagramImageUrl: sec.diagramImageUrl || (sIdx === 0 ? `/diagrams/microservices/${sub.id}-block.svg` : undefined),
        flowDiagramUrl: sec.flowDiagramUrl || (sIdx === 0 ? `/diagrams/microservices/${sub.id}-flow.svg` : undefined)
      })),
      jsonUrl: `/api/microservices/subtopics/${mod.id}/${sub.id}.json`
    }))
  };
  fs.writeFileSync(path.join(apiDir, 'topics', `${mod.id}.json`), JSON.stringify(topicFullPayload, null, 2), 'utf-8');

  // Write Subtopic Files & Diagrams
  const subtopicsSubDir = path.join(apiDir, 'subtopics', mod.id);
  fs.mkdirSync(subtopicsSubDir, { recursive: true });

  mod.subtopics.forEach((sub) => {
    totalSubtopicsCount++;

    // Generate Block Diagram SVG
    const blockSvg = generateSvgDiagram(
      1000, 380,
      `${sub.title} Topology`,
      `Distributed Architecture Blueprint • ${mod.title}`,
      sub.accent || '#38bdf8',
      mod.title.split('. ')[1] || 'Microservices',
      sub.blockNodes || [],
      sub.blockConns || [],
      false
    );
    fs.writeFileSync(path.join(diagramsDir, `${sub.id}-block.svg`), blockSvg, 'utf-8');

    // Generate Flow Diagram SVG
    const flowSvg = generateSvgDiagram(
      1000, 380,
      `${sub.title} Execution Flow`,
      `Runtime Sequence & Lifecycle Pipeline • ${mod.title}`,
      sub.accent || '#10b981',
      'Runtime Flow',
      sub.flowNodes || [],
      sub.flowConns || [],
      true
    );
    fs.writeFileSync(path.join(diagramsDir, `${sub.id}-flow.svg`), flowSvg, 'utf-8');

    // Write Subtopic JSON file
    const subtopicDetail = {
      id: sub.id,
      topicId: mod.id,
      topicTitle: mod.title,
      topicNumber: mod.topicNumber,
      subtopicNumber: sub.subtopicNumber,
      title: sub.title,
      subtitle: sub.subtitle,
      readingTime: sub.readingTime,
      difficulty: sub.difficulty,
      keyTakeaways: sub.keyTakeaways,
      architectureDiagram: sub.ascii,
      diagramImageUrl: `/diagrams/microservices/${sub.id}-block.svg`,
      flowDiagramUrl: `/diagrams/microservices/${sub.id}-flow.svg`,
      sections: (sub.sections || []).map((sec, sIdx) => ({
        ...sec,
        diagramImageUrl: sec.diagramImageUrl || (sIdx === 0 ? `/diagrams/microservices/${sub.id}-block.svg` : undefined),
        flowDiagramUrl: sec.flowDiagramUrl || (sIdx === 0 ? `/diagrams/microservices/${sub.id}-flow.svg` : undefined)
      })),
      tradeOffs: sub.tradeOffs,
      interviewTip: sub.interviewTip,
      jsonUrl: `/api/microservices/subtopics/${mod.id}/${sub.id}.json`
    };

    fs.writeFileSync(path.join(subtopicsSubDir, `${sub.id}.json`), JSON.stringify(subtopicDetail, null, 2), 'utf-8');
  });
});

// Master Index JSON
const masterIndex = {
  ui: UI_CONFIG,
  topics: indexTopics
};
fs.writeFileSync(path.join(apiDir, 'index.json'), JSON.stringify(masterIndex, null, 2), 'utf-8');

// Also write consolidated JSON to data/
fs.writeFileSync(path.join(dataDir, 'microservicesHandbook.json'), JSON.stringify({
  ui: UI_CONFIG,
  topics: ALL_MODULES
}, null, 2), 'utf-8');

console.log(`\n============================================================`);
console.log(`SUCCESSFULLY GENERATED COMPLETE MICROSERVICES HANDBOOK:`);
console.log(`- Modules (Topics): ${ALL_MODULES.length}`);
console.log(`- In-Depth Subtopics: ${totalSubtopicsCount}`);
console.log(`- High-Quality Themed Block SVGs: ${totalSubtopicsCount}`);
console.log(`- High-Quality Themed Flow SVGs: ${totalSubtopicsCount}`);
console.log(`- Master Index: public/api/microservices/index.json`);
console.log(`- Backup Handbook: data/microservicesHandbook.json`);
console.log(`============================================================\n`);
