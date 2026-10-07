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
  title: "Spring Boot Microservices: Production Architecture",
  description: "Guide to Spring Boot 3+ microservices architecture: Spring Cloud Gateway, Resilience4j circuit breakers, Kafka event streaming, and GraalVM Native Image.",
  alternates: {
    canonical: "https://www.gangsofdevelopers.com/spring-boot",
  },
  openGraph: {
    title: "Spring Boot Microservices Architecture: Cloud Native & Distributed Systems",
    description:
      "Deep dive into Spring Boot 3+: Virtual Threads, Spring Cloud Gateway, Resilience4j, Kafka integration, and GraalVM Native Images.",
    url: "https://www.gangsofdevelopers.com/spring-boot",
    siteName: "Gangs of Developers (GOD)",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spring Boot Microservices Architecture & Cloud Native Patterns",
    description:
      "Master Spring Boot 3, Virtual Threads, Spring Cloud Gateway, Resilience4j, and Kafka.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://www.gangsofdevelopers.com/spring-boot#article",
      "headline": "Spring Boot Microservices Architecture: Cloud Native & Distributed Systems",
      "description":
        "Authoritative guide to Spring Boot 3+ microservices architecture: Spring Cloud Gateway, Resilience4j circuit breaking, Kafka Dead Letter Topics, GraalVM AOT, and OpenTelemetry observability.",
      "url": "https://www.gangsofdevelopers.com/spring-boot",
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
        "Spring Boot",
        "Spring Cloud Gateway",
        "Resilience4j",
        "Spring Kafka",
        "GraalVM Native Image",
        "Microservices Architecture",
      ],
      "inLanguage": "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.gangsofdevelopers.com/spring-boot#breadcrumb",
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
          "name": "Spring Boot Microservices",
          "item": "https://www.gangsofdevelopers.com/spring-boot",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.gangsofdevelopers.com/spring-boot#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do you enable and configure Java 21 Virtual Threads in Spring Boot 3.2+?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "In Spring Boot 3.2 and higher running on Java 21, you simply set 'spring.threads.virtual.enabled=true' in application.properties or application.yml. Spring Boot automatically configures embedded Tomcat and async task executors to use Virtual Threads for all incoming HTTP requests.",
          },
        },
        {
          "@type": "Question",
          "name": "Should you choose Spring WebFlux Reactive or Spring MVC with Virtual Threads?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "With Java 21 Virtual Threads, Spring MVC achieves comparable high-concurrency throughput to Spring WebFlux without the cognitive complexity of reactive Mono/Flux streams, difficult debugging, or reactive database drivers (R2DBC). Spring MVC + Virtual Threads is recommended for most enterprise microservices unless you require streaming Server-Sent Events (SSE) or bi-directional WebSockets across hundreds of thousands of concurrent idle connections.",
          },
        },
        {
          "@type": "Question",
          "name": "How does Spring Kafka handle consumer failures with Dead Letter Topics (DLT)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Spring Kafka provides DeadLetterPublishingRecoverer paired with a CommonErrorHandler (e.g., DefaultErrorHandler with BackOff). When a poisoned message repeatedly fails after configured retry attempts, Spring Kafka automatically forwards the raw payload and failure exception metadata to a '.DLT' topic, allowing consumer lag to progress without blocking the partition.",
          },
        },
      ],
    },
  ],
};

