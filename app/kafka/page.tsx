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
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded";
import PillarPageLayout from "../components/PillarPageLayout";
import IntelliJCodeBlock from "../components/IntelliJCodeBlock";

export const metadata: Metadata = {
  title: "Apache Kafka Architecture: Storage & Replication",
  description: "Authoritative guide to Apache Kafka: broker topology, partition assignment, Zero-Copy data transfer, Exactly-Once Semantics (EOS), and CDC with Debezium.",
  alternates: {
    canonical: "https://www.gangsofdevelopers.com/kafka",
  },
  openGraph: {
    title: "Apache Kafka Architecture: Partitions, Exactly-Once & CDC",
    description:
      "Deep dive into Apache Kafka: Zero-Copy storage, ISR replication, exactly-once semantics, cooperative rebalance, and CDC streaming.",
    url: "https://www.gangsofdevelopers.com/kafka",
    siteName: "Gangs of Developers (GOD)",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apache Kafka Architecture: Partitions & Exactly-Once Semantics",
    description:
      "Master Zero-Copy sendfile, ISR replication, transactional producers, and cooperative rebalances.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://www.gangsofdevelopers.com/kafka#article",
      "headline": "Apache Kafka Architecture: Partitions, Exactly-Once & CDC",
      "description":
        "Authoritative guide to Apache Kafka architecture: broker topology, partition assignment, cooperative consumer rebalancing, exactly-once semantics (EOS), log compaction, and Debezium CDC.",
      "url": "https://www.gangsofdevelopers.com/kafka",
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
        "Apache Kafka",
        "Event Streaming",
        "Exactly-Once Semantics",
        "Consumer Rebalance",
        "Log Compaction",
        "Change Data Capture",
        "Distributed Systems",
      ],
      "inLanguage": "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.gangsofdevelopers.com/kafka#breadcrumb",
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
          "name": "Apache Kafka",
          "item": "https://www.gangsofdevelopers.com/kafka",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.gangsofdevelopers.com/kafka#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does Apache Kafka achieve millions of messages per second throughput?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kafka achieves ultra-high throughput through three core architectural choices: 1) Sequential disk I/O on append-only segment files, which approaches the sequential write speed of physical disks/SSDs; 2) Zero-Copy data transfer using the Linux sendfile() system call, transferring data directly from the OS page cache to the network socket without copying into JVM user space; and 3) Aggressive batching and end-to-end compression (using LZ4, Snappy, or zstd) across producers, brokers, and consumers.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the difference between Eager Rebalance and Cooperative Sticky Rebalance in Kafka?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "In the legacy Eager Rebalance protocol, whenever a consumer joins, leaves, or times out, all consumers in the group immediately revoke ALL their partition assignments and stop consuming (a 'stop-the-world' event) until new assignments are distributed. In Cooperative Sticky Rebalancing (Incremental Cooperative Rebalance), consumers only revoke partitions that are actively being migrated to another member, allowing continuous consumption on unchanged partitions and eliminating cluster-wide consumer freezes.",
          },
        },
        {
          "@type": "Question",
          "name": "How does Kafka guarantee Exactly-Once Semantics (EOS)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kafka EOS combines Idempotent Producers (which assign an internal Producer ID and sequence numbers to every batch to prevent duplicate writes during network retries) with a Transaction Coordinator. The Transaction Coordinator manages a two-phase commit protocol across input offsets and output topic partitions via the __transaction_state internal topic, ensuring all reads, processing, and downstream writes commit or abort atomically.",
          },
        },
      ],
    },
  ],
};

