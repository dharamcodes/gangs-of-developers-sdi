/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const MODULE_5_EVENTS = {
  id: "event-driven-messaging",
  topicNumber: 5,
  title: "5. Event-Driven Architecture & Messaging",
  description: "Asynchronous backbones: Dead Letter Queues, Kafka partitioning topology, Event Sourcing, monotonic ordering, and Change Data Capture (CDC).",
  subtopics: [
    {
      id: "dead-letter-queues",
      subtopicNumber: "5.1",
      title: "Dead Letter Queues (DLQ) & Poison Pill Handling",
      subtitle: "Isolating corrupt payloads, preventing consumer crash loops, and implementing automated replay pipelines.",
      readingTime: "8 min read",
      difficulty: "Intermediate",
      accent: "#ef4444",
      keyTakeaways: [
        "A Poison Pill is a malformed or unparseable message that crashes a consumer every time it attempts to process it, halting the entire partition.",
        "A Dead Letter Queue (DLQ) isolates unprocessable messages after a maximum retry threshold (e.g. 3 attempts), allowing the primary consumer loop to continue.",
        "Include diagnostic metadata in the DLQ message header: original topic, retry count, failure stack trace, and timestamp.",
        "Build automated replay tooling: once a bug is fixed, operators can replay messages from the DLQ back into the primary processing pipeline."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  DEAD LETTER QUEUE (DLQ) RECOVERY PIPELINE              |
+-------------------------------------------------------------------------+
[Primary Kafka Topic] ---> [Consumer Worker] ===(3 Failed Retries)===> [DLQ Topic]
                                 |                                         |
                       (Processes Next Message)                            v
                                                                   [SRE Alert & Bugfix]
                                                                           |
                                                                   [Replay Tool / CLI]
                                                                           |
                                            +------------------------------+
                                            v
                               [Re-injected into Primary Topic]`,
      blockNodes: [
        { x: 50, y: 120, w: 250, h: 180, title: 'Primary Kafka Topic', stroke: '#38bdf8', lines: ['Inbound stream of events', 'Order events / User signups', 'Strict partition sequence', 'Blocked if consumer crashes'], tag: 'Active Stream' },
        { x: 360, y: 100, w: 270, h: 220, title: 'Resilient Consumer', stroke: '#10b981', lines: ['Deserializes & validates', 'Catches fatal exceptions', 'Retries 3x with backoff', 'Reroutes poison pill to DLQ', 'Commits primary offset'], tag: 'Protected Worker' },
        { x: 690, y: 120, w: 250, h: 180, title: 'Dead Letter Queue (DLQ)', stroke: '#ef4444', lines: ['Isolated quarantine topic', 'Stores error stack trace', 'Alerts on-call engineers', 'Replay CLI inspection'], tag: 'Quarantine Buffer' }
      ],
      blockConns: [
        { d: 'M 300 210 L 360 210', lx: 330, ly: 200, label: 'Poll' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'Quarantine', stroke: '#ef4444' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Poison Pill Hits', stroke: '#38bdf8', lines: ['Malformed JSON received', 'Missing required user_id', 'Throws unhandled exception'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Bounded Retries', stroke: '#f59e0b', lines: ['Retries attempt 1 & 2', 'Exhausts max retry budget', 'Identified as non-transient'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'DLQ Diversion', stroke: '#ef4444', lines: ['Publishes to orders.dlq', 'Attaches X-Error-Cause', 'Commits primary Kafka offset'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Stream Advances', stroke: '#10b981', lines: ['Consumer unblocked', 'Processes remaining 9,999 msgs', 'Zero partition starvation'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Fail' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Route' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Resume' }
      ],
      sections: [
        {
          heading: "1. The Poison Pill Catastrophe in Streaming Queues",
          body: "In message streaming architectures like Apache Kafka or AWS SQS, messages in a partition are processed sequentially. If a publisher emits a corrupted message (e.g. invalid JSON syntax, schema mismatch, or integer overflow), the consumer throws an exception during deserialization. In a naive consumer loop, the error causes the consumer to abort without committing its offset. On the next poll, Kafka redelivers the exact same corrupted message! The consumer enters an infinite crash loop, consumer lag skyrockets, and all legitimate messages queued behind the poison pill are permanently stalled. A Dead Letter Queue (DLQ) is the essential quarantine circuit breaker.",
          bullets: [
            "Partition Stalling: A single poison pill message stops processing for thousands of customers assigned to that partition.",
            "Poison Pill Categories: Schema violations, corrupt binary encodings, negative numerical values violating domain rules, and expired tokens.",
            "Offset Advancement: Moving a poison pill to a DLQ allows the consumer to advance its offset, unblocking the entire streaming pipeline."
          ]
        },
        {
          heading: "2. The DLQ Envelope: Diagnostic Metadata Capture",
          body: "When redirecting a failed message to a Dead Letter Queue, you must never dump raw bytes without context. Debugging requires capturing the full operational execution environment at the moment of failure.",
          bullets: [
            "Header Enrichment: Inject `X-Original-Topic`, `X-Exception-Message`, `X-Exception-Class`, `X-Failed-At`, and `X-Retry-Count` into the message headers.",
            "Alerting Thresholds: A single DLQ message triggers a warning; a sudden spike of 50 DLQ messages indicates a breaking schema change deployment and must page on-call SREs.",
            "DLQ Retention: Configure a generous retention period (e.g. 14 days) on the DLQ topic to allow engineers time to deploy bugfixes before messages expire."
          ]
        },
        {
          heading: "3. Replay Architectures: Safe Drainage and Reprocessing",
          body: "A DLQ is useless if messages go there to die. The mark of mature engineering is automated Replay Pipelines.",
          bullets: [
            "Replay CLI / Service: A dedicated utility that consumes from the DLQ topic and republishes messages back into the primary topic or a specialized staging retry queue.",
            "Fix Forward: Deploy the consumer bugfix or schema update BEFORE initiating DLQ replay, otherwise replayed messages will fail again and cycle back to the DLQ.",
            "Idempotency Safeguard: Because replayed messages were generated in the past, downstream consumers must handle them idempotently without executing duplicate business actions."
          ]
        },
        {
          heading: "4. Production Blueprint: Spring Kafka / Go DLQ Error Handler",
          body: "The following Go snippet illustrates a production consumer error handling loop that captures unprocessable messages and routes them to a Dead Letter Queue with diagnostic metadata.",
          bullets: [
            "Max Retry Counter: Tracks execution attempts before triggering the DLQ fallback.",
            "Header Context Injection: Attaches failure causes directly to Kafka headers for SRE triage."
          ],
          codeSnippet: {
            title: "Go Kafka Consumer with Poison Pill DLQ Routing",
            code: `package consumer\n\nimport (\n    "context"\n    "time"\n    "github.com/segmentio/kafka-go"\n)\n\ntype ResilientConsumer struct {\n    reader *kafka.Reader\n    dlqWriter *kafka.Writer\n}\n\nfunc (c *ResilientConsumer) ProcessMessage(ctx context.Context, msg kafka.Message) {\n    const maxRetries = 3\n    var err error\n\n    for attempt := 1; attempt <= maxRetries; attempt++ {\n        err = executeBusinessLogic(msg.Value)\n        if err == nil {\n            c.reader.CommitMessages(ctx, msg)\n            return\n        }\n        time.Sleep(time.Duration(attempt * 100) * time.Millisecond)\n    }\n\n    // Retries exhausted: Route Poison Pill to DLQ\n    dlqMsg := kafka.Message{\n        Key:   msg.Key,\n        Value: msg.Value,\n        Headers: []kafka.Header{\n            {Key: "X-Original-Topic", Value: []byte(msg.Topic)},\n            {Key: "X-Error-Message", Value: []byte(err.Error())},\n            {Key: "X-Failed-Timestamp", Value: []byte(time.Now().Format(time.RFC3339))},\n        },\n    }\n    c.dlqWriter.WriteMessages(ctx, dlqMsg)\n    c.reader.CommitMessages(ctx, msg) // Advance primary partition offset!\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Dead Letter Queue (DLQ) Architecture", pros: "Prevents consumer crash loops; unblocks legitimate traffic; provides durable buffer for diagnostic triage; enables replay.", cons: "Requires monitoring and alerting infrastructure; messages are processed out of chronological order upon replay.", bestFor: "All asynchronous message streaming and event-driven architectures." },
        { option: "Crash & Block (No DLQ)", pros: "Strictly prevents any out-of-order processing.", cons: "A single corrupted message brings down the entire processing partition, causing catastrophic customer backlog.", bestFor: "Never acceptable in high-throughput microservices." },
        { option: "Silent Drop (Discard Errors)", pros: "Simple to write in code.", cons: "Permanent data loss with zero visibility; impossible to recover lost customer orders.", bestFor: "Non-critical ephemeral telemetry (e.g. mouse cursor movements)." }
      ],
      interviewTip: "In event-driven system design interviews, proactively address poison pills: 'If a consumer receives a corrupted message that fails deserialization, retrying indefinitely would stall the entire Kafka partition. I implement a Dead Letter Queue (DLQ). After 3 failed attempts, we enrich the message with error headers, write it to orders.dlq, and advance the partition offset. This preserves 99.99% pipeline throughput while alerting SREs to investigate the quarantined payload.'"
    },
    {
      id: "kafka-partitions",
      subtopicNumber: "5.2",
      title: "Apache Kafka Partitioning & Consumer Groups",
      subtitle: "Partition keys, topic parallelism, consumer group rebalancing, and consumer lag monitoring.",
      readingTime: "9 min read",
      difficulty: "Advanced",
      accent: "#f59e0b",
      keyTakeaways: [
        "A Kafka topic is divided into Partitions: the fundamental unit of parallelism, storage, and scalability in Apache Kafka.",
        "Kafka guarantees strict monotonic message ordering ONLY within a single partition, never globally across different partitions.",
        "Consumer Group Coordination: Each partition is assigned to exactly one consumer instance within a consumer group; adding more consumers than partitions leaves excess consumers idle.",
        "Hot Partition Skew: An uneven partition key distribution (e.g. partitioning by country code where 'US' receives 80% of events) bottlenecks single workers."
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
        { x: 690, y: 110, w: 260, h: 200, title: 'Consumer Group (Workers)', stroke: '#10b981', lines: ['Worker 1 -> Partition 0', 'Worker 2 -> Partition 1', 'Worker 3 -> Partition 2', 'Worker 4 -> Partition 3'], tag: 'Scale Out' }
      ],
      blockConns: [
        { d: 'M 310 210 L 370 210', lx: 340, ly: 200, label: 'Hash Key' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'Pull Stream' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Key Hashing', stroke: '#38bdf8', lines: ['Producer hashes partition key', 'Calculates target partition', 'Batches records for efficiency'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Append to Log', stroke: '#f59e0b', lines: ['Appends to partition commit log', 'Replicates to ISR quorum', 'Assigns sequential offset'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Group Assignment', stroke: '#10b981', lines: ['Cooperative sticky assignor', 'Distributes partitions to pods', 'Handles auto-rebalances'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Lag Monitor', stroke: '#a855f7', lines: ['Measures Log End - Offset', 'Alerts when lag spikes', 'Triggers pod horizontal scale'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Hash' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Replicate' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Assign' }
      ],
      sections: [
        {
          heading: "1. The Partition as the Atomic Unit of Parallelism",
          body: "In traditional message queues (like RabbitMQ or ActiveMQ), multiple consumers compete for messages from a single queue. While simple, competing consumers require central coordination locks inside the broker, capping maximum throughput. Apache Kafka discarded this paradigm by introducing Partitions. A partition is an immutable, ordered commit log stored on disk. By splitting a topic into 16, 64, or 256 partitions distributed across different broker nodes, Kafka achieves massive horizontal throughput (millions of events per second) because producers and consumers write and read to separate files in parallel.",
          bullets: [
            "Ordering Guarantee: Strict sequential ordering is guaranteed ONLY within a single partition. If Order 1 and Order 2 land in different partitions, they may be processed out of order.",
            "Consumer Concurrency Ceiling: The number of active consumers in a consumer group cannot exceed the number of partitions. If a topic has 10 partitions, running 15 pods in your consumer group means 5 pods sit completely idle.",
            "Partition Sizing Rule of Thumb: Aim for 10–50MB/sec write throughput per partition; avoid having more than 4,000 partitions per broker to prevent JVM heap overhead."
          ]
        },
        {
          heading: "2. The Art of Choosing the Partition Key: Avoiding Key Skew",
          body: "When producing a message to Kafka, the producer calculates the target partition using: $$\\text{Partition} = \\text{MurmurHash2}(\\text{Key}) \\pmod{\\text{Number\\_of\\_Partitions}}$$. Choosing the correct partition key is the most critical decision in event-driven design.",
          bullets: [
            "Entity Key (`order_id` or `user_id`): Guarantees that all events for that specific user or order land in the exact same partition in strict chronological order.",
            "Hot Key Anti-Pattern: If you partition by `merchant_id` or `country_code`, a celebrity merchant (e.g. Nike) or large country (e.g. US) will route 70% of total cluster traffic to a single partition, creating massive consumer lag on one pod while other pods idle.",
            "Salted Partition Keys: If a hot key is unavoidable, append a random integer (`merchant_123_4`) to distribute traffic across 5 partitions, recombining them in application logic."
          ]
        },
        {
          heading: "3. Consumer Rebalances: Stop-the-World vs Cooperative Sticky",
          body: "When a consumer pod crashes or an auto-scaler adds a new pod, Kafka executes a Consumer Group Rebalance to redistribute partition assignments.",
          bullets: [
            "Eager Rebalance (Legacy): Revokes all partition assignments across all consumers simultaneously, freezing processing for 5–30 seconds ('Stop-the-World' rebalance).",
            "Cooperative Sticky Assignor (Modern Standard): Incremental rebalancing. Only the specific partitions being moved are paused; all other consumers continue processing traffic uninterrupted."
          ]
        },
        {
          heading: "4. Production Blueprint: Kafka Producer with MurmurHash Keying in Java",
          body: "The following Java snippet demonstrates a production Kafka producer configuration with idempotency enabled, snappy compression, and explicit partition key assignment.",
          bullets: [
            "Idempotent Producer (`enable.idempotence=true`): Prevents duplicate broker writes on network retries.",
            "Snappy Compression: Cuts network bandwidth and disk storage by up to 60%."
          ],
          codeSnippet: {
            title: "Production Idempotent Kafka Producer Configuration in Java",
            code: `Properties props = new Properties();\nprops.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka-broker.internal:9092");\nprops.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());\nprops.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, ByteArraySerializer.class.getName());\n\n// Enterprise Reliability Settings\nprops.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, "true");\nprops.put(ProducerConfig.ACKS_CONFIG, "all"); // Wait for full in-sync replica ack\nprops.put(ProducerConfig.RETRIES_CONFIG, Integer.MAX_VALUE);\nprops.put(ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION, "5");\nprops.put(ProducerConfig.COMPRESSION_TYPE_CONFIG, "snappy");\n\nProducer<String, byte[]> producer = new KafkaProducer<>(props);\n\n// Partition key guarantees all events for this user land in same partition\nProducerRecord<String, byte[]> record = new ProducerRecord<>(\n    "orders.v1",\n    order.getUserId(), // Key used for MurmurHash2 partition routing\n    serializeToAvro(order)\n);\nproducer.send(record);`
          }
        }
      ],
      tradeOffs: [
        { option: "Keyed Partitioning (Entity Key)", pros: "Strict chronological message ordering per entity (e.g. per user or per order).", cons: "Vulnerable to hot key data skew if key distribution is non-uniform.", bestFor: "Workflows where order matters (financial transactions, state machines)." },
        { option: "Round-Robin / Sticky Partitioning (Null Key)", pros: "Perfect uniform load distribution across all partitions and consumer pods; zero hot key risk.", cons: "Zero ordering guarantees; events for the same order arrive out of order.", bestFor: "Independent stateless events (e.g. log ingestion, clickstream metrics)." },
        { option: "Salted Key Partitioning", pros: "Breaks up hot keys across multiple partitions while maintaining sub-key locality.", cons: "Downstream consumers must coordinate to merge salted partitions.", bestFor: "Mega-scale entities (e.g. viral celebrity posts on social media)." }
      ],
      interviewTip: "In interviews, demonstrate deep Kafka internals: 'I size our Kafka topics based on consumer concurrency requirements. Since Kafka enforces that one partition is consumed by only one consumer in a group, our partition count defines our maximum horizontal scaling ceiling. I partition by customer_id to guarantee in-order delivery per customer, while monitoring Consumer Lag (Log End Offset minus Current Offset) via Prometheus to trigger horizontal pod auto-scaling.'"
    },
    {
      id: "event-driven-architecture",
      subtopicNumber: "5.3",
      title: "Event-Driven Architecture & Event Sourcing",
      subtitle: "Event notifications vs event-carried state transfer, append-only immutable event stores, and temporal query reconstruction.",
      readingTime: "9 min read",
      difficulty: "Advanced",
      accent: "#8b5cf6",
      keyTakeaways: [
        "In Event Notification, producers emit minimal signals (`OrderPlaced: id=123`); consumers must call back via RPC to fetch details, creating query storms.",
        "In Event-Carried State Transfer (ECST), events include full state payloads, allowing consumers to update local read models without back-and-forth RPCs.",
        "In Event Sourcing, state is not stored as mutable rows; the sequence of immutable domain events is the authoritative source of truth.",
        "Event Sourcing provides native audit trails, time-travel debugging, and allows rebuilding read views at any point in history."
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
          heading: "1. Event Taxonomy: Notification vs Event-Carried State Transfer",
          body: "In Event-Driven Architecture (EDA), there are distinct patterns of communication:\n1. Event Notification: A producer emits a lightweight signal: `{ event: 'OrderCreated', orderId: '123' }`. Problem: When 10 downstream services receive this event, each makes a synchronous HTTP/gRPC call back to Order Service to fetch line items, creating a 10x query storm!\n2. Event-Carried State Transfer (ECST): The event payload contains all relevant data: customer name, line items, shipping address. Downstream consumers consume the data and store local copies in their own databases. They achieve 100% runtime autonomy without query callbacks.\n3. Domain Events: Formally signify a state transition within a Bounded Context, expressed in past tense (`OrderShipped`, `PaymentDeclined`).",
          bullets: [
            "Autonomy via ECST: Downstream services operate even if the origin Order Service is offline.",
            "Schema Versioning: Use Avro or Protobuf with a Schema Registry (Confluent / AWS Glue) to prevent breaking downstream consumers as schemas evolve."
          ]
        },
        {
          heading: "2. The Event Sourcing Pattern: The Log is the Truth",
          body: "In traditional CRUD databases, data is stored as mutable records: when an order status changes, an `UPDATE orders SET status = 'CANCELLED'` query overwrites the previous status, destroying historical context. In Event Sourcing (originated in accounting ledgers), state is never updated or deleted. Instead, the application appends immutable events to an append-only Event Store. Current state is reconstructed on-the-fly by replaying the event stream from genesis.",
          bullets: [
            "Complete Audit Trail: Native regulatory compliance; answers not just what the current state is, but exactly how, when, and why it reached that state.",
            "Time Travel Debugging: You can reconstruct the exact state of the system on March 15th at 14:02 UTC to reproduce a bug.",
            "Snapshots: For aggregates with thousands of events, persist periodic snapshots (e.g. every 100 events) so rehydration requires reading only the latest snapshot plus subsequent events."
          ]
        },
        {
          heading: "3. Operational Challenges: Long-Term Event Evolution",
          body: "Event Sourcing introduces unique long-term operational challenges that require careful architecture:",
          bullets: [
            "Schema Evolution Over Decades: An event emitted 5 years ago cannot be deleted. If class structures change, you must implement Upcasters (middleware that transforms old V1 events into V2 schemas during replay).",
            "GDPR Compliance ('Right to be Forgotten'): In an immutable append-only event store, deleting a customer's personal data is legally required. Solution: Crypto-Shredding (encrypt personal data with a per-user key; deleting the key renders the immutable event payload permanently unreadable)."
          ]
        },
        {
          heading: "4. Production Blueprint: Event Sourcing Aggregate in TypeScript",
          body: "The following TypeScript snippet demonstrates an Event Sourced Order aggregate hydrating state by replaying an array of domain events.",
          bullets: [
            "Apply State Transitions: Evaluates domain events sequentially to compute current state.",
            "Immutable State: State is never mutated directly without generating an event."
          ],
          codeSnippet: {
            title: "Event Sourced Aggregate Rehydration in TypeScript",
            code: `export interface DomainEvent {\n  type: string;\n  occurredAt: string;\n  payload: any;\n}\n\nexport class OrderAggregate {\n  id: string = '';\n  status: string = 'CREATED';\n  totalCents: number = 0;\n  version: number = 0;\n\n  // Rehydrate state from event history\n  static fromHistory(events: DomainEvent[]): OrderAggregate {\n    const aggregate = new OrderAggregate();\n    for (const event of events) {\n      aggregate.apply(event);\n      aggregate.version++;\n    }\n    return aggregate;\n  }\n\n  private apply(event: DomainEvent): void {\n    switch (event.type) {\n      case 'OrderCreated':\n        this.id = event.payload.orderId;\n        this.totalCents = event.payload.totalCents;\n        this.status = 'PENDING';\n        break;\n      case 'OrderPaid':\n        this.status = 'PAID';\n        break;\n      case 'OrderCancelled':\n        this.status = 'CANCELLED';\n        break;\n    }\n  }\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Event-Carried State Transfer (ECST)", pros: "Total consumer autonomy; eliminates query storms; enables decoupled asynchronous microservices.", cons: "Larger message payload sizes; potential data duplication across service databases.", bestFor: "Standard asynchronous enterprise microservices." },
        { option: "Event Sourcing", pros: "100% immutable audit ledger; temporal time-travel debugging; eliminates write-lock contention.", cons: "High cognitive complexity; difficult schema migrations; requires CQRS to query data.", bestFor: "Banking ledgers, financial accounting, supply chain logistics." },
        { option: "Event Notification", pros: "Lightweight minimal message sizes; zero data duplication.", cons: "Triggers massive query storms back to origin service; temporal coupling.", bestFor: "Low-frequency alerts or notifications where payload details are rarely needed." }
      ],
      interviewTip: "In interviews, distinguish between Event Notification and Event-Carried State Transfer: 'I advocate for Event-Carried State Transfer (ECST). Rather than sending a bare ID that forces 10 downstream consumers to execute synchronous callback queries, we package all necessary domain attributes in the event. This empowers downstream services to update their read models with zero runtime coupling.'"
    },
    {
      id: "event-ordering",
      subtopicNumber: "5.4",
      title: "Distributed Event Ordering & Key Skew Mitigation",
      subtitle: "Preserving monotonic ordering across partitions, mitigating hot key skew, and handling out-of-order deliveries.",
      readingTime: "8 min read",
      difficulty: "Advanced",
      accent: "#ec4899",
      keyTakeaways: [
        "In distributed streaming, physical clocks cannot be trusted (NTP clock drift); event ordering must rely on logical sequence numbers or monotonic offsets.",
        "Kafka guarantees ordering within a partition, but network retries or consumer group rebalances can cause consumers to process messages out of order.",
        "Key Skew occurs when a popular entity (e.g. celebrity account or Black Friday merchant) receives 100x more traffic than others, overloading a single partition.",
        "Defensive consumer design: Check monotonic version numbers and reject or buffer events that arrive out of chronological sequence."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  OUT-OF-ORDER EVENT MITIGATION PATTERN                  |
+-------------------------------------------------------------------------+
[Kafka Stream: Partition 0] ---> [Consumer Pod]
Events arrive:
#1: OrderCreated    (Version: 1) ===> Processed! (Current DB Version: 1)
#3: OrderShipped    (Version: 3) ===> OUT OF ORDER! (Version 2 Missing!)
                                       |
                                       +---> [Local Buffer / Redis Delay Set]
                                             (Waits for Version 2)
                                       |
#2: OrderPaid       (Version: 2) ===> Processed! (Current DB Version: 2)
                                       |
                                       +---> Flushes Version 3 from Buffer!
                                             (Processed! Current DB Version: 3)`,
      blockNodes: [
        { x: 50, y: 120, w: 250, h: 180, title: 'Out-of-Order Events', stroke: '#ef4444', lines: ['Kafka network retry delay', 'Version 3 arrives before 2', 'Risk: Invalid state transition', 'Payment marked after ship'], tag: 'Hazard' },
        { x: 360, y: 100, w: 270, h: 220, title: 'Reordering Buffer', stroke: '#10b981', lines: ['Checks current DB version', 'Buffers version > current + 1', 'Redis sorted set storage', 'Releases when gap closes', 'Guarantees monotonic order'], tag: 'Sequence Guard' },
        { x: 690, y: 120, w: 250, h: 180, title: 'Consistent State', stroke: '#38bdf8', lines: ['OrderCreated (v1) -> OK', 'OrderPaid (v2) -> OK', 'OrderShipped (v3) -> OK', 'Zero state corruption'], tag: 'Protected Aggregate' }
      ],
      blockConns: [
        { d: 'M 300 210 L 360 210', lx: 330, ly: 200, label: 'Inspect' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'In-Order' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Event Arrives', stroke: '#38bdf8', lines: ['Event version = 3', 'Current entity version = 1', 'Gap detected: v2 missing'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Buffer in Redis', stroke: '#f59e0b', lines: ['Store v3 in Redis sorted set', 'Set TTL = 60 seconds', 'Do not commit primary state'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Missing v2 Ingest', stroke: '#10b981', lines: ['Delayed v2 arrives on wire', 'Entity state advances to v2', 'Triggers buffer drain'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Drain Buffer', stroke: '#a855f7', lines: ['Pulls v3 from Redis buffer', 'Applies state mutation to v3', 'All invariants preserved'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Detect Gap' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Catch Up' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Drain' }
      ],
      sections: [
        {
          heading: "1. The Fallacy of Global Ordering in Distributed Systems",
          body: "A foundational law of distributed computing is that global total ordering across independent machines is impossible without a centralized bottleneck sequencer. While Kafka provides total ordering within a single partition, real-world systems experience out-of-order event arrivals due to network retries, parallel processing threads, and consumer rebalancing. If `OrderCancelled` arrives before `OrderCreated`, a consumer that blindly executes updates will create corrupted state.",
          bullets: [
            "Logical Monotonic Sequence Numbers: Every event for an aggregate must carry an incrementing version integer (Version 1, 2, 3) rather than relying on system wall-clock timestamps.",
            "Producer Idempotence: Ensure producer configuration `max.in.flight.requests.per.connection=5` is paired with `enable.idempotence=true` to prevent in-flight retry reordering in Kafka."
          ]
        },
        {
          heading: "2. Mitigating Hot Key Partition Skew",
          body: "When you partition Kafka events by entity ID (e.g. `merchant_id`), you risk Key Skew. A high-volume merchant (e.g. Amazon or Apple) can generate 1,000x more events than other merchants, causing that single partition's consumer pod to experience massive lag while other pods sit idle.",
          bullets: [
            "Compound Partition Keys: Instead of `merchant_id`, partition by `merchant_id + '_' + (order_id % 4)`. This spreads the high-volume merchant across 4 partitions.",
            "Dedicated Topics for VIPs: Route massive tenants to a dedicated high-capacity topic with higher partition counts."
          ]
        },
        {
          heading: "3. Consumer-Side Reordering Buffer Pattern",
          body: "When events arrive out of order, defensive consumers implement the Reordering Buffer pattern:",
          bullets: [
            "Version Inspection: If incoming event version is greater than `current_version + 1`, place the event into a Redis sorted set buffer with a short TTL.",
            "Buffer Drain: When the missing event arrives and processes successfully, poll the buffer and apply subsequent versions in order."
          ]
        },
        {
          heading: "4. Production Blueprint: Version-Aware Event Handler in TypeScript",
          body: "The following TypeScript snippet demonstrates a version-checking consumer that detects sequence gaps and buffers out-of-order events.",
          bullets: [
            "Sequence Gap Detection: Identifies missing intermediate versions.",
            "Redis Sorted Set Buffer: Buffers future events until the gap is closed."
          ],
          codeSnippet: {
            title: "Out-of-Order Sequence Buffer in TypeScript",
            code: `export async function handleVersionedEvent(\n  event: { aggregateId: string; version: number; payload: any },\n  db: any,\n  redis: any\n) {\n  const currentVersion = await db.getVersion(event.aggregateId);\n\n  // Case 1: Exact expected next version\n  if (event.version === currentVersion + 1) {\n    await db.applyMutation(event.aggregateId, event.payload, event.version);\n    await drainBufferedEvents(event.aggregateId, event.version, db, redis);\n    return;\n  }\n\n  // Case 2: Stale duplicate event (already processed)\n  if (event.version <= currentVersion) {\n    console.warn(\`Ignoring stale event v\${event.version} (current: v\${currentVersion})\`);\n    return;\n  }\n\n  // Case 3: Future event (Gap detected! Buffer in Redis)\n  console.warn(\`Gap detected! Received v\${event.version}, expected v\${currentVersion + 1}. Buffering...\`);\n  await redis.zadd(\n    \`buffer:\${event.aggregateId}\`,\n    event.version,\n    JSON.stringify(event)\n  );\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Consumer Sequence Reordering Buffer", pros: "Guarantees state machine correctness; prevents out-of-order state corruption.", cons: "Adds Redis buffer complexity; potential memory pressure if missing event is lost forever.", bestFor: "Strict state machines (order lifecycles, account balances)." },
        { option: "Strict Single Partition per Tenant", pros: "Native Kafka in-order delivery; zero application buffer code.", cons: "Vulnerable to hot key skew; maximum consumer concurrency capped at 1.", bestFor: "Low-throughput entities." },
        { option: "Commutative Data Modeling (CRDTs)", pros: "Operations can be applied in any order without changing final state ($A + B = B + A$).", cons: "Mathematically difficult to model for complex business rules.", bestFor: "Counters, collaborative editing, shopping cart item additions." }
      ],
      interviewTip: "In interviews, address out-of-order events with engineering rigor: 'Because network retries can cause events to arrive out of chronological order, I attach monotonic version numbers to each domain event. The consumer checks the entity version in the database; if a gap is detected, it buffers the future event in a Redis sorted set until the intermediate event arrives, guaranteeing state machine consistency.'"
    },
    {
      id: "change-data-capture",
      subtopicNumber: "5.5",
      title: "Change Data Capture (CDC) & Debezium Streaming",
      subtitle: "Streaming real-time database transaction logs (WAL/binlog) to Kafka without application code modifications.",
      readingTime: "9 min read",
      difficulty: "Advanced",
      accent: "#10b981",
      keyTakeaways: [
        "Change Data Capture (CDC) observes and extracts row-level changes from a database's Write-Ahead Log (PostgreSQL WAL or MySQL binlog) in real-time.",
        "Zero Application Code Overhead: CDC runs as a database replication listener (Debezium); application developers write standard SQL queries without event-publishing code.",
        "Guarantees that every single committed database mutation is captured with zero dual-write risk.",
        "Ideal for streaming database changes to search indexes (Elasticsearch), analytics caches (Redis), and data warehouses (Snowflake)."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  CHANGE DATA CAPTURE (CDC) WITH DEBEZIUM                |
+-------------------------------------------------------------------------+
[Application Service] ---> INSERT/UPDATE ---> [PostgreSQL Database Engine]
                                                        |
                                                        v
                                          [Write-Ahead Log: WAL on Disk]
                                                        |
                                                        | (Logical Replication)
                                                        v
                                            [Debezium Connector Engine]
                                                        |
                                                        | (Publishes Avro/JSON)
                                                        v
                                                  [Apache Kafka]
                                                        |
                                                        v
                                      [Downstream Materialized Views]
                                      - Elasticsearch (Search)
                                      - Redis (Fast Cache)
                                      - Snowflake (Data Warehouse)`,
      blockNodes: [
        { x: 50, y: 120, w: 250, h: 180, title: 'Application & DB', stroke: '#38bdf8', lines: ['Standard SQL queries', 'PostgreSQL / MySQL engine', 'Write-Ahead Log (WAL)', 'Zero event-code boilerplate'], tag: 'Origin DB' },
        { x: 360, y: 100, w: 270, h: 220, title: 'Debezium CDC Engine', stroke: '#10b981', lines: ['Logical replication client', 'Tails WAL in sub-milliseconds', 'Captures INSERT, UPDATE, DELETE', 'Emits before/after state', 'Fault-tolerant offset tracking'], tag: 'Log Miner' },
        { x: 690, y: 120, w: 250, h: 180, title: 'Streaming Consumers', stroke: '#a855f7', lines: ['Elasticsearch search index', 'Redis distributed cache', 'Snowflake data warehouse', 'Fraud detection engine'], tag: 'Destinations' }
      ],
      blockConns: [
        { d: 'M 300 210 L 360 210', lx: 330, ly: 200, label: 'WAL Stream' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'To Kafka' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'SQL Mutation', stroke: '#38bdf8', lines: ['App executes SQL commit', 'Postgres writes to disk WAL', 'Transaction finalized'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'WAL Tailing', stroke: '#10b981', lines: ['Debezium reads replication slot', 'Decodes logical WAL frames', 'Extracts before and after rows'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Kafka Ingest', stroke: '#f59e0b', lines: ['Publishes to postgres.orders', 'Partitioned by primary key', 'Committed to Kafka broker'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'View Update', stroke: '#a855f7', lines: ['Elasticsearch sink consumes', 'Updates search index in <100ms', 'Cache invalidated'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Commit' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Decode' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Project' }
      ],
      sections: [
        {
          heading: "1. The Evolution of Data Synchronization: Why Dual-Writes and Polling Fail",
          body: "Synchronizing data from an operational database to downstream consumers (search engines, analytics warehouses, and caches) has historically suffered from flawed implementations. Application-level dual writes risk partial failures, while batch database polling (`SELECT WHERE updated_at > ?`) burns massive database CPU and cannot detect deleted rows (`DELETE` statements leave no updated timestamp). Change Data Capture (CDC) reads the database engine's internal transaction log (PostgreSQL WAL or MySQL binlog). Every create, update, and delete is captured automatically with zero impact on database query latency.",
          bullets: [
            "Log-Based CDC vs Query Polling: Log-based CDC consumes zero database read query CPU and captures deletes naturally.",
            "Sub-Millisecond Replication: Debezium streams transaction log events into Kafka within 50–200 milliseconds of database commit.",
            "Before-and-After Row State: Debezium payloads capture both the previous row values and the updated row values, enabling audit logging."
          ]
        },
        {
          heading: "2. Debezium Architecture: Replication Slots & Schema Evolution",
          body: "Debezium acts as a simulated database replica. In PostgreSQL, it leverages native Logical Decoding Output Plugins (`pgoutput`) via replication slots.",
          bullets: [
            "Replication Slot Safety: PostgreSQL preserves WAL files on disk until the Debezium replication slot acknowledges consumption. If Debezium is offline, WAL accumulates on disk; monitoring replication slot lag is critical to prevent database disk saturation.",
            "Initial Snapshotting: When booted against an existing database with millions of records, Debezium performs an initial table snapshot before switching seamlessly to tailing the live WAL stream."
          ]
        },
        {
          heading: "3. CDC Anti-Patterns: Leaking Internal Database Schemas",
          body: "The primary risk of CDC is coupling downstream services directly to internal database table schemas. If your CDC pipeline dumps raw SQL table rows into Kafka, renaming a database column breaks all downstream consumers.",
          bullets: [
            "Outbox SMT Pattern: Rather than streaming raw entity tables, combine CDC with the Transactional Outbox pattern. Debezium streams an explicit `outbox` table, transforming table rows into clean domain events using Single Message Transforms (SMT)."
          ]
        },
        {
          heading: "4. Production Blueprint: Debezium PostgreSQL Connector JSON",
          body: "The following configuration demonstrates a production Debezium PostgreSQL connector with Avro serialization and replication slot management.",
          bullets: [
            "Plugin Configuration: Configures `pgoutput` with snapshot mode.",
            "Avro Serialization: Pairs with Confluent Schema Registry for strict schema governance."
          ],
          codeSnippet: {
            title: "Production Debezium PostgreSQL Connector Configuration",
            code: `{\n  "name": "postgres-inventory-cdc",\n  "config": {\n    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",\n    "tasks.max": "1",\n    "plugin.name": "pgoutput",\n    "database.hostname": "db.production.internal",\n    "database.port": "5432",\n    "database.user": "cdc_debezium",\n    "database.password": "\${env:DB_CDC_PASSWORD}",\n    "database.dbname": "inventory_db",\n    "database.server.name": "inventory_cluster",\n    "table.include.list": "public.products,public.outbox_events",\n    "slot.name": "debezium_inventory_slot",\n    "publication.autocreate.mode": "filtered",\n    "decimal.handling.mode": "double",\n    "key.converter": "io.confluent.connect.avro.AvroConverter",\n    "key.converter.schema.registry.url": "http://schema-registry:8081",\n    "value.converter": "io.confluent.connect.avro.AvroConverter",\n    "value.converter.schema.registry.url": "http://schema-registry:8081"\n  }\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Log-Based CDC (Debezium + Kafka)", pros: "Zero application code; sub-100ms replication; captures deletes naturally; zero database query CPU overhead.", cons: "Requires Kafka Connect cluster; unmanaged replication slots can fill database disk if connector stalls.", bestFor: "Real-time cache invalidation, search index syncing, data warehouse streaming." },
        { option: "Application-Level Event Publishing", pros: "Full control over domain event schemas; no database WAL permissions needed.", cons: "Vulnerable to the dual-write problem unless paired with the Outbox pattern.", bestFor: "Standard microservices domain events." },
        { option: "Database Polling (SELECT WHERE updated_at)", pros: "Simple to write in a cron job.", cons: "Cannot capture hard deletes; high database query CPU; high replication latency (polling interval).", bestFor: "Legacy databases where WAL access is completely impossible." }
      ],
      interviewTip: "In interviews, bring up CDC when discussing cache invalidation or search syncing: 'Rather than having the application update both PostgreSQL and Elasticsearch in code (which risks dual-write inconsistency), I implement Change Data Capture using Debezium. Debezium tails the PostgreSQL Write-Ahead Log in sub-milliseconds, streaming committed changes to Kafka. An Elasticsearch sink consumes the stream, guaranteeing eventual consistency with zero impact on operational query latency.'"
    }
  ]
};

const MODULE_6_OPERATIONS = {
  id: "observability-operations",
  topicNumber: 6,
  title: "6. Observability, Security & Operations",
  description: "Operating distributed systems at scale: centralized logging, RED metrics, OpenTelemetry distributed tracing, Strangler Fig migration, and Zero-Trust mTLS security.",
  subtopics: [
    {
      id: "centralized-logging",
      subtopicNumber: "6.1",
      title: "Centralized Logging & Correlation IDs (MDC)",
      subtitle: "Injecting correlation IDs, Mapped Diagnostic Context (MDC), and structured JSON log pipelines.",
      readingTime: "8 min read",
      difficulty: "Intermediate",
      accent: "#38bdf8",
      keyTakeaways: [
        "In a microservices cluster with 50+ services, grepping local server log files is impossible; logs must be aggregated centrally in Elasticsearch, OpenSearch, or Grafana Loki.",
        "Correlation ID (X-Correlation-ID): A unique UUID assigned at the edge API gateway and propagated across every downstream HTTP and gRPC hop.",
        "Mapped Diagnostic Context (MDC): Thread-local storage in logging frameworks (Logback, Winston, Zap) that automatically stamps every log line with user_id, request_id, and trace_id.",
        "Structured JSON Logging: Emitting logs as machine-parseable JSON instead of raw text strings enables instant filtering and aggregations in log indexers."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  CORRELATION ID PROPAGATION & LOGGING                   |
+-------------------------------------------------------------------------+
[Client] ---> GET /checkout (X-Correlation-ID: 'corr_94a1-b842')
                 |
                 v
+----------------+--------------------------------------------------------+
| API Gateway: Logs [corr_94a1-b842] Ingress received                     |
|      |                                                                  |
|      v (Forward Header: X-Correlation-ID)                               |
| Order Svc:   Logs [corr_94a1-b842] Validating order aggregate           |
|      |                                                                  |
|      v (Forward Header: X-Correlation-ID)                               |
| Payment Svc: Logs [corr_94a1-b842] Charging credit card                 |
+----------------+--------------------------------------------------------+
                 |
                 v (Shipped to Centralized Log Cluster: Loki / Elastic)
[SRE Queries: 'correlationId == corr_94a1-b842' -> Views All 3 Logs Together!]`,
      blockNodes: [
        { x: 50, y: 120, w: 250, h: 180, title: 'Edge Ingress Stamp', stroke: '#38bdf8', lines: ['Generates Correlation ID', 'Injects X-Correlation-ID', 'Stores in MDC thread local', 'Attaches to all log lines'], tag: 'Origin Stamp' },
        { x: 360, y: 100, w: 270, h: 220, title: 'Structured Log Shipper', stroke: '#10b981', lines: ['Fluentbit / Vector agent', 'Pulls stdout JSON logs', 'Non-blocking async ship', 'Tags pod & namespace metadata', 'Buffers during network dips'], tag: 'Log Daemon' },
        { x: 690, y: 120, w: 250, h: 180, title: 'Central Storage', stroke: '#a855f7', lines: ['Elasticsearch / OpenSearch', 'Grafana Loki log index', 'Search by correlation ID', 'Instant multi-service trace'], tag: 'Central Query' }
      ],
      blockConns: [
        { d: 'M 300 210 L 360 210', lx: 330, ly: 200, label: 'JSON Out' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'Index' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Edge Header', stroke: '#38bdf8', lines: ['Gateway reads/creates UUID', 'Sets X-Correlation-ID header', 'Propagates over HTTP/gRPC'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'MDC Population', stroke: '#10b981', lines: ['Service extracts header', 'Puts into MDC thread context', 'Zap/Logback binds to logger'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Structured Emit', stroke: '#f59e0b', lines: ['Emits JSON to stdout', 'Includes level, timestamp, msg', 'Includes correlationId field'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Loki Indexing', stroke: '#a855f7', lines: ['DaemonSet ships to Loki', 'SRE searches correlationId', 'Full call sequence visualized'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Inject' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Log' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Query' }
      ],
      sections: [
        {
          heading: "1. The Needle in a Haystack: Why Microservices Require Centralized Logging",
          body: "In a monolithic architecture, debugging an error is straightforward: an engineer SSHs into the server or checks a single log file where stack traces are printed sequentially. In a microservices cluster with 50 services running across 300 Kubernetes pods, a single user checkout generates log entries scattered across 12 different machines. Without centralized logging and correlation identifiers, tracking down why a transaction failed requires guessing timestamps and manually correlating logs across multiple databases—a nearly impossible task during a production outage.",
          bullets: [
            "Correlation ID (`X-Correlation-ID`): A single unique UUID generated at the edge gateway that stays attached to the request across every downstream service hop.",
            "Mapped Diagnostic Context (MDC): Thread-local storage provided by logging frameworks that automatically enriches every log statement with context attributes without requiring developers to manually pass IDs into logger methods.",
            "Structured JSON Logging: Emitting logs in JSON format (`{ timestamp, level, correlation_id, message, service }`) enables log aggregators to index fields as queryable database columns."
          ]
        },
        {
          heading: "2. The Log Ingestion Pipeline: DaemonSets vs Direct App Push",
          body: "How do logs travel from application pods to the centralized Elasticsearch or Loki cluster?",
          bullets: [
            "Standard Out (`stdout`) DaemonSet (Industry Best Practice): Applications log to standard output. A lightweight log shipper (Fluent Bit, Vector, or Promtail) runs as a DaemonSet on each Kubernetes node, tailing container log files from disk and shipping them asynchronously. Advantage: Application performance is never blocked by log indexer network latency.",
            "Direct TCP Push (Anti-Pattern): Applications making direct network HTTP calls to Elasticsearch on every log statement. If the log server slows down, the entire application freezes."
          ]
        },
        {
          heading: "3. Log Sampling & PII Redaction",
          body: "Logging every debug statement at scale generates terabytes of data daily, driving up cloud storage bills and creating security risks.",
          bullets: [
            "Log Sampling: In production, log INFO and DEBUG statements at 1% sampling, while logging 100% of WARN and ERROR statements.",
            "PII Redaction: Credit card numbers, passwords, and sensitive tokens must be automatically masked at the logging framework level using regex patterns before hitting disk."
          ]
        },
        {
          heading: "4. Production Blueprint: Go Structured JSON Logger with MDC Middleware",
          body: "The following Go snippet illustrates structured logging using Uber Zap, extracting correlation IDs from HTTP headers and injecting them into context fields.",
          bullets: [
            "Uber Zap Structured Fields: Zero-allocation JSON logging.",
            "Context Middleware: Injects correlation ID into request context for downstream propagation."
          ],
          codeSnippet: {
            title: "Go Structured JSON Logging Middleware with Correlation ID",
            code: `package logging\n\nimport (\n    "net/http"\n    "github.com/google/uuid"\n    "go.uber.org/zap"\n)\n\nfunc CorrelationLoggingMiddleware(logger *zap.Logger, next http.Handler) http.Handler {\n    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        corrID := r.Header.Get("X-Correlation-ID")\n        if corrID == "" {\n            corrID = uuid.NewString()\n        }\n        w.Header().Set("X-Correlation-ID", corrID)\n\n        // Create request-scoped structured logger\n        reqLogger := logger.With(\n            zap.String("correlation_id", corrID),\n            zap.String("method", r.Method),\n            zap.String("path", r.URL.Path),\n        )\n\n        reqLogger.Info("Incoming HTTP request started")\n        next.ServeHTTP(w, r)\n        reqLogger.Info("Incoming HTTP request completed")\n    })\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Centralized Structured Logging (Loki / Elastic)", pros: "Instant cross-service log correlation; structured querying by user_id and correlation_id; powerful alerting on error rates.", cons: "High storage cost for multi-terabyte log retention; requires managing log index clusters.", bestFor: "All production microservices clusters." },
        { option: "Local Server File Logs (SSH grepping)", pros: "Zero infrastructure setup.", cons: "Impossible to correlate in microservices; logs are permanently lost when ephemeral pods terminate.", bestFor: "Local development only." }
      ],
      interviewTip: "In interviews, explain logging observability cleanly: 'Every request entering our API gateway receives a unique X-Correlation-ID header. Using Mapped Diagnostic Context (MDC), this ID is automatically injected into every structured JSON log line across all downstream services. In Grafana Loki, an engineer simply enters correlation_id = xyz to instantly view the complete chronological log execution across all 8 microservices.'"
    },
    {
      id: "red-metrics",
      subtopicNumber: "6.2",
      title: "RED Metrics, Golden Signals & Prometheus",
      subtitle: "Monitoring Rate, Errors, and Duration (RED) alongside Google SRE Four Golden Signals.",
      readingTime: "8 min read",
      difficulty: "Intermediate",
      accent: "#10b981",
      keyTakeaways: [
        "The RED Method (Rate, Errors, Duration) is the gold standard for monitoring request-driven microservices architectures.",
        "Google SRE Four Golden Signals: Latency, Traffic, Errors, and Saturation (CPU, memory, disk I/O capacity limits).",
        "Prometheus Pull Model: Prometheus periodically scrapes `/metrics` endpoints exposed by microservice pods, storing time-series counters and histograms.",
        "Alert on Symptoms, Not Causes: Alert on elevated user error rates or latency breaches (SLOs), not on raw server CPU spikes."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  THE RED METRICS MONITORING ARCHITECTURE                |
+-------------------------------------------------------------------------+
[Microservice Pod] ===(Exposes /metrics on port 9090)
       |
       | 1. RATE:     http_requests_total (Counter)
       | 2. ERRORS:   http_requests_total{status=~"5.."} (Counter)
       | 3. DURATION: http_request_duration_seconds (Histogram: P50, P90, P99)
       |
       v (Scraped every 15s via HTTP Pull)
[Prometheus Server] ---> Evaluates AlertManager rules (e.g. Error Rate > 1%)
       |
       v
[Grafana Dashboard] ---> Visualizes Golden Signals in real-time`,
      blockNodes: [
        { x: 50, y: 120, w: 250, h: 180, title: 'Instrumented App', stroke: '#38bdf8', lines: ['Prometheus Client SDK', 'Tracks Rate, Errors, Duration', 'In-memory atomic counters', 'Exposes GET /metrics'], tag: 'Metric Exporter' },
        { x: 360, y: 100, w: 270, h: 220, title: 'Prometheus Server', stroke: '#10b981', lines: ['Periodic HTTP pull scrape', 'Time-series database (TSDB)', 'PromQL query engine', 'Evaluates AlertManager alerts', 'Low overhead pull model'], tag: 'TSDB Scraper' },
        { x: 690, y: 120, w: 250, h: 180, title: 'Grafana & Alerts', stroke: '#a855f7', lines: ['Real-time RED dashboards', 'P99 Latency graphs', 'PagerDuty alert dispatch', 'SLO burn rate tracking'], tag: 'Visualization' }
      ],
      blockConns: [
        { d: 'M 300 210 L 360 210', lx: 330, ly: 200, label: 'Scrape' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'Visualize' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'HTTP Request', stroke: '#38bdf8', lines: ['Request hits /api/orders', 'Timer starts recording', 'Handler processes request'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Record Metric', stroke: '#10b981', lines: ['Increments requests counter', 'If 5xx: increments error counter', 'Observes latency in histogram'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Scrape Pull', stroke: '#f59e0b', lines: ['Prometheus scrapes /metrics', 'Ingests time-series delta', 'Stores in TSDB disk blocks'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'PromQL Alert', stroke: '#a855f7', lines: ['Calculates error rate > 1%', 'Triggers PagerDuty page', 'On-call engineer alerted'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Record' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Scrape' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Alert' }
      ],
      sections: [
        {
          heading: "1. The RED Method vs USE Method: Service-Level Metrics",
          body: "Formulated by Tom Wilkie, the RED Method defines the core metrics every request-driven microservice must measure:\n1. Rate: The number of incoming requests per second ($R = \\text{rate}(\\text{http\\_requests\\_total}[1m])$).\n2. Errors: The number of requests that fail with an error per second ($E = \\text{rate}(\\text{http\\_requests\\_total}\\{\\text{status}=\\sim\"5..\"\\}[1m])$).\n3. Duration: The amount of time requests take to execute, measured as percentile distributions ($P50$, $P90$, $P99$).\n(Contrast with the USE Method—Utilization, Saturation, Errors—which is designed for infrastructure resources like disks, memory, and CPUs).",
          bullets: [
            "Percentiles vs Averages: Never alert on average latency! Averages hide catastrophic long-tail degradation. An average of 100ms can hide a $P99$ where 1% of users wait 30 seconds.",
            "Histogram Buckets: Pre-configure latency buckets (e.g. `[0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0]`) to accurately compute quantiles via PromQL `histogram_quantile()`."
          ]
        },
        {
          heading: "2. Google SRE Four Golden Signals",
          body: "The Google Site Reliability Engineering (SRE) book defines the Four Golden Signals for production monitoring:",
          bullets: [
            "Latency: Time taken to serve a request. Differentiate between successful request latency and failed request latency.",
            "Traffic: A measure of system demand (HTTP requests/sec for web, IOPS for databases, network bandwidth for media streaming).",
            "Errors: Rate of requests that fail (explicit 500s, implicit wrong content, or protocol failures).",
            "Saturation: How full the service's resources are (CPU load %, memory usage %, connection pool utilization %). Warns of impending failure before degradation occurs."
          ]
        },
        {
          heading: "3. Service Level Objectives (SLO) & Error Budgets",
          body: "Modern organizations do not aim for 100% uptime; they establish pragmatic Service Level Objectives (SLOs) backed by Error Budgets.",
          bullets: [
            "SLI (Service Level Indicator): A quantifiable metric: 'Percentage of requests served with status 200 in under 300ms'.",
            "SLO (Service Level Objective): The target reliability goal agreed with the business: '99.9% of requests meet the SLI over a rolling 30-day window'.",
            "Error Budget: The remaining 0.1% allowable downtime. If the error budget is exhausted, feature deployments are frozen and engineering focuses 100% on reliability."
          ]
        },
        {
          heading: "4. Production Blueprint: Prometheus Instrumentation & PromQL Alerts",
          body: "The following PromQL rules demonstrate an alert triggering when a service's error rate exceeds 1% over a 5-minute window.",
          bullets: [
            "PromQL Error Rate Calculation: Divides 5xx requests by total requests over a rolling 5-minute rate.",
            "Histogram Quantile Calculation: Computes the 99th percentile latency across all pods."
          ],
          codeSnippet: {
            title: "Prometheus Alerting Rules (PromQL) for RED Metrics",
            code: `# Alert: High Error Rate (> 1% over 5 minutes)\n- alert: HighHttpErrorRate\n  expr: |\n    sum(rate(http_requests_total{status=~"5.."}[5m]))\n    /\n    sum(rate(http_requests_total[5m])) * 100 > 1.0\n  for: 2m\n  labels:\n    severity: critical\n  annotations:\n    summary: "High HTTP error rate on {{ $labels.service }}"\n    description: "Error rate is {{ $value | printf \"%.2f\" }}% (threshold: > 1.0%)"\n\n# Alert: High P99 Latency (> 1000ms over 5 minutes)\n- alert: HighP99LatencyBreach\n  expr: |\n    histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))\n    > 1.0\n  for: 3m\n  labels:\n    severity: warning\n  annotations:\n    summary: "P99 Latency breach on {{ $labels.service }}"\n    description: "P99 latency is above 1 second for 3 consecutive minutes"`
          }
        }
      ],
      tradeOffs: [
        { option: "Prometheus Pull Model", pros: "Lightweight TSDB; pull model prevents monitoring system from being overwhelmed during traffic spikes; rich PromQL query engine.", cons: "Metrics scraped every 15s (not real-time sub-second); requires high disk IOPS for massive clusters.", bestFor: "Standard microservices and Kubernetes cluster monitoring." },
        { option: "Push-Based Metrics (StatsD / Datadog)", pros: "Immediate push on event; easy to use in serverless Lambda functions.", cons: "A sudden traffic spike sends millions of metric UDP packets, overloading monitoring agents.", bestFor: "Short-lived ephemeral serverless functions." }
      ],
      interviewTip: "In architecture rounds, state your monitoring strategy concisely: 'I instrument all microservices with the RED method: Rate, Errors, and Duration. We expose these via Prometheus counters and latency histograms. In Grafana, we track P99 latency rather than misleading averages, and configure Prometheus AlertManager to page on-call SREs whenever our SLO error budget burn rate exceeds safe thresholds.'"
    },
    {
      id: "distributed-tracing",
      subtopicNumber: "6.3",
      title: "Distributed Tracing with OpenTelemetry & W3C",
      subtitle: "Tracing requests across microservice networks using OpenTelemetry, W3C traceparent, and Jaeger visual waterfall graphs.",
      readingTime: "9 min read",
      difficulty: "Advanced",
      accent: "#a855f7",
      keyTakeaways: [
        "Distributed Tracing follows a single user request across multiple network hops, databases, and message queues, visualising latency in a waterfall graph.",
        "W3C Trace Context Standard: Propagates `traceparent` (`00-{trace_id}-{span_id}-{flags}`) in HTTP and gRPC metadata headers.",
        "A Trace is a directed acyclic graph of Spans; each Span represents a timed unit of work with start/end timestamps, attributes, and events.",
        "OpenTelemetry (OTel) is the vendor-neutral industry standard SDK for collecting and exporting traces, metrics, and logs to Jaeger, Tempo, or Datadog."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  OPENTELEMETRY DISTRIBUTED TRACE WATERFALL              |
+-------------------------------------------------------------------------+
[Trace ID: 4bf92f3577b34da6a3ce929d0e0e4736]
---------------------------------------------------------------------------
[API Gateway: GET /checkout]                  |========================| (120ms)
  [Order Service: ProcessOrder]                  |==================|   (95ms)
    [Inventory Svc: ReserveItems]                   |======|            (30ms)
    [Payment Svc: ChargeCard]                               |=====|     (25ms)
      [Stripe Gateway: HTTP POST]                             |===|     (20ms)
---------------------------------------------------------------------------
(Identifies exact latency bottlenecks in complex multi-service call graphs!)`,
      blockNodes: [
        { x: 50, y: 120, w: 250, h: 180, title: 'W3C Traceparent', stroke: '#38bdf8', lines: ['traceparent header', '00-{trace_id}-{span_id}-01', 'Propagated over HTTP & gRPC', 'Preserves parent context'], tag: 'Header Protocol' },
        { x: 360, y: 100, w: 270, h: 220, title: 'OpenTelemetry SDK', stroke: '#10b981', lines: ['Vendor-neutral OTel SDK', 'Creates spans & timing blocks', 'Attaches DB queries & status', 'Asynchronous batch exporter', 'Zero network blocking'], tag: 'OTel Collector' },
        { x: 690, y: 120, w: 250, h: 180, title: 'Trace Visualization', stroke: '#a855f7', lines: ['Jaeger / Grafana Tempo', 'Interactive waterfall UI', 'Critical path highlighting', 'Root cause bottleneck finder'], tag: 'Waterfall UI' }
      ],
      blockConns: [
        { d: 'M 300 210 L 360 210', lx: 330, ly: 200, label: 'Context' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'Export OTLP' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Trace Created', stroke: '#38bdf8', lines: ['API Gateway receives call', 'Generates root trace_id', 'Starts root span'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Inject & Call', stroke: '#10b981', lines: ['Injects traceparent header', 'Makes gRPC call to Order Svc', 'Transmits parent_span_id'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Extract & Child', stroke: '#f59e0b', lines: ['Order Svc extracts context', 'Starts child span', 'Records SQL query timing'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'OTLP Export', stroke: '#a855f7', lines: ['Flushes batch to OTel Agent', 'Assembled into waterfall graph', 'SRE pinpoints slow hop'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Inject' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Extract' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Export' }
      ],
      sections: [
        {
          heading: "1. The Observability Triad: Traces, Metrics, and Logs",
          body: "Metrics tell you THAT a problem exists (e.g. 'P99 latency on `/checkout` spiked to 4 seconds'). Logs tell you WHAT happened at an isolated point in time (e.g. 'Database query error'). But only Distributed Tracing tells you WHERE the latency was spent across a distributed network graph. In a microservices call chain with 8 services, Distributed Tracing identifies that 3.8 seconds of the 4-second request was spent waiting for a specific database lock inside the Inventory Service.",
          bullets: [
            "Trace: Represents the entire journey of a request through a distributed system.",
            "Span: A single named, timed operation within a trace (e.g. `HTTP POST /orders` or `SELECT FROM users`). Contains start time, end time, attributes, and tags.",
            "W3C `traceparent` Standard: A standardized HTTP header: `00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01` representing version, 128-bit trace ID, 64-bit parent span ID, and trace flags (sampled)."
          ]
        },
        {
          heading: "2. Context Propagation Mechanics: The Wire Protocol",
          body: "The core challenge of distributed tracing is Context Propagation. When Service A calls Service B over HTTP, or produces a message to Kafka, the trace identity must travel over the wire.",
          bullets: [
            "TextMapPropagator: The OpenTelemetry component responsible for serializing (Inject) and deserializing (Extract) context into carrier headers (HTTP headers, gRPC metadata, or Kafka headers).",
            "Baggage: OpenTelemetry Baggage allows propagating arbitrary business key-value pairs (e.g. `customer_tier=VIP`) across the entire trace graph without altering intermediate service signatures."
          ]
        },
        {
          heading: "3. Trace Sampling: Head-Based vs Tail-Based Sampling",
          body: "Capturing 100% of traces in a system processing 100,000 requests/sec generates petabytes of trace data that exhausts network bandwidth and storage budgets.",
          bullets: [
            "Head-Based Sampling: The sampling decision is made at the root gateway when the request begins (e.g. sample 1% of all traffic). Drawback: If a rare 500 error occurs in the unsampled 99%, the trace is lost.",
            "Tail-Based Sampling: The OpenTelemetry Collector buffers all spans in memory until the request completes. If the request was fast and successful, it drops the trace; if the request threw an error or exceeded latency thresholds, it retains 100% of the trace."
          ]
        },
        {
          heading: "4. Production Blueprint: OpenTelemetry Instrumentation in Go",
          body: "The following Go snippet illustrates creating an OpenTelemetry tracer, starting a child span, and recording an error attribute.",
          bullets: [
            "Span Attributes: Attaches query details and customer ID to the span.",
            "Error Recording: Explicitly sets span status to Error and captures stack traces."
          ],
          codeSnippet: {
            title: "OpenTelemetry Span Creation & Context Propagation in Go",
            code: `package tracer\n\nimport (\n    "context"\n    "go.opentelemetry.io/otel"\n    "go.opentelemetry.io/otel/attribute"\n    "go.opentelemetry.io/otel/codes"\n    "go.opentelemetry.io/otel/trace"\n)\n\nfunc ExecuteTracedOperation(ctx context.Context, orderId string) error {\n    tracer := otel.GetTracerProvider().Tracer("order-service")\n    \n    // Start child span linked to parent trace context\n    ctx, span := tracer.Start(ctx, "ProcessOrderDatabaseCommit",\n        trace.WithSpanKind(trace.SpanKindInternal),\n    )\n    defer span.End()\n\n    span.SetAttributes(\n        attribute.String("order.id", orderId),\n        attribute.String("db.system", "postgresql"),\n    )\n\n    if err := executeDatabaseCommit(ctx, orderId); err != nil {\n        span.RecordError(err)\n        span.SetStatus(codes.Error, err.Error())\n        return err\n    }\n\n    span.SetStatus(codes.Ok, "Database commit successful")\n    return nil\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "OpenTelemetry + Tail-Based Sampling", pros: "Vendor neutral; 100% capture of errors and slow requests; visualizes exact latency bottlenecks; industry standard.", cons: "Requires running OpenTelemetry Collector buffer memory; trace context must be passed cleanly in code.", bestFor: "All modern microservices architectures." },
        { option: "Head-Based Sampling (1%)", pros: "Zero memory buffering needed in collectors; lower infrastructure cost.", cons: "Fails to capture rare intermittent errors that happen outside the 1% sample.", bestFor: "High-volume, highly uniform traffic with low error rates." },
        { option: "No Distributed Tracing (Logs Only)", pros: "Zero telemetry overhead.", cons: "Pinpointing which service caused a 3-second latency spike in a 10-hop graph is nearly impossible.", bestFor: "Monolithic single-process applications only." }
      ],
      interviewTip: "In interviews, highlight the power of tracing for latency diagnostics: 'When debugging high P99 latency in microservices, logs are insufficient. I implement OpenTelemetry distributed tracing using the W3C traceparent standard. In Jaeger or Tempo, we inspect the interactive waterfall graph to immediately identify which downstream service or database query occupied the critical path.'"
    },
    {
      id: "strangler-fig",
      subtopicNumber: "6.4",
      title: "Strangler Fig Migration Pattern",
      subtitle: "Incrementally replacing legacy monolithic systems with microservices using edge proxies and dark traffic shadowing.",
      readingTime: "8 min read",
      difficulty: "Advanced",
      accent: "#f59e0b",
      keyTakeaways: [
        "Named after the Australian Strangler Fig tree that seeds in the upper branches of a host tree, grows downward, and gradually replaces the host tree over time.",
        "Never execute a 'Big Bang' rewrite: rewriting a massive monolithic system from scratch over 2 years almost universally fails due to shifting business requirements.",
        "The Strangler Fig pattern places an edge reverse proxy in front of the monolith, routing individual capabilities (e.g. `/orders/*`) to new microservices one at a time.",
        "Dark Traffic Shadowing: Mirror live production traffic to the new microservice to verify performance and correctness before cutting over user traffic."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  STRANGLER FIG MIGRATION PROGRESSION                    |
+-------------------------------------------------------------------------+
Step 1: Edge Proxy Intercepts All Traffic
[Clients] ---> [Edge Reverse Proxy (Envoy/Kong)] ---> [Legacy Monolith (100%)]

Step 2: Extract Capability 1 (Orders)
[Clients] ---> [Edge Reverse Proxy]
                      |-- (Route /orders/*) ------> [New Order Microservice]
                      +-- (Route all other) ------> [Legacy Monolith (80%)]

Step 3: Complete Migration (Monolith Decommissioned)
[Clients] ---> [Edge Reverse Proxy]
                      |-- (Route /orders/*) ------> [Order Microservice]
                      |-- (Route /billing/*) -----> [Billing Microservice]
                      +-- (Route /users/*) -------> [User Microservice]`,
      blockNodes: [
        { x: 50, y: 120, w: 250, h: 180, title: 'Edge Routing Proxy', stroke: '#38bdf8', lines: ['Envoy / NGINX / Kong', 'Intercepts all client traffic', 'Path-based routing rules', 'Shadow traffic mirroring', 'Zero client configuration'], tag: 'Strangler Proxy' },
        { x: 360, y: 100, w: 270, h: 220, title: 'Extracted Microservices', stroke: '#10b981', lines: ['Order Service (New)', 'Billing Service (New)', 'Private modern databases', 'Continuous deployment', 'Autonomous teams'], tag: 'Target Architecture' },
        { x: 690, y: 120, w: 250, h: 180, title: 'Shrinking Monolith', stroke: '#ef4444', lines: ['Legacy monolithic core', 'Handles remaining legacy paths', 'Traffic drops from 100% to 0%', 'Decommissioned safely'], tag: 'Legacy Host' }
      ],
      blockConns: [
        { d: 'M 300 210 L 360 210', lx: 330, ly: 200, label: 'Route /orders' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'Shrink' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Deploy Proxy', stroke: '#38bdf8', lines: ['Place proxy in front of monolith', 'Route 100% traffic to monolith', 'Verify zero latency hit'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Extract Domain', stroke: '#10b981', lines: ['Build new microservice', 'Implement modern DB schema', 'Sync data via CDC'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Shadow Traffic', stroke: '#f59e0b', lines: ['Mirror 100% live traffic', 'Compare responses in background', 'Verify zero regressions'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Cutover & Decom', stroke: '#a855f7', lines: ['Shift 100% traffic to microservice', 'Deprecate monolith module', 'Repeat for next domain'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Intercept' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Shadow' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Cutover' }
      ],
      sections: [
        {
          heading: "1. The Folly of the Big Bang Rewrite",
          body: "When an engineering organization realizes their monolithic codebase is becoming unmaintainable, leadership frequently falls for the 'Big Bang Rewrite' temptation: freeze major features, assemble a dream team of senior developers, and spend 18 months rebuilding the entire system from scratch in microservices. In practice, this almost universally fails. While the rewrite team builds, the legacy monolith continues evolving with critical business patches; by month 18, the new system is incomplete, bugs multiply, and the project is cancelled. The Strangler Fig pattern provides an incremental, low-risk migration strategy.",
          bullets: [
            "Incremental Value: Deliver the first microservice to production in 6 weeks, proving architectural assumptions early.",
            "Zero Downtime: The external user has zero awareness of the migration; URLs, authentication, and responses remain identical.",
            "Reversibility: If an extracted microservice has bugs, the proxy rule can be reverted in 10 seconds to route back to the monolith."
          ]
        },
        {
          heading: "2. Dark Launching & Traffic Shadowing",
          body: "Before cutting over live user traffic to a newly extracted microservice, how do you verify it can handle production load and returns 100% identical responses? You implement Traffic Shadowing (also called Dark Launching).",
          bullets: [
            "Envoy Traffic Shadowing: Envoy duplicates incoming production requests: the primary request goes to the monolith (whose response is returned to the user), while an identical clone is asynchronously sent to the new microservice.",
            "Response Diffing: A background comparison tool verifies that the microservice's JSON response matches the monolith's response bit-for-bit, identifying edge-case bugs before any user touches the new service.",
            "Load Validation: Verifies that the new microservice's database connection pools and CPU utilization handle peak traffic without degradation."
          ]
        },
        {
          heading: "3. Dual-Write Data Synchronization During Migration",
          body: "The hardest part of a Strangler migration is data synchronization. If Order Service is extracted, but other parts of the monolith still query the old `orders` table in the monolithic database, data must be kept in sync.",
          bullets: [
            "CDC Back-Sync: Use Change Data Capture (Debezium) to stream updates from the new Order database back into the legacy database until all remaining monolithic dependencies are severed.",
            "Read-Only Monolith Seam: Transition the monolith's internal order classes to read-only views querying the new microservice via gRPC."
          ]
        },
        {
          heading: "4. Production Blueprint: Envoy Traffic Shadowing Configuration",
          body: "The following Envoy configuration demonstrates shadowing 100% of production traffic to a newly extracted microservice cluster for dark testing.",
          bullets: [
            "Primary Route: Traffic routes to the legacy monolith and returns to the user.",
            "Request Mirror Policy: Clones incoming requests to the new microservice asynchronously."
          ],
          codeSnippet: {
            title: "Envoy Reverse Proxy Traffic Shadowing Configuration",
            code: `routes:\n- match:\n    prefix: "/api/v1/orders"\n  route:\n    cluster: legacy_monolith_cluster # Primary target returned to user\n    request_mirror_policies:\n    - cluster: new_order_microservice_cluster # Dark shadowed target\n      runtime_fraction:\n        default_value:\n          numerator: 100 # Mirror 100% of live traffic for testing\n          denominator: HUNDRED`
          }
        }
      ],
      tradeOffs: [
        { option: "Strangler Fig Migration", pros: "Zero-risk incremental rollout; immediate business value; dark traffic shadowing verification; 100% reversible in seconds.", cons: "Requires temporary data synchronization between new and old databases; runs dual infrastructure during transition.", bestFor: "Migrating legacy enterprise monolithic applications to microservices." },
        { option: "Big Bang Rewrite", pros: "Clean greenfield codebase without legacy baggage initially.", cons: "90% failure rate; shifting scope; takes years before delivering business value; high risk of catastrophic cutover failure.", bestFor: "Never recommended for core revenue-generating systems." }
      ],
      interviewTip: "When an interviewer asks 'How would you migrate our monolith to microservices?', answer decisively: 'I apply the Strangler Fig pattern. We place an edge proxy in front of the monolith. We identify the first high-value domain boundary, extract it into a microservice, and use Envoy Traffic Shadowing to mirror 100% of live production traffic to verify correctness. Once validated, we execute a canary cutover and decommission the monolithic module, repeating this iteratively until the monolith is extinguished.'"
    },
    {
      id: "zero-trust-mtls",
      subtopicNumber: "6.5",
      title: "Zero-Trust Security, mTLS & JWT Propagation",
      subtitle: "Securing inter-service networks with SPIFFE/SPIRE cryptographic identities and short-lived certificate rotation.",
      readingTime: "9 min read",
      difficulty: "Expert",
      accent: "#ec4899",
      keyTakeaways: [
        "Perimeter Security is dead: an attacker breaching the corporate firewall or external ingress can freely compromise unencrypted internal microservices.",
        "Zero-Trust Architecture: 'Never trust, always verify.' Every single network request—even within the same Kubernetes cluster—must be authenticated and encrypted.",
        "Mutual TLS (mTLS): Both the client and server present cryptographic x509 certificates to verify identity and encrypt wire traffic via TLS 1.3.",
        "SPIFFE/SPIRE Standard: Provides automated, cryptographically verifiable identities for software workloads, rotating certificates every few hours without human involvement."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  ZERO-TRUST MUTUAL TLS (mTLS) HANDSHAKE                 |
+-------------------------------------------------------------------------+
[Client Pod: Order Svc]                              [Server Pod: Payment Svc]
         |                                                       |
         | 1. ClientHello (TLS 1.3)                             |
         +------------------------------------------------------>|
         |                                                       |
         | 2. ServerHello + Presents Server x509 SPIFFE Cert    |
         |<------------------------------------------------------+
         |                                                       |
         | 3. Client verifies Server Cert against Root CA       |
         | 4. Client presents Client x509 SPIFFE Cert           |
         +------------------------------------------------------>|
         |                                                       |
         | 5. Server verifies Client Cert against Root CA       |
         | 6. Mutual Trust Established! Encrypted Session Keys  |
         |<=====================================================>|
         | (All inter-service traffic encrypted and authorized!) |`,
      blockNodes: [
        { x: 50, y: 120, w: 250, h: 180, title: 'Client Identity (SPIFFE)', stroke: '#38bdf8', lines: ['SPIFFE ID: spiffe://order-svc', 'Short-lived x509 SVID cert', 'Rotated automatically every 1h', 'Presents cert in TLS handshake'], tag: 'Client SVID' },
        { x: 360, y: 100, w: 270, h: 220, title: 'SPIRE / Istio CA', stroke: '#10b981', lines: ['Workload Attestation Agent', 'Validates Kubernetes pod UID', 'Issues cryptographic SVIDs', 'Zero hardcoded secrets', 'Automated mTLS rotation'], tag: 'Identity Authority' },
        { x: 690, y: 120, w: 250, h: 180, title: 'Server Verification', stroke: '#ec4899', lines: ['SPIFFE ID: spiffe://payment-svc', 'Verifies client cert with CA', 'Enforces Authorization Policy', 'Decodes User JWT claims'], tag: 'Zero-Trust Gate' }
      ],
      blockConns: [
        { d: 'M 300 210 L 360 210', lx: 330, ly: 200, label: 'Attest' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'mTLS Handshake', stroke: '#ec4899' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Pod Attest', stroke: '#38bdf8', lines: ['Pod boots in cluster', 'SPIRE agent validates pod UID', 'Issues short-lived x509 cert'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'mTLS Handshake', stroke: '#ec4899', lines: ['Order Svc calls Payment Svc', 'Both Envoys exchange certs', 'Mutually verify SPIFFE IDs'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'AuthZ Enforce', stroke: '#10b981', lines: ['Payment verifies permission', 'Only order-svc allowed on /pay', 'Rejects unauthorized pods'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'JWT Propagate', stroke: '#f59e0b', lines: ['Forward end-user JWT token', 'Payment extracts user_id', 'Audit trail preserved'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Issue' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Handshake' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Authorize' }
      ],
      sections: [
        {
          heading: "1. The Death of the Castle-and-Moat Perimeter Security Model",
          body: "Historically, corporate IT relied on perimeter security ('Castle-and-Moat'): hardware firewalls protected the external boundary, and anything inside the internal network was trusted implicitly. In modern cloud native computing, this model is dangerously obsolete. Attackers breach perimeters via compromised VPNs, malicious dependencies in open-source libraries, SSRF attacks, or rogue contractor laptops. Once inside an unencrypted network, attackers execute packet sniffing to steal credit card data and pivot laterally across databases. Zero-Trust Architecture operates on the assumption that the network is already hostile.",
          bullets: [
            "Never Trust, Always Verify: Every single request—even between two pods on the same Kubernetes worker node—must prove its identity.",
            "Defense in Depth: Layered security combining network-level identity (mTLS), service-level authorization (RBAC), and user-level identity (JWT tokens)."
          ]
        },
        {
          heading: "2. The SPIFFE / SPIRE Workload Attestation Standard",
          body: "How do you give a container a cryptographically verifiable identity without hardcoding secrets in environment variables or configuration files? The answer is SPIFFE (Secure Production Identity Framework for Everyone) and its reference implementation SPIRE.",
          bullets: [
            "SPIFFE ID: A structured URI: `spiffe://cluster.local/ns/prod/sa/order-service-sa`.",
            "Workload Attestation: The SPIRE agent queries the local Linux kernel and Kubernetes API to verify the pod's container ID, namespace, and service account. Once attested, it issues a short-lived x509 certificate (SVID).",
            "Zero Hardcoded Passwords: Certificates rotate automatically every 60 minutes; if a container is compromised, the stolen certificate expires before it can be used for persistent access."
          ]
        },
        {
          heading: "3. User Identity vs Service Identity: JWT Propagation",
          body: "A common security question in microservices is: 'How does a downstream service know which user initiated the request?'",
          bullets: [
            "Service Identity (mTLS): Proves that the CALLER is Order Service, ensuring no rogue container can hit the payment endpoint.",
            "User Identity (JWT Claims): The original OAuth2 JWT token signed by the identity provider (Okta, Auth0, Keycloak) is passed in the `Authorization: Bearer <token>` header across all downstream hops, allowing services to enforce user-level data permissions."
          ]
        },
        {
          heading: "4. Production Blueprint: Istio Zero-Trust AuthorizationPolicy",
          body: "The following production Istio manifest enforces that only pods with the cryptographic SPIFFE identity of `order-service` can execute HTTP POST requests to `/api/v1/charge`.",
          bullets: [
            "Source Principals: Enforces mutual TLS identity verification.",
            "Method & Path Restraints: Restricts access strictly to authorized business endpoints."
          ],
          codeSnippet: {
            title: "Istio Strict Zero-Trust AuthorizationPolicy Manifest",
            code: `apiVersion: security.istio.io/v1beta1\nkind: AuthorizationPolicy\nmetadata:\n  name: payment-service-authz\n  namespace: production\nspec:\n  selector:\n    matchLabels:\n      app: payment-service\n  action: ALLOW\n  rules:\n  - from:\n    - source:\n        principals:\n        # Cryptographically verified SPIFFE ID via mTLS\n        - "cluster.local/ns/production/sa/order-service-sa"\n    to:\n    - operation:\n        methods: ["POST"]\n        paths: ["/api/v1/charge"]`
          }
        }
      ],
      tradeOffs: [
        { option: "Zero-Trust mTLS (SPIFFE / Istio)", pros: "Automated cryptographic identity; zero hardcoded secrets; wire encryption everywhere; strict service-level authorization policies.", cons: "Adds slight CPU overhead for TLS handshakes; requires service mesh or SPIRE infrastructure.", bestFor: "Enterprise architectures, fintech, healthcare, and high-security compliance systems." },
        { option: "Perimeter Firewall (Cleartext VPC)", pros: "Zero proxy overhead; simplest initial configuration.", cons: "Severe security vulnerability; lateral movement allows compromised pods to sniff and read all internal network packets.", bestFor: "Air-gapped toy projects only." }
      ],
      interviewTip: "In advanced security discussions, explain Zero-Trust layered identity: 'We implement dual identity verification. For service identity, we enforce Zero-Trust mutual TLS using Istio and SPIFFE x509 certificates rotated hourly; only pods with the verified order-service identity can connect to payment-service. For user identity, the original end-user JWT token is propagated downstream to enforce fine-grained data ownership.'"
    }
  ]
};

// Write out modules 5 and 6
fs.writeFileSync(
  path.join(__dirname, 'microservicesMod5.js'),
  `/* eslint-disable @typescript-eslint/no-require-imports */\nconst MODULE_5_EVENTS = ${JSON.stringify(MODULE_5_EVENTS, null, 2)};\nmodule.exports = { MODULE_5_EVENTS };\n`,
  'utf8'
);

fs.writeFileSync(
  path.join(__dirname, 'microservicesMod6.js'),
  `/* eslint-disable @typescript-eslint/no-require-imports */\nconst MODULE_6_OPERATIONS = ${JSON.stringify(MODULE_6_OPERATIONS, null, 2)};\nmodule.exports = { MODULE_6_OPERATIONS };\n`,
  'utf8'
);

console.log("Modules 5 and 6 successfully written with all subtopics in high depth!");
