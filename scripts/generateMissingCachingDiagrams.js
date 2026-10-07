/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const DIAGRAMS_DIR = path.join(__dirname, '..', 'public', 'diagrams');

function createSvgHeader(title, subtitle) {
  const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeSubtitle = subtitle.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 360" width="1000" height="360">
  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.1" fill="#cbd5e1" />
    </pattern>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c084fc" />
      <stop offset="100%" stop-color="#7e22ce" />
    </linearGradient>
    <linearGradient id="darkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#475569" />
    </marker>
    <marker id="arrowAmber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
    </marker>
    <marker id="arrowBlue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
    </marker>
    <marker id="arrowGreen" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
    </marker>
    <marker id="arrowRed" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#dc2626" />
    </marker>
  </defs>

  <rect width="1000" height="360" fill="#ffffff" />
  <rect width="1000" height="360" fill="url(#grid)" />

  <!-- Header Banner -->
  <rect x="0" y="0" width="1000" height="68" fill="#0f172a" />
  <rect x="0" y="66" width="1000" height="3" fill="url(#primaryGrad)" />
  <text x="36" y="32" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="16" font-weight="800" fill="#ffffff" letter-spacing="-0.01em">${safeTitle}</text>
  <text x="36" y="52" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="500" fill="#94a3b8">${safeSubtitle}</text>

  <g id="diagram-canvas">`;
}

function createSvgFooter() {
  return `  </g>
</svg>`;
}

// 1. arch-cache-hot-keys.svg
const hotKeysSvg = createSvgHeader(
  "HOT KEY MITIGATION & TIERED CACHE ARCHITECTURE",
  "L1 Local In-Process Memory Cache • Key Sharding with Random Salt • Read Replicas & Early Warmup"
) + `
    <!-- Client Cluster -->
    <rect x="40" y="130" width="150" height="130" rx="8" fill="url(#darkGrad)" stroke="#334155" stroke-width="2" />
    <text x="115" y="170" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="800" fill="#ffffff">App Pod 1..N</text>
    <rect x="55" y="190" width="120" height="50" rx="6" fill="#1e293b" stroke="#38bdf8" />
    <text x="115" y="210" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#38bdf8">L1 Local Cache</text>
    <text x="115" y="226" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#94a3b8">Caffeine / Guava (1-5s)</text>

    <!-- Hot Key Sharding Node -->
    <rect x="300" y="105" width="220" height="85" rx="8" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" />
    <text x="410" y="135" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="800" fill="#92400e">Sharded Key Suffixes</text>
    <text x="410" y="155" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#b45309">key:item_42#rnd(1..10)</text>
    <text x="410" y="172" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#78350f">Distributes QPS across cluster</text>

    <!-- Central Distributed Cache Tier -->
    <rect x="300" y="215" width="220" height="85" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" />
    <text x="410" y="245" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="800" fill="#075985">Redis Cluster Shards</text>
    <text x="410" y="265" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#0369a1">Shard 1 • Shard 2 • Shard 3</text>
    <text x="410" y="282" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#0c4a6e">Dedicated Read Replicas</text>

    <!-- Connectors -->
    <line x1="190" y1="160" x2="295" y2="145" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrowAmber)" />
    <text x="240" y="145" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700" fill="#b45309">1. L1 Miss</text>

    <line x1="190" y1="210" x2="295" y2="245" stroke="#0284c7" stroke-width="2" marker-end="url(#arrowBlue)" />
    <text x="240" y="235" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700" fill="#0284c7">2. Query L2</text>

    <!-- Right Side Rule Card -->
    <rect x="580" y="100" width="380" height="205" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
    <text x="600" y="128" font-family="sans-serif" font-size="12" font-weight="800" fill="#0f172a">PRODUCTION HOT KEY MITIGATION RULES</text>
    <rect x="600" y="142" width="340" height="42" rx="6" fill="#f0fdf4" stroke="#86efac" />
    <text x="610" y="159" font-family="sans-serif" font-size="10" font-weight="700" fill="#166534">Rule 1: L1 In-Memory Caching</text>
    <text x="610" y="174" font-family="sans-serif" font-size="9" fill="#15803d">Saves network hop; absorbs 90%+ QPS on viral celebrity keys</text>

    <rect x="600" y="192" width="340" height="42" rx="6" fill="#eff6ff" stroke="#93c5fd" />
    <text x="610" y="209" font-family="sans-serif" font-size="10" font-weight="700" fill="#1e40af">Rule 2: Random Key Suffix Splitting</text>
    <text x="610" y="224" font-family="sans-serif" font-size="9" fill="#1d4ed8">Replicates key to key_1..N; client picks random shard</text>

    <rect x="600" y="242" width="340" height="42" rx="6" fill="#fef2f2" stroke="#fca5a5" />
    <text x="610" y="259" font-family="sans-serif" font-size="10" font-weight="700" fill="#991b1b">Rule 3: Asynchronous Proactive Refresh</text>
    <text x="610" y="274" font-family="sans-serif" font-size="9" fill="#b91c1c">Background cron refreshes TTL before key expires</text>