export default function SpringBootPage() {
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
                label="Enterprise Framework Architecture"
                size="small"
                color="secondary"
                sx={{ fontWeight: 700 }}
              />
              <Chip
                label="Spring Boot 3+"
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
              Spring Boot Microservices: Production Architecture &amp; Distributed Patterns
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
              A comprehensive blueprint for engineering resilient, high-throughput Spring Boot 3+ microservices:
              Spring Cloud Gateway, Resilience4j fault boundaries, Apache Kafka event streams, and GraalVM AOT.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
              <Link href="/microservices?topic=ingress-routing&subtopic=api-gateway" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ fontWeight: 700, px: 3, py: 1.25 }}
                >
                  Explore API Gateway Patterns
                </Button>
              </Link>
              <Link href="/kafka" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  sx={{ fontWeight: 600, px: 3, py: 1.25 }}
                >
                  Kafka Event Streaming Guide
                </Button>
              </Link>
            </Stack>
          </Box>

          <Divider sx={{ mb: 6 }} />

          {/* Section 1: Architecture Topology Blueprint */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              1. Spring Boot 3+ Cloud Native Topology Blueprint
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Modern Spring Boot architectures combine declarative gateway filters, virtual thread Tomcat pools,
              and resilient asynchronous event streams:
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
|                  ENTERPRISE SPRING BOOT 3+ DISTRIBUTED ARCHITECTURE                     |
+-----------------------------------------------------------------------------------------+

                       Public Internet HTTPS Request (OAuth2 Bearer)
                                          |
                                          v
      +---------------------------------------------------------------------+
      |   Spring Cloud Gateway (Reactive Non-Blocking Netty Router)         |
      |   - TokenBucketRateLimiter (Redis-backed RedisRateLimiter)          |
      |   - JwtAuthenticationFilter (Nimbus ReactiveJwtDecoder)             |
      |   - CircuitBreakerFilterFactory (Resilience4j fallback forward)     |
      +---------------------------------------------------------------------+
                          /                                  \\
                         /                                    \\
                        v                                      v
      +-----------------------------------+  +-----------------------------------+
      | Spring Boot Order Service         |  | Spring Boot Payment Service       |
      | - Tomcat (Virtual Threads enabled)|  | - Tomcat (Virtual Threads enabled)|
      | - Resilience4j @CircuitBreaker    |  | - Idempotent Stripe Gateway Client|
      | - Spring Data JPA (HikariCP pool) |  | - PostgreSQL ACID Ledger           |
      +-----------------------------------+  +-----------------------------------+
             |                     |                         |
        (Dual-Write Guard)    (CDC Outbox)              (CDC Outbox)
             v                     v                         v
      +--------------+    +-----------------------------------------------+
      | Postgres DB  |    | Apache Kafka Event Backbone                   |
      | Local ACID   |    | - Topic: order-created.v1 (3 partitions)      |
      +--------------+    | - Topic: order-created.v1.DLT (Dead Letter)   |
                          +-----------------------------------------------+
                                          |
                                          v
      +---------------------------------------------------------------------+
      | Spring Kafka @KafkaListener (AckMode.RECORD, ConcurrentMessageListener)
      | - DefaultErrorHandler (FixedBackOff: 1s, 3 retries)                |
      | - DeadLetterPublishingRecoverer (Auto-route poison pills to DLT)   |
      +---------------------------------------------------------------------+`}
              </Typography>
            </Paper>
          </Box>

          {/* Section 2: Virtual Threads in Spring Boot 3.2+ */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              2. Enabling Virtual Threads in Spring Boot 3.2+
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Starting in Spring Boot 3.2 on Java 21, enabling virtual threads replaces Tomcat&apos;s 200 platform
              thread worker pool with an unconstrained virtual thread executor:
            </Typography>

            <IntelliJCodeBlock
              title="Virtual Thread & Connection Pool Resource Contract"
              code={`# =========================================================================
# ARCHITECTURE CONFIGURATION SPECIFICATION: Resource & Thread Invariants
# =========================================================================
spring:
  threads:
    virtual:
      enabled: true # Invariant: Switches Tomcat & @Async dispatchers to Virtual Threads
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 10
      connection-timeout: 30000
  kafka:
    consumer:
      bootstrap-servers: kafka-broker:9092
      group-id: order-processing-group
      enable-auto-commit: false # Invariant: Manual offset acknowledgment required
      auto-offset-reset: earliest`}
            />
          </Box>

          {/* Section 3: Resilience4j Integration */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              3. Resilience4j Circuit Breaker &amp; Fallback
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Spring Boot integrates Resilience4j via annotations to gracefully degrade under downstream failure:
            </Typography>

            <IntelliJCodeBlock
              title="Resilience Circuit Breaker & Fallback Class Model"
              code={`// =========================================================================
// CLASS MODEL & FAULT TOLERANCE: Circuit Breaker & Fallback Contract
// Invariant: Non-blocking fallback return under downstream saturation
// =========================================================================
public class InventoryClientService {
    private final RestClient restClient;

    public InventoryClientService(RestClient.Builder builder) {
        this.restClient = builder.baseUrl("https://inventory.internal.net").build();
    }

    // Algorithm: Circuit Breaker + Retry Protected Invocation
    @CircuitBreaker(name = "inventoryService", fallbackMethod = "fallbackInventoryCheck")
    @Retry(name = "inventoryService")
    public InventoryStatus checkStock(String productId) {
        return restClient.get()
            .uri("/api/v1/stock/{id}", productId)
            .retrieve()
            .body(InventoryStatus.class);
    }

    // Fallback Algorithm: Executed when circuit trips or timeouts occur
    public InventoryStatus fallbackInventoryCheck(String productId, Throwable ex) {
        return InventoryStatus.estimatedAvailable(productId);
    }
}`}
            />
          </Box>

          {/* Section 4: Trade-Off Matrix */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              4. Spring Boot Architecture Trade-Off Matrix
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Evaluating execution models for production cloud deployments:
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: "action.hover" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Model / Feature</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Startup Time</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Memory Footprint (RSS)</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Peak Throughput (QPS)</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Best Suited Scenario</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Spring MVC + Virtual Threads</TableCell>
                    <TableCell>~1.5 to 3.0 seconds</TableCell>
                    <TableCell>~180MB to 350MB</TableCell>
                    <TableCell>Very High (Equal to WebFlux on I/O)</TableCell>
                    <TableCell>Default choice for microservices, standard blocking DB queries, REST APIs</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Spring WebFlux (Reactive)</TableCell>
                    <TableCell>~1.2 to 2.5 seconds</TableCell>
                    <TableCell>~120MB to 220MB</TableCell>
                    <TableCell>Very High</TableCell>
                    <TableCell>API Gateways, SSE streaming, bi-directional long-polling WebSockets</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>GraalVM Native Image (AOT)</TableCell>
                    <TableCell>&lt; 50 milliseconds</TableCell>
                    <TableCell>~35MB to 70MB</TableCell>
                    <TableCell>High (Lacks runtime C2 JIT optimization)</TableCell>
                    <TableCell>Serverless functions (AWS Lambda), scale-to-zero Knative pods</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Section 5: FAQ */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 3 }}>
              Frequently Asked Questions (Spring Boot Architecture)
            </Typography>

            <Stack spacing={3}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  How do you enable and configure Java 21 Virtual Threads in Spring Boot 3.2+?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  In Spring Boot 3.2 and higher running on Java 21, you simply set &apos;spring.threads.virtual.enabled=true&apos; in application.properties or application.yml. Spring Boot automatically configures embedded Tomcat and async task executors to use Virtual Threads for all incoming HTTP requests.
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Should you choose Spring WebFlux Reactive or Spring MVC with Virtual Threads?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  With Java 21 Virtual Threads, Spring MVC achieves comparable high-concurrency throughput to Spring WebFlux without the cognitive complexity of reactive Mono/Flux streams, difficult debugging, or reactive database drivers (R2DBC). Spring MVC + Virtual Threads is recommended for most enterprise microservices unless you require streaming Server-Sent Events (SSE) or bi-directional WebSockets across hundreds of thousands of concurrent idle connections.
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  How does Spring Kafka handle consumer failures with Dead Letter Topics (DLT)?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  Spring Kafka provides DeadLetterPublishingRecoverer paired with a CommonErrorHandler (e.g., DefaultErrorHandler with BackOff). When a poisoned message repeatedly fails after configured retry attempts, Spring Kafka automatically forwards the raw payload and failure exception metadata to a &apos;.DLT&apos; topic, allowing consumer lag to progress without blocking the partition.
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
            <HubRoundedIcon sx={{ fontSize: 48, color: "secondary.main", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
              Connect Spring Boot with Apache Kafka Event Streams
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "650px", mx: "auto", mb: 3 }}>
              Master partition rebalance protocols, exactly-once semantics (EOS),
              and change data capture (CDC) with Debezium.
            </Typography>
            <Link href="/kafka" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                size="large"
                color="secondary"
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
