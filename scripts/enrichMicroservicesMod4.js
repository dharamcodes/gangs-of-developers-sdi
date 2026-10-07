/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

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
        "Static timeouts are insufficient for multi-tier architectures; use Context Deadline Propagation (e.g. gRPC grpc-timeout or HTTP X-Client-Timeout-Budget).",
        "If a client gives an operation a total budget of 1,000ms, and Step 1 consumes 800ms, Step 2 must be allocated only the remaining 200ms—not a fresh 1,000ms.",
        "Fail Fast: If a service receives a request whose deadline has already expired before processing begins, it must immediately reject it with HTTP 504 Gateway Timeout."
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
            "Thread Starvation: A 30-second default HTTP timeout in a service processing 100 requests/sec will consume 3,000 concurrent threads, crashing the process with OutOfMemoryError.",
            "Always Define Explicit Timeouts: Never rely on default HTTP/gRPC client timeouts, which are frequently infinite or set to multiple minutes."
          ]
        },
        {
          heading: "2. The Deadline Propagation Mechanism: End-to-End Latency Budgets",
          body: "Static timeouts on individual services are fundamentally flawed in multi-hop call graphs. If Service A has a 5-second timeout, Service B has a 5-second timeout, and Service C has a 5-second timeout, a user request can hang for 15 seconds! Conversely, if Service A times out after 2 seconds and returns an error to the user, but Service B and C continue computing for another 10 seconds, the cluster wastes expensive CPU and database resources on a request the user has already abandoned. The solution is Context Deadline Propagation.",
          bullets: [
            "gRPC grpc-timeout Header: Native standard in gRPC that communicates the remaining execution time as an absolute deadline or millisecond budget.",
            "HTTP X-Request-Deadline Header: Propagates unix epoch timestamps indicating when the caller will abort the request.",
            "Dynamic Budget Subtraction: Each hop subtracts its own elapsed execution time and passes only the remaining delta to downstream dependencies."
          ]
        },
        {
          heading: "3. Fail-Fast Optimization: Shedding Dead Requests",
          body: "Deadline propagation enables one of the most powerful performance optimizations in high-scale systems: Fail-Fast Request Shedding.",
          bullets: [
            "Pre-Execution Inspection: Before executing an expensive SQL query or calling a machine learning inference model, the service inspects context.Deadline(). If the deadline has already expired while the request sat in the local web server queue, the service drops the request immediately without touching the database.",
            "Cancelling In-Flight Operations: When a parent context expires, Go contexts and gRPC cancellation tokens immediately terminate in-flight child network sockets, freeing thread resources."
          ]
        },
        {
          heading: "4. Production Blueprint: Go Context Propagation & Deadline Enforcement",
          body: "The following production Go snippet demonstrates receiving an incoming HTTP deadline header, establishing a context with timeout, and propagating the remaining budget to a downstream client.",
          bullets: [
            "Header Parsing: Parses X-Request-Deadline-Ms and bounds it by a local maximum ceiling.",
            "Context Cancellation: Automatically releases HTTP connection resources via context.WithTimeout."
          ],
          codeSnippet: {
            title: "Go Context Deadline Propagation Middleware & Client",
            code: `package middleware\n\nimport (\n    "context"\n    "net/http"\n    "strconv"\n    "time"\n)\n\nfunc DeadlinePropagationMiddleware(next http.Handler) http.Handler {\n    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        // Default max budget: 2000ms\n        budget := 2000 * time.Millisecond\n\n        if deadlineHeader := r.Header.Get("X-Client-Timeout-Budget-Ms"); deadlineHeader != "" {\n            if ms, err := strconv.ParseInt(deadlineHeader, 10, 64); err == nil && ms > 0 {\n                budget = time.Duration(ms) * time.Millisecond\n            }\n        }\n\n        ctx, cancel := context.WithTimeout(r.Context(), budget)\n        defer cancel()\n\n        // Fail fast if already expired\n        if ctx.Err() != nil {\n            http.Error(w, "Gateway Timeout: Deadline already expired", http.StatusGatewayTimeout)\n            return\n        }\n\n        next.ServeHTTP(w, r.WithContext(ctx))\n    })\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Context Deadline Propagation", pros: "Eliminates phantom execution on abandoned requests; prevents cascading wait times; enables fail-fast load shedding.", cons: "Requires strict context passing discipline in code; potential clock drift issues if using absolute epoch timestamps instead of relative duration budgets.", bestFor: "All modern microservices architectures (standard in gRPC and OpenTelemetry)." },
        { option: "Static Timeouts per Service", pros: "Simple to configure in YAML/properties files on individual services.", cons: "Compounding latency hops; downstream services waste CPU computing abandoned results.", bestFor: "Simple 2-tier client-server architectures only." },
        { option: "No Timeouts (Infinite)", pros: "None.", cons: "Guaranteed thread starvation, cluster-wide cascade crashes, and operational downtime.", bestFor: "Never acceptable under any circumstances." }
      ],
      interviewTip: "In architecture interviews, emphasize end-to-end latency budgets: 'I never configure static timeouts in isolation. I implement Context Deadline Propagation. The API gateway sets a global latency budget (e.g. 1500ms). Each downstream service extracts the budget, subtracts elapsed time, and forwards the remaining delta. If a request deadline expires while sitting in a queue, the service drops it immediately, protecting our database and thread pools from cascading starvation.'"
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
        "Exponential Backoff doubles the wait duration after each consecutive failure: T = base * 2^attempt.",
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
          heading: "1. The Danger of Retry Storms: Self-Inflicted Denial of Service",
          body: "When a database or microservice experiences a momentary spike in load, its response times increase and a fraction of requests begin timing out. If upstream clients immediately retry failed requests without delay, the total traffic volume instantly doubles. If 1,000 clients fail at time T, and all 1,000 immediately retry at T + 100ms, they hit the struggling service with a synchronized tsunami of traffic known as a 'Retry Storm' or 'Thundering Herd.' Instead of recovering, the service collapses under self-inflicted DDoS load. Sophisticated retry algorithms are required to decouple and smooth out traffic.",
          bullets: [
            "Traffic Multiplier: If each service in a 3-tier chain retries 3 times, a single client request can trigger 3 * 3 * 3 = 27 calls to the backend database.",
            "Retry Budgets: A service should limit retries to at most 10% of total incoming traffic; if error rates surpass 10%, retries are disabled globally to protect downstream systems.",
            "Non-Retryable Errors: Never retry HTTP 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, or 422 Unprocessable Entity—these indicate client bugs that will fail 100% of the time."
          ]
        },
        {
          heading: "2. The Mathematics of Backoff: Full Jitter vs Equal Jitter",
          body: "Exponential backoff increases the delay between retries exponentially: Delay = Base * 2^attempt. For example, with a base of 100ms: attempt 1 waits 200ms, attempt 2 waits 400ms, attempt 3 waits 800ms. However, pure exponential backoff without randomness still synchronizes client retries in clustered bursts. In a seminal paper, Amazon Architecture evaluated backoff algorithms and proved that 'Full Jitter' provides the highest throughput and lowest lock contention.",
          bullets: [
            "Pure Exponential Backoff: Sleep = min(Cap, Base * 2^attempt). Problem: All clients that failed at T still retry at the exact same instant.",
            "Full Jitter (Amazon Standard): Sleep = random(0, min(Cap, Base * 2^attempt)). Distributes retries uniformly across the entire backoff window, completely smoothing traffic spikes.",
            "Decorrelated Jitter: Sleep = min(Cap, random(Base, previous_sleep * 3)). Prevents clustering across long retry sequences."
          ]
        },
        {
          heading: "3. Circuit Breaker Synergy & Idempotency Safeguards",
          body: "Retries should never exist in isolation; they must be integrated with Idempotency and Circuit Breakers.",
          bullets: [
            "Idempotency Requirement: Retrying a non-idempotent HTTP POST /payments without an Idempotency-Key risks charging a customer twice if the initial request succeeded on the server but timed out on the return wire.",
            "Circuit Breaker Coordination: If a downstream service has failed completely, retrying 3 times on every request wastes time and resources. The Circuit Breaker trips to OPEN, immediately failing fast without executing retries."
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
            code: `export interface RetryConfig {\n  maxAttempts: number;\n  baseMs: number;\n  capMs: number;\n}\n\nexport async function executeWithFullJitter<T>(\n  fn: () => Promise<T>,\n  config: RetryConfig = { maxAttempts: 3, baseMs: 100, capMs: 2000 }\n): Promise<T> {\n  let attempt = 0;\n\n  while (true) {\n    try {\n      return await fn();\n    } catch (error: any) {\n      attempt++;\n      if (attempt >= config.maxAttempts || !isTransientError(error)) {\n        throw error;\n      }\n\n      // Amazon Full Jitter Formula: rand(0, min(cap, base * 2^attempt))\n      const exponentialMax = Math.min(config.capMs, config.baseMs * Math.pow(2, attempt));\n      const jitterSleepMs = Math.floor(Math.random() * exponentialMax);\n\n      console.warn(\`Attempt \${attempt} failed. Retrying in \${jitterSleepMs}ms...\`);\n      await new Promise((resolve) => setTimeout(resolve, jitterSleepMs));\n    }\n  }\n}\n\nfunction isTransientError(error: any): boolean {\n  const status = error?.response?.status;\n  return status === 503 || status === 504 || status === 429 || error.code === 'ECONNRESET';\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Exponential Backoff with Full Jitter", pros: "Mathematically proven to eliminate retry storms; smooths traffic spikes; gives failing systems breathing room to recover.", cons: "Adds variable latency to failed requests; requires proper timeout budget tracking.", bestFor: "All external API calls, microservice RPCs, and database reconnection logic." },
        { option: "Immediate Fixed Retry", pros: "Fastest recovery if glitch was truly instantaneous.", cons: "Triggers catastrophic retry storms and thundering herds during real outages; accelerates cluster collapse.", bestFor: "Never recommended in distributed multi-node systems." },
        { option: "No Retry (Fail Immediately)", pros: "Zero retry storm risk; lowest server overhead.", cons: "Fragile user experience; every single dropped packet surfaces as an error to the end user.", bestFor: "Non-idempotent operations without idempotency keys." }
      ],
      interviewTip: "When asked how to handle transient errors in an architecture interview, be mathematically precise: 'I implement Exponential Backoff with Amazon Full Jitter. Immediate retries create retry storms that amplify outages. With Full Jitter, each client calculates sleep = rand(0, min(cap, base * 2^attempt)), uniformly dispersing retry traffic across time and allowing the downstream service to heal.'"
    },
    {
      id: "circuit-breaker",
      subtopicNumber: "4.3",
      title: "Circuit Breaker Pattern",
      subtitle: "Preventing cascading systemic collapse via CLOSED, OPEN, and HALF-OPEN states, failure ring buffers, and fast fallback.",
      readingTime: "8 min read",
      difficulty: "Intermediate",
      accent: "#ef4444",
      keyTakeaways: [
        "A Circuit Breaker wraps remote network calls and trips open when downstream failure rates cross a configured threshold (e.g. > 50%).",
        "When OPEN, requests fail fast immediately (in 1ms) without making network calls, preventing client threads from hanging and exhausting resources.",
        "After a wait duration, the breaker transitions to HALF-OPEN and sends trial probe requests; if they succeed, it resets to CLOSED.",
        "Always combine Circuit Breakers with meaningful fallbacks: serving stale cached data or queueing requests for asynchronous processing."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  CIRCUIT BREAKER STATE MACHINE TOPOLOGY                 |
+-------------------------------------------------------------------------+
                    Failures > Threshold
       +------------(Trip Circuit)------------+
       |                                      |
       v                                      v
  [CLOSED] <=======(Trial Calls OK)====== [HALF-OPEN]
  (Normal Traffic)                         (Probe Calls)
       ^                                      ^
       |                                      |
       +-----------(Wait Reset Timeout)-------+
                      [OPEN: Fast-Fail]`,
      blockNodes: [
        { x: 50, y: 110, w: 260, h: 200, title: 'Calling Client', stroke: '#38bdf8', lines: ['Order Service (Spring Boot)', 'POST /charges endpoint', 'Resilience4j Circuit Breaker', 'RingBuffer size: 100 calls'], tag: 'Caller' },
        { x: 370, y: 110, w: 260, h: 200, title: 'Circuit Breaker Guard', stroke: '#ef4444', lines: ['State: CLOSED (Pass)', 'State: OPEN (Fast Fail)', 'State: HALF-OPEN (Probes)', 'Failure threshold: 50%'], tag: 'Interceptor' },
        { x: 690, y: 80, w: 260, h: 90, title: 'Downstream Service', stroke: '#10b981', lines: ['Payment Gateway', 'Healthy latency: 40ms'], tag: 'Target Svc' },
        { x: 690, y: 190, w: 260, h: 120, title: 'Fallback Queue / Cache', stroke: '#f59e0b', lines: ['Degraded response / Queue', 'Returns HTTP 202 Accepted', 'Zero caller thread starvation'], tag: 'Fallback' }
      ],
      blockConns: [
        { d: 'M 310 210 L 370 210', lx: 340, ly: 200, label: '1. Call' },
        { d: 'M 630 160 L 690 125', lx: 660, ly: 135, label: '2a. Pass' },
        { d: 'M 630 250 L 690 250', lx: 660, ly: 240, label: '2b. Trip' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Normal Traffic', stroke: '#38bdf8', lines: ['Breaker is CLOSED', 'Calls forwarded directly', 'Downstream 200 OK'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Threshold Trip', stroke: '#ef4444', lines: ['Target throws 503 or hangs', 'Failures exceed 50%', 'Breaker transitions to OPEN'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Fast-Fail Shield', stroke: '#f59e0b', lines: ['Calls blocked immediately', 'Executes Fallback lambda', 'Returns 202 without hang'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Half-Open Probe', stroke: '#10b981', lines: ['Wait 10s reset timeout', 'Sends 5 probe calls', 'If probes pass, reset CLOSED'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Traffic' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Trip' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Probe' }
      ],
      sections: [
        {
          heading: "1. The 3-State Lifecycle: CLOSED, OPEN, and HALF-OPEN",
          body: "Inspired by electrical circuit breakers that shut off power during current spikes, a software Circuit Breaker wraps network calls. In the CLOSED state, operations pass normally while tracking failure rates across a sliding window ring buffer (e.g. last 100 calls). If the failure rate crosses a threshold (e.g., 50% errors or calls exceeding 2,000ms), the breaker trips to OPEN. In the OPEN state, all incoming requests fail fast immediately in under 1 millisecond without touching the network. After a configured sleep duration (e.g., 15 seconds), it enters HALF-OPEN, allowing a controlled trickle of probe requests through. If probes succeed, it resets to CLOSED; if any probe fails, it returns to OPEN.",
          bullets: [
            "CLOSED: Normal routing. Ring buffer records call outcomes (Success / Error / Slow).",
            "OPEN: Fast-fail protection. Calls short-circuit instantly, invoking fallback code and protecting thread pools.",
            "HALF-OPEN: Self-healing probe state. Sends a small sample of canary calls to test backend recovery."
          ]
        },
        {
          heading: "2. Sliding Window Ring Buffers: Count-Based vs Time-Based",
          body: "Modern circuit breakers (like Resilience4j or Polly) track failure rates using sliding windows rather than naive counters.",
          bullets: [
            "Count-Based Sliding Window: Evaluates the last N calls (e.g. 100 requests). Ideal for high-throughput microservices where traffic is steady.",
            "Time-Based Sliding Window: Evaluates calls over the last N seconds (e.g. last 60 seconds). Ideal for low-volume or sporadic services where 100 calls might take hours.",
            "Slow Call Rate Threshold: A call does not have to throw an exception to be counted as a failure; if 40% of calls take longer than 1.5 seconds, the breaker trips to protect latency SLAs."
          ]
        },
        {
          heading: "3. Meaningful Fallbacks: The Keystone of User Experience",
          body: "A circuit breaker tripping open should not simply throw an exception to the user; it should execute a structured Fallback Strategy.",
          bullets: [
            "Stale Cache Fallback: Returns the cached response from 5 minutes ago (perfect for product catalogs and currency exchange rates).",
            "Asynchronous Queueing: Drops payment requests into an offline dead-letter queue, returning HTTP 202 Accepted ('Payment queued for verification').",
            "Static Defaults: In a personalized news feed, returns the global top-10 trending articles if the machine learning ranking service circuit is OPEN."
          ]
        },
        {
          heading: "4. Production Blueprint: Resilience4j Circuit Breaker in Java",
          body: "The following Java snippet demonstrates an enterprise Resilience4j circuit breaker with custom failure thresholds, sliding windows, and fallback handling.",
          bullets: [
            "Custom Thresholds: Trips open if 50% of calls fail or if 30% take over 2 seconds.",
            "Fallback Execution: Automatically invokes fallback when circuit is OPEN or throws an exception."
          ],
          codeSnippet: {
            title: "Java 21 Resilience4j Circuit Breaker Configuration",
            code: `@Service\npublic class PaymentGatewayClient {\n    private final CircuitBreaker circuitBreaker;\n\n    public PaymentGatewayClient(CircuitBreakerRegistry registry) {\n        CircuitBreakerConfig config = CircuitBreakerConfig.custom()\n            .failureRateThreshold(50.0f)\n            .slowCallRateThreshold(30.0f)\n            .slowCallDurationThreshold(Duration.ofSeconds(2))\n            .slidingWindowType(SlidingWindowType.COUNT_BASED)\n            .slidingWindowSize(100)\n            .minimumNumberOfCalls(20)\n            .waitDurationInOpenState(Duration.ofSeconds(15))\n            .permittedNumberOfCallsInHalfOpenState(5)\n            .build();\n        this.circuitBreaker = registry.circuitBreaker("paymentService", config);\n    }\n\n    public PaymentResult processPayment(PaymentRequest request) {\n        Supplier<PaymentResult> decorated = CircuitBreaker\n            .decorateSupplier(circuitBreaker, () -> callStripeAPI(request));\n        return Try.ofSupplier(decorated)\n            .recover(CallNotPermittedException.class, ex -> fallbackOfflineQueue(request))\n            .recover(Exception.class, ex -> fallbackOfflineQueue(request))\n            .get();\n    }\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Resilience4j / Envoy Circuit Breakers", pros: "Completely prevents cascading cluster outages; automatic self-healing probe recovery; sub-millisecond fast fail.", cons: "Adds slight in-memory ring-buffer tracking overhead; requires careful threshold tuning.", bestFor: "All synchronous network RPCs in production microservices." },
        { option: "Naive HTTP Client Calls", pros: "Zero configuration.", cons: "Downstream hiccups instantly cause thread pool starvation and bring down upstream services.", bestFor: "Never acceptable in production microservices." },
        { option: "Service Mesh Mesh-Level Breakers", pros: "Zero application code; configured via Istio DestinationRule YAML manifests.", cons: "Harder to write custom application-level fallback logic (like querying a stale cache).", bestFor: "Platform-wide infrastructure protection." }
      ],
      interviewTip: "In interviews, clearly contrast a timeout with a circuit breaker: 'A timeout protects a single request thread from hanging forever. A circuit breaker protects the entire service fleet from cascading thread exhaustion when thousands of requests hang, short-circuiting failing calls in under 1ms and triggering graceful fallbacks.'"
    },
    {
      id: "rate-limiting",
      subtopicNumber: "4.4",
      title: "Distributed Rate Limiting & Throttling",
      subtitle: "Token Bucket, Leaky Bucket, Sliding Window Counter algorithms, and Redis cluster rate limiting.",
      readingTime: "8 min read",
      difficulty: "Intermediate",
      accent: "#3b82f6",
      keyTakeaways: [
        "Rate limiting protects services from denial-of-service, abusive scrapers, and cascading overload by capping the request rate per client.",
        "The Token Bucket algorithm allows for bursts of traffic up to the bucket capacity while maintaining a stable average refill rate.",
        "In distributed environments, use Redis Lua scripts or Sliding Window Counters to prevent race conditions across multiple gateway nodes.",
        "Standard RFC 6585 HTTP headers (X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After) communicate quota status to clients."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  TOKEN BUCKET RATE LIMITING TOPOLOGY                    |
+-------------------------------------------------------------------------+
       [Refill Clock: +10 tokens/sec] ===> [Token Bucket: Max 50]
                                                  |
[Client Request Arrival] =========================+
                                                  |
                            (Bucket has tokens?)  |
                            /                  \\  |
                         [YES]                 [NO]
                         /                        \\
             (Deduct 1 Token: Allow)         (Reject: HTTP 429 Too Many)
             (Forward to Microservice)       (Retry-After: 3 seconds)`,
      blockNodes: [
        { x: 50, y: 110, w: 260, h: 200, title: 'Inbound Ingress Traffic', stroke: '#38bdf8', lines: ['Client IP / API Key', 'GET /api/v1/search', 'Burst spikes (100 req/s)', 'Client quota: 50 req/min'], tag: 'Clients' },
        { x: 370, y: 110, w: 260, h: 200, title: 'Redis Rate Limiter', stroke: '#3b82f6', lines: ['Token Bucket Engine', 'Atomic Lua Script execution', 'Tracks tokens & last_refill', 'Sub-millisecond lookup'], tag: 'Limiter' },
        { x: 690, y: 80, w: 260, h: 90, title: 'Downstream Microservice', stroke: '#10b981', lines: ['Protected internal service', 'Processes steady traffic'], tag: 'Pass (200 OK)' },
        { x: 690, y: 190, w: 260, h: 120, title: 'Rate Limit Response (429)', stroke: '#ef4444', lines: ['HTTP 429 Too Many Requests', 'Header: Retry-After: 3', 'Header: X-RateLimit-Remaining: 0'], tag: 'Reject (429)' }
      ],
      blockConns: [
        { d: 'M 310 210 L 370 210', lx: 340, ly: 200, label: 'Check' },
        { d: 'M 630 160 L 690 125', lx: 660, ly: 135, label: 'Tokens OK' },
        { d: 'M 630 250 L 690 250', lx: 660, ly: 240, label: 'Exceeded', stroke: '#ef4444' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Request Arrival', stroke: '#38bdf8', lines: ['Client arrives with API Key', 'Key maps to rate bucket', 'Gateway intercepts call'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Redis Lua Script', stroke: '#3b82f6', lines: ['Calculates refilled tokens', 'If tokens >= 1: decr token', 'Returns remaining count'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Forward or Drop', stroke: '#10b981', lines: ['If allowed: Forward to Svc', 'If zero tokens: Drop call', 'Returns HTTP 429 status'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Client Backoff', stroke: '#f59e0b', lines: ['Client inspects Retry-After', 'Waits for bucket refill', 'Protects backend from crash'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Ingress' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Token' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Enforce' }
      ],
      sections: [
        {
          heading: "1. The 4 Rate Limiting Algorithms: Token Bucket, Leaky Bucket, Fixed, and Sliding Window",
          body: "Rate limiting is the defensive boundary protecting microservices from DDoS attacks, web scrapers, runaway scripts, and noisy neighbors. There are four primary algorithms:\n1. Token Bucket: Maintains a bucket with maximum capacity that refills at a fixed rate. Requests consume tokens. Allows natural bursts while enforcing a steady rate.\n2. Leaky Bucket: Requests enter a queue and are processed at an unvarying constant rate. Best for smoothing out spikes before calling external payment APIs.\n3. Fixed Window Counter: Counts requests within 1-minute blocks. Vulnerable to 2x burst traffic across window boundaries.\n4. Sliding Window Counter: Combines current window counts with a weighted percentage of the previous window, preventing boundary bursts with minimal memory.",
          bullets: [
            "Token Bucket Advantage: Accommodates bursts (e.g. user opening a screen with 15 parallel images) without rejecting valid traffic.",
            "Tiered Quotas: Rate limits should be tiered by user authentication level: 10 req/min for anonymous IP, 1,000 req/min for authenticated users, 10,000 req/min for enterprise tier."
          ]
        },
        {
          heading: "2. Distributed Rate Limiting via Redis Lua Scripts",
          body: "In a multi-node API gateway cluster (e.g. 10 Envoy or Spring Cloud Gateway pods), rate limits cannot be tracked in local server memory; an attacker could bypass limits by spreading traffic across all 10 pods. Distributed rate limiting stores bucket counters in Redis. However, executing separate `GET`, calculate, and `SET` commands creates race conditions. The solution is executing the calculation inside an atomic Redis Lua Script.",
          bullets: [
            "Atomic Lua Execution: The entire token calculation, refill, and deduction executes atomically in Redis in a single round-trip.",
            "Sub-Millisecond Overhead: Redis evaluates the Lua script in memory in under 0.5 milliseconds.",
            "Clustering & Sharding: Keys are hashed by `rate_limit:{user_id}`, sharding evenly across Redis Cluster nodes."
          ]
        },
        {
          heading: "3. Failure Modes: Redis Failover & Fallback Modes",
          body: "What happens when the Redis rate limit cluster crashes or experiences high network latency?",
          bullets: [
            "Fail-Open vs Fail-Closed: Fail-Open permits requests to pass if Redis is unreachable (protects user experience at the risk of backend overload). Fail-Closed blocks traffic (protects backend at the cost of availability). Modern systems Fail-Open for authenticated users and Fail-Closed for anonymous traffic.",
            "Rate Limit Header Standards: Always return `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `Retry-After: <seconds>` on HTTP 429."
          ]
        },
        {
          heading: "4. Production Blueprint: Redis Token Bucket Lua Script in Go",
          body: "The following Go and Redis Lua implementation demonstrates an atomic token bucket algorithm computing continuous refills.",
          bullets: [
            "Continuous Refill Math: Refill is calculated based on `(now - last_update) * refill_rate`.",
            "TTL Cleanup: Keys automatically expire after inactivity to prevent Redis memory leaks."
          ],
          codeSnippet: {
            title: "Atomic Redis Token Bucket Lua Script in Go",
            code: `package ratelimit\n\nimport (\n    "context"\n    "time"\n    "github.com/redis/go-redis/v9"\n)\n\nconst tokenBucketLua = \`\nlocal key = KEYS[1]\nlocal capacity = tonumber(ARGV[1])\nlocal refill_rate = tonumber(ARGV[2])\nlocal now = tonumber(ARGV[3])\nlocal requested = tonumber(ARGV[4])\n\nlocal data = redis.call("HMGET", key, "tokens", "last_updated")\nlocal tokens = tonumber(data[1])\nlocal last_updated = tonumber(data[2])\n\nif not tokens then\n    tokens = capacity\n    last_updated = now\nelse\n    local delta = math.max(0, now - last_updated)\n    tokens = math.min(capacity, tokens + delta * refill_rate)\n    last_updated = now\nend\n\nif tokens >= requested then\n    tokens = tokens - requested\n    redis.call("HMSET", key, "tokens", tokens, "last_updated", last_updated)\n    redis.call("EXPIRE", key, math.ceil(capacity / refill_rate) * 2)\n    return {1, math.floor(tokens)} -- Allowed\nelse\n    redis.call("HMSET", key, "tokens", tokens, "last_updated", last_updated)\n    return {0, math.floor(tokens)} -- Blocked (HTTP 429)\nend\n\`\n\nfunc CheckRateLimit(ctx context.Context, rdb *redis.Client, key string, capacity, rate float64) (bool, int64, error) {\n    res, err := rdb.Eval(ctx, tokenBucketLua, []string{"rate:" + key}, capacity, rate, time.Now().Unix(), 1).Slice()\n    if err != nil { return true, 0, err } // Fail-open on Redis error\n    allowed := res[0].(int64) == 1\n    remaining := res[1].(int64)\n    return allowed, remaining, nil\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Redis Token Bucket (Distributed)", pros: "Allows natural traffic bursts; shared across all gateway nodes; sub-ms evaluation; atomic Lua script safety.", cons: "Adds a network hop to Redis for every incoming HTTP call; Redis is a critical cluster dependency.", bestFor: "Standard microservices API Gateways (Kong, Envoy, Spring Cloud)." },
        { option: "In-Memory Rate Limiting (Local)", pros: "Zero network latency; no external Redis cluster needed.", cons: "Rate limits cannot be synchronized across auto-scaled pods; scaling from 2 to 10 pods multiplies total allowed traffic 5x.", bestFor: "Single-instance services or host-level security agents." },
        { option: "Cloud WAF Rate Limiting (Cloudflare / AWS WAF)", pros: "Drops abusive traffic at the edge before it enters your VPC; zero server compute cost.", cons: "Less granular business logic (cannot easily rate limit based on internal user tier DTOs).", bestFor: "DDoS and bot mitigation at the public edge." }
      ],
      interviewTip: "When designing rate limiters in interviews, draw the Token Bucket and write down the Redis Lua formula: `tokens = min(capacity, current_tokens + (now - last_refill) * rate)`. Emphasize that executing in Lua prevents race conditions between parallel gateway pods, and return standard RFC headers (`Retry-After`)."
    },
    {
      id: "graceful-degradation",
      subtopicNumber: "4.5",
      title: "Graceful Degradation & Fallback Strategies",
      subtitle: "Serving stale caches, static defaults, load shedding non-essential features, and partial UI rendering.",
      readingTime: "8 min read",
      difficulty: "Intermediate",
      accent: "#10b981",
      keyTakeaways: [
        "Graceful degradation ensures that when non-critical subsystems fail, the core user experience continues functioning in a degraded mode.",
        "Amazon's classic principle: If the Recommendation service fails, render the product page without recommendations; never show a 500 error page.",
        "Load Shedding: During massive traffic surges (e.g. Black Friday), automatically disable heavy non-revenue features (like real-time recommendation ML models) to protect checkout.",
        "Stale-While-Revalidate: Serve cached data even after expiration if the origin service is experiencing timeouts."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  GRACEFUL DEGRADATION: E-COMMERCE CHECKOUT              |
+-------------------------------------------------------------------------+
 [Product Page Request]
           |
           +---> [Catalog Service]   ===> 200 OK (Product Info, Price, BUY BUTTON)
           |
           +---> [Reviews Service]   ===> TIMEOUT! (Falls back to cached 4.5 Stars)
           |
           +---> [Recommender Svc]   ===> 503 ERROR! (Falls back to Static Top 10)
           |
           v
 [Client Receives Fully Functional Web Page with Buy Button Intact!]`,
      blockNodes: [
        { x: 50, y: 120, w: 250, h: 180, title: 'Critical Path (Must Work)', stroke: '#10b981', lines: ['Catalog: Product Name & SKU', 'Inventory: In Stock Check', 'Checkout: Buy Now Button', 'Strict 99.99% availability'], tag: 'Core Path' },
        { x: 360, y: 100, w: 270, h: 220, title: 'Degradation Engine', stroke: '#f59e0b', lines: ['Evaluates component health', 'Dynamic feature toggles', 'Stale cache fallback', 'Static template injection', 'Preserves core revenue'], tag: 'Smart Fallback' },
        { x: 690, y: 120, w: 250, h: 180, title: 'Non-Critical (Optional)', stroke: '#38bdf8', lines: ['Personalized recommendations', 'Real-time viewer counts', 'Review sentiment analysis', 'Dropped safely under load'], tag: 'Nice-to-Have' }
      ],
      blockConns: [
        { d: 'M 300 210 L 360 210', lx: 330, ly: 200, label: 'Core OK' },
        { d: 'M 630 210 L 690 210', lx: 660, ly: 200, label: 'Shed' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Page Assembly', stroke: '#38bdf8', lines: ['BFF fans out to 5 services', 'Catalog, Pricing, Cart OK', 'Recommendation times out'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Fallback Trigger', stroke: '#f59e0b', lines: ['Circuit breaker detects hang', 'Invokes fallback lambda', 'Fetches static Top 10'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Stitch View', stroke: '#10b981', lines: ['Combines live price + static recs', 'Strips broken widget', 'Logs warning to SRE'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Happy User', stroke: '#a855f7', lines: ['User completes checkout', 'Customer never sees error', 'Revenue 100% preserved'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Hiccup' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Substitute' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Render' }
      ],
      sections: [
        {
          heading: "1. The Philosophy of Partial Availability",
          body: "In a complex microservices architecture comprising dozens of services, having all 100% of services operational simultaneously is a statistical rarity. If a page requires 20 distinct services and every service has 99.9% availability, the probability of the page working without error drops significantly. Graceful degradation embraces this reality by categorizing features into Critical Path (must work) and Non-Critical Path (can fail without breaking the user's primary journey).",
          bullets: [
            "Critical Path: The checkout button, payment processing, catalog pricing. Failure here must alert on-call SREs immediately.",
            "Non-Critical Path: Personalized recommendations, '14 people viewing this item', reviews section, recommended accessories.",
            "Never Throw Global 500: If a non-critical component fails, return a partial DTO with the missing component omitted or replaced with cached data."
          ]
        },
        {
          heading: "2. Degradation Strategies in Action",
          body: "There are four primary architectural patterns for executing graceful degradation:",
          bullets: [
            "Stale-While-Revalidate: Return cached data from Redis/CDN even if its TTL has expired, while triggering a background refresh.",
            "Static Defaults: If the dynamic personalized recommendation engine is down, render a static pre-computed list of bestsellers.",
            "Feature Flags & Shedding: Under extreme server CPU load, an automated controller flips feature flags to disable heavy features (like dynamic search autocomplete) to keep checkout alive.",
            "Offline Asynchronous Queueing: If the email confirmation service is down, queue the email in RabbitMQ/Kafka and complete the order immediately."
          ]
        },
        {
          heading: "3. UI Contract Design for Partial Failures",
          body: "Frontend client apps (iOS, Android, React) must be designed to handle optional fields in API responses.",
          bullets: [
            "Nullable DTO Fields: In the API schema, recommendations should be declared as optional (`recommendations?: Product[]`). If the field is missing or empty, the UI renders the screen without layout shift.",
            "Skeleton Screens: Render core UI components immediately, lazily populating secondary components as asynchronous requests resolve."
          ]
        },
        {
          heading: "4. Production Blueprint: Graceful Aggregator in TypeScript",
          body: "The following TypeScript snippet demonstrates an API aggregator combining mission-critical calls with gracefully degraded optional dependencies.",
          bullets: [
            "Promise.allSettled: Isolates non-critical failures from rejecting the overall promise.",
            "Deterministic Fallback: Injects cached defaults when optional services reject."
          ],
          codeSnippet: {
            title: "Gracefully Degraded Page Aggregator in TypeScript",
            code: `export async function getProductPage(productId: string) {\n  // 1. Critical Call: Must succeed or fail the page\n  const product = await catalogService.getProduct(productId);\n\n  // 2. Non-critical calls: Execute concurrently with fallbacks\n  const [reviewsResult, recsResult] = await Promise.allSettled([\n    reviewService.getReviews(productId),\n    recommendationService.getRelatedProducts(productId),\n  ]);\n\n  return {\n    product,\n    reviews: reviewsResult.status === 'fulfilled'\n      ? reviewsResult.value\n      : { rating: 4.5, count: 120, list: [] }, // Stale default\n    recommendations: recsResult.status === 'fulfilled'\n      ? recsResult.value\n      : [], // Omit gracefully on failure\n  };\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Graceful Degradation Architecture", pros: "Preserves revenue and user trust during partial outages; prevents minor bugs from causing global blackouts; allows shedding load during spikes.", cons: "Requires complex frontend UI contracts; more code paths to test in QA and staging.", bestFor: "All high-scale consumer applications (e-commerce, streaming, news feeds, social media)." },
        { option: "All-or-Nothing Monolithic Rendering", pros: "Simpler programming model; no fallback logic needed.", cons: "A single bug in reviews crashes the entire product checkout screen.", bestFor: "Internal admin tools only." }
      ],
      interviewTip: "In interviews, cite Amazon's core availability philosophy: 'We design our API contracts so that non-critical components are nullable. If our recommendation engine experiences a circuit break, we fall back to a cached static list of trending items. The user completes their purchase without ever realizing an internal microservice had a momentary glitch.'"
    },
    {
      id: "bulkhead-isolation",
      subtopicNumber: "4.6",
      title: "Bulkhead Isolation Pattern",
      subtitle: "Compartmentalizing thread pools, connection pools, and memory quotas to isolate failure blast radiuses.",
      readingTime: "8 min read",
      difficulty: "Advanced",
      accent: "#a855f7",
      keyTakeaways: [
        "Named after the watertight bulkheads of a ship: if one compartment is breached and floods, the ship remains buoyant and afloat.",
        "The Bulkhead pattern isolates resources (thread pools, semaphores, connection pools, memory) across different downstream dependencies.",
        "If an auxiliary service (like Recommendations) hangs, its dedicated thread pool exhausts, while the critical Payment and Order pools remain 100% available.",
        "Prevents a single slow dependency from starving the global server thread pool and crashing the entire process."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                    BULKHEAD THREAD POOL ISOLATION                       |
+-------------------------------------------------------------------------+
[Shared Application Server: 100 Total Threads]
  +-------------------------------------------------------------------+
  | Bulkhead Pool A: Payments (30 Threads)  --> [Stripe Gateway: FAST]|
  | Bulkhead Pool B: Search (20 Threads)    --> [Elasticsearch: HUNG] | (SATURATED!)
  | Bulkhead Pool C: Orders (40 Threads)    --> [Order Database: FAST]|
  +-------------------------------------------------------------------+
(Search queries reject fast with 429; Payment and Order checkouts proceed!)`,
      blockNodes: [
        { x: 50, y: 110, w: 260, h: 200, title: 'Ingress Web Requests', stroke: '#38bdf8', lines: ['Concurrent traffic stream', 'Checkout requests (Critical)', 'Search requests (Heavy)', 'Analytics requests (Low)'], tag: 'Traffic' },
        { x: 370, y: 80, w: 260, h: 65, title: 'Bulkhead Pool A: Payments', stroke: '#10b981', lines: ['30 Threads | Queue: 10 | 100% Free'], tag: 'Isolated' },
        { x: 370, y: 155, w: 260, h: 65, title: 'Bulkhead Pool B: Search', stroke: '#ef4444', lines: ['15 Threads (MAX) | Queue: 50 (FULL)'], tag: 'Saturated' },
        { x: 370, y: 230, w: 260, h: 65, title: 'Bulkhead Pool C: Orders', stroke: '#3b82f6', lines: ['40 Threads | Queue: 20 | Healthy'], tag: 'Isolated' },
        { x: 690, y: 110, w: 260, h: 200, title: 'Blast Radius Outcome', stroke: '#10b981', lines: ['Payments 100% unaffected', 'Search rejects fast (429)', 'No global server crash!'], tag: 'Resilience' }
      ],
      blockConns: [
        { d: 'M 310 145 L 370 115', lx: 340, ly: 125, label: 'Pay' },
        { d: 'M 310 185 L 370 185', lx: 340, ly: 175, label: 'Search' },
        { d: 'M 310 225 L 370 255', lx: 340, ly: 235, label: 'Order' },
        { d: 'M 630 185 L 690 185', lx: 660, ly: 175, label: 'Shield' }
      ],
      flowNodes: [
        { x: 50, y: 150, w: 200, h: 140, step: '1', title: 'Traffic Partition', stroke: '#38bdf8', lines: ['Incoming requests tagged', 'Assigned to dedicated pools', 'Zero shared thread buffers'] },
        { x: 280, y: 150, w: 210, h: 140, step: '2', title: 'Downstream Hang', stroke: '#ef4444', lines: ['Slow search query hits app', 'Pool B threads max out', 'Reaches queue bound'] },
        { x: 520, y: 150, w: 210, h: 140, step: '3', title: 'Targeted Fast Fail', stroke: '#f59e0b', lines: ['Excess search calls fail fast', 'Returns HTTP 429 Too Many', 'Does not block other pools'] },
        { x: 760, y: 150, w: 200, h: 140, step: '4', title: 'Core Protected', stroke: '#10b981', lines: ['Payment pool processes 100%', 'Orders checkout smoothly', 'Zero cascading blackout'] }
      ],
      flowConns: [
        { d: 'M 250 210 L 280 210', lx: 265, ly: 200, label: 'Partition' },
        { d: 'M 490 210 L 520 210', lx: 505, ly: 200, label: 'Saturate' },
        { d: 'M 730 210 L 760 210', lx: 745, ly: 200, label: 'Protect' }
      ],
      sections: [
        {
          heading: "1. The Nautical Origin: Watertight Partitioning",
          body: "In naval architecture, a ship's hull is divided into multiple watertight compartments called bulkheads. If a torpedo or iceberg breaches one compartment, water fills that single section while the remaining watertight compartments keep the ship floating. In software architecture, the Bulkhead pattern partitions computational resources—such as CPU thread pools, database connection pools, memory heaps, and Kubernetes pod cgroups—so that catastrophic failure in one component is completely contained within its allocated resource budget.",
          bullets: [
            "Thread Pool Bulkhead: Dedicated thread pools for distinct downstream dependencies (e.g. 30 threads for Payments, 15 for Search, 10 for Analytics).",
            "Semaphore Bulkhead: An atomic counter limiting concurrent executions on the calling thread; zero context-switching overhead.",
            "Connection Pool Bulkhead: Dedicated database connection pools ensuring analytical reporting queries cannot starve transactional checkout threads."
          ]
        },
        {
          heading: "2. Thread Pool vs Semaphore Bulkheads: Concurrency Mechanics",
          body: "Choosing between a Thread Pool Bulkhead and a Semaphore Bulkhead depends on your I/O runtime model:",
          bullets: [
            "Thread Pool Bulkhead (Asynchronous): Requests are dispatched to a separate thread pool with its own queue. Advantage: The calling thread is immediately freed; if the call hangs, it can be cancelled asynchronously via thread interruption. Disadvantage: Extra CPU context-switching overhead.",
            "Semaphore Bulkhead (Synchronous Non-Blocking): The call executes on the current thread, but an atomic semaphore enforces a maximum concurrency ceiling (e.g., max 20 concurrent calls). Once the semaphore is saturated, new calls reject immediately. Advantage: Zero context-switching overhead. Disadvantage: Cannot forcibly interrupt a hung thread."
          ]
        },
        {
          heading: "3. Infrastructure-Level Bulkheads in Kubernetes",
          body: "Bulkheads should also be enforced at the infrastructure orchestration layer in Kubernetes:",
          bullets: [
            "Cgroups & Pod Limits: Setting strict `limits.cpu` and `limits.memory` on every container ensures a memory leak in one pod does not crash neighboring pods on the same Kubernetes worker node.",
            "Node Affinity & Taints: Running mission-critical payment services on dedicated Kubernetes node pools, physically separated from batch processing workers.",
            "Service-Level Mesh Isolation: Enforcing connection pool limits at the Envoy sidecar proxy layer."
          ]
        },
        {
          heading: "4. Production Blueprint: Resilience4j Thread Pool Bulkhead in Java",
          body: "The following Java 21 snippet illustrates a ThreadPoolBulkhead isolating downstream search calls with strict queue capacities.",
          bullets: [
            "Bounded Queue: Sets queue capacity to 20; once full, requests reject in 1ms with BulkheadFullException.",
            "Core & Max Pool Sizes: Configures dedicated threads isolated from the main Tomcat worker pool."
          ],
          codeSnippet: {
            title: "Resilience4j ThreadPoolBulkhead Isolation in Java",
            code: `@Service\npublic class IsolatedSearchClient {\n    private final ThreadPoolBulkhead bulkhead;\n\n    public IsolatedSearchClient(ThreadPoolBulkheadRegistry registry) {\n        ThreadPoolBulkheadConfig config = ThreadPoolBulkheadConfig.custom()\n            .maxThreadPoolSize(15)\n            .coreThreadPoolSize(10)\n            .queueCapacity(20)\n            .keepAliveDuration(Duration.ofMillis(50))\n            .build();\n        this.bulkhead = registry.bulkhead("searchBulkhead", config);\n    }\n\n    public CompletableFuture<SearchResult> executeSearch(String query) {\n        return ThreadPoolBulkhead.executeSupplier(bulkhead, () -> performSearch(query))\n            .exceptionally(ex -> {\n                // Fast-fail fallback when pool is saturated\n                return SearchResult.empty("Search temporarily unavailable due to high load");\n            });\n    }\n}`
          }
        }
      ],
      tradeOffs: [
        { option: "Thread Pool Bulkhead", pros: "Complete thread isolation; caller thread freed immediately; supports asynchronous timeout cancellation.", cons: "CPU overhead from thread context switching; extra memory allocation per thread.", bestFor: "Blocking synchronous I/O architectures (Tomcat, Spring MVC, JDBC drivers)." },
        { option: "Semaphore Bulkhead", pros: "Zero context-switching overhead; ultra-fast atomic check; negligible memory footprint.", cons: "Executes on caller thread; cannot cancel hung threads asynchronously.", bestFor: "Reactive non-blocking runtimes (Spring WebFlux, Netty, Go, Node.js)." },
        { option: "Kubernetes Node Pool Bulkhead", pros: "Physical hardware isolation; noisy neighbors completely unable to steal CPU or I/O.", cons: "Higher cloud infrastructure cost due to lower server bin-packing efficiency.", bestFor: "Multi-tenant platforms and PCI-DSS compliance isolation." }
      ],
      interviewTip: "Whenever an interviewer asks 'How do you prevent a slow recommendation service from crashing our checkout system?', answer definitively: 'I apply the Bulkhead pattern. We allocate a dedicated thread pool of 10 threads for recommendations, completely isolated from our 40-thread checkout pool. If recommendations hang, its queue saturates and rejects with HTTP 429 in 1ms, while checkout proceeds at 100% throughput with zero thread starvation.'"
    }
  ]
};

// Write out module 4
fs.writeFileSync(
  path.join(__dirname, 'microservicesMod4.js'),
  `/* eslint-disable @typescript-eslint/no-require-imports */\nconst MODULE_4_RESILIENCE = ${JSON.stringify(MODULE_4_RESILIENCE, null, 2)};\nmodule.exports = { MODULE_4_RESILIENCE };\n`,
  'utf8'
);

console.log("Module 4 successfully written with all 6 subtopics in high depth!");