export default function KafkaPage() {
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
                label="Distributed Streaming Infrastructure"
                size="small"
                color="primary"
                sx={{ fontWeight: 700 }}
              />
              <Chip
                label="Apache Kafka"
                size="small"
                variant="outlined"
              />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                21 min read &bull; Updated October 2026
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
              Apache Kafka Architecture: Storage Internals, Exactly-Once &amp; CDC
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
              The definitive guide to Apache Kafka: Linux page cache zero-copy mechanics, In-Sync Replicas (ISR),
              transactional producers, cooperative sticky rebalancing, and Change Data Capture (CDC).
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
              <Link href="/microservices?topic=distributed-data&subtopic=transactional-outbox" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ fontWeight: 700, px: 3, py: 1.25 }}
                >
                  Transactional Outbox Guide
                </Button>
              </Link>
              <Link href="/distributed-systems" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  sx={{ fontWeight: 600, px: 3, py: 1.25 }}
                >
                  Distributed Systems Consensus
                </Button>
              </Link>
            </Stack>
          </Box>

          <Divider sx={{ mb: 6 }} />

          {/* Section 1: Broker & Storage Topology */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              1. Kafka Broker &amp; Partition Topology Blueprint
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              The following blueprint illustrates how Apache Kafka achieves high throughput across distributed
              partitions, in-sync replicas, and consumer group worker allocations:
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
|                  APACHE KAFKA DISTRIBUTED CLUSTER & PARTITION TOPOLOGY                  |
+-----------------------------------------------------------------------------------------+

  Producers (acks=all, enable.idempotence=true)
  [ Producer 1 ]                    [ Producer 2 ]                    [ Producer 3 ]
         \\                                |                                 /
          +-------------------------------+--------------------------------+
                                          |
                                          v (Murmur2 Hash on Message Key)
  +---------------------------------------------------------------------------------------+
  |                           KAFKA 3-BROKER CLUSTER (KRaft Mode)                         |
  |                                                                                       |
  |  +------------------------+  +------------------------+  +------------------------+   |
  |  | Broker 101             |  | Broker 102             |  | Broker 103             |   |
  |  | - Topic-A Partition 0  |  | - Topic-A Partition 1  |  | - Topic-A Partition 2  |   |
  |  |   (LEADER)             |  |   (LEADER)             |  |   (LEADER)             |   |
  |  | - Topic-A Partition 1  |  | - Topic-A Partition 2  |  | - Topic-A Partition 0  |   |
  |  |   (Follower - ISR)     |  |   (Follower - ISR)     |  |   (Follower - ISR)     |   |
  |  +------------------------+  +------------------------+  +------------------------+   |
  |               ^                           ^                           ^               |
  |               | (Zero-Copy sendfile)      | (Zero-Copy sendfile)      |               |
  +---------------|---------------------------|---------------------------|---------------+
                  |                           |                           |
                  v                           v                           v
  +---------------------------------------------------------------------------------------+
  |                   CONSUMER GROUP: "order-analytics" (CooperativeSticky)               |
  |                                                                                       |
  |       [ Consumer Instance A ]       [ Consumer Instance B ]       [ Consumer C ]      |
  |       Assigned: Partition 0         Assigned: Partition 1         Assigned: Part 2    |
  +---------------------------------------------------------------------------------------+`}
              </Typography>
            </Paper>
          </Box>

          {/* Section 2: Zero-Copy Storage Internals */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              2. Storage Internals: Linux Page Cache &amp; Zero-Copy Syscalls
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Unlike traditional message brokers that manage complex in-memory queues within JVM heaps,
              Kafka delegates memory management entirely to the Linux OS Page Cache:
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 3,
                bgcolor: "action.hover",
                fontFamily: "monospace",
                borderRadius: 2,
                mb: 4,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}>
                Traditional I/O vs. Kafka Zero-Copy sendfile():
              </Typography>
              <Typography variant="body2" component="pre" sx={{ m: 0, overflowX: "auto" }}>
{`Standard Java Network Transfer (4 context switches, 3 data copies):
1. Disk -> OS Page Cache (DMA Copy)
2. OS Page Cache -> JVM Application Memory (CPU Copy)
3. JVM Application Memory -> Socket Buffer (CPU Copy)
4. Socket Buffer -> NIC Buffer (DMA Copy)

Kafka Zero-Copy via sendfile() / TransferTo() (2 context switches, 0 CPU copies):
1. Disk -> OS Page Cache (DMA Copy)
2. OS Page Cache -> NIC Buffer (Direct DMA Copy via file descriptor pointer)
Result: Zero CPU cycles wasted copying bytes in user space; saturates 40Gbps NIC lines.`}
              </Typography>
            </Paper>
          </Box>

          {/* Section 3: Exactly-Once Semantics */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              3. Producer Idempotency &amp; Exactly-Once Semantics (EOS)
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              When a network partition or socket timeout occurs right after a broker writes a message but before
              sending the ACK, a retrying producer causes message duplication. Enabling idempotent producers eliminates this:
            </Typography>

            <IntelliJCodeBlock
              title="Exactly-Once Semantics — Idempotent Producer Invariants & Model"
              code={`// =========================================================================
// PROTOCOL SPECIFICATION & INVARIANTS: Exactly-Once Semantics (EOS)
// Broker Invariants: Deduplication via PID (Producer ID) + Sequence Number
// =========================================================================
Properties props = new Properties();
props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "broker-1:9092,broker-2:9092");
props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, ByteArraySerializer.class.getName());

