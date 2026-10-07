import type { Metadata } from "next";
import Link from "next/link";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import PillarPageLayout from "../components/PillarPageLayout";

export const metadata: Metadata = {
  title: "Backend Architecture: Concurrency & Caching",
  description: "Authoritative guide to backend engineering: connection pooling, thread models, B-Trees vs LSM-Trees, multi-tier caching strategies, and latency tuning.",
  alternates: {
    canonical: "https://www.gangsofdevelopers.com/backend-engineering",
  },
  openGraph: {
    title: "Backend Engineering Architecture: Concurrency, Caching & Storage Tiers",
    description:
      "Deep dive into high-throughput backend architecture: HikariCP pool sizing, L1/L2 caching, LSM trees, and thread models.",
    url: "https://www.gangsofdevelopers.com/backend-engineering",
    siteName: "Gangs of Developers (GOD)",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Backend Engineering Architecture & Performance",
    description:
      "Master connection pooling, multi-tier caching, B-Tree vs LSM engines, and API idempotency.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://www.gangsofdevelopers.com/backend-engineering#article",
      "headline": "Backend Engineering Architecture: Concurrency, Caching & Storage Tiers",
      "description":
        "Authoritative guide to backend engineering: database connection pooling, thread models, multi-tier caching (L1 Caffeine + L2 Redis), B-Tree vs LSM storage internals, and API idempotency.",
      "url": "https://www.gangsofdevelopers.com/backend-engineering",
      "author": {
        "@type": "Person",
        "name": "Dharmendra Awasthi",
        "url": "https://www.gangsofdevelopers.com/author",
      },
      "publisher": {
        "@type": "Organization",
        "name": "Gangs of Developers",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.gangsofdevelopers.com/god_logo.png",
        },
      },
      "about": [
        "Backend Engineering",
        "Database Connection Pooling",
        "Caching Strategies",
        "B-Tree vs LSM Tree",
        "API Idempotency",
        "Concurrency Models",
      ],
      "inLanguage": "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.gangsofdevelopers.com/backend-engineering#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.gangsofdevelopers.com",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Backend Engineering",
          "item": "https://www.gangsofdevelopers.com/backend-engineering",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.gangsofdevelopers.com/backend-engineering#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do you size a database connection pool (like HikariCP)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A common mistake is creating oversized pools (e.g., 200 connections), which causes severe CPU context switching and disk spindle thrashing on the database. PostgreSQL research recommends the formula: pool_size = ((core_count * 2) + effective_spindle_count). For a modern 8-core server with SSD, a connection pool between 16 and 32 connections delivers maximum throughput and lowest queue latency.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the difference between B+ Tree and LSM (Log-Structured Merge) Tree storage engines?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "B+ Trees (PostgreSQL, MySQL InnoDB) store data in fixed-size blocks (usually 8KB/16KB) and update pages in place. They offer predictable O(log N) point reads and range scans, but suffer from write amplification due to random disk I/O. LSM Trees (RocksDB, Cassandra) append all writes sequentially to an in-memory MemTable and Write-Ahead Log, periodically flushing immutable SSTables to disk with background compaction. LSM trees offer superior write throughput at the cost of read amplification and compaction CPU overhead.",
          },
        },
        {
          "@type": "Question",
          "name": "How does API idempotency work with distributed locks?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "When a client submits a mutating request (e.g., POST /orders), it attaches a unique UUID Idempotency-Key. The backend attempts to acquire an atomic distributed lock in Redis via SET key value NX EX 30. If the key exists, the server waits or returns the cached response. Once the primary database transaction commits, the execution result is cached under the key so duplicate retries return identical responses without reprocessing.",
          },
        },
      ],
    },
  ],
};

