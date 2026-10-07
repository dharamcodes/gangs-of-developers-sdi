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
import TerminalRoundedIcon from "@mui/icons-material/TerminalRounded";
import PillarPageLayout from "../components/PillarPageLayout";
import IntelliJCodeBlock from "../components/IntelliJCodeBlock";

export const metadata: Metadata = {
  title: "Java 21 Architecture: Virtual Threads & Loom",
  description: "Authoritative guide to Java 21 LTS: Project Loom Virtual Threads, Structured Concurrency, Scoped Values, Generational ZGC, and sub-millisecond GC pauses.",
  alternates: {
    canonical: "https://www.gangsofdevelopers.com/java",
  },
  openGraph: {
    title: "Java 21 Architecture: Virtual Threads, JVM Internals & Concurrency",
    description:
      "Deep dive into Java 21: Project Loom virtual threads, structured concurrency, ZGC sub-millisecond GC pauses, and memory architecture.",
    url: "https://www.gangsofdevelopers.com/java",
    siteName: "Gangs of Developers (GOD)",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Java 21 Architecture: Virtual Threads & JVM Internals",
    description:
      "Master Project Loom, Structured Concurrency, Generational ZGC, and high-performance Java.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://www.gangsofdevelopers.com/java#article",
      "headline": "Java 21 Architecture: Virtual Threads, JVM Internals & Concurrency",
      "description":
        "Authoritative guide to Java 21 LTS: Project Loom Virtual Threads, Structured Concurrency, Scoped Values, Generational ZGC vs G1 GC, and high-throughput low-latency concurrency.",
      "url": "https://www.gangsofdevelopers.com/java",
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
        "Java 21",
        "Virtual Threads",
        "Project Loom",
        "Structured Concurrency",
        "JVM Internals",
        "Generational ZGC",
        "Java Memory Model",
      ],
      "inLanguage": "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.gangsofdevelopers.com/java#breadcrumb",
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
          "name": "Java 21 Architecture",
          "item": "https://www.gangsofdevelopers.com/java",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.gangsofdevelopers.com/java#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is thread pinning in Java 21 Virtual Threads and how do you avoid it?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Thread pinning occurs when a virtual thread executes inside a synchronized block/method or native JNI call. When pinned, the virtual thread cannot be unmounted from its underlying OS carrier thread during blocking I/O, negating the throughput benefits of Loom. To prevent pinning, replace synchronized blocks with java.util.concurrent.locks.ReentrantLock, which fully supports virtual thread unmounting.",
          },
        },
        {
          "@type": "Question",
          "name": "When should you choose Generational ZGC over G1 GC in Java 21?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Generational ZGC is optimized for ultra-low latency requirements where max stop-the-world GC pauses must stay below 1 millisecond regardless of heap size (from 16MB to 16TB). Choose Generational ZGC for financial trading, payment authorization, and real-time gaming services. For standard batch throughput applications where 50ms pauses are acceptable and maximum raw CPU throughput is required, G1 GC remains slightly more CPU-efficient.",
          },
        },
        {
          "@type": "Question",
          "name": "How does Structured Concurrency improve reliability over CompletableFuture?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "CompletableFuture pipelines often lead to thread leaks and orphaned asynchronous tasks when one subtask fails or times out while sibling tasks continue consuming CPU. Structured Concurrency treats concurrent subtasks as a single unit of work within a lexical scope: if one subtask fails, all siblings are automatically cancelled, and thread dumps retain clear parent-child call hierarchies.",
          },
        },
      ],
    },
  ],
};

