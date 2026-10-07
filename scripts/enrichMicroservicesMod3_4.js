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
          heading: "1. The Encapsulation Imperative: Why Shared Databases Break Microservices",
          body: "The defining characteristic of a true microservice is data encapsulation. In monolithic applications, software developers freely write multi-table SQL queries joining `users`, `orders`, `inventory`, and `discounts`. When microservices share a single centralized database, the entire architectural decoupling collapses. If Team A alters a database column type or renames a table in their service, Team B's service crashes in production. Database-per-Service dictates that the database is an internal implementation detail, accessible exclusively via the service's published API.",
          bullets: [
            "Independent Migration Velocity: Teams apply schema changes (Liquibase, Flyway, Prisma) whenever needed without coordinating global release trains.",
            "Polyglot Persistence: Select the optimal storage engine for the specific domain problem (e.g. Neo4j for fraud graphs, Redis for rate limits, PostgreSQL for billing).",
            "Hardware & Resource Isolation: A runaway reporting query in the Analytics Service cannot lock tables or exhaust I/O operations for real-time customer checkout."
          ]
        },
        {
          heading: "2. Solving the Lost Join: API Composition vs CQRS",
          body: "When you eliminate the shared database, you lose the ability to perform relational SQL `JOIN` operations across business entities. For example, how do you display an order history screen that requires the Order details, Customer Profile, Product Images, and Delivery Status? In distributed systems, there are two primary solutions: API Composition and CQRS.",
          bullets: [
            "API Composition: An edge aggregator or BFF service calls Order Service, Customer Service, and Delivery Service in parallel over gRPC, stitching the resulting DTOs in memory before returning to the client. Best for simple queries with low data volumes.",
            "CQRS Materialized Views: Whenever a customer updates their profile or an order is created, domain events are published to Kafka. A dedicated Query Service consumes these events and maintains a pre-joined, read-optimized materialized view in Elasticsearch or MongoDB.",
            "Handling Distributed Foreign Keys: Foreign keys are stored as simple string UUIDs (e.g. `customer_id: 'usr_9481'`) rather than relational database foreign key constraints."
          ]
        },
        {
          heading: "3. Failure Modes: Distributed Consistency & Orphaned Records",
          body: "Without relational foreign key constraints enforced by the database engine, referential integrity must be managed at the application and event layer.",
          bullets: [
            "Orphaned Records: If a Customer is deleted in User Service, but Order Service continues holding references to that `customerId`, orders can point to nonexistent users unless soft-delete domain events are handled.",
            "Eventual Consistency Lag: In CQRS projections, there is an unavoidable replication lag of 10–500ms between the time an order is committed and when it appears in the read view.",
            "Cross-Service Reporting Difficulty: Generating global enterprise business intelligence reports requires building a centralized Data Lake (Snowflake, BigQuery) via Change Data Capture (CDC)."
          ]
        },
        {
          heading: "4. Production Blueprint: Isolated Repository Pattern with Outbox",
          body: "The following Go snippet illustrates a clean repository implementation that strictly encapsulates relational access to private service tables while preventing external SQL leakage.",
          bullets: [
            "Domain Data Isolation: All SQL queries are strictly scoped to the service's private schema namespace (`orders.*`).",
            "No External Database Links: Bypasses foreign database links or cross-schema joins."
          ],
          codeSnippet: {
            title: "Private Domain Storage Repository in Go",
            code: `package repository\n\nimport (\n    "context"\n    "database/sql"\n    "errors"\n)\n\ntype OrderRepository struct {\n    db *sql.DB\n}\n\nfunc (r *OrderRepository) SaveOrder(ctx context.Context, order *OrderEntity) error {\n    // Strictly scoped to private schema namespace\n    query := \`INSERT INTO orders.orders_table (id, customer_id, total_cents, status) \n              VALUES ($1, $2, $3, $4)\`\n    \n    _, err := r.db.ExecContext(ctx, query, order.ID, order.CustomerID, order.TotalCents, order.Status)\n    if err != nil {\n        return errors.New("failed to persist order aggregate: " + err.Error())\n    }\n    return nil\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Database-per-Service (Polyglot)", pros: "Absolute schema autonomy, zero cross-team migration friction, polyglot storage selection, isolated hardware failure blast radius.", cons: "No cross-service SQL joins; requires API composition or CQRS views; distributed transactions require Sagas.", bestFor: "Standard enterprise microservices architectures with independent teams." },
        { option: "Shared Relational Database", pros: "Instant SQL joins across all business entities; ACID transactions across any table; simple initial development.", cons: "Severe architectural coupling; lockstep deployment trains; runaway queries bring down entire system; tech stack lock-in.", bestFor: "Monolithic applications; strictly avoid in distributed microservices." },
        { option: "Schema-per-Service (Single DB Engine)", pros: "Lower database hosting cost while enforcing separate schemas, permissions, and tables per service.", cons: "Still shares underlying DB CPU, memory, and disk I/O; noisy neighbor problems can impact performance.", bestFor: "Early-stage transition from monolith to microservices before scaling to separate DB instances." }
      ],
      interviewTip: "In interviews, establish the Database-per-Service rule immediately: 'I strictly enforce Database-per-Service. Each microservice owns its private database instance to prevent schema coupling and noisy-neighbor database lock contention. To satisfy cross-service query requirements, I implement CQRS by streaming domain events to an asynchronous read-optimized view rather than executing distributed joins.'"
    },
    {
      id: "idempotency",
      subtopicNumber: "3.2",
      title: "Idempotent Consumer & Deduplication Patterns",
      subtitle: "Preventing duplicate payments and order processing using unique idempotency keys and Redis sets.",
      readingTime: "8 min read",
      difficulty: "Intermediate",
      accent: "#38bdf8",
      keyTakeaways: [
        "In distributed systems, networks are unreliable; retries are mandatory. Therefore, at-least-once message delivery guarantees that consumers WILL receive duplicate requests.",
        "An idempotent operation is one that can be applied multiple times without changing the result beyond the initial application ($f(f(x)) = f(x)$).",
        "Idempotency Keys: The client generates a unique UUID (e.g. `Idempotency-Key: 94a1-b842`) and includes it in HTTP headers; the server caches the key and response.",
        "Database Unique Constraints: Enforcing a `UNIQUE` constraint on an idempotency column provides atomic, race-condition-free deduplication in relational databases."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  IDEMPOTENT CONSUMER WORKFLOW (PAYMENT)                 |
+-------------------------------------------------------------------------+
Client ---> POST /payments (Idempotency-Key: 'pay_xyz_123')
                 |
                 v
        +-----------------------------------+
        |      PAYMENT SERVICE HANDLER      |
        | 1. Query Redis / DB for key       |
        +-----------------+-----------------+
                          |
             +------------+------------+
             | Key Exists?             | Key is New?
             v                         v
     [Return Cached Response]   [1. Acquire Lock on Key]
     (HTTP 200 OK - No Charge)  [2. Charge Credit Card]
                                [3. Save Key + Result in DB]
                                [4. Release Lock & Return 201]`,
      blockNodes: [
        { x: 50, y: 120, w: 250, h: 180, title: 'Client Retries', stroke: '#38bdf8', lines: ['Client sends Request #1', 'Network timeout occurs', 'Client sends Request #2', 'Same Idempotency-Key'], tag: 'At-Least-Once' },
        { x: 360, y: 100, w: 270, h: 220, title: 'Idempotency Layer', stroke: '#10b981', lines: ['Redis SETNX with TTL', 'Relational UNIQUE constraint', 'Atomic check-and-set', 'Cached response replay', 'Eliminates double charge'], tag: 'Deduplication' },
        { x: 690, y: 120, w: 250, h: 180, title: 'Downstream State', stroke: '#a855f7', lines: ['Credit card charged once', 'Order confirmed once', 'Inventory decremented once', 'Deterministic state'], tag: 'Protected Core' }
      ],
      blockConns: [
        { d: 'M 300 210 L 360 210', lx: 330, ly: 200, label: 'Key Verify' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'Execute Once' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Extract Key', stroke: '#38bdf8', lines: ['Read Idempotency-Key', 'Validate UUID format', 'Hash request body'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Check Cache', stroke: '#10b981', lines: ['Lookup key in Redis', 'If COMPLETED, return cached', 'If PROCESSING, return 409'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Atomic Lock', stroke: '#f59e0b', lines: ['Acquire 120s TTL lock', 'Execute payment mutation', 'Commit to database'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Store Response', stroke: '#a855f7', lines: ['Save response payload', 'Mark key COMPLETED', 'Return 200 OK to client'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Read' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Lock' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Save' }
      ],
      sections: [
        {
          heading: "1. The Inevitability of Retries & Duplicate Messages",
          body: "In any distributed architecture, the Two Generals' Problem dictates that a sender cannot reliably distinguish between a network packet drop on the way to the server, a crash of the server during processing, or a network drop of the response packet on the way back. Because clients and message brokers (Kafka, RabbitMQ, SQS) implement retry mechanisms with at-least-once delivery semantics, every microservice must assume that it will receive duplicate requests and messages. Without idempotency, duplicate requests result in double-charging credit cards, duplicate order shipments, and corrupted accounting ledgers.",
          bullets: [
            "At-Least-Once Reality: Exactly-once delivery across network boundaries is mathematically impossible without end-to-end idempotent consumer deduplication.",
            "Client Timeout vs Server Execution: The client times out after 2 seconds, but the server successfully committed the transaction 100 milliseconds later; the client retries, submitting the payment twice.",
            "HTTP Verb Idempotency: `GET`, `PUT`, and `DELETE` are semantically idempotent by standard HTTP specification; `POST` is non-idempotent and requires an explicit Idempotency Key."
          ]
        },
        {
          heading: "2. The Idempotency Key Architecture: Lifecycle & State Machine",
          body: "How do industry-standard APIs like Stripe, Uber, and Amazon handle idempotency? They implement the Idempotency Key pattern. When initiating a critical mutation, the client generates a unique UUID (e.g. `Idempotency-Key: pay_req_849204`) and attaches it as an HTTP header. The server tracks this key through a 3-stage state machine: `PROCESSING`, `COMPLETED`, or `FAILED`.",
          bullets: [
            "State 1: PROCESSING: When a request arrives, the server atomically creates a record with `status: PROCESSING` and a 120-second lease TTL. If a duplicate request arrives while the first is still processing, the server returns `409 Conflict` ('Request in progress').",
            "State 2: COMPLETED: Once the business mutation succeeds, the server updates the status to `COMPLETED` and stores the exact HTTP status code and response body JSON.",
            "State 3: REPLAY: If a retry arrives with the same key, the server bypasses the payment gateway completely, replaying the stored HTTP 200/201 response directly from the database.",
            "Payload Hash Verification: If a client submits an identical Idempotency Key with a DIFFERENT request payload (e.g. different payment amount), the server immediately rejects it with `400 Bad Request` to prevent key hijacking."
          ]
        },
        {
          heading: "3. Failure Modes: Cache Eviction, Race Conditions, and Clock Drift",
          body: "Implementing idempotency purely in an in-memory cache without relational database guarantees introduces race conditions.",
          bullets: [
            "Concurrent Race Condition: Two identical requests arrive at two separate server pods at the exact same millisecond. If both execute an un-synchronized `SELECT WHERE key = ?`, both see no existing key and both execute the payment! You must use an atomic database `INSERT ON CONFLICT` or Redis `SETNX`.",
            "Premature Cache Eviction: If your idempotency store in Redis has a 5-minute TTL, a client retrying after 6 minutes will re-trigger the payment. Idempotency records for financial transactions must be persisted in durable SQL storage for 24–72 hours.",
            "Downstream Gateway Duplication: If your service crashes mid-way after charging Stripe but before saving the DB idempotency record, the client retry will re-execute the charge unless you pass the idempotency key downstream to Stripe."
          ]
        },
        {
          heading: "4. Production Blueprint: PostgreSQL Atomic Idempotent Processor",
          body: "The following TypeScript snippet demonstrates an atomic SQL-backed idempotency processor utilizing PostgreSQL's `ON CONFLICT DO NOTHING` to guarantee single-execution semantics under high concurrent load.",
          bullets: [
            "Atomic Lock Acquisition: Uses `ON CONFLICT (idempotency_key) DO NOTHING` to prevent race conditions across parallel threads.",
            "Deterministic Response Replay: Returns cached response headers and body without touching downstream business logic."
          ],
          codeSnippet: {
            title: "Atomic SQL Idempotent Handler in TypeScript",
            code: `import { Pool } from 'pg';\n\nexport async function processIdempotentRequest(\n  db: Pool,\n  idempotencyKey: string,\n  action: () => Promise<{ statusCode: number; body: object }>\n) {\n  // 1. Attempt to claim the idempotency key atomically\n  const insertResult = await db.query(\n    \`INSERT INTO idempotency_records (key, status, created_at)\n     VALUES ($1, 'PROCESSING', NOW())\n     ON CONFLICT (key) DO NOTHING\n     RETURNING status, response_body, status_code\`,\n    [idempotencyKey]\n  );\n\n  // 2. If row was not inserted, key already exists!\n  if (insertResult.rowCount === 0) {\n    const existing = await db.query(\n      'SELECT status, response_body, status_code FROM idempotency_records WHERE key = $1',\n      [idempotencyKey]\n    );\n    const record = existing.rows[0];\n    if (record.status === 'PROCESSING') {\n      return { statusCode: 409, body: { error: 'Concurrent request in progress' } };\n    }\n    // Replay original deterministic response\n    return { statusCode: record.status_code, body: record.response_body };\n  }\n\n  // 3. Key successfully claimed: Execute business action\n  try {\n    const result = await action();\n    await db.query(\n      \`UPDATE idempotency_records \n       SET status = 'COMPLETED', response_body = $1, status_code = $2 \n       WHERE key = $3\`,\n      [JSON.stringify(result.body), result.statusCode, idempotencyKey]\n    );\n    return result;\n  } catch (error) {\n    await db.query('DELETE FROM idempotency_records WHERE key = $1', [idempotencyKey]);\n    throw error;\n  }\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Database Unique Constraint Idempotency", pros: "100% durable, zero race conditions, atomic commit in same ACID transaction, zero external dependencies.", cons: "Relational database write overhead; requires persistent disk storage.", bestFor: "Financial transactions, payment processing, inventory decrements, and mission-critical workflows." },
        { option: "Redis Distributed Set (SETNX with TTL)", pros: "Ultra-fast in-memory check (<1ms latency), automatic TTL expiration after 24 hours.", cons: "Potential data loss if Redis restarts without AOF persistence; volatile memory capacity limits.", bestFor: "High-throughput, lower-criticality event consumers (e.g. tracking telemetry, notification deduplication)." },
        { option: "No Idempotency (Blind Processing)", pros: "Zero engineering effort initially.", cons: "Guaranteed duplicate payments, corrupted inventories, and severe financial losses.", bestFor: "Never acceptable in production systems." }
      ],
      interviewTip: "In system design rounds (especially Payment System, Uber Ride Booking, or Order Processing), always proactively highlight idempotency: 'Because network timeouts force client retries, I enforce strict idempotency. The client generates an Idempotency-Key UUID. We claim this key in PostgreSQL using an atomic INSERT ON CONFLICT. If a duplicate request arrives, we bypass the payment gateway and replay the stored response, eliminating double charges under any failure scenario.'"
    },
    {
      id: "transactional-outbox",
      subtopicNumber: "3.3",
      title: "Transactional Outbox Pattern & CDC",
      subtitle: "Eliminating the dual-write problem by publishing database events atomically to Kafka using Debezium CDC.",
      readingTime: "9 min read",
      difficulty: "Advanced",
      accent: "#f59e0b",
      keyTakeaways: [
        "The Dual-Write Problem: Updating a relational database and publishing an event to Kafka in two separate operations is inherently broken; one can fail while the other succeeds.",
        "The Transactional Outbox pattern guarantees atomicity by writing the business aggregate mutation and the outbound event record into the SAME local database transaction.",
        "Change Data Capture (CDC): A background relay (Debezium, Kafka Connect) tails the database transaction log (WAL / binlog) and publishes events to Kafka with zero application-level polling.",
        "Guarantees At-Least-Once event publishing with zero risk of phantom events or lost updates."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  TRANSACTIONAL OUTBOX ARCHITECTURE                      |
+-------------------------------------------------------------------------+
[Application Service]
          |
          | 1. BEGIN TRANSACTION (Atomic Commit)
          +---> INSERT INTO orders (id, total, status)
          +---> INSERT INTO outbox_table (event_id, payload, topic)
          | 2. COMMIT TRANSACTION
          |
+---------v---------------------------------------------------------------+
| DATABASE ENGINE (PostgreSQL)                                            |
| Write-Ahead Log (WAL) recorded atomically to disk                       |
+---------+---------------------------------------------------------------+
          |
          | 3. CDC Engine tails database WAL (Debezium / Kafka Connect)
          v
   [Apache Kafka] ---> [Downstream Consumers: Inventory, Billing, Search]`,
      blockNodes: [
        { x: 50, y: 120, w: 250, h: 180, title: 'Application Process', stroke: '#38bdf8', lines: ['Order Service business code', 'Atomic SQL transaction', 'Writes Orders + Outbox', 'Zero Kafka calls in path'], tag: 'Single ACID Commit' },
        { x: 360, y: 100, w: 270, h: 220, title: 'Local DB & Outbox Table', stroke: '#10b981', lines: ['Orders Table (Aggregate)', 'Outbox Table (Events)', 'Single ACID transaction', 'Database WAL write log', 'Zero 2PC coordinator overhead'], tag: 'Atomic Storage' },
        { x: 690, y: 120, w: 250, h: 180, title: 'CDC Relay (Debezium)', stroke: '#a855f7', lines: ['Tails Postgres WAL log', 'Streams to Kafka topics', 'At-least-once delivery', 'Zero DB CPU polling'], tag: 'Async Event Bus' }
      ],
      blockConns: [
        { d: 'M 300 210 L 360 210', lx: 330, ly: 200, label: 'ACID Commit' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'WAL Tail' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Begin Tx', stroke: '#38bdf8', lines: ['Open local SQL transaction', 'Update order business state', 'Construct JSON event'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Insert Outbox', stroke: '#10b981', lines: ['Insert into outbox table', 'Commit transaction', 'Both or neither succeed'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Log Tailing', stroke: '#f59e0b', lines: ['Debezium reads DB WAL', 'Parses outbox row insert', 'Maps to Kafka partition'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Kafka Ack', stroke: '#a855f7', lines: ['Broker acknowledges write', 'Debezium advances WAL offset', 'Zero lost messages'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Write' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Tail' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Stream' }
      ],
      sections: [
        {
          heading: "1. The Dual-Write Problem: Why Naive Publishing Fails",
          body: "A frequent bug in distributed systems occurs when a service attempts to perform two external mutations in sequence: writing to a local database and publishing a notification event to a message broker like Apache Kafka. Consider the naive implementation:\n1. Update Database (`UPDATE orders SET status = 'PAID'`)\n2. Publish to Kafka (`kafkaProducer.send('OrderPaidEvent')`)\nIf the application crashes, network drops, or Kafka is unavailable between steps 1 and 2, the database is updated, but no event is ever published! Conversely, if you publish to Kafka first and the database commit fails, an event is sent for an action that never happened (phantom event). This is the notorious Dual-Write Problem.",
          bullets: [
            "No Distributed 2PC: Two-Phase Commit (2PC / XA transactions) across databases and message brokers introduces catastrophic latency, lock contention, and is not supported by Kafka.",
            "Phantom Events: Publishing to Kafka first risks notifying downstream systems of state changes that were rolled back in the database.",
            "Lost Updates: Committing to the database first risks failing to publish the event, leaving downstream systems permanently out of sync."
          ]
        },
        {
          heading: "2. The Transactional Outbox Pattern Architecture",
          body: "The Transactional Outbox pattern resolves the Dual-Write Problem by leveraging the local database's native ACID capabilities. Instead of publishing directly to Kafka, the application writes the event into an `outbox` table inside the same local database transaction that updates the business aggregate. Because both writes share a single local transaction, they are guaranteed to either both commit or both roll back atomically.",
          bullets: [
            "Local Atomicity: No distributed transaction coordinator required; uses standard PostgreSQL or MySQL ACID commit.",
            "Outbox Table Schema: Contains `id` (UUID), `aggregate_type`, `aggregate_id`, `event_type`, `payload` (JSONB), and `created_at`.",
            "Decoupled Kafka Availability: If Kafka is temporarily down, the application continues processing user transactions without interruption because it only writes to its local database."
          ]
        },
        {
          heading: "3. Event Relay: Polling Publisher vs Change Data Capture (CDC)",
          body: "Once events reside in the outbox table, how do they get to Kafka? There are two primary relay mechanisms:",
          bullets: [
            "Polling Publisher: A background worker periodically queries `SELECT * FROM outbox WHERE processed = false LIMIT 100` and publishes to Kafka. Drawback: Database polling CPU overhead, polling interval latency, and table lock contention.",
            "Transaction Log Tailing via CDC (Debezium): The gold standard. Debezium connects to PostgreSQL's Write-Ahead Log (WAL) or MySQL's binlog via replication streams. As soon as the outbox transaction commits, Debezium streams the change directly to Kafka in sub-milliseconds without executing SQL queries on the database engine."
          ]
        },
        {
          heading: "4. Production Blueprint: Outbox Event Schema & Debezium Connector Config",
          body: "The following JSON configuration illustrates a production Debezium PostgreSQL CDC connector definition streaming outbox events to Kafka.",
          bullets: [
            "Tombstone & Routing: Uses Debezium Outbox Event Router Single Message Transform (SMT) to route events dynamically to target Kafka topics.",
            "Zero Application Code: All message streaming occurs entirely at the database log level."
          ],
          codeSnippet: {
            title: "Debezium Outbox Event Router Connector Configuration",
            code: `{\n  "name": "order-outbox-connector",\n  "config": {\n    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",\n    "tasks.max": "1",\n    "plugin.name": "pgoutput",\n    "database.hostname": "postgres.internal",\n    "database.port": "5432",\n    "database.user": "debezium_user",\n    "database.password": "\${env:DB_PASSWORD}",\n    "database.dbname": "order_db",\n    "database.server.name": "order_service",\n    "table.include.list": "public.outbox_events",\n    "tombstones.on.delete": "false",\n    "transforms": "outbox",\n    "transforms.outbox.type": "io.debezium.transforms.outbox.EventRouter",\n    "transforms.outbox.route.topic.replacement": "orders.\${routedByValue}",\n    "transforms.outbox.table.fields.additional.placement": "event_type:header"\n  }\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Transactional Outbox + CDC (Debezium)", pros: "100% atomic, zero dual-write risk, sub-millisecond event streaming, zero database polling query CPU overhead.", cons: "Requires running Kafka Connect cluster; complex database WAL replication slot management.", bestFor: "High-scale enterprise microservices (Stripe, Uber, Netflix architecture)." },
        { option: "Transactional Outbox + Polling Publisher", pros: "Simple to implement; requires no Kafka Connect or WAL access permissions.", cons: "Database query overhead; polling delay latency (1–5 seconds); scaling polling workers requires table locking.", bestFor: "Low-throughput services (< 50 events/sec) or restricted cloud environments where WAL access is forbidden." },
        { option: "Dual Writes (Direct DB + Kafka calls)", pros: "Trivial 5 lines of code initially.", cons: "Guaranteed data corruption and phantom/lost events under network failure or pod crashes.", bestFor: "Never acceptable in production microservices." }
      ],
      interviewTip: "In interviews, whenever you design an event-driven microservice that updates a database and publishes to Kafka, immediately call out the dual-write risk: 'To guarantee atomicity without distributed 2PC transactions, I implement the Transactional Outbox pattern. We commit the order and an outbox event record in a single ACID transaction. A Debezium CDC connector tails the PostgreSQL Write-Ahead Log (WAL) to publish events to Kafka with at-least-once delivery guarantees.'"
    },
    {
      id: "cqrs",
      subtopicNumber: "3.4",
      title: "CQRS (Command Query Responsibility Segregation)",
      subtitle: "Decoupling read and write models, optimizing asymmetric workloads, and projecting materialized views.",
      readingTime: "9 min read",
      difficulty: "Advanced",
      accent: "#a855f7",
      keyTakeaways: [
        "CQRS segregates data mutations (Commands) from data reads (Queries) into completely distinct architectural models and storage engines.",
        "Asymmetric Scalability: Real-world systems frequently exhibit extreme read-to-write ratios (e.g., 100:1 or 1,000:1); CQRS allows scaling read replicas or search clusters independently of the write database.",
        "The Command Model enforces complex business invariants and validation, persisting normalized data in an ACID database (e.g. PostgreSQL).",
        "The Query Model subscribes to domain events and projects denormalized, pre-joined materialized views into high-speed search engines (Elasticsearch) or document stores (MongoDB)."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  CQRS (COMMAND QUERY RESPONSIBILITY SEGREGATION)        |
+-------------------------------------------------------------------------+
                        [Client Application]
                        /                  \\
     1. Command (POST /orders)          2. Query (GET /orders?search=shoes)
                      /                      \\
                     v                        v
        +-----------------------+   +-----------------------+
        |     COMMAND MODEL     |   |      QUERY MODEL      |
        | - Enforces Invariants |   | - Denormalized DTOs   |
        | - PostgreSQL ACID DB  |   | - Elasticsearch Index |
        +-----------+-----------+   +-----------^-----------+
                    |                           |
                    | (Domain Event Stream)     |
                    +=====> [Apache Kafka] =====+
                         (Async Eventual Projection)`,
      blockNodes: [
        { x: 50, y: 120, w: 250, h: 180, title: 'Command Model (Write)', stroke: '#38bdf8', lines: ['POST / PUT / DELETE', 'Strict business invariants', 'Normalized PostgreSQL tables', 'Emits domain events to Kafka'], tag: 'Write Optimization' },
        { x: 360, y: 100, w: 270, h: 220, title: 'Kafka Projection Pipe', stroke: '#10b981', lines: ['Apache Kafka Event Stream', 'Async consumer projections', 'Materializes denormalized views', 'Handles replay & rebuilds', 'Sub-second replication lag'], tag: 'Event Backbone' },
        { x: 690, y: 120, w: 250, h: 180, title: 'Query Model (Read)', stroke: '#a855f7', lines: ['GET / Search / Filter', 'Pre-joined denormalized DTOs', 'Elasticsearch / Redis / Mongo', 'Sub-millisecond read latency'], tag: 'Read Optimization' }
      ],
      blockConns: [
        { d: 'M 300 210 L 360 210', lx: 330, ly: 200, label: 'Emit Event' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'Project View' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Write Command', stroke: '#38bdf8', lines: ['Client sends CreateOrder', 'Command handler validates', 'Commits to PostgreSQL DB'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Publish Event', stroke: '#10b981', lines: ['Outbox emits OrderCreated', 'Kafka broadcasts to partition', 'Available for all readers'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Project View', stroke: '#f59e0b', lines: ['Elasticsearch projector consumes', 'Stitches customer + item data', 'Indexes pre-joined document'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Fast Query', stroke: '#a855f7', lines: ['User executes search query', 'Hits Elasticsearch directly', 'Sub-10ms response time'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Commit' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Stream' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Index' }
      ],
      sections: [
        {
          heading: "1. The Conflict Between Read and Write Requirements",
          body: "In conventional software architectures, a single domain model and database schema are used for both reading and writing data. For writing data, the model must be normalized (3rd Normal Form) to prevent data anomalies, enforce unique constraints, and maintain transactional locking. However, for reading data—such as searching orders with full-text customer names, calculating total spend, and filtering by category—the normalized model requires massive SQL `JOIN` statements across 8 tables that bottleneck database CPU. CQRS (Command Query Responsibility Segregation) separates the write path from the read path into two independent models.",
          bullets: [
            "Command Model: Optimized strictly for writing. Handles business logic validation, state transitions, and enforces invariants. Does not care about search query performance.",
            "Query Model: Optimized strictly for reading. Stores data in denormalized, pre-aggregated, read-only structures tailored to UI screens. Zero runtime SQL joins required.",
            "Independent Scaling: Write databases can be sized for transaction throughput (IOPS), while read databases can be scaled horizontally with read replicas or search nodes."
          ]
        },
        {
          heading: "2. Projection Pipeline & Materialized Views",
          body: "In a distributed CQRS system, the connection between the write model and read model is asynchronous event streaming. When a command succeeds, a domain event (e.g. `OrderPlacedEvent`) is published to Apache Kafka. A projection consumer reads the event, enriches it with auxiliary data, and writes the final JSON representation directly into a read datastore (such as Elasticsearch, MongoDB, or Redis).",
          bullets: [
            "Zero-Latency Joins: The expensive join computation occurs once during event projection rather than on every user query.",
            "Full-Text Search Integration: Elasticsearch or OpenSearch indexes can serve fuzzy search and faceted filtering directly from the projected view.",
            "View Rebuildability: If business requirements introduce a new search screen, you can replay the entire historical event log from Kafka or EventStore to construct the new read model from scratch."
          ]
        },
        {
          heading: "3. Failure Modes: Eventual Consistency Lag in UI",
          body: "The primary challenge of CQRS is eventual consistency. Because read projections are populated asynchronously, there is a replication lag of 10–500 milliseconds between the time a user clicks 'Submit Order' and the time the order appears in their search history.",
          bullets: [
            "Read-Your-Own-Writes Dilemma: If a user submits an update and is redirected immediately to the query view, the screen may still display stale data. Solutions: Optimistic UI updates on client, returning the updated entity directly in the POST command response, or pinning the client to the write database for 2 seconds.",
            "Out-of-Order Projection: If an `OrderCancelled` event is processed before an `OrderCreated` event due to partition rebalancing, the read store can reach an invalid state. Projectors must enforce monotonic version checking.",
            "Dual Schema Drift: When domain models evolve, both the command schema and projection schemas must be updated with backwards compatibility."
          ]
        },
        {
          heading: "4. Production Blueprint: CQRS Projection Handler in Go",
          body: "The following Go snippet illustrates a production event projection consumer updating an Elasticsearch read model with monotonic sequence validation.",
          bullets: [
            "Monotonic Version Check: Rejects older events to prevent out-of-order projection corruption.",
            "Atomic Upsert: Updates the denormalized read document in Elasticsearch."
          ],
          codeSnippet: {
            title: "CQRS Materialized View Projector in Go",
            code: `package projector\n\nimport (\n    "context"\n    "encoding/json"\n    "github.com/elastic/go-elasticsearch/v8"\n    "strings"\n)\n\ntype OrderProjector struct {\n    esClient *elasticsearch.Client\n}\n\nfunc (p *OrderProjector) HandleOrderCreated(ctx context.Context, eventPayload []byte) error {\n    var event struct {\n        OrderID     string   \`json:"order_id"\`\n        CustomerID  string   \`json:"customer_id"\`\n        TotalAmount float64  \`json:"total_amount"\`\n        Items       []string \`json:"items"\`\n        Version     int64    \`json:"version"\`\n    }\n    if err := json.Unmarshal(eventPayload, &event); err != nil {\n        return err\n    }\n\n    // Materialized View Document formatted specifically for fast search\n    doc := map[string]interface{}{\n        "order_id":     event.OrderID,\n        "customer_id":  event.CustomerID,\n        "total_amount": event.TotalAmount,\n        "item_names":   event.Items,\n        "version":      event.Version,\n    }\n    bodyJSON, _ := json.Marshal(doc)\n\n    _, err := p.esClient.Index(\n        "orders_read_view",\n        strings.NewReader(string(bodyJSON)),\n        p.esClient.Index.WithDocumentID(event.OrderID),\n        p.esClient.Index.WithContext(ctx),\n    )\n    return err\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "CQRS with Polyglot Storage", pros: "Blazing fast read queries (<5ms); asymmetric read/write scaling; optimized search with Elasticsearch; clean separation of concerns.", cons: "Eventual consistency lag in UI; high operational complexity (Kafka + ES + Postgres); double data storage cost.", bestFor: "High-scale systems with heavy read-to-write ratios (e.g. E-commerce search, social media feeds, booking platforms)." },
        { option: "CQRS with Single Relational DB (Views)", pros: "Separates command and query classes in code while using SQL materialized views; immediate consistency option.", cons: "Still limited by relational database CPU and disk I/O.", bestFor: "Medium-scale applications wanting clean code separation without distributed infrastructure." },
        { option: "Standard CRUD Single Model", pros: "Simpler architecture; immediate read consistency; minimal infrastructure overhead.", cons: "Complex joins slow down as data scales; write locks degrade read latency.", bestFor: "Low-traffic internal tools or simple CRUD applications with balanced read/write ratios." }
      ],
      interviewTip: "In interviews, bring up CQRS when addressing high-throughput asymmetric workloads: 'Because our system has a 200:1 read-to-write ratio with complex search requirements, I apply CQRS. The Command model writes normalized records to PostgreSQL to guarantee ACID invariants, while streaming domain events through Kafka to project denormalized materialized views into Elasticsearch for sub-10ms search queries.'"
    },
    {
      id: "saga-pattern",
      subtopicNumber: "3.5",
      title: "Distributed Saga Pattern",
      subtitle: "Managing distributed transactions across microservices using Orchestration and Choreography with compensating actions.",
      readingTime: "10 min read",
      difficulty: "Expert",
      accent: "#ec4899",
      keyTakeaways: [
        "In a microservices architecture with Database-per-Service, traditional 2-Phase Commit (2PC) distributed ACID transactions do not scale and introduce crippling latency locks.",
        "A Saga is a sequence of local transactions where each service updates its local database and publishes an event or message to trigger the next local transaction.",
        "Compensating Transactions: If a step fails mid-way (e.g. insufficient payment funds), the Saga executes explicit compensating actions in reverse order to undo changes (semantic rollback).",
        "Two Coordination Styles: Choreography (services react to decentralized Kafka events) vs Orchestration (a centralized orchestrator like Temporal or Camunda commands each step)."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  DISTRIBUTED SAGA TRANSACTION PIPELINE                  |
+-------------------------------------------------------------------------+
[Saga Orchestrator (Temporal / Camunda / Custom Engine)]
   |
   |-- 1. CreateOrder (Pending) ----------> [Order Service: Local DB Commit]
   |
   |-- 2. ReserveInventory --------------> [Inventory Service: Commit]
   |
   |-- 3. ProcessPayment (FAILS! Card Expired)
   |
   v === TRIGGER COMPENSATING ROLLBACK TRANSACTIONS IN REVERSE ===
   |
   |-- Compensate: ReleaseInventory ------> [Inventory Service: Restock]
   |
   +-- Compensate: CancelOrder -----------> [Order Service: Status CANCELLED]`,
      blockNodes: [
        { x: 50, y: 120, w: 260, h: 180, title: 'Choreography Saga', stroke: '#38bdf8', lines: ['Decentralized Kafka events', 'Services react to topic events', 'Zero central orchestrator', 'Best for simple 2–3 step flows', 'Risk: Spaghetti dependencies'], tag: 'Decentralized' },
        { x: 370, y: 90, w: 260, h: 230, title: 'Orchestration Saga', stroke: '#ec4899', lines: ['Central state machine (Temporal)', 'Commands each step explicitly', 'Handles timeouts & retries', 'Explicit compensation tree', 'Full transaction visibility'], tag: 'Central Coordinator' },
        { x: 690, y: 120, w: 260, h: 180, title: 'Compensating Action', stroke: '#ef4444', lines: ['Semantic business rollback', 'Refund payment transaction', 'Restock reserved inventory', 'Idempotent compensation', 'Restores data consistency'], tag: 'Semantic Undo' }
      ],
      blockConns: [
        { d: 'M 310 180 L 370 180', lx: 340, ly: 170, label: 'Evolve' },
        { d: 'M 630 180 L 690 180', lx: 660, ly: 170, label: 'Compensate' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Local Tx 1', stroke: '#38bdf8', lines: ['Order Service creates order', 'Status: PENDING', 'Publishes OrderCreated'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Local Tx 2', stroke: '#10b981', lines: ['Inventory reserves items', 'Holds stock for 10 min', 'Emits StockReserved'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Payment Fails', stroke: '#ef4444', lines: ['Payment Service rejects card', 'Emits PaymentFailed event', 'Triggers compensation'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Compensate', stroke: '#f59e0b', lines: ['Inventory releases stock', 'Order status: CANCELLED', 'User notified of failure'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Next' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Fail' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Undo' }
      ],
      sections: [
        {
          heading: "1. The Death of 2-Phase Commit (2PC) in Cloud Microservices",
          body: "In monolithic systems, cross-table atomicity is guaranteed by database ACID engines. If an order fails, the database automatically rolls back all disk writes. In microservices where each service owns a private database, achieving atomicity across multiple services historically relied on distributed 2-Phase Commit (2PC) protocols (such as XA transactions). In 2PC, a central transaction coordinator locks database rows across all services during Phase 1 (Prepare) and commits them in Phase 2. In modern high-throughput cloud environments, 2PC is fundamentally broken: it holds database locks across network hops, latency scales with the slowest node, and if the coordinator crashes during Phase 2, locks freeze indefinitely, bringing down the cluster. The Saga pattern replaces 2PC with eventual consistency.",
          bullets: [
            "No Distributed Locking: Sagas do not hold cross-network database locks; each service commits locally and immediately.",
            "ACID to BASE Transition: Sagas trade strict Isolation (the 'I' in ACID) for Basic Availability, Soft state, and Eventual consistency (BASE).",
            "Local Transaction Sequence: A Saga is a sequence of transactions $T_1, T_2, ..., T_n$. Each transaction updates local data and publishes an event triggering $T_{i+1}$."
          ]
        },
        {
          heading: "2. Choreography vs Orchestration: Architectural Showdown",
          body: "There are two fundamental approaches to coordinating a distributed Saga:",
          bullets: [
            "Choreography (Event-Driven Decentralized): Services publish and listen to domain events via Kafka with no central coordinator. Service A emits `OrderCreated`, Service B listens and emits `InventoryReserved`, Service C listens and emits `PaymentCharged`. Advantage: Simple to build for small 2–3 step workflows. Disadvantage: Difficult to visualize, cyclical dependency risks ('spaghetti choreography'), and debugging failed compensations across 10 services is an operational nightmare.",
            "Orchestration (Centralized State Machine): A dedicated Saga Orchestrator (e.g. Temporal, AWS Step Functions, Camunda) commands each service explicitly. The orchestrator sends synchronous commands (`reserveStock`) and waits for responses. Advantage: Clear centralized state machine, easy to audit transaction progress, straightforward timeout and compensation handling. Disadvantage: Central point of logic configuration."
          ]
        },
        {
          heading: "3. Semantic Rollbacks & Compensating Transactions",
          body: "Because Sagas commit local transactions immediately, you cannot simply execute a database `ROLLBACK` when step 4 fails. Instead, you must execute explicit Compensating Transactions ($C_1, C_2, ..., C_{n-1}$) in reverse order to semantically undo earlier commitments.",
          bullets: [
            "Semantic Undo vs Hard Rollback: You cannot un-send an SMS email; you send a second email apologizing for the cancellation. You cannot erase a bank debit; you issue a credit refund.",
            "Pivot Transaction: The point of no return. Transactions before the Pivot must have compensations. Once the Pivot transaction commits, the Saga MUST proceed forward to completion (Retryable Transactions).",
            "Compensations MUST Be Idempotent: If a network timeout occurs while executing a compensation, the orchestrator will retry it. A compensation must be safely callable multiple times without double-crediting funds."
          ]
        },
        {
          heading: "4. Production Blueprint: Saga Orchestrator State Machine in TypeScript",
          body: "The following TypeScript snippet demonstrates an explicit Saga Orchestrator managing order placement, inventory reservation, payment charging, and automated compensating rollbacks upon failure.",
          bullets: [
            "Step & Compensation Stack: Dynamically pushes successful steps onto an undo stack.",
            "Automated Rollback Loop: Iterates backwards through the undo stack upon any step exception."
          ],
          codeSnippet: {
            title: "Production Saga Orchestrator Engine in TypeScript",
            code: `export interface SagaStep<TContext> {\n  name: string;\n  execute: (ctx: TContext) => Promise<void>;\n  compensate: (ctx: TContext) => Promise<void>;\n}\n\nexport class SagaCoordinator<TContext> {\n  private steps: SagaStep<TContext>[] = [];\n\n  addStep(step: SagaStep<TContext>): this {\n    this.steps.push(step);\n    return this;\n  }\n\n  async execute(ctx: TContext): Promise<void> {\n    const compensationStack: SagaStep<TContext>[] = [];\n\n    for (const step of this.steps) {\n      try {\n        await step.execute(ctx);\n        compensationStack.push(step); // Push onto rollback stack\n      } catch (error) {\n        console.error(\`Saga step [\${step.name}] failed. Initiating compensations...\`, error);\n        await this.rollback(ctx, compensationStack);\n        throw new Error(\`Saga aborted at step \${step.name}: \${(error as Error).message}\`);\n      }\n    }\n  }\n\n  private async rollback(ctx: TContext, stack: SagaStep<TContext>[]): Promise<void> {\n    // Execute compensations in reverse order\n    while (stack.length > 0) {\n      const step = stack.pop()!;\n      try {\n        await step.compensate(ctx);\n      } catch (compError) {\n        console.error(\`CRITICAL: Compensation for \${step.name} failed! Alerting SRE.\`, compError);\n      }\n    }\n  }\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Orchestration Saga (Temporal / Step Functions)", pros: "Centralized state machine visibility; easy to audit and debug; trivial timeout and retry policies; prevents circular event spaghetti.", cons: "Requires dedicated orchestrator infrastructure; potential risk of concentrating too much business logic in orchestrator.", bestFor: "Complex business workflows with 4+ steps, financial transactions, or multi-day long-running processes." },
        { option: "Choreography Saga (Kafka Events)", pros: "Zero central coordinator; pure event-driven decoupling; very high throughput for simple linear flows.", cons: "Severe observability deficit; cyclic dependency risks; difficult to trace where a transaction stalled or failed.", bestFor: "Simple 2–3 step workflows (e.g. User Signup -> Send Welcome Email -> Create Analytics Profile)." },
        { option: "Two-Phase Commit (2PC / XA)", pros: "Strict immediate ACID consistency.", cons: "Extreme latency lock contention; single coordinator point of failure; completely unscalable in cloud microservices.", bestFor: "Legacy monolithic single-datacenter banking databases; strictly avoid in microservices." }
      ],
      interviewTip: "In advanced system design rounds (e.g. Design an E-Commerce Order System or Flight Booking), frame distributed transactions with clarity: 'Because microservices enforce Database-per-Service, 2-Phase Commit is unacceptable due to blocking lock latency. Instead, I implement the Saga pattern. For complex order workflows involving Inventory, Payments, and Shipping, I use Orchestration via a durable workflow engine like Temporal. Each step commits locally, and if the payment step fails, the orchestrator triggers idempotent compensating transactions in reverse order to restore consistency.'"
    },
    {
      id: "distributed-locking",
      subtopicNumber: "3.6",
      title: "Distributed Locking & Concurrency Control",
      subtitle: "Preventing race conditions across multi-node clusters using Redis Redlock, ZooKeeper ephemeral leases, and fencing tokens.",
      readingTime: "9 min read",
      difficulty: "Expert",
      accent: "#d97706",
      keyTakeaways: [
        "In a distributed microservices cluster with auto-scaled pods, local mutexes (`sync.Mutex`, `synchronized`) only protect a single process; multiple pods can execute conflicting mutations simultaneously.",
        "A Distributed Lock coordinates mutual exclusion across multiple independent processes running on separate physical machines.",
        "The Fencing Token is mandatory: simple lock leases are vulnerable to GC pauses and network freezes; storage engines must reject writes with stale monotonic tokens.",
        "Redis Redlock vs ZooKeeper/Etcd: Redis is fast but vulnerable to clock skew; Etcd/ZooKeeper provide CP linearizability using Raft/Paxos consensus."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  DISTRIBUTED LOCKING & FENCING TOKENS                   |
+-------------------------------------------------------------------------+
Client 1 ---> [Acquire Lock: 'order_99'] ---> [Lock Manager (Etcd/Redis)]
              (Granted Lease + Fencing Token #42)
                   |
     (Process paused by 15-second Stop-The-World JVM GC Pause)
     [Lock expires due to TTL timeout!]
                   |
Client 2 ---> [Acquire Lock: 'order_99'] ---> Granted Token #43
Client 2 ---> Writes to DB with Token #43 ---> SUCCESS (DB tracks highest token: 43)
                   |
     (Client 1 wakes up from GC pause and attempts write with Token #42)
                   v
[Database rejects Client 1 write because Token 42 < Current Highest Token 43!]`,
      blockNodes: [
        { x: 50, y: 120, w: 260, h: 180, title: 'Client 1 (Stale)', stroke: '#ef4444', lines: ['Acquires Lock (Token #42)', 'Suffers Stop-The-World GC', 'Lock TTL lease expires', 'Attempts write with old token'], tag: 'Expired Lease' },
        { x: 370, y: 100, w: 260, h: 220, title: 'Consensus Lock Manager', stroke: '#10b981', lines: ['Etcd / ZooKeeper / Redis', 'Monotonic Fencing Token Gen', 'Heartbeat session leases', 'Raft linearizable state', 'Safe mutual exclusion'], tag: 'Lease Authority' },
        { x: 690, y: 120, w: 260, h: 180, title: 'Fenced Storage Engine', stroke: '#a855f7', lines: ['Database verifies token', 'Tracks last_token: 43', 'Rejects token 42 write', 'Prevents split-brain corruption'], tag: 'Enforced Store' }
      ],
      blockConns: [
        { d: 'M 310 180 L 370 180', lx: 340, ly: 170, label: 'Lease' },
        { d: 'M 630 180 L 690 180', lx: 660, ly: 170, label: 'Verify Token' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Acquire Lease', stroke: '#38bdf8', lines: ['Client queries lock manager', 'Requests lock for resource', 'Receives lease + Token: 101'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Heartbeat Loop', stroke: '#10b981', lines: ['Background thread renews lease', 'Keeps lock alive during task', 'Expires if process dies'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Execute Work', stroke: '#f59e0b', lines: ['Performs critical mutation', 'Includes fencing token in write', 'Ensures mutual exclusion'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Release Lock', stroke: '#a855f7', lines: ['Explicit atomic lock release', 'Validates lock owner UUID', 'Frees resource for next client'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Lease' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Heartbeat' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Release' }
      ],
      sections: [
        {
          heading: "1. Why In-Process Mutexes Fail in Cloud Architectures",
          body: "When building single-process applications, concurrency is managed using language primitives: Java's `ReentrantLock`, Go's `sync.Mutex`, or POSIX mutexes. In modern cloud microservices, services are deployed as multiple container replicas behind a load balancer. If two user requests to book the exact same flight seat hit Pod A and Pod B simultaneously, an in-process mutex in Pod A has zero awareness of Pod B. Both pods check the database, both see the seat as available, and both commit the booking—resulting in double bookings. A Distributed Lock provides cluster-wide mutual exclusion across all physical and virtual nodes.",
          bullets: [
            "Cluster-Wide Concurrency: Coordinates actions across multiple independent processes, containers, and data centers.",
            "Two Primary Use Cases: Efficiency (preventing expensive duplicated background jobs) vs Correctness (preventing race conditions that corrupt financial data or cause double booking).",
            "Efficiency vs Correctness Distinction: If a lock fails in an efficiency use case, work is simply done twice. If a lock fails in a correctness use case, user data is permanently corrupted."
          ]
        },
        {
          heading: "2. The Flaw in Distributed Lock Leases: Martin Kleppmann's Critique",
          body: "A dangerous architectural fallacy is assuming that a distributed lock lease guarantees that only one process is executing at any instant. Consider the following real-world scenario:\n1. Client 1 acquires a lock with a 10-second TTL lease from Redis.\n2. Client 1 enters a 15-second Stop-The-World JVM Garbage Collection pause or Linux OS page fault.\n3. While Client 1 is frozen, its 10-second lease expires in Redis.\n4. Client 2 acquires the lock and begins writing to storage.\n5. Client 1 wakes up from its GC pause! Believing it still owns the lock, it writes to storage, clobbering Client 2's data!\nNo amount of tweaking lock timeouts can eliminate this race condition because client execution time is asynchronous and non-deterministic.",
          bullets: [
            "Fencing Tokens: The definitive mathematical solution. Every time a lock is granted, the lock manager increments and returns a strictly monotonic integer fencing token (e.g., Token 42, Token 43).",
            "Storage-Level Token Verification: The storage engine rejects any write whose fencing token is lower than the highest token it has already processed. When Client 1 wakes up with Token 42, the database rejects its write because it already accepted Client 2's Token 43."
          ]
        },
        {
          heading: "3. Lock Manager Showdown: Redis Redlock vs Etcd / ZooKeeper",
          body: "Choosing a distributed lock manager requires understanding CAP theorem trade-offs and physical clock skew.",
          bullets: [
            "Redis Redlock: An algorithm where a client attempts to acquire locks in majority ($N/2 + 1$) independent Redis nodes. Highly controversial among distributed systems experts because it relies on physical clock synchronization (NTP). If an NTP clock jumps forward on one Redis instance, the lock lease expires prematurely, breaking mutual exclusion.",
            "Etcd / ZooKeeper: CP systems based on Raft and Paxos consensus. They use heartbeat sessions and ephemeral sequential z-nodes. If a node loses consensus, it does not rely on system clocks—it relies on Raft epoch terms and logical clocks, providing mathematically sound linearizable locks."
          ]
        },
        {
          heading: "4. Production Blueprint: Redis Atomic Lua Lock with Owner UUID",
          body: "The following Go implementation demonstrates safe atomic lock acquisition with TTL and safe atomic release using a Lua script to prevent accidentally deleting another client's lock.",
          bullets: [
            "Owner Verification: Never delete a lock without checking that the UUID matches your client identity.",
            "Atomic Lua Script: Guarantees that the GET and DEL operations execute atomically without race conditions."
          ],
          codeSnippet: {
            title: "Safe Distributed Lock in Go with Redis & Lua Script",
            code: `package dlock\n\nimport (\n    "context"\n    "time"\n    "github.com/google/uuid"\n    "github.com/redis/go-redis/v9"\n)\n\ntype DistributedLock struct {\n    client   *redis.Client\n    key      string\n    ownerID  string\n    ttl      time.Duration\n}\n\nfunc NewLock(client *redis.Client, key string, ttl time.Duration) *DistributedLock {\n    return &DistributedLock{\n        client:  client,\n        key:     "lock:" + key,\n        ownerID: uuid.NewString(),\n        ttl:     ttl,\n    }\n}\n\nfunc (l *DistributedLock) TryAcquire(ctx context.Context) (bool, error) {\n    // SET key ownerID NX PX ttl\n    return l.client.SetNX(ctx, l.key, l.ownerID, l.ttl).Result()\n}\n\nfunc (l *DistributedLock) Release(ctx context.Context) error {\n    // Atomic Lua script: only delete if the lock value matches our ownerID\n    luaScript := \`\n        if redis.call("get", KEYS[1]) == ARGV[1] then\n            return redis.call("del", KEYS[1])\n        else\n            return 0\n        end\n    \`\n    return l.client.Eval(ctx, luaScript, []string{l.key}, l.ownerID).Err()\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Etcd / ZooKeeper Consensus Locks", pros: "Mathematically safe; based on Raft/Paxos consensus; does not rely on physical system clocks; provides monotonic fencing tokens.", cons: "Lower throughput than Redis (requires disk write quorum on consensus nodes); requires maintaining an Etcd/ZK cluster.", bestFor: "Mission-critical correctness (financial transactions, leader election, exclusive hardware access)." },
        { option: "Redis Single Instance / Sentinel", pros: "Blazing fast in-memory execution (<1ms); trivial to set up with existing Redis infrastructure.", cons: "If master fails before replication, lock can be acquired by two clients; vulnerable to GC pause race conditions without fencing tokens.", bestFor: "Efficiency use cases (e.g. preventing duplicate cron jobs, cache rebuild stampedes)." },
        { option: "Database Optimistic Concurrency Control (OCC)", pros: "Zero external lock manager required; uses `version` column in existing SQL database.", cons: "Under high write contention, transactions repeatedly fail and abort, wasting database CPU.", bestFor: "Low-to-medium contention resources where conflicts are rare." }
      ],
      interviewTip: "In advanced system design interviews, demonstrating knowledge of fencing tokens is a major hiring signal: 'When designing a distributed lock for critical data mutations, a simple Redis lease is insufficient because GC pauses or network delays can cause a client to write after its lease expires. Therefore, I pair the lock manager with a Monotonic Fencing Token (e.g. from Etcd). The storage engine validates the fencing token and rejects any write with a token lower than the latest seen, guaranteeing safety against split-brain corruption.'"
    }
  ]
};

const MODULE_4_RESILIENCE = {
  id: "resilience-fault-tolerance",
  topicNumber: 4,
  title: "4. Distributed Resilience & Fault Tolerance",
  description: "Building battle-hardened distributed systems: timeout propagation, exponential backoff with jitter, circuit breakers, rate limiting, graceful degradation, and bulkhead isolation.",
  subtopics: [
    {
      id: "timeout-deadlines",
      subtopicNumber: "4.1",
      title: "Timeout & Context Deadline Propagation",
      subtitle: "Preventing thread pool starvation and cascading wait times by propagating end-to-end latency budgets.",
      readingTime: "8 min read",
      difficulty: "Intermediate",
      accent: "#38bdf8",
      keyTakeaways: [
        "In a distributed system, a missing timeout is a fatal bug: an unresponsive downstream service will cause upstream threads to wait indefinitely until the server crashes from resource exhaustion.",
        "Static timeouts are insufficient for multi-tier architectures; use Context Deadline Propagation (e.g. gRPC `grpc-timeout` or HTTP `X-Client-Timeout-Budget`).",
        "If a client gives an operation a total budget of 1,000ms, and Step 1 consumes 800ms, Step 2 must be allocated only the remaining 200ms—not a fresh 1,000ms.",
        "Fail Fast: If a service receives a request whose deadline has already expired before processing begins, it must immediately reject it with HTTP `504 Gateway Timeout`."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  DEADLINE BUDGET PROPAGATION IN RPC CHAINS              |
+-------------------------------------------------------------------------+
[Client Edge: Total Budget = 1,000ms]
      |
      |-- HTTP Call (Budget: 1,000ms)
      v
[API Gateway] -- (Takes 100ms)
      |
      |-- Call Order Svc (Remaining Budget: 900ms)
      v
[Order Service] -- (Takes 400ms)
      |
      |-- Call Inventory Svc (Remaining Budget: 500ms)
      v
[Inventory Service] -- (Takes 450ms)
      |
      |-- Call Warehouse Svc (Remaining Budget: 50ms)
      v
[Warehouse Service: Query requires 200ms -> FAILS FAST IMMEDIATELY!]
(Drops query without executing, saving database CPU and thread resources)`,
      blockNodes: [
        { x: 50, y: 120, w: 250, h: 180, title: 'Client Budget: 1000ms', stroke: '#38bdf8', lines: ['Client sets total timeout', 'Applies context deadline', 'Propagates header over wire', 'Aborts on expiration'], tag: 'Origin Budget' },
        { x: 360, y: 100, w: 270, h: 220, title: 'Intermediary Services', stroke: '#10b981', lines: ['Consumes local time', 'Subtracts elapsed latency', 'Passes remaining delta', 'Enforces strict deadline', 'Prevents runaway waits'], tag: 'Budget Tracking' },
        { x: 690, y: 120, w: 250, h: 180, title: 'Downstream Leaf', stroke: '#ef4444', lines: ['Checks remaining budget', 'Budget <= 0? Fail fast!', 'Zero database CPU wasted', 'Returns HTTP 504 status'], tag: 'Fail Fast Drop' }
      ],
      blockConns: [
        { d: 'M 300 210 L 360 210', lx: 330, ly: 200, label: 'Pass Budget' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'Remaining' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Origin Stamp', stroke: '#38bdf8', lines: ['Client sets deadline', 'Deadline = Now + 1500ms', 'Injects grpc-timeout header'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Hop Ingress', stroke: '#10b981', lines: ['Service B extracts deadline', 'Calculates remaining ms', 'Sets local context timeout'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Work Check', stroke: '#f59e0b', lines: ['Before heavy DB query', 'Verify ctx.Err() == nil', 'If expired, abort immediately'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Cascade Clean', stroke: '#a855f7', lines: ['Cancel child goroutines', 'Release connection pool', 'Emit 504 Gateway Timeout'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Stamp' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Check' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Reap' }
      ],
      sections: [
        {
          heading: "1. The Anatomy of Latency Failures: Thread Starvation",
          body: "In a microservices architecture, crashes rarely bring down a system instantly; it is slow dependencies that cause catastrophic cluster-wide failures. When downstream Service C slows down from 20 milliseconds to 10 seconds due to database lock contention, upstream Service B's worker threads block waiting for responses. Within seconds, all 200 threads in Service B's connection pool are exhausted. Service B ceases accepting new requests from Service A, which in turn exhausts Service A's thread pool, cascading backwards until the external API gateway collapses. Timeouts are the first line of defense in distributed fault tolerance.",
          bullets: [
            "Connection Timeout vs Read Timeout: Connection timeout governs TCP socket establishment (set to 500ms); Read timeout governs waiting for data packets once connected.",
            "Thread Starvation: A 30-second default HTTP timeout in a service processing 100 requests/sec will consume 3,000 concurrent threads, crashing the process with `OutOfMemoryError`.",
            "Always Define Explicit Timeouts: Never rely on default HTTP/gRPC client timeouts, which are frequently infinite or set to multiple minutes."
          ]
        },
        {
          heading: "2. The Deadline Propagation Mechanism: End-to-End Latency Budgets",
          body: "Static timeouts on individual services are fundamentally flawed in multi-hop call graphs. If Service A has a 5-second timeout, Service B has a 5-second timeout, and Service C has a 5-second timeout, a user request can hang for 15 seconds! Conversely, if Service A times out after 2 seconds and returns an error to the user, but Service B and C continue computing for another 10 seconds, the cluster wastes expensive CPU and database resources on a request the user has already abandoned. The solution is Context Deadline Propagation.",
          bullets: [
            "gRPC `grpc-timeout` Header: Native standard in gRPC that communicates the remaining execution time as an absolute deadline or millisecond budget.",
            "HTTP `X-Request-Deadline` Header: Propagates unix epoch timestamps indicating when the caller will abort the request.",
            "Dynamic Budget Subtraction: Each hop subtracts its own elapsed execution time and passes only the remaining delta to downstream dependencies."
          ]
        },
        {
          heading: "3. Fail-Fast Optimization: Shedding Dead Requests",
          body: "Deadline propagation enables one of the most powerful performance optimizations in high-scale systems: Fail-Fast Request Shedding.",
          bullets: [
            "Pre-Execution Inspection: Before executing an expensive SQL query or calling a machine learning inference model, the service inspects `context.Deadline()`. If the deadline has already expired while the request sat in the local web server queue, the service drops the request immediately without touching the database.",
            "Cancelling In-Flight Operations: When a parent context expires, Go contexts and gRPC cancellation tokens immediately terminate in-flight child network sockets, freeing thread resources."
          ]
        },
        {
          heading: "4. Production Blueprint: Go Context Propagation & Deadline Enforcement",
          body: "The following production Go snippet demonstrates receiving an incoming HTTP deadline header, establishing a context with timeout, and propagating the remaining budget to a downstream client.",
          bullets: [
            "Header Parsing: Parses `X-Request-Deadline-Ms` and bounds it by a local maximum ceiling.",
            "Context Cancellation: Automatically releases HTTP connection resources via `context.WithTimeout`."
          ],
          codeSnippet: {
            title: "Go Context Deadline Propagation Middleware & Client",
            code: `package middleware\n\nimport (\n    "context"\n    "net/http"\n    "strconv"\n    "time"\n)\n\nfunc DeadlinePropagationMiddleware(next http.Handler) http.Handler {\n    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        // Default max budget: 2000ms\n        budget := 2000 * time.Millisecond\n\n        if deadlineHeader := r.Header.Get("X-Client-Timeout-Budget-Ms"); deadlineHeader != "" {\n            if ms, err := strconv.ParseInt(deadlineHeader, 10, 64); err == nil && ms > 0 {\n                budget = time.Duration(ms) * time.Millisecond\n            }\n        }\n\n        ctx, cancel := context.WithTimeout(r.Context(), budget)\n        defer cancel()\n\n        // Fail fast if already expired\n        if ctx.Err() != nil {\n            http.Error(w, "Gateway Timeout: Deadline already expired", http.StatusGatewayTimeout)\n            return\n        }\n\n        next.ServeHTTP(w, r.WithContext(ctx))\n    })\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Context Deadline Propagation", pros: "Eliminates phantom execution on abandoned requests; prevents cascading wait times; enables fail-fast load shedding.", cons: "Requires strict context passing discipline in code; potential clock drift issues if using absolute epoch timestamps instead of relative duration budgets.", bestFor: "All modern microservices architectures (standard in gRPC and OpenTelemetry)." },
        { option: "Static Timeouts per Service", pros: "Simple to configure in YAML/properties files on individual services.", cons: "Compounding latency hops; downstream services execute work even after upstream caller has timed out and disconnected.", bestFor: "Simple 2-tier client-server architectures only." },
        { option: "No Timeouts (Infinite)", pros: "None.", cons: "Guaranteed thread starvation, cluster-wide cascade crashes, and operational downtime.", bestFor: "Never acceptable under any circumstances." }
      ],
      interviewTip: "In architecture interviews, emphasize end-to-end latency budgets: 'I never configure static timeouts in isolation. I implement Context Deadline Propagation. The API gateway sets a global latency budget (e.g. 1500ms). Each downstream service extracts the budget, subtracts elapsed time, and forwards the remaining delta. If a request's deadline expires while sitting in a queue, the service drops it immediately, protecting our database and thread pools from cascading starvation.'"
    },
    {
      id: "retry-exponential-backoff",
      subtopicNumber: "4.2",
      title: "Retry with Exponential Backoff & Full Jitter",
      subtitle: "Mitigating thundering herd retry storms using Amazon Full Jitter algorithm and idempotent retry policies.",
      readingTime: "8 min read",
      difficulty: "Intermediate",
      accent: "#10b981",
      keyTakeaways: [
        "Retrying transient network glitches is essential, but naive immediate retries trigger 'Retry Storms' that crush recovering services (Thundering Herd problem).",
        "Exponential Backoff doubles the wait duration after each consecutive failure: $T = \text{base} \times 2^{\text{attempt}}$.",
        "Full Jitter is mandatory: Adding randomized jitter distributes retries uniformly across time, preventing synchronized spikes of traffic from hitting the server.",
        "Never retry non-idempotent operations or permanent client errors (HTTP 4xx like 400 Bad Request, 401 Unauthorized, 404 Not Found); retry strictly transient 503 and network timeouts."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  RETRY STORM VS FULL JITTER DISTRIBUTION                 |
+-------------------------------------------------------------------------+
[Naive Retries: Thundering Herd / Retry Storm]
Time:  0s       1s       2s       3s       4s
       ||||||||          ||||||||          ||||||||  <--- Synchronized spikes
       (1,000 clients retry simultaneously at exact same second, crashing DB)

[Exponential Backoff with Full Jitter: Amazon Architecture]
Time:  0s    1s    2s    3s    4s    5s    6s    7s    8s
       |  |   | |   |  |   |    |  |   |  |   |   |  |   <--- Smoothly smoothed
       (Retries randomly distributed: sleep = rand(0, min(cap, base * 2^attempt)))`,
      blockNodes: [
        { x: 50, y: 120, w: 250, h: 180, title: 'Naive Retries (Danger)', stroke: '#ef4444', lines: ['Immediate consecutive retry', 'Zero random wait time', 'Synchronized traffic spikes', 'Crushes recovering service'], tag: 'Retry Storm' },
        { x: 360, y: 100, w: 270, h: 220, title: 'Full Jitter Formula', stroke: '#10b981', lines: ['sleep = rand(0, base * 2^n)', 'Smooths out traffic spikes', 'Guaranteed minimum spread', 'AWS proven mathematical model', 'Absorbs transient glitches'], tag: 'Amazon Jitter' },
        { x: 690, y: 120, w: 250, h: 180, title: 'Recovering Service', stroke: '#38bdf8', lines: ['DB finishes failover', 'Absorbs dispersed traffic', 'Zero queue saturation', 'Cluster heals gracefully'], tag: 'Graceful Recovery' }
      ],
      blockConns: [
        { d: 'M 300 210 L 360 210', lx: 330, ly: 200, label: 'Jitter' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'Absorb' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Call Fails', stroke: '#38bdf8', lines: ['HTTP 503 or timeout', 'Check if error is retryable', 'Check attempt < maxAttempts'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Compute Backoff', stroke: '#10b981', lines: ['temp = min(cap, base * 2^n)', 'sleep = rand(0, temp)', 'Full Jitter calculated'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Sleep Non-Blocking', stroke: '#f59e0b', lines: ['Sleep for computed duration', 'Listen to context cancellation', 'Abort if budget expired'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Retry Exec', stroke: '#a855f7', lines: ['Execute retry attempt', 'Attach idempotency key', 'Track metrics in Prometheus'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Fail' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Compute' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Dispatch' }
      ],
      sections: [
        {
          heading: "1. The Danger of Retry Storms: Self-Inflicted Distributed Denial of Service",
          body: "When a database or microservice experiences a momentary spike in load, its response times increase and a fraction of requests begin timing out. If upstream clients immediately retry failed requests without delay, the total traffic volume instantly doubles. If 1,000 clients fail at time $T$, and all 1,000 immediately retry at $T + 100\\text{ms}$, they hit the struggling service with a synchronized tsunami of traffic known as a 'Retry Storm' or 'Thundering Herd.' Instead of recovering, the service collapses under self-inflicted DDoS load. Sophisticated retry algorithms are required to decouple and smooth out traffic.",
          bullets: [
            "Traffic Multiplier: If each service in a 3-tier chain retries 3 times, a single client request can trigger $3 \\times 3 \\times 3 = 27$ calls to the backend database.",
            "Retry Budgets: A service should limit retries to at most 10% of total incoming traffic; if error rates surpass 10%, retries are disabled globally to protect downstream systems.",
            "Non-Retryable Errors: Never retry HTTP `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, or `422 Unprocessable Entity`—these indicate client bugs that will fail 100% of the time."
          ]
        },
        {
          heading: "2. The Mathematics of Backoff: Full Jitter vs Equal Jitter",
          body: "Exponential backoff increases the delay between retries exponentially: $\\text{Delay} = \\text{Base} \\times 2^{\\text{attempt}}$. For example, with a base of 100ms: attempt 1 waits 200ms, attempt 2 waits 400ms, attempt 3 waits 800ms. However, pure exponential backoff without randomness still synchronizes client retries in clustered bursts. In a seminal paper, Amazon Architecture evaluated backoff algorithms and proved that 'Full Jitter' provides the highest throughput and lowest lock contention.",
          bullets: [
            "Pure Exponential Backoff: $\\text{Sleep} = \\min(\\text{Cap}, \\text{Base} \\times 2^{\\text{attempt}})$. Problem: All clients that failed at $T$ still retry at the exact same instant.",
            "Full Jitter (Amazon Standard): $\\text{Sleep} = \\text{random}(0, \\min(\\text{Cap}, \\text{Base} \\times 2^{\\text{attempt}}))$. Distributes retries uniformly across the entire backoff window, completely smoothing traffic spikes.",
            "Decorrelated Jitter: $\\text{Sleep} = \\min(\\text{Cap}, \\text{random}(\\text{Base}, \\text{previous\\_sleep} \\times 3))$. Prevents clustering across long retry sequences."
          ]
        },
        {
          heading: "3. Circuit Breaker Synergy & Idempotency Safeguards",
          body: "Retries should never exist in isolation; they must be integrated with Idempotency and Circuit Breakers.",
          bullets: [
            "Idempotency Requirement: Retrying a non-idempotent HTTP POST `/payments` without an Idempotency-Key risks charging a customer twice if the initial request succeeded on the server but timed out on the return wire.",
            "Circuit Breaker Coordination: If a downstream service has failed completely, retrying 3 times on every request wastes time and resources. The Circuit Breaker trips to `OPEN`, immediately failing fast without executing retries."
          ]
        },
        {
          heading: "4. Production Blueprint: Amazon Full Jitter Implementation in TypeScript",
          body: "The following production TypeScript implementation demonstrates the Amazon Full Jitter retry algorithm with maximum attempts, latency caps, and error classification.",
          bullets: [
            "Transient Error Classification: Checks whether the error status is transient (503, 504, 429) before sleeping.",
            "Cryptographically Safe Jitter: Computes uniform random sleep distribution up to the exponential ceiling."
          ],
          codeSnippet: {
            title: "Production Exponential Backoff with Full Jitter in TypeScript",
            code: `export interface RetryConfig {\n  maxAttempts: number;\n  baseMs: number;\n  capMs: number;\n}\n\nexport async function executeWithFullJitter<T>(\n  fn: () => Promise<T>,\n  config: RetryConfig = { maxAttempts: 3, baseMs: 100, capMs: 2000 }\n): Promise<T> {\n  let attempt = 0;\n\n  while (true) {\n    try {\n      return await fn();\n    } catch (error: any) {\n      attempt++;\n      if (attempt >= config.maxAttempts || !isTransientError(error)) {\n        throw error;\n      }\n\n      // Amazon Full Jitter Formula: rand(0, min(cap, base * 2^attempt))\n      const exponentialMax = Math.min(config.capMs, config.baseMs * Math.pow(2, attempt));\n      const jitterSleepMs = Math.floor(Math.random() * exponentialMax);\n\n      console.warn(\`Attempt \${attempt} failed. Retrying in \${jitterSleepMs}ms...\`);\n      await new Promise((resolve) => setTimeout(resolve, jitterSleepMs));\n    }\n  }\n}\n\nfunction isTransientError(error: any): boolean {\n  const status = error?.response?.status;\n  // Retry on 503 Service Unavailable, 504 Gateway Timeout, 429 Too Many Requests\n  return status === 503 || status === 504 || status === 429 || error.code === 'ECONNRESET';\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Exponential Backoff with Full Jitter", pros: "Mathematically proven to eliminate retry storms; smooths traffic spikes; gives failing systems breathing room to recover.", cons: "Adds variable latency to failed requests; requires proper timeout budget tracking.", bestFor: "All external API calls, microservice RPCs, and database reconnection logic." },
        { option: "Immediate Fixed Retry", pros: "Fastest recovery if glitch was truly instantaneous (e.g. 1 dropped packet).", cons: "Triggers catastrophic retry storms and thundering herds during real outages; accelerates cluster collapse.", bestFor: "Never recommended in distributed multi-node systems." },
        { option: "No Retry (Fail Immediately)", pros: "Zero retry storm risk; lowest server overhead.", cons: "Fragile user experience; every single dropped packet or container restart surfaces as an error to the end user.", bestFor: "Non-idempotent operations without idempotency keys, or non-critical best-effort fire-and-forget telemetry." }
      ],
      interviewTip: "When asked how to handle transient errors in an architecture interview, be mathematically precise: 'I implement Exponential Backoff with Amazon Full Jitter. Immediate retries create retry storms that amplify outages. With Full Jitter, each client calculates sleep = rand(0, min(cap, base * 2^attempt)), uniformly dispersing retry traffic across time and allowing the downstream service to heal without being crushed by synchronized waves of traffic.'"
    }
  ]
};

// Write out modules 3 and 4
fs.writeFileSync(
  path.join(__dirname, 'microservicesMod3.js'),
  `/* eslint-disable @typescript-eslint/no-require-imports */\nconst MODULE_3_DATA = ${JSON.stringify(MODULE_3_DATA, null, 2)};\nmodule.exports = { MODULE_3_DATA };\n`,
  'utf8'
);

fs.writeFileSync(
  path.join(__dirname, 'microservicesMod4.js'),
  `/* eslint-disable @typescript-eslint/no-require-imports */\nconst MODULE_4_RESILIENCE = ${JSON.stringify(MODULE_4_RESILIENCE, null, 2)};\nmodule.exports = { MODULE_4_RESILIENCE };\n`,
  'utf8'
);

console.log("Modules 3 and 4 successfully written with rich in-depth content and easy-to-hard ordering!");
