 

// 6 Core Modules covering all 32 Microservices Concepts & Patterns
const MODULE_1_FOUNDATIONS = {
  id: "foundations-boundaries",
  topicNumber: 1,
  title: "1. Foundations & Boundaries",
  description: "Domain-Driven Design, Bounded Contexts, decomposition strategies, synchronous vs asynchronous protocols, and the fallacies of distributed computing.",
  subtopics: [
    {
      id: "monolith-vs-microservices",
      subtopicNumber: "1.1",
      title: "Monolith vs Microservices Architecture",
      subtitle: "Analyzing architectural trade-offs, network latency tax, team topologies, and knowing exactly when to split.",
      readingTime: "7 min read",
      difficulty: "Foundational",
      accent: "#38bdf8",
      keyTakeaways: [
        "A monolithic architecture offers zero-latency in-memory function calls and ACID atomicity; microservices trade this for independent deployment velocity and isolated blast radius at the cost of network hops.",
        "Beware the 'Distributed Monolith' anti-pattern: microservices that share databases, require lockstep deployments, or chain 10+ synchronous RPCs combine the worst of both worlds.",
        "Default to a clean Modular Monolith early in product evolution until domain boundaries stabilize and team size surpasses 30+ engineers."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  MONOLITH VS MICROSERVICES TOPOLOGY                     |
+-------------------------------------------------------------------------+
[Monolith: Single Binary]                [Microservices: Autonomous VPCs]
+-------------------------------+        +-----------+    +-----------+
| UI + Logic + Auth + Billing   |        | Order Svc |    | Billing   |
|         (In-Memory Calls)     |        +-----+-----+    +-----+-----+
|               |               |              |                |
|       [Single ACID DB]        |        [Order DB]       [Billing DB]
+-------------------------------+        (Event-Driven Asynchronous Kafka)`,
      blockNodes: [
        { x: 50, y: 120, w: 220, h: 180, title: 'Modular Monolith', stroke: '#38bdf8', lines: ['Single deployable binary', 'In-memory method calls', 'Single ACID Database', 'Zero serialization lag'], tag: 'Single Host' },
        { x: 340, y: 100, w: 270, h: 220, title: 'Distributed Microservices', stroke: '#10b981', lines: ['Order Svc (Go) | DB A', 'Inventory Svc (Java) | DB B', 'Payment Svc (Rust) | DB C', 'Kafka Event Streaming', 'Isolated failure zones'], tag: 'Autonomous' },
        { x: 680, y: 120, w: 260, h: 180, title: 'Distributed Monolith', stroke: '#ef4444', lines: ['Shared database coupling', 'Lockstep release trains', 'Chatty synchronous RPCs', 'Cascading cluster crashes'], tag: 'Anti-Pattern' }
      ],
      blockConns: [
        { d: 'M 270 210 L 340 210', lx: 305, ly: 200, label: 'Evolve' },
        { d: 'M 610 210 L 680 210', lx: 645, ly: 200, label: 'Avoid!', stroke: '#ef4444' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Modular Seams', stroke: '#38bdf8', lines: ['Organize code into packages', 'Strict interface boundaries', 'Verify domain maturity'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Extraction Trigger', stroke: '#f59e0b', lines: ['Team grows past 30 devs', 'Different scaling vectors', 'Compliance/PCI boundaries'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Strangler Migration', stroke: '#10b981', lines: ['Route edge traffic via proxy', 'Extract 1 service at a time', 'Verify independent releases'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Full Autonomy', stroke: '#a855f7', lines: ['Private databases per service', 'Decoupled event telemetry', 'Continuous deployment'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Scale' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Split' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Deliver' }
      ],
      sections: [
        {
          heading: "The Economics of Microservices: Velocity vs Complexity Tax",
          body: "Microservices are primarily an organizational tool to optimize team velocity and decouple deployment pipelines. When a monolithic codebase reaches hundreds of active developers, release trains grind to a halt because a regression in search breaks payments. By breaking systems along business capabilities, individual teams own their service from code commit to production alerting. However, every network boundary introduced adds serialization latency, partial network failure modes, and distributed consistency challenges.",
          bullets: [
            "Network Tax: An in-memory call takes 10–50 nanoseconds; an RPC over localhost/VPC takes 1–5 milliseconds (a 100,000x latency penalty).",
            "Independent Deployability: The golden litmus test of a microservice: can you deploy Service A to production without coordinating with or redeploying Service B?",
            "Conway's Law: Organizations design systems that mirror their communication structures. Structure stream-aligned teams around domain capabilities."
          ],
          codeSnippet: {
            title: "Checking Service Boundary Coupling via OpenTelemetry Attributes",
            code: `// Distributed RPC Tracing Context Propagation in Go\nfunc InjectTraceContext(ctx context.Context, req *http.Request) {\n    otel.GetTextMapPropagator().Inject(ctx, propagation.HeaderCarrier(req.Header))\n    req.Header.Set("X-Service-Source", "order-service")\n    req.Header.Set("X-Client-Timeout-Budget-Ms", "1500")\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Modular Monolith", pros: "Zero network latency, single atomic database transactions, simple local development and testing.", cons: "Single runtime blast radius; shared memory leaks can bring down the entire process.", bestFor: "Early-stage startups, new products with evolving requirements, and teams < 30 engineers." },
        { option: "Microservices", pros: "Autonomous deployments, independent horizontal auto-scaling, polyglot tech stacks, isolated failures.", cons: "Distributed transactions require Sagas; complex observability (tracing, service mesh, logging).", bestFor: "High-scale organizations (50+ engineers) with clear bounded contexts and mature DevOps." }
      ],
      interviewTip: "When asked 'Should we build a microservice architecture?' in an interview, never say yes immediately. State: 'I prefer starting with a well-encapsulated modular monolith unless there are distinct scaling differentials, organizational team scaling bottlenecks, or strict compliance isolation requirements.'"
    },
    {
      id: "domain-driven-design",
      subtopicNumber: "1.2",
      title: "Domain-Driven Design (DDD) & Bounded Contexts",
      subtitle: "Using ubiquitous language, subdomains, aggregates, and context mapping to draw clean architectural boundaries.",
      readingTime: "8 min read",
      difficulty: "Advanced",
      accent: "#10b981",
      keyTakeaways: [
        "A Bounded Context defines the exact boundary inside which a domain model and its ubiquitous language hold true without ambiguity.",
        "The word 'Order' means customer intent in Sales, a bill of materials in Fulfillment, and a ledger debit in Accounting. Trying to share a single god-object creates crippling coupling.",
        "Use Anti-Corruption Layers (ACL) when integrating with legacy systems or foreign third-party APIs to prevent external jargon from polluting your clean domain model."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  BOUNDED CONTEXTS & CONTEXT MAPPING                     |
+-------------------------------------------------------------------------+
  [Catalog Context]                 [Fulfillment Context]
  +-----------------------+         +-----------------------+
  | Item = SKU, Marketing |         | Item = Weight, Bin #  |
  | Price, High-res JPGs  |         | Forklift dimensions   |
  +-----------+-----------+         +-----------+-----------+
              |                                 |
              +======> [Anti-Corruption Layer] <=+
                       (Translates Domain DTOs)`,
      blockNodes: [
        { x: 50, y: 120, w: 260, h: 180, title: 'Sales / Catalog Context', stroke: '#10b981', lines: ['Ubiquitous Language: Product', 'Images, SEO slugs, Categories', 'Optimized for high-throughput reads'], tag: 'Domain A' },
        { x: 370, y: 120, w: 260, h: 180, title: 'Warehouse / Logistics', stroke: '#0284c7', lines: ['Ubiquitous Language: SKU Parcel', 'Physical weight, bin location', 'Carrier shipping label rules'], tag: 'Domain B' },
        { x: 690, y: 120, w: 260, h: 180, title: 'Anti-Corruption Layer (ACL)', stroke: '#f59e0b', lines: ['Translates external DTOs', 'Protects domain invariants', 'Decouples upstream schema breaks'], tag: 'Adapter' }
      ],
      blockConns: [
        { d: 'M 310 210 L 370 210', lx: 340, ly: 200, label: 'Domain Event' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'Translate' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Strategic Discovery', stroke: '#10b981', lines: ['Event Storming workshop', 'Identify business milestones', 'Map core vs supporting domains'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Define Contexts', stroke: '#38bdf8', lines: ['Establish Bounded Contexts', 'Define ubiquitous terminology', 'Prevent universal god-objects'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Context Mapping', stroke: '#f59e0b', lines: ['Upstream / Downstream flow', 'Customer-Supplier contracts', 'Deploy Anti-Corruption Layers'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Enforce Invariants', stroke: '#a855f7', lines: ['Model domain Aggregates', 'ACID scope strictly per aggregate', 'Async events for cross-aggregate'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Discover' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Contexts' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Protect' }
      ],
      sections: [
        {
          heading: "Strategic DDD: Aggregates as Consistency Boundaries",
          body: "In DDD, an Aggregate is a cluster of associated objects treated as a unit for data changes. Every Aggregate has a single Aggregate Root. Outside objects can only hold references to the Aggregate Root, never internal entities. In a microservices architecture, the fundamental rule is: One transaction should update exactly one Aggregate in one service. If your business requirement demands updating two separate aggregates in a single synchronous commit, either merge them into one aggregate or coordinate them via eventual consistency using domain events.",
          bullets: [
            "Ubiquitous Language: Speak the domain expert's language directly in class names, database tables, and API routes.",
            "Shared Kernel vs Customer-Supplier: Shared code creates runtime coupling. Prefer decoupled contracts with consumer-driven contract testing.",
            "Context Maps: Document relationships between bounded contexts (Partnership, Shared Kernel, Customer/Supplier, Conformist, Open Host Service)."
          ],
          codeSnippet: {
            title: "Java 21 Domain Aggregate Enforcing Business Invariants",
            code: `public record OrderId(UUID value) {}\n\npublic class OrderAggregate {\n    private final OrderId id;\n    private OrderStatus status;\n    private final List<OrderLineItem> items;\n\n    public void cancel(String reason) {\n        if (status == OrderStatus.SHIPPED) {\n            throw new IllegalStateException("Cannot cancel an order that has already shipped.");\n        }\n        this.status = OrderStatus.CANCELLED;\n        DomainEvents.publish(new OrderCancelledEvent(this.id, reason, Instant.now()));\n    }\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Strict DDD Bounded Contexts", pros: "Clean separation of concerns, zero schema contamination, independent velocity per business capability.", cons: "Requires deep domain modeling upfront; steep learning curve for junior engineers.", bestFor: "Core business systems with high complexity (fintech, e-commerce, healthcare logistics)." },
        { option: "CRUD Entity Services", pros: "Fast to build initially; simple table-to-REST mappings.", cons: "Quickly deteriorates into an unmaintainable distributed monolith with anemic domain models.", bestFor: "Simple internal reporting tools or non-critical CRUD utilities." }
      ],
      interviewTip: "In architecture rounds, explicitly use DDD terminology: 'I am drawing a Bounded Context around the Payments domain. Within this boundary, Order refers only to payment intents, decoupling it from the logistics shipment domain.'"
    },
    {
      id: "service-boundaries",
      subtopicNumber: "1.3",
      title: "Service Boundaries & Decomposition Strategies",
      subtitle: "How to split services by business capabilities, avoiding nano-services, and the independent deployability test.",
      readingTime: "7 min read",
      difficulty: "Intermediate",
      accent: "#f59e0b",
      keyTakeaways: [
        "Decompose by Business Capability (e.g., Billing, Inventory, Recommendations) or by Subdomain (Core, Supporting, Generic).",
        "Beware the 'Nano-Service' trap: breaking an entity into 5 separate microservices (e.g., User, UserProfile, UserPreferences, UserAuth) creates unbearable network latency and chatty coupling.",
        "Use the Two-Pizza Team Rule: A microservice should be maintainable by a single autonomous team of 5–8 engineers who own the full lifecycle."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  DECOMPOSITION PATTERNS & HEURISTICS                    |
+-------------------------------------------------------------------------+
  [By Business Capability]              [By Subdomain Type]
  +----------------------+              +----------------------+
  | Billing & Invoicing  |              | Core: Pricing Engine |
  | Product Recommendations |           | Generic: User Auth   |
  | Order Fulfillment    |              | Supporting: PDF Export|
  +----------------------+              +----------------------+`,
      blockNodes: [
        { x: 50, y: 120, w: 260, h: 180, title: 'Core Domain Service', stroke: '#10b981', lines: ['Primary competitive advantage', 'Custom algorithmic engine', 'High investment & proprietary'], tag: 'Core Value' },
        { x: 370, y: 120, w: 260, h: 180, title: 'Supporting Subdomain', stroke: '#f59e0b', lines: ['Complements the core domain', 'Order notification pipeline', 'In-house customized service'], tag: 'Supporting' },
        { x: 690, y: 120, w: 260, h: 180, title: 'Generic Subdomain', stroke: '#a855f7', lines: ['Standard industry function', 'Identity/SSO (Okta/Keycloak)', 'Off-the-shelf or SaaS integration'], tag: 'Generic' }
      ],
      blockConns: [
        { d: 'M 310 210 L 370 210', lx: 340, ly: 200, label: 'Interacts' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'Delegates' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Identify Capabilities', stroke: '#38bdf8', lines: ['Map what the business does', 'Focus on value streams', 'Ignore technical layers'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Assess Volatility', stroke: '#f59e0b', lines: ['Group things that change together', 'Separate stable from volatile', 'Evaluate scaling requirements'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Apply Deployability Test', stroke: '#10b981', lines: ['Can it deploy independently?', 'Are schemas shared?', 'Does it chain > 3 RPCs?'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Lock Boundary', stroke: '#a855f7', lines: ['Assign to 1 stream team', 'Establish semantic versioning', 'Monitor RPC chatter'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Analyze' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Test' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Enforce' }
      ],
      sections: [
        {
          heading: "Heuristics for Healthy Service Boundaries",
          body: "When drawing boundaries, engineers frequently make the mistake of decomposing by technical tier rather than vertical business capability. Technical layer slicing creates chatty, synchronous network chains where a single user click cascades through 4 microservices just to read a row. Healthy boundaries slice vertically: a single microservice owns the API contract, business rules, and private datastore for a specific business outcome.",
          bullets: [
            "Common Closure Principle: Classes that change together should be packaged together. If two services always need code changes simultaneously, merge them.",
            "Team Topologies: Ensure single team ownership. Avoid shared ownership where three different teams push code into the same repository without clear accountability.",
            "Autonomous Scaling: Extract a service if it has dramatically different hardware profiles."
          ]
        }
      ],
      tradeOffs: [
        { option: "Broad Capability Boundaries", pros: "Minimizes distributed network hops, preserves ACID transactions within the domain, reduced operational overhead.", cons: "Slightly larger binaries; requires good modular discipline within the service.", bestFor: "Most enterprise systems; recommended default starting size." },
        { option: "Fine-Grained Microservices", pros: "Extreme scaling granularity; tiny codebases per repo.", cons: "High network latency tax, brittle cascading failures, distributed tracing required everywhere.", bestFor: "Massive hyperscale services (Netflix, Uber) where single endpoints handle 1M+ RPS." }
      ],
      interviewTip: "In interviews, defend your boundary choices: 'I grouped Order Processing and Order Line Items into a single service boundary because they have high transactional coupling and always change together, preventing unnecessary network serialization.'"
    },
    {
      id: "communication-protocols",
      subtopicNumber: "1.4",
      title: "Communication Protocols: REST vs gRPC vs GraphQL",
      subtitle: "Benchmarking transport protocols, Protobuf binary serialization, HTTP/2 multiplexing, and client contract governance.",
      readingTime: "8 min read",
      difficulty: "Intermediate",
      accent: "#a855f7",
      keyTakeaways: [
        "Use gRPC (HTTP/2 + Protobuf) for high-throughput inter-service (East-West) communication; it provides 5–10x faster serialization and multiplexed streams.",
        "Use REST / JSON or GraphQL at the API Gateway edge (North-South) for public web and mobile client consumption.",
        "Protobuf strictly enforces backward and forward compatibility through integer field tags, eliminating brittle runtime JSON parsing crashes."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  EAST-WEST VS NORTH-SOUTH PROTOCOL MATRIX               |
+-------------------------------------------------------------------------+
  [North-South: Edge Ingress]           [East-West: Inter-Service Mesh]
  Web / Mobile / Third-Party            Service A ===========> Service B
             |                                     (gRPC / HTTP/2)
             v                                     (Protobuf Binary)
     [API Gateway / BFF]                           (Multiplexed Streams)
   (REST / GraphQL / JSON)`,
      blockNodes: [
        { x: 50, y: 120, w: 260, h: 180, title: 'Edge North-South', stroke: '#38bdf8', lines: ['REST / JSON (OpenAPI 3.0)', 'GraphQL (Federated Supergraph)', 'HTTP/1.1 & HTTP/3', 'Human-readable & cacheable'], tag: 'Client Facing' },
        { x: 370, y: 120, w: 260, h: 180, title: 'Mesh East-West', stroke: '#a855f7', lines: ['gRPC over HTTP/2', 'Protocol Buffers (Binary)', 'Bidirectional Streaming', 'Strict Schema Contracts'], tag: 'Inter-Service' },
        { x: 690, y: 120, w: 260, h: 180, title: 'Event Async Streaming', stroke: '#10b981', lines: ['Kafka / RabbitMQ', 'Avro / Protobuf wire payload', 'Schema Registry validation', 'Decoupled temporal sync'], tag: 'Pub/Sub' }
      ],
      blockConns: [
        { d: 'M 310 210 L 370 210', lx: 340, ly: 200, label: 'Gateway Hop' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'Async Events' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Define Schema', stroke: '#a855f7', lines: ['Author service.proto file', 'Assign unique field tags', 'Compile code stubs (protoc)'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'HTTP/2 Framing', stroke: '#38bdf8', lines: ['Binary framing layer', 'Multiplex multiple streams', 'Single TCP handshake shared'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Binary Transport', stroke: '#10b981', lines: ['Protobuf encodes binary bytes', 'Zero CPU JSON string parsing', 'HPACK header compression'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Client Invocation', stroke: '#f59e0b', lines: ['Strongly-typed response returned', 'Deadline context propagated', 'Fast deserialization in memory'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Compile' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Multiplex' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Serialize' }
      ],
      sections: [
        {
          heading: "Why gRPC Outperforms REST for Internal Microservices",
          body: "JSON is human-readable, but computationally expensive. Every JSON payload requires converting strings to integers, floats, and memory structures on both sides of the wire. In high-throughput internal microservice networks handling 100,000+ requests per second, CPU time spent on JSON parsing becomes a major bottleneck. gRPC uses Protocol Buffers: a binary serialization format where field names are replaced with compact integer tags (1, 2, 3) and data is encoded into dense bitstreams. Combined with HTTP/2 multiplexing, gRPC slashes latency and server CPU consumption.",
          bullets: [
            "Multiplexing: Eliminates TCP connection storms; hundreds of concurrent RPCs share a persistent connection.",
            "Streaming: Supports client streaming, server streaming, and bidirectional streaming out of the box.",
            "Strict Contracts: No more guessing if a field is null, string, or boolean; protoc compiles immutable types for Go, Java, Rust, and Node.js."
          ],
          codeSnippet: {
            title: "Protocol Buffer 3 Contract with Backward Compatibility Safeguards",
            code: `syntax = "proto3";\npackage billing.v1;\n\nmessage ChargePaymentRequest {\n  string transaction_id = 1;\n  int64 amount_cents = 2;\n  string currency_code = 3;\n  reserved 4;\n  reserved "payment_token";\n  string idempotency_key = 5;\n}\n\nservice PaymentService {\n  rpc ChargePayment (ChargePaymentRequest) returns (ChargePaymentResponse);\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "gRPC (HTTP/2 + Protobuf)", pros: "5–10x faster serialization, 50% smaller payload size, built-in code generation, streaming support.", cons: "Not natively browser-friendly (requires grpc-web proxy); binary payloads are harder to debug via cURL.", bestFor: "Internal East-West microservice-to-microservice communication." },
        { option: "REST + JSON", pros: "Ubiquitous, human-readable, native browser support, mature tooling, simple CDN caching.", cons: "High serialization CPU overhead, large payload footprints, no native schema validation.", bestFor: "Public North-South edge APIs and external third-party partner integrations." }
      ],
      interviewTip: "In system design interviews, recommend a hybrid protocol strategy: REST/GraphQL at the Edge Gateway for mobile/web clients, and gRPC over HTTP/2 for all internal microservice calls."
    },
    {
      id: "sync-vs-async",
      subtopicNumber: "1.5",
      title: "Synchronous RPC vs Asynchronous Messaging",
      subtitle: "Temporal coupling, cascading failure vulnerabilities, backpressure, and decoupling availability.",
      readingTime: "7 min read",
      difficulty: "Intermediate",
      accent: "#06b6d4",
      keyTakeaways: [
        "Synchronous calls introduce Temporal Coupling: Service A cannot succeed unless Service B is online and responsive right now.",
        "Chaining 4 synchronous services with 99.9% uptime each yields a cumulative availability of only 99.6% ($0.999^4$), severely degrading reliability.",
        "Asynchronous messaging decouples sender and receiver in time: Service A emits an event to a persistent broker (Kafka) and immediately returns success to the user."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  TEMPORAL COUPLING VS ASYNC BUFFERING                   |
+-------------------------------------------------------------------------+
[Synchronous RPC Chain: Cascading Hang Risk]
[Client] ---> [Order Svc] ---> [Billing Svc] ---> [Email Svc] (Hangs! Timeout!)

[Asynchronous Decoupled Event Flow]
[Client] ---> [Order Svc] ===> [Kafka Topic] ===> [Email Svc Worker]
                | (Immediate 202 Accepted)
                v
        (User gets fast ACK; Email worker retries safely in background)`,
      blockNodes: [
        { x: 50, y: 120, w: 260, h: 180, title: 'Synchronous RPC Chain', stroke: '#ef4444', lines: ['Client waits for entire chain', 'Thread blocked on network socket', 'Service C hang halts Service A', 'Availability degrades ($P = A^n$)'], tag: 'Tightly Coupled' },
        { x: 370, y: 120, w: 260, h: 180, title: 'Message Broker (Kafka)', stroke: '#10b981', lines: ['Persistent distributed commit log', 'High-throughput buffering', 'Backpressure absorbed safely', 'Zero caller blocking'], tag: 'Decoupled' },
        { x: 690, y: 120, w: 260, h: 180, title: 'Asynchronous Consumers', stroke: '#38bdf8', lines: ['Consumer Group A (Inventory)', 'Consumer Group B (Email / SMS)', 'Processes at independent speeds', 'Safe replay on crash'], tag: 'Resilient' }
      ],
      blockConns: [
        { d: 'M 310 210 L 370 210', lx: 340, ly: 200, label: 'Produce' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'Poll' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Command Receipt', stroke: '#38bdf8', lines: ['Client initiates checkout', 'Validates core parameters', 'Writes local Order state'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Event Published', stroke: '#10b981', lines: ['Emits OrderPlaced to Kafka', 'Broker ACKs write to disk', 'Returns HTTP 202 Accepted'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Client Response', stroke: '#a855f7', lines: ['Client unblocks in 15ms', 'Polls or listens via WebSocket', 'Zero thread starvation'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Background Work', stroke: '#f59e0b', lines: ['Downstream workers pull message', 'Retry automatically on failure', 'Guaranteed eventual completion'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Append' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Fast ACK' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Consume' }
      ],
      sections: [
        {
          heading: "Availability Math: The Cascading Downtime Formula",
          body: "If Service A calls Service B synchronously, which calls Service C synchronously, the total availability is the product of their individual availabilities: A_total = A1 * A2 * A3. If each service boasts an impressive 99.9% uptime, the three-service chain achieves only 99.7%. In a microservice ecosystem with 20 synchronous hops, overall availability plunges below 98% (over 7 days of downtime per year). Asynchronous messaging breaks this multiplicative degradation by severing the temporal dependency: if Service C is offline, Service A still succeeds by safely queuing the event in Kafka.",
          bullets: [
            "Temporal Decoupling: The consumer doesn't need to be running when the message is sent.",
            "Backpressure Absorption: When traffic spikes 10x, consumers pull messages at their max capacity without crashing or returning 503 errors.",
            "Eventual Consistency Trade-off: The client does not receive immediate confirmation of downstream actions, requiring asynchronous UI status polling or WebSockets."
          ]
        }
      ],
      tradeOffs: [
        { option: "Synchronous RPC (gRPC / REST)", pros: "Immediate feedback, simple mental model, natural read queries (GET).", cons: "Cascading failure risk, thread pool exhaustion under downstream slowness.", bestFor: "Immediate read queries and operations requiring immediate synchronous validation." },
        { option: "Asynchronous Messaging (Kafka / SQS)", pros: "Isolated availability, natural backpressure absorption, fan-out to multiple subscribers.", cons: "Eventual consistency, out-of-order delivery risks, complex distributed debugging.", bestFor: "State-changing mutations, business workflows, notifications, and analytics pipelines." }
      ],
      interviewTip: "Never design a checkout flow where the Order service synchronously calls Notification Service, Analytics Service, and Recommendation Service. State: 'Order Service will commit the order and publish an OrderPlaced event to Kafka; notifications and analytics will process asynchronously.'"
    }
  ]
};

module.exports = {
  MODULE_1_FOUNDATIONS
};
