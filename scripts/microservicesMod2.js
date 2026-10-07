 

const MODULE_2_INGRESS = {
  id: "ingress-routing",
  topicNumber: 2,
  title: "2. Edge Ingress, Routing & Service Mesh",
  description: "API Gateways, Backend-for-Frontend (BFF), dynamic Service Discovery, Istio Service Mesh, and Sidecar/Ambassador proxies.",
  subtopics: [
    {
      id: "api-gateway",
      subtopicNumber: "2.1",
      title: "API Gateway Pattern",
      subtitle: "Unified reverse proxy, SSL termination, JWT authentication, token-bucket rate limiting, and request aggregation.",
      readingTime: "8 min read",
      difficulty: "Intermediate",
      accent: "#0284c7",
      keyTakeaways: [
        "An API Gateway acts as the single entry point (reverse proxy) for all external clients, insulating microservices from public internet traffic.",
        "Cross-cutting concerns (SSL termination, OAuth2/JWT validation, DDoS mitigation, distributed rate limiting) are handled centrally at the edge.",
        "Avoid putting business logic or domain orchestration in the gateway; doing so turns the gateway into an unmaintainable monolithic choke point."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                        API GATEWAY EDGE TOPOLOGY                        |
+-------------------------------------------------------------------------+
[Clients: Web, iOS, Android, Partners]
                  |  (HTTPS / 443 + JWT)
                  v
       +------------------------------------+
       |        API GATEWAY (Envoy/Kong)     |
       |  +-------------------------------+  |
       |  | Auth | Rate Limiter | WAF     |  |
       |  +-------------------------------+  |
       +-----+-------------+------------+---+
             | (Internal   |  Private   |  VPC)
             v             v            v
        [Order Svc]  [Catalog Svc] [Payment Svc]`,
      blockNodes: [
        { x: 50, y: 120, w: 220, h: 180, title: 'Diverse Clients', stroke: '#38bdf8', lines: ['iOS / Android Native', 'React Single Page App', 'Third-Party Partner APIs', 'HTTPS / mTLS (Port 443)'], tag: 'Clients' },
        { x: 330, y: 100, w: 290, h: 220, title: 'API Gateway (Edge)', stroke: '#0284c7', lines: ['Kong / Spring Cloud / Envoy', '1. TLS Termination & CORS', '2. JWT Validation & Claims', '3. Token Bucket Rate Limiting', '4. Path Routing & Aggregation'], tag: 'Reverse Proxy' },
        { x: 680, y: 90, w: 260, h: 70, title: 'Order Service', stroke: '#10b981', lines: ['/orders/* (gRPC / HTTP)', 'VPC Private Subnet'], tag: 'Svc A' },
        { x: 680, y: 175, w: 260, h: 70, title: 'Catalog Service', stroke: '#a855f7', lines: ['/catalog/* (Read Replica)', 'Cached DTOs'], tag: 'Svc B' },
        { x: 680, y: 260, w: 260, h: 70, title: 'Payment Service', stroke: '#ef4444', lines: ['/payments/* (PCI-DSS)', 'Strict Isolated Subnet'], tag: 'Svc C' }
      ],
      blockConns: [
        { d: 'M 270 210 L 330 210', lx: 300, ly: 200, label: 'Ingress' },
        { d: 'M 620 160 L 680 125', lx: 650, ly: 135, label: '/orders' },
        { d: 'M 620 210 L 680 210', lx: 650, ly: 200, label: '/catalog' },
        { d: 'M 620 260 L 680 295', lx: 650, ly: 275, label: '/pay' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Edge Ingress', stroke: '#38bdf8', lines: ['Client presents JWT token', 'Reaches Edge NLB on port 443', 'SSL handshake terminated'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Security Checks', stroke: '#0284c7', lines: ['JWT signature verified', 'Rate limit quota checked in Redis', 'Public headers stripped'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Route Resolution', stroke: '#10b981', lines: ['Consults dynamic routing table', 'Injects X-User-Id header', 'Forwards to internal microservice'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Response Shape', stroke: '#a855f7', lines: ['Aggregates multiple DTOs', 'Gzip / Brotli compression', 'Emits 200 OK to client'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Authorize' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Resolve' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Return' }
      ],
      sections: [
        {
          heading: "Routing, SSL Offloading, and Edge Defense",
          body: "Allowing mobile or web clients to talk directly to dozens of internal microservices exposes internal network topologies, burns mobile battery over hundreds of TCP connections, and violates security boundaries. The API Gateway serves as a hardened security bastion. It terminates SSL, parses OAuth2 Bearer tokens, inspects request payloads for SQL injection or XSS, and translates public REST URLs into internal high-performance gRPC calls.",
          bullets: [
            "Path Rewriting & Canary Splits: Route 90% of traffic to production `/v1/orders` and 10% to canary `/v2/orders`.",
            "Token Bucket Rate Limiting: Prevent DDoS and credential stuffing by throttling requests per IP or API key.",
            "Header Stripping: Strip internal headers (`X-Internal-Roles`) from public clients to prevent privilege escalation."
          ],
          codeSnippet: {
            title: "Spring Cloud Gateway Route Definition with Resilience & Token Bucket",
            code: `@Bean\npublic RouteLocator customRouteLocator(RouteLocatorBuilder builder) {\n    return builder.routes()\n        .route("order_service", r -> r.path("/api/v1/orders/**")\n            .filters(f -> f.stripPrefix(2)\n                .addRequestHeader("X-Gateway-Processed", "true")\n                .requestRateLimiter(c -> c.setRateLimiter(redisRateLimiter()))\n                .circuitBreaker(c -> c.setName("orderCircuit").setFallbackUri("forward:/fallback")))\n            .uri("lb://ORDER-SERVICE"))\n        .build();\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Centralized API Gateway", pros: "Single security boundary, centralized rate limiting and SSL certificates, shields internal topology.", cons: "Single point of failure if not properly clustered; risk of becoming a bloated logic dumping ground.", bestFor: "Standard microservice ingress; essential for public-facing architectures." },
        { option: "Direct Client-to-Service", pros: "Zero gateway proxy latency overhead, direct point-to-point connections.", cons: "Exposes internal VPC to public internet; clients must manage 20+ connections and tokens.", bestFor: "High-performance internal cluster networks; not recommended for public clients." }
      ],
      interviewTip: "Emphasize during system design: 'The API Gateway should be purely a routing and translation layer. Keep it thin: never put business logic, heavy database transactions, or domain orchestration inside the gateway.'"
    },
    {
      id: "backend-for-frontend",
      subtopicNumber: "2.2",
      title: "Backend-for-Frontend (BFF) Pattern",
      subtitle: "Tailoring gateway tiers for mobile, web, and partner clients to eliminate over-fetching and network serialization waste.",
      readingTime: "7 min read",
      difficulty: "Intermediate",
      accent: "#ec4899",
      keyTakeaways: [
        "A single generic API Gateway forces mobile apps (low bandwidth, small screens) and desktop browsers (high bandwidth, large tables) into compromised API contracts.",
        "The Backend-for-Frontend (BFF) pattern assigns a dedicated gateway service for each distinct client type, owned by that client's frontend team.",
        "BFFs aggregate multiple downstream calls into a single compact JSON response, minimizing mobile radio wakeups and network battery drain."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                     BACKEND-FOR-FRONTEND (BFF) ARCHITECTURE             |
+-------------------------------------------------------------------------+
[Mobile Client (iOS/Android)]            [Desktop Web Browser]
            |                                      |
            v                                      v
    +---------------+                      +---------------+
    |   Mobile BFF  |                      |    Web BFF    |
    | (Compact DTO) |                      | (Full Payload)|
    +-------+-------+                      +-------+-------+
            |                                      |
            +========> [Internal Microservices] <===+
                       (Order Svc, Catalog Svc, User Svc)`,
      blockNodes: [
        { x: 50, y: 110, w: 240, h: 200, title: 'Mobile BFF Tier', stroke: '#ec4899', lines: ['Owned by Mobile Team (iOS/Android)', 'Compact payload (5KB)', 'Aggregates 4 calls into 1', 'Optimized for cellular latency'], tag: 'Mobile Gateway' },
        { x: 370, y: 110, w: 240, h: 200, title: 'Web Desktop BFF', stroke: '#38bdf8', lines: ['Owned by Web Frontend Team', 'Rich payloads, pagination', 'Server-Side Rendering (SSR)', 'Desktop analytics headers'], tag: 'Web Gateway' },
        { x: 690, y: 110, w: 260, h: 200, title: 'Core Microservices', stroke: '#10b981', lines: ['Order Microservice', 'Catalog Microservice', 'Inventory Microservice', 'Stable domain contracts'], tag: 'Domain Layer' }
      ],
      blockConns: [
        { d: 'M 290 210 L 370 210', lx: 330, ly: 200, label: 'Separate' },
        { d: 'M 610 210 L 690 210', lx: 650, ly: 200, label: 'Internal RPC' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Mobile Screen Load', stroke: '#ec4899', lines: ['User opens Home screen', 'Single GET /mobile/home call', 'Cellular radio wakes up'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'BFF Fan-Out', stroke: '#38bdf8', lines: ['Mobile BFF calls 3 services in parallel', 'Uses fast VPC gRPC', 'Handles fallback if 1 fails'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Shape & Strip', stroke: '#10b981', lines: ['Strips desktop fields', 'Formats thumbnail image URLs', 'Builds tailor-made view DTO'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Single Response', stroke: '#a855f7', lines: ['Returns small 4KB JSON payload', 'Mobile renders in 1 pass', 'Zero client-side join logic'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Call' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Fan-Out' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Compact' }
      ],
      sections: [
        {
          heading: "Solving Over-Fetching and Under-Fetching Across Devices",
          body: "Desktop screens have ample screen real estate and high-speed broadband; they easily consume rich 200KB payloads containing detailed specs, customer reviews, and large tables. In contrast, a mobile phone over a 4G connection suffers heavily from network round-trips and serialized JSON parsing. The BFF pattern decouples frontend release cycles from backend core services: the mobile team can modify, deploy, and cache their Mobile BFF without requesting schema changes from backend teams.",
          bullets: [
            "Team Autonomy: The team that writes the React Native or Swift code owns the Node.js/Go BFF.",
            "Resilience Shield: If the Recommendations service fails, the Mobile BFF returns an empty array while still loading the product page gracefully.",
            "GraphQL Supergraph Alternative: Apollo Federation can act as a dynamic BFF, letting clients query exactly the fields needed."
          ]
        }
      ],
      tradeOffs: [
        { option: "Dedicated BFFs", pros: "Optimized mobile payloads, independent deployment velocity per client team, client-specific error handling.", cons: "Duplicate routing and auth code across multiple BFFs; additional services to monitor.", bestFor: "Organizations with distinct mobile, web, and partner development teams." },
        { option: "Single Universal Gateway", pros: "Only 1 gateway codebase to manage and maintain.", cons: "Mobile payloads bloated with desktop fields; teams block each other during schema updates.", bestFor: "Small startups with only 1 web application." }
      ],
      interviewTip: "Highlight the mobile bandwidth advantage: 'I recommend a Mobile BFF to aggregate the User, Order, and Notification services into a single response, avoiding multiple cellular network round-trips that drain battery.'"
    },
    {
      id: "service-discovery",
      subtopicNumber: "2.3",
      title: "Service Discovery & Dynamic Registry",
      subtitle: "Consul, Eureka, etcd, ephemeral Kubernetes pod IPs, health check eviction, and client-side load balancing.",
      readingTime: "7 min read",
      difficulty: "Intermediate",
      accent: "#06b6d4",
      keyTakeaways: [
        "In autoscaling cloud environments, service instances are ephemeral: IP addresses change constantly as pods scale up, crash, or migrate.",
        "Service Discovery decouples callers from physical network addresses: instances register with a Service Registry (Consul, Eureka) and send periodic heartbeats.",
        "Client-Side Load Balancing (Envoy, Spring Cloud LoadBalancer) caches healthy instance lists locally, eliminating an extra hardware load balancer hop."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  SERVICE DISCOVERY & HEALTH PROBE TOPOLOGY              |
+-------------------------------------------------------------------------+
  [Order Svc Pod 1: 10.0.1.4]  ---(Heartbeat OK)---> +-------------------+
  [Order Svc Pod 2: 10.0.1.9]  ---(Heartbeat OK)---> |  SERVICE REGISTRY |
  [Order Svc Pod 3: 10.0.1.18] --(Failed! Evicted)-->| (Consul / Eureka) |
                                                     +---------+---------+
                                                               ^
       [API Gateway / Client] ----(Lookup healthy IPs)---------+
                 |
                 +====> (Direct Call: 10.0.1.4)`,
      blockNodes: [
        { x: 50, y: 80, w: 220, h: 70, title: 'Instance 1 (10.0.1.4)', stroke: '#10b981', lines: ['Order Svc | Healthy (20ms)'], tag: 'Active' },
        { x: 50, y: 165, w: 220, h: 70, title: 'Instance 2 (10.0.1.9)', stroke: '#10b981', lines: ['Order Svc | Healthy (18ms)'], tag: 'Active' },
        { x: 50, y: 250, w: 220, h: 70, title: 'Instance 3 (10.0.1.18)', stroke: '#ef4444', lines: ['Order Svc | Crashed / OOM'], tag: 'Evicted' },
        { x: 340, y: 100, w: 270, h: 220, title: 'Service Registry (Consul)', stroke: '#06b6d4', lines: ['Raft Distributed Consensus', 'Dynamic DNS & Key-Value', 'Active Health Checking (TTL)', 'Evicts dead node 3 within 5s'], tag: 'Registry' },
        { x: 680, y: 120, w: 260, h: 180, title: 'Client Load Balancer', stroke: '#f59e0b', lines: ['Envoy / Ribbon Cache', 'Periodic polling / Watch', 'Round-Robin / Least Request', 'Direct point-to-point RPC'], tag: 'Client Routing' }
      ],
      blockConns: [
        { d: 'M 270 115 L 340 145', lx: 305, ly: 125, label: 'Heartbeat' },
        { d: 'M 270 200 L 340 200', lx: 305, ly: 190, label: 'Heartbeat' },
        { d: 'M 270 285 L 340 255', lx: 305, ly: 275, label: 'Evict' },
        { d: 'M 610 210 L 680 210', lx: 645, ly: 200, label: 'Sync' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Pod Boots Up', stroke: '#38bdf8', lines: ['Kubernetes schedules pod', 'Pod obtains IP 10.0.1.4', 'Sends REGISTER to Consul'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Keepalive TTL', stroke: '#06b6d4', lines: ['Pod sends heartbeat every 5s', 'Registry marks state as PASSING', 'Subscribes to cluster watch'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Registry Sync', stroke: '#f59e0b', lines: ['Caller syncs healthy IP list', 'Caches list in local memory', 'Zero latency lookup'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Direct Dispatch', stroke: '#10b981', lines: ['Dispatches directly to pod IP', 'If node dies, TTL expires', 'Evicted before next request'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Register' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Liveness' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Route' }
      ],
      sections: [
        {
          heading: "Client-Side vs Server-Side Discovery",
          body: "In Server-Side Discovery (AWS ALB / Kubernetes ClusterIP Services), the client calls a static DNS/IP of a load balancer, which queries the registry and forwards the request. In Client-Side Discovery (Netflix Eureka, Consul with Envoy), the client directly queries the registry, caches the list of available healthy endpoints, and executes the load-balancing algorithm locally in process. This eliminates an intermediate load-balancer hop and prevents single-chokepoint bandwidth bottlenecks.",
          bullets: [
            "Kubernetes CoreDNS: In K8s, built-in kube-proxy and CoreDNS abstract discovery via Virtual ClusterIPs.",
            "Health Checking Protocols: Active HTTP probes (`/actuator/health`) combined with passive failure tripwires.",
            "Gossip Protocols: Consul uses Serf gossip protocol for efficient membership and failure detection."
          ]
        }
      ],
      tradeOffs: [
        { option: "Client-Side Discovery", pros: "Zero extra network hop, fine-grained client load balancing (sticky sessions, latency-aware), no central bottleneck.", cons: "Requires client-side library integration (Envoy/Spring); cache invalidation delay if instance dies suddenly.", bestFor: "High-scale internal service mesh networks." },
        { option: "Server-Side Discovery (K8s Service / ALB)", pros: "Language agnostic; simple standard DNS; zero client code needed.", cons: "Extra network hop through proxy; potential load balancer throughput limits.", bestFor: "Standard Kubernetes environments using native ClusterIP." }
      ],
      interviewTip: "In interviews, explain: 'In modern Kubernetes, Service Discovery is natively provided by kube-dns and CoreDNS via virtual ClusterIPs, but in multi-cluster or hybrid clouds, we use HashiCorp Consul or Istio ServiceEntry.'"
    },
    {
      id: "service-mesh",
      subtopicNumber: "2.4",
      title: "Service Mesh Architecture (Istio / Envoy)",
      subtitle: "Control plane vs data plane, transparent mTLS encryption, zero-trust security, and canary traffic routing.",
      readingTime: "9 min read",
      difficulty: "Staff+",
      accent: "#6366f1",
      keyTakeaways: [
        "A Service Mesh separates application business logic from network infrastructure by injecting a sidecar proxy (Envoy) next to every container.",
        "The Data Plane (Envoy proxies) intercepts all inbound and outbound network packets; the Control Plane (Istiod) manages policies and certificates.",
        "Provides transparent mutual TLS (mTLS) with SPIFFE/SPIRE cryptographic identities, zero-trust network encryption, and dynamic canary traffic splitting without code changes."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                   ISTIO SERVICE MESH CONTROL & DATA PLANE               |
+-------------------------------------------------------------------------+
  [Control Plane: Istiod] (Distributes Policies, Rotates mTLS X.509 Certs)
           |                                          |
           v (Dynamic xDS Configs)                    v
  +-----------------------+                  +-----------------------+
  |  Service A Pod        |                  |  Service B Pod        |
  |  [App A Container]    |                  |  [App B Container]    |
  |         ^             |                  |         ^             |
  |  (localhost loopback) |                  |  (localhost loopback) |
  |         v             |   mTLS Tunnel    |         v             |
  |  [Envoy Sidecar]      |=================>|  [Envoy Sidecar]      |
  +-----------------------+ (Encrypted Wire) +-----------------------+`,
      blockNodes: [
        { x: 50, y: 110, w: 260, h: 200, title: 'Service A Pod (Client)', stroke: '#38bdf8', lines: ['Order Service Container', 'Envoy Sidecar Proxy', 'Intercepts all outbound TCP', 'Injects trace headers'], tag: 'Data Plane A' },
        { x: 360, y: 150, w: 220, h: 120, title: 'Mutual TLS Tunnel', stroke: '#6366f1', lines: ['Cryptographic Identity (SPIFFE)', 'TLS 1.3 Wire Encryption', 'Zero-Trust Network Mesh'], tag: 'Secure Wire' },
        { x: 630, y: 110, w: 260, h: 200, title: 'Service B Pod (Target)', stroke: '#10b981', lines: ['Payment Service Container', 'Envoy Sidecar Proxy', 'Validates client cert', 'Applies canary traffic split'], tag: 'Data Plane B' },
        { x: 340, y: 20, w: 260, h: 80, title: 'Istio Control Plane (Istiod)', stroke: '#f59e0b', lines: ['Pushes dynamic xDS configs', 'Rotates TLS certificates'], tag: 'Control Plane' }
      ],
      blockConns: [
        { d: 'M 310 210 L 360 210', lx: 335, ly: 200, label: 'Outbound' },
        { d: 'M 580 210 L 630 210', lx: 605, ly: 200, label: 'Inbound' },
        { d: 'M 470 100 L 470 150', lx: 470, ly: 125, label: 'Policy' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'App Calls DNS', stroke: '#38bdf8', lines: ['App A calls http://payment-svc', 'iptables reroutes call to Envoy', 'App thinks it is plain HTTP'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'mTLS Handshake', stroke: '#6366f1', lines: ['Envoy A initiates mTLS handshake', 'Presents X.509 client certificate', 'Zero-trust identity validated'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Traffic Policy', stroke: '#10b981', lines: ['Envoy B validates authorization', 'Splits 95% v1, 5% v2 canary', 'Forwards clean HTTP via localhost'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Observability', stroke: '#a855f7', lines: ['Both Envoys flush trace spans', 'Jaeger draws complete trace graph', 'Prometheus records P99 latency'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Intercept' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Encrypt' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Verify' }
      ],
      sections: [
        {
          heading: "The Power and Latency Tax of the Service Mesh",
          body: "Before Service Mesh, every engineering team had to import language-specific libraries (Resilience4j in Java, Polly in C#, Hystrix) to handle retries, circuit breaking, distributed tracing, and mTLS. If you had 4 programming languages, you had to maintain 4 different client libraries. A Service Mesh extracts these infrastructure concerns out of application code into the Envoy proxy. The downside is the proxy latency tax: each inter-service call hops through two Envoy proxies (Client -> Envoy A -> Envoy B -> Target), adding 1–3 milliseconds of latency and extra memory footprint per pod.",
          bullets: [
            "SPIFFE/SPIRE: Secure Production Identity Framework for Enterprise provides cryptographically verifiable service IDs.",
            "Canary Releases & Fault Injection: Shift 5% of production traffic to new releases or inject 500ms delay to test resilience.",
            "Ambient Mesh: Istio Ambient mesh eliminates sidecars by running shared node-level Layer 4 proxies (ztunnel), slashing memory overhead by 80%."
          ],
          codeSnippet: {
            title: "Istio VirtualService Defining a 90/10 Canary Traffic Split",
            code: `apiVersion: networking.istio.io/v1alpha3\nkind: VirtualService\nmetadata:\n  name: payment-route\nspec:\n  hosts:\n  - payment-service\n  http:\n  - route:\n    - destination:\n        host: payment-service\n        subset: v1\n      weight: 90\n    - destination:\n        host: payment-service\n        subset: v2\n      weight: 10`
          }
        }
      ],
      tradeOffs: [
        { option: "Service Mesh (Istio / Envoy)", pros: "Language-agnostic mTLS encryption, transparent distributed tracing, advanced canary routing, zero app code changes.", cons: "Adds 1–3ms latency overhead per hop; significant memory footprint (50–100MB per pod); steep operational complexity.", bestFor: "Large polyglot enterprises with strict zero-trust security or complex compliance mandates." },
        { option: "Application Libraries (gRPC + Resilience4j)", pros: "Zero extra proxy processes, lowest possible latency, simple local debugging.", cons: "Must re-implement and update libraries across every language stack; no centralized policy management.", bestFor: "Monoglot shops (e.g. 100% Go or 100% Java) with extreme sub-millisecond latency requirements." }
      ],
      interviewTip: "In Staff+ interviews, discuss trade-offs: 'While a Service Mesh provides automated mTLS and observability, I will evaluate the 2ms proxy latency overhead and memory cost against our system's SLA before deciding to adopt Istio.'"
    },
    {
      id: "sidecar-ambassador",
      subtopicNumber: "2.5",
      title: "Sidecar & Ambassador Proxy Patterns",
      subtitle: "Loopback IPC, logging sidecars (FluentBit), Vault secret injection, and proxying egress third-party calls.",
      readingTime: "7 min read",
      difficulty: "Intermediate",
      accent: "#f59e0b",
      keyTakeaways: [
        "The **Sidecar Pattern** deploys a helper container alongside the primary application container in the same Kubernetes Pod, sharing network namespace and storage volumes.",
        "The **Ambassador Pattern** acts as an out-of-process egress proxy, mediating calls from the application to external third-party APIs or legacy databases.",
        "Communication between the primary application and sidecar happens over high-speed localhost IPC (`127.0.0.1`), eliminating physical network serialization."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  SIDECAR & AMBASSADOR POD TOPOLOGY                      |
+-------------------------------------------------------------------------+
  +---------------------------------------------------------------------+
  |                       KUBERNETES POD BOUNDARY                       |
  |  +--------------------+   localhost:8080   +---------------------+  |
  |  | Main Application   | <================> | Envoy Sidecar Proxy |  |
  |  | (Node.js/Go logic) |                    | (Ingress/mTLS Guard)|  |
  |  +---------+----------+                    +----------+----------+  |
  |            | shared volume                            |             |
  |            v                                          v             |
  |  +--------------------+                    +---------------------+  |
  |  | FluentBit Sidecar  |                    | Ambassador Proxy    |  |
  |  | (Log Shipper)      |                    | (Egress to Stripe)  |  |
  |  +--------------------+                    +---------------------+  |
  +---------------------------------------------------------------------+`,
      blockNodes: [
        { x: 50, y: 110, w: 260, h: 200, title: 'Main App Container', stroke: '#10b981', lines: ['Node.js / Java App', 'Focuses purely on business rules', 'Writes logs to shared /var/log', 'Calls 127.0.0.1:9000 for egress'], tag: 'Primary App' },
        { x: 370, y: 90, w: 260, h: 105, title: 'Logging Sidecar (FluentBit)', stroke: '#38bdf8', lines: ['Tails shared /var/log', 'Parses JSON & redacts PII', 'Flushes to ElasticSearch'], tag: 'Sidecar A' },
        { x: 370, y: 205, w: 260, h: 105, title: 'Ambassador Proxy', stroke: '#f59e0b', lines: ['Proxies outbound Stripe calls', 'Injects Vault secrets & mTLS', 'Handles external retries'], tag: 'Ambassador' },
        { x: 690, y: 110, w: 260, h: 200, title: 'External Cloud Infrastructure', stroke: '#a855f7', lines: ['Datadog / OpenSearch', 'Stripe Banking API (External)', 'AWS RDS Database'], tag: 'External' }
      ],
      blockConns: [
        { d: 'M 310 160 L 370 140', lx: 340, ly: 145, label: 'Shared Disk' },
        { d: 'M 310 240 L 370 240', lx: 340, ly: 230, label: '127.0.0.1' },
        { d: 'M 630 140 L 690 160', lx: 660, ly: 145, label: 'Shipped' },
        { d: 'M 630 250 L 690 240', lx: 660, ly: 250, label: 'Egress' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Outbound Intent', stroke: '#10b981', lines: ['App needs to charge credit card', 'Calls http://127.0.0.1:9000', 'Zero API keys stored in app'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Ambassador Decorates', stroke: '#f59e0b', lines: ['Ambassador injects secret token', 'Applies circuit breaker', 'Establishes TLS to stripe.com'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Remote Execution', stroke: '#38bdf8', lines: ['Stripe processes payment', 'Returns 200 OK or error', 'Ambassador captures metrics'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Log Interception', stroke: '#a855f7', lines: ['App writes audit line to disk', 'FluentBit sidecar ships log async', 'App unblocks immediately'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Loopback' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Decorate' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Audit' }
      ],
      sections: [
        {
          heading: "Practical Uses: Secrets, Logging, and Database Proxies",
          body: "The Sidecar pattern shines when you want to augment a service without modifying its source code. In Kubernetes, Vault Agent sidecars automatically authenticate with HashiCorp Vault, fetch dynamic database credentials, write them to a shared in-memory volume (`/vault/secrets`), and keep them refreshed before token expiry. The application simply reads credentials from a local file without needing Vault SDKs or custom auth logic.",
          bullets: [
            "AWS Secrets / Vault Agent: Injects database passwords into shared `/dev/shm` RAM disk.",
            "Database Connection Pooling: Run a PgBouncer sidecar inside the pod to multiplex thousands of transient PostgreSQL connections.",
            "Localhost Speed: Calls between main container and sidecar over loopback `127.0.0.1` take under 0.1ms."
          ]
        }
      ],
      tradeOffs: [
        { option: "Sidecar Pattern", pros: "Clean separation of operational concerns, language-independent, shares pod lifecycle and security context.", cons: "Increases pod startup time; uses extra CPU/RAM per pod.", bestFor: "Logging agents, secret injection, and mesh proxies." },
        { option: "In-Process Library", pros: "Lowest memory footprint, zero extra container management overhead.", cons: "Ties application to specific language version; upgrades require redeploying app binary.", bestFor: "High-performance microbenchmarks where container count must be minimized." }
      ],
      interviewTip: "When asked about managing secret rotation in microservices, suggest: 'I prefer using a HashiCorp Vault Agent sidecar inside the pod that automatically rotates database credentials in a shared RAM volume, preventing developers from hardcoding secrets in environment variables.'"
    }
  ]
};

module.exports = {
  MODULE_2_INGRESS
};
