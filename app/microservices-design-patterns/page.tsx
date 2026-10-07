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
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import PillarPageLayout from "../components/PillarPageLayout";
import IntelliJCodeBlock from "../components/IntelliJCodeBlock";

export const metadata: Metadata = {
  title: "Microservices Design Patterns: 33 Production Patterns",
  description: "Catalog of 33 microservices design patterns: Saga orchestration, Transactional Outbox, CQRS, Circuit Breaker, API Gateway, OAuth 2.0, and Distributed Tracing.",
  alternates: {
    canonical: "https://www.gangsofdevelopers.com/microservices-design-patterns",
  },
  openGraph: {
    title: "Microservices Design Patterns Catalog & Architecture Reference",
    description:
      "Master modern microservices architecture patterns: Sagas, CQRS, Outbox, API Gateway, and Distributed Resilience with production trade-offs.",
    url: "https://www.gangsofdevelopers.com/microservices-design-patterns",
    siteName: "Gangs of Developers (GOD)",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Microservices Design Patterns Catalog & Architecture Reference",
    description:
      "Deep architectural blueprints for Saga, CQRS, Transactional Outbox, and Resilience patterns.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://www.gangsofdevelopers.com/microservices-design-patterns#article",
      "headline": "Microservices Design Patterns Catalog & Architecture Reference",
      "description":
        "Comprehensive guide to all 33 microservices design patterns: Saga Orchestration, CQRS, Transactional Outbox, Event Sourcing, API Gateway, Circuit Breaker, OAuth 2.0, and Service Mesh.",
      "url": "https://www.gangsofdevelopers.com/microservices-design-patterns",
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
        "Microservices Architecture",
        "Microservices Design Patterns",
        "Saga Pattern",
        "CQRS Pattern",
        "Transactional Outbox",
        "API Gateway",
        "Circuit Breaker",
      ],
      "inLanguage": "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.gangsofdevelopers.com/microservices-design-patterns#breadcrumb",
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
          "name": "Microservices Design Patterns",
          "item": "https://www.gangsofdevelopers.com/microservices-design-patterns",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.gangsofdevelopers.com/microservices-design-patterns#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the difference between Saga Orchestration and Saga Choreography?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "In Saga Choreography, microservices listen to domain events and autonomously trigger next steps without a central coordinator. This works well for simple workflows (2–4 steps). In Saga Orchestration, a dedicated orchestrator service explicitly directs participants via commands. Orchestration prevents circular dependencies and provides centralized workflow monitoring for complex multi-step distributed transactions.",
          },
        },
        {
          "@type": "Question",
          "name": "Why is the Transactional Outbox pattern necessary when publishing to Kafka?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A standard service cannot atomically write to a local database and publish a message to Apache Kafka in a single transaction (dual-write problem). If the DB write succeeds but Kafka fails (or vice versa), state becomes corrupt. The Transactional Outbox pattern writes both business entities and outbox events into the same relational database transaction. A separate Debezium CDC or polling worker then guarantees at-least-once delivery to Kafka.",
          },
        },
        {
          "@type": "Question",
          "name": "When should you NOT use CQRS (Command Query Responsibility Segregation)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "CQRS introduces substantial complexity: dual data models, eventual consistency latency between write and read stores, and event synchronization overhead. If your application has symmetric read/write workloads, simple relational CRUD requirements, or requires immediate read-your-own-writes consistency without eventual lag, CQRS is an anti-pattern.",
          },
        },
      ],
    },
  ],
};

export default function MicroservicesDesignPatternsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PillarPageLayout currentNav="microservices">
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 6 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: "center" }}>
              <Chip
                label="Architectural Pattern Catalog"
                size="small"
                color="secondary"
                sx={{ fontWeight: 700 }}
              />
              <Chip
                label="33 Distributed Patterns"
                size="small"
                variant="outlined"
              />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                22 min read &bull; Updated October 2026
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
              Microservices Design Patterns: The Complete Engineering Catalog
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
              Master the 33 architectural blueprints for distributed transactions, event-driven streaming,
              API routing, resilience boundaries, and zero-trust service mesh coordination.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
              <Link href="/microservices" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ fontWeight: 700, px: 3, py: 1.25 }}
                >
                  Open Interactive Microservices Handbook
                </Button>
              </Link>
              <Link href="/microservices?topic=distributed-data&subtopic=saga-pattern" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  sx={{ fontWeight: 600, px: 3, py: 1.25 }}
                >
                  Deep-Dive: Saga Pattern
                </Button>
              </Link>
            </Stack>
          </Box>

          <Divider sx={{ mb: 6 }} />

          {/* Section 1: Architectural Topology Blueprint */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              1. Modern Microservices Architecture Topology
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              The following blueprint illustrates how enterprise microservices decouple client traffic,
              enforce resilience boundaries, coordinate asynchronous events, and maintain data consistency:
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
|                  ENTERPRISE MICROSERVICES DISTRIBUTED PATTERN TOPOLOGY                  |
+-----------------------------------------------------------------------------------------+

  [ Mobile Client ]      [ Web Client (SPA) ]      [ Partner 3rd-Party API ]
          \\                      |                           /
           \\                     |                          /
            v                    v                         v
   +---------------------------------------------------------------+
   |               API GATEWAY / BFF (Spring Cloud Gateway)        |
   |   - Rate Limiter (Token Bucket / Redis)                       |
   |   - JWT Authentication & Header Propagation                   |
   |   - SSL Termination & Response Compression                    |
   +---------------------------------------------------------------+
                  /                            \\
                 /                              \\
                v                                v
   +--------------------------+    +--------------------------+
   |   Order Service (Pod)    |    |  Inventory Service (Pod) |
   |  [Envoy Sidecar Proxy]   |<-->|  [Envoy Sidecar Proxy]   |
   |  - Circuit Breaker (R4j) |mTLS|  - Bulkhead Thread Pool  |
   |  - Transactional Outbox  |    |  - Compensating Tx Logic |
   +--------------------------+    +--------------------------+
          |            |                  |            |
     (Local DB)   (CDC Debezium)     (Local DB)   (CDC Debezium)
          v            v                  v            v
     [Postgres]        +------------------+       [Postgres]
                               |
                               v
             +------------------------------------+
             |   APACHE KAFKA EVENT STREAM HUB    |
             |  - Topic: orders.v1 (Partitioned)  |
             |  - Topic: inventory.v1             |
             +------------------------------------+
                   /                 \\
                  /                   \\
                 v                     v
   +---------------------------+   +---------------------------+
   |  Payment Orchestrator     |   |   CQRS Read Model View    |
   |  - Saga State Machine     |   |  - ElasticSearch Engine   |
   |  - Failure Recovery       |   |  - Sub-5ms Query Latency  |
   +---------------------------+   +---------------------------+`}
              </Typography>
            </Paper>
          </Box>

          {/* Section 2: Data Management Patterns */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              2. Distributed Data Management Patterns
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              In a distributed architecture, monolithic two-phase commits (2PC) do not scale.
              The primary challenge is maintaining data consistency across independent database boundaries:
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mb: 4 }}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>
                  Saga Pattern (Orchestration vs Choreography)
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}>
                  Executes a series of local transactions across microservices. If any step fails,
                  the Saga coordinates <strong>compensating transactions</strong> to reverse changes in reverse order.
                </Typography>
                <Link href="/microservices?topic=distributed-data&subtopic=saga-pattern" style={{ textDecoration: "none" }}>
                  <Button
                    size="small"
                    variant="outlined"
                  >
                    View Saga Implementation
                  </Button>
                </Link>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>
                  Transactional Outbox &amp; CDC
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}>
                  Solves the dual-write problem by saving domain entity updates and pending event messages
                  inside the <em>same local ACID transaction</em>. A CDC engine (Debezium) tails WAL logs to stream to Kafka.
                </Typography>
                <Link href="/microservices?topic=distributed-data&subtopic=transactional-outbox" style={{ textDecoration: "none" }}>
                  <Button
                    size="small"
                    variant="outlined"
                  >
                    View Outbox Pattern
                  </Button>
                </Link>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>
                  CQRS (Command Query Responsibility Segregation)
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}>
                  Separates the write model (normalized for high ACID write throughput) from read models
                  (denormalized views stored in Redis or ElasticSearch optimized for fast queries).
                </Typography>
                <Link href="/microservices?topic=distributed-data&subtopic=cqrs" style={{ textDecoration: "none" }}>
                  <Button
                    size="small"
                    variant="outlined"
                  >
                    View CQRS Chapter
                  </Button>
                </Link>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>
                  Event Sourcing
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}>
                  Instead of storing only the current entity state, the system appends immutable state-changing events
                  to an append-only event log. Current state is reconstructed by replaying events.
                </Typography>
                <Link href="/microservices?topic=distributed-data&subtopic=event-sourcing" style={{ textDecoration: "none" }}>
                  <Button
                    size="small"
                    variant="outlined"
                  >
                    View Event Sourcing
                  </Button>
                </Link>
              </Paper>
            </Box>
          </Box>

          {/* Section 3: Resilience Patterns */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              3. Distributed Resilience &amp; Fault Tolerance Patterns
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              When a downstream dependency suffers latency spikes or crashes, upstream services must prevent
              cascading exhaustion of connection pools and worker threads:
            </Typography>

            <IntelliJCodeBlock
              title="Circuit Breaker Resilience — Algorithm Specification & State Machine"
              code={`// =========================================================================
// CLASS MODEL & STATE MACHINE: Circuit Breaker Isolation
// State Invariants: CLOSED (pass) -> OPEN (fail-fast) -> HALF-OPEN (probe)
// Algorithm: Sliding Window Failure Threshold & Graceful Degradation
// =========================================================================
public class PaymentProcessingService {
    private final CircuitBreaker circuitBreaker;
    private final PaymentGatewayClient gatewayClient;

    public PaymentProcessingService(CircuitBreakerRegistry registry, PaymentGatewayClient client) {
        this.gatewayClient = client;
        this.circuitBreaker = registry.circuitBreaker("paymentGateway", 
            CircuitBreakerConfig.custom()
                .failureRateThreshold(50.0f) // Invariant: Trip when >50% calls fail
                .slowCallRateThreshold(70.0f) // Invariant: Trip when >70% calls exceed 2s
                .slowCallDurationThreshold(Duration.ofSeconds(2))
                .waitDurationInOpenState(Duration.ofSeconds(15)) // Cool-off time
                .slidingWindowSize(20)
                .build());
    }

    // Algorithm: Protected invocation with circuit state evaluation
    public PaymentResult chargeCard(ChargeRequest request) {
        Supplier<PaymentResult> protectedCall = CircuitBreaker.decorateSupplier(
            circuitBreaker, () -> gatewayClient.executeCharge(request));

        return Try.ofSupplier(protectedCall)
            .recover(CallNotPermittedException.class, ex -> fallbackDegradedQueue(request))
            .get();
    }

    // Fallback Algorithm: Graceful degradation via async queue
    private PaymentResult fallbackDegradedQueue(ChargeRequest request) {
        return PaymentResult.deferredProcessing(request.transactionId());
    }
}`}
            />
          </Box>

          {/* Section 4: Pattern Comparison Matrix */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              4. Microservices Pattern Comparison &amp; Trade-Off Matrix
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Systematic trade-offs between distributed coordination alternatives:
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: "action.hover" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Pattern</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Primary Advantage</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Operational Complexity</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Failure Mode / Pitfall</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Recommended Usage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Saga Orchestration</TableCell>
                    <TableCell>Central visibility, no circular events</TableCell>
                    <TableCell>Medium (Requires orchestrator coordinator)</TableCell>
                    <TableCell>Orchestrator becomes a single point of business logic bloat</TableCell>
                    <TableCell>Complex e-commerce checkout, payment &amp; fulfillment</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Transactional Outbox</TableCell>
                    <TableCell>Eliminates dual-write data corruption</TableCell>
                    <TableCell>Medium (Requires Debezium / CDC)</TableCell>
                    <TableCell>Duplicate messages (requires downstream idempotency)</TableCell>
                    <TableCell>All services publishing events to Kafka or RabbitMQ</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Circuit Breaker</TableCell>
                    <TableCell>Prevents cascading thread pool exhaustion</TableCell>
                    <TableCell>Low (Resilience4j library integration)</TableCell>
                    <TableCell>Misconfigured thresholds trip during momentary blips</TableCell>
                    <TableCell>All synchronous HTTP / gRPC inter-service calls</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Service Mesh (Istio)</TableCell>
                    <TableCell>Zero-touch mTLS, canary routing, tracing</TableCell>
                    <TableCell>High (50MB+ RAM and 2ms RTT per pod)</TableCell>
                    <TableCell>Complex xDS synchronization issues and memory bloat</TableCell>
                    <TableCell>Large clusters (30+ services) needing Zero-Trust mTLS</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Section 5: FAQ */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 3 }}>
              Frequently Asked Questions (Microservices Patterns)
            </Typography>

            <Stack spacing={3}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  What is the difference between Saga Orchestration and Saga Choreography?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  In Saga Choreography, microservices listen to domain events and autonomously trigger next steps without a central coordinator. This works well for simple workflows (2–4 steps). In Saga Orchestration, a dedicated orchestrator service explicitly directs participants via commands. Orchestration prevents circular dependencies and provides centralized workflow monitoring for complex multi-step distributed transactions.
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Why is the Transactional Outbox pattern necessary when publishing to Kafka?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  A standard service cannot atomically write to a local database and publish a message to Apache Kafka in a single transaction (dual-write problem). If the DB write succeeds but Kafka fails (or vice versa), state becomes corrupt. The Transactional Outbox pattern writes both business entities and outbox events into the same relational database transaction. A separate Debezium CDC or polling worker then guarantees at-least-once delivery to Kafka.
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  When should you NOT use CQRS (Command Query Responsibility Segregation)?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  CQRS introduces substantial complexity: dual data models, eventual consistency latency between write and read stores, and event synchronization overhead. If your application has symmetric read/write workloads, simple relational CRUD requirements, or requires immediate read-your-own-writes consistency without eventual lag, CQRS is an anti-pattern.
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
            <AccountTreeRoundedIcon sx={{ fontSize: 48, color: "secondary.main", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
              Explore All 33 Interactive Microservices Patterns
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "650px", mx: "auto", mb: 3 }}>
              Dive into API Gateway rate limiting, Service Mesh mTLS, distributed tracing with OpenTelemetry,
              and Kafka consumer dead-letter queues.
            </Typography>
            <Link href="/microservices" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{ fontWeight: 700, px: 4, py: 1.5 }}
              >
                Open Microservices Handbook
              </Button>
            </Link>
          </Paper>
        </Container>
      </PillarPageLayout>
    </>
  );
}