export default function BackendEngineeringPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PillarPageLayout currentNav="system-design">
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 6 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: "center" }}>
              <Chip
                label="Engineering Architecture"
                size="small"
                color="primary"
                sx={{ fontWeight: 700 }}
              />
              <Chip
                label="Backend Systems"
                size="small"
                variant="outlined"
              />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                19 min read &bull; Updated October 2026
              </Typography>
            </Stack>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                mb: 2,
              }}
            >
              Backend Engineering: Concurrency, Caching &amp; Storage Architecture
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.35rem" },
                fontWeight: 400,
                color: "text.secondary",
                lineHeight: 1.6,
                maxWidth: "920px",
              }}
            >
              A deep technical blueprint for high-throughput backend services: connection pool physics,
              multi-tier caching topologies, B-Tree vs. LSM storage engines, and rock-solid API idempotency.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
              <Link href="/system-design?topic=caching&subtopic=cache-strategies" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ fontWeight: 700, px: 3, py: 1.25 }}
                >
                  Explore Caching Handbook
                </Button>
              </Link>
              <Link href="/java" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  sx={{ fontWeight: 600, px: 3, py: 1.25 }}
                >
                  Java 21 Concurrency Guide
                </Button>
              </Link>
            </Stack>
          </Box>

          <Divider sx={{ mb: 6 }} />

          {/* Section 1: Architecture Topology Blueprint */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              1. Multi-Tier Backend Service Topology Blueprint
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              High-throughput backend architectures decouple CPU execution from database I/O using multi-tier caching
              and optimized connection pools:
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 3,
                bgcolor: "#070b14",
                color: "#38bdf8",
                fontFamily: "monospace",
                borderRadius: 2,
                overflowX: "auto",
                mb: 4,
              }}
            >
              <Typography component="pre" sx={{ m: 0, fontSize: "0.85rem", lineHeight: 1.5 }}>
{`+-----------------------------------------------------------------------------------------+
|                    HIGH-THROUGHPUT MULTI-TIER BACKEND ARCHITECTURE                      |
+-----------------------------------------------------------------------------------------+

                       Incoming HTTP/2 / gRPC Traffic (100k QPS)
                                          |
                                          v
                      +---------------------------------------+
                      |   Reverse Proxy (NGINX / Envoy)       |
                      |   - TLS Session Resumption            |
                      |   - TCP Keep-Alive Connection Pool    |
                      +---------------------------------------+
                                          |
                                          v
       +---------------------------------------------------------------------+
       |                   Application Server (Java 21 JVM)                  |
       |  +---------------------------------------------------------------+  |
       |  |  Virtual Thread Executor (Project Loom: 10,000+ fibers)       |  |
       |  +---------------------------------------------------------------+  |
       |                                  |                                  |
       |         +------------------------+------------------------+         |
       |         |                                                 |         |
       |         v (Check L1 Cache: <100ns)                        v         |
       |  +--------------------------+            +-----------------------+  |
       |  | L1 In-Memory Cache       |            | Idempotency Guard     |  |
       |  | (Caffeine W-TinyLFU)     |            | (Atomic Redis Token)  |  |
       |  +--------------------------+            +-----------------------+  |
       |         | Cache Miss (<5%)                                          |
       +---------|-----------------------------------------------------------+
                 |
                 v (Check L2 Distributed Cache: <1.5ms)
       +---------------------------------------------------------------------+
       |   L2 Distributed Redis Cluster (Primary-Replica Sharded)            |
       |   - Redlock Distributed Locking with Fencing Tokens                 |
       |   - Probabilistic Early Expiration (XFetch Algorithm)               |
       +---------------------------------------------------------------------+
                 |
                 v (Cache Miss: <0.5%)
       +---------------------------------------------------------------------+
       |   HikariCP Managed Connection Pool (Fixed size: 24 connections)     |
       +---------------------------------------------------------------------+
                 |
                 v
       +---------------------------------------------------------------------+
       |   Relational Database (PostgreSQL / Aurora Primary + Read Replicas) |
       |   - B+ Tree Indexing on Hot Keys                                    |
       |   - WAL Disk Flush with Group Commit                                |
       +---------------------------------------------------------------------+`}
              </Typography>
            </Paper>
          </Box>

          {/* Section 2: Connection Pool Physics */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              2. Connection Pool Sizing Physics (HikariCP)
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              One of the most persistent anti-patterns in backend engineering is sizing database connection
              pools to 100 or 500 connections. PostgreSQL and MySQL run one dedicated OS process or thread
              per connection. When hundreds of threads compete for 8 CPU cores, the OS spends more CPU cycles
              performing <strong>thread context switches</strong> than executing actual SQL queries.
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 3,
                bgcolor: "background.paper",
                fontFamily: "monospace",
                borderRadius: 2,
                mb: 4,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}>
                HikariCP Optimal Pool Sizing Formula:
              </Typography>
              <Typography variant="body2" component="pre" sx={{ m: 0, overflowX: "auto" }}>
{`pool_size = ((cpu_cores * 2) + effective_spindle_count)

Example:
An 8-core database server with an NVMe SSD disk:
pool_size = (8 * 2) + 1 = 17 connections

Why 17 connections out-benchmarks 200 connections:
• Zero CPU context switching thrash
• Database cache lines remain warm in L1/L2 CPU caches
• Disk head / NVMe queue depth remains optimal without lock contention
• Queue wait times shift to the fast application memory queue rather than locking DB memory`}
              </Typography>
            </Paper>
          </Box>

          {/* Section 3: B-Tree vs LSM Trees */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              3. Storage Engine Internals: B+ Tree vs. LSM Tree
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Every backend database relies on one of two fundamental storage engine paradigms:
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mb: 4 }}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>
                  B+ Tree (Postgres, MySQL, Oracle)
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  Maintains a balanced multi-way tree on disk with fixed page blocks (typically 8KB or 16KB).
                  Leaves form a doubly linked list enabling rapid sequential range scans.
                  Writes modify pages in-place, incurring random I/O and write amplification.
                  <strong>Best for:</strong> OLTP read-heavy workloads with complex joins and range queries.
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "secondary.main", mb: 1 }}>
                  LSM Tree (RocksDB, Cassandra, ClickHouse)
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  Writes append sequentially to an in-memory <em>MemTable</em> and append-only WAL.
                  When full, MemTables flush as immutable <em>SSTables</em> to disk. Background compaction merges levels.
                  Reads check Bloom filters across multiple levels, incurring read amplification.
                  <strong>Best for:</strong> High-volume write streams, logging, and metrics ingestion.
                </Typography>
              </Paper>
            </Box>
          </Box>

          {/* Section 4: Trade-Off Matrix */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              4. Backend Architectural Trade-Off Matrix
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Comparative trade-offs across backend infrastructure layers:
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: "action.hover" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Component / Strategy</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Primary Benefit</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Risk / Pitfall</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Mitigation Strategy</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Cache-Aside (Lazy Load)</TableCell>
                    <TableCell>Only caches requested data; resilient to cache crashes</TableCell>
                    <TableCell>Cache Stampede / Thundering Herd upon TTL expiry</TableCell>
                    <TableCell>Distributed locking (Redlock) or probabilistic early refresh (XFetch)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Write-Behind (Write-Back)</TableCell>
                    <TableCell>Ultra-low write latency; buffers writes to DB</TableCell>
                    <TableCell>Data loss if cache server crashes before write drain</TableCell>
                    <TableCell>Append-only WAL replication or AOF fsync=always</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Optimistic Locking (@Version)</TableCell>
                    <TableCell>Zero database row locking; highest read throughput</TableCell>
                    <TableCell>High retry abort rates under high write contention</TableCell>
                    <TableCell>Pessimistic SELECT FOR UPDATE or queue serialization for hot rows</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Virtual Threads (Java 21)</TableCell>
                    <TableCell>100x concurrency over OS threads with simple blocking code</TableCell>
                    <TableCell>Thread pinning if calling <code>synchronized</code> or JNI</TableCell>
                    <TableCell>Replace <code>synchronized</code> with <code>ReentrantLock</code></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Section 5: FAQ */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 3 }}>
              Frequently Asked Questions (Backend Engineering)
            </Typography>

            <Stack spacing={3}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  How do you size a database connection pool (like HikariCP)?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  A common mistake is creating oversized pools (e.g., 200 connections), which causes severe CPU context switching and disk spindle thrashing on the database. PostgreSQL research recommends the formula: pool_size = ((core_count * 2) + effective_spindle_count). For a modern 8-core server with SSD, a connection pool between 16 and 32 connections delivers maximum throughput and lowest queue latency.
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  What is the difference between B+ Tree and LSM Tree storage engines?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  B+ Trees (PostgreSQL, MySQL InnoDB) store data in fixed-size blocks (usually 8KB/16KB) and update pages in place. They offer predictable O(log N) point reads and range scans, but suffer from write amplification due to random disk I/O. LSM Trees (RocksDB, Cassandra) append all writes sequentially to an in-memory MemTable and Write-Ahead Log, periodically flushing immutable SSTables to disk with background compaction. LSM trees offer superior write throughput at the cost of read amplification and compaction CPU overhead.
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  How does API idempotency work with distributed locks?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  When a client submits a mutating request (e.g., POST /orders), it attaches a unique UUID Idempotency-Key. The backend attempts to acquire an atomic distributed lock in Redis via SET key value NX EX 30. If the key exists, the server waits or returns the cached response. Once the primary database transaction commits, the execution result is cached under the key so duplicate retries return identical responses without reprocessing.
                </Typography>
              </Paper>
            </Stack>
          </Box>

          {/* CTA */}
          <Paper
            sx={{
              p: 5,
              borderRadius: 3,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              textAlign: "center",
              mb: 6,
            }}
          >
            <SpeedRoundedIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
              Ready to Architect Production-Grade Backend Systems?
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "650px", mx: "auto", mb: 3 }}>
              Explore our in-depth guides on Apache Kafka partitioning, Spring Boot microservices,
              and low-latency Java 21 memory models.
            </Typography>
            <Link href="/kafka" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{ fontWeight: 700, px: 4, py: 1.5 }}
              >
                Explore Apache Kafka Architecture
              </Button>
            </Link>
          </Paper>
        </Container>
      </PillarPageLayout>
    </>
  );
}