// Invariant 1: Mandatory for Exactly-Once Delivery
props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, "true");
props.put(ProducerConfig.ACKS_CONFIG, "all"); // Wait for all In-Sync Replicas (ISR)
props.put(ProducerConfig.RETRIES_CONFIG, Integer.MAX_VALUE);
props.put(ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION, 5); // Ordering preserved with idempotence

// Invariant 2: High-Throughput Batching & Compression Strategy
props.put(ProducerConfig.COMPRESSION_TYPE_CONFIG, "lz4");
props.put(ProducerConfig.BATCH_SIZE_CONFIG, 64 * 1024); // 64KB batches
props.put(ProducerConfig.LINGER_MS_CONFIG, 20); // Wait up to 20ms to pack batches`}
            />
          </Box>

          {/* Section 4: Trade-Off Matrix */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              4. Kafka Delivery Guarantees Trade-Off Matrix
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Systematic trade-offs between delivery guarantees and broker throughput:
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: "action.hover" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Delivery Guarantee</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Configuration</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Throughput Impact</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Risk / Edge Case</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Best Suited Scenario</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>At-Most-Once</TableCell>
                    <TableCell><code>acks=0</code>, auto-commit before processing</TableCell>
                    <TableCell>Highest (Zero broker ACKs)</TableCell>
                    <TableCell>Data lost on broker failure or consumer crash</TableCell>
                    <TableCell>High-volume telemetry, metrics metrics, clickstream analytics</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>At-Least-Once</TableCell>
                    <TableCell><code>acks=all</code>, manual commit after DB write</TableCell>
                    <TableCell>High</TableCell>
                    <TableCell>Duplicate messages upon consumer restart (requires downstream idempotency)</TableCell>
                    <TableCell>General microservices, event-driven ordering, notifications</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Exactly-Once (EOS)</TableCell>
                    <TableCell><code>transactional.id</code>, 2PC via coordinator</TableCell>
                    <TableCell>Medium (~15% to 25% throughput overhead)</TableCell>
                    <TableCell>Zombie producers if transaction coordinator encounters clock skew</TableCell>
                    <TableCell>Financial ledgers, payment settlement, inventory count increments</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Section 5: FAQ */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 3 }}>
              Frequently Asked Questions (Apache Kafka Architecture)
            </Typography>

            <Stack spacing={3}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  How does Apache Kafka achieve millions of messages per second throughput?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  Kafka achieves ultra-high throughput through three core architectural choices: 1) Sequential disk I/O on append-only segment files, which approaches the sequential write speed of physical disks/SSDs; 2) Zero-Copy data transfer using the Linux sendfile() system call, transferring data directly from the OS page cache to the network socket without copying into JVM user space; and 3) Aggressive batching and end-to-end compression (using LZ4, Snappy, or zstd) across producers, brokers, and consumers.
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  What is the difference between Eager Rebalance and Cooperative Sticky Rebalance in Kafka?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  In the legacy Eager Rebalance protocol, whenever a consumer joins, leaves, or times out, all consumers in the group immediately revoke ALL their partition assignments and stop consuming (a &apos;stop-the-world&apos; event) until new assignments are distributed. In Cooperative Sticky Rebalancing (Incremental Cooperative Rebalance), consumers only revoke partitions that are actively being migrated to another member, allowing continuous consumption on unchanged partitions and eliminating cluster-wide consumer freezes.
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  How does Kafka guarantee Exactly-Once Semantics (EOS)?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  Kafka EOS combines Idempotent Producers (which assign an internal Producer ID and sequence numbers to every batch to prevent duplicate writes during network retries) with a Transaction Coordinator. The Transaction Coordinator manages a two-phase commit protocol across input offsets and output topic partitions via the __transaction_state internal topic, ensuring all reads, processing, and downstream writes commit or abort atomically.
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
            <CompareArrowsRoundedIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
              Integrate Kafka with Distributed Microservices
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "650px", mx: "auto", mb: 3 }}>
              Learn how to implement Transactional Outbox, Saga distributed orchestrations,
              and Dead Letter Queues using Spring Boot and Apache Kafka.
            </Typography>
            <Link href="/microservices-design-patterns" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{ fontWeight: 700, px: 4, py: 1.5 }}
              >
                Explore Microservices Design Patterns
              </Button>
            </Link>
          </Paper>
        </Container>
      </PillarPageLayout>
    </>
  );
}