` + createSvgFooter();

// 2. arch-cache-invalidation.svg
const invalidationSvg = createSvgHeader(
  "CACHE INVALIDATION PATTERNS & CONSISTENCY LIFECYCLE",
  "Write-Through • Write-Around • Invalidate on Write • Event-Driven CDC via Debezium & Kafka"
) + `
    <rect x="40" y="130" width="160" height="120" rx="8" fill="url(#darkGrad)" stroke="#334155" stroke-width="2" />
    <text x="120" y="180" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="800" fill="#ffffff">API Service</text>
    <text x="120" y="200" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#94a3b8">Receives Mutation</text>

    <rect x="290" y="105" width="200" height="85" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" />
    <text x="390" y="135" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="800" fill="#075985">Relational DB (ACID)</text>
    <text x="390" y="155" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#0369a1">Primary Source of Truth</text>
    <text x="390" y="172" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#0c4a6e">Write Committed to WAL</text>

    <rect x="290" y="215" width="200" height="85" rx="8" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" />
    <text x="390" y="245" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="800" fill="#92400e">Redis Cache Cluster</text>
    <text x="390" y="265" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#b45309">DEL key / Eviction</text>
    <text x="390" y="282" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#78350f">Prevents Stale Reads</text>

    <!-- Connectors -->
    <line x1="200" y1="165" x2="285" y2="145" stroke="#0284c7" stroke-width="2" marker-end="url(#arrowBlue)" />
    <text x="245" y="145" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700" fill="#0284c7">1. UPDATE</text>

    <line x1="200" y1="205" x2="285" y2="245" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrowAmber)" />
    <text x="245" y="235" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700" fill="#b45309">2. DEL (Clear)</text>

    <!-- Right Side Comparison -->
    <rect x="540" y="100" width="420" height="205" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
    <text x="560" y="128" font-family="sans-serif" font-size="12" font-weight="800" fill="#0f172a">INVALIDATION STRATEGY COMPARISON</text>
    
    <rect x="560" y="142" width="380" height="42" rx="6" fill="#f0fdf4" stroke="#86efac" />
    <text x="570" y="159" font-family="sans-serif" font-size="10" font-weight="700" fill="#166534">Delete on Write (Recommended)</text>
    <text x="570" y="174" font-family="sans-serif" font-size="9" fill="#15803d">Simple &amp; safe; avoids race conditions between concurrent updates</text>

    <rect x="560" y="192" width="380" height="42" rx="6" fill="#fef2f2" stroke="#fca5a5" />
    <text x="570" y="209" font-family="sans-serif" font-size="10" font-weight="700" fill="#991b1b">Update on Write (Anti-Pattern)</text>
    <text x="570" y="224" font-family="sans-serif" font-size="9" fill="#b91c1c">Vulnerable to race conditions: Thread A overwrites Thread B's update</text>

    <rect x="560" y="242" width="380" height="42" rx="6" fill="#eff6ff" stroke="#93c5fd" />
    <text x="570" y="259" font-family="sans-serif" font-size="10" font-weight="700" fill="#1e40af">CDC via Debezium + Kafka</text>
    <text x="570" y="274" font-family="sans-serif" font-size="9" fill="#1d4ed8">Asynchronous stream invalidates cache from database binlog events</text>
