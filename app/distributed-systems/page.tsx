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
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import PillarPageLayout from "../components/PillarPageLayout";
import IntelliJCodeBlock from "../components/IntelliJCodeBlock";

export const metadata: Metadata = {
  title: "Distributed Systems: Consensus, PACELC & Sharding",
  description: "Authoritative guide to distributed systems: CAP theorem, PACELC, Raft consensus, consistent hashing rings, vector clocks, and two-phase commit protocols.",
  alternates: {
    canonical: "https://www.gangsofdevelopers.com/distributed-systems",
  },
  openGraph: {
    title: "Distributed Systems Architecture, Consensus & Scalability Patterns",
    description:
      "Deep dive into CAP/PACELC, Raft consensus, consistent hashing, quorum replication, and distributed state machines with production trade-offs.",
    url: "https://www.gangsofdevelopers.com/distributed-systems",
    siteName: "Gangs of Developers (GOD)",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Distributed Systems Architecture & Scalability Patterns",
    description:
      "Master CAP theorem, Raft consensus, quorum replication, and horizontal sharding.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://www.gangsofdevelopers.com/distributed-systems#article",
      "headline": "Distributed Systems Architecture, Consensus & Scalability Patterns",
      "description":
        "Deep dive into distributed systems engineering: CAP theorem, PACELC, Raft & Paxos consensus, consistent hashing rings, replication models, vector clocks, and horizontal sharding.",
      "url": "https://www.gangsofdevelopers.com/distributed-systems",
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
        "Distributed Systems",
        "CAP Theorem",
        "PACELC Theorem",
        "Raft Consensus",
        "Consistent Hashing",
        "Quorum Replication",
        "Vector Clocks",
      ],
      "inLanguage": "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.gangsofdevelopers.com/distributed-systems#breadcrumb",
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
          "name": "Distributed Systems",
          "item": "https://www.gangsofdevelopers.com/distributed-systems",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.gangsofdevelopers.com/distributed-systems#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the difference between the CAP theorem and the PACELC theorem?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The CAP theorem states that under a network partition (P), a distributed system must choose between Consistency (C) and Availability (A). The PACELC theorem extends this: if there is a Partition (P), how does your system trade off Availability (A) and Consistency (C); Else (E), when the system is running normally without partitions, how does it trade off Latency (L) and Consistency (C)? PACELC explains why systems like MongoDB and Cassandra sacrifice latency for strong consistency even during normal operation.",
          },
        },
        {
          "@type": "Question",
          "name": "How does Raft consensus prevent split-brain during network partitions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Raft requires a strict majority quorum (N/2 + 1) to elect a leader and commit log entries. In a network partition, only the partition containing a majority of nodes can elect a leader and accept committed writes. The minority partition cannot achieve quorum, preventing split-brain writes.",
          },
        },
        {
          "@type": "Question",
          "name": "Why is Two-Phase Commit (2PC) considered a blocking protocol?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "In Two-Phase Commit, if the central coordinator crashes after participants have voted 'Prepare' (Phase 1) but before issuing 'Commit' or 'Abort' (Phase 2), all participant nodes remain locked and cannot release resources or proceed independently. This introduces unbounded latency and availability bottlenecks.",
          },
        },
      ],
    },
  ],
};

