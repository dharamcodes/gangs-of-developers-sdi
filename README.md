# Gangs of Developers (GOD) - System Design Handbook

An interactive, high-performance web handbook covering scalable system design, distributed architectures, high-availability cloud patterns, messaging, observability, and real-world system designs.

## Highlights

- **13 Core Topics & 130 Detailed Subtopics**: Covers Core Fundamentals, Database Internals, Distributed Systems, High Availability & Cloud, Messaging & Kafka, Microservices, Networking, Observability, Reliability Engineering, Staff-Level Architecture Trade-Offs, and Must-Practice System Designs.
- **Architectural Diagrams**: Complete visual system diagrams and detailed Entity-Relationship (ER) storage blueprints with full-screen zoom support.
- **Static Export Architecture**: Ultra-fast client-side reading experience backed by pre-generated static JSON endpoints in `public/api/`.
- **Reader Experience**:
  - Dark / Light mode switching
  - Dynamic typography scaling (Normal, Large, Extra Large)
  - Full-width reading mode
  - Collapsible curriculum sidebar and instant search
  - Code snippets and ASCII blueprint copy tools

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Static Export)
- **UI & Components**: [Material-UI (MUI)](https://mui.com/) & [Emotion](https://emotion.sh/)
- **Language**: TypeScript 5
- **Analytics**: [@vercel/analytics](https://vercel.com/analytics)

## Getting Started

### Prerequisites

- Node.js 18+ (Node.js 20+ recommended)
- npm, yarn, or pnpm

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
npm run build
```

This compiles TypeScript, optimizes pages, and generates a production-ready static export into the `out/` directory.

### Linting & Type Checking

```bash
npm run lint
npx tsc --noEmit
```

## Directory Structure

```text
├── app/
│   ├── components/      # UI components (Reader, Sidebar, Header, Diagrams, etc.)
│   ├── services/        # API and data loading services
│   ├── types/           # TypeScript data models and interfaces
│   ├── globals.css      # Core reset & custom scrollbar styles
│   ├── layout.tsx       # Root layout & providers
│   └── page.tsx         # Root handbook page
├── public/
│   ├── api/             # Static JSON curriculum index, topics, and subtopics
│   ├── diagrams/        # Architecture diagrams and ER SVGs
│   └── favicon.ico      # Site favicon
└── next.config.ts       # Next.js configuration (static export)
```