` + createSvgFooter();

// 3. arch-cache-lru.svg
const lruSvg = createSvgHeader(
  "LRU (LEAST RECENTLY USED) EVICTION ARCHITECTURE",
  "O(1) Hash Map + Doubly Linked List Structure • Head (Most Recent) to Tail (Eviction Candidate)"
) + `
    <!-- HashMap -->
    <rect x="50" y="115" width="240" height="180" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" />
    <text x="170" y="145" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="800" fill="#075985">Hash Map (O(1) Lookup)</text>
    <rect x="70" y="165" width="200" height="32" rx="4" fill="#ffffff" stroke="#93c5fd" />
    <text x="80" y="185" font-family="sans-serif" font-size="10" font-weight="700" fill="#0369a1">"user_1"  -&gt;  [NodePtr 1]</text>
    <rect x="70" y="205" width="200" height="32" rx="4" fill="#ffffff" stroke="#93c5fd" />
    <text x="80" y="225" font-family="sans-serif" font-size="10" font-weight="700" fill="#0369a1">"user_2"  -&gt;  [NodePtr 2]</text>
    <rect x="70" y="245" width="200" height="32" rx="4" fill="#ffffff" stroke="#93c5fd" />
    <text x="80" y="265" font-family="sans-serif" font-size="10" font-weight="700" fill="#0369a1">"user_3"  -&gt;  [NodePtr 3]</text>

    <!-- Doubly Linked List Chain -->
    <rect x="360" y="120" width="130" height="80" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2" />
    <text x="425" y="148" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="800" fill="#166534">HEAD (MRU)</text>
    <text x="425" y="168" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#15803d">Most Recently Used</text>
    <text x="425" y="185" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#14532d">user_1 : profile</text>

    <line x1="490" y1="160" x2="550" y2="160" stroke="#16a34a" stroke-width="2" marker-end="url(#arrowGreen)" />

    <rect x="555" y="120" width="130" height="80" rx="8" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" />
    <text x="620" y="148" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="800" fill="#92400e">NODE</text>
    <text x="620" y="168" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#b45309">Middle Recency</text>
    <text x="620" y="185" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#78350f">user_2 : profile</text>

    <line x1="685" y1="160" x2="745" y2="160" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrowAmber)" />

    <rect x="750" y="120" width="130" height="80" rx="8" fill="#fee2e2" stroke="#dc2626" stroke-width="2" />
    <text x="815" y="148" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="800" fill="#991b1b">TAIL (LRU)</text>
    <text x="815" y="168" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#b91c1c">Least Recently Used</text>
    <text x="815" y="185" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#7f1d1d">EVICT FIRST ON FULL</text>

    <!-- Operation Bottom Bar -->
    <rect x="360" y="235" width="520" height="60" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
    <text x="380" y="258" font-family="sans-serif" font-size="11" font-weight="800" fill="#0f172a">COMPLEXITY GUARANTEES:</text>
    <text x="380" y="278" font-family="sans-serif" font-size="10" fill="#475569">Get(key): O(1) via Map + move node to Head.  Put(key, val): O(1) insert at Head + evict Tail if capacity exceeded.</text>