export default function DistributedSystemsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PillarPageLayout currentNav="system-design">
        <Container maxWidth="lg">
          {/* Header & Meta */}
          <Box sx={{ mb: 6 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: "center" }}>
              <Chip
                label="Core Architectural Pillar"
                size="small"
                color="primary"
                sx={{ fontWeight: 700 }}
              />
              <Chip
                label="Distributed Systems"
                size="small"
                variant="outlined"
              />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                18 min read &bull; Updated October 2026
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
              Distributed Systems Architecture: Consensus, Fault Tolerance &amp; Scalability
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.35rem" },
                fontWeight: 400,
                color: "text.secondary",
                lineHeight: 1.6,
                maxWidth: "900px",
              }}
            >
              The fundamental blueprints, consensus mechanics, and trade-off theorems that govern
              planet-scale distributed databases, message brokers, and fault-tolerant microservices.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
              <Link href="/system-design?topic=distributed-systems&subtopic=cap-theorem" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ fontWeight: 700, px: 3, py: 1.25 }}
                >
                  Open Interactive Chapter
                </Button>
              </Link>
              <Link href="/company-wise-problems" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  sx={{ fontWeight: 600, px: 3, py: 1.25 }}
                >
                  FAANG Interview Architectures
                </Button>
              </Link>
            </Stack>
          </Box>

          <Divider sx={{ mb: 6 }} />

          {/* Section 1: Fallacies and Foundations */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              1. The Foundations &amp; Fallacies of Distributed Computing
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Every distributed system operates across independent nodes communicating over an unreliable
              network. In 1994, L. Peter Deutsch and James Gosling formulated the <strong>8 Fallacies of Distributed Computing</strong>.
              Violating these assumptions is the root cause of cascading outages in cloud infrastructure:
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 3,
                bgcolor: "background.paper",
                borderRadius: 2,
                mb: 4,
              }}
            >
              <Box component="ol" sx={{ pl: 3, m: 0, "& li": { mb: 1.25, color: "text.primary", lineHeight: 1.6 } }}>
                <li><strong>The network is reliable:</strong> Packets drop, links flap, and BGP routes withdraw without warning.</li>
                <li><strong>Latency is zero:</strong> Cross-datacenter round-trips (RTT) inherently face physical speed-of-light constraints (~70ms transatlantic).</li>
                <li><strong>Bandwidth is infinite:</strong> Congestion collapse occurs when replication catch-up saturates NIC queues.</li>
                <li><strong>The network is secure:</strong> Zero-Trust architecture requires mandatory mutual TLS (mTLS) across all RPC boundaries.</li>
                <li><strong>Topology does not change:</strong> Auto-scaling groups, spot instance terminations, and pod migrations create constant node churn.</li>
                <li><strong>There is one administrator:</strong> Multi-tenant infrastructure spans disparate platform, security, and networking teams.</li>
                <li><strong>Transport cost is zero:</strong> Serialization, deserialization, and cloud egress bandwidth consume significant CPU and budget.</li>
                <li><strong>The network is homogeneous:</strong> Varying MTUs, intermediate middleboxes, and diverse NIC hardware coexist.</li>
              </Box>
            </Paper>
          </Box>

          {/* Section 2: CAP vs PACELC */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              2. CAP Theorem vs. PACELC Framework
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Formulated by Eric Brewer and formally proven by Seth Gilbert and Nancy Lynch, the <strong>CAP Theorem</strong> dictates
              that in the presence of an asynchronous network partition (<strong>P</strong>), a distributed data store can guarantee
              at most one of:
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mb: 4 }}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>
                  CP Systems (Consistency + Partition Tolerance)
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  When nodes cannot communicate across a network partition, the system rejects writes or returns errors
                  to avoid stale or conflicting states. Linearizability is preserved at the cost of availability.
                  Examples: <strong>Google Cloud Spanner, etcd, ZooKeeper, CockroachDB</strong>.
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "secondary.main", mb: 1 }}>
                  AP Systems (Availability + Partition Tolerance)
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  Every available node accepts reads and writes even during a partition. The system guarantees eventual
                  consistency through asynchronous reconciliation (e.g., Read Repair, Hinted Handoff, CRDTs).
                  Examples: <strong>Apache Cassandra, Amazon DynamoDB (eventual mode), Couchbase</strong>.
                </Typography>
              </Paper>
            </Box>

            <Typography variant="h4" sx={{ fontSize: "1.35rem", fontWeight: 700, mb: 2 }}>
              The PACELC Extension
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Daniel Abadi recognized that CAP only describes system behavior <em>during rare network partitions</em>.
              In 99.9% of normal operations, no partition exists. The <strong>PACELC Theorem</strong> provides the complete picture:
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
                PACELC Formula:
              </Typography>
              <Typography variant="body2" component="pre" sx={{ m: 0, overflowX: "auto" }}>
{`If there is a Partition (P):
    Trade off: Availability (A) vs. Consistency (C)
Else (E) [Normal Operation]:
    Trade off: Latency (L) vs. Consistency (C)

Classification Examples:
• PA/EL: Cassandra, DynamoDB (Optimized for Availability during partitions, Low Latency normally)
• PC/EC: Spanner, CockroachDB, etcd (Strict Consistency always, sacrificing Availability and Latency)
• PC/EL: MongoDB (Consistent during partitions, low latency during normal reads unless strong read concern specified)`}
              </Typography>
            </Paper>
          </Box>

          {/* Section 3: High-Level Architecture Topology Blueprint */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              3. Architectural Blueprint &amp; Component Topology
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Below is the component topology of an enterprise distributed storage and consensus cluster featuring
              client proxies, a Raft consensus quorum, consistent hashing ring, and asynchronous replication streams:
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
{`+-----------------------------------------------------------------------------------+
|                        HIGH-LEVEL DISTRIBUTED TOPOLOGY                            |
+-----------------------------------------------------------------------------------+

     [ Client App ]            [ Client App ]            [ Client App ]
           |                         |                         |
           +-------------------------+-------------------------+
                                     |
                                     v
                       +---------------------------+
                       |   Anycast Load Balancer   |
                       +---------------------------+
                                     |
                                     v
         +-------------------------------------------------------+
         |           Smart Router / Gateway Proxy Layer          |
         |  (Calculates MurmurHash3 & Routes to Target Shards)   |
         +-------------------------------------------------------+
                    /                |                \\
                   /                 |                 \\
                  v                  v                  v
       +--------------------+ +--------------------+ +--------------------+
       |   Sharded Ring A   | |   Sharded Ring B   | |   Sharded Ring C   |
       |  (Keys 0x00..0x54) | |  (Keys 0x55..0xAA) | |  (Keys 0xAB..0xFF) |
       +--------------------+ +--------------------+ +--------------------+
       | Raft Consensus     | | Raft Consensus     | | Raft Consensus     |
       | [Leader Node A1]   | | [Leader Node B1]   | | [Leader Node C1]   |
       |   | Log Append     | |   | Log Append     | |   | Log Append     |
       |   +--> Node A2 (F) | |   +--> Node B2 (F) | |   +--> Node C2 (F) |
       |   +--> Node A3 (F) | |   +--> Node B3 (F) | |   +--> Node C3 (F) |
       +--------------------+ +--------------------+ +--------------------+
                 |                       |                       |
                 +-----------------------+-----------------------+
                                         |
                                         v (Async CDC Stream)
                        +---------------------------------+
                        |  Apache Kafka Replication Log   |
                        +---------------------------------+
                                         |
                                         v
                        +---------------------------------+
                        | ElasticSearch / OLAP Analytics  |
                        +---------------------------------+`}
              </Typography>
            </Paper>
          </Box>

          {/* Section 4: Distributed Consensus Protocols */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              4. Distributed Consensus: Raft vs. Multi-Paxos
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Distributed consensus ensures that a group of machines agree on a sequence of state transitions even
              if a minority of machines fail. The fundamental requirement is maintaining a replicated state machine (RSM):
            </Typography>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                Raft Consensus Mechanics:
              </Typography>
              <Box component="ul" sx={{ pl: 3, m: 0, "& li": { mb: 1.5, color: "text.secondary", lineHeight: 1.7 } }}>
                <li>
                  <strong style={{ color: "var(--mui-palette-text-primary)" }}>Leader Election:</strong> Nodes transition between Follower, Candidate, and Leader states.
                  Randomized election timers (150ms–300ms) prevent split votes. A Candidate must obtain votes from a strict majority quorum (<code>N/2 + 1</code>).
                </li>
                <li>
                  <strong style={{ color: "var(--mui-palette-text-primary)" }}>Log Replication:</strong> The Leader accepts client requests, appends them to its local WAL (Write-Ahead Log),
                  and issues <code>AppendEntries</code> RPCs to followers. Once a majority responds with acknowledgement, the entry is committed.
                </li>
                <li>
                  <strong style={{ color: "var(--mui-palette-text-primary)" }}>Safety Invariant:</strong> If a log entry is committed in a given term, that entry will be present
                  in the logs of the leaders for all higher terms. Candidates with less up-to-date logs are rejected during election.
                </li>
              </Box>
            </Paper>

            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Production Consensus Pitfall: Two-Phase Commit (2PC) Blocking
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Unlike Raft, traditional <strong>Two-Phase Commit (2PC)</strong> is a distributed transaction protocol,
              NOT a fault-tolerant consensus protocol. In 2PC, all participants must vote unanimously.
              If the central transaction coordinator crashes after Phase 1 (Prepare), participants remain indefinitely
              locked holding row locks, causing total system standstill. Modern systems replace 2PC with Saga Orchestration
              or Raft-backed distributed transactions.
            </Typography>
          </Box>

          {/* Section 5: Consistent Hashing */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              5. Consistent Hashing &amp; Virtual Nodes
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Traditional hash mod partitioning (<code>node = hash(key) % N</code>) fails catastrophically when nodes
              are added or removed because virtually all keys remap to different servers (remapping <code>(N-1)/N</code> of all keys).
              <strong>Consistent Hashing</strong> maps both servers and data keys to a circular ring of <code>2^32 - 1</code> points:
            </Typography>

            <IntelliJCodeBlock
              title="Consistent Hash Ring Algorithm & Class Model"
              code={`// =========================================================================
// CLASS MODEL & INVARIANTS: ConsistentHashRing<T>
// Ring Domain: 2^32 - 1 continuum partitioned via MurmurHash3
// Invariant: O(log N) successor resolution via TreeMap balanced binary tree
// =========================================================================
public class ConsistentHashRing<T> {
    private final HashFunction hashFunction;
    private final int numberOfReplicas; // Virtual nodes per physical server
    private final SortedMap<Long, T> ring = new TreeMap<>();

    public ConsistentHashRing(int numberOfReplicas) {
        this.hashFunction = Hashing.murmur3_128();
        this.numberOfReplicas = numberOfReplicas;
    }

    // Algorithm: Add node and disperse virtual replicas uniformly along ring
    public synchronized void addNode(T node) {
        for (int i = 0; i < numberOfReplicas; i++) {
            long hash = hashFunction.hashString(node.toString() + "-vn-" + i, StandardCharsets.UTF_8).asLong();
            ring.put(hash, node);
        }
    }

    // Algorithm: Remove node and clean up replica points from ring
    public synchronized void removeNode(T node) {
        for (int i = 0; i < numberOfReplicas; i++) {
            long hash = hashFunction.hashString(node.toString() + "-vn-" + i, StandardCharsets.UTF_8).asLong();
            ring.remove(hash);
        }
    }

    // Algorithm: Key-to-Node Resolution (find first clockwise successor on ring)
    public T getNode(String key) {
        if (ring.isEmpty()) return null;
        long hash = hashFunction.hashString(key, StandardCharsets.UTF_8).asLong();
        if (!ring.containsKey(hash)) {
            SortedMap<Long, T> tailMap = ring.tailMap(hash);
            hash = tailMap.isEmpty() ? ring.firstKey() : tailMap.firstKey();
        }
        return ring.get(hash);
    }
}`}
            />

            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8 }}>
              By assigning 100–300 virtual nodes per physical host, data load distribution variance drops below 5%,
              preventing hot spots and ensuring rebalancing transfers only <code>K / N</code> keys upon topology mutation.
            </Typography>
          </Box>

          {/* Section 6: Architectural Trade-Off Matrix */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              6. Distributed Architecture Trade-Off Matrix
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Architectural decisions require weighing latency, throughput, consistency guarantees, and operational cost:
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: "action.hover" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Consensus / Model</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Consistency Guarantee</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Write Latency Impact</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Fault Tolerance Limit</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Best Suited Production Use-Case</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Raft / Multi-Paxos</TableCell>
                    <TableCell>Linearizable (Strong)</TableCell>
                    <TableCell>Medium (1 RTT to majority quorum)</TableCell>
                    <TableCell>Tolerates <code>(N-1)/2</code> failed nodes</TableCell>
                    <TableCell>Metadata, leader coordination, cluster membership (etcd, Consul, Spanner)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Quorum Leaderless (Cassandra)</TableCell>
                    <TableCell>Configurable (R+W &gt; N)</TableCell>
                    <TableCell>Low to Medium (Fast local writes with Hinted Handoff)</TableCell>
                    <TableCell>Tolerates failure of non-quorum nodes</TableCell>
                    <TableCell>High-volume time-series, IoT telemetry, shopping cart storage</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Asynchronous Read Replica</TableCell>
                    <TableCell>Eventual (Subject to replica lag)</TableCell>
                    <TableCell>Ultra Low (Local master write commits immediately)</TableCell>
                    <TableCell>Master failure requires manual or sentinel failover</TableCell>
                    <TableCell>Read-heavy SaaS applications, user profiles, product catalogs</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Two-Phase Commit (2PC)</TableCell>
                    <TableCell>Strict ACID Atomic Cross-Partition</TableCell>
                    <TableCell>High (2 RTTs + blocking two-phase locks)</TableCell>
                    <TableCell>Zero coordinator tolerance (blocking)</TableCell>
                    <TableCell>Legacy financial core ledgers where partial rollback is impossible</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Section 7: FAQ */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 3 }}>
              Frequently Asked Questions (Distributed Systems)
            </Typography>

            <Stack spacing={3}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  What is the difference between the CAP theorem and the PACELC theorem?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  The CAP theorem states that under a network partition (P), a distributed system must choose between Consistency (C) and Availability (A). The PACELC theorem extends this: if there is a Partition (P), how does your system trade off Availability (A) and Consistency (C); Else (E), when the system is running normally without partitions, how does it trade off Latency (L) and Consistency (C)? PACELC explains why systems like MongoDB and Cassandra sacrifice latency for strong consistency even during normal operation.
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  How does Raft consensus prevent split-brain during network partitions?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  Raft requires a strict majority quorum (N/2 + 1) to elect a leader and commit log entries. In a network partition, only the partition containing a majority of nodes can elect a leader and accept committed writes. The minority partition cannot achieve quorum, preventing split-brain writes.
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Why is Two-Phase Commit (2PC) considered a blocking protocol?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  In Two-Phase Commit, if the central coordinator crashes after participants have voted &apos;Prepare&apos; (Phase 1) but before issuing &apos;Commit&apos; or &apos;Abort&apos; (Phase 2), all participant nodes remain locked and cannot release resources or proceed independently. This introduces unbounded latency and availability bottlenecks.
                </Typography>
              </Paper>
            </Stack>
          </Box>

          {/* Section 8: Next Steps CTA */}
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
            <HubRoundedIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
              Master All 130 Distributed System Design Topics
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "650px", mx: "auto", mb: 3 }}>
              Explore interactive failure modes, rate limiters, distributed caching topologies,
              and real-world FAANG architectural case studies.
            </Typography>
            <Link href="/system-design" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{ fontWeight: 700, px: 4, py: 1.5 }}
              >
                Explore Full System Design Handbook
              </Button>
            </Link>
          </Paper>
        </Container>
      </PillarPageLayout>
    </>
  );
}