export default function JavaPage() {
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
                label="Modern Java Architecture"
                size="small"
                color="primary"
                sx={{ fontWeight: 700 }}
              />
              <Chip
                label="Java 21 LTS"
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
              Java 21 Architecture: Virtual Threads, Structured Concurrency &amp; JVM Internals
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
              Deep dive into Java 21 Long-Term Support (LTS): Project Loom virtual thread scheduling,
              thread pinning elimination, Generational ZGC sub-millisecond pauses, and structured task scopes.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
              <Link href="/spring-boot" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ fontWeight: 700, px: 3, py: 1.25 }}
                >
                  Spring Boot 3+ Guide
                </Button>
              </Link>
              <Link href="/gof-design-patterns" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  sx={{ fontWeight: 600, px: 3, py: 1.25 }}
                >
                  GoF Patterns in Java 21
                </Button>
              </Link>
            </Stack>
          </Box>

          <Divider sx={{ mb: 6 }} />

          {/* Section 1: Project Loom Blueprint */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              1. Virtual Threads Architecture: Project Loom M:N Scheduling
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Traditional Java platform threads are 1:1 wrappers around operating system kernel threads.
              Each consumes ~1MB of memory and costs hundreds of nanoseconds to context switch.
              <strong>Virtual Threads</strong> are lightweight user-mode threads scheduled by the JVM on a small pool
              of ForkJoinPool carrier threads:
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
|                  JAVA 21 PROJECT LOOM M:N VIRTUAL THREAD SCHEDULER                      |
+-----------------------------------------------------------------------------------------+

  1,000,000 Active Virtual Threads (User-Mode Fibers: ~1KB each in Java Heap)
  [ VT 1 ]  [ VT 2 ]  [ VT 3 ]  [ VT 4 ]  [ VT 5 ] ... [ VT 1,000,000 ]
     |         |         |         |         |
     +---------+---------+---------+---------+
                         |
                         v (JVM Scheduler: ForkJoinPool)
       +---------------------------------------------------+
       |   Carrier Threads (Platform OS Threads: e.g. 16)  |
       |   [ Carrier-1 ]  [ Carrier-2 ] ... [ Carrier-16 ] |
       +---------------------------------------------------+
                         |
                         | (When VT blocks on Socket I/O or DB lock)
                         v
       +---------------------------------------------------+
       | 1. Virtual Thread stack unmounted from Carrier    |
       | 2. Continuation stored in Heap                    |
       | 3. Carrier thread immediately executes next VT    |
       | 4. Once I/O completes, VT re-enqueued to run      |
       +---------------------------------------------------+`}
              </Typography>
            </Paper>
          </Box>

          {/* Section 2: Thread Pinning */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              2. Eliminating Thread Pinning: Synchronized vs. ReentrantLock
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              When a virtual thread executes inside a <code>synchronized</code> block or native JNI call,
              it becomes <strong>pinned</strong> to its underlying OS carrier thread. If blocking I/O occurs
              while pinned, the carrier thread cannot be released, rapidly causing thread starvation across the entire cluster:
            </Typography>

            <IntelliJCodeBlock
              title="Carrier Thread Unpinning Algorithm & Locking Contract"
              code={`// =========================================================================
// ALGORITHM & CONCURRENCY MODEL: Carrier Thread Pinning Prevention
// Invariant: ReentrantLock unmounts continuation from OS carrier thread
// =========================================================================
private final ReentrantLock lock = new ReentrantLock();

// Algorithm: Non-pinning blocking I/O dispatch
public byte[] fetchOrderDataSafe(String orderId) {
    lock.lock();
    try {
        return httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray()).body();
    } catch (InterruptedException | IOException e) {
        Thread.currentThread().interrupt();
        throw new RuntimeException(e);
    } finally {
        lock.unlock();
    }
}`}
            />
          </Box>

          {/* Section 3: Structured Concurrency */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              3. Structured Concurrency (JEP 453)
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Instead of loose, uncoordinated <code>CompletableFuture</code> chains, Java 21 introduces
              Structured Concurrency to treat concurrent tasks as a single unit of work:
            </Typography>

            <IntelliJCodeBlock
              title="Structured Concurrency Aggregation Algorithm & Task Tree Model"
              code={`// =========================================================================