` + createSvgFooter();

// 4. arch-cache-redis.svg
const redisSvg = createSvgHeader(
  "REDIS CLUSTER TOPOLOGY & HIGH-AVAILABILITY REPLICATION",
  "Hash Slot Distribution (16,384 Slots) • Master-Replica Sentinel Failover • Epoll Non-Blocking I/O"
) + `
    <!-- Shard 1 -->
    <rect x="50" y="110" width="260" height="185" rx="8" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" />
    <text x="180" y="138" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="800" fill="#92400e">SHARD 1 (Slots 0 - 5,460)</text>
    <rect x="70" y="155" width="220" height="55" rx="6" fill="#ffffff" stroke="#f59e0b" />
    <text x="180" y="177" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#b45309">Master 1 (Read/Write)</text>
    <text x="180" y="195" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#78350f">Epoll event loop • AOF log</text>
    <rect x="70" y="222" width="220" height="55" rx="6" fill="#f0fdf4" stroke="#86efac" />
    <text x="180" y="244" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#166534">Replica 1 (Async Replication)</text>
    <text x="180" y="262" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#15803d">Promoted automatically on failure</text>

    <!-- Shard 2 -->
    <rect x="370" y="110" width="260" height="185" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" />
    <text x="500" y="138" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="800" fill="#075985">SHARD 2 (Slots 5,461 - 10,922)</text>
    <rect x="390" y="155" width="220" height="55" rx="6" fill="#ffffff" stroke="#0284c7" />
    <text x="500" y="177" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#0369a1">Master 2 (Read/Write)</text>
    <text x="500" y="195" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#0c4a6e">Epoll event loop • AOF log</text>
    <rect x="390" y="222" width="220" height="55" rx="6" fill="#f0fdf4" stroke="#86efac" />
    <text x="500" y="244" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#166534">Replica 2 (Async Replication)</text>
    <text x="500" y="262" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#15803d">Promoted automatically on failure</text>

    <!-- Shard 3 -->
    <rect x="690" y="110" width="260" height="185" rx="8" fill="#f3e8ff" stroke="#a855f7" stroke-width="2" />
    <text x="820" y="138" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="800" fill="#6b21a8">SHARD 3 (Slots 10,923 - 16,383)</text>
    <rect x="710" y="155" width="220" height="55" rx="6" fill="#ffffff" stroke="#a855f7" />
    <text x="820" y="177" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#7e22ce">Master 3 (Read/Write)</text>
    <text x="820" y="195" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#581c87">Epoll event loop • AOF log</text>
    <rect x="710" y="222" width="220" height="55" rx="6" fill="#f0fdf4" stroke="#86efac" />
    <text x="820" y="244" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#166534">Replica 3 (Async Replication)</text>
    <text x="820" y="262" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#15803d">Promoted automatically on failure</text>
` + createSvgFooter();

// 5. arch-cache-stampede.svg
const stampedeSvg = createSvgHeader(
  "CACHE STAMPEDE (THUNDERING HERD) MITIGATION",
  "Key Expiry Spike -&gt; Mutex Locking • Probabilistic Early Refresh (XFetch) • Single-Flight Suppression"
) + `
    <!-- Without Protection: Stampede Disaster -->
    <rect x="40" y="110" width="420" height="190" rx="8" fill="#fef2f2" stroke="#dc2626" stroke-width="2" />
    <text x="250" y="138" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="800" fill="#991b1b">FAILURE MODE: NAIVE EXPIRY (HERD COLLAPSE)</text>
    <rect x="60" y="155" width="110" height="60" rx="6" fill="#ffffff" stroke="#fca5a5" />
    <text x="115" y="180" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#b91c1c">10,000 Concurrent</text>
    <text x="115" y="198" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#7f1d1d">Client Requests</text>

    <line x1="170" y1="185" x2="245" y2="185" stroke="#dc2626" stroke-width="2" marker-end="url(#arrowRed)" />

    <rect x="250" y="155" width="180" height="60" rx="6" fill="#fee2e2" stroke="#dc2626" />
    <text x="340" y="180" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="800" fill="#991b1b">All 10,000 Miss Simultaneously</text>
    <text x="340" y="198" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#b91c1c">Database Overwhelmed -&gt; Outage!</text>

    <!-- With Single-Flight / Mutex Lock: Safe -->
    <rect x="520" y="110" width="440" height="190" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" />
    <text x="740" y="138" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="800" fill="#166534">PRODUCTION DEFENSE: MUTEX / XFETCH</text>

    <rect x="540" y="155" width="170" height="60" rx="6" fill="#ffffff" stroke="#86efac" />
    <text x="625" y="180" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#15803d">1 Thread Acquires Lock</text>
    <text x="625" y="198" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#14532d">SET lock_key NX EX 5</text>

    <line x1="710" y1="185" x2="765" y2="185" stroke="#16a34a" stroke-width="2" marker-end="url(#arrowGreen)" />

    <rect x="770" y="155" width="170" height="60" rx="6" fill="#dcfce7" stroke="#16a34a" />
    <text x="855" y="180" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="800" fill="#14532d">Others Wait or Return Stale</text>
    <text x="855" y="198" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#166534">Zero DB load spike!</text>

    <rect x="540" y="230" width="400" height="50" rx="6" fill="#ffffff" stroke="#bbf7d0" />
    <text x="740" y="252" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#166534">XFetch Algorithm: Probabilistic Background Recompute</text>
    <text x="740" y="268" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#15803d">delta * beta * ln(rnd) &gt; ttl_remaining -&gt; pre-emptively renews before expiry</text>
