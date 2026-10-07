 

const MODULE_5_EVENTS = {
  id: "event-driven-messaging",
  topicNumber: 5,
  title: "5. Event-Driven Architecture & Messaging",
  description: "Event-Driven microservices, Event Sourcing, Kafka partition topology, Dead Letter Queues, and Change Data Capture.",
  subtopics: [
    {
      id: "event-driven-architecture",
      subtopicNumber: "5.1",
      title: "Event-Driven Architecture & Event Sourcing",
      subtitle: "Event notifications vs event-carried state transfer, append-only immutable event stores, and temporal query reconstruction.",
      readingTime: "8 min read",
      difficulty: "Advanced",
      accent: "#8b5cf6",
      keyTakeaways: [
        "In **Event Notification**, producers emit minimal signals (`OrderPlaced: id=123`); consumers must call back via RPC to fetch details.",
        "In **Event-Carried State Transfer (ECST)**, events include full state payloads, allowing consumers to update local read models without back-and-forth RPCs.",
        "In **Event Sourcing**, state is not stored as mutable rows; the sequence of immutable domain events is the authoritative source of truth."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                    EVENT SOURCING & EVENT STREAMING                     |
+-------------------------------------------------------------------------+
[Order Aggregate Mutations]
     |
     v (Append Only Commit Log)
+-----------------------------------------------------------------------+
| Event 1: OrderCreated    (items: [A, B], total: $50)                  |
| Event 2: ItemAdded       (item: C, total: $75)                        |
| Event 3: OrderDiscounted (discount: 10%, total: $67.50)               |
| Event 4: OrderShipped    (tracking: 1Z999)                            |
+-----------------------------------------------------------------------+
     |
     v (Replay & Project)
[Current State: Status=SHIPPED, Total=$67.50, Full Temporal Audit Trail]`,
      blockNodes: [
        { x: 50, y: 110, w: 260, h: 200, title: 'Event Producers', stroke: '#38bdf8', lines: ['Order Service', 'Emits Domain Events', 'Avro / Protobuf payload', 'Zero knowledge of subscribers'], tag: 'Producers' },
        { x: 370, y: 110, w: 260, h: 200, title: 'Event Store / Kafka', stroke: '#8b5cf6', lines: ['Immutable append-only log', 'Persistent on disk', 'Time travel & state replay', 'Kafka Partitioned Topics'], tag: 'Event Store' },
        { x: 690, y: 110, w: 260, h: 200, title: 'Consumer Subsystems', stroke: '#10b981', lines: ['Inventory Service', 'Fraud Scoring Engine', 'Email / Notification Svc', 'Financial Audit Ledger'], tag: 'Consumers' }
      ],
      blockConns: [
        { d: 'M 310 210 L 370 210', lx: 340, ly: 200, label: 'Append' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'Fan-Out' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Command Applied', stroke: '#38bdf8', lines: ['Customer cancels item', 'Aggregate validates rule', 'Generates ItemCancelled event'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Append to Log', stroke: '#8b5cf6', lines: ['Event appended to Kafka', 'Event sequence increments', 'Committed atomically to disk'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Parallel Consume', stroke: '#10b981', lines: ['Inventory restocks item', 'Billing credits customer account', 'Notification sends SMS'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Time Travel Audit', stroke: '#f59e0b', lines: ['Replay events from t=0', 'Reconstruct state at any date', 'Complete regulatory audit'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Validate' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Append' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Fan-Out' }
      ],
      sections: [
        {
          heading: "Event Notification vs Event-Carried State Transfer",
          body: "In Event Notification, the producer publishes a lightweight notification (`{ event: 'OrderCreated', orderId: '123' }`). When 10 downstream services receive this event, each makes a synchronous HTTP/gRPC call back to the Order Service to fetch the customer name, items, and address. This triggers a 10x query storm. In Event-Carried State Transfer (ECST), the event payload contains all relevant domain attributes. Consumers store the data locally in their own databases, achieving complete runtime autonomy without query callbacks.",
          bullets: [
            "Snapshots in Event Sourcing: For aggregates with thousands of events, persist periodic state snapshots (e.g. every 100 events) to speed up hydration.",
            "Schema Evolution: Use Confluent Schema Registry with Avro to enforce backward and forward schema compatibility.",
            "Idempotency: Because Kafka guarantees at-least-once delivery, every consumer must be idempotent."
          ]
        }
      ],
      tradeOffs: [
        { option: "Event-Carried State Transfer", pros: "Consumers are 100% decoupled; zero query storms back to origin service.", cons: "Larger message payload sizes; risk of stale replicated data if events lag.", bestFor: "High-scale asynchronous microservices." },
        { option: "Event Sourcing", pros: "Complete immutable audit log, native time travel debugging, eliminates write lock contention.", cons: "Steep learning curve, complex schema migrations over long historical events.", bestFor: "Fintech ledgers, legal compliance, order tracking systems." }
      ],
      interviewTip: "In interviews, distinguish between Event Notification and Event-Carried State Transfer: 'I will use Event-Carried State Transfer so our downstream analytics and notification services don't bombard the Order service with synchronous GET requests.'"
    },
    {
      id: "kafka-partitions",
      subtopicNumber: "5.2",
      title: "Apache Kafka Partitioning & Consumer Groups",
      subtitle: "Partition keys, topic parallelism, consumer group rebalancing, and consumer lag monitoring.",
      readingTime: "8 min read",
      difficulty: "Advanced",
      accent: "#f59e0b",
      keyTakeaways: [
        "A Kafka topic is divided into **Partitions**: the fundamental unit of parallelism and storage in Apache Kafka.",
        "Kafka guarantees strict message ordering **only within a single partition**, never across different partitions.",
        "A **Consumer Group** coordinates multiple workers: each partition is consumed by exactly one consumer within the group."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                 KAFKA PARTITIONS & CONSUMER GROUP TOPOLOGY              |
+-------------------------------------------------------------------------+
  [Kafka Topic: orders (4 Partitions)]       [Consumer Group: order-workers]
  +-----------------------------------+      +-------------------------------+
  | Partition 0 (hash(key) == 0) ----+-----> | Consumer Instance 1           |
  | Partition 1 (hash(key) == 1) ----+-----> | Consumer Instance 2           |
  | Partition 2 (hash(key) == 2) ----+-----> | Consumer Instance 3           |
  | Partition 3 (hash(key) == 3) ----+-----> | Consumer Instance 4           |
  +-----------------------------------+      +-------------------------------+
(Adding a 5th consumer will leave it IDLE; max parallel consumers = # of partitions!)`,
      blockNodes: [
        { x: 50, y: 110, w: 260, h: 200, title: 'Producers & Partition Key', stroke: '#38bdf8', lines: ['Order Service Producer', 'Key: user_id or order_id', 'MurmurHash2(key) % 4', 'Routes related events to same part'], tag: 'Producers' },
        { x: 370, y: 110, w: 260, h: 200, title: 'Kafka Topic (4 Partitions)', stroke: '#f59e0b', lines: ['Partition 0 | Partition 1', 'Partition 2 | Partition 3', 'Strict in-order commit log', 'High disk sequential I/O'], tag: 'Broker' },
        { x: 690, y: 110, w: 260, h: 200, title: 'Consumer Group (4 Nodes)', stroke: '#10b981', lines: ['Node 1 (P0) | Node 2 (P1)', 'Node 3 (P2) | Node 4 (P3)', 'Auto-rebalancing on crash', 'Independent offset tracking'], tag: 'Consumer Group' }
      ],
      blockConns: [
        { d: 'M 310 210 L 370 210', lx: 340, ly: 200, label: 'Hash Key' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'Assign 1:1' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Key Hashing', stroke: '#38bdf8', lines: ['Produce message with orderId', 'MurmurHash2 calculates partition 2', 'Ensures ordering for this order'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Commit Log Append', stroke: '#f59e0b', lines: ['Broker appends to partition 2', 'Replicated across In-Sync Replicas', 'Producer receives ACK'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Consumer Poll', stroke: '#10b981', lines: ['Consumer assigned to P2 polls', 'Fetches batch of 50 records', 'Processes business logic'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Commit Offset', stroke: '#a855f7', lines: ['Commits consumer offset', 'Progress saved in __consumer_offsets', 'Safe recovery on node reboot'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Hash' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Append' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Poll' }
      ],
      sections: [
        {
          heading: "How Consumer Group Rebalancing Works",
          body: "When a consumer crashes or a new consumer joins the group, Kafka initiates a Group Rebalance to redistribute partition assignments across the remaining active consumers. During eager rebalancing, all consumers stop processing (a 'stop-the-world' pause), which can create temporary latency spikes. Modern Kafka uses Cooperative Sticky Rebalancing (KIP-429), allowing consumers that don't need partition reassignment to continue processing messages without interruption.",
          bullets: [
            "Partition Count Heuristic: Set partition count to $N = \\max(P, C)$ where $P$ is target producer throughput / single partition write throughput, and $C$ is consumer processing throughput.",
            "Consumer Lag Alerting: Monitor `records-lag-max`. A growing consumer lag indicates downstream worker starvation or slow database writes.",
            "Null Keys: If you publish without a key, Kafka uses sticky round-robin partitioning, spreading data evenly but offering zero ordering guarantees."
          ]
        }
      ],
      tradeOffs: [
        { option: "Kafka Partitioning", pros: "Horizontal linear scalability, massive sequential disk throughput (1M+ events/s), guaranteed ordering per key.", cons: "Cannot increase partitions dynamically without breaking partition key hash ordering.", bestFor: "High-throughput stream processing, event sourcing, telemetry." },
        { option: "Standard Message Queues (RabbitMQ / SQS)", pros: "Simple setup, fine-grained message acknowledgment per message.", cons: "Lower throughput; difficult to achieve strict ordered streaming at scale.", bestFor: "Simple background task dispatch and job queues." }
      ],
      interviewTip: "If asked 'How do you scale Kafka consumption?', state: 'The maximum concurrency of a consumer group equals the number of partitions in the topic. If a topic has 10 partitions, running 12 consumer instances will leave 2 instances idle. To increase consumer throughput, we must increase partition count or process messages concurrently within each consumer.'"
    },
    {
      id: "dead-letter-queues",
      subtopicNumber: "5.3",
      title: "Dead Letter Queues (DLQ) & Poison Pill Handling",
      subtitle: "Quarantining unparseable payloads, exponential retry topics, non-blocking retries, and manual replay tooling.",
      readingTime: "7 min read",
      difficulty: "Intermediate",
      accent: "#ef4444",
      keyTakeaways: [
        "A **Poison Pill** is a malformed message (corrupt JSON, missing schema field, null pointer bug) that causes consumer workers to crash repeatedly.",
        "Without proper handling, a poison pill halts partition consumption forever, blocking all subsequent valid messages from being processed.",
        "The **Dead Letter Queue (DLQ)** pattern routes unprocessable messages to a separate error topic after max retries, allowing the main stream to proceed without interruption."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  NON-BLOCKING RETRY TOPICS & DLQ TOPOLOGY               |
+-------------------------------------------------------------------------+
[Main Topic: orders] ===> [Consumer Worker]
                              | (Fails: Transient 503)
                              v
                  [Retry Topic: orders-retry-1] (Sleep 1s)
                              | (Fails Again)
                              v
                  [Retry Topic: orders-retry-2] (Sleep 5s)
                              | (Fails 3x: Poison Pill!)
                              v
                  [DEAD LETTER TOPIC: orders-dlq]
                  (Alert PagerDuty; Inspect & Replay)`,
      blockNodes: [
        { x: 50, y: 110, w: 260, h: 200, title: 'Main Topic Consumer', stroke: '#38bdf8', lines: ['Topic: orders', 'Consumes real-time stream', 'Parses schema payload', 'If poison pill: Forward to retry'], tag: 'Main Stream' },
        { x: 370, y: 110, w: 260, h: 200, title: 'Non-Blocking Retry Topics', stroke: '#f59e0b', lines: ['orders-retry-1 (1s wait)', 'orders-retry-2 (10s wait)', 'Does not block main topic!', 'Main stream continues at 10k/s'], tag: 'Retry Bus' },
        { x: 690, y: 110, w: 260, h: 200, title: 'Dead Letter Topic (DLQ)', stroke: '#ef4444', lines: ['Topic: orders-dlq', 'Stores corrupt payload + error stack', 'Emits Datadog / Slack alert', 'Admin CLI for manual replay'], tag: 'Quarantine' }
      ],
      blockConns: [
        { d: 'M 310 170 L 370 170', lx: 340, ly: 160, label: 'Error' },
        { d: 'M 630 170 L 690 170', lx: 660, ly: 160, label: 'Exhausted' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Poison Pill Arrives', stroke: '#38bdf8', lines: ['Client sends invalid JSON', 'Deserializer throws exception', 'Consumer catches error'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Non-Blocking Shift', stroke: '#f59e0b', lines: ['Commit offset on main topic', 'Publish to retry topic', 'Main partition keeps flowing!'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Retries Exhausted', stroke: '#ef4444', lines: ['Retried 3x on retry topics', 'Still fails NullPointer', 'Routed to `orders-dlq`'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Alert & Replay', stroke: '#10b981', lines: ['Alerts on-call engineer', 'Dev patches consumer bug', 'DLQ replay tool reprocesses'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Catch' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Retry' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Route' }
      ],
      sections: [
        {
          heading: "Why Blocking Retries Destroy Kafka Throughput",
          body: "If your Kafka consumer encounters an error and executes `Thread.sleep(5000)` inside the consumer loop, the entire partition halts. Thousands of legitimate customer messages queued behind the corrupt message remain stuck. In high-throughput architectures, implement Non-Blocking Retries using delayed retry topics (Uber's pattern). The failing message is immediately published to a retry topic and the main topic offset is committed, allowing valid traffic to flow uninterrupted.",
          bullets: [
            "Diagnostic Headers: In the DLQ message headers, attach `X-Exception-Message`, `X-Exception-StackTrace`, and `X-Original-Topic`.",
            "DLQ Replay Tool: Provide a CLI or admin UI allowing engineers to re-publish fixed DLQ messages back to the main topic.",
            "Schema Registry Validation: Prevent poison pills from entering the broker in the first place by validating Avro/Protobuf schemas at the producer boundary."
          ]
        }
      ],
      tradeOffs: [
        { option: "Non-Blocking Retry Topics + DLQ", pros: "Main partition never stalls; poison pills quarantined automatically; full debugging context preserved.", cons: "Messages can temporarily process out of order relative to the retry queue.", bestFor: "High-throughput microservices where partial failures must not block other users." },
        { option: "In-Place Blocking Retries", pros: "Preserves strict ordering of messages.", cons: "Single bad message halts the entire partition indefinitely.", bestFor: "Low-throughput financial ledgers where out-of-order execution is catastrophic." }
      ],
      interviewTip: "When designing asynchronous Kafka consumers, always bring up Dead Letter Queues: 'To prevent poison pills from blocking our Kafka partitions, we will catch unparseable payloads, forward them to a dedicated DLQ topic with exception headers, and commit the main partition offset to keep processing valid messages.'"
    },
    {
      id: "event-ordering",
      subtopicNumber: "5.4",
      title: "Distributed Event Ordering & Key Skew Mitigation",
      subtitle: "Partition hashing, handling celebrity hot keys, out-of-order network arrival resolution, and sequence numbers.",
      readingTime: "8 min read",
      difficulty: "Advanced",
      accent: "#10b981",
      keyTakeaways: [
        "Total ordering across an entire distributed cluster is physically impossible without a centralized bottleneck; Kafka guarantees total ordering **only within a partition**.",
        "Assigning partition keys by entity ID (`order_id`) guarantees all state mutations for that order arrive in strict chronological order.",
        "Beware **Partition Key Skew**: if a celebrity user (Elon Musk, Nike) generates 1,000x more events than other users, their partition becomes a hot spot, overwhelming a single consumer worker."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  PARTITION SKEW & CELEBRITY KEY MITIGATION             |
+-------------------------------------------------------------------------+
[Celebrity Hot Key: user_id=nike (1,000,000 events)]
  Naive Hashing: MurmurHash2("nike") % 4 ===> ALL 1M Events Hit Partition 2!
  (Partition 2 Lag Explodes; Consumer 2 Crashes with OOM!)

[Compound Salted Key Hashing Solution]
  Salted Key: "nike" + "_" + random(0..9)
  (Spreads Nike traffic across 10 partitions uniformly!)`,
      blockNodes: [
        { x: 50, y: 110, w: 260, h: 200, title: 'Event Producers', stroke: '#38bdf8', lines: ['Producers send event stream', 'Standard Key: order_id', 'Salted Key for hot users', 'Sequence number headers'], tag: 'Producers' },
        { x: 370, y: 110, w: 260, h: 200, title: 'Partition Distribution', stroke: '#10b981', lines: ['Uniform traffic distribution', 'Order mutations strictly sequenced', 'Hot celebrity keys salted', 'Eliminates partition starvation'], tag: 'Kafka Partitions' },
        { x: 690, y: 110, w: 260, h: 200, title: 'Consumer Reassembly', stroke: '#f59e0b', lines: ['Inspects sequence numbers', 'Local buffering window', 'Discards stale duplicate state', 'Updates read model'], tag: 'Consumers' }
      ],
      blockConns: [
        { d: 'M 310 210 L 370 210', lx: 340, ly: 200, label: 'Hash Key' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'Balance' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Key Assignment', stroke: '#38bdf8', lines: ['Choose partition key orderId', 'Attach monotonic sequence: 4', 'Guarantees order sequence'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Single Partition Log', stroke: '#10b981', lines: ['All order events hit partition 3', 'Appended strictly in order', 'Maintains causal history'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Consumer Ingestion', stroke: '#f59e0b', lines: ['Consumer reads sequential log', 'Applies state mutation', 'Checks sequence > lastSeen'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Skew Protection', stroke: '#a855f7', lines: ['If celebrity key detected:', 'Append random salt 0..9', 'Distributes load across fleet'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Key' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Append' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Process' }
      ],
      sections: [
        {
          heading: "How to Solve Celebrity Hot Partition Skew",
          body: "When you partition by customer ID, all events for a given customer route to the same partition. If a major enterprise client generates 100,000 events per minute while standard users generate 5, the partition assigned to that enterprise customer will experience catastrophic consumer lag while other partitions sit idle. To mitigate hot keys, implement Key Salting: identify hot entities and append a random suffix (`nike_0`, `nike_1`, ..., `nike_9`) to distribute the traffic across 10 partitions.",
          bullets: [
            "Idempotent Out-of-Order Rejection: In the consumer, store `last_processed_version`. If an event arrives with `version <= last_processed_version`, drop it immediately.",
            "Causal Consistency: Use vector clocks or monotonic database transaction IDs to order events when consumers aggregate across multiple partitions.",
            "Rebalancing Awareness: Remember that increasing partition count changes the hash modulus (`hash(key) % N`), routing subsequent events for an existing entity to a different partition."
          ]
        }
      ],
      tradeOffs: [
        { option: "Entity-Key Partitioning (orderId)", pros: "Guarantees strict FIFO ordering per entity, zero race conditions for that entity.", cons: "Subject to partition skew if single entities generate huge traffic spikes.", bestFor: "Transactional orders, user profiles, banking transactions." },
        { option: "Round-Robin / Random Partitioning", pros: "Perfect uniform load balancing across all broker nodes and consumers.", cons: "Zero ordering guarantees; events for the same order arrive out of order.", bestFor: "Stateless telemetry, clickstream analytics, metric collection." }
      ],
      interviewTip: "In Twitter or Instagram system design interviews, bring up the celebrity problem: 'Partitioning tweets by author ID will create hot partitions for celebrities like Cristiano Ronaldo. We will salt celebrity keys or route celebrity fan-outs to a separate read-path architecture.'"
    },
    {
      id: "change-data-capture",
      subtopicNumber: "5.5",
      title: "Change Data Capture (CDC) & Debezium Streaming",
      subtitle: "Tailing PostgreSQL write-ahead logs, MySQL binlogs, streaming database mutations, and zero-impact event sourcing.",
      readingTime: "7 min read",
      difficulty: "Advanced",
      accent: "#a855f7",
      keyTakeaways: [
        "Change Data Capture (CDC) streams row-level changes (INSERT, UPDATE, DELETE) directly from a database's transaction log (WAL / binlog) into Kafka.",
        "CDC requires zero changes to application code: developers write normal SQL transactions, and the CDC engine automatically extracts the stream.",
        "Use Debezium with Kafka Connect for low-latency ($t < 50ms$), high-throughput data replication without placing polling load on the database."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  CHANGE DATA CAPTURE (CDC) WITH DEBEZIUM                |
+-------------------------------------------------------------------------+
[Application] ---> [PostgreSQL Database Engine]
                         | (Normal SQL Commits)
                         v
             [Write-Ahead Log (WAL Disk)]
                         |
                         v (Logical Replication Slot)
             [Debezium / Kafka Connect Engine]
                         |
                         v (Streams JSON / Avro Row Deltas)
               [Apache Kafka Topic] (dbserver1.orders)`,
      blockNodes: [
        { x: 50, y: 110, w: 260, h: 200, title: 'Application & RDBMS', stroke: '#38bdf8', lines: ['App executes standard SQL', 'INSERT INTO orders', 'PostgreSQL / MySQL engine', 'Writes to WAL disk on commit'], tag: 'Database' },
        { x: 370, y: 110, w: 260, h: 200, title: 'Debezium CDC Connector', stroke: '#a855f7', lines: ['Kafka Connect Plugin', 'Connects via replication slot', 'Reads raw binary WAL stream', 'Zero SQL SELECT polling'], tag: 'CDC Engine' },
        { x: 690, y: 110, w: 260, h: 200, title: 'Streaming Downstream', stroke: '#10b981', lines: ['Kafka Topic: db.orders', 'Elasticsearch Search Index', 'Snowflake Data Warehouse', 'Real-time microservice sync'], tag: 'Downstream Sync' }
      ],
      blockConns: [
        { d: 'M 310 210 L 370 210', lx: 340, ly: 200, label: 'Tails WAL' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'Publishes' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'SQL Mutation', stroke: '#38bdf8', lines: ['App updates row status', 'Postgres commits transaction', 'Appends binary record to WAL'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'WAL Capture', stroke: '#a855f7', lines: ['Debezium reads replication slot', 'Decodes binary delta into DTO', 'Captures before and after values'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Kafka Publishing', stroke: '#10b981', lines: ['Emits record to Kafka topic', 'Key = primary key of row', 'Partition ordering maintained'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Search Index Sync', stroke: '#f59e0b', lines: ['Elasticsearch consumer updates', 'Search index fresh within 50ms', 'Zero application code changes'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Commit' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Capture' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Index' }
      ],
      sections: [
        {
          heading: "How CDC Revolutionizes Cache Invalidation and Search Indexing",
          body: "Keeping a cache (Redis) or search engine (Elasticsearch) in sync with a primary relational database has historically been error-prone. When developers manually write dual-writes (`db.save(); redis.set()`), crashes cause the cache to drift out of sync. With CDC, the database itself is the event source. Debezium reads the WAL directly. If the database crashes, it rolls back; if it commits, Debezium streams the exact diff. Cache invalidation workers consume the CDC stream and update Redis with 100% mathematical fidelity.",
          bullets: [
            "Zero Application Overhead: Legacy codebases can be turned into event-driven systems without modifying a single line of application source code.",
            "Before/After Payloads: Debezium events contain both the old row values and new row values, enabling rich audit logging.",
            "Replication Slot Monitoring: Monitor PostgreSQL `pg_replication_slots`. If Kafka Connect stops consuming, the WAL disk on the database can fill up!"
          ]
        }
      ],
      tradeOffs: [
        { option: "Change Data Capture (Debezium)", pros: "Zero application code changes, impossible to miss an event, sub-50ms latency, zero polling query load.", cons: "Requires Kafka Connect infrastructure; unconsumed replication slots can exhaust database disk.", bestFor: "Cache invalidation, CQRS search indexing, data warehouse ingestion." },
        { option: "Scheduled Polling (SELECT WHERE updated_at > t)", pros: "Simple to write in a cron job.", cons: "High database CPU consumption; misses deletes; latency bound by polling interval.", bestFor: "Simple batch ETL jobs only." }
      ],
      interviewTip: "When asked 'How do we keep our Elasticsearch search index in sync with PostgreSQL?', recommend: 'We will use Change Data Capture with Debezium tailing PostgreSQL's Write-Ahead Log. This guarantees real-time synchronization without dual-write inconsistencies or polling load on the database.'"
    }
  ]
};

module.exports = {
  MODULE_5_EVENTS
};
