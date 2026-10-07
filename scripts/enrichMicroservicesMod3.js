/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const MODULE_3_DATA = {
  id: "data-management",
  topicNumber: 3,
  title: "3. Distributed Data & Consistency",
  description: "Managing data in distributed systems: database-per-service, consumer idempotency, transactional outbox, CQRS, Saga distributed transactions, and distributed locking.",
  subtopics: [
    {
      id: "database-per-service",
      subtopicNumber: "3.1",
      title: "Database-per-Service Pattern",
      subtitle: "Enforcing absolute data encapsulation, polyglot persistence, and eliminating cross-database joins.",
      readingTime: "8 min read",
      difficulty: "Intermediate",
      accent: "#10b981",
      keyTakeaways: [
        "Each microservice must own its private database schema; no external service is permitted to read or write directly to another service's tables.",
        "Enables Polyglot Persistence: Order Service uses PostgreSQL for ACID transactions, Catalog Service uses MongoDB for documents, and Session Service uses Redis.",
        "Prevents cross-service database coupling: Team A can run database migrations, rename tables, or index columns without coordinating with Team B.",
        "Trade-off: Relational SQL joins across services are impossible; distributed data must be assembled via API composition, CQRS materialized views, or event streaming."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  DATABASE-PER-SERVICE ARCHITECTURE                      |
+-------------------------------------------------------------------------+
 [Order Service]       [Inventory Service]      [Analytics Service]
        |                       |                        |
        v                       v                        v
+---------------+       +---------------+        +---------------+
| PostgreSQL DB |       |  MongoDB DB   |        | ClickHouse DB |
| (Orders ACID) |       | (Warehouses)  |        | (Columnar OLAP|
+---------------+       +---------------+        +---------------+
        ^                       ^
        | (Private VPC Subnet)  |
        +-- NO CROSS-DB JOINS --+`,
      blockNodes: [
        { x: 50, y: 120, w: 250, h: 180, title: 'Order Service', stroke: '#38bdf8', lines: ['Owns PostgreSQL DB', 'ACID commit scope', 'Private schema tables', 'REST / gRPC public API'], tag: 'Service A' },
        { x: 360, y: 100, w: 270, h: 220, title: 'Polyglot Persistence', stroke: '#10b981', lines: ['RDBMS: Relational ACID', 'Document: Flexible JSON', 'Graph: Social connections', 'Cache: Sub-ms Redis RAM', 'Columnar: Fast analytics'], tag: 'Best-Fit Storage' },
        { x: 690, y: 120, w: 250, h: 180, title: 'Shared DB (Anti-Pattern)', stroke: '#ef4444', lines: ['Multiple services share DB', 'Lockstep migrations', 'Table locks freeze cluster', 'Bypasses service logic'], tag: 'Forbidden Coupling' }
      ],
      blockConns: [
        { d: 'M 300 210 L 360 210', lx: 330, ly: 200, label: 'Encapsulate' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'Avoid!', stroke: '#ef4444' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Data Isolation', stroke: '#38bdf8', lines: ['Create isolated DB instance', 'Unique DB user credentials', 'Block external IP ingress'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Cut Foreign Keys', stroke: '#10b981', lines: ['Remove cross-table FKs', 'Store foreign keys as UUIDs', 'Validate via API/Events'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Async Sync', stroke: '#f59e0b', lines: ['Publish data change events', 'Downstream updates cache', 'Eventual consistency'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Autonomous Schema', stroke: '#a855f7', lines: ['Run migrations anytime', 'Zero cross-team blocker', 'Zero global table locks'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Isolate' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Decouple' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Evolve' }
      ],
      sections: [
        {
          heading: "1. The Encapsulation Imperative: Why Shared Databases Destroy Microservices",
          body: "When multiple services read and write to the same relational database, you do not have microservices; you have a distributed monolith with multiple heads. A database schema change initiated by the Order team (e.g. renaming a column or changing a foreign key) will unexpectedly break the Billing team's queries in production. Furthermore, a long-running analytical query executed by one service will acquire table locks that freeze transactional mutations across all other services.",
          bullets: [
            "Polyglot Persistence: Choose the best database engine for the specific domain (e.g., PostgreSQL for transactions, Neo4j for social graphs, Elasticsearch for search, Redis for sessions).",
            "Eliminating Distributed Deadlocks: Private databases eliminate cross-service lock contention on database rows.",
            "Handling Queries Across Boundaries: Implement the API Composition pattern for simple lookups, or CQRS projections for complex reporting."
          ]
        },
        {
          heading: "2. Isolation Architecture: Logical vs Physical Database Separation",
          body: "Teams transitioning to Database-per-Service often debate whether physical separation (distinct database instances) or logical separation (distinct schemas/catalogs on a shared database server) is preferred. Early in a migration, logical schema isolation keeps infrastructure costs manageable while enforcing compile-time data separation. As scale increases, physical instance isolation provides hard CPU, memory, and connection pool blast-radius containment.",
          bullets: [
            "Private Schema Model: Services share a physical RDS instance but connect with distinct database users restricted strictly to their own schema.",
            "Private Instance Model: Complete physical hardware isolation in separate VPC subnets with dedicated autoscaling policies.",
            "Cutting Foreign Keys: Cross-database foreign keys must be converted into application-level UUID validation or event-driven referential integrity checks."
          ]
        },
        {
          heading: "3. Failure Modes: Distributed Joins, Data Duplication & Schema Drift",
          body: "The primary challenge introduced by Database-per-Service is assembling distributed data that previously required a single SQL JOIN query. If an Order screen requires customer name, product title, and shipping status, naive implementations execute 3 separate RPC calls (N+1 query problem). Furthermore, replicating customer names into order records introduces data drift if the customer updates their name later.",
          bullets: [
            "Distributed N+1 Queries: API composition over the network amplifies latency; replace with CQRS read-models or federated GraphQL queries.",
            "Data Inconsistency Windows: Asynchronous synchronization means read models lag behind primary write masters by 10ms to 2 seconds.",
            "Operational Overhead: Managing 30 distinct database instances requires automated backups, schema migration pipelines (Flyway/Liquibase), and centralized observability."
          ]
        },
        {
          heading: "4. Production Blueprint: Microservice Private Data Access Layer in Go",
          body: "The following production Go implementation demonstrates a microservice data repository operating strictly against a private PostgreSQL schema, publishing domain events upon commit.",
          bullets: [
            "Scoped Transaction: Ensures atomic commits inside private service boundaries.",
            "Domain Event Hook: Triggers asynchronous event propagation to downstream consumers."
          ],
          codeSnippet: {
            title: "Production Order Repository in Go",
            code: `package repository

import (
    "context"
    "database/sql"
    "fmt"
    "time"
)

type Order struct {
    ID          string
    CustomerID  string
    TotalCents  int64
    Status      string
    CreatedAt   time.Time
}

type OrderRepository struct {
    db *sql.DB
}

func NewOrderRepository(db *sql.DB) *OrderRepository {
    return &OrderRepository{db: db}
}

func (r *OrderRepository) CreateOrder(ctx context.Context, order *Order) error {
    query := \`
        INSERT INTO orders (id, customer_id, total_cents, status, created_at)
        VALUES ($1, $2, $3, $4, $5)
    \`
    _, err := r.db.ExecContext(ctx, query, order.ID, order.CustomerID, order.TotalCents, order.Status, order.CreatedAt)
    if err != nil {
        return fmt.Errorf("failed to persist order to private schema: %w", err)
    }
    return nil
}`
          }
        }
      ],
      tradeOffs: [
        { option: "Database-per-Service", pros: "Complete schema autonomy, isolated blast radius, zero lock contention, polyglot tech choices.", cons: "Cannot use ACID transactions across services (requires Sagas); complex reporting queries.", bestFor: "True microservice architectures at scale." },
        { option: "Shared Database", pros: "Simple cross-table SQL JOINs, single ACID transaction across tables.", cons: "Tight coupling, shared lock contention, schema migration nightmare.", bestFor: "Monolithic applications only; catastrophic anti-pattern for microservices." },
        { option: "Logical Schema Separation", pros: "Lower infrastructure cost than separate clusters; provides strict user privilege boundaries.", cons: "Shared CPU/RAM; a runaway query in Service A can saturate IOPS for Service B.", bestFor: "Mid-scale systems migrating away from a monolith." }
      ],
      interviewTip: "In architecture interviews, emphasize: 'Services must strictly encapsulate their datastores. To prevent coupling, the Order service will expose an API or publish domain events; under no circumstances will the Customer service query the Order database directly.'"
    },
    {
      id: "idempotency",
      subtopicNumber: "3.2",
      title: "Consumer & Producer Idempotency",
      subtitle: "Guaranteeing safe retries and preventing duplicate payments in distributed distributed systems.",
      readingTime: "8 min read",
      difficulty: "Intermediate",
      accent: "#38bdf8",
      keyTakeaways: [
        "In distributed systems, networks drop packets; retrying a request is mandatory, meaning producers will inevitably deliver duplicate messages.",
        "An **Idempotent** operation produces the exact same outcome whether executed once or 10,000 times: $f(f(x)) = f(x)$.",
        "Implement Idempotency using **Idempotency Keys** (UUIDs) stored in Redis with atomic `SETNX` or relational unique constraints."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  DISTRIBUTED IDEMPOTENCY EXECUTION LIFECYCLE            |
+-------------------------------------------------------------------------+
  [Client]              [Payment API]              [Idempotency Store (Redis)]
     |                         |                                |
     |-- POST /pay (Key: X) -->|                                |
     |                         |-- SETNX idempotency:X PENDING->| (Lock Acquired)
     |                         |-- Process Stripe Charge ------>|
     |                         |-- SET idempotency:X [RESULT] ->| (Cached Response)
     |<- Return 200 OK --------|                                |
     |                         |                                |
     | (Network Drops Packet!) |                                |
     |-- RETRY POST /pay (X) ->|                                |
     |                         |-- GET idempotency:X ---------->| (Cache Hit!)
     |<- Return 200 (Cached) --|  (Zero Double-Charge!)         |`,
      blockNodes: [
        { x: 50, y: 110, w: 220, h: 180, title: 'Client / Producer', stroke: '#38bdf8', lines: ['Generates Idempotency-Key', 'UUID v4 per user intent', 'Sends header on every retry', 'Agnostic to network glitch'], tag: 'Client' },
        { x: 330, y: 100, w: 280, h: 200, title: 'Payment Ingress API', stroke: '#10b981', lines: ['1. Check Redis for Key', '2. If PENDING -> 409 Conflict', '3. If COMPLETED -> return cached', '4. If NEW -> acquire atomic lock'], tag: 'Idempotency Gate' },
        { x: 670, y: 110, w: 260, h: 180, title: 'Primary Database', stroke: '#f59e0b', lines: ['INSERT INTO processed_keys', 'Unique Constraint on key', 'Atomic rollback on error', 'Durable consistency'], tag: 'Durable Store' }
      ],
      blockConns: [
        { d: 'M 270 200 L 330 200', lx: 300, ly: 190, label: 'Idempotency-Key' },
        { d: 'M 610 200 L 670 200', lx: 640, ly: 190, label: 'Durable Check' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Key Generation', stroke: '#38bdf8', lines: ['Client creates UUID v4', 'Binds to payment intent', 'Passes in HTTP header'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Atomic Mutex', stroke: '#10b981', lines: ['SET key NX EX 120s', 'Atomic lock acquisition', 'Rejects concurrent dupes'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Core Execution', stroke: '#f59e0b', lines: ['Deduct customer balance', 'Call external bank API', 'Commit DB transaction'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Response Cache', stroke: '#a855f7', lines: ['Save payload in Redis', 'Return HTTP 200 OK', 'Subsequent calls cached'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Acquire' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Execute' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Cache' }
      ],
      sections: [
        {
          heading: "1. The At-Least-Once Delivery Reality of Distributed Networks",
          body: "In any distributed architecture, the Two Generals Problem and network partitions make 'exactly-once' network transmission mathematically impossible. When Service A invokes Service B, the packet may drop on the way out, Service B may process the mutation and crash before responding, or the return response may drop on the wire. In all three cases, Service A experiences a timeout and must retry. The receiving service must be strictly idempotent to avoid duplicate transactions.",
          bullets: [
            "Network Partitions: Senders cannot tell if a timeout occurred before or after remote processing.",
            "Idempotency Invariant: Calling f(f(x)) produces identical side effects to f(x).",
            "Safe HTTP Verbs: GET, PUT, and DELETE are idempotent by definition; POST and PATCH require explicit idempotency keys."
          ]
        },
        {
          heading: "2. The Idempotency Key Pattern: Atomic State Machine Lifecycle",
          body: "The standard production pattern used by Stripe, PayPal, and AWS involves client-generated Idempotency Keys (UUID v4). When a request arrives, the server transitions the key through a three-phase state machine: 1) STARTED/LOCKED (acquired via atomic Redis SETNX or SQL row lock); 2) IN_PROGRESS (returns HTTP 409 Conflict if duplicate request arrives concurrently); 3) COMPLETED (persists serialized response DTO with TTL).",
          bullets: [
            "Atomic Lock Acquisition: Using Redis 'SET key PENDING NX EX 120' prevents concurrent threads from executing duplicate charges.",
            "Payload Fingerprinting: Hash the request payload (SHA-256) alongside the key. If a client sends the same key with different parameters, reject with HTTP 400 Bad Request.",
            "Cached Response Replay: On duplicate receipt, return the exact previously recorded response DTO."
          ]
        },
        {
          heading: "3. Failure Modes: In-Flight Deadlocks, Key Collisions & TTL Expiry",
          body: "If the server crashes while holding the PENDING lock, subsequent retries will be rejected until the lock TTL expires. If the TTL is too short (e.g. 5 seconds) and the payment processor takes 8 seconds, a duplicate request might acquire the lock while the first request is still executing, causing a double-charge. Conversely, if the TTL is too long and the server crashes, legitimate retries are blocked.",
          bullets: [
            "Lock Expiration Timing: Set lock TTL to 2-3x the maximum upstream RPC timeout budget.",
            "Database Unique Constraints: Always back in-memory Redis locks with durable SQL unique index constraints on (idempotency_key).",
            "Message Broker De-duplication: Kafka message de-duplication relies on producer transactional IDs and sequence numbers."
          ]
        },
        {
          heading: "4. Production Blueprint: Production Idempotency Middleware in TypeScript",
          body: "The following production TypeScript implementation demonstrates an enterprise Idempotency Gate utilizing Redis atomic primitives and SHA-256 payload verification.",
          bullets: [
            "Payload Hash Verification: Guards against key re-use attacks with altered request bodies.",
            "Atomic Lock & Cache: Returns cached responses seamlessly for retry attempts."
          ],
          codeSnippet: {
            title: "Production Idempotency Middleware in TypeScript",
            code: `import crypto from 'crypto';
import { Redis } from 'ioredis';

export class IdempotencyManager {
  constructor(private redis: Redis) {}

  public async handleRequest<T>(
    idempotencyKey: string,
    payload: any,
    handler: () => Promise<T>
  ): Promise<{ status: 'PROCESSED' | 'CACHED'; result: T }> {
    const payloadHash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    const redisKey = \`idemp:\${idempotencyKey}\`;

    // 1. Check existing record
    const existing = await this.redis.get(redisKey);
    if (existing) {
      const parsed = JSON.parse(existing);
      if (parsed.payloadHash !== payloadHash) {
        throw new Error("Idempotency key re-used with different payload!");
      }
      if (parsed.status === 'PENDING') {
        throw new Error("Concurrent request in progress for this idempotency key. Please retry shortly.");
      }
      return { status: 'CACHED', result: parsed.response };
    }

    // 2. Acquire atomic lock (PENDING state for 60 seconds)
    const acquired = await this.redis.set(
      redisKey,
      JSON.stringify({ status: 'PENDING', payloadHash }),
      'EX',
      60,
      'NX'
    );

    if (!acquired) {
      throw new Error("Concurrent request acquired lock. Please retry shortly.");
    }

    try {
      // 3. Execute business logic
      const result = await handler();

      // 4. Save result with 24-hour TTL
      await this.redis.set(
        redisKey,
        JSON.stringify({ status: 'COMPLETED', payloadHash, response: result }),
        'EX',
        86400
      );

      return { status: 'PROCESSED', result };
    } catch (err) {
      // Release lock on failure so immediate retries can attempt execution
      await this.redis.del(redisKey);
      throw err;
    }
  }
}`
          }
        }
      ],
      tradeOffs: [
        { option: "Idempotency Key Pattern", pros: "Guarantees exact-once processing semantics at application level; handles retries safely.", cons: "Requires fast distributed storage (Redis); key management and TTL tuning overhead.", bestFor: "Payment APIs, order creation, critical state updates." },
        { option: "Database Unique Constraint", pros: "100% durable ACID enforcement; zero external cache dependency.", cons: "Database write contention; locks table indexes under high concurrency.", bestFor: "Durable entity persistence where key can map to primary key." },
        { option: "Blind Retries (No Idempotency)", pros: "Zero engineering effort.", cons: "Disastrous duplicate transactions, double payments, customer data corruption.", bestFor: "Read-only idempotent GET requests only." }
      ],
      interviewTip: "In interviews, distinguish between producer idempotency (Kafka idempotent producer with sequence numbers) and consumer idempotency (storing processed message IDs in a database table or Redis cache). Always cite: 'At-least-once delivery plus idempotent consumer processing equals effectively-once semantics.'"
    },
    {
      id: "transactional-outbox",
      subtopicNumber: "3.3",
      title: "Transactional Outbox Pattern",
      subtitle: "Eliminating dual-write failures when publishing database state changes to message brokers.",
      readingTime: "9 min read",
      difficulty: "Intermediate",
      accent: "#a855f7",
      keyTakeaways: [
        "The **Dual-Write Problem**: Updating a database and publishing to Kafka in the same HTTP request is fundamentally broken; one will always succeed while the other fails.",
        "The **Transactional Outbox Pattern** saves both the domain entity and the outbound message into the *same relational database* within a single atomic ACID transaction.",
        "A separate background process (Polling Publisher or Change Data Capture via Debezium) tails the Outbox table and reliably publishes messages to Kafka."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  TRANSACTIONAL OUTBOX ARCHITECTURE                      |
+-------------------------------------------------------------------------+
       [Order Service]
              |
              | (Single Atomic ACID Transaction)
              v
   +---------------------------------------+
   |             PostgreSQL DB             |
   | +-----------------+ +---------------+ |
   | |  orders Table   | | outbox Table  | |
   | | (Status: PAID)  | | (OrderCreated)| |
   | +-----------------+ +---------------+ |
   +---------------------------------------+
                       |
     (Change Data Capture / Debezium)
                       v
               [Apache Kafka Broker]
                       v
         [Inventory / Analytics Services]`,
      blockNodes: [
        { x: 50, y: 110, w: 230, h: 180, title: 'Order Service', stroke: '#38bdf8', lines: ['1. Start DB Transaction', '2. INSERT INTO orders', '3. INSERT INTO outbox', '4. COMMIT Transaction!'], tag: 'Atomic Commit' },
        { x: 340, y: 100, w: 270, h: 200, title: 'Postgres Outbox Table', stroke: '#10b981', lines: ['id: UUID (PK)', 'aggregate_type: "ORDER"', 'payload: JSONB', 'created_at: TIMESTAMP'], tag: 'Single ACID Boundary' },
        { x: 670, y: 110, w: 260, h: 180, title: 'Debezium / Kafka Connect', stroke: '#a855f7', lines: ['Reads PostgreSQL WAL', 'Extracts outbox rows', 'Publishes to Kafka topics', 'Guaranteed At-Least-Once'], tag: 'CDC Engine' }
      ],
      blockConns: [
        { d: 'M 280 200 L 340 200', lx: 310, ly: 190, label: 'ACID Insert' },
        { d: 'M 610 200 L 670 200', lx: 640, ly: 190, label: 'WAL Stream' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Start Transaction', stroke: '#38bdf8', lines: ['Begin DB transaction', 'Update order status', 'Prepare outbox row'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Atomic Outbox Write', stroke: '#10b981', lines: ['Insert domain event JSON', 'Commit ACID transaction', 'Both or neither persist'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'CDC Tailer', stroke: '#f59e0b', lines: ['Debezium reads DB WAL', 'Zero polling query lag', 'Guaranteed order'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Kafka Emission', stroke: '#a855f7', lines: ['Emit to order.events topic', 'Downstream consumers react', 'Mark outbox dispatched'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Commit' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Capture' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Deliver' }
      ],
      sections: [
        {
          heading: "1. The Dual-Write Antipattern: Why Distributed Mutations Fail",
          body: "A frequent architectural catastrophe occurs when an engineer writes code that updates a SQL database and then publishes a message to Kafka in the same function. If the database commit succeeds but Kafka is unreachable, the event is lost forever and downstream microservices become desynchronized. If the event is sent to Kafka first, but the database transaction rolls back, downstream services process a ghost order that does not exist. The Transactional Outbox pattern guarantees eventual consistency without Two-Phase Commit.",
          bullets: [
            "Dual-Write Flaw: No application code can guarantee atomicity across two independent distributed network resources without 2PC.",
            "ACID Scope: The application updates domain state and inserts an outbound message into an outbox table within the exact same database transaction.",
            "Zero Ghost Events: If the transaction rolls back, the outbox message is rolled back atomically alongside the domain entity."
          ]
        },
        {
          heading: "2. Relay Mechanics: Polling Publisher vs Transaction Log Tailing (CDC)",
          body: "Once outbox events are committed to the database, a relay process must publish them to Kafka. There are two primary relay implementations: 1) Polling Publisher, where a scheduled background thread queries 'SELECT * FROM outbox WHERE processed = FALSE LIMIT 500' and updates the rows; and 2) Transaction Log Tailing (Change Data Capture), where tools like Debezium tail the PostgreSQL Write-Ahead Log (WAL) or MySQL binlog directly.",
          bullets: [
            "Polling Publisher: Simple to implement, but creates database query overhead, poll lag, and lock contention on the outbox table.",
            "Transaction Log Tailing (Debezium): Sub-millisecond latency, zero database query load, and captures mutations directly from transaction logs.",
            "At-Least-Once Delivery: The CDC relay guarantees at-least-once publishing; consumers must be idempotent."
          ]
        },
        {
          heading: "3. Failure Modes: Outbox Table Bloat, Serialization Drift & Partition Ordering",
          body: "Without an automated truncation strategy, the outbox table accumulates millions of rows, degrading database storage and index performance. Furthermore, events stored in the outbox must use forward-compatible schemas (Protobuf/Avro) to prevent serialization drift when event schemas evolve. Finally, when publishing outbox events to Kafka, message keys must correspond to domain entity IDs (e.g. order_id) to preserve strict partition ordering.",
          bullets: [
            "Outbox Truncation: Purge or partition processed outbox rows daily to prevent unbounded disk consumption.",
            "Partition Key Mapping: Always use the aggregate ID as the Kafka partition key so entity events land in the exact same partition in order.",
            "Poison Pill Events: An unparseable outbox row must be routed to a dead letter queue to avoid stalling the CDC pipeline."
          ]
        },
        {
          heading: "4. Production Blueprint: Atomic Outbox Insertion in Java 21",
          body: "The following production Java implementation showcases an atomic Spring Boot service transaction inserting both an Order entity and an Outbox event record within a single database transaction.",
          bullets: [
            "@Transactional Scope: Enforces single atomic commit across both repository inserts.",
            "OutboxEvent Entity: Standardized event payload container with aggregate routing keys."
          ],
          codeSnippet: {
            title: "Production Transactional Outbox Service in Java 21",
            code: `public record OrderPlacedEvent(String orderId, String customerId, BigDecimal amount) {}

@Service
public class OrderApplicationService {
    private final OrderRepository orderRepository;
    private final OutboxRepository outboxRepository;
    private final ObjectMapper objectMapper;

    public OrderApplicationService(OrderRepository orderRepo, OutboxRepository outboxRepo, ObjectMapper mapper) {
        this.orderRepository = orderRepo;
        this.outboxRepository = outboxRepo;
        this.objectMapper = mapper;
    }

    @Transactional
    public String createOrder(String customerId, BigDecimal amount) throws JsonProcessingException {
        String orderId = UUID.randomUUID().toString();
        
        // 1. Mutate Domain Entity
        OrderEntity order = new OrderEntity(orderId, customerId, amount, OrderStatus.CREATED);
        orderRepository.save(order);

        // 2. Prepare Domain Event Payload
        OrderPlacedEvent event = new OrderPlacedEvent(orderId, customerId, amount);
        String payloadJson = objectMapper.writeValueAsString(event);

        // 3. Insert Outbox Record inside the SAME ACID Transaction
        OutboxEntity outbox = new OutboxEntity(
            UUID.randomUUID().toString(),
            "ORDER",
            orderId,
            "OrderPlaced",
            payloadJson,
            Instant.now(),
            false // Dispatched flag
        );
        outboxRepository.save(outbox);

        return orderId;
    }
}`
          }
        }
      ],
      tradeOffs: [
        { option: "Transactional Outbox with CDC", pros: "Guaranteed atomicity without 2PC; zero dual-write vulnerabilities; sub-second delivery.", cons: "Requires running Debezium / Kafka Connect infrastructure; eventual consistency.", bestFor: "All event-driven microservice architectures publishing state changes." },
        { option: "Polling Outbox", pros: "Simple to write in application code without external CDC infrastructure.", cons: "Polling database overhead; higher delivery latency; potential lock contention.", bestFor: "Low-throughput systems with simple event volume." },
        { option: "Dual Writes (Direct Kafka Call)", pros: "Extremely simple to write initially.", cons: "Catastrophic data loss during network partitions; creates permanent cross-service inconsistency.", bestFor: "Never recommended for production systems." }
      ],
      interviewTip: "When an interviewer asks: 'How do you guarantee that a database update and a message broker publish happen together?', immediately state: 'Direct dual writes are fundamentally broken. I implement the Transactional Outbox pattern, persisting the event record into the same database transaction as the entity. A CDC tool like Debezium tails the database transaction log to publish reliably to Kafka, guaranteeing at-least-once delivery.'"
    },
    {
      id: "cqrs",
      subtopicNumber: "3.4",
      title: "CQRS Pattern (Command Query Responsibility Segregation)",
      subtitle: "Separating write-optimized relational commands from read-optimized elastic query projections.",
      readingTime: "9 min read",
      difficulty: "Advanced",
      accent: "#f59e0b",
      keyTakeaways: [
        "**CQRS** separates the data model for writes (**Commands**) from the data model for reads (**Queries**).",
        "Commands execute domain business rules and ACID transactions on an RDBMS (Postgres); Queries execute against denormalized views (Elasticsearch/Redis).",
        "Solves the fundamental scalability bottleneck where read traffic outnumbers write traffic by 100:1 to 1000:1.",
        "Embraces **Eventual Consistency**: read models are updated asynchronously via domain events with sub-second lag."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                        CQRS ARCHITECTURAL MODEL                         |
+-------------------------------------------------------------------------+
                           [Client Traffic]
                            /            \\
              (Writes 1%)  /              \\  (Reads 99%)
                          v                v
                  [Command Service]    [Query Service]
                         |                    |
                  (ACID Mutate)        (Fast Sub-ms Read)
                         v                    v
                  [PostgreSQL DB]      [Elasticsearch / Redis]
                         |                    ^
                  (Outbox / CDC)              | (Async Projection)
                         +-----> [Kafka] -----+`,
      blockNodes: [
        { x: 50, y: 110, w: 240, h: 180, title: 'Command Model (Write)', stroke: '#ef4444', lines: ['POST /orders', 'Validates business rules', 'ACID transactions', 'Normalized PostgreSQL tables'], tag: 'Write Tier' },
        { x: 360, y: 100, w: 260, h: 200, title: 'Event Pipeline', stroke: '#a855f7', lines: ['OrderCreated Event', 'Kafka Event Stream', 'Debezium CDC ingestion', 'Asynchronous projection'], tag: 'Sync Backbone' },
        { x: 690, y: 110, w: 250, h: 180, title: 'Query Model (Read)', stroke: '#10b981', lines: ['GET /orders/search', 'Denormalized documents', 'Elasticsearch / Redis', 'Sub-millisecond latency'], tag: 'Read Tier' }
      ],
      blockConns: [
        { d: 'M 290 200 L 360 200', lx: 325, ly: 190, label: 'Emit Events' },
        { d: 'M 620 200 L 690 200', lx: 655, ly: 190, label: 'Project Views' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Command Write', stroke: '#ef4444', lines: ['Client issues Command', 'Validates domain rules', 'Commits to PostgreSQL'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Event Emission', stroke: '#f59e0b', lines: ['Transaction Outbox triggers', 'Publishes to Kafka topic', 'Guaranteed durability'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Projector Worker', stroke: '#a855f7', lines: ['Consumer processes event', 'Denormalizes nested data', 'Pre-calculates totals'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Query Served', stroke: '#10b981', lines: ['Writes to Elasticsearch', 'Client reads pre-joined data', 'Zero SQL table locks'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Publish' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Stream' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Index' }
      ],
      sections: [
        {
          heading: "1. The Write vs Read Asymmetry in Distributed Systems",
          body: "In high-scale enterprise applications, read and write access patterns have radically different architectural requirements. Write operations require strict validation, state transitions, and ACID constraints. In contrast, read operations require complex multi-table joins, full-text searching, geospatial filtering, and ultra-low latency. Trying to optimize a single relational database schema for both writes and complex search queries results in bloated indexes that slow down writes and locking contention that freezes reads. CQRS splits the system into two distinct models.",
          bullets: [
            "Command Model: Focuses on domain logic and writes. It optimizes for transactional consistency and integrity.",
            "Query Model: Focuses on read queries. It optimizes for presentation and search, using denormalized data representations.",
            "Independent Scaling: The read tier can be horizontally scaled 50x to handle peak traffic without touching the primary write database."
          ]
        },
        {
          heading: "2. Asynchronous Projections & Eventual Consistency Windows",
          body: "When a Command modifies state, it publishes a domain event. A dedicated Projection Service consumes this event, transforms the data into a pre-computed denormalized structure, and writes it directly to the read store (such as Elasticsearch, MongoDB, or Redis). Because projection happens asynchronously over a message broker, there is a small replication lag window (typically 10ms to 200ms) where the read store has not yet reflected the newest write.",
          bullets: [
            "Materialized Views: The read model stores data exactly as the UI needs to display it, eliminating runtime joins.",
            "Read-Your-Own-Writes Mitigation: To prevent user confusion right after a write, the UI can optimistically render the local mutation or query the write replica using an event version token.",
            "Rebuilding Projections: If business reporting needs change, new read models can be generated from scratch by replaying historical Kafka events."
          ]
        },
        {
          heading: "3. Failure Modes: Projection Lag, Schema Desynchronization & Over-Engineering",
          body: "Applying CQRS to simple CRUD systems is a severe anti-pattern that drastically increases architectural complexity. Furthermore, if projection consumers fail or lag due to high event volume, clients will read stale data for minutes or hours. Monitoring consumer lag in Kafka is critical to maintaining system health.",
          bullets: [
            "Over-Engineering Trap: Never implement CQRS if basic SQL indexes and read replicas satisfy your query performance needs.",
            "Projection Consumer Outages: If consumer pods crash, the read store becomes progressively stale; alert on Kafka consumer lag metrics.",
            "Event Ordering Inversion: If events are processed out of order, older events can overwrite newer state; enforce strict partition key routing."
          ]
        },
        {
          heading: "4. Production Blueprint: CQRS Projection Consumer in TypeScript",
          body: "The following production TypeScript implementation demonstrates a CQRS Projection Worker consuming domain events from Kafka and indexing pre-calculated documents into Elasticsearch.",
          bullets: [
            "Idempotent Version Check: Discards stale events by comparing document sequence versions.",
            "Pre-Computed Aggregations: Eliminates runtime joins by denormalizing customer details directly into the order index."
          ],
          codeSnippet: {
            title: "Production CQRS Projection Worker in TypeScript",
            code: `export interface OrderCreatedEvent {
  orderId: string;
  customerId: string;
  customerName: string;
  items: Array<{ sku: string; price: number; qty: number }>;
  totalAmount: number;
  version: number;
}

export class OrderSearchProjector {
  constructor(private elasticClient: any) {}

  public async projectOrderCreated(event: OrderCreatedEvent): Promise<void> {
    // 1. Check existing version in Elasticsearch
    const existing = await this.elasticClient.get({
      index: 'order_read_model',
      id: event.orderId,
      ignore: [404]
    });

    if (existing?.body?._source && existing.body._source.version >= event.version) {
      console.warn(\`[Projector] Stale event version \${event.version} ignored for \${event.orderId}\`);
      return;
    }

    // 2. Denormalize and pre-calculate read-optimized document
    const readDocument = {
      orderId: event.orderId,
      customerId: event.customerId,
      customerName: event.customerName,
      itemCount: event.items.reduce((acc, it) => acc + it.qty, 0),
      totalAmount: event.totalAmount,
      searchKeyword: \`\${event.customerName} \${event.orderId}\`,
      version: event.version,
      updatedAt: new Date().toISOString()
    };

    // 3. Upsert into Elasticsearch for instant sub-ms search
    await this.elasticClient.index({
      index: 'order_read_model',
      id: event.orderId,
      body: readDocument
    });

    console.log(\`[Projector] Projected order \${event.orderId} to search index\`);
  }
}`
          }
        }
      ],
      tradeOffs: [
        { option: "CQRS with Polyglot Storage", pros: "Optimal read and write performance; scalable read replicas; optimized search indexes.", cons: "Eventual consistency lag; complex event synchronization infrastructure; high operational burden.", bestFor: "High-volume read/write asymmetric systems, complex search dashboards, financial ledgers." },
        { option: "Single Database with Read Replicas", pros: "Simpler to manage; standard SQL queries; low operational overhead.", cons: "Schema compromise between write normalization and read indexing; replica lag on high write volume.", bestFor: "Standard CRUD applications with moderate scale (<10,000 QPS)." },
        { option: "Event Sourcing + CQRS", pros: "Complete audit history; ability to replay state from zero; point-in-time time-travel queries.", cons: "Steepest learning curve; eventual consistency across every screen; complex snapshotting.", bestFor: "Banking ledgers, compliance auditing, trading platforms." }
      ],
      interviewTip: "In interviews, clearly articulate: 'CQRS is not just about separating read and write controllers; it is about separating data models. We write to a normalized ACID store like PostgreSQL, emit events via Transactional Outbox, and project asynchronously into a read-optimized store like Elasticsearch. This eliminates read-write lock contention and provides sub-millisecond search at scale.'"
    },
    {
      id: "saga-pattern",
      subtopicNumber: "3.5",
      title: "Distributed Saga Pattern",
      subtitle: "Managing multi-service distributed transactions via local commits and compensating rollbacks.",
      readingTime: "10 min read",
      difficulty: "Expert",
      accent: "#f59e0b",
      keyTakeaways: [
        "Two-Phase Commit (2PC) does not scale across microservices; a **Saga** coordinates multi-service transactions via a sequence of local ACID transactions paired with compensating actions.",
        "Choose **Choreography** (event-driven) for simple 2–3 step workflows, and **Orchestration** (central coordinator or Temporal) for complex multi-step financial flows.",
        "Sagas lack ACID **Isolation**: use **Semantic Locks** (e.g. `PENDING` state) to prevent concurrent dirty reads and lost updates."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                    ORCHESTRATED SAGA EXECUTION & ROLLBACK               |
+-------------------------------------------------------------------------+
       [Order Saga Orchestrator]
                   |
  1. ReserveStock  |===========> [Inventory Svc] (Local Commit: OK)
                   |
  2. ChargePayment |===========> [Payment Svc]   (FAIL: Card Declined!)
                   |
  3. Compensate!   |===========> [Inventory Svc] (Undo: Release Stock!)
                   v
       [Order Marked CANCELLED]`,
      blockNodes: [
        { x: 50, y: 110, w: 240, h: 200, title: 'Saga Orchestrator', stroke: '#f59e0b', lines: ['State Machine Coordinator', 'Step 1: Reserve Inventory', 'Step 2: Charge Payment', 'Step 3: Dispatch Shipping', 'On Error: Compensate!'], tag: 'Coordinator' },
        { x: 350, y: 80, w: 260, h: 65, title: 'Inventory Service', stroke: '#10b981', lines: ['Local DB Commit | Compensate: Release'], tag: 'Step 1' },
        { x: 350, y: 155, w: 260, h: 65, title: 'Payment Service', stroke: '#ef4444', lines: ['Local DB Commit | Compensate: Refund'], tag: 'Step 2 (Pivot)' },
        { x: 350, y: 230, w: 260, h: 65, title: 'Shipping Service', stroke: '#0284c7', lines: ['Local DB Commit | Retriable Step'], tag: 'Step 3' },
        { x: 670, y: 110, w: 270, h: 200, title: 'Kafka Saga Topic', stroke: '#a855f7', lines: ['saga.order.events', 'Persistent Audit Trail', 'Durable step recovery', 'Idempotent replay on reboot'], tag: 'Event Log' }
      ],
      blockConns: [
        { d: 'M 290 145 L 350 115', lx: 320, ly: 120, label: 'Step 1' },
        { d: 'M 290 185 L 350 185', lx: 320, ly: 175, label: 'Step 2' },
        { d: 'M 290 225 L 350 255', lx: 320, ly: 250, label: 'Step 3' },
        { d: 'M 610 185 L 670 185', lx: 640, ly: 175, label: 'Log Events' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Local Tx 1: Stock', stroke: '#10b981', lines: ['Inventory reserved', 'Local DB commit', 'Returns success token'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Local Tx 2: Pay', stroke: '#ef4444', lines: ['Credit card fails', 'Transaction declined', 'Saga triggers rollback'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Compensating Tx', stroke: '#f59e0b', lines: ['Orchestrator invokes Undo', 'Inventory release stock', 'Compensating action commits'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Consistent State', stroke: '#a855f7', lines: ['Order status CANCELLED', 'Zero money charged', 'System clean and sound'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Proceed' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Aborted!' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Restored' }
      ],
      sections: [
        {
          heading: "1. Why 2PC Fails and the Saga Foundation",
          body: "In a monolithic database, ACID transactions guarantee atomicity across tables. But in a microservices architecture with Database-per-Service, transactions must span multiple distinct network hosts. Historically, distributed systems attempted Two-Phase Commit (2PC / XA transactions). However, 2PC is a blocking protocol: if the coordinator crashes during the prepare phase, all participating databases hold row locks indefinitely. Under high traffic, this causes cascading connection exhaustion. The Saga pattern replaces 2PC with a series of local transactions coordinated through compensating actions.",
          bullets: [
            "Local ACID Transactions: Each service updates its own database and commits locally, releasing database locks immediately.",
            "Compensating Transactions: If step N fails, the Saga executes compensating actions for steps N-1 down to 1 in reverse order.",
            "Forward vs Backward Recovery: In Forward Recovery, retriable steps (like printing a shipping label) are retried until success; in Backward Recovery, compensating actions reverse previous mutations."
          ]
        },
        {
          heading: "2. Choreography vs Orchestration: Architectural Trade-Offs",
          body: "Sagas can be structured via Choreography or Orchestration: 1) In Choreography, services communicate reactively by publishing and subscribing to events. Service A commits and publishes Event A; Service B reacts to Event A, commits, and publishes Event B. 2) In Orchestration, a dedicated coordinator (like an OrderSagaOrchestrator or Temporal workflow) explicitly directs each service via command RPCs.",
          bullets: [
            "Choreography Strengths: Simple, decentralized, lightweight for small 2-3 step workflows.",
            "Choreography Weaknesses: As workflows grow to 5+ steps, event flows become impossible to understand, monitor, or test; cyclic dependencies arise.",
            "Orchestration Strengths: Centralized state machine, explicit error handling, clear visualization of workflow progress, straightforward timeout management."
          ]
        },
        {
          heading: "3. The Lack of ACID Isolation: Semantic Locks & Countermeasures",
          body: "The most dangerous aspect of the Saga pattern is that it provides Atomicity, Consistency, and Durability, but completely lacks ACID Isolation! Because local transactions commit immediately, intermediate partial states are visible to concurrent transactions. For example, if Step 1 reserves inventory and Step 2 fails 3 seconds later, a concurrent customer could observe depleted inventory during those 3 seconds.",
          bullets: [
            "Semantic Locking: Set the entity state to 'PENDING_PAYMENT'. Block operations that require confirmed state until the Saga completes.",
            "Commutative Updates: Design operations so execution order does not affect final balance (e.g. account credits and debits).",
            "Pessimistic Read Isolation: Query workflows must inspect Saga status before making binding promises to end users."
          ]
        },
        {
          heading: "4. Production Blueprint: Orchestrated Saga Coordinator in TypeScript",
          body: "The following production TypeScript implementation demonstrates an Orchestrated Order Saga coordinating inventory reservation, payment processing, and compensating rollbacks.",
          bullets: [
            "Compensating Stack: Tracks executed steps and executes inverse compensations in reverse order on failure.",
            "Pivot Step: Once payment succeeds, subsequent steps are retriable without rolling back payment."
          ],
          codeSnippet: {
            title: "Production Saga Orchestrator in TypeScript",
            code: `export interface SagaStep {
  name: string;
  execute: () => Promise<void>;
  compensate: () => Promise<void>;
}

export class OrderSagaOrchestrator {
  private executedSteps: SagaStep[] = [];

  public async executeSaga(steps: SagaStep[]): Promise<boolean> {
    for (const step of steps) {
      try {
        console.log(\`[Saga] Executing step: \${step.name}\`);
        await step.execute();
        this.executedSteps.push(step);
      } catch (err: any) {
        console.error(\`[Saga] Step failed: \${step.name} (\${err.message}). Initiating compensation...\`);
        await this.rollback();
        return false;
      }
    }
    console.log("[Saga] All steps completed successfully!");
    return true;
  }

  private async rollback(): Promise<void> {
    // Execute compensations in reverse order
    while (this.executedSteps.length > 0) {
      const step = this.executedSteps.pop()!;
      try {
        console.log(\`[Saga Compensate] Rolling back: \${step.name}\`);
        await step.compensate();
      } catch (compErr: any) {
        // Compensations must be idempotent and retried until success
        console.error(\`[CRITICAL] Compensation failed for \${step.name}: \${compErr.message}\`);
      }
    }
  }
}`
          }
        }
      ],
      tradeOffs: [
        { option: "Orchestrated Saga", pros: "Centralized state visibility; simple error handling; easy to reason about complex multi-step workflows.", cons: "Orchestrator service can become a coordination bottleneck; requires orchestrator infrastructure (Temporal).", bestFor: "Complex multi-step financial workflows, e-commerce checkout, travel booking engines." },
        { option: "Choreographed Saga", pros: "Decentralized; no single coordinator; simple for 2-3 step sequences.", cons: "Spaghetti event flows; difficult to trace or debug; prone to circular event dependencies.", bestFor: "Simple 2-step async workflows (e.g. User Signup -> Welcome Email)." },
        { option: "Two-Phase Commit (2PC)", pros: "Provides strict ACID isolation across databases.", cons: "Blocking protocol; locks database tables; extreme latency penalty; single point of failure.", bestFor: "Monolithic single-datacenter enterprise mainframes only." }
      ],
      interviewTip: "In advanced system design interviews, discuss the lack of ACID Isolation in Sagas: 'Sagas provide ACD, but lack Isolation. While a Saga is in-flight, dirty reads can occur. We mitigate this using Semantic Locks (e.g. marking an order PENDING and refusing to dispatch it) and ensuring that Pivot steps (like payment) divide retriable actions from compensable actions.'"
    },
    {
      id: "distributed-locking",
      subtopicNumber: "3.6",
      title: "Distributed Locking: Redlock vs Database Locks",
      subtitle: "Preventing race conditions across multi-instance clusters using Redis Redlock and ZooKeeper fences.",
      readingTime: "10 min read",
      difficulty: "Expert",
      accent: "#a855f7",
      keyTakeaways: [
        "In a multi-node cluster, in-memory language locks (`synchronized`, `mutex`) only protect a single container; concurrent worker pods will bypass them.",
        "Use **Distributed Locks** for efficiency (avoiding redundant duplicate background work) or correctness (preventing concurrent billing fraud).",
        "Martin Kleppmann's critique: Distributed locks without **Fencing Tokens** are unsafe for correctness because GC pauses and network lag cause lock leases to expire silently."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                DISTRIBUTED LOCK WITH FENCING TOKEN BLUEPRINT            |
+-------------------------------------------------------------------------+
 [Client 1]               [Redis / ZooKeeper Lock]           [Storage Service]
     |                               |                              |
     |-- AcquireLock() ------------->|                              |
     |<- Lock Granted (Token: 34) ---|                              |
     |                               |                              |
     | (Client 1 Suffers 20s GC Stop-The-World Pause! Lease Expires)|
     |                               |                              |
     | [Client 2]                    |                              |
     |-- AcquireLock() ------------->|                              |
     |<- Lock Granted (Token: 35) ---|                              |
     |-- WriteData(Token: 35) ------------------------------------->| (Accepted: 35 > 0)
     |                               |                              |
     | (Client 1 Awakens from GC Pause!)                            |
     |-- WriteData(Token: 34) ------------------------------------->| (REJECTED: 34 < 35!)
                                                                      (Data Corruption Prevented!)`,
      blockNodes: [
        { x: 50, y: 110, w: 230, h: 180, title: 'Worker Client 1', stroke: '#38bdf8', lines: ['Acquires Lock (Token: 34)', 'Subject to OS GC Pauses', 'Attempts storage write', 'Failsafe via Fencing'], tag: 'Client 1' },
        { x: 340, y: 100, w: 270, h: 200, title: 'Distributed Lock Store', stroke: '#10b981', lines: ['Redis SET lock NX EX 10', 'Generates Fencing Token', 'Strict monotonic counter', 'Lease timeout watchdog'], tag: 'Lock Coordinator' },
        { x: 670, y: 110, w: 260, h: 180, title: 'Target Storage Engine', stroke: '#f59e0b', lines: ['Validates Fencing Token', 'Tracks highestToken = 35', 'Rejects token 34 as STALE', 'Guarantees correctness'], tag: 'Protected Resource' }
      ],
      blockConns: [
        { d: 'M 280 200 L 340 200', lx: 310, ly: 190, label: 'Lock Lease' },
        { d: 'M 610 200 L 670 200', lx: 640, ly: 190, label: 'Fencing Token' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Acquire Lease', stroke: '#38bdf8', lines: ['SET lock_key uuid NX EX 15', 'Generates monotonic token', 'Client starts work'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Watchdog Heartbeat', stroke: '#10b981', lines: ['Redisson background thread', 'Extends lock TTL every 5s', 'Prevents early expiry'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Fenced Write', stroke: '#f59e0b', lines: ['Passes token to storage', 'Storage checks token >= max', 'Rejects expired clients'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Safe Release', stroke: '#a855f7', lines: ['Lua script compares UUID', 'Atomic delete on match', 'Lock freed for next worker'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Heartbeat' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Validate' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Release' }
      ],
      sections: [
        {
          heading: "1. The Inadequacy of In-Memory Mutexes in Clustered Environments",
          body: "In a single monolithic server, threads synchronize shared memory using language-level mutexes (like Java's synchronized or Go's sync.Mutex). But in modern cloud architectures, applications run across dozens of independent container pods. Each container has its own private heap memory: a lock acquired on Pod 1 is completely invisible to Pod 2. Without a centralized distributed lock coordinator, concurrent pods will mutate the same bank account or inventory row concurrently.",
          bullets: [
            "Efficiency vs Correctness Locks: Efficiency locks prevent duplicate work (e.g. generating the same report twice); Correctness locks prevent data corruption (e.g. charging a user twice).",
            "Redis Single-Instance Lock: Using 'SET resource_name my_random_value NX PX 30000' acquires an atomic lease.",
            "Atomic Release via Lua: Releasing a Redis lock requires checking that my_random_value matches before deleting, executed atomically via a Lua script to prevent releasing someone else's lock."
          ]
        },
        {
          heading: "2. The Fencing Token Solution to Garbage Collection Pauses",
          body: "In a famous distributed systems analysis, Martin Kleppmann revealed why simple leased locks (like Redis or ZooKeeper) cannot guarantee correctness on their own. Suppose Client 1 acquires a 10-second lock. Client 1 experiences an unexpected 15-second JVM Stop-The-World Garbage Collection pause or OS page fault. While Client 1 is paused, its lock lease expires. Client 2 acquires the lock and begins writing. Client 1 awakens from the pause, unaware that time has passed, and executes its write—corrupting Client 2's data! The solution is Fencing Tokens.",
          bullets: [
            "Fencing Token Protocol: Every time a lock is acquired, the lock server issues a strictly monotonically increasing token (e.g. 34, 35, 36).",
            "Storage-Side Validation: The storage layer remembers the highest token it has processed. When Client 1 presents token 34 after Client 2 used 35, the storage engine rejects token 34.",
            "Watchdog Timer (Redisson): In Java, Redisson uses a background thread to continually refresh the lock TTL while the worker is actively running, preventing premature lease expiration."
          ]
        },
        {
          heading: "3. Redlock Multi-Master Algorithm & Split-Brain Controversies",
          body: "For multi-node Redis deployments, Redis creator Salvatore Sanfilippo designed the Redlock algorithm. A client attempts to acquire the lock across 5 independent Redis master nodes sequentially. If it acquires the lock on at least a quorum (3 out of 5 nodes) within a strict timeout budget, the lock is considered held. However, because Redlock relies on physical system clock synchronicity, NTP clock jumps can invalidate lease correctness.",
          bullets: [
            "Quorum Requirement: Must acquire (N/2 + 1) master nodes to succeed.",
            "NTP Clock Drift Vulnerability: If server clocks jump forward due to NTP updates, leases expire prematurely across nodes.",
            "Consensus-Backed Alternatives: For critical correctness, systems prefer consensus-backed engines like ZooKeeper, etcd (Raft), or Google Chubby (Paxos)."
          ]
        },
        {
          heading: "4. Production Blueprint: Atomic Redis Lock with Lua Script in TypeScript",
          body: "The following production TypeScript implementation demonstrates an enterprise Distributed Lock utilizing Redis SETNX and atomic Lua script verification for release.",
          bullets: [
            "Random Lock Identifier: Prevents accidental release of locks held by other concurrent workers.",
            "Atomic Lua Script: Performs GET and DEL atomically to prevent race condition release."
          ],
          codeSnippet: {
            title: "Production Distributed Lock in TypeScript",
            code: `import crypto from 'crypto';
import { Redis } from 'ioredis';

export class DistributedLock {
  private lockValue: string;

  constructor(
    private redis: Redis,
    private lockKey: string,
    private ttlSeconds: number = 10
  ) {
    this.lockValue = crypto.randomUUID();
  }

  public async acquire(): Promise<boolean> {
    // SET resource_name uuid NX EX ttl
    const result = await this.redis.set(
      this.lockKey,
      this.lockValue,
      'EX',
      this.ttlSeconds,
      'NX'
    );
    return result === 'OK';
  }

  public async release(): Promise<boolean> {
    // Atomic Lua script: only delete if value matches our UUID
    const luaScript = \`
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    \`;

    const result = await this.redis.eval(luaScript, 1, this.lockKey, this.lockValue);
    return result === 1;
  }
}`
          }
        }
      ],
      tradeOffs: [
        { option: "Redis Distributed Lock (Redlock)", pros: "Extremely high throughput (100,000+ ops/sec); low sub-millisecond acquisition latency.", cons: "Relies on synchronized clocks; vulnerable to NTP jumps and long GC pauses without fencing tokens.", bestFor: "Efficiency locks, preventing duplicate batch processing, rate-limiting locks." },
        { option: "Consensus-Backed Lock (ZooKeeper / etcd)", pros: "Mathematically proven safety via Raft/Paxos; ephemerality cleans locks on node crash; built-in monotonic zxid tokens.", cons: "Lower throughput than Redis; complex cluster management.", bestFor: "Strict correctness, leader election, master node failover coordination." },
        { option: "Database Row Lock (SELECT FOR UPDATE)", pros: "Zero extra infrastructure; 100% durable ACID transaction integration.", cons: "Consumes expensive DB connection pool slots; scales poorly under heavy contention.", bestFor: "Simple low-concurrency database row updates." }
      ],
      interviewTip: "In advanced system design interviews, reference Martin Kleppmann's critique of distributed locks: 'A distributed lock alone cannot guarantee safety in the presence of GC pauses or network delays. If a client pauses while holding a lock lease, the lock expires and another client acquires it. When the first client awakens, it will write stale data unless the storage layer enforces Monotonic Fencing Tokens to reject out-of-order writes.'"
    }
  ]
};

const targetPath = path.join(__dirname, 'microservicesMod3.js');
const fileContent = `/* eslint-disable @typescript-eslint/no-require-imports */\nconst MODULE_3_DATA = ${JSON.stringify(MODULE_3_DATA, null, 2)};\nmodule.exports = { MODULE_3_DATA };\n`;

fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log('Successfully enriched Module 3 (Distributed Data & Consistency) in microservicesMod3.js!');