` + createSvgFooter();

// 6. arch-cache-ttl.svg
const ttlSvg = createSvgHeader(
  "TIME-TO-LIVE (TTL) LIFECYCLE & JITTER STRATEGY",
  "Base TTL + Random Jitter Offset • Sliding vs Fixed Expiration • Active vs Passive Memory Eviction"
) + `
    <!-- Fixed TTL with Jitter Timeline -->
    <rect x="50" y="110" width="420" height="190" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" />
    <text x="260" y="138" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="800" fill="#075985">EXPIRATION JITTER (ANTI-SYNCHRONIZATION)</text>
    
    <rect x="70" y="155" width="380" height="40" rx="6" fill="#ffffff" stroke="#93c5fd" />
    <text x="80" y="175" font-family="sans-serif" font-size="10" font-weight="700" fill="#0369a1">Key 1: TTL = 300s + 14s (Random jitter) = 314s</text>
    <text x="80" y="188" font-family="sans-serif" font-size="9" fill="#64748b">Expires at T + 314s</text>

    <rect x="70" y="202" width="380" height="40" rx="6" fill="#ffffff" stroke="#93c5fd" />
    <text x="80" y="222" font-family="sans-serif" font-size="10" font-weight="700" fill="#0369a1">Key 2: TTL = 300s - 22s (Random jitter) = 278s</text>
    <text x="80" y="235" font-family="sans-serif" font-size="9" fill="#64748b">Expires at T + 278s</text>

    <rect x="70" y="249" width="380" height="40" rx="6" fill="#f0fdf4" stroke="#86efac" />
    <text x="80" y="269" font-family="sans-serif" font-size="10" font-weight="700" fill="#166534">Outcome: Expirations are smoothed across a wide window</text>
    <text x="80" y="282" font-family="sans-serif" font-size="9" fill="#15803d">Eliminates correlated database query cliffs</text>

    <!-- Eviction Mechanisms -->
    <rect x="510" y="110" width="440" height="190" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
    <text x="730" y="138" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="800" fill="#0f172a">REDIS TTL EVICTION MECHANISMS</text>

    <rect x="530" y="155" width="400" height="55" rx="6" fill="#ffffff" stroke="#cbd5e1" />
    <text x="545" y="177" font-family="sans-serif" font-size="10" font-weight="700" fill="#0f172a">1. Passive Eviction (On Access)</text>
    <text x="545" y="195" font-family="sans-serif" font-size="9" fill="#475569">When a client calls GET key, Redis checks TTL; if expired, returns nil &amp; deletes</text>

    <rect x="530" y="220" width="400" height="55" rx="6" fill="#ffffff" stroke="#cbd5e1" />
    <text x="545" y="242" font-family="sans-serif" font-size="10" font-weight="700" fill="#0f172a">2. Active Eviction (Background 10 Hz Daemon)</text>
    <text x="545" y="260" font-family="sans-serif" font-size="9" fill="#475569">Samples 20 random keys with TTL; evicts expired keys; repeats if &gt;25% expired</text>
