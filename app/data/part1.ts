import type { TopicGroup } from "./types";

export const PART_1_TOPICS: TopicGroup[] = [
  {
    id: "core-fundamentals",
    topicNumber: 1,
    title: "Core Fundamentals",
    description:
      "The architectural bedrock of distributed systems: requirements engineering, scaling patterns, SLA mathematics, consistency models, and capacity planning.",
    subtopics: [
      {
        id: "functional-vs-non-functional-requirements",
        topicId: "core-fundamentals",
        topicTitle: "Core Fundamentals",
        topicNumber: 1,
        subtopicNumber: "1.1",
        title: "Functional vs Non-Functional Requirements",
        subtitle:
          "Separating what a system does from the operational constraints and quality attributes under which it must perform.",
        readingTime: "6 min read",
        difficulty: "Foundational",
        keyTakeaways: [
          "Functional requirements define user-visible features and API behaviors, while non-functional requirements (NFRs) dictate architecture.",
          "Two systems with identical functional requirements (e.g., 'post a message') require radically different architectures when NFRs shift from 100 DAU to 500M DAU.",
          "Always quantify NFRs during the first 5 minutes of a system design interview using concrete metrics (p99 latency, availability nines, RPO/RTO).",
        ],
        architectureDiagram: `+-------------------------------------------------------------------+
|                     SYSTEM DESIGN REQUIREMENTS                    |
+---------------------------------+---------------------------------+
                                  |
              +-------------------+-------------------+
              |                                       |
              v                                       v
+---------------------------+           +---------------------------+
|  FUNCTIONAL REQUIREMENTS  |           | NON-FUNCTIONAL REQ (NFRs) |
|      ("What it does")     |           |   ("How well it does it") |
+---------------------------+           +---------------------------+
| - Post a tweet / photo    |           | - Availability: 99.99%    |
| - Follow another user     |           | - Read p99 < 150ms        |
| - Fetch home timeline     |           | - Eventual Consistency    |
| - Search by hashtag       |           | - Scale: 50k writes/sec   |
+-------------+-------------+           +-------------+-------------+
              |                                       |
              v                                       v
     [ API & Data Model ]                  [ Distributed Topology ]`,
        sections: [
          {
            heading: "Why Non-Functional Requirements Drive Architecture",
            body: "In a small CRUD application, functional requirements dominate engineering effort. At scale, non-functional requirements (NFRs)—also known as quality attributes or '-ilities'—are the primary drivers of architectural complexity. Anyone can build a timeline query using a SQL JOIN for 1,000 users; doing it for 300 million daily active users with sub-200ms p99 latency forces you to introduce fan-out-on-write caches, celebrity hybrid fan-out, and read-optimized stores.",
            bullets: [
              "Functional Requirements: Deterministic business rules, API endpoints, state transitions, and user workflows.",
              "Non-Functional Requirements: Scalability, availability, latency targets, consistency guarantees, durability, security, and cost ceilings.",
              "Extended / Out-of-Scope Requirements: Analytics pipelines, fraud detection, and GDPR compliance that should be explicitly scoped in or out.",
            ],
            codeSnippet: {
              title: "Structured Interview Requirement Specification",
              code: `interface SystemDesignCharter {
  functional: {
    coreFeatures: string[];
    outOfScope: string[];
  };
  nonFunctional: {
    scale: { dau: number; peakReadQps: number; peakWriteQps: number };
    latency: { readP50Ms: number; readP99Ms: number; writeP99Ms: number };
    availabilityTarget: "99.9%" | "99.99%" | "99.999%";
    consistencyModel: "Strong" | "Eventual" | "Causal" | "Read-Your-Writes";
    durability: { rpoSeconds: number; rtoSeconds: number };
  };
}`,
            },
          },
          {
            heading: "Translating NFRs into Concrete Architectural Choices",
            body: "Every NFR statement maps directly to a set of infrastructure patterns. When you state an NFR in an interview, immediately pair it with the architectural consequence so the interviewer sees your causal reasoning rather than a memorized checklist.",
            bullets: [
              "Read-heavy (100:1 read/write) + Eventual Consistency -> Multi-tier caching (CDN + Redis) and read replicas.",
              "Strict zero-data-loss (RPO = 0) + Strong Consistency -> Quorum or synchronous replication with Write-Ahead Logging (WAL) and fsync.",
              "Ultra-low latency (< 50ms globally) -> Edge compute, Geo-DNS routing, and multi-region active-active replication.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "Strict NFRs (99.999% SLA, Strong Consistency)",
            pros: "Zero data anomalies, simple mental model for application developers, enterprise-grade trust.",
            cons: "High write latency across regions, 3x-5x infrastructure cost, complex consensus protocols (Raft/Paxos).",
            bestFor: "Financial ledgers, billing systems, inventory reservation, and authentication services.",
          },
          {
            option: "Relaxed NFRs (99.9% SLA, Eventual Consistency)",
            pros: "Ultra-fast local reads/writes, resilient to network partitions, dramatically lower cloud spend.",
            cons: "Users may briefly see stale data, requires conflict resolution (LWW or CRDTs) in the app layer.",
            bestFor: "Social media feeds, view counters, product recommendations, and activity streams.",
          },
        ],
        interviewTip:
          "Never ask the interviewer 'What are the non-functional requirements?' Instead, propose sensible defaults based on the domain: 'Since this is a social feed, I suggest optimizing for high availability and sub-200ms p99 read latency with eventual consistency, rather than strong consistency. Does that align with your expectations?'",
      },
      {
        id: "scalability-vertical-vs-horizontal",
        topicId: "core-fundamentals",
        topicTitle: "Core Fundamentals",
        topicNumber: 1,
        subtopicNumber: "1.2",
        title: "Scalability — Vertical vs Horizontal",
        subtitle:
          "Comparing scaling up (bigger machines) against scaling out (more machines) across stateless compute and stateful data tiers.",
        readingTime: "7 min read",
        difficulty: "Foundational",
        keyTakeaways: [
          "Vertical scaling (scale-up) is operationally simple and eliminates network hop overhead, but hits hard hardware ceilings and creates a Single Point of Failure (SPOF).",
          "Horizontal scaling (scale-out) provides near-infinite elasticity and fault isolation, but demands stateless services and data partitioning.",
          "Modern architectures combine both: horizontally scaled stateless microservices paired with vertically beefy, horizontally sharded database nodes.",
        ],
        architectureDiagram: `VERTICAL SCALING (Scale Up)          HORIZONTAL SCALING (Scale Out)
+-------------------------+          +---------+    +---------------+
|   Single Giant Server   |          |         |--->| App Server 01 |
|  128 vCPU / 2 TB RAM    |          |  Load   |    +---------------+
|  +-------------------+  |   VS.    | Balancer|--->| App Server 02 |
|  |  Monolith / DB    |  |          |         |    +---------------+
|  +-------------------+  |          |         |--->| App Server 03 |
+-------------------------+          +---------+    +---------------+
Hard ceiling & SPOF risk             Elastic & Fault-tolerant`,
        sections: [
          {
            heading: "The Mechanics of Vertical vs Horizontal Scaling",
            body: "Scalability measures a system's ability to handle growing load by adding resources. Vertical scaling adds CPU, RAM, or faster NVMe disks to an existing node. Horizontal scaling adds more commodity nodes to a pool behind a load balancer or partitioning router. While stateless web tiers scale horizontally with trivial effort, stateful databases require careful sharding, replication, and rebalancing to scale out.",
            bullets: [
              "Stateless Tier Prerequisite: Externalize session state to Redis or JWTs so any horizontal node can serve any request.",
              "NUMA & Lock Contention: Even on a 256-core machine, vertical scaling suffers diminishing returns due to CPU cache coherence overhead and kernel lock contention.",
              "Autoscaling Speed: Horizontal scaling relies on container spin-up times and AMI boot metrics (CPU > 70%, request queue depth).",
            ],
            codeSnippet: {
              title: "Stateless Service Pattern Enabling Horizontal Scale",
              code: `// BAD: In-memory session pins user to a single vertical box
const localSessions = new Map<string, UserSession>();

// GOOD: Externalized state in Redis Cluster allows N horizontal replicas
export async function authenticateRequest(req: Request, redis: RedisClient) {
  const sessionId = req.headers.get("x-session-id");
  if (!sessionId) throw new Error("Unauthorized");
  // Any of the 500 stateless pods can validate this session in <1ms
  const payload = await redis.get(\`session:\${sessionId}\`);
  return payload ? JSON.parse(payload) : null;
}`,
            },
          },
          {
            heading: "Pragmatic Scaling Progression in Production",
            body: "Premature horizontal sharding of databases is one of the costliest engineering mistakes. A single modern AWS RDS instance (`db.r7g.16xlarge` with 64 vCPUs and 512 GB RAM) can comfortably handle 25,000+ simple queries per second. In practice, teams scale vertically first, add read replicas second, introduce caching third, and shard horizontally only when write throughput or storage volume exceeds single-node physics.",
            bullets: [
              "Stage 1: Vertical scale-up of primary database + horizontal auto-scaling of stateless API servers.",
              "Stage 2: Offload 80-95% of reads via Redis caching and read replicas.",
              "Stage 3: Horizontal partitioning (sharding) by tenant or entity ID when write IOPS saturate the largest instance.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "Vertical Scaling (Scale Up)",
            pros: "Zero distributed systems complexity, ACID transactions work natively in memory, no cross-node network serialization.",
            cons: "Hard physical limits (~24TB RAM max), non-linear cloud pricing, requires downtime or failover to resize, single point of failure.",
            bestFor: "Early-to-mid stage relational databases, in-memory graph processing, and workloads with tight transactional coupling.",
          },
          {
            option: "Horizontal Scaling (Scale Out)",
            pros: "Linear capacity growth using commodity VMs, automatic self-healing when nodes die, elastic scale-to-zero or burst capability.",
            cons: "Introduces network partitions, distributed joins, clock skew, deployment orchestration, and data rebalancing headaches.",
            bestFor: "Stateless API/web tiers, high-throughput NoSQL stores (Cassandra/DynamoDB), and event streaming clusters (Kafka).",
          },
        ],
        interviewTip:
          "Show architectural maturity by noting that stateless services should be scaled horizontally from day one for high availability, whereas relational databases should be scaled vertically (plus read replicas) until write volume provably exceeds ~10k-20k writes/sec.",
      },
      {
        id: "availability-and-reliability",
        topicId: "core-fundamentals",
        topicTitle: "Core Fundamentals",
        topicNumber: 1,
        subtopicNumber: "1.3",
        title: "Availability & Reliability",
        subtitle:
          "Mastering the mathematics of 'Nines', MTBF vs MTTR, fault tolerance patterns, and composite SLA calculations.",
        readingTime: "7 min read",
        difficulty: "Foundational",
        keyTakeaways: [
          "Availability is the percentage of time a system responds successfully (`MTBF / (MTBF + MTTR)`), while Reliability is the probability it operates without failure over a given interval.",
          "When components are placed in series, overall availability multiplies and degrades; when placed in parallel (redundancy), availability compounds upward.",
          "Improving Mean Time To Recovery (MTTR) via automated failover is far cheaper and more effective than trying to make Mean Time Between Failures (MTBF) infinite.",
        ],
        architectureDiagram: `SERIES DEPENDENCY (Availability Degrades: 99.9% x 99.9% = 99.8%)
[ Client ] ---> [ Service A (99.9%) ] ---> [ Database B (99.9%) ]

PARALLEL REDUNDANCY (Availability Improves: 1 - (0.001 x 0.001) = 99.9999%)
                +---> [ Node 1 (99.9%) ] ---+
[ Client ] -----+                           +---> [ Response ]
                +---> [ Node 2 (99.9%) ] ---+`,
        sections: [
          {
            heading: "The Mathematics of 'Nines', MTBF, and MTTR",
            body: "Availability is formally expressed as `Availability = MTBF / (MTBF + MTTR)`, where MTBF is Mean Time Between Failures and MTTR is Mean Time To Recovery. Each additional 'nine' reduces permissible annual downtime by an order of magnitude—from 8.76 hours/year at 99.9% ('Three Nines') to just 5.26 minutes/year at 99.999% ('Five Nines'). At Five Nines, human-in-the-loop incident response is mathematically impossible; detection and failover must be 100% automated.",
            bullets: [
              "99.9% (3 Nines): 8h 45m downtime/year | 43.8m/month — Standard internal microservice SLA.",
              "99.99% (4 Nines): 52m 36s downtime/year | 4.38m/month — Production customer-facing e-commerce/SaaS tier.",
              "99.999% (5 Nines): 5m 15s downtime/year | 26.3s/month — Core payment rails, emergency services, DNS root servers.",
            ],
            codeSnippet: {
              title: "Composite SLA Calculator for Series vs Parallel Topologies",
              code: `// In series: all dependencies must be up simultaneously
export function seriesAvailability(availabilities: number[]): number {
  return availabilities.reduce((acc, curr) => acc * curr, 1);
}

// In parallel (active-active): system only fails if ALL replicas fail
export function parallelAvailability(replicaAvailability: number, count: number): number {
  const probabilityOfSingleFailure = 1 - replicaAvailability;
  const probabilityAllFail = Math.pow(probabilityOfSingleFailure, count);
  return 1 - probabilityAllFail;
}

// Example: Two 99.9% nodes in parallel yield 99.9999% (Six Nines)!`,
            },
          },
          {
            heading: "Engineering for High Availability (Eliminating SPOFs)",
            body: "A system is only as available as its weakest single point of failure (SPOF). Achieving 99.99%+ requires redundancy across every layer—DNS, Load Balancers, Compute, Cache, and Storage—paired with graceful degradation and blast-radius containment (bulkheads, circuit breakers).",
            bullets: [
              "Active-Passive Failover: Standby node takes over via heartbeat/VIP promotion when primary dies (higher RTO, simpler consistency).",
              "Active-Active Multi-AZ/Multi-Region: All nodes serve traffic concurrently; load balancer strips unhealthy nodes within seconds.",
              "Graceful Degradation: If the recommendation engine crashes, serve a static 'Top Trending' list from CDN rather than returning HTTP 500.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "Active-Passive Redundancy",
            pros: "No write-write conflicts, strong consistency is easy to maintain, predictable failover state.",
            cons: "50% of hardware sits idle (or underutilized), failover takes 10-60 seconds during which writes fail (nonzero MTTR).",
            bestFor: "Primary relational databases (PostgreSQL/MySQL) with synchronous standby in another Availability Zone.",
          },
          {
            option: "Active-Active Redundancy",
            pros: "Near-zero RTO (instantaneous load balancer rerouting), 100% fleet utilization during normal operations, achieves 99.999%.",
            cons: "Requires conflict resolution (CRDTs/last-write-wins) or distributed consensus if stateful writes occur on both sides.",
            bestFor: "Stateless microservices, CDN edge PoPs, and multi-master databases like DynamoDB Global Tables.",
          },
        ],
        interviewTip:
          "If an interviewer asks for 99.99% availability, audit your diagram from top to bottom and explicitly call out how you eliminate every Single Point of Failure: 'We run two L7 Load Balancers in active-active across AZs, stateless pods across 3 AZs, and a primary DB with automated synchronous standby failover.'",
      },
      {
        id: "latency-vs-throughput",
        topicId: "core-fundamentals",
        topicTitle: "Core Fundamentals",
        topicNumber: 1,
        subtopicNumber: "1.4",
        title: "Latency vs Throughput",
        subtitle:
          "Understanding Little's Law, tail latency amplification (p95/p99), queuing theory, and the tension between batching and responsiveness.",
        readingTime: "7 min read",
        difficulty: "Foundational",
        keyTakeaways: [
          "Latency is the time to complete a single operation (ms), whereas Throughput is the number of operations completed per unit of time (QPS / MB/s).",
          "Average latency is a lie: p99 and p99.9 tail latencies dictate real user experience, especially in microservice fan-out trees where slow tails compound.",
          "By Little's Law (`L = λW`) and queuing theory, as resource utilization approaches 80-90%, queuing delay causes latency to spike exponentially even while throughput plateaus.",
        ],
        architectureDiagram: `LATENCY vs UTILIZATION (Queuing Knee)      TAIL LATENCY FAN-OUT AMPLIFICATION
Latency (ms)                               [ API Gateway ] (p99 = 1 - 0.99^10 = 9.6% slow!)
  ^                  /                           |
  |                 /                   +--------+--------+--------+
  |                /  <- 85% Knee       |        |        |        |
  |              /                      v        v        v        v
  |____________/                     [Svc 1]  [Svc 2]  ...     [Svc 10]
  +--------------------->            (Each service has 1% chance of p99 spike)
  0%        50%       100% CPU`,
        sections: [
          {
            heading: "Little's Law, Queuing Theory, and Tail Latency Amplification",
            body: "Latency measures how long a single request takes from client dispatch to response receipt. Throughput measures how many requests a system processes per second. Little's Law states `L = λ × W` (Concurrent requests in system = Arrival rate × Mean response time). When arrival rate approaches the system's maximum processing rate, requests sit in queues, causing latency to skyrocket non-linearly. Worse yet, in a microservice architecture where 1 user request fans out to 20 parallel backend services, even if each service has a 99% chance of responding fast (<10ms), the probability that ALL 20 respond fast is `0.99^20 = 81.8%`—meaning nearly 20% of user requests experience tail latency!",
            bullets: [
              "p50 (Median): Half of requests are faster. Masks severe outliers.",
              "p99 / p99.9 (Tail Latency): Caused by GC pauses, noisy neighbors, TCP retransmits, cache misses, and disk compaction.",
              "Hedged Requests: Send the same read request to a second replica if the first doesn't respond within the p95 threshold to chop off the p99 tail.",
            ],
            codeSnippet: {
              title: "Hedged Read Request Pattern to Curb p99 Tail Latency",
              code: `export async function hedgedRead<T>(
  primaryCall: () => Promise<T>,
  backupCall: () => Promise<T>,
  p95TimeoutMs = 15
): Promise<T> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      // Primary exceeded p95! Fire backup replica concurrently
      backupCall().then((res) => {
        if (!settled) { settled = true; resolve(res); }
      }).catch(() => {});
    }, p95TimeoutMs);

    primaryCall().then((res) => {
      clearTimeout(timer);
      if (!settled) { settled = true; resolve(res); }
    }).catch((err) => { if (!settled) reject(err); });
  });
}`,
            },
          },
          {
            heading: "Trading Latency for Throughput via Batching",
            body: "Many high-scale systems intentionally sacrifice a few milliseconds of latency to achieve massive gains in throughput. Instead of performing a network round-trip and disk fsync for every single message, systems like Kafka and group-commit databases buffer records for `5-10ms` (or up to `64KB`) and flush them in a single sequential I/O operation.",
            bullets: [
              "Micro-batching (Kafka `linger.ms`): Waits 5ms to coalesce 500 messages into 1 compressed TCP packet, boosting throughput 10x.",
              "Pipelining (Redis): Sends 50 commands in a single socket write without waiting for individual RTTs.",
              "Asynchronous Offloading: Return `202 Accepted` in 5ms to keep user latency low, and process heavy work via background worker queues.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "Optimize for Ultra-Low Latency (No Batching)",
            pros: "Immediate per-request completion, ideal for interactive user-facing request/response loops.",
            cons: "High per-message syscall, network header, and disk IOPS overhead; saturates CPU and network cards at lower QPS.",
            bestFor: "Real-time bidding (RTB), gaming servers, interactive UI APIs, and high-frequency trading.",
          },
          {
            option: "Optimize for High Throughput (Micro-Batching & Compression)",
            pros: "10x-50x higher records/sec per core, sequential disk writes, high compression ratios across batch payloads.",
            cons: "Adds a deterministic baseline latency floor (`linger.ms` wait time) to every single item.",
            bestFor: "Log ingestion, telemetry pipelines, Kafka producers, analytics warehouses, and database group commits.",
          },
        ],
        interviewTip:
          "Never say 'latency should be under 100ms.' Always specify the percentile: 'We will target p50 read latency under 20ms and p99 read latency under 100ms.' This immediately signals senior production experience.",
      },
      {
        id: "cap-theorem",
        topicId: "core-fundamentals",
        topicTitle: "Core Fundamentals",
        topicNumber: 1,
        subtopicNumber: "1.5",
        title: "CAP Theorem",
        subtitle:
          "Navigating Consistency, Availability, and Partition Tolerance—plus the PACELC extension that governs normal operation.",
        readingTime: "8 min read",
        difficulty: "Intermediate",
        keyTakeaways: [
          "In any distributed system, network partitions (P) are inevitable hardware realities; therefore, CAP is really a choice between Consistency (CP) and Availability (AP) *during a partition*.",
          "CAP's 'Consistency' specifically means Linearizability (every read sees the most recent write), and 'Availability' means every non-failing node returns a non-error response.",
          "The PACELC theorem completes the picture: even when there is NO partition (Else), you must still trade off Latency (L) vs Consistency (C).",
        ],
        architectureDiagram: `            [ Network Partition Occurs (P) ]
             Node A  ---( X Broken Link X )---  Node B
               |                                  |
     +---------+---------+              +---------+---------+
     |                   |              |                   |
     v                   |              |                   v
[ CP System ]            |              |              [ AP System ]
Rejects writes/reads     |              |     Both nodes accept writes
on minority side to      |              |     and serve slightly stale
prevent split-brain.     |              |     reads; reconcile later.
(ZooKeeper, Etcd, HBase) |              |     (Cassandra, DynamoDB)`,
        sections: [
          {
            heading: "Deconstructing CAP: Why 'CA' Systems Do Not Exist",
            body: "Formulated by Eric Brewer and proven by Gilbert and Lynch, the CAP theorem states that a distributed data store can simultaneously provide at most two of three guarantees: Consistency (Linearizability), Availability, and Partition Tolerance. Because switches crash, fiber cables get cut, and GC pauses mimic network drops, Partition Tolerance (P) is non-negotiable in any multi-node system. Thus, architects must decide how the system behaves when nodes cannot talk to each other: cancel operations to preserve a single source of truth (CP), or keep accepting operations and resolve divergence later (AP).",
            bullets: [
              "CP (Consistency + Partition Tolerance): Majority quorum continues; minority partition rejects requests with errors to prevent split-brain.",
              "AP (Availability + Partition Tolerance): All reachable nodes respond using local state, risking stale reads or conflicting writes.",
              "Granular CAP: You don't choose CP or AP for an entire company—you choose CP for the checkout service and AP for the product review feed.",
            ],
            codeSnippet: {
              title: "Quorum Enforcement in a CP vs Tunable AP Store",
              code: `interface QuorumConfig {
  replicationFactorN: number; // e.g., 3 replicas
  writeQuorumW: number;       // Nodes that must ack a write
  readQuorumR: number;        // Nodes queried on a read
}

// Strict Quorum (Strong Consistency / CP behavior): W + R > N
export const strictQuorum: QuorumConfig = {
  replicationFactorN: 3,
  writeQuorumW: 2,
  readQuorumR: 2, // 2 + 2 > 3: Read set is guaranteed to overlap with latest Write set
};

// Sloppy Quorum (High Availability / AP behavior): W + R <= N
export const fastAvailableConfig: QuorumConfig = {
  replicationFactorN: 3,
  writeQuorumW: 1,
  readQuorumR: 1, // Fast & available during partitions, but reads may be stale
};`,
            },
          },
          {
            heading: "Beyond CAP: The PACELC Theorem",
            body: "CAP only describes system behavior during rare network partitions. Daniel Abadi introduced PACELC to capture what happens the other 99.99% of the time: **If there is a Partition (P)**, how does the system trade off **Availability (A) and Consistency (C)**; **Else (E)**, when the system is running normally in the absence of partitions, how does the system trade off **Latency (L) and Consistency (C)**?",
            bullets: [
              "PC/EC (e.g., Spanner, CockroachDB, Etcd): Chooses Consistency during partitions AND pays replication latency during normal operation for strong reads.",
              "PA/EL (e.g., Cassandra, DynamoDB default): Chooses Availability during partitions AND optimizes for low Latency during normal operation via async replication.",
              "PA/EC (e.g., MongoDB configured with majority reads/writes in some topologies): Prioritizes consistency in normal mode or vice versa.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "CP Architecture (e.g., Etcd, Spanner, ZooKeeper)",
            pros: "Guarantees linearizable state, prevents double-spending and split-brain corruption, simplifies application logic.",
            cons: "Returns errors/timeouts if majority quorum is unreachable; higher write latency due to consensus round-trips.",
            bestFor: "Distributed locks, leader election, seat booking, bank balances, and metadata configuration stores.",
          },
          {
            option: "AP Architecture (e.g., Cassandra, Dynamo, Riak)",
            pros: "Always accepts writes (via hinted handoffs) and serves reads even when data centers are severed; lowest possible latency.",
            cons: "Application must handle stale reads, read-repair, vector clocks, LWW (Last-Write-Wins), or CRDT conflict resolution.",
            bestFor: "Shopping carts (Amazon Dynamo model), user status/presence, IoT sensor ingestion, and social likes.",
          },
        ],
        interviewTip:
          "Never say 'I will pick CA from the CAP theorem.' Interviewers treat claiming a distributed system is 'CA' as an immediate red flag because you cannot prevent network partitions in physical reality.",
      },
      {
        id: "consistency-models",
        topicId: "core-fundamentals",
        topicTitle: "Core Fundamentals",
        topicNumber: 1,
        subtopicNumber: "1.6",
        title: "Consistency Models",
        subtitle:
          "The spectrum from Linearizability and Sequential Consistency down to Causal, Read-Your-Writes, and Eventual Consistency.",
        readingTime: "8 min read",
        difficulty: "Advanced",
        keyTakeaways: [
          "Consistency is not binary ('Strong vs Eventual')—it is a rich spectrum trading off coordination latency against anomalous read behaviors.",
          "Linearizability is the strongest single-object model (real-time ordering), whereas Serializability is a multi-object transactional guarantee.",
          "In 80% of user-facing systems, Eventual Consistency paired with 'Read-Your-Own-Writes' session guarantees feels indistinguishable from Strong Consistency at a fraction of the cost.",
        ],
        architectureDiagram: `STRONGEST (Highest Latency / Coordination)
  ^
  |  [ Linearizability ]       -> Real-time global ordering (wall-clock)
  |  [ Sequential Consistency ]-> All nodes see operations in same logical order
  |  [ Causal Consistency ]    -> Causally related ops ordered; concurrent ops free
  |  [ Read-Your-Writes ]      -> Client always sees its own updates immediately
  |  [ Eventual Consistency ]  -> Replicas converge if writes stop (no ordering)
  v
WEAKEST (Lowest Latency / Maximum Availability)`,
        sections: [
          {
            heading: "Navigating the Consistency Spectrum",
            body: "A consistency model is a contract between a distributed data store and the application developer regarding what values a `read(x)` is allowed to return when concurrent writes are happening across replicas. Choosing a weaker consistency model allows replicas to respond locally without cross-datacenter coordination, dramatically reducing latency and surviving network splits.",
            bullets: [
              "Linearizability (Strongest): Once a write completes, all subsequent reads (by wall-clock time) across any replica MUST return that value or a newer one.",
              "Sequential Consistency: Operations appear to execute in some single global order, consistent with each client's program order, but without strict real-time bounds.",
              "Causal Consistency: If operation A causally precedes operation B (e.g., a reply to a comment), every node must see the comment before the reply.",
              "Eventual Consistency: If no new updates are made, all replicas eventually converge to the same state via anti-entropy/gossip.",
            ],
            codeSnippet: {
              title: "Implementing Read-Your-Own-Writes via Monotonic Version Tokens",
              code: `// After a user writes to the Primary DB, we return the DB Log Sequence Number (LSN)
// On subsequent reads, we only query a Read Replica if it has caught up to that LSN!
export async function readUserProfile(
  userId: string,
  clientLastSeenLsn: bigint,
  primaryDb: DbNode,
  replicaDb: DbNode
) {
  const replicaCurrentLsn = await replicaDb.getReplicationLsn();
  if (replicaCurrentLsn >= clientLastSeenLsn) {
    return replicaDb.query("SELECT * FROM users WHERE id = $1", [userId]);
  }
  // Replica is lagging behind the user's own write; route to Primary!
  return primaryDb.query("SELECT * FROM users WHERE id = $1", [userId]);
}`,
            },
          },
          {
            heading: "Client-Centric Session Guarantees",
            body: "Often you want the scalability of asynchronous read replicas without confusing the user who just updated their profile picture and hit refresh. Client-centric consistency models solve this by scoping guarantees to a single user session rather than all users globally.",
            bullets: [
              "Read-Your-Writes: A user who updates their bio is routed to the leader (or tracks an LSN watermark) so they immediately see their change.",
              "Monotonic Reads: Once a user sees value `V2`, they will never be routed to a lagging replica that still returns `V1` ( prevents 'time travel').",
              "Monotonic Writes: A user's writes are serialized in the order they were issued by that client.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "Linearizability / Strong Consistency",
            pros: "Eliminates stale reads, race conditions, and out-of-order causal anomalies; easiest mental model for engineers.",
            cons: "Requires Raft/Paxos or TrueTime coordination on every read/write; bounded by cross-AZ or cross-region speed of light.",
            bestFor: "Distributed lock managers, financial balances, uniqueness constraints (usernames), and access control lists.",
          },
          {
            option: "Causal / Read-Your-Writes Consistency",
            pros: "Can be fully satisfied while network-partitioned (strongest model possible in an AP system!); low local read latency.",
            cons: "Requires tracking dependency graphs (vector clocks or LSN watermarks) in client tokens or session middleware.",
            bestFor: "Comment threads, chat applications, collaborative editing, and user profile updates.",
          },
        ],
        interviewTip:
          "A classic Staff+ move in interviews: when designing a feed or profile service with read replicas, explicitly mention adding a 'Read-Your-Writes' LSN token or sticky routing for 5 seconds after a mutation so users never think their write failed.",
      },
      {
        id: "acid-and-base",
        topicId: "core-fundamentals",
        topicTitle: "Core Fundamentals",
        topicNumber: 1,
        subtopicNumber: "1.7",
        title: "ACID & BASE",
        subtitle:
          "Contrasting transactional database guarantees (Atomicity, Consistency, Isolation, Durability) with distributed NoSQL paradigms (Basically Available, Soft state, Eventually consistent).",
        readingTime: "8 min read",
        difficulty: "Intermediate",
        keyTakeaways: [
          "ACID governs multi-operation database transactions on a single engine or NewSQL cluster, whereas BASE prioritizes availability and partition resilience across distributed shards.",
          "Isolation is the most nuanced letter in ACID: most production SQL databases default to 'Read Committed' or 'Repeatable Read' (Snapshot Isolation), NOT true 'Serializable' isolation.",
          "When spanning multiple microservices or heterogeneous databases, replacing distributed 2PC ACID transactions with the BASE-aligned Saga pattern avoids blocking locks.",
        ],
        architectureDiagram: `ACID TRANSACTION (All-or-Nothing Lock/Commit)
[ Begin Tx ] -> [ Debit $100 ] -> [ Credit $100 ] -> [ WAL fsync + Commit ]
                    | (Error!)
                    +-----------> [ Rollback Everything ]

BASE / SAGA PATTERN (Eventual Convergence via Asynchronous Steps)
[ Order Service ] --(Event)--> [ Payment Svc ] --(Event)--> [ Inventory Svc ]
       ^                              | (Fails!)
       +---(Compensating Refund)------+`,
        sections: [
          {
            heading: "Deep Dive into ACID & Database Isolation Levels",
            body: "ACID guarantees that database transactions are processed reliably even in the presence of crashes and concurrent access. **Atomicity** ensures all statements in a transaction succeed or none do (via undo logs). **Consistency** ensures application-defined invariants (foreign keys, constraints) hold. **Isolation** prevents concurrent transactions from corrupting each other. **Durability** ensures committed data survives power loss via a Write-Ahead Log (WAL) flushed to non-volatile disk.",
            bullets: [
              "Read Uncommitted: Allows 'Dirty Reads' (reading uncommitted data from another transaction).",
              "Read Committed (Postgres Default): Prevents dirty reads, but allows 'Non-Repeatable Reads' and 'Lost Updates'.",
              "Repeatable Read / Snapshot Isolation (MySQL InnoDB Default): Uses MVCC snapshots; prevents non-repeatable reads, though 'Write Skew' can still occur.",
              "Serializable: Strongest isolation; transactions execute as if run one after another serially (via 2PL or SSI).",
            ],
            codeSnippet: {
              title: "Preventing Lost Updates & Double Booking with ACID Row Locking",
              code: `-- Without proper Isolation, two concurrent requests read status='AVAILABLE'
-- and both book the same seat! Use SELECT ... FOR UPDATE or Optimistic Concurrency:

BEGIN TRANSACTION;

-- Acquires an exclusive row-level lock (Pessimistic Locking)
SELECT seat_id, status FROM concert_seats
WHERE seat_id = 'A12' AND status = 'AVAILABLE'
FOR UPDATE;

-- If row returned, update status and insert booking atomically
UPDATE concert_seats SET status = 'BOOKED', user_id = 'u_99' WHERE seat_id = 'A12';
INSERT INTO bookings (booking_id, seat_id, user_id) VALUES ('b_501', 'A12', 'u_99');

COMMIT;`,
            },
          },
          {
            heading: "The BASE Philosophy in Distributed Systems",
            body: "Coined as the diametric opposite of ACID on the spectrum, **BASE** stands for **Basically Available** (the system guarantees partial or degraded availability under failure), **Soft state** (the state of the system may change over time even without input due to background replication/TTL), and **Eventually consistent** (replicas converge asynchronously). Rather than holding distributed Two-Phase Commit (2PC) locks across services—which kills throughput and availability—BASE architectures use idempotent events and compensating transactions (Sagas).",
            bullets: [
              "Why 2PC Struggles at Scale: A coordinator waiting on 5 microservices holds locks across all of them; if 1 node stalls, the entire pipeline freezes.",
              "Saga Pattern (Choreography or Orchestration): Breaks a distributed transaction into local ACID transactions connected by events, with explicit compensating rollback actions.",
              "Outbox Pattern: Bridges local ACID and distributed BASE by writing the DB state change and the outbound Kafka event in the same local SQL transaction.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "ACID Transactions (RDBMS / NewSQL like Spanner)",
            pros: "Eliminates partial failure states, prevents race anomalies (dirty reads, lost updates), offloads complexity to the DB engine.",
            cons: "Lock contention under high write concurrency (hot rows), difficult to scale horizontally across independent microservices.",
            bestFor: "Core banking, ticket/inventory reservation, billing ledgers, and monolithic or modular-monolith data layers.",
          },
          {
            option: "BASE + Saga Pattern (NoSQL + Event Streams)",
            pros: "Massive horizontal write scalability, services remain loosely coupled and independently deployable, no cross-service lock waiting.",
            cons: "Temporary intermediate states are visible to users, requires engineering idempotent consumers and compensating rollback logic.",
            bestFor: "Cross-service e-commerce checkout workflows (Order -> Payment -> Warehouse -> Notification) and high-scale ingestion.",
          },
        ],
        interviewTip:
          "When designing a ticket-booking or payment system, explicitly name the concurrency anomaly you are preventing ('To prevent Lost Updates and Double Booking, I will use PostgreSQL ACID transactions with `SELECT FOR UPDATE` or optimistic version columns').",
      },
      {
        id: "synchronous-vs-asynchronous-processing",
        topicId: "core-fundamentals",
        topicTitle: "Core Fundamentals",
        topicNumber: 1,
        subtopicNumber: "1.8",
        title: "Synchronous vs Asynchronous Processing",
        subtitle:
          "Decoupling request-response paths with message queues, event streams, backpressure control, and dead-letter queues.",
        readingTime: "7 min read",
        difficulty: "Foundational",
        keyTakeaways: [
          "Synchronous calls block the caller until work completes, creating tight temporal coupling and cascading failure chains across microservices.",
          "Asynchronous processing buffers work in durable queues (SQS, RabbitMQ, Kafka), absorbing traffic spikes (load leveling) and isolating downstream outages.",
          "Every production async pipeline must include retry with exponential backoff + jitter, idempotency keys, and a Dead-Letter Queue (DLQ) for poison pills.",
        ],
        architectureDiagram: `SYNCHRONOUS (Temporal Coupling & Latency Summation: 50 + 200 + 300 = 550ms)
[Client] --(550ms)--> [Order API] --(200ms)--> [PDF Invoice] --(300ms)--> [Email SMTP]

ASYNCHRONOUS (Shock Absorber & Fast Ack: 15ms Client Response)
[Client] --(15ms: 202 Accepted)--> [Order API] ---> [ Durable Queue / Kafka ]
                                                              |
                                      +-----------------------+-----------------------+
                                      v                                               v
                              [Invoice Worker]                                [Email Worker]
                              (Retries + DLQ)                                 (Rate-limited)`,
        sections: [
          {
            heading: "Temporal Decoupling and Load Leveling",
            body: "In a synchronous request-response model (HTTP/gRPC), the caller thread or connection waits for the downstream service to finish. If a user uploads a video and the API synchronously transcodes it into 4 resolutions, the HTTP connection hangs for minutes, threads exhaust, and any blip restarts the whole upload. By shifting to asynchronous processing, the API persists the raw video to object storage, publishes a `VideoUploaded` job to a queue, and immediately returns `202 Accepted` with a status polling URL or WebSocket channel.",
            bullets: [
              "Load Leveling (Shock Absorption): If a flash sale generates 100,000 orders/sec, the queue buffers the burst while workers drain it steadily at the database's safe 5,000 writes/sec limit.",
              "Fault Isolation: If the downstream Email or Analytics service crashes for 2 hours, user checkouts continue unimpeded; messages simply accumulate in the broker until recovery.",
              "Independent Scaling: CPU-heavy video transcoding workers scale on queue depth metrics independently of lightweight API gateway pods.",
            ],
            codeSnippet: {
              title: "Async Job Producer + Resilient Worker with DLQ Routing",
              code: `// 1. API Handler: Fast admission & enqueue (<15ms)
export async function handleVideoUpload(req: UploadRequest, queue: QueueClient) {
  const jobId = crypto.randomUUID();
  await queue.publish("video-transcode-jobs", {
    jobId,
    s3Key: req.s3Key,
    resolutions: ["1080p", "720p", "480p"],
    attempt: 1,
  });
  return { status: 202, jobId, statusUrl: \`/api/v1/jobs/\${jobId}\` };
}

// 2. Worker: Retries with Exponential Backoff, routes Poison Pills to DLQ
export async function processJob(msg: JobMessage, queue: QueueClient) {
  try {
    await transcodeFfmpeg(msg.s3Key, msg.resolutions);
  } catch (err) {
    if (msg.attempt >= 5) {
      await queue.publish("video-transcode-DLQ", { ...msg, error: String(err) });
    } else {
      const backoffMs = Math.pow(2, msg.attempt) * 1000 + Math.random() * 500;
      await queue.publishDelayed("video-transcode-jobs", { ...msg, attempt: msg.attempt + 1 }, backoffMs);
    }
  }
}`,
            },
          },
          {
            heading: "Handling Backpressure and Poison-Pill Messages",
            body: "Asynchronous queues are not magic infinite sinks. If producers continuously write faster than consumers can drain, queue memory/disk fills up and end-to-end queuing latency approaches infinity. Production systems must enforce bounded queues, backpressure signaling, and Dead-Letter Queues (DLQs) so malformed 'poison-pill' messages do not block worker threads in infinite crash loops.",
            bullets: [
              "Backpressure: When queue depth crosses a high-water mark, apply rate limiting or shed non-critical load (`HTTP 429` or `503 Retry-After`) at the edge.",
              "Dead-Letter Queue (DLQ): After `N` failed delivery attempts, move the message to a side queue for alerting, inspection, and manual replay.",
              "At-Least-Once Delivery: Because brokers redeliver unacknowledged messages on timeout, downstream workers MUST be idempotent.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "Synchronous Processing (Direct RPC / HTTP)",
            pros: "Immediate deterministic result returned to caller, simpler debugging and stack traces, no message broker infrastructure.",
            cons: "Latency equals the sum of all downstream calls, cascading timeouts if any dependency slows down, zero burst buffering.",
            bestFor: "Authentication checks, fetching user profile data, balance verification, and immediate search queries.",
          },
          {
            option: "Asynchronous Processing (Message Queues / Event Streams)",
            pros: "Sub-20ms API response times, absorbs massive traffic spikes, isolates failures across services, enables fan-out to multiple consumers.",
            cons: "Client must poll or listen via WebSockets/webhooks for completion, eventual consistency, operational overhead of Kafka/RabbitMQ.",
            bestFor: "Media transcoding, email/push notifications, PDF generation, webhook delivery, and post-checkout order fulfillment.",
          },
        ],
        interviewTip:
          "Whenever you draw a message queue in an interview, immediately add two details without waiting to be asked: (1) a Dead-Letter Queue (DLQ) for failed retries, and (2) how the client learns the async task finished (polling, WebSocket, or push notification).",
      },
      {
        id: "back-of-the-envelope-estimation",
        topicId: "core-fundamentals",
        topicTitle: "Core Fundamentals",
        topicNumber: 1,
        subtopicNumber: "1.9",
        title: "Back-of-the-Envelope Estimation",
        subtitle:
          "Rapid capacity planning using powers of two, latency numbers every programmer should know, QPS conversions, and storage math.",
        readingTime: "8 min read",
        difficulty: "Foundational",
        keyTakeaways: [
          "There are ~86,400 seconds in a day—always round to `100,000 (10^5)` seconds/day for mental math, and multiply average QPS by `2x–3x` for peak QPS.",
          "Memorize latency orders of magnitude: L1/RAM is nanoseconds, SSD is ~100 microseconds, Intra-DC network is ~0.5 milliseconds, Cross-Continent is ~150 milliseconds.",
          "The goal of estimation is not arithmetic perfection; it is proving whether your data fits in a single node's RAM (64GB) or requires sharding across 50 nodes.",
        ],
        architectureDiagram: `LATENCY HIERARCHY (Orders of Magnitude)
[ CPU / L1-L2 Cache ]  ~ 1 - 5 ns         (Instant)
[ Main Memory (RAM) ]  ~ 100 ns           (0.1 us)
[ NVMe SSD Random Read]~ 100 us           (0.1 ms)
[ Same-AZ Network RTT ]~ 500 us           (0.5 ms)
[ Cross-US Network RTT]~ 70,000 us        (70 ms)
[ Global Packet RTT   ]~ 150,000 us       (150 ms)

DAILY VOLUME -> QPS SHORTCUT
100M requests/day  ÷  100,000 sec/day  =  1,000 Avg QPS  (Peak ~ 2,500 QPS)`,
        sections: [
          {
            heading: "Golden Constants and Shortcuts for Mental Math",
            body: "During a system design interview, spending 8 minutes doing long division wastes precious architecture time. Instead, convert every number into scientific notation (`10^N`) and use standardized approximations. Every estimation should answer three architectural questions: (1) What is our read/write QPS? (2) How much storage do we accumulate over 5 years? (3) How much cache memory and network bandwidth do we need?",
            bullets: [
              "Time Shortcuts: `1 day ≈ 10^5 seconds` (86,400) | `1 month ≈ 2.5 × 10^6 seconds` | `1 year ≈ 3 × 10^7 seconds`.",
              "Volume Powers of 10: `10^3 = 1 KB` | `10^6 = 1 MB` | `10^9 = 1 GB` | `10^12 = 1 TB` | `10^15 = 1 PB`.",
              "Single Node Rule-of-Thumb: 1 Redis node = ~100k QPS | 1 SQL Primary = ~10k write QPS / 30k read QPS | 1 App Server = ~5k-10k QPS.",
            ],
            codeSnippet: {
              title: "Worked Example: Capacity Estimation for a URL Shortener (100M DAU)",
              code: `/*
 * 1. TRAFFIC (QPS)
 * - Write: 100M new URLs/month -> 10^8 / (2.5 * 10^6 sec) = 40 Writes/sec (Peak ~100 WPS)
 * - Read (100:1 ratio): 40 * 100 = 4,000 Reads/sec (Peak ~10,000 RPS)
 * -> Conclusion: 1 SQL Primary easily handles 100 WPS! No write sharding needed initially.
 *
 * 2. STORAGE (5 Years)
 * - Total rows: 100M/mo * 12 mo * 5 yrs = 6 Billion URLs (6 * 10^9)
 * - Row size: 8B id + 7B slug + 500B long_url + metadata ≈ 500 Bytes
 * - Total Storage: (6 * 10^9) * 500 Bytes = 3 * 10^12 Bytes = 3 TB over 5 years
 * -> Conclusion: Fits on a single multi-TB SSD instance with read replicas!
 *
 * 3. CACHE MEMORY (80/20 Pareto Rule: Cache 20% of daily active URLs)
 * - Daily reads: 4,000 RPS * 10^5 sec = 400M requests/day (~80M unique URLs)
 * - 20% hot set: 16M URLs * 500 Bytes ≈ 8 GB RAM
 * -> Conclusion: Fits comfortably inside a single 16GB Redis node (with 1 replica)!
 */`,
            },
          },
          {
            heading: "Tying Numbers Directly to Design Decisions",
            body: "Interviewers hate 'disconnected math'—calculating 3.2 TB of storage and then never mentioning it again. Every single number you compute must immediately justify an architectural component choice.",
            bullets: [
              "If Hot Working Set = 40 GB -> 'This fits inside a single 64GB Redis cluster shard; we don't need complex cache sharding.'",
              "If Write QPS = 80,000/sec -> 'A single Postgres leader caps out around 15k writes/sec, so we MUST shard by `user_id` across at least 8 shards or use Cassandra.'",
              "If Media Ingress = 5 GB/sec -> 'Our API servers shouldn't proxy 40 Gbps of raw video bytes; clients must upload directly to S3 via Presigned URLs.'",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "Upfront Full Capacity Estimation (Before Drawing)",
            pros: "Establishes global scale constraints early, prevents designing a toy architecture for a planetary problem.",
            cons: "Can eat up 5-7 minutes of interview time on arithmetic before any boxes are drawn.",
            bestFor: "Storage-heavy or bandwidth-heavy prompts (YouTube, Dropbox, Twitter Feed, Web Crawler, Metrics System).",
          },
          {
            option: "Just-in-Time (JIT) Scoped Estimation (During Deep Dive)",
            pros: "Saves time upfront, calculates numbers only where needed to justify sharding or caching a specific bottleneck.",
            cons: "Risk of realizing halfway through the design that your chosen database cannot handle the write QPS.",
            bestFor: "Workflow-heavy or state-machine prompts (Uber Ride Matching, Payment System, Ticketmaster, Rate Limiter).",
          },
        ],
        interviewTip:
          "Always state your rounding assumptions out loud ('I'll approximate 86,400 seconds/day as 100,000 to keep the math clean') and end your estimation with a 1-sentence architectural verdict.",
      },
    ],
  },
  {
    id: "networking",
    topicNumber: 2,
    title: "Networking",
    description:
      "The transport protocols, multiplexing standards, name resolution hierarchies, encryption handshakes, and traffic routing layers that power the internet.",
    subtopics: [
      {
        id: "http-https",
        topicId: "networking",
        topicTitle: "Networking",
        topicNumber: 2,
        subtopicNumber: "2.1",
        title: "HTTP/HTTPS",
        subtitle:
          "Stateless request-response semantics, method idempotency, status code taxonomy, caching headers, and TLS-secured transport.",
        readingTime: "6 min read",
        difficulty: "Foundational",
        keyTakeaways: [
          "HTTP is an application-layer stateless protocol where every request contains all metadata (headers, method, URI, auth) required for the server to process it.",
          "HTTP methods carry formal semantics: `GET`, `PUT`, and `DELETE` are idempotent by specification, whereas `POST` is non-idempotent and `PATCH` is typically non-idempotent.",
          "HTTPS wraps HTTP inside a TLS encrypted tunnel, guaranteeing Confidentiality (encryption), Integrity (MAC/AEAD prevents tampering), and Authenticity (X.509 certificates).",
        ],
        architectureDiagram: `[ Client Browser / App ]
          |
          |  1. TCP + TLS Handshake (HTTPS Port 443)
          |  2. HTTP Request:
          |     GET /v1/articles/42 HTTP/2
          |     Host: api.example.com
          |     If-None-Match: "etag-99a8b"
          |     Accept-Encoding: br, gzip
          v
[ CDN / Reverse Proxy ]
          |
          |  3. HTTP Response:
          |     HTTP/2 304 Not Modified (or 200 OK)
          |     Cache-Control: public, max-age=3600, stale-while-revalidate=60
          |     ETag: "etag-99a8b"
          v
[ Client Reuses Local Cache ]`,
        sections: [
          {
            heading: "HTTP Semantics, Methods, and Status Code Precision",
            body: "Hypertext Transfer Protocol (HTTP) is the foundational request-response protocol of the web. Because HTTP is stateless, any horizontal backend replica can service any request without remembering prior packets. Adhering strictly to HTTP method semantics and status codes enables intermediaries—CDNs, reverse proxies, browser caches, and API gateways—to automatically cache, retry, or circuit-break traffic without inspecting application business logic.",
            bullets: [
              "Safe & Idempotent Methods: `GET`, `HEAD`, `OPTIONS` (read-only, safe for automatic proxy retries and prefetching).",
              "Idempotent Mutating Methods: `PUT` (full resource replacement) and `DELETE` (repeating `DELETE /items/5` yields the same system state).",
              "Status Code Discipline: `200 OK`, `201 Created`, `202 Accepted` (async), `304 Not Modified`, `400 Bad Request`, `401 Unauthorized` (unauthenticated), `403 Forbidden` (unauthorized), `409 Conflict`, `429 Too Many Requests`, `502/503/504` (gateway/upstream failures).",
            ],
            codeSnippet: {
              title: "Conditional HTTP Caching with ETags & Cache-Control",
              code: `export async function handleGetProduct(req: Request): Promise<Response> {
  const product = await db.getProduct("prod_88");
  const currentEtag = \`"\${product.versionHash}"\`;

  // If client already has this exact version cached, save bandwidth!
  if (req.headers.get("If-None-Match") === currentEtag) {
    return new Response(null, {
      status: 304, // Not Modified (0-byte body)
      headers: { ETag: currentEtag, "Cache-Control": "public, max-age=60" },
    });
  }

  return new Response(JSON.stringify(product), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ETag: currentEtag,
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}`,
            },
          },
          {
            heading: "HTTPS and Secure Edge Termination",
            body: "Plaintext HTTP is vulnerable to passive eavesdropping and active Man-in-the-Middle (MitM) header/body injection across ISP routers and Wi-Fi access points. HTTPS layers HTTP atop TLS (Transport Layer Security). In modern cloud architectures, HTTPS TLS termination usually happens at the CDN edge or Layer-7 Load Balancer (offloading asymmetric crypto from app servers), or uses mTLS (Mutual TLS) all the way between internal service-mesh pods for zero-trust security.",
            bullets: [
              "HSTS (`Strict-Transport-Security`): Instructs browsers to never attempt plaintext port 80 connections, preventing SSL-stripping attacks.",
              "HTTP Compression (`Accept-Encoding: br, zstd, gzip`): Compresses JSON/HTML payloads by 70-85% over the wire.",
              "CORS (Cross-Origin Resource Sharing): Browser-enforced preflight (`OPTIONS`) security mechanism restricting cross-domain XHR/Fetch calls.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "End-to-End HTTPS / mTLS (Client -> LB -> Pod)",
            pros: "Zero-trust encryption even inside the VPC, cryptographic service identity verification via client certs, SOC2/PCI compliance.",
            cons: "Extra CPU overhead for TLS encryption/decryption on every internal hop, certificate rotation complexity (requires Istio/Linkerd/cert-manager).",
            bestFor: "Fintech, healthcare (HIPAA), multi-tenant cloud infrastructure, and zero-trust microservice meshes.",
          },
          {
            option: "TLS Termination at Edge Load Balancer (HTTPS -> LB -> Plain HTTP)",
            pros: "Offloads TLS handshake CPU and cert management to a single gateway/ALB tier, simplifies internal debugging and packet capture.",
            cons: "Traffic inside the private VPC subnet travels unencrypted; vulnerable if an attacker breaches the internal network perimeter.",
            bestFor: "Standard single-VPC startups and low-sensitivity internal backends inside isolated private subnets.",
          },
        ],
        interviewTip:
          "Don't overlook HTTP `ETag` and `Cache-Control: stale-while-revalidate` headers in interviews—mentioning them shows how you eliminate 80% of backend bandwidth before requests ever leave the CDN or browser.",
      },
      {
        id: "tcp-vs-udp",
        topicId: "networking",
        topicTitle: "Networking",
        topicNumber: 2,
        subtopicNumber: "2.2",
        title: "TCP vs UDP",
        subtitle:
          "Comparing connection-oriented reliable byte streams (3-way handshake, congestion control) against connectionless low-overhead datagrams.",
        readingTime: "7 min read",
        difficulty: "Foundational",
        keyTakeaways: [
          "TCP guarantees reliable, ordered, error-checked delivery via a 3-way handshake, sequence numbers, ACKs, retransmissions, and congestion control.",
          "UDP is a connectionless 'fire-and-forget' datagram protocol with an 8-byte header, zero handshake RTT, and no Transport-Layer Head-of-Line (HoL) blocking.",
          "For real-time media (WebRTC, VoIP, FPS gaming), a retransmitted late TCP packet is worse than a dropped UDP packet because stalls destroy live interactivity.",
        ],
        architectureDiagram: `TCP (Reliable, Ordered Stream - 20B+ Header)     UDP (Unreliable Datagram - 8B Header)
[Client]                     [Server]            [Client]                     [Server]
   |--- 1. SYN (seq=x) -------->|                   |--- Datagram 1 (Audio) ---->|
   |<-- 2. SYN-ACK (seq=y,x+1) -|   (1 Full RTT     |--- Datagram 2 (Audio) --X (Dropped!)
   |--- 3. ACK (y+1) ---------->|    Before Data)   |--- Datagram 3 (Audio) ---->|
   |=== Reliable Data Stream ===|                   (App immediately plays Datagram 3;
   (If Packet #2 drops, Packet #3                    no waiting for Datagram 2 retransmit!)
    is held in kernel buffer!)`,
        sections: [
          {
            heading: "Inside TCP: Handshakes, Flow Control, and Congestion Control",
            body: "Transmission Control Protocol (TCP) creates a virtual full-duplex pipe between two sockets. Before sending a single byte of application payload, TCP requires a 3-way handshake (`SYN`, `SYN-ACK`, `ACK`), costing 1 full Round-Trip Time (RTT). During transmission, TCP numbers every byte, requires receiver acknowledgments (`ACK`), and enforces both **Flow Control** (via the receiver's advertised sliding window so a fast sender doesn't overwhelm a slow receiver) and **Congestion Control** (slow start, CUBIC, or Google BBR to avoid collapsing intermediate internet routers).",
            bullets: [
              "TCP Head-of-Line (HoL) Blocking: Because TCP guarantees strict byte ordering, if packet #4 is lost on the wire, packets #5, #6, and #7 sit locked inside the OS kernel buffer until #4 is retransmitted.",
              "Nagle's Algorithm vs `TCP_NODELAY`: Nagle buffers small writes to coalesce packets; latency-sensitive apps set `TCP_NODELAY` to flush immediately.",
              "Keep-Alive Connections: Reusing long-lived TCP connections avoids paying the 3-way handshake + slow-start penalty on every request.",
            ],
            codeSnippet: {
              title: "Tuning Low-Latency TCP Socket Options in Node/TypeScript",
              code: `import net from "node:net";

const socket = net.createConnection({ host: "10.0.1.45", port: 6379 }, () => {
  // Disable Nagle's algorithm: flush small packets immediately without 40ms buffering
  socket.setNoDelay(true);

  // Enable OS-level TCP keep-alive probes to detect dead peers and prevent NAT drops
  socket.setKeepAlive(true, 30_000);
});`,
            },
          },
          {
            heading: "Inside UDP: Speed, Simplicity, and Custom Application Reliability",
            body: "User Datagram Protocol (UDP) adds almost nothing on top of IP except source/destination ports and a checksum—just an 8-byte header compared to TCP's 20–60 bytes. There is no handshake, no connection state in the OS kernel, and no automatic retransmission. If your application needs reliability without TCP's rigid single-stream ordering, you can build selective reliability on top of UDP in user space—which is the exact foundation of QUIC (HTTP/3) and WebRTC.",
            bullets: [
              "Zero Handshake Latency: Data flows on the very first packet.",
              "No HoL Blocking Across Independent Frames: A dropped video delta frame doesn't block an incoming audio packet or player position update.",
              "Multicast / Broadcast Support: UDP supports broadcasting packets to multiple peers, whereas TCP is strictly 1-to-1 unicast.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "TCP (Transmission Control Protocol)",
            pros: "Guaranteed delivery and strict ordering out-of-the-box, battle-tested congestion control (BBR/CUBIC), universally traverses firewalls.",
            cons: "1-RTT handshake overhead, Transport-Layer Head-of-Line blocking stalls entire connection on a single lost packet, heavier kernel state.",
            bestFor: "REST/gRPC APIs, database connections (Postgres/Redis), file transfers, web pages (HTTP/1.1 & HTTP/2), and chat messages.",
          },
          {
            option: "UDP (User Datagram Protocol)",
            pros: "Zero connection setup delay, minimal 8-byte packet header, no HoL blocking, app controls what to drop vs retransmit.",
            cons: "Packets can arrive out of order, duplicated, or vanish silently; some corporate firewalls block raw UDP ports.",
            bestFor: "Live video/voice calls (WebRTC/Zoom), multiplayer real-time games, DNS lookups, and HTTP/3 (QUIC).",
          },
        ],
        interviewTip:
          "When designing Zoom, Discord, or an online game, explicitly contrast control plane vs media plane: 'We use TCP (HTTPS/WebSockets) for authentication, room signaling, and text chat where reliability is mandatory, and UDP (WebRTC/SRTP) for live audio/video streams where low latency beats 100% packet delivery.'",
      },
      {
        id: "http-1-1-vs-http-2-vs-http-3",
        topicId: "networking",
        topicTitle: "Networking",
        topicNumber: 2,
        subtopicNumber: "2.3",
        title: "HTTP/1.1 vs HTTP/2 vs HTTP/3",
        subtitle:
          "How web transport evolved from text-based serial connections to binary TCP multiplexing and finally QUIC over UDP.",
        readingTime: "8 min read",
        difficulty: "Intermediate",
        keyTakeaways: [
          "HTTP/1.1 suffers from Application-Layer Head-of-Line (HoL) blocking, forcing browsers to open up to 6 parallel TCP connections per domain.",
          "HTTP/2 introduces binary framing, HPACK header compression, and stream multiplexing over a single TCP connection—but remains vulnerable to TCP-Layer HoL blocking on packet loss.",
          "HTTP/3 replaces TCP with QUIC over UDP, multiplexing independent streams in user space so a lost packet only stalls the single affected stream, while enabling 0-RTT/1-RTT combined TLS handshakes.",
        ],
        architectureDiagram: `HTTP/1.1 (6 TCP Conns)       HTTP/2 (1 TCP Conn)          HTTP/3 (QUIC over UDP)
+------+ +------+ +------+   +------------------------+   +------------------------+
|Req 1 | |Req 2 | |Req 3 |   | Stream 1 | Stream 2    |   | Stream 1 | Stream 2    |
| (JS) | |(CSS) | |(Img) |   | (Framed) | (Framed)    |   | (QUIC)   | (QUIC)      |
+------+ +------+ +------+   +------------------------+   +------------------------+
| TCP  | | TCP  | | TCP  |   |   Single TCP Stream    |   |      UDP Datagrams     |
+------+ +------+ +------+   +------------------------+   +------------------------+
App-layer HoL blocking!      Lost TCP pkt stalls ALL!     Lost pkt stalls ONLY S1!`,
        sections: [
          {
            heading: "From HTTP/1.1 Text Queues to HTTP/2 Binary Multiplexing",
            body: "In HTTP/1.1, requests on a persistent connection must be processed strictly in order: if Request #1 takes 200ms on the server, Request #2 behind it cannot receive its response first (Application-Layer Head-of-Line blocking). Browsers worked around this by opening 6 parallel TCP connections per origin and using hacks like CSS sprites and domain sharding. **HTTP/2** solved this at the application layer by breaking every request and response into small binary frames tagged with a `Stream ID`, allowing hundreds of concurrent requests to interleave over a **single TCP connection**, alongside HPACK header compression.",
            bullets: [
              "Binary Framing Layer: Parses compact binary frames instead of error-prone newline-delimited ASCII text.",
              "HPACK Header Compression: Eliminates redundant transmission of bloated `Cookie` and `User-Agent` headers across requests.",
              "The Catch in HTTP/2: Because all HTTP/2 streams share one underlying TCP socket, if a single TCP packet drops on a lossy cellular network (2% packet loss), the OS kernel blocks ALL HTTP/2 streams until that packet is retransmitted!",
            ],
            codeSnippet: {
              title: "Comparing Handshake Round-Trips Across HTTP Generations",
              code: `/*
 * Connection Setup Latency before First Byte of Application Request Sent:
 *
 * 1. HTTP/1.1 & HTTP/2 over TLS 1.2:
 *    - TCP 3-Way Handshake:        1 RTT
 *    - TLS 1.2 Handshake:          2 RTTs
 *    - Total Setup Cost:           3 RTTs before HTTP request!
 *
 * 2. HTTP/2 over TLS 1.3:
 *    - TCP 3-Way Handshake:        1 RTT
 *    - TLS 1.3 Handshake:          1 RTT
 *    - Total Setup Cost:           2 RTTs
 *
 * 3. HTTP/3 (QUIC over UDP with built-in TLS 1.3):
 *    - Transport + TLS Combined:   1 RTT (New connection)
 *    - Session Resumption:         0 RTT (Send HTTP request in very first packet!)
 */`,
            },
          },
          {
            heading: "HTTP/3 and QUIC: Solving TCP Head-of-Line Blocking",
            body: "To eliminate TCP-level Head-of-Line blocking without waiting 15 years for every OS kernel and middlebox router on Earth to upgrade TCP, Google designed **QUIC** (standardized as the transport layer for **HTTP/3**). QUIC runs on top of UDP in user space. It implements stream awareness directly inside the transport protocol: if a UDP packet carrying bytes for Stream #4 is lost, Streams #1, #2, and #3 continue delivering data to the application immediately.",
            bullets: [
              "Combined Transport + Crypto Handshake: QUIC embeds TLS 1.3 directly into its handshake, requiring only 1 RTT for new connections and 0-RTT for resumed connections.",
              "Connection Migration (Connection ID): When a user walks out of their house and switches from Wi-Fi IP to 5G Cellular IP, TCP connections break. QUIC identifies connections by a 64-bit `Connection ID`, surviving IP/port changes seamlessly!",
              "QPACK Compression: Upgraded header compression tailored for out-of-order QUIC stream delivery.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "HTTP/2 over TCP",
            pros: "Universal support across all load balancers, corporate firewalls, and runtimes; low CPU overhead due to kernel TCP offload (TSO); required transport for gRPC.",
            cons: "Suffers from TCP-layer Head-of-Line blocking on lossy networks (>1-2% packet loss); breaks when client IP changes (Wi-Fi to 5G).",
            bestFor: "Internal data-center microservice communication (gRPC), stable broadband connections, and standard cloud backends.",
          },
          {
            option: "HTTP/3 over QUIC (UDP)",
            pros: "Zero cross-stream HoL blocking on lossy mobile networks, 1-RTT/0-RTT handshakes, seamless Wi-Fi-to-Cellular connection migration.",
            cons: "Higher CPU usage in user-space UDP encryption/packet pacing, some enterprise networks block UDP port 443 (requires fallback to HTTP/2).",
            bestFor: "Mobile apps on spotty cellular connections, global CDN edge delivery (Cloudflare/Fastly), and latency-critical web apps.",
          },
        ],
        interviewTip:
          "If your system design involves mobile clients on flaky networks (e.g., Uber driver app, WhatsApp, Instagram), explicitly recommend HTTP/3 (QUIC) at the CDN edge for connection migration (switching from Wi-Fi to 5G without dropping in-flight uploads) and 0-RTT resumption.",
      },
      {
        id: "dns",
        topicId: "networking",
        topicTitle: "Networking",
        topicNumber: 2,
        subtopicNumber: "2.4",
        title: "DNS",
        subtitle:
          "Hierarchical name resolution, record types (A, AAAA, CNAME, NS), TTL caching trade-offs, Geo-DNS, and Anycast routing.",
        readingTime: "7 min read",
        difficulty: "Foundational",
        keyTakeaways: [
          "DNS translates human-readable domains (`api.stripe.com`) into IP addresses via a globally distributed hierarchy: Stub Resolver -> Recursive Resolver -> Root -> TLD -> Authoritative Name Server.",
          "DNS acts as the very first layer of global load balancing via Geo-DNS (latency-based routing), Weighted Round-Robin, and health-checked failover.",
          "DNS TTL (Time-To-Live) is a fundamental trade-off between lookup latency/authoritative load (long TTL) and fast incident failover/deployment cutover (short TTL).",
        ],
        architectureDiagram: `[ Client Browser ]
   | 1. Query "api.app.com" (Checks Browser & OS Cache first)
   v
[ Recursive Resolver (ISP / 8.8.8.8 / 1.1.1.1) ]
   |
   +---> 2. Root Server (.)          -> Returns .com TLD NS
   +---> 3. TLD Server (.com)        -> Returns Route53 Auth NS
   +---> 4. Authoritative NS         -> Evaluates Geo/Health Policy
   |        (AWS Route53 / Cloudflare)  Returns A Record: 54.23.11.9 (TTL=60s)
   v
[ Client Connects Directly to 54.23.11.9 ]`,
        sections: [
          {
            heading: "The Resolution Hierarchy and Essential Record Types",
            body: "The Domain Name System (DNS) is a globally distributed, eventually consistent directory. When a client resolves a hostname, it checks its local browser cache and OS stub resolver before querying a Recursive Resolver (like Cloudflare `1.1.1.1` or Google `8.8.8.8`) over UDP port 53 (or encrypted DoH/DoT). If uncached, the recursive resolver traverses the hierarchy from the 13 logical Root Server clusters (`.` via Anycast) down to the Top-Level Domain (`.com`) and finally the domain's Authoritative Name Server.",
            bullets: [
              "`A` / `AAAA` Records: Map a domain directly to an IPv4 (`32-bit`) or IPv6 (`128-bit`) address.",
              "`CNAME` (Canonical Name): Aliases one domain (`www.app.com`) to another domain (`d123.cloudfront.net`); requires an extra resolution hop and cannot be placed at the zone apex (`@`).",
              "`ALIAS` / `ANAME`: Provider-specific virtual records (Route53/Cloudflare) that act like a CNAME at the root apex while returning a resolved `A` record in a single hop.",
              "`NS` / `TXT` / `SRV`: Delegate authoritative zones, verify domain ownership/SPF, or advertise service host+port pairs.",
            ],
            codeSnippet: {
              title: "Multi-Region Active-Active Geo-Proximity DNS Zone Config",
              code: `; Authoritative DNS Policy (Conceptual Route53 / Cloudflare Config)
; Short 60s TTL enables rapid region evacuation if us-east-1 suffers an outage

api.example.com.  60  IN  A  34.192.10.5   ; routing=latency, region=us-east-1, healthcheck=hc-us-east
api.example.com.  60  IN  A  18.184.99.12  ; routing=latency, region=eu-central-1, healthcheck=hc-eu
api.example.com.  60  IN  A  13.250.44.88  ; routing=latency, region=ap-southeast-1, healthcheck=hc-ap`,
            },
          },
          {
            heading: "Global Traffic Management: Anycast vs Geo-DNS & TTL Traps",
            body: "At planetary scale, DNS is not just a phonebook—it is your global traffic director. **Geo-DNS (Latency-based routing)** inspects the client's recursive resolver IP (or EDNS Client Subnet extension) and returns the IP of the closest regional load balancer. **Anycast** takes a different approach: multiple physical PoPs around the globe advertise the *exact same IP address* via BGP, and internet backbone routers naturally route packets to the topologically nearest PoP.",
            bullets: [
              "The TTL Failover Trap: Even if you set `TTL = 30s`, rogue ISP resolvers and poorly configured JVM/application HTTP clients may cache DNS responses for hours, delaying 100% regional failover.",
              "DNS Pre-fetching (`<link rel='dns-prefetch'>`): Resolves third-party domains in the background before the user clicks a link, shaving 20-120ms off navigation.",
              "EDNS0 Client Subnet (ECS): Passes the truncated client IP subnet to authoritative DNS so Geo-DNS routes based on the *user's* location rather than their centralized ISP resolver's location.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "Short DNS TTL (30s – 60s)",
            pros: "Allows rapid traffic shifting during regional outages, blue/green infrastructure cutovers, and DDoS mitigation.",
            cons: "Higher DNS query volume and cost on Authoritative Name Servers; users experience slightly more frequent cache-miss DNS lookups.",
            bestFor: "Mission-critical API endpoints, multi-region active-active ingress, and load-balanced front doors.",
          },
          {
            option: "Long DNS TTL (3600s – 86400s)",
            pros: "Near-zero DNS lookup latency for repeat visitors (99% cache hit rate in browser/ISP), minimal authoritative DNS bill.",
            cons: "If an IP address dies or changes, clients stay stranded on the dead IP for hours until caches expire.",
            bestFor: "Static Anycast IPs (where BGP handles failover underneath the unchanging IP), NS delegation records, and MX records.",
          },
        ],
        interviewTip:
          "When discussing multi-region disaster recovery, point out that DNS failover alone rarely gives sub-minute RTO because client OS/ISP caches sometimes ignore low TTLs—combining Anycast IP routing at the edge with health-checked Geo-DNS is the gold standard.",
      },
      {
        id: "tls",
        topicId: "networking",
        topicTitle: "Networking",
        topicNumber: 2,
        subtopicNumber: "2.5",
        title: "TLS",
        subtitle:
          "How TLS 1.3 achieves 1-RTT handshakes, asymmetric key exchange (ECDHE), forward secrecy, X.509 certificates, and mTLS.",
        readingTime: "7 min read",
        difficulty: "Intermediate",
        keyTakeaways: [
          "TLS uses Asymmetric Cryptography (ECDHE / RSA) only during the initial handshake to authenticate identity and agree on a shared secret, then switches to fast Symmetric Encryption (AES-GCM / ChaCha20) for bulk data.",
          "TLS 1.3 cut the handshake from 2 RTTs down to 1 RTT (and 0-RTT for resumed sessions) while mandating Ephemeral Diffie-Hellman (ECDHE) for Perfect Forward Secrecy (PFS).",
          "Mutual TLS (mTLS) requires *both* client and server to present X.509 certificates, serving as the cryptographic backbone of zero-trust microservice meshes.",
        ],
        architectureDiagram: `TLS 1.3 HANDSHAKE (1-RTT Total!)
[ Client ]                                               [ Server ]
    |                                                        |
    |--- 1. ClientHello + Supported Ciphers + KeyShare ----->| (Guesses ECDHE curve
    |                                                        |  upfront in msg #1!)
    |<-- 2. ServerHello + KeyShare + {Certificate} ----------|
    |       + {CertificateVerify} + {Finished}               | (Both sides now derive
    |                                                        |  Symmetric Session Key!)
    |--- 3. {Finished} + [Encrypted HTTP Request!] --------->|
    |<== 4. [Encrypted HTTP Response (AES-256-GCM)] =========|`,
        sections: [
          {
            heading: "Why TLS Combines Asymmetric and Symmetric Cryptography",
            body: "Asymmetric public-key cryptography (RSA, ECDSA, ECDHE) solves the key-distribution problem over an untrusted network, but it is computationally expensive (100x–1000x slower than symmetric crypto). Conversely, symmetric encryption (AES-GCM, ChaCha20-Poly1305) is hardware-accelerated (AES-NI) and blazingly fast, but requires both parties to share the same secret key. TLS bridges both worlds: it uses an asymmetric handshake to verify the server's X.509 certificate chain (signed by a trusted Certificate Authority) and perform an Elliptic Curve Diffie-Hellman Ephemeral (`ECDHE`) key exchange, deriving an ephemeral symmetric session key used for all subsequent payloads.",
            bullets: [
              "Perfect Forward Secrecy (PFS): Because ECDHE generates throwaway keys per session, even if an attacker steals the server's private key 3 years later, they cannot decrypt past recorded traffic.",
              "TLS 1.2 (2-RTT) vs TLS 1.3 (1-RTT): TLS 1.3 sends the client's ECDHE key share optimistically in the very first `ClientHello` packet, saving a full network round-trip.",
              "Session Resumption (0-RTT PSK): Returning clients can encrypt data on the first packet using a Pre-Shared Key ticket, though 0-RTT data must be idempotent to prevent replay attacks.",
            ],
            codeSnippet: {
              title: "Configuring a Hardened TLS 1.3 / mTLS Server in Node.js",
              code: `import https from "node:https";
import fs from "node:fs";

const mtlsServer = https.createServer({
  key: fs.readFileSync("/etc/certs/service-a.key"),
  cert: fs.readFileSync("/etc/certs/service-a.crt"),
  ca: [fs.readFileSync("/etc/certs/internal-mesh-ca.crt")],
  minVersion: "TLSv1.3",      // Enforce 1-RTT + Forward Secrecy only
  requestCert: true,          // mTLS: Require client microservice certificate
  rejectUnauthorized: true,   // Reject any caller not signed by our Mesh CA
}, (req, res) => {
  const clientCn = (req.socket as any).getPeerCertificate()?.subject?.CN;
  res.end(\`Verified zero-trust call from service: \${clientCn}\`);
});`,
            },
          },
          {
            heading: "mTLS (Mutual TLS) and Certificate Lifecycle in Microservices",
            body: "On the public web, only the server proves its identity via a certificate while the user authenticates later via cookies or OAuth tokens. Inside a backend cluster, **mTLS (Mutual TLS)** requires the client microservice to also present an X.509 certificate (often using the SPIFFE ID standard, e.g., `spiffe://prod/ns/payments/sa/checkout-svc`). Service meshes like Istio and Linkerd run Envoy sidecar proxies alongside every pod to automatically terminate mTLS and rotate certificates every 24 hours.",
            bullets: [
              "SNI (Server Name Indication): TLS extension sending the target hostname in `ClientHello` so one Load Balancer IP can host thousands of different SSL certificates.",
              "OCSP Stapling: The server fetches its own certificate revocation status from the CA and 'staples' the signed timestamp to the TLS handshake so clients don't have to query the CA during connection setup.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "TLS 1.3 with 0-RTT Session Resumption",
            pros: "Eliminates TLS handshake latency completely for repeat visitors; massive win on high-RTT mobile and international links.",
            cons: "0-RTT early data is vulnerable to network replay attacks if an attacker duplicates the initial encrypted packet.",
            bestFor: "Idempotent `GET` requests for assets, API reads, and CDN edge connections.",
          },
          {
            option: "Strict 1-RTT TLS 1.3 + Internal mTLS",
            pros: "Full replay protection via fresh server random nonces, cryptographic workload identity across all internal services.",
            cons: "1-RTT setup cost on new connections; requires automated PKI infrastructure (Vault / cert-manager) to prevent cert expiry outages.",
            bestFor: "State-mutating `POST` financial transactions, internal service-to-service RPCs, and sensitive user APIs.",
          },
        ],
        interviewTip:
          "If an interviewer asks how Service A securely talks to Service B inside your VPC without hardcoded API keys, answer: 'We use mTLS with short-lived SPIFFE certificates rotated automatically by a service mesh sidecar (Envoy/Istio), coupled with RBAC policies on the peer certificate identity.'",
      },
      {
        id: "websockets",
        topicId: "networking",
        topicTitle: "Networking",
        topicNumber: 2,
        subtopicNumber: "2.6",
        title: "WebSockets",
        subtitle:
          "Persistent full-duplex bi-directional TCP channels vs Short Polling, Long Polling, and Server-Sent Events (SSE).",
        readingTime: "8 min read",
        difficulty: "Intermediate",
        keyTakeaways: [
          "WebSockets start as a standard HTTP/1.1 request with `Connection: Upgrade` and `Upgrade: websocket` headers, then hijack the underlying TCP socket for persistent full-duplex framing.",
          "Because WebSockets are stateful, horizontal scaling requires a Pub/Sub backplane (like Redis Pub/Sub or Kafka) or consistent-hash routing so User A on Gateway 1 can message User B on Gateway 2.",
          "Do not default to WebSockets when communication is strictly one-way (Server -> Client): Server-Sent Events (SSE) over HTTP/2 is simpler, stateless-friendly, and handles automatic reconnection natively.",
        ],
        architectureDiagram: `SCALING STATEFUL WEBSOCKETS ACROSS GATEWAY NODES
[ User A ] ===(WS Conn)===> [ WS Gateway 1 ] ---+
                                                |
                                                v
                                     [ Redis Pub/Sub Cluster ]
                                     (Channel: "user:B:inbox")
                                                |
[ User B ] <==(WS Conn)==== [ WS Gateway 2 ] <--+`,
        sections: [
          {
            heading: "The Real-Time Transport Spectrum: Polling vs SSE vs WebSockets",
            body: "Standard HTTP is client-initiated: the server cannot push new data to the browser unprompted. Historically, engineers worked around this with **Short Polling** (client requests every 2 seconds—wasteful headers and empty responses) or **Long Polling** (server holds the HTTP request open until data arrives or a 30s timeout hits, then client immediately reconnects). **Server-Sent Events (SSE)** provides a standardized unidirectional stream (`text/event-stream`) from server to client over standard HTTP. **WebSockets (`ws://` / `wss://`)** upgrade the HTTP connection into a persistent, low-overhead (2-byte frame header), bi-directional binary/text channel.",
            bullets: [
              "HTTP Upgrade Handshake: Uses `Sec-WebSocket-Key` and returns `HTTP/1.1 101 Switching Protocols`, ensuring compatibility with port 80/443 firewalls.",
              "Heartbeats (Ping/Pong Frames): Intermediate NAT routers and AWS ALBs drop idle TCP connections after 60 seconds; WebSocket servers must send periodic `PING` frames (e.g., every 25s) to keep connections alive and detect zombie disconnects.",
              "Connection Limits: A single tuned Linux gateway node can hold ~100,000 to 500,000 concurrent idle WebSocket connections (each consuming ~10-20KB of kernel/app buffer memory).",
            ],
            codeSnippet: {
              title: "Distributed WebSocket Gateway with Redis Pub/Sub Backplane",
              code: `// When User A sends a message to User B, User B might be connected to ANY of our 50 WS Gateways.
// Each WS Gateway subscribes to Redis channels for its locally connected users.

export class WebSocketGatewayNode {
  private localSockets = new Map<string, WebSocket>();

  onUserConnected(userId: string, ws: WebSocket, redisSub: RedisClient) {
    this.localSockets.set(userId, ws);
    redisSub.subscribe(\`ws:user:\${userId}\`, (payload) => {
      ws.send(payload); // Push down the local persistent TCP socket
    });
  }

  async routeMessageToUser(targetUserId: string, msg: object, redisPub: RedisClient) {
    // Publish to Redis backplane; whichever Gateway holds targetUserId's socket delivers it!
    await redisPub.publish(\`ws:user:\${targetUserId}\`, JSON.stringify(msg));
  }
}`,
            },
          },
          {
            heading: "Production Challenges of Stateful WebSocket Fleets",
            body: "Operating millions of persistent WebSockets introduces operational hazards that stateless REST APIs never face. Deployments, load balancing, and reconnection storms must be carefully engineered.",
            bullets: [
              "Thundering Herd on Restart: If a gateway node holding 100,000 connections crashes, all 100k clients will attempt to reconnect and re-authenticate simultaneously—clients MUST use randomized exponential backoff + jitter.",
              "Load Balancing Metric: Never load-balance WebSocket gateways by 'Requests Per Second'—balance by **Least Active Connections**.",
              "Graceful Connection Draining: Before terminating a pod during a rolling deploy, send a custom close frame jittered over 30-60 seconds so clients migrate smoothly.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "WebSockets (Full-Duplex Persistent Socket)",
            pros: "True bi-directional sub-millisecond framing (2-10 byte overhead), supports binary and text, ideal for high-frequency client-to-server-to-client loops.",
            cons: "Stateful connections complicate L7 load balancing, deployments, and horizontal scaling; requires custom heartbeat and reconnection logic.",
            bestFor: "Multiplayer browser games, collaborative whiteboards (Figma/Miro), live chat (Slack/WhatsApp), and financial order books.",
          },
          {
            option: "Server-Sent Events (SSE) / Long Polling",
            pros: "Works natively over standard HTTP/2 (multiplexed streams), built-in browser `EventSource` auto-reconnect with `Last-Event-ID`, plays nicely with standard proxies.",
            cons: "SSE is strictly unidirectional (Server -> Client); Long Polling incurs higher HTTP header and connection cycling overhead.",
            bestFor: "AI LLM token streaming (ChatGPT), live sports score tickers, stock price dashboards, and notification feeds.",
          },
        ],
        interviewTip:
          "Interviewers love asking: 'How do you design ChatGPT's streaming response or a live stock ticker?' If the client only listens after making one request, propose **Server-Sent Events (SSE)** over HTTP/2 instead of WebSockets—and explain why avoiding stateful bi-directional socket complexity is a win.",
      },
      {
        id: "grpc-vs-rest",
        topicId: "networking",
        topicTitle: "Networking",
        topicNumber: 2,
        subtopicNumber: "2.7",
        title: "gRPC vs REST",
        subtitle:
          "Comparing contract-first Protocol Buffers over HTTP/2 against resource-oriented JSON over HTTP for external and internal APIs.",
        readingTime: "7 min read",
        difficulty: "Intermediate",
        keyTakeaways: [
          "gRPC combines strict `.proto` Interface Definition Language (IDL) contracts, compact binary Protocol Buffers serialization, and HTTP/2 multiplexed streaming.",
          "Protobuf payloads are 3x–10x smaller and 5x–20x faster to serialize/deserialize than verbose text-based JSON, saving massive CPU and network bandwidth inside microservice meshes.",
          "The golden architectural pattern: expose **REST (or GraphQL)** at the public API Gateway for browsers/third-party developers, and use **gRPC** for high-throughput internal service-to-service communication.",
        ],
        architectureDiagram: `PUBLIC EDGE (Human/Browser Friendly)      INTERNAL MESH (CPU/Bandwidth Optimized)
[ Browser / 3rd Party ]                   [ API Gateway ]
          |                                      |
          | REST (JSON over HTTPS)               | gRPC (Protobuf over HTTP/2)
          | Human-readable, native fetch()       | Binary tags, 5x faster, strict codegen
          v                                      +---> [ Auth Service ]
   [ API Gateway ]                               +---> [ Ledger Service ]
                                                 +---> [ Risk Engine (Bi-dir Stream) ]`,
        sections: [
          {
            heading: "Why gRPC Dominates Internal Microservice Meshes",
            body: "In a microservice architecture where a single user checkout triggers 30 internal RPC calls across Go, Java, Python, and Rust services, parsing text-based JSON and maintaining handwritten API client SDKs becomes a major bottleneck. **gRPC** solves both problems: you define your service methods and message schemas once in a `.proto` file, and `protoc` generates strongly-typed client stubs and server interfaces in 10+ languages. On the wire, Protocol Buffers encode fields using compact integer field tags (`1`, `2`, `3`) and variable-length integers (`varint`) instead of repeating ASCII string keys like `\"transaction_amount_cents\":`.",
            bullets: [
              "4 Communication Modes: Unary RPC (classic request/response), Server Streaming, Client Streaming, and Bi-directional Streaming over HTTP/2.",
              "Built-in Deadlines / Timeouts: Clients pass a deadline header (`grpc-timeout`) that propagates downstream so expired requests abort immediately.",
              "Schema Evolution Safety: Field numbers (`= 1;`) never change; adding optional fields or deprecating old tags preserves backward and forward compatibility.",
            ],
            codeSnippet: {
              title: "Protocol Buffers (.proto) Contract with Streaming & Deadline Usage",
              code: `// payment.proto — Single source of truth for polyglot microservices
syntax = "proto3";
package payments.v1;

service PaymentService {
  // Unary RPC
  rpc AuthorizePayment (AuthorizeRequest) returns (AuthorizeResponse);
  // Bi-directional streaming for real-time fraud scoring
  rpc StreamFraudChecks (stream FraudEvent) returns (stream FraudVerdict);
}

message AuthorizeRequest {
  string idempotency_key = 1; // Tag 1 (1 byte on wire instead of 17-byte JSON key!)
  string user_id = 2;
  int64 amount_cents = 3;
  string currency_iso = 4;
}`,
            },
          },
          {
            heading: "Why REST Still Wins at the Public Edge",
            body: "Despite gRPC's performance superiority, browsers cannot natively invoke standard gRPC without a proxy (`gRPC-Web`) because browser `fetch()` APIs do not expose raw HTTP/2 frame trailers. Furthermore, external third-party developers vastly prefer curling a human-readable JSON REST endpoint without compiling `.proto` files.",
            bullets: [
              "Universal Debuggability: Any engineer can inspect a JSON payload in Chrome DevTools or `curl` without needing a `.proto` schema file.",
              "Native HTTP Caching: REST leverages standard `GET` URLs, CDNs, and `Cache-Control` headers, whereas gRPC tunnels everything over `HTTP POST`.",
              "JSON-gRPC Transcoding: Modern Envoy/API Gateways can accept external REST JSON and automatically transcode it into internal gRPC calls.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "gRPC (Protobuf over HTTP/2)",
            pros: "5x-10x faster serialization, 60-80% smaller payloads, compile-time type safety across polyglot services, native bi-directional streaming.",
            cons: "Binary payloads are not human-readable on the wire, requires gRPC-Web proxy for browsers, harder to cache at standard HTTP CDNs.",
            bestFor: "Internal east-west microservice communication, polyglot backends, mobile-to-backend binary telemetry, and streaming RPCs.",
          },
          {
            option: "REST (JSON over HTTP/1.1, HTTP/2, or HTTP/3)",
            pros: "Zero-dependency browser compatibility, human-readable payloads, effortless CDN/HTTP caching on GET endpoints, massive ecosystem.",
            cons: "High CPU overhead parsing/stringifying large JSON trees, schema drift unless OpenAPI/Swagger codegen is strictly enforced.",
            bestFor: "Public developer APIs (Stripe/Twilio style), browser-to-gateway BFF endpoints, and cache-heavy content APIs.",
          },
        ],
        interviewTip:
          "Use the 'Mullet Architecture' rule in every interview: 'REST in the front (Browser to API Gateway for compatibility and CDN caching), gRPC in the back (Gateway to internal microservices for low latency, strict typing, and binary efficiency).'",
      },
      {
        id: "connection-pooling",
        topicId: "networking",
        topicTitle: "Networking",
        topicNumber: 2,
        subtopicNumber: "2.8",
        title: "Connection Pooling",
        subtitle:
          "Amortizing TCP/TLS/Auth handshake costs, sizing pools correctly, and scaling serverless databases with proxies like PgBouncer.",
        readingTime: "7 min read",
        difficulty: "Intermediate",
        keyTakeaways: [
          "Opening a fresh database connection on every query costs 20–50ms of TCP + TLS + DB authentication handshakes and spawns a dedicated OS process/thread on the DB server.",
          "Connection pools maintain a warm cache of open sockets in the application or proxy tier, reducing connection acquisition time from ~30ms to <0.1ms.",
          "More connections ≠ higher throughput: a PostgreSQL server with 16 CPU cores performs best with only ~35–50 active executing connections; beyond that, CPU context switching and lock contention degrade throughput.",
        ],
        architectureDiagram: `WITHOUT EXTERNAL POOLING (500 Pods x 20 Pool = 10,000 DB Connections -> DB Crashes!)
[500 App Pods / Lambdas] ========(10,000 TCP Sockets)========> [ PostgreSQL (OOM!) ]

WITH PGBOUNCER TRANSACTION POOLING (Multiplexed onto 50 Warm DB Connections)
[500 App Pods / Lambdas] ===(10,000 Client Conns)===> [ PgBouncer ] ===(50 Warm Conns)===> [ PostgreSQL ]`,
        sections: [
          {
            heading: "Why Raw Database Connections Are Expensive",
            body: "When an application connects to a database like PostgreSQL, a multi-step ritual occurs: a TCP 3-way handshake, a TLS handshake, challenge-response credential authentication, and finally PostgreSQL `fork()`s a brand-new backend OS process allocating ~5–10MB of RAM. Doing this per HTTP request adds ~30ms of latency and caps throughput. **Connection Pooling** solves this by pre-establishing a bounded pool of warm connections at startup and lending them to worker threads for the duration of a query (or transaction).",
            bullets: [
              "HikariCP / PostgreSQL Sizing Formula: `Pool Size = ((Core Count * 2) + Effective Spindle Count)`. A 16-core DB instance only needs ~35–50 concurrent active connections!",
              "Pool Exhaustion & Acquire Timeouts: Always configure a strict `connectionTimeoutMillis` (e.g., 2,000ms) so requests fail fast rather than hanging forever when the DB slows down.",
              "Idle Eviction & Max Lifetime: Periodically recycle connections (e.g., every 30 minutes with jitter) to respect DNS changes and avoid firewall idle drops.",
            ],
            codeSnippet: {
              title: "Production-Grade PostgreSQL Connection Pool Configuration",
              code: `import { Pool } from "pg";

export const dbPool = new Pool({
  host: "pgbouncer.internal.vpc",
  port: 6432,
  max: 20,                        // Max connections per microservice pod
  min: 4,                         // Keep 4 warm sockets ready at all times
  idleTimeoutMillis: 30_000,      // Close idle extra connections after 30s
  connectionTimeoutMillis: 2_000, // Fail fast if pool is exhausted > 2s
  maxUses: 7500,                  // Recycle socket after 7500 queries (prevents memory leaks & balances DNS)
});`,
            },
          },
          {
            heading: "External Connection Proxies: PgBouncer & RDS Proxy",
            body: "Suppose your database can safely handle 200 connections, and each pod has a pool size of 20. That works fine with 5 pods (100 connections). What happens when Kubernetes autoscales to 100 pods (2,000 connections) or you use AWS Lambda where 5,000 ephemeral functions spin up concurrently? Your database runs out of memory and crashes. The solution is an external connection pooler like **PgBouncer** or **AWS RDS Proxy** operating in **Transaction Pooling Mode**: it holds 10,000 lightweight client sockets on the front and multiplexes actual SQL transactions over just 50 physical database connections on the back.",
            bullets: [
              "Session Pooling Mode: Assigns a backend connection for the client's entire session lifetime (supports temp tables, advisory locks).",
              "Transaction Pooling Mode (Recommended at Scale): Assigns a physical DB connection *only* for the duration of a single `BEGIN...COMMIT` transaction or statement, achieving 20x–100x multiplexing ratios.",
              "HTTP Keep-Alive Agents: Connection pooling isn't just for databases—always enable HTTP Keep-Alive connection pools in your REST/gRPC clients (`undici`/`axios`/`http.Agent`).",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "Application-Side Connection Pool Only (HikariCP / node-pg)",
            pros: "Zero extra network hop, supports session-level features (prepared statements, `SET` variables, advisory locks).",
            cons: "Total DB connections scale linearly with `Pod Count × Pool Size`, crashing the DB during autoscaling events or serverless bursts.",
            bestFor: "Small-to-medium deployments with a fixed, predictable number of long-running application instances.",
          },
          {
            option: "External Proxy Pooler in Transaction Mode (PgBouncer / RDS Proxy)",
            pros: "Decouples app fleet size from DB connection limits, supports 10,000+ serverless Lambda/pod connections over 50 DB backends, masks failover blips.",
            cons: "Adds ~0.2-0.5ms proxy hop; session-scoped SQL features (`LISTEN/NOTIFY`, session advisory locks) cannot be used in Transaction Mode.",
            bestFor: "Large microservice fleets (50+ pods), serverless architectures (AWS Lambda), and high-scale PostgreSQL/MySQL deployments.",
          },
        ],
        interviewTip:
          "Whenever your design includes hundreds of microservice pods or serverless functions talking to a relational database, drop **PgBouncer (in Transaction Pooling mode)** in front of the database. Interviewers love seeing candidates protect the DB from connection exhaustion.",
      },
      {
        id: "load-balancer-l4-vs-l7",
        topicId: "networking",
        topicTitle: "Networking",
        topicNumber: 2,
        subtopicNumber: "2.9",
        title: "Load Balancer — L4 vs L7",
        subtitle:
          "Transport-layer packet forwarding vs Application-layer HTTP inspection, routing algorithms, health checks, and HA load balancer pairs.",
        readingTime: "8 min read",
        difficulty: "Intermediate",
        keyTakeaways: [
          "Layer 4 (Transport) Load Balancers route based solely on IP + TCP/UDP port without decrypting payloads, achieving millions of packets/sec with sub-millisecond latency.",
          "Layer 7 (Application) Load Balancers terminate TLS, parse HTTP headers/URLs/cookies, and perform content-based routing, rate limiting, and WAF inspection.",
          "In production, high-scale architectures stack both: an Anycast/L4 tier (AWS NLB / IPVS) in front of a horizontally scaled fleet of L7 proxies (Envoy / NGINX / ALB).",
        ],
        architectureDiagram: `MULTI-TIER LOAD BALANCING ARCHITECTURE
                  [ Internet Clients ]
                           |
                           v
        +------------------------------------+
        |  L4 Load Balancer (NLB / Maglev)   |  -> Inspects IP + Port only (Ultra-fast)
        +------------------+-----------------+
                           |
             +-------------+-------------+
             v                           v
   +-------------------+       +-------------------+
   | L7 Proxy (Envoy 1)|       | L7 Proxy (Envoy 2)|  -> Terminates TLS, inspects Path/Headers
   +---------+---------+       +---------+---------+
             |                           |
     +-------+-------+           +-------+-------+
     | /api/users    | /api/pay  | /api/users    | /api/pay
     v               v           v               v
 [User Pods]     [Pay Pods]  [User Pods]     [Pay Pods]`,
        sections: [
          {
            heading: "Layer 4 (Transport) vs Layer 7 (Application) Mechanics",
            body: "A Load Balancer distributes incoming network traffic across a group of backend servers to maximize utilization and ensure no single node is overwhelmed. **Layer 4 (L4)** load balancers operate at the OSI Transport Layer (TCP/UDP): they inspect only the 5-tuple (Source IP, Source Port, Dest IP, Dest Port, Protocol), rewrite the destination IP/MAC via NAT (or Direct Server Return), and forward packets along the same TCP connection between client and server. **Layer 7 (L7)** load balancers act as full reverse proxies: they terminate the client's TCP and TLS connection, decrypt and parse the HTTP request, and open a separate pooled backend TCP connection based on URL path (`/v1/orders`), `Host` header, JWT claims, or cookies.",
            bullets: [
              "L4 Examples: AWS Network Load Balancer (NLB), Linux IPVS, Google Maglev, HAProxy (TCP mode).",
              "L7 Examples: AWS Application Load Balancer (ALB), Envoy Proxy, NGINX, Cloudflare Edge.",
              "Direct Server Return (DSR) at L4: The L4 LB forwards the small request packet to the backend, and the backend sends the massive video/response payload directly back to the client IP, bypassing the LB entirely!",
            ],
            codeSnippet: {
              title: "Power-of-Two-Choices (P2C) Least-Connections Load Balancing Algorithm",
              code: `// Used by Envoy & NGINX: instead of scanning all 1,000 backends for the lowest load
// (which causes herd synchronization), pick 2 random healthy nodes and choose the better one!

interface BackendNode {
  id: string;
  healthy: boolean;
  activeRequests: number;
  ewmaLatencyMs: number;
}

export function selectBackendP2C(pool: BackendNode[]): BackendNode {
  const healthy = pool.filter((n) => n.healthy);
  if (healthy.length === 0) throw new Error("503 No healthy upstreams");
  if (healthy.length === 1) return healthy[0];

  const i = Math.floor(Math.random() * healthy.length);
  let j = Math.floor(Math.random() * (healthy.length - 1));
  if (j >= i) j++;

  const scoreA = healthy[i].activeRequests * healthy[i].ewmaLatencyMs;
  const scoreB = healthy[j].activeRequests * healthy[j].ewmaLatencyMs;
  return scoreA <= scoreB ? healthy[i] : healthy[j];
}`,
            },
          },
          {
            heading: "Routing Algorithms and High-Availability LB Pairs",
            body: "Choosing how a load balancer picks a target node depends on whether requests have uniform cost or variable cost, and whether backend nodes cache data locally. Additionally, to prevent the Load Balancer itself from becoming a Single Point of Failure, production deployments run Active-Active LB clusters using BGP Anycast or Active-Passive pairs using VRRP / Floating Virtual IPs (VIPs).",
            bullets: [
              "Round Robin / Weighted Round Robin: Cycles sequentially; ideal when all requests have identical CPU cost.",
              "Least Connections / Least Response Time (P2C): Essential for long-lived connections (WebSockets) or variable-latency queries (LLM inference, complex searches).",
              "Consistent Hashing (Ring Hash): Routes the same `user_id` or `document_id` to the same backend node to maximize in-memory L1 cache hit rates.",
              "Active vs Passive Health Checks: Active pings `/healthz` every 5s; Passive (Outlier Detection) ejects a node immediately if it returns 3 consecutive `5xx` errors.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "Layer 4 Load Balancer (TCP / UDP Packet Level)",
            pros: "Millions of QPS per node, ultra-low latency (<100 microseconds), protocol-agnostic (works for raw TCP databases, MQTT, UDP gaming, DNS).",
            cons: "Blind to HTTP paths, headers, and cookies; cannot terminate TLS (unless TLS offload enabled), cannot do path-based microservice routing or WAF.",
            bestFor: "Edge ingress in front of L7 proxies, non-HTTP TCP/UDP protocols, and ultra-high-throughput media streaming (with DSR).",
          },
          {
            option: "Layer 7 Load Balancer (HTTP / gRPC Application Level)",
            pros: "Smart routing by URL/header/cookie, centralized TLS termination, connection multiplexing, canary weight splitting, built-in WAF and rate limiting.",
            cons: "Higher CPU and memory footprint (buffers payloads and maintains two TCP sockets), slightly higher latency (~1-2ms).",
            bestFor: "Microservice API routing, gRPC load balancing (requires L7 to inspect HTTP/2 frames!), and canary deployments.",
          },
        ],
        interviewTip:
          "Remember this critical nuance: **An L4 Load Balancer cannot properly load-balance gRPC or HTTP/2!** Because HTTP/2 multiplexes all requests over a single persistent TCP connection, an L4 LB will pin 100% of a caller's traffic to a single backend pod. You MUST use an L7 Load Balancer (like Envoy) to balance individual HTTP/2 streams.",
      },
    ],
  },
  {
    id: "api-design",
    topicNumber: 3,
    title: "API Design",
    description:
      "Designing resilient, evolvable, and secure service contracts: RESTful modeling, versioning, cursor pagination, idempotency, rate limiting, gateways, and auth.",
    subtopics: [
      {
        id: "rest-api-design",
        topicId: "api-design",
        topicTitle: "API Design",
        topicNumber: 3,
        subtopicNumber: "3.1",
        title: "REST API Design",
        subtitle:
          "Resource-oriented noun hierarchies, HTTP verb semantics, RFC 7807 error envelopes, filtering, and handling non-CRUD actions cleanly.",
        readingTime: "7 min read",
        difficulty: "Foundational",
        keyTakeaways: [
          "Model URLs around plural resource **nouns** (`/v1/orders/{id}/items`), never RPC verbs (`/v1/createNewOrder`), and let HTTP methods (`GET`, `POST`, `PATCH`, `DELETE`) express the action.",
          "Standardize error responses across all microservices using a machine-parsable envelope (RFC 7807 Problem Details) with stable error codes, request trace IDs, and field-level validation details.",
          "When a business action doesn't map cleanly to CRUD (e.g., transferring funds or cancelling an order), model the action as a **sub-resource noun** (`POST /v1/orders/{id}/cancellation` or `POST /v1/transfers`).",
        ],
        architectureDiagram: `RESOURCE HIERARCHY & HTTP VERB MATRIX
+-------------------------------------------------------------------------+
| Collection: /v1/projects/{projectId}/deployments                        |
+-------------------------------------------------------------------------+
| GET    /v1/projects/p_1/deployments       -> List deployments (200 OK)  |
| POST   /v1/projects/p_1/deployments       -> Create deployment (201/202)|
| GET    /v1/projects/p_1/deployments/d_9   -> Fetch single (200 OK)      |
| PATCH  /v1/projects/p_1/deployments/d_9   -> Partial update (200 OK)    |
| DELETE /v1/projects/p_1/deployments/d_9   -> Delete resource (204)      |
| POST   /v1/projects/p_1/deployments/d_9/rollback -> Action sub-resource |
+-------------------------------------------------------------------------+`,
        sections: [
          {
            heading: "Resource Modeling, Nesting Depth, and Non-CRUD Actions",
            body: "Representational State Transfer (REST), defined by Roy Fielding, treats every domain concept as an addressable **Resource** manipulated through standard HTTP verbs. Good REST APIs are predictable: once an engineer learns how `/v1/users` works, they immediately know how `/v1/invoices` works. Keep URL nesting to at most 2 levels (`/v1/organizations/{orgId}/members`); if you need deeper access, allow querying the child resource directly by its globally unique prefixed ID (`/v1/members/mem_892a`).",
            bullets: [
              "Opaque Prefixed IDs (Stripe Pattern): Use prefixed K-sortable IDs like `ord_01HQ8...` or `usr_01HQ8...` instead of sequential integers (`1, 2, 3`) to prevent ID enumeration attacks and make logs self-describing.",
              "`PUT` vs `PATCH`: `PUT` replaces the entire resource representation (missing fields are nulled), whereas `PATCH` applies a partial update to only the provided fields.",
              "Query Filtering & Sorting: Use query parameters for collection slicing (`GET /v1/orders?status=SHIPPED&sort=-created_at&fields=id,total_cents`).",
            ],
            codeSnippet: {
              title: "Production REST Response & RFC 7807 Error Envelope Contract",
              code: `// 1. Standardized Collection Response Envelope
export interface ListResponse<T> {
  data: T[];
  pagination: {
    next_cursor: string | null;
    has_more: boolean;
  };
  meta: { request_id: string };
}

// 2. RFC 7807 Problem Details Error Response (HTTP 422 Unprocessable Entity)
export const validationErrorExample = {
  type: "https://api.example.com/errors/validation-failed",
  title: "Request Validation Failed",
  status: 422,
  code: "INVALID_FIELD_VALUE",
  detail: "One or more fields in the request payload failed validation.",
  request_id: "req_01HV9X2K8P",
  errors: [
    { field: "amount_cents", reason: "Must be a positive integer >= 50" },
  ],
};`,
            },
          },
          {
            heading: "Long-Running Asynchronous Operations in REST",
            body: "When a `POST` or `DELETE` operation takes longer than ~500ms (e.g., provisioning a database cluster or exporting a 10GB archive), do not hold the HTTP connection open. Return `HTTP 202 Accepted` immediately with a `Location: /v1/operations/op_772` header pointing to an **Operation Resource** that the client can poll (with a `Retry-After: 5` header) or subscribe to via webhook until `status === 'SUCCEEDED'`.",
            bullets: [
              "Bulk Operations: Avoid N+1 client round-trips by offering batch endpoints (`POST /v1/messages:batchDelete`) that return per-item status arrays (`207 Multi-Status`).",
              "Consistent Timestamps & Money: Always use ISO-8601 UTC strings (`2026-03-15T14:30:00Z`) for time and integer smallest-currency units (`amount_cents: 1999` + `currency: 'USD'`) to avoid IEEE 754 floating-point bugs.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "Pure RESTful Resource API",
            pros: "Leverages native HTTP caching, status codes, and CDN semantics; predictable uniform interface; zero custom client tooling required.",
            cons: "Can cause over-fetching (returning 50 fields when mobile needs 3) or under-fetching (requiring multiple round-trips for nested graphs).",
            bestFor: "Public platform APIs, microservice domain boundaries, and standard CRUD/resource-oriented SaaS products.",
          },
          {
            option: "GraphQL / BFF Aggregation Layer",
            pros: "Clients fetch exact fields across multiple resources in a single round-trip; eliminates mobile over-fetching.",
            cons: "Breaks standard HTTP URL caching (all queries use `POST /graphql`), vulnerable to expensive nested N+1 query DoS without query depth limiters.",
            bestFor: "Complex UI dashboards and mobile apps aggregating data from 10+ microservices via a Backend-for-Frontend (BFF).",
          },
        ],
        interviewTip:
          "When writing API signatures on the whiteboard, never use floating-point numbers for money (`price: 19.99`). Always write `amount_cents: 1999` and `currency: 'USD'`. Calling this out earns instant credibility.",
      },
      {
        id: "api-versioning",
        topicId: "api-design",
        topicTitle: "API Design",
        topicNumber: 3,
        subtopicNumber: "3.2",
        title: "API Versioning",
        subtitle:
          "Evolving APIs safely without breaking existing mobile and third-party clients via URI paths, headers, and date-based pinned versions.",
        readingTime: "6 min read",
        difficulty: "Foundational",
        keyTakeaways: [
          "Once an API is consumed by external third parties or deployed mobile apps (where users don't update for months), breaking changes require explicit versioning.",
          "Additive changes (adding new optional request fields or new response properties) are backward-compatible; renaming, removing, or changing field types is a breaking change.",
          "URI Path Versioning (`/v1/orders`) is the most pragmatic and debuggable industry standard, while Stripe-style Date Header Pinning (`Stripe-Version: 2026-03-01`) excels for complex developer platforms.",
        ],
        architectureDiagram: `URI PATH VERSIONING                      STRIPE-STYLE TRANSFORMER PIPELINE
[ Client v1 ] ---> /v1/charges           [ Client (Pinned: 2024-01-01) ]
[ Client v2 ] ---> /v2/charges                         |
                       |                               v
                       v                 [ Core Engine (Latest 2026 Schema) ]
            [ API Gateway Router ]                     |
               /              \                        v
              v                v         [ Response Version Transformer ]
       [ v1 Handler ]   [ v2 Handler ]   (Downgrades 2026 -> 2025 -> 2024 JSON)`,
        sections: [
          {
            heading: "Comparing the Three Main API Versioning Strategies",
            body: "Every successful API eventually needs to change a data structure—for example, splitting a single `name: string` field into `first_name` and `last_name`, or changing a synchronous response into an asynchronous job. Because you cannot force every customer or iOS user on a 2-year-old app version to deploy simultaneously, you must support multiple contract versions concurrently during a deprecation window.",
            bullets: [
              "1. URI Path Versioning (`/v1/users`, `/v2/users`): Explicit, visible in browser bars and server logs, trivial to route in any L7 Load Balancer or CDN.",
              "2. Header / Media-Type Versioning (`Accept: application/vnd.company.v2+json` or `X-API-Version: 2026-03-01`): Keeps resource URLs pure and unchanging across versions.",
              "3. Query Parameter Versioning (`/users?version=2`): Easy to test in a browser, but often complicates CDN cache key rules.",
            ],
            codeSnippet: {
              title: "Backwards-Compatible Schema Transformer Middleware (Stripe Pattern)",
              code: `// Instead of maintaining 5 duplicated controller codebases for v1..v5,
// core business logic always runs on the LATEST schema, and pure functions
// transform requests/responses at the edge for older pinned clients!

interface ChargeV2 { id: string; amount_cents: number; status: "SUCCEEDED" | "FAILED"; }
interface ChargeV1 { id: string; amount: string; paid: boolean; } // Legacy v1 contract

export function downgradeChargeV2ToV1(v2: ChargeV2): ChargeV1 {
  return {
    id: v2.id,
    amount: (v2.amount_cents / 100).toFixed(2),
    paid: v2.status === "SUCCEEDED",
  };
}`,
            },
          },
          {
            heading: "Deprecation Lifecycle and Avoiding Version Sprawl",
            body: "Creating `/v2` by copy-pasting your entire controller directory leads to maintenance bankruptcy. Instead, strive for **Expand-and-Contract (Parallel Change)** evolution within the same major version whenever possible, and use standard RFC 8594 `Sunset` and `Deprecation` HTTP headers to warn clients before retiring old versions.",
            bullets: [
              "Expand-and-Contract: First add the new field (`full_name`) alongside the old field (`name`), dual-populate both for 6 months while monitoring usage metrics, then remove the old field only when traffic hits 0%.",
              "Sunset Headers: Return `Deprecation: true` and `Sunset: Wed, 11 Nov 2026 23:59:59 GMT` so client SDKs log automated warnings.",
              "Postel's Law (Tolerant Reader): Clients should ignore unknown new fields in JSON responses rather than throwing strict deserialization errors.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "URI Path Versioning (/v1/resources, /v2/resources)",
            pros: "100% explicit in curl, logs, documentation, and API gateway routing rules; impossible for a developer to miss which version they are calling.",
            cons: "Coarse-grained (bumping `/v2` usually implies versioning the whole API surface); changes resource URIs when upgrading.",
            bestFor: "90% of public REST APIs, microservice endpoints, and mobile backend APIs.",
          },
          {
            option: "Header-Based Date Versioning (X-API-Version: 2026-03-01)",
            pros: "Allows fine-grained, incremental breaking changes via composable request/response migration gates without changing URLs.",
            cons: "Requires building a version-transformation pipeline in the gateway; harder to test casually in a browser address bar.",
            bestFor: "Developer-first API platforms (Stripe, Twilio, GitHub) with hundreds of evolving endpoints and per-account version pinning.",
          },
        ],
        interviewTip:
          "In a system design interview, always prefix your endpoints with `/v1/...` (e.g., `POST /v1/bookings`) automatically without waiting to be asked. It takes 3 characters and shows production discipline.",
      },
      {
        id: "pagination",
        topicId: "api-design",
        topicTitle: "API Design",
        topicNumber: 3,
        subtopicNumber: "3.3",
        title: "Pagination",
        subtitle:
          "Why Offset/Limit pagination collapses on deep pages and real-time feeds, and how Keyset/Cursor pagination guarantees O(1) index performance.",
        readingTime: "7 min read",
        difficulty: "Intermediate",
        keyTakeaways: [
          "Offset pagination (`LIMIT 20 OFFSET 100000`) forces the database to scan and discard 100,000 rows on disk (`O(N)` cost), causing severe latency spikes on deep pages.",
          "Offset pagination also suffers from the **Page Drift (Duplicate/Skipped Row)** bug when new items are inserted at the top of a real-time feed while a user scrolls.",
          "Cursor (Keyset) pagination encodes the last seen `(created_at, id)` tuple into an opaque token and uses an indexed `WHERE (created_at, id) < ($1, $2)` seek (`O(1)` cost).",
        ],
        architectureDiagram: `OFFSET PAGINATION (O(N) Full Scan + Drift Bug!)
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 100000;
[DB Engine]: Scans 100,020 rows -> Discards first 100,000 -> Returns 20 (Slow!)

CURSOR / KEYSET PAGINATION (O(1) B-Tree Index Seek!)
SELECT * FROM posts WHERE (created_at, id) < ('2026-03-10T12:00Z', 'p_882')
ORDER BY created_at DESC, id DESC LIMIT 20;
[B-Tree Index]: Jumps directly to ('2026-03-10T12:00Z', 'p_882') -> Reads next 20!`,
        sections: [
          {
            heading: "The Two Fatal Flaws of Offset Pagination at Scale",
            body: "Beginner APIs implement pagination using `?page=5&limit=20`, which translates to `SELECT * FROM items ORDER BY created_at DESC LIMIT 20 OFFSET 80`. While this works for small admin tables, it fails catastrophically on large or rapidly mutating datasets for two reasons: (1) **Database I/O Amplification**: To serve `OFFSET 500,000`, PostgreSQL or MySQL must still walk through 500,000 index/heap entries just to count and throw them away. (2) **Data Drift on Inserts**: If a user loads Page 1 (items 1–20), and 3 new tweets arrive at the top before they request Page 2 (`OFFSET 20`), the user will see items 18, 19, and 20 duplicated at the top of Page 2!",
            bullets: [
              "Deep Offset DoS Attack: Scrapers requesting `?page=50000` can easily bring down a production database with CPU-pegging offset scans.",
              "COUNT(*) Overhead: Returning `total_pages: 48291` requires running `SELECT COUNT(*)` across millions of rows on every request.",
            ],
            codeSnippet: {
              title: "Opaque Base64 Cursor (Keyset) Pagination with Tie-Breaker ID",
              code: `// Composite B-Tree Index: CREATE INDEX idx_posts_cursor ON posts (created_at DESC, id DESC);
// Why include 'id'? Multiple rows can share the exact same millisecond timestamp!

export interface CursorPayload { createdAt: string; id: string; }

export function encodeCursor(row: CursorPayload): string {
  return Buffer.from(JSON.stringify(row)).toString("base64url");
}

export async function listFeedPosts(rawCursor: string | undefined, limit = 20, db: DbClient) {
  // Fetch limit + 1 to cheaply determine 'has_more' without a second query!
  if (!rawCursor) {
    const rows = await db.query(
      "SELECT * FROM posts ORDER BY created_at DESC, id DESC LIMIT $1",
      [limit + 1]
    );
    return formatPage(rows, limit);
  }

  const { createdAt, id } = JSON.parse(Buffer.from(rawCursor, "base64url").toString()) as CursorPayload;
  const rows = await db.query(
    \`SELECT * FROM posts
     WHERE (created_at, id) < ($1, $2)
     ORDER BY created_at DESC, id DESC
     LIMIT $3\`,
    [createdAt, id, limit + 1]
  );
  return formatPage(rows, limit);
}`,
            },
          },
          {
            heading: "Engineering Bulletproof Cursor Pagination",
            body: "Cursor (or Keyset) pagination replaces row-count offsets with a pointer to the last item seen on the current page. By base64-encoding the sort key and a unique tie-breaker ID (e.g., `{\"createdAt\":\"2026-03-10T12:00:00.000Z\",\"id\":\"post_991\"}`), the server keeps the cursor **opaque** so clients don't hardcode internal database column names, allowing you to swap PostgreSQL for DynamoDB or Elasticsearch later without breaking the API contract.",
            bullets: [
              "Always Include a Unique Tie-Breaker: If 50 events occur in the same millisecond, `WHERE created_at < $1` will skip 49 of them! Always use a tuple comparison `WHERE (created_at, id) < ($1, $2)` backed by a composite index.",
              "The `LIMIT + 1` Trick: Request `21` rows from the DB when the user asks for `limit=20`. If 21 rows return, slice off the 21st row and set `has_more: true`—zero extra queries needed!",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "Cursor / Keyset Pagination (?cursor=eyJ...&limit=20)",
            pros: "Constant O(1) database seek time whether on Page 1 or Page 100,000; immune to duplicate/skipped items during live inserts.",
            cons: "Cannot jump directly to an arbitrary page number ('Jump to Page 42'); sorting columns must be backed by a composite B-tree index.",
            bestFor: "Infinite-scroll social feeds, chat message history, transaction logs, and high-scale public APIs.",
          },
          {
            option: "Offset / Limit Pagination (?page=3&limit=20)",
            pros: "Supports numbered page buttons (`1, 2, 3 ... 15`) in back-office data tables; trivial to combine with arbitrary ad-hoc column sorting.",
            cons: "Degrades linearly `O(Offset)` on deep pages; causes duplicate/missed rows when data changes between page loads.",
            bestFor: "Internal admin dashboards, small bounded datasets (< 10,000 rows), or search UIs capped at max 50 pages.",
          },
        ],
        interviewTip:
          "Whenever an interview involves a feed, chat history, or activity log, explicitly state: 'We will use Cursor-based Keyset Pagination on `(created_at, id)` rather than `OFFSET` to avoid O(N) scan degradation and duplicate items when new posts arrive.'",
      },
      {
        id: "idempotency",
        topicId: "api-design",
        topicTitle: "API Design",
        topicNumber: 3,
        subtopicNumber: "3.4",
        title: "Idempotency",
        subtitle:
          "Guaranteeing Exactly-Once side effects over At-Least-Once networks using Idempotency-Key headers, atomic locks, and cached responses.",
        readingTime: "8 min read",
        difficulty: "Advanced",
        keyTakeaways: [
          "In a distributed system, when a client experiences a network timeout on `POST /v1/payments`, it cannot know if the server crashed *before* or *after* charging the credit card.",
          "Without idempotency, retrying a timed-out `POST` request causes catastrophic double-charges or duplicate orders.",
          "True idempotency requires the client to generate a UUID `Idempotency-Key` per logical intent, and the server to atomically track key state (`IN_PROGRESS` vs `COMPLETED`) alongside the database mutation.",
        ],
        architectureDiagram: `THE NETWORK TIMEOUT AMBIGUITY & IDEMPOTENCY KEY RESCUE
[ Client ]                                            [ Payment API + Redis/DB ]
    |--- 1. POST /pay (Idempotency-Key: "uuid-99") -------->|
    |                                                       |-- Lock Key "uuid-99"
    |                                                       |-- Charge Card ($50)
    |                                                       |-- Save Response (200 OK)
    |    X <--- (Network Drops Response Packet!) -----------|
    |
    |--- 2. RETRY POST /pay (Idempotency-Key: "uuid-99") -->|
    |                                                       |-- Key "uuid-99" Found!
    |<-- 3. Returns Cached 200 OK (Card NOT Charged Twice!)-|-- Skip Stripe Call`,
        sections: [
          {
            heading: "Why Retries Are Unsafe Without Idempotency Keys",
            body: "An operation is **idempotent** if executing it multiple times produces the exact same system state and side effects as executing it once (`f(f(x)) = f(x)`). While `GET`, `PUT`, and `DELETE` are naturally idempotent by HTTP specification, `POST` (creating an order, transferring money, sending an email) is NOT. Because mobile networks drop packets and load balancers retry on `502/504`, distributed systems provide **At-Least-Once** message delivery over the wire. To achieve **Effectively-Once** business execution, the client generates a unique `Idempotency-Key: <UUIDv4>` header before the first attempt and reuses that exact same key across all retries of that operation.",
            bullets: [
              "Payload Fingerprint Check: Store a SHA-256 hash of the request body alongside the `Idempotency-Key`. If a buggy client reuses the same key with different payment parameters, immediately return `422 Unprocessable Entity`.",
              "Concurrent In-Flight Race Protection: If the client retries while Attempt #1 is still executing (`status === 'IN_PROGRESS'`), return `409 Conflict` (or wait on the lock) so two threads don't run simultaneously.",
              "TTL Expiry: Retain idempotency keys in Redis or PostgreSQL for `24 to 72 hours`, after which keys are pruned.",
            ],
            codeSnippet: {
              title: "Atomic Idempotency Middleware with In-Flight Lock & Payload Hash",
              code: `export async function executeIdempotent<T>(
  idempotencyKey: string,
  requestHash: string,
  redis: RedisClient,
  handler: () => Promise<{ status: number; body: T }>
) {
  const storageKey = \`idem:\${idempotencyKey}\`;

  // 1. Atomic SET NX (Set if Not Exists) with 60s lock lease for IN_PROGRESS
  const acquired = await redis.set(
    storageKey,
    JSON.stringify({ state: "IN_PROGRESS", requestHash }),
    { NX: true, EX: 60 }
  );

  if (!acquired) {
    const existing = JSON.parse((await redis.get(storageKey))!);
    if (existing.requestHash !== requestHash) {
      return { status: 422, body: { error: "Idempotency-Key reused with different payload" } };
    }
    if (existing.state === "IN_PROGRESS") {
      return { status: 409, body: { error: "Request with this Idempotency-Key is currently in progress" } };
    }
    // Completed! Return cached status and body without re-running business logic
    return { status: existing.status, body: existing.body as T };
  }

  // 2. Execute side effect and persist completed result for 24 hours (86400s)
  const result = await handler();
  await redis.set(
    storageKey,
    JSON.stringify({ state: "COMPLETED", requestHash, ...result }),
    { EX: 86400 }
  );
  return result;
}`,
            },
          },
          {
            heading: "Transactional Idempotency in Databases & Message Consumers",
            body: "Storing idempotency state in Redis and business state in PostgreSQL still leaves a tiny window where the process crashes after committing to PostgreSQL but before updating Redis. For financial systems, store the `idempotency_key` in an `idempotency_keys` table **inside the exact same ACID database transaction** as the ledger mutation (`UNIQUE (user_id, idempotency_key)`).",
            bullets: [
              "Database Unique Constraint Guard: `INSERT INTO payments (id, idempotency_key, amount) VALUES (...) ON CONFLICT (idempotency_key) DO NOTHING` makes double-insertion mathematically impossible.",
              "Kafka / SQS Consumer Idempotency: Track processed `event_id`s in a deduplication table or use monotonic version checks (`WHERE version = $expectedVersion`) on target rows.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "Redis-Backed Idempotency Cache (SET NX + TTL)",
            pros: "Sub-millisecond lookup latency, automatic TTL expiration of old keys after 24h, offloads duplicate retry storms from hitting the primary SQL DB.",
            cons: "Not transactionally bound to SQL commits unless staged carefully; if Redis loses un-replicated keys on failover, a retry could re-execute.",
            bestFor: "High-throughput API gateways, notification dispatchers, and general microservice POST endpoints.",
          },
          {
            option: "ACID Relational Table Idempotency (Same DB Transaction)",
            pros: "100% atomic commit of both the business state change and the completed idempotency response; zero crash recovery window.",
            cons: "Adds an extra row write/index lookup to the primary relational database on every mutating call; requires a cron job to purge expired keys.",
            bestFor: "Payment gateways (Stripe/Adyen style), wallet transfers, order creation, and ledger accounting.",
          },
        ],
        interviewTip:
          "In any payment, e-commerce, or booking interview, explaining the **3 states of an Idempotency Key** (`STARTED/IN_PROGRESS`, `COMPLETED`, and `FAILED_RETRYABLE`) immediately elevates your answer to Staff+ level.",
      },
      {
        id: "rate-limiting",
        topicId: "api-design",
        topicTitle: "API Design",
        topicNumber: 3,
        subtopicNumber: "3.5",
        title: "Rate Limiting",
        subtitle:
          "Comparing Token Bucket, Leaky Bucket, Fixed Window, and Sliding Window algorithms, plus distributed Redis Lua atomic execution.",
        readingTime: "8 min read",
        difficulty: "Intermediate",
        keyTakeaways: [
          "Rate limiting protects backend services from DDoS attacks, noisy-neighbor tenants, credential stuffing, and runaway cloud costs by returning `HTTP 429 Too Many Requests`.",
          "**Token Bucket** is the industry default for APIs (allows controlled short bursts up to bucket capacity), while **Sliding Window Log/Counter** eliminates the 2x boundary spike bug of Fixed Windows.",
          "In a distributed API Gateway fleet, prevent race conditions between concurrent gateway nodes by executing the rate-limit check-and-decrement inside an **atomic Redis Lua script**.",
        ],
        architectureDiagram: `TOKEN BUCKET (Allows Bursts)              FIXED WINDOW BOUNDARY BUG (2x Spike!)
   Refill: 2 tokens/sec                     Limit: 100 req / minute
        |                                        Window 1          Window 2
        v                                   |----00:00 to 01:00----|----01:00 to 02:00----|
  +-----------+                                          [100 reqs] [100 reqs]
  | o o o o o | Capacity = 5                             at 00:59!  at 01:01!
  +-----+-----+                             --> 200 requests in 2 seconds!
        |                                       (Solved by Sliding Window Counter)
   Req takes 1 token -> 200 OK
   Empty? -> 429 Too Many Requests`,
        sections: [
          {
            heading: "Comparing the 5 Core Rate Limiting Algorithms",
            body: "Choosing the right rate-limiting algorithm depends on whether your downstream system can tolerate short bursts of traffic (like a user opening 5 browser tabs at once) or requires a strictly smoothed constant inflow rate.",
            bullets: [
              "1. Token Bucket (Stripe / AWS API Gateway): A bucket holds up to `B` tokens and refills at `R` tokens/sec. Each request consumes 1 token. Allows legitimate bursts up to `B` while capping long-term average rate to `R`. Memory footprint: just 2 numbers (`tokens`, `last_refill_ts`) per user!",
              "2. Leaky Bucket (Shopify / Network Traffic Shaping): Requests enter a FIFO queue of fixed size and leak out at a strict constant rate. Smooths bursts completely, but adds queuing delay.",
              "3. Fixed Window Counter: Increments a Redis counter keyed by `user_id:minute_bucket`. Simple (`O(1)`), but allows `2x` the limit across window boundaries (e.g., 100 requests at `00:59` and 100 at `01:01`).",
              "4. Sliding Window Log: Stores exact timestamps in a Redis Sorted Set (`ZSET`), removes entries older than `now - 60s` (`ZREMRANGEBYSCORE`), and counts remaining (`ZCARD`). 100% accurate, but high memory cost for high limits.",
              "5. Sliding Window Counter: Hybrid weighted average of the previous fixed window and current fixed window (`prev_count * overlap_% + curr_count`). 99.9% accurate using only 2 integers!",
            ],
            codeSnippet: {
              title: "Atomic Distributed Token Bucket in Redis Lua (Race-Condition Free)",
              code: `-- Executed via EVALSHA on Redis so read + refill math + write runs atomically in <0.2ms!
-- KEYS[1] = "rl:bucket:user_123"
-- ARGV[1] = capacity (e.g. 20), ARGV[2] = refill_rate_per_ms, ARGV[3] = now_ms

local data = redis.call("HMGET", KEYS[1], "tokens", "last_ts")
local tokens = tonumber(data[1])
local last_ts = tonumber(data[2])
local capacity = tonumber(ARGV[1])
local rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

if tokens == nil then
  tokens = capacity
  last_ts = now
else
  local elapsed = math.max(0, now - last_ts)
  tokens = math.min(capacity, tokens + (elapsed * rate))
  last_ts = now
end

if tokens >= 1 then
  tokens = tokens - 1
  redis.call("HMSET", KEYS[1], "tokens", tokens, "last_ts", last_ts)
  redis.call("EXPIRE", KEYS[1], 3600)
  return {1, math.floor(tokens)} -- Allowed (1) + remaining tokens
else
  return {0, 0}                  -- Rejected (429 Too Many Requests)
end`,
            },
          },
          {
            heading: "Distributed Rate Limiting Architecture & Client Headers",
            body: "When running 50 API Gateway pods, storing counters in local pod memory means a user can exceed their limit by 50x unless sticky routing is used. Centralizing state in a **Redis Cluster** using atomic Lua scripts solves this. Always return standard rate-limit response headers so well-behaved client SDKs can self-throttle before getting blocked.",
            bullets: [
              "Standard Response Headers: `X-RateLimit-Limit: 100`, `X-RateLimit-Remaining: 42`, `X-RateLimit-Reset: 1710514800`, and `Retry-After: 15` on `HTTP 429`.",
              "Fail-Open vs Fail-Closed: If the Redis rate-limiter cluster goes down, most user-facing APIs **fail open** (allow traffic through using local fallback memory limits) rather than taking down the entire company.",
              "Multi-Dimensional Rules: Rate-limit by `User ID`, `API Key`, `IP Address` (for unauthenticated endpoints like `/login`), and endpoint cost weight.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "Token Bucket (2 fields in Redis Hash via Lua)",
            pros: "O(1) tiny memory footprint (16 bytes per user), naturally accommodates brief user bursts without false-positive 429s.",
            cons: "Downstream services must be able to handle brief simultaneous bursts equal to bucket capacity `B`.",
            bestFor: "General user-facing REST/GraphQL APIs, SaaS tier quotas, and cloud control-plane APIs.",
          },
          {
            option: "Sliding Window Counter / Leaky Bucket",
            pros: "Prevents boundary burst spikes (Sliding Window) or smooths outflow to a strict constant QPS (Leaky Bucket) to protect fragile databases.",
            cons: "Leaky Bucket delays requests in a queue; Sliding Window Log consumes excessive RAM for high-volume users (e.g., 10,000 req/min).",
            bestFor: "Protecting legacy third-party banking rails, SMS gateways, or strict per-second compliance limits.",
          },
        ],
        interviewTip:
          "If asked to design a Rate Limiter in an interview, explicitly mention the **Read-Modify-Write Race Condition** when two gateway nodes read `count = 99` from Redis at the same time and both write `100`, and explain how a **Redis Lua Script** (`EVAL`) or `INCR` guarantees single-threaded atomicity.",
      },
      {
        id: "api-gateway",
        topicId: "api-design",
        topicTitle: "API Design",
        topicNumber: 3,
        subtopicNumber: "3.6",
        title: "API Gateway",
        subtitle:
          "Centralizing cross-cutting edge concerns—TLS termination, JWT validation, rate limiting, routing, and the Backend-for-Frontend (BFF) pattern.",
        readingTime: "7 min read",
        difficulty: "Intermediate",
        keyTakeaways: [
          "An API Gateway is the single L7 entry point for external clients, offloading cross-cutting concerns (AuthN, Rate Limiting, WAF, TLS, Observability) from internal microservices.",
          "The **Backend-for-Frontend (BFF)** pattern deploys tailored gateway layers per client type (Mobile BFF vs Web BFF vs Public API) to optimize payload shapes and aggregation.",
          "Never put heavy business logic or synchronous cross-service orchestration loops inside a monolithic shared API Gateway, or it becomes an organizational bottleneck and SPOF.",
        ],
        architectureDiagram: `[ iOS / Android ]      [ Web SPA ]         [ 3rd Party Devs ]
        \                   |                      /
         v                  v                     v
+----------------------------------------------------------------+
|                  EDGE API GATEWAY (Envoy / Kong)               |
|  [1. TLS Termination] -> [2. WAF / DDoS] -> [3. Rate Limiter]  |
|  [4. JWT Signature Auth] -> [5. Protocol Translation JSON->gRPC]|
+----------------------------------------------------------------+
         |                         |                      |
         v                         v                      v
  [ Mobile BFF ]            [ Order Svc ]          [ Search Svc ]`,
        sections: [
          {
            heading: "The 6 Core Responsibilities of an API Gateway",
            body: "Without an API Gateway, every single client app (iOS, Android, Web) would need to know the hostnames of 50 internal microservices, and every single microservice team would have to re-implement TLS termination, OAuth JWT validation, IP rate limiting, CORS headers, and access logging across 5 different programming languages. An API Gateway (such as Kong, AWS API Gateway, Envoy, or Apigee) consolidates these cross-cutting edge concerns into a hardened, horizontally scaled proxy tier.",
            bullets: [
              "1. Authentication Offload: Validates the client's JWT signature (using cached JWKS public keys) at the edge and forwards verified internal identity headers (`X-User-Id`, `X-Tenant-Id`) or an internal token to upstream services.",
              "2. Rate Limiting & Quota Enforcement: Enforces per-tenant and per-IP token buckets before malicious traffic reaches internal compute.",
              "3. Dynamic Routing & Canary Releases: Routes `/v1/orders` to the Order Service and shifts 5% of traffic to `orders-v2` canary pods.",
              "4. Protocol Translation: Accepts external HTTP/JSON or GraphQL and transcodes it into high-speed internal gRPC calls.",
            ],
            codeSnippet: {
              title: "API Gateway Edge Pipeline Execution Order",
              code: `export async function apiGatewayPipeline(req: IncomingHttpRequest): Promise<HttpResponse> {
  const traceId = req.headers["x-request-id"] ?? crypto.randomUUID();

  // 1. IP & WAF Check (Cheapest check first!)
  if (wafBlockedIpSet.has(req.clientIp)) return { status: 403, body: "Forbidden" };

  // 2. Authentication (Verify RS256/EdDSA JWT locally using cached public key - 0 DB calls!)
  const claims = verifyJwtLocally(req.headers["authorization"], cachedJwksPublicKeys);
  if (!claims) return { status: 401, body: "Unauthorized" };

  // 3. Per-Tenant Distributed Rate Limit
  const allowed = await checkTokenBucket(claims.sub, claims.tier);
  if (!allowed) return { status: 429, body: "Too Many Requests" };

  // 4. Route & Forward with verified identity context + Distributed Trace Header
  return forwardToUpstreamService(req, {
    "x-trace-id": traceId,
    "x-authenticated-user-id": claims.sub,
    "x-tenant-scopes": claims.scopes.join(","),
  });
}`,
            },
          },
          {
            heading: "The Backend-for-Frontend (BFF) Pattern",
            body: "A mobile app on a 3G connection wants a single compact endpoint (`GET /mobile/home-screen`) that aggregates user profile, unread notification count, and top 5 feed items in 2KB. Meanwhile, a desktop web dashboard wants rich 50-field tables. Instead of bloating one generic gateway, teams build specialized **Backend-for-Frontend (BFF)** services owned by the respective frontend/mobile teams, sitting just behind the edge routing gateway.",
            bullets: [
              "Mobile BFF: Strips unnecessary fields, merges 4 internal gRPC calls via `Promise.allSettled()`, and formats payloads for mobile UI components.",
              "Partial Failure Resilience: If the internal Recommendation Service times out during BFF aggregation, the BFF still returns 200 OK with the user's orders and an empty `recommendations: []` fallback array.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "Single Centralized API Gateway (Kong / Envoy / AWS API GW)",
            pros: "Uniform security, rate limiting, TLS, and observability across the entire company; simple single domain (`api.company.com`) for clients.",
            cons: "Adds an extra network hop (~1-2ms); can become a deployment bottleneck if teams put custom business logic or complex transformations inside it.",
            bestFor: "Cross-cutting edge security, routing, rate limiting, and public developer APIs.",
          },
          {
            option: "Edge Gateway + Client-Specific BFFs (Mobile BFF, Web BFF)",
            pros: "Frontend and mobile teams iterate autonomously on payload aggregation; reduces chatty mobile round-trips over cellular networks.",
            cons: "Some duplication of aggregation code across Web BFF and Mobile BFF; more deployables to monitor.",
            bestFor: "Organizations with distinct Web, iOS/Android, TV, and Public API experiences consuming a large microservice fleet.",
          },
        ],
        interviewTip:
          "When placing an API Gateway in your architecture diagram, explicitly list the **exact order of operations** it performs: (1) TLS Termination -> (2) IP/WAF Filter -> (3) JWT Auth Validation -> (4) Rate Limiting -> (5) L7 Routing.",
      },
      {
        id: "authentication-authorization",
        topicId: "api-design",
        topicTitle: "API Design",
        topicNumber: 3,
        subtopicNumber: "3.7",
        title: "Authentication / Authorization",
        subtitle:
          "Distinguishing AuthN (Who are you?) from AuthZ (What can you do?), Stateless JWTs vs Stateful Sessions, OAuth 2.0 / OIDC, and RBAC vs ABAC / ReBAC.",
        readingTime: "8 min read",
        difficulty: "Intermediate",
        keyTakeaways: [
          "**Authentication (AuthN)** verifies identity (passwords, passkeys, OIDC, mTLS), whereas **Authorization (AuthZ)** enforces permissions (RBAC, ABAC, Google Zanzibar ReBAC).",
          "Use a hybrid token strategy: short-lived (5–15 min) **Stateless JWT Access Tokens** verified locally via asymmetric public keys (RS256/EdDSA), paired with long-lived (7–30 day) **Stateful Refresh Tokens** that can be revoked in the database.",
          "Never use symmetric `HS256` secrets across 50 microservices—if any one service leaks the secret, an attacker can forge admin tokens! Always use asymmetric `RS256` or `EdDSA` where only the Auth Service holds the Private Key and others verify with the Public Key (JWKS).",
        ],
        architectureDiagram: `HYBRID ACCESS + REFRESH TOKEN ARCHITECTURE
[ Client App ]
   | 1. Login / Refresh (Using Stateful Refresh Token in HttpOnly Cookie)
   v
[ Auth Service (Holds Private Key + Refresh Token DB) ]
   | 2. Issues Short-Lived 10-min JWT Access Token (Signed with Private Key)
   v
[ Client App ] --- 3. API Call + Bearer JWT ---> [ API Gateway / Microservice ]
                                                 (Verifies Signature in 0.1ms
                                                  using cached Public JWKS!
                                                  Zero Auth DB lookup needed!)`,
        sections: [
          {
            heading: "Authentication: Stateful Sessions vs Stateless JWTs + Refresh Tokens",
            body: "Traditional web apps used **Stateful Session IDs**: on login, the server inserts a random ID into Redis/Postgres and returns `Set-Cookie: sid=xyz; HttpOnly; Secure; SameSite=Strict`. Every subsequent API request requires a Redis lookup to resolve `sid -> user_id`, which makes instant revocation trivial (`DEL session:xyz`), but creates a central bottleneck at 500,000 QPS. **JSON Web Tokens (JWTs)** (`Header.Payload.Signature`) encode the user's ID, roles, and expiration (`exp`) directly into a cryptographically signed payload. Any microservice can verify a JWT's signature in `<0.1ms` CPU time using the Auth server's cached public key (`/.well-known/jwks.json`) with **zero database or network calls**.",
            bullets: [
              "The JWT Revocation Problem: Because stateless JWTs aren't checked against a database, if a user is banned or logs out, their JWT remains valid until `exp`. Solution: Keep Access JWTs very short-lived (`5–15 minutes`) and pair them with a stateful, revocable **Refresh Token** (rotated on use).",
              "Emergency Immediate Revocation: For critical security events (compromised account), broadcast only the revoked token's `jti` (or `user_id + revoked_at` timestamp) to a tiny Redis blocklist with a 15-minute TTL matching the Access Token's remaining lifespan.",
              "OAuth 2.0 + PKCE & OIDC: OAuth 2.0 is a *delegated authorization* framework (Authorization Code Flow with PKCE prevents interception on mobile/SPAs); OpenID Connect (OIDC) layers *identity authentication* (`id_token`) on top of OAuth 2.0.",
            ],
            codeSnippet: {
              title: "Asymmetric EdDSA/RS256 JWT Claims & RBAC/ABAC Policy Check",
              code: `// Decoded JWT Payload (Verified via Public Key from /.well-known/jwks.json)
export interface AccessTokenClaims {
  iss: "https://auth.example.com";
  sub: "usr_01HQ99A";              // Subject (User ID)
  org_id: "org_550";               // Tenant Isolation ID
  roles: ("ADMIN" | "EDITOR" | "VIEWER")[];
  scopes: string[];                // e.g. ["orders:read", "orders:write"]
  iat: number;                     // Issued At (Unix epoch seconds)
  exp: number;                     // Expires in 10 minutes (iat + 600)
  jti: string;                     // Unique Token ID (for emergency blocklist)
}

// Combining RBAC (Role check) + ABAC (Resource Ownership / Tenant Isolation)
export function canMutateDocument(claims: AccessTokenClaims, doc: { orgId: string; ownerId: string }) {
  if (claims.org_id !== doc.orgId) return false; // Strict multi-tenant boundary!
  if (claims.roles.includes("ADMIN")) return true;
  return claims.roles.includes("EDITOR") && claims.sub === doc.ownerId;
}`,
            },
          },
          {
            heading: "Authorization Models: RBAC, ABAC, and ReBAC (Google Zanzibar)",
            body: "Once Authentication proves *who* the caller is (`sub: usr_01HQ99A`), Authorization determines *whether* they can perform action `X` on resource `Y`. As systems grow from simple internal tools to Google Drive or GitHub scale, authorization models evolve from flat roles to relationship graphs.",
            bullets: [
              "RBAC (Role-Based Access Control): Users are assigned Roles (`Admin`, `BillingManager`), and Roles grant Permissions (`invoices:refund`). Simple and covers 80% of B2B SaaS needs.",
              "ABAC (Attribute-Based Access Control): Evaluates dynamic attributes of the user, resource, and environment (e.g., 'Allow if `user.department == doc.department` AND `request.ip` is on corporate VPN', enforced via OPA / Cedar).",
              "ReBAC (Relationship-Based Access Control — Google Zanzibar / SpiceDB / OpenFGA): Models permissions as tuples `(User, Relation, Object)`—e.g., `user:alice is viewer of folder:eng`, and `doc:spec_1 has parent folder:eng`, enabling fast recursive graph checks for Google Docs, Notion, or GitHub.",
            ],
          },
        ],
        tradeOffs: [
          {
            option: "Short-Lived Stateless JWT (10m) + Stateful Refresh Token (30d)",
            pros: "Zero database/network lookups on 99% of API calls, scales horizontally across global regions, supports immediate revocation on refresh or via tiny 10m blocklist.",
            cons: "Slightly larger HTTP header (~600-800 bytes vs 32-byte session ID); up to 10-minute window for non-blocklisted permission changes to propagate.",
            bestFor: "Distributed microservice architectures, mobile apps, SPAs, and high-QPS global APIs.",
          },
          {
            option: "Opaque Stateful Session Cookies (Redis Lookup on Every Request)",
            pros: "Instantaneous 0-second session revocation and permission updates, tiny cookie size, no cryptographic token payload exposed to client.",
            cons: "Every single API request hits the central Redis session cluster; requires cross-region Redis replication for global deployments.",
            bestFor: "Monolithic web applications, banking portals requiring instant session kill-switches, and BFF-terminated browser sessions.",
          },
        ],
        interviewTip:
          "Always emphasize using **Asymmetric Signing (`RS256` or `EdDSA`)** for JWTs in microservices: the Auth Service signs tokens with its closely guarded **Private Key**, while API Gateways and microservices verify tokens using the **Public Key** exposed via a JWKS endpoint.",
      },
    ],
  },
];