// TASK TREE MODEL & ALGORITHM: Short-Circuiting Parallel Aggregation
// Invariant: StructuredTaskScope cancels sibling fibers on any fault
// =========================================================================
public OrderDetails aggregateOrderDetails(String orderId) throws Exception {
    try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
        // Algorithm Step 1: Fork concurrent subtasks onto virtual threads
        Supplier<User> userTask = scope.fork(() -> userService.getUser(orderId));
        Supplier<Order> orderTask = scope.fork(() -> orderService.getOrder(orderId));
        Supplier<Inventory> inventoryTask = scope.fork(() -> inventoryService.checkInventory(orderId));

        // Algorithm Step 2: Await completion barrier with fail-fast propagation
        scope.join().throwIfFailed();

        // Algorithm Step 3: Materialize unified aggregation aggregate
        return new OrderDetails(userTask.get(), orderTask.get(), inventoryTask.get());
    }
}`}
            />
          </Box>

          {/* Section 4: GC Comparison */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              4. Garbage Collection Internals: Generational ZGC vs. G1 GC
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Java 21 delivers <strong>Generational ZGC</strong>, combining colored pointers with young/old generational partitioning:
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: "action.hover" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Collector</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Max Pause Time (STW)</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Heap Size Scalability</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Throughput Overhead</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Recommended Workload</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Generational ZGC (<code>-XX:+UseZGC -XX:+ZGenerational</code>)</TableCell>
                    <TableCell>&lt; 1 millisecond (typically &lt; 250&micro;s)</TableCell>
                    <TableCell>16MB to 16TB without pause degradation</TableCell>
                    <TableCell>~2% to 4% CPU load barrier tax</TableCell>
                    <TableCell>Low-latency microservices, high-frequency trading, real-time gaming</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>G1 GC (<code>-XX:+UseG1GC</code>)</TableCell>
                    <TableCell>Configurable target (default: 200ms, tuned: 25ms)</TableCell>
                    <TableCell>4GB to 64GB optimal</TableCell>
                    <TableCell>Lowest CPU overhead for general apps</TableCell>
                    <TableCell>General enterprise CRUD applications, batch processing, memory constrained</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Parallel GC (<code>-XX:+UseParallelGC</code>)</TableCell>
                    <TableCell>High (proportional to live data in heap)</TableCell>
                    <TableCell>Small to medium heaps (&lt; 16GB)</TableCell>
                    <TableCell>Zero load barrier overhead (max batch throughput)</TableCell>
                    <TableCell>Offline data crunching, MapReduce, batch computation</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Section 5: FAQ */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 3 }}>
              Frequently Asked Questions (Java 21 Architecture)
            </Typography>

            <Stack spacing={3}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  What is thread pinning in Java 21 Virtual Threads and how do you avoid it?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  Thread pinning occurs when a virtual thread executes inside a synchronized block/method or native JNI call. When pinned, the virtual thread cannot be unmounted from its underlying OS carrier thread during blocking I/O, negating the throughput benefits of Loom. To prevent pinning, replace synchronized blocks with java.util.concurrent.locks.ReentrantLock, which fully supports virtual thread unmounting.
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  When should you choose Generational ZGC over G1 GC in Java 21?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  Generational ZGC is optimized for ultra-low latency requirements where max stop-the-world GC pauses must stay below 1 millisecond regardless of heap size (from 16MB to 16TB). Choose Generational ZGC for financial trading, payment authorization, and real-time gaming services. For standard batch throughput applications where 50ms pauses are acceptable and maximum raw CPU throughput is required, G1 GC remains slightly more CPU-efficient.
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  How does Structured Concurrency improve reliability over CompletableFuture?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  CompletableFuture pipelines often lead to thread leaks and orphaned asynchronous tasks when one subtask fails or times out while sibling tasks continue consuming CPU. Structured Concurrency treats concurrent subtasks as a single unit of work within a lexical scope: if one subtask fails, all siblings are automatically cancelled, and thread dumps retain clear parent-child call hierarchies.
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
            <TerminalRoundedIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
              Scale Java Microservices to Millions of Concurrent Users
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "650px", mx: "auto", mb: 3 }}>
              Explore how Spring Boot 3+ leverages Java 21 virtual threads, Spring Cloud Gateway,
              and Kafka consumer topologies.
            </Typography>
            <Link href="/spring-boot" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{ fontWeight: 700, px: 4, py: 1.5 }}
              >
                Explore Spring Boot Architecture
              </Button>
            </Link>
          </Paper>
        </Container>
      </PillarPageLayout>
    </>
  );
}