` + createSvgFooter();

// 7. arch-cache-write-behind.svg
const writeBehindSvg = createSvgHeader(
  "WRITE-BEHIND (WRITE-BACK) ASYNCHRONOUS CACHING",
  "Immediate Cache Acknowledgment • Asynchronous Queue Worker • Batch Coalescing to Primary Database"
) + `
    <!-- Client -->
    <rect x="40" y="135" width="150" height="100" rx="8" fill="url(#darkGrad)" stroke="#334155" stroke-width="2" />
    <text x="115" y="180" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="800" fill="#ffffff">Client Application</text>
    <text x="115" y="200" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#94a3b8">Calls save(data)</text>

    <!-- Cache Node (Fast ack) -->
    <rect x="270" y="110" width="210" height="150" rx="8" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" />
    <text x="375" y="138" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="800" fill="#92400e">IN-MEMORY CACHE</text>
    <rect x="285" y="152" width="180" height="42" rx="6" fill="#ffffff" stroke="#f59e0b" />
    <text x="375" y="172" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#b45309">1. Writes to RAM (&lt;1ms)</text>
    <text x="375" y="187" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#78350f">Returns ACK immediately</text>

    <rect x="285" y="202" width="180" height="42" rx="6" fill="#f0fdf4" stroke="#86efac" />
    <text x="375" y="222" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#166534">2. Appends to Dirty Queue</text>
    <text x="375" y="237" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#15803d">Redis Stream / Kafka Topic</text>

    <!-- Connectors -->
    <line x1="190" y1="185" x2="265" y2="185" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrowAmber)" />

    <!-- Batch Flusher Worker -->
    <rect x="550" y="125" width="180" height="120" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" />
    <text x="640" y="155" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="800" fill="#075985">Async Batch Flusher</text>
    <text x="640" y="178" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#0369a1">Consolidates 5,000 writes</text>
    <text x="640" y="198" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#0c4a6e">Write Coalescing</text>
    <text x="640" y="215" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#0c4a6e">Runs every 5 seconds</text>

    <line x1="480" y1="185" x2="545" y2="185" stroke="#0284c7" stroke-width="2" marker-end="url(#arrowBlue)" />

    <!-- Database -->
    <rect x="790" y="135" width="170" height="100" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2" />
    <text x="875" y="170" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="800" fill="#166534">Persistent DB</text>
    <text x="875" y="190" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#15803d">Bulk INSERT/UPDATE</text>
    <text x="875" y="208" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#14532d">10x Higher Throughput</text>

    <line x1="730" y1="185" x2="785" y2="185" stroke="#16a34a" stroke-width="2" marker-end="url(#arrowGreen)" />
` + createSvgFooter();

// Write out all 7 files
const SVGS = [
  { name: 'arch-cache-hot-keys.svg', content: hotKeysSvg },
  { name: 'arch-cache-invalidation.svg', content: invalidationSvg },
  { name: 'arch-cache-lru.svg', content: lruSvg },
  { name: 'arch-cache-redis.svg', content: redisSvg },
  { name: 'arch-cache-stampede.svg', content: stampedeSvg },
  { name: 'arch-cache-ttl.svg', content: ttlSvg },
  { name: 'arch-cache-write-behind.svg', content: writeBehindSvg }
];

SVGS.forEach(svg => {
  const p = path.join(DIAGRAMS_DIR, svg.name);
  fs.writeFileSync(p, svg.content, 'utf8');
  console.log('Successfully generated:', svg.name);
});

console.log('All 7 missing caching diagrams created successfully!');
