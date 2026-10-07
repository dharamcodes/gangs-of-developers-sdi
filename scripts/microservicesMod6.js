/* eslint-disable @typescript-eslint/no-require-imports */
const MODULE_6_OPERATIONS = {
  "id": "observability-operations",
  "topicNumber": 6,
  "title": "6. Observability, Security & Operations",
  "description": "Operating distributed systems at scale: centralized logging, RED metrics, OpenTelemetry distributed tracing, Strangler Fig migration, and Zero-Trust mTLS security.",
  "subtopics": [
    {
      "id": "centralized-logging",
      "subtopicNumber": "6.1",
      "title": "Centralized Logging & Correlation IDs (MDC)",
      "subtitle": "Injecting correlation IDs, Mapped Diagnostic Context (MDC), and structured JSON log pipelines.",
      "readingTime": "8 min read",
      "difficulty": "Intermediate",
      "accent": "#38bdf8",
      "keyTakeaways": [
        "In a microservices cluster with 50+ services, grepping local server log files is impossible; logs must be aggregated centrally in Elasticsearch, OpenSearch, or Grafana Loki.",
        "Correlation ID (X-Correlation-ID): A unique UUID assigned at the edge API gateway and propagated across every downstream HTTP and gRPC hop.",
        "Mapped Diagnostic Context (MDC): Thread-local storage in logging frameworks (Logback, Winston, Zap) that automatically stamps every log line with user_id, request_id, and trace_id.",
        "Structured JSON Logging: Emitting logs as machine-parseable JSON instead of raw text strings enables instant filtering and aggregations in log indexers."
      ],
      "ascii": "+-------------------------------------------------------------------------+\n|                  CORRELATION ID PROPAGATION & LOGGING                   |\n+-------------------------------------------------------------------------+\n[Client] ---> GET /checkout (X-Correlation-ID: 'corr_94a1-b842')\n                 |\n                 v\n+----------------+--------------------------------------------------------+\n| API Gateway: Logs [corr_94a1-b842] Ingress received                     |\n|      |                                                                  |\n|      v (Forward Header: X-Correlation-ID)                               |\n| Order Svc:   Logs [corr_94a1-b842] Validating order aggregate           |\n|      |                                                                  |\n|      v (Forward Header: X-Correlation-ID)                               |\n| Payment Svc: Logs [corr_94a1-b842] Charging credit card                 |\n+----------------+--------------------------------------------------------+\n                 |\n                 v (Shipped to Centralized Log Cluster: Loki / Elastic)\n[SRE Queries: 'correlationId == corr_94a1-b842' -> Views All 3 Logs Together!]",
      "blockNodes": [
        {
          "x": 50,
          "y": 120,
          "w": 250,
          "h": 180,
          "title": "Edge Ingress Stamp",
          "stroke": "#38bdf8",
          "lines": [
            "Generates Correlation ID",
            "Injects X-Correlation-ID",
            "Stores in MDC thread local",
            "Attaches to all log lines"
          ],
          "tag": "Origin Stamp"
        },
        {
          "x": 360,
          "y": 100,
          "w": 270,
          "h": 220,
          "title": "Structured Log Shipper",
          "stroke": "#10b981",
          "lines": [
            "Fluentbit / Vector agent",
            "Pulls stdout JSON logs",
            "Non-blocking async ship",
            "Tags pod & namespace metadata",
            "Buffers during network dips"
          ],
          "tag": "Log Daemon"
        },
        {
          "x": 690,
          "y": 120,
          "w": 250,
          "h": 180,
          "title": "Central Storage",
          "stroke": "#a855f7",
          "lines": [
            "Elasticsearch / OpenSearch",
            "Grafana Loki log index",
            "Search by correlation ID",
            "Instant multi-service trace"
          ],
          "tag": "Central Query"
        }
      ],
      "blockConns": [
        {
          "d": "M 300 210 L 360 210",
          "lx": 330,
          "ly": 200,
          "label": "JSON Out"
        },
        {
          "d": "M 630 210 L 690 210",
          "lx": 660,
          "ly": 200,
          "label": "Index"
        }
      ],
      "flowNodes": [
        {
          "x": 50,
          "y": 150,
          "w": 200,
          "h": 140,
          "step": "1",
          "title": "Edge Header",
          "stroke": "#38bdf8",
          "lines": [
            "Gateway reads/creates UUID",
            "Sets X-Correlation-ID header",
            "Propagates over HTTP/gRPC"
          ]
        },
        {
          "x": 280,
          "y": 150,
          "w": 210,
          "h": 140,
          "step": "2",
          "title": "MDC Population",
          "stroke": "#10b981",
          "lines": [
            "Service extracts header",
            "Puts into MDC thread context",
            "Zap/Logback binds to logger"
          ]
        },
        {
          "x": 520,
          "y": 150,
          "w": 210,
          "h": 140,
          "step": "3",
          "title": "Structured Emit",
          "stroke": "#f59e0b",
          "lines": [
            "Emits JSON to stdout",
            "Includes level, timestamp, msg",
            "Includes correlationId field"
          ]
        },
        {
          "x": 760,
          "y": 150,
          "w": 200,
          "h": 140,
          "step": "4",
          "title": "Loki Indexing",
          "stroke": "#a855f7",
          "lines": [
            "DaemonSet ships to Loki",
            "SRE searches correlationId",
            "Full call sequence visualized"
          ]
        }
      ],
      "flowConns": [
        {
          "d": "M 250 210 L 280 210",
          "lx": 265,
          "ly": 200,
          "label": "Inject"
        },
        {
          "d": "M 490 210 L 520 210",
          "lx": 505,
          "ly": 200,
          "label": "Log"
        },
        {
          "d": "M 730 210 L 760 210",
          "lx": 745,
          "ly": 200,
          "label": "Query"
        }
      ],
      "sections": [
        {
          "heading": "1. The Needle in a Haystack: Why Microservices Require Centralized Logging",
          "body": "In a monolithic architecture, debugging an error is straightforward: an engineer SSHs into the server or checks a single log file where stack traces are printed sequentially. In a microservices cluster with 50 services running across 300 Kubernetes pods, a single user checkout generates log entries scattered across 12 different machines. Without centralized logging and correlation identifiers, tracking down why a transaction failed requires guessing timestamps and manually correlating logs across multiple databases—a nearly impossible task during a production outage.",
          "bullets": [
            "Correlation ID (`X-Correlation-ID`): A single unique UUID generated at the edge gateway that stays attached to the request across every downstream service hop.",
            "Mapped Diagnostic Context (MDC): Thread-local storage provided by logging frameworks that automatically enriches every log statement with context attributes without requiring developers to manually pass IDs into logger methods.",
            "Structured JSON Logging: Emitting logs in JSON format (`{ timestamp, level, correlation_id, message, service }`) enables log aggregators to index fields as queryable database columns."
          ]
        },
        {
          "heading": "2. The Log Ingestion Pipeline: DaemonSets vs Direct App Push",
          "body": "How do logs travel from application pods to the centralized Elasticsearch or Loki cluster?",
          "bullets": [
            "Standard Out (`stdout`) DaemonSet (Industry Best Practice): Applications log to standard output. A lightweight log shipper (Fluent Bit, Vector, or Promtail) runs as a DaemonSet on each Kubernetes node, tailing container log files from disk and shipping them asynchronously. Advantage: Application performance is never blocked by log indexer network latency.",
            "Direct TCP Push (Anti-Pattern): Applications making direct network HTTP calls to Elasticsearch on every log statement. If the log server slows down, the entire application freezes."
          ]
        },
        {
          "heading": "3. Log Sampling & PII Redaction",
          "body": "Logging every debug statement at scale generates terabytes of data daily, driving up cloud storage bills and creating security risks.",
          "bullets": [
            "Log Sampling: In production, log INFO and DEBUG statements at 1% sampling, while logging 100% of WARN and ERROR statements.",
            "PII Redaction: Credit card numbers, passwords, and sensitive tokens must be automatically masked at the logging framework level using regex patterns before hitting disk."
          ]
        },
        {
          "heading": "4. Production Blueprint: Go Structured JSON Logger with MDC Middleware",
          "body": "The following Go snippet illustrates structured logging using Uber Zap, extracting correlation IDs from HTTP headers and injecting them into context fields.",
          "bullets": [
            "Uber Zap Structured Fields: Zero-allocation JSON logging.",
            "Context Middleware: Injects correlation ID into request context for downstream propagation."
          ],
          "codeSnippet": {
            "title": "Go Structured JSON Logging Middleware with Correlation ID",
            "code": "package logging\n\nimport (\n    \"net/http\"\n    \"github.com/google/uuid\"\n    \"go.uber.org/zap\"\n)\n\nfunc CorrelationLoggingMiddleware(logger *zap.Logger, next http.Handler) http.Handler {\n    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        corrID := r.Header.Get(\"X-Correlation-ID\")\n        if corrID == \"\" {\n            corrID = uuid.NewString()\n        }\n        w.Header().Set(\"X-Correlation-ID\", corrID)\n\n        // Create request-scoped structured logger\n        reqLogger := logger.With(\n            zap.String(\"correlation_id\", corrID),\n            zap.String(\"method\", r.Method),\n            zap.String(\"path\", r.URL.Path),\n        )\n\n        reqLogger.Info(\"Incoming HTTP request started\")\n        next.ServeHTTP(w, r)\n        reqLogger.Info(\"Incoming HTTP request completed\")\n    })\n}"
          }
        }
      ],
      "tradeOffs": [
        {
          "option": "Centralized Structured Logging (Loki / Elastic)",
          "pros": "Instant cross-service log correlation; structured querying by user_id and correlation_id; powerful alerting on error rates.",
          "cons": "High storage cost for multi-terabyte log retention; requires managing log index clusters.",
          "bestFor": "All production microservices clusters."
        },
        {
          "option": "Local Server File Logs (SSH grepping)",
          "pros": "Zero infrastructure setup.",
          "cons": "Impossible to correlate in microservices; logs are permanently lost when ephemeral pods terminate.",
          "bestFor": "Local development only."
        }
      ],
      "interviewTip": "In interviews, explain logging observability cleanly: 'Every request entering our API gateway receives a unique X-Correlation-ID header. Using Mapped Diagnostic Context (MDC), this ID is automatically injected into every structured JSON log line across all downstream services. In Grafana Loki, an engineer simply enters correlation_id = xyz to instantly view the complete chronological log execution across all 8 microservices.'"
    },
    {
      "id": "red-metrics",
      "subtopicNumber": "6.2",
      "title": "RED Metrics, Golden Signals & Prometheus",
      "subtitle": "Monitoring Rate, Errors, and Duration (RED) alongside Google SRE Four Golden Signals.",
      "readingTime": "8 min read",
      "difficulty": "Intermediate",
      "accent": "#10b981",
      "keyTakeaways": [
        "The RED Method (Rate, Errors, Duration) is the gold standard for monitoring request-driven microservices architectures.",
        "Google SRE Four Golden Signals: Latency, Traffic, Errors, and Saturation (CPU, memory, disk I/O capacity limits).",
        "Prometheus Pull Model: Prometheus periodically scrapes `/metrics` endpoints exposed by microservice pods, storing time-series counters and histograms.",
        "Alert on Symptoms, Not Causes: Alert on elevated user error rates or latency breaches (SLOs), not on raw server CPU spikes."
      ],
      "ascii": "+-------------------------------------------------------------------------+\n|                  THE RED METRICS MONITORING ARCHITECTURE                |\n+-------------------------------------------------------------------------+\n[Microservice Pod] ===(Exposes /metrics on port 9090)\n       |\n       | 1. RATE:     http_requests_total (Counter)\n       | 2. ERRORS:   http_requests_total{status=~\"5..\"} (Counter)\n       | 3. DURATION: http_request_duration_seconds (Histogram: P50, P90, P99)\n       |\n       v (Scraped every 15s via HTTP Pull)\n[Prometheus Server] ---> Evaluates AlertManager rules (e.g. Error Rate > 1%)\n       |\n       v\n[Grafana Dashboard] ---> Visualizes Golden Signals in real-time",
      "blockNodes": [
        {
          "x": 50,
          "y": 120,
          "w": 250,
          "h": 180,
          "title": "Instrumented App",
          "stroke": "#38bdf8",
          "lines": [
            "Prometheus Client SDK",
            "Tracks Rate, Errors, Duration",
            "In-memory atomic counters",
            "Exposes GET /metrics"
          ],
          "tag": "Metric Exporter"
        },
        {
          "x": 360,
          "y": 100,
          "w": 270,
          "h": 220,
          "title": "Prometheus Server",
          "stroke": "#10b981",
          "lines": [
            "Periodic HTTP pull scrape",
            "Time-series database (TSDB)",
            "PromQL query engine",
            "Evaluates AlertManager alerts",
            "Low overhead pull model"
          ],
          "tag": "TSDB Scraper"
        },
        {
          "x": 690,
          "y": 120,
          "w": 250,
          "h": 180,
          "title": "Grafana & Alerts",
          "stroke": "#a855f7",
          "lines": [
            "Real-time RED dashboards",
            "P99 Latency graphs",
            "PagerDuty alert dispatch",
            "SLO burn rate tracking"
          ],
          "tag": "Visualization"
        }
      ],
      "blockConns": [
        {
          "d": "M 300 210 L 360 210",
          "lx": 330,
          "ly": 200,
          "label": "Scrape"
        },
        {
          "d": "M 630 210 L 690 210",
          "lx": 660,
          "ly": 200,
          "label": "Visualize"
        }
      ],
      "flowNodes": [
        {
          "x": 50,
          "y": 150,
          "w": 200,
          "h": 140,
          "step": "1",
          "title": "HTTP Request",
          "stroke": "#38bdf8",
          "lines": [
            "Request hits /api/orders",
            "Timer starts recording",
            "Handler processes request"
          ]
        },
        {
          "x": 280,
          "y": 150,
          "w": 210,
          "h": 140,
          "step": "2",
          "title": "Record Metric",
          "stroke": "#10b981",
          "lines": [
            "Increments requests counter",
            "If 5xx: increments error counter",
            "Observes latency in histogram"
          ]
        },
        {
          "x": 520,
          "y": 150,
          "w": 210,
          "h": 140,
          "step": "3",
          "title": "Scrape Pull",
          "stroke": "#f59e0b",
          "lines": [
            "Prometheus scrapes /metrics",
            "Ingests time-series delta",
            "Stores in TSDB disk blocks"
          ]
        },
        {
          "x": 760,
          "y": 150,
          "w": 200,
          "h": 140,
          "step": "4",
          "title": "PromQL Alert",
          "stroke": "#a855f7",
          "lines": [
            "Calculates error rate > 1%",
            "Triggers PagerDuty page",
            "On-call engineer alerted"
          ]
        }
      ],
      "flowConns": [
        {
          "d": "M 250 210 L 280 210",
          "lx": 265,
          "ly": 200,
          "label": "Record"
        },
        {
          "d": "M 490 210 L 520 210",
          "lx": 505,
          "ly": 200,
          "label": "Scrape"
        },
        {
          "d": "M 730 210 L 760 210",
          "lx": 745,
          "ly": 200,
          "label": "Alert"
        }
      ],
      "sections": [
        {
          "heading": "1. The RED Method vs USE Method: Service-Level Metrics",
          "body": "Formulated by Tom Wilkie, the RED Method defines the core metrics every request-driven microservice must measure:\n1. Rate: The number of incoming requests per second ($R = \\text{rate}(\\text{http\\_requests\\_total}[1m])$).\n2. Errors: The number of requests that fail with an error per second ($E = \\text{rate}(\\text{http\\_requests\\_total}\\{\\text{status}=\\sim\"5..\"\\}[1m])$).\n3. Duration: The amount of time requests take to execute, measured as percentile distributions ($P50$, $P90$, $P99$).\n(Contrast with the USE Method—Utilization, Saturation, Errors—which is designed for infrastructure resources like disks, memory, and CPUs).",
          "bullets": [
            "Percentiles vs Averages: Never alert on average latency! Averages hide catastrophic long-tail degradation. An average of 100ms can hide a $P99$ where 1% of users wait 30 seconds.",
            "Histogram Buckets: Pre-configure latency buckets (e.g. `[0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0]`) to accurately compute quantiles via PromQL `histogram_quantile()`."
          ]
        },
        {
          "heading": "2. Google SRE Four Golden Signals",
          "body": "The Google Site Reliability Engineering (SRE) book defines the Four Golden Signals for production monitoring:",
          "bullets": [
            "Latency: Time taken to serve a request. Differentiate between successful request latency and failed request latency.",
            "Traffic: A measure of system demand (HTTP requests/sec for web, IOPS for databases, network bandwidth for media streaming).",
            "Errors: Rate of requests that fail (explicit 500s, implicit wrong content, or protocol failures).",
            "Saturation: How full the service's resources are (CPU load %, memory usage %, connection pool utilization %). Warns of impending failure before degradation occurs."
          ]
        },
        {
          "heading": "3. Service Level Objectives (SLO) & Error Budgets",
          "body": "Modern organizations do not aim for 100% uptime; they establish pragmatic Service Level Objectives (SLOs) backed by Error Budgets.",
          "bullets": [
            "SLI (Service Level Indicator): A quantifiable metric: 'Percentage of requests served with status 200 in under 300ms'.",
            "SLO (Service Level Objective): The target reliability goal agreed with the business: '99.9% of requests meet the SLI over a rolling 30-day window'.",
            "Error Budget: The remaining 0.1% allowable downtime. If the error budget is exhausted, feature deployments are frozen and engineering focuses 100% on reliability."
          ]
        },
        {
          "heading": "4. Production Blueprint: Prometheus Instrumentation & PromQL Alerts",
          "body": "The following PromQL rules demonstrate an alert triggering when a service's error rate exceeds 1% over a 5-minute window.",
          "bullets": [
            "PromQL Error Rate Calculation: Divides 5xx requests by total requests over a rolling 5-minute rate.",
            "Histogram Quantile Calculation: Computes the 99th percentile latency across all pods."
          ],
          "codeSnippet": {
            "title": "Prometheus Alerting Rules (PromQL) for RED Metrics",
            "code": "# Alert: High Error Rate (> 1% over 5 minutes)\n- alert: HighHttpErrorRate\n  expr: |\n    sum(rate(http_requests_total{status=~\"5..\"}[5m]))\n    /\n    sum(rate(http_requests_total[5m])) * 100 > 1.0\n  for: 2m\n  labels:\n    severity: critical\n  annotations:\n    summary: \"High HTTP error rate on {{ $labels.service }}\"\n    description: \"Error rate is {{ $value | printf \"%.2f\" }}% (threshold: > 1.0%)\"\n\n# Alert: High P99 Latency (> 1000ms over 5 minutes)\n- alert: HighP99LatencyBreach\n  expr: |\n    histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))\n    > 1.0\n  for: 3m\n  labels:\n    severity: warning\n  annotations:\n    summary: \"P99 Latency breach on {{ $labels.service }}\"\n    description: \"P99 latency is above 1 second for 3 consecutive minutes\""
          }
        }
      ],
      "tradeOffs": [
        {
          "option": "Prometheus Pull Model",
          "pros": "Lightweight TSDB; pull model prevents monitoring system from being overwhelmed during traffic spikes; rich PromQL query engine.",
          "cons": "Metrics scraped every 15s (not real-time sub-second); requires high disk IOPS for massive clusters.",
          "bestFor": "Standard microservices and Kubernetes cluster monitoring."
        },
        {
          "option": "Push-Based Metrics (StatsD / Datadog)",
          "pros": "Immediate push on event; easy to use in serverless Lambda functions.",
          "cons": "A sudden traffic spike sends millions of metric UDP packets, overloading monitoring agents.",
          "bestFor": "Short-lived ephemeral serverless functions."
        }
      ],
      "interviewTip": "In architecture rounds, state your monitoring strategy concisely: 'I instrument all microservices with the RED method: Rate, Errors, and Duration. We expose these via Prometheus counters and latency histograms. In Grafana, we track P99 latency rather than misleading averages, and configure Prometheus AlertManager to page on-call SREs whenever our SLO error budget burn rate exceeds safe thresholds.'"
    },
    {
      "id": "distributed-tracing",
      "subtopicNumber": "6.3",
      "title": "Distributed Tracing with OpenTelemetry & W3C",
      "subtitle": "Tracing requests across microservice networks using OpenTelemetry, W3C traceparent, and Jaeger visual waterfall graphs.",
      "readingTime": "9 min read",
      "difficulty": "Advanced",
      "accent": "#a855f7",
      "keyTakeaways": [
        "Distributed Tracing follows a single user request across multiple network hops, databases, and message queues, visualising latency in a waterfall graph.",
        "W3C Trace Context Standard: Propagates `traceparent` (`00-{trace_id}-{span_id}-{flags}`) in HTTP and gRPC metadata headers.",
        "A Trace is a directed acyclic graph of Spans; each Span represents a timed unit of work with start/end timestamps, attributes, and events.",
        "OpenTelemetry (OTel) is the vendor-neutral industry standard SDK for collecting and exporting traces, metrics, and logs to Jaeger, Tempo, or Datadog."
      ],
      "ascii": "+-------------------------------------------------------------------------+\n|                  OPENTELEMETRY DISTRIBUTED TRACE WATERFALL              |\n+-------------------------------------------------------------------------+\n[Trace ID: 4bf92f3577b34da6a3ce929d0e0e4736]\n---------------------------------------------------------------------------\n[API Gateway: GET /checkout]                  |========================| (120ms)\n  [Order Service: ProcessOrder]                  |==================|   (95ms)\n    [Inventory Svc: ReserveItems]                   |======|            (30ms)\n    [Payment Svc: ChargeCard]                               |=====|     (25ms)\n      [Stripe Gateway: HTTP POST]                             |===|     (20ms)\n---------------------------------------------------------------------------\n(Identifies exact latency bottlenecks in complex multi-service call graphs!)",
      "blockNodes": [
        {
          "x": 50,
          "y": 120,
          "w": 250,
          "h": 180,
          "title": "W3C Traceparent",
          "stroke": "#38bdf8",
          "lines": [
            "traceparent header",
            "00-{trace_id}-{span_id}-01",
            "Propagated over HTTP & gRPC",
            "Preserves parent context"
          ],
          "tag": "Header Protocol"
        },
        {
          "x": 360,
          "y": 100,
          "w": 270,
          "h": 220,
          "title": "OpenTelemetry SDK",
          "stroke": "#10b981",
          "lines": [
            "Vendor-neutral OTel SDK",
            "Creates spans & timing blocks",
            "Attaches DB queries & status",
            "Asynchronous batch exporter",
            "Zero network blocking"
          ],
          "tag": "OTel Collector"
        },
        {
          "x": 690,
          "y": 120,
          "w": 250,
          "h": 180,
          "title": "Trace Visualization",
          "stroke": "#a855f7",
          "lines": [
            "Jaeger / Grafana Tempo",
            "Interactive waterfall UI",
            "Critical path highlighting",
            "Root cause bottleneck finder"
          ],
          "tag": "Waterfall UI"
        }
      ],
      "blockConns": [
        {
          "d": "M 300 210 L 360 210",
          "lx": 330,
          "ly": 200,
          "label": "Context"
        },
        {
          "d": "M 630 210 L 690 210",
          "lx": 660,
          "ly": 200,
          "label": "Export OTLP"
        }
      ],
      "flowNodes": [
        {
          "x": 50,
          "y": 150,
          "w": 200,
          "h": 140,
          "step": "1",
          "title": "Trace Created",
          "stroke": "#38bdf8",
          "lines": [
            "API Gateway receives call",
            "Generates root trace_id",
            "Starts root span"
          ]
        },
        {
          "x": 280,
          "y": 150,
          "w": 210,
          "h": 140,
          "step": "2",
          "title": "Inject & Call",
          "stroke": "#10b981",
          "lines": [
            "Injects traceparent header",
            "Makes gRPC call to Order Svc",
            "Transmits parent_span_id"
          ]
        },
        {
          "x": 520,
          "y": 150,
          "w": 210,
          "h": 140,
          "step": "3",
          "title": "Extract & Child",
          "stroke": "#f59e0b",
          "lines": [
            "Order Svc extracts context",
            "Starts child span",
            "Records SQL query timing"
          ]
        },
        {
          "x": 760,
          "y": 150,
          "w": 200,
          "h": 140,
          "step": "4",
          "title": "OTLP Export",
          "stroke": "#a855f7",
          "lines": [
            "Flushes batch to OTel Agent",
            "Assembled into waterfall graph",
            "SRE pinpoints slow hop"
          ]
        }
      ],
      "flowConns": [
        {
          "d": "M 250 210 L 280 210",
          "lx": 265,
          "ly": 200,
          "label": "Inject"
        },
        {
          "d": "M 490 210 L 520 210",
          "lx": 505,
          "ly": 200,
          "label": "Extract"
        },
        {
          "d": "M 730 210 L 760 210",
          "lx": 745,
          "ly": 200,
          "label": "Export"
        }
      ],
      "sections": [
        {
          "heading": "1. The Observability Triad: Traces, Metrics, and Logs",
          "body": "Metrics tell you THAT a problem exists (e.g. 'P99 latency on `/checkout` spiked to 4 seconds'). Logs tell you WHAT happened at an isolated point in time (e.g. 'Database query error'). But only Distributed Tracing tells you WHERE the latency was spent across a distributed network graph. In a microservices call chain with 8 services, Distributed Tracing identifies that 3.8 seconds of the 4-second request was spent waiting for a specific database lock inside the Inventory Service.",
          "bullets": [
            "Trace: Represents the entire journey of a request through a distributed system.",
            "Span: A single named, timed operation within a trace (e.g. `HTTP POST /orders` or `SELECT FROM users`). Contains start time, end time, attributes, and tags.",
            "W3C `traceparent` Standard: A standardized HTTP header: `00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01` representing version, 128-bit trace ID, 64-bit parent span ID, and trace flags (sampled)."
          ]
        },
        {
          "heading": "2. Context Propagation Mechanics: The Wire Protocol",
          "body": "The core challenge of distributed tracing is Context Propagation. When Service A calls Service B over HTTP, or produces a message to Kafka, the trace identity must travel over the wire.",
          "bullets": [
            "TextMapPropagator: The OpenTelemetry component responsible for serializing (Inject) and deserializing (Extract) context into carrier headers (HTTP headers, gRPC metadata, or Kafka headers).",
            "Baggage: OpenTelemetry Baggage allows propagating arbitrary business key-value pairs (e.g. `customer_tier=VIP`) across the entire trace graph without altering intermediate service signatures."
          ]
        },
        {
          "heading": "3. Trace Sampling: Head-Based vs Tail-Based Sampling",
          "body": "Capturing 100% of traces in a system processing 100,000 requests/sec generates petabytes of trace data that exhausts network bandwidth and storage budgets.",
          "bullets": [
            "Head-Based Sampling: The sampling decision is made at the root gateway when the request begins (e.g. sample 1% of all traffic). Drawback: If a rare 500 error occurs in the unsampled 99%, the trace is lost.",
            "Tail-Based Sampling: The OpenTelemetry Collector buffers all spans in memory until the request completes. If the request was fast and successful, it drops the trace; if the request threw an error or exceeded latency thresholds, it retains 100% of the trace."
          ]
        },
        {
          "heading": "4. Production Blueprint: OpenTelemetry Instrumentation in Go",
          "body": "The following Go snippet illustrates creating an OpenTelemetry tracer, starting a child span, and recording an error attribute.",
          "bullets": [
            "Span Attributes: Attaches query details and customer ID to the span.",
            "Error Recording: Explicitly sets span status to Error and captures stack traces."
          ],
          "codeSnippet": {
            "title": "OpenTelemetry Span Creation & Context Propagation in Go",
            "code": "package tracer\n\nimport (\n    \"context\"\n    \"go.opentelemetry.io/otel\"\n    \"go.opentelemetry.io/otel/attribute\"\n    \"go.opentelemetry.io/otel/codes\"\n    \"go.opentelemetry.io/otel/trace\"\n)\n\nfunc ExecuteTracedOperation(ctx context.Context, orderId string) error {\n    tracer := otel.GetTracerProvider().Tracer(\"order-service\")\n    \n    // Start child span linked to parent trace context\n    ctx, span := tracer.Start(ctx, \"ProcessOrderDatabaseCommit\",\n        trace.WithSpanKind(trace.SpanKindInternal),\n    )\n    defer span.End()\n\n    span.SetAttributes(\n        attribute.String(\"order.id\", orderId),\n        attribute.String(\"db.system\", \"postgresql\"),\n    )\n\n    if err := executeDatabaseCommit(ctx, orderId); err != nil {\n        span.RecordError(err)\n        span.SetStatus(codes.Error, err.Error())\n        return err\n    }\n\n    span.SetStatus(codes.Ok, \"Database commit successful\")\n    return nil\n}"
          }
        }
      ],
      "tradeOffs": [
        {
          "option": "OpenTelemetry + Tail-Based Sampling",
          "pros": "Vendor neutral; 100% capture of errors and slow requests; visualizes exact latency bottlenecks; industry standard.",
          "cons": "Requires running OpenTelemetry Collector buffer memory; trace context must be passed cleanly in code.",
          "bestFor": "All modern microservices architectures."
        },
        {
          "option": "Head-Based Sampling (1%)",
          "pros": "Zero memory buffering needed in collectors; lower infrastructure cost.",
          "cons": "Fails to capture rare intermittent errors that happen outside the 1% sample.",
          "bestFor": "High-volume, highly uniform traffic with low error rates."
        },
        {
          "option": "No Distributed Tracing (Logs Only)",
          "pros": "Zero telemetry overhead.",
          "cons": "Pinpointing which service caused a 3-second latency spike in a 10-hop graph is nearly impossible.",
          "bestFor": "Monolithic single-process applications only."
        }
      ],
      "interviewTip": "In interviews, highlight the power of tracing for latency diagnostics: 'When debugging high P99 latency in microservices, logs are insufficient. I implement OpenTelemetry distributed tracing using the W3C traceparent standard. In Jaeger or Tempo, we inspect the interactive waterfall graph to immediately identify which downstream service or database query occupied the critical path.'"
    },
    {
      "id": "strangler-fig",
      "subtopicNumber": "6.4",
      "title": "Strangler Fig Migration Pattern",
      "subtitle": "Incrementally replacing legacy monolithic systems with microservices using edge proxies and dark traffic shadowing.",
      "readingTime": "8 min read",
      "difficulty": "Advanced",
      "accent": "#f59e0b",
      "keyTakeaways": [
        "Named after the Australian Strangler Fig tree that seeds in the upper branches of a host tree, grows downward, and gradually replaces the host tree over time.",
        "Never execute a 'Big Bang' rewrite: rewriting a massive monolithic system from scratch over 2 years almost universally fails due to shifting business requirements.",
        "The Strangler Fig pattern places an edge reverse proxy in front of the monolith, routing individual capabilities (e.g. `/orders/*`) to new microservices one at a time.",
        "Dark Traffic Shadowing: Mirror live production traffic to the new microservice to verify performance and correctness before cutting over user traffic."
      ],
      "ascii": "+-------------------------------------------------------------------------+\n|                  STRANGLER FIG MIGRATION PROGRESSION                    |\n+-------------------------------------------------------------------------+\nStep 1: Edge Proxy Intercepts All Traffic\n[Clients] ---> [Edge Reverse Proxy (Envoy/Kong)] ---> [Legacy Monolith (100%)]\n\nStep 2: Extract Capability 1 (Orders)\n[Clients] ---> [Edge Reverse Proxy]\n                      |-- (Route /orders/*) ------> [New Order Microservice]\n                      +-- (Route all other) ------> [Legacy Monolith (80%)]\n\nStep 3: Complete Migration (Monolith Decommissioned)\n[Clients] ---> [Edge Reverse Proxy]\n                      |-- (Route /orders/*) ------> [Order Microservice]\n                      |-- (Route /billing/*) -----> [Billing Microservice]\n                      +-- (Route /users/*) -------> [User Microservice]",
      "blockNodes": [
        {
          "x": 50,
          "y": 120,
          "w": 250,
          "h": 180,
          "title": "Edge Routing Proxy",
          "stroke": "#38bdf8",
          "lines": [
            "Envoy / NGINX / Kong",
            "Intercepts all client traffic",
            "Path-based routing rules",
            "Shadow traffic mirroring",
            "Zero client configuration"
          ],
          "tag": "Strangler Proxy"
        },
        {
          "x": 360,
          "y": 100,
          "w": 270,
          "h": 220,
          "title": "Extracted Microservices",
          "stroke": "#10b981",
          "lines": [
            "Order Service (New)",
            "Billing Service (New)",
            "Private modern databases",
            "Continuous deployment",
            "Autonomous teams"
          ],
          "tag": "Target Architecture"
        },
        {
          "x": 690,
          "y": 120,
          "w": 250,
          "h": 180,
          "title": "Shrinking Monolith",
          "stroke": "#ef4444",
          "lines": [
            "Legacy monolithic core",
            "Handles remaining legacy paths",
            "Traffic drops from 100% to 0%",
            "Decommissioned safely"
          ],
          "tag": "Legacy Host"
        }
      ],
      "blockConns": [
        {
          "d": "M 300 210 L 360 210",
          "lx": 330,
          "ly": 200,
          "label": "Route /orders"
        },
        {
          "d": "M 630 210 L 690 210",
          "lx": 660,
          "ly": 200,
          "label": "Shrink"
        }
      ],
      "flowNodes": [
        {
          "x": 50,
          "y": 150,
          "w": 200,
          "h": 140,
          "step": "1",
          "title": "Deploy Proxy",
          "stroke": "#38bdf8",
          "lines": [
            "Place proxy in front of monolith",
            "Route 100% traffic to monolith",
            "Verify zero latency hit"
          ]
        },
        {
          "x": 280,
          "y": 150,
          "w": 210,
          "h": 140,
          "step": "2",
          "title": "Extract Domain",
          "stroke": "#10b981",
          "lines": [
            "Build new microservice",
            "Implement modern DB schema",
            "Sync data via CDC"
          ]
        },
        {
          "x": 520,
          "y": 150,
          "w": 210,
          "h": 140,
          "step": "3",
          "title": "Shadow Traffic",
          "stroke": "#f59e0b",
          "lines": [
            "Mirror 100% live traffic",
            "Compare responses in background",
            "Verify zero regressions"
          ]
        },
        {
          "x": 760,
          "y": 150,
          "w": 200,
          "h": 140,
          "step": "4",
          "title": "Cutover & Decom",
          "stroke": "#a855f7",
          "lines": [
            "Shift 100% traffic to microservice",
            "Deprecate monolith module",
            "Repeat for next domain"
          ]
        }
      ],
      "flowConns": [
        {
          "d": "M 250 210 L 280 210",
          "lx": 265,
          "ly": 200,
          "label": "Intercept"
        },
        {
          "d": "M 490 210 L 520 210",
          "lx": 505,
          "ly": 200,
          "label": "Shadow"
        },
        {
          "d": "M 730 210 L 760 210",
          "lx": 745,
          "ly": 200,
          "label": "Cutover"
        }
      ],
      "sections": [
        {
          "heading": "1. The Folly of the Big Bang Rewrite",
          "body": "When an engineering organization realizes their monolithic codebase is becoming unmaintainable, leadership frequently falls for the 'Big Bang Rewrite' temptation: freeze major features, assemble a dream team of senior developers, and spend 18 months rebuilding the entire system from scratch in microservices. In practice, this almost universally fails. While the rewrite team builds, the legacy monolith continues evolving with critical business patches; by month 18, the new system is incomplete, bugs multiply, and the project is cancelled. The Strangler Fig pattern provides an incremental, low-risk migration strategy.",
          "bullets": [
            "Incremental Value: Deliver the first microservice to production in 6 weeks, proving architectural assumptions early.",
            "Zero Downtime: The external user has zero awareness of the migration; URLs, authentication, and responses remain identical.",
            "Reversibility: If an extracted microservice has bugs, the proxy rule can be reverted in 10 seconds to route back to the monolith."
          ]
        },
        {
          "heading": "2. Dark Launching & Traffic Shadowing",
          "body": "Before cutting over live user traffic to a newly extracted microservice, how do you verify it can handle production load and returns 100% identical responses? You implement Traffic Shadowing (also called Dark Launching).",
          "bullets": [
            "Envoy Traffic Shadowing: Envoy duplicates incoming production requests: the primary request goes to the monolith (whose response is returned to the user), while an identical clone is asynchronously sent to the new microservice.",
            "Response Diffing: A background comparison tool verifies that the microservice's JSON response matches the monolith's response bit-for-bit, identifying edge-case bugs before any user touches the new service.",
            "Load Validation: Verifies that the new microservice's database connection pools and CPU utilization handle peak traffic without degradation."
          ]
        },
        {
          "heading": "3. Dual-Write Data Synchronization During Migration",
          "body": "The hardest part of a Strangler migration is data synchronization. If Order Service is extracted, but other parts of the monolith still query the old `orders` table in the monolithic database, data must be kept in sync.",
          "bullets": [
            "CDC Back-Sync: Use Change Data Capture (Debezium) to stream updates from the new Order database back into the legacy database until all remaining monolithic dependencies are severed.",
            "Read-Only Monolith Seam: Transition the monolith's internal order classes to read-only views querying the new microservice via gRPC."
          ]
        },
        {
          "heading": "4. Production Blueprint: Envoy Traffic Shadowing Configuration",
          "body": "The following Envoy configuration demonstrates shadowing 100% of production traffic to a newly extracted microservice cluster for dark testing.",
          "bullets": [
            "Primary Route: Traffic routes to the legacy monolith and returns to the user.",
            "Request Mirror Policy: Clones incoming requests to the new microservice asynchronously."
          ],
          "codeSnippet": {
            "title": "Envoy Reverse Proxy Traffic Shadowing Configuration",
            "code": "routes:\n- match:\n    prefix: \"/api/v1/orders\"\n  route:\n    cluster: legacy_monolith_cluster # Primary target returned to user\n    request_mirror_policies:\n    - cluster: new_order_microservice_cluster # Dark shadowed target\n      runtime_fraction:\n        default_value:\n          numerator: 100 # Mirror 100% of live traffic for testing\n          denominator: HUNDRED"
          }
        }
      ],
      "tradeOffs": [
        {
          "option": "Strangler Fig Migration",
          "pros": "Zero-risk incremental rollout; immediate business value; dark traffic shadowing verification; 100% reversible in seconds.",
          "cons": "Requires temporary data synchronization between new and old databases; runs dual infrastructure during transition.",
          "bestFor": "Migrating legacy enterprise monolithic applications to microservices."
        },
        {
          "option": "Big Bang Rewrite",
          "pros": "Clean greenfield codebase without legacy baggage initially.",
          "cons": "90% failure rate; shifting scope; takes years before delivering business value; high risk of catastrophic cutover failure.",
          "bestFor": "Never recommended for core revenue-generating systems."
        }
      ],
      "interviewTip": "When an interviewer asks 'How would you migrate our monolith to microservices?', answer decisively: 'I apply the Strangler Fig pattern. We place an edge proxy in front of the monolith. We identify the first high-value domain boundary, extract it into a microservice, and use Envoy Traffic Shadowing to mirror 100% of live production traffic to verify correctness. Once validated, we execute a canary cutover and decommission the monolithic module, repeating this iteratively until the monolith is extinguished.'"
    },
    {
      "id": "zero-trust-mtls",
      "subtopicNumber": "6.5",
      "title": "Zero-Trust Security, mTLS & JWT Propagation",
      "subtitle": "Securing inter-service networks with SPIFFE/SPIRE cryptographic identities and short-lived certificate rotation.",
      "readingTime": "9 min read",
      "difficulty": "Expert",
      "accent": "#ec4899",
      "keyTakeaways": [
        "Perimeter Security is dead: an attacker breaching the corporate firewall or external ingress can freely compromise unencrypted internal microservices.",
        "Zero-Trust Architecture: 'Never trust, always verify.' Every single network request—even within the same Kubernetes cluster—must be authenticated and encrypted.",
        "Mutual TLS (mTLS): Both the client and server present cryptographic x509 certificates to verify identity and encrypt wire traffic via TLS 1.3.",
        "SPIFFE/SPIRE Standard: Provides automated, cryptographically verifiable identities for software workloads, rotating certificates every few hours without human involvement."
      ],
      "ascii": "+-------------------------------------------------------------------------+\n|                  ZERO-TRUST MUTUAL TLS (mTLS) HANDSHAKE                 |\n+-------------------------------------------------------------------------+\n[Client Pod: Order Svc]                              [Server Pod: Payment Svc]\n         |                                                       |\n         | 1. ClientHello (TLS 1.3)                             |\n         +------------------------------------------------------>|\n         |                                                       |\n         | 2. ServerHello + Presents Server x509 SPIFFE Cert    |\n         |<------------------------------------------------------+\n         |                                                       |\n         | 3. Client verifies Server Cert against Root CA       |\n         | 4. Client presents Client x509 SPIFFE Cert           |\n         +------------------------------------------------------>|\n         |                                                       |\n         | 5. Server verifies Client Cert against Root CA       |\n         | 6. Mutual Trust Established! Encrypted Session Keys  |\n         |<=====================================================>|\n         | (All inter-service traffic encrypted and authorized!) |",
      "blockNodes": [
        {
          "x": 50,
          "y": 120,
          "w": 250,
          "h": 180,
          "title": "Client Identity (SPIFFE)",
          "stroke": "#38bdf8",
          "lines": [
            "SPIFFE ID: spiffe://order-svc",
            "Short-lived x509 SVID cert",
            "Rotated automatically every 1h",
            "Presents cert in TLS handshake"
          ],
          "tag": "Client SVID"
        },
        {
          "x": 360,
          "y": 100,
          "w": 270,
          "h": 220,
          "title": "SPIRE / Istio CA",
          "stroke": "#10b981",
          "lines": [
            "Workload Attestation Agent",
            "Validates Kubernetes pod UID",
            "Issues cryptographic SVIDs",
            "Zero hardcoded secrets",
            "Automated mTLS rotation"
          ],
          "tag": "Identity Authority"
        },
        {
          "x": 690,
          "y": 120,
          "w": 250,
          "h": 180,
          "title": "Server Verification",
          "stroke": "#ec4899",
          "lines": [
            "SPIFFE ID: spiffe://payment-svc",
            "Verifies client cert with CA",
            "Enforces Authorization Policy",
            "Decodes User JWT claims"
          ],
          "tag": "Zero-Trust Gate"
        }
      ],
      "blockConns": [
        {
          "d": "M 300 210 L 360 210",
          "lx": 330,
          "ly": 200,
          "label": "Attest"
        },
        {
          "d": "M 630 210 L 690 210",
          "lx": 660,
          "ly": 200,
          "label": "mTLS Handshake",
          "stroke": "#ec4899"
        }
      ],
      "flowNodes": [
        {
          "x": 50,
          "y": 150,
          "w": 200,
          "h": 140,
          "step": "1",
          "title": "Pod Attest",
          "stroke": "#38bdf8",
          "lines": [
            "Pod boots in cluster",
            "SPIRE agent validates pod UID",
            "Issues short-lived x509 cert"
          ]
        },
        {
          "x": 280,
          "y": 150,
          "w": 210,
          "h": 140,
          "step": "2",
          "title": "mTLS Handshake",
          "stroke": "#ec4899",
          "lines": [
            "Order Svc calls Payment Svc",
            "Both Envoys exchange certs",
            "Mutually verify SPIFFE IDs"
          ]
        },
        {
          "x": 520,
          "y": 150,
          "w": 210,
          "h": 140,
          "step": "3",
          "title": "AuthZ Enforce",
          "stroke": "#10b981",
          "lines": [
            "Payment verifies permission",
            "Only order-svc allowed on /pay",
            "Rejects unauthorized pods"
          ]
        },
        {
          "x": 760,
          "y": 150,
          "w": 200,
          "h": 140,
          "step": "4",
          "title": "JWT Propagate",
          "stroke": "#f59e0b",
          "lines": [
            "Forward end-user JWT token",
            "Payment extracts user_id",
            "Audit trail preserved"
          ]
        }
      ],
      "flowConns": [
        {
          "d": "M 250 210 L 280 210",
          "lx": 265,
          "ly": 200,
          "label": "Issue"
        },
        {
          "d": "M 490 210 L 520 210",
          "lx": 505,
          "ly": 200,
          "label": "Handshake"
        },
        {
          "d": "M 730 210 L 760 210",
          "lx": 745,
          "ly": 200,
          "label": "Authorize"
        }
      ],
      "sections": [
        {
          "heading": "1. The Death of the Castle-and-Moat Perimeter Security Model",
          "body": "Historically, corporate IT relied on perimeter security ('Castle-and-Moat'): hardware firewalls protected the external boundary, and anything inside the internal network was trusted implicitly. In modern cloud native computing, this model is dangerously obsolete. Attackers breach perimeters via compromised VPNs, malicious dependencies in open-source libraries, SSRF attacks, or rogue contractor laptops. Once inside an unencrypted network, attackers execute packet sniffing to steal credit card data and pivot laterally across databases. Zero-Trust Architecture operates on the assumption that the network is already hostile.",
          "bullets": [
            "Never Trust, Always Verify: Every single request—even between two pods on the same Kubernetes worker node—must prove its identity.",
            "Defense in Depth: Layered security combining network-level identity (mTLS), service-level authorization (RBAC), and user-level identity (JWT tokens)."
          ]
        },
        {
          "heading": "2. The SPIFFE / SPIRE Workload Attestation Standard",
          "body": "How do you give a container a cryptographically verifiable identity without hardcoding secrets in environment variables or configuration files? The answer is SPIFFE (Secure Production Identity Framework for Everyone) and its reference implementation SPIRE.",
          "bullets": [
            "SPIFFE ID: A structured URI: `spiffe://cluster.local/ns/prod/sa/order-service-sa`.",
            "Workload Attestation: The SPIRE agent queries the local Linux kernel and Kubernetes API to verify the pod's container ID, namespace, and service account. Once attested, it issues a short-lived x509 certificate (SVID).",
            "Zero Hardcoded Passwords: Certificates rotate automatically every 60 minutes; if a container is compromised, the stolen certificate expires before it can be used for persistent access."
          ]
        },
        {
          "heading": "3. User Identity vs Service Identity: JWT Propagation",
          "body": "A common security question in microservices is: 'How does a downstream service know which user initiated the request?'",
          "bullets": [
            "Service Identity (mTLS): Proves that the CALLER is Order Service, ensuring no rogue container can hit the payment endpoint.",
            "User Identity (JWT Claims): The original OAuth2 JWT token signed by the identity provider (Okta, Auth0, Keycloak) is passed in the `Authorization: Bearer <token>` header across all downstream hops, allowing services to enforce user-level data permissions."
          ]
        },
        {
          "heading": "4. Production Blueprint: Istio Zero-Trust AuthorizationPolicy",
          "body": "The following production Istio manifest enforces that only pods with the cryptographic SPIFFE identity of `order-service` can execute HTTP POST requests to `/api/v1/charge`.",
          "bullets": [
            "Source Principals: Enforces mutual TLS identity verification.",
            "Method & Path Restraints: Restricts access strictly to authorized business endpoints."
          ],
          "codeSnippet": {
            "title": "Istio Strict Zero-Trust AuthorizationPolicy Manifest",
            "code": "apiVersion: security.istio.io/v1beta1\nkind: AuthorizationPolicy\nmetadata:\n  name: payment-service-authz\n  namespace: production\nspec:\n  selector:\n    matchLabels:\n      app: payment-service\n  action: ALLOW\n  rules:\n  - from:\n    - source:\n        principals:\n        # Cryptographically verified SPIFFE ID via mTLS\n        - \"cluster.local/ns/production/sa/order-service-sa\"\n    to:\n    - operation:\n        methods: [\"POST\"]\n        paths: [\"/api/v1/charge\"]"
          }
        }
      ],
      "tradeOffs": [
        {
          "option": "Zero-Trust mTLS (SPIFFE / Istio)",
          "pros": "Automated cryptographic identity; zero hardcoded secrets; wire encryption everywhere; strict service-level authorization policies.",
          "cons": "Adds slight CPU overhead for TLS handshakes; requires service mesh or SPIRE infrastructure.",
          "bestFor": "Enterprise architectures, fintech, healthcare, and high-security compliance systems."
        },
        {
          "option": "Perimeter Firewall (Cleartext VPC)",
          "pros": "Zero proxy overhead; simplest initial configuration.",
          "cons": "Severe security vulnerability; lateral movement allows compromised pods to sniff and read all internal network packets.",
          "bestFor": "Air-gapped toy projects only."
        }
      ],
      "interviewTip": "In advanced security discussions, explain Zero-Trust layered identity: 'We implement dual identity verification. For service identity, we enforce Zero-Trust mutual TLS using Istio and SPIFFE x509 certificates rotated hourly; only pods with the verified order-service identity can connect to payment-service. For user identity, the original end-user JWT token is propagated downstream to enforce fine-grained data ownership.'"
    }
  ]
};
module.exports = { MODULE_6_OPERATIONS };
