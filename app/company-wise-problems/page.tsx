"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import FilterListIcon from "@mui/icons-material/FilterList";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import HeaderBar from "../components/HeaderBar";
import { useHandbookTheme } from "../theme/theme";

export interface CompanyProblem {
  id: string;
  topicId?: string;
  subtopicId: string;
  title: string;
  company: string;
  companyCategory: string;
  difficulty: "Foundational" | "Intermediate" | "Advanced" | "Expert";
  frequency: "Very High" | "High" | "Medium";
  summary: string;
  tags: string[];
  color: string;
}

export const COMPANY_PROBLEMS: CompanyProblem[] = [
  // ================= META =================
  {
    id: "meta-chat",
    subtopicId: "design-chat-system",
    title: "Real-Time Chat & Instant Messaging (WhatsApp / Messenger)",
    company: "Meta (WhatsApp)",
    companyCategory: "Meta",
    difficulty: "Advanced",
    frequency: "Very High",
    summary:
      "Design a planetary messaging system supporting 2B+ users, stateful WebSocket connection managers, group message fan-out, monotonic message sequencing, and offline inbox synchronization.",
    tags: ["WebSockets", "Kafka", "Monotonic IDs", "Cassandra", "Group Fan-Out"],
    color: "#0668E1",
  },
  {
    id: "meta-feed",
    subtopicId: "design-news-feed",
    title: "Social Graph News Feed & Timeline Ranking (Facebook / Instagram)",
    company: "Meta (Facebook)",
    companyCategory: "Meta",
    difficulty: "Advanced",
    frequency: "Very High",
    summary:
      "Hybrid Fanout-on-Write vs Fanout-on-Read timeline generation, celebrity hot-key write bypass, distributed Redis timeline caches, and two-stage ML ranking pipelines.",
    tags: ["Fanout-on-Write", "Redis Cluster", "Celebrity Hotkeys", "ML Ranking"],
    color: "#0668E1",
  },
  {
    id: "meta-cache",
    subtopicId: "design-distributed-cache",
    title: "Distributed Graph & In-Memory Cache (Meta TAO / Memcached)",
    company: "Meta",
    companyCategory: "Meta",
    difficulty: "Advanced",
    frequency: "High",
    summary:
      "Design a multi-terabyte in-memory caching cluster with Consistent Hashing, Virtual Nodes, Segmented LRU / W-TinyLFU eviction, and single-flight stampede protection.",
    tags: ["Consistent Hashing", "Virtual Nodes", "W-TinyLFU", "Singleflight"],
    color: "#0668E1",
  },
  {
    id: "meta-notification",
    subtopicId: "design-notification-system",
    title: "Omni-Channel Real-Time Push Notification Engine (Instagram)",
    company: "Meta (Instagram)",
    companyCategory: "Meta",
    difficulty: "Intermediate",
    frequency: "High",
    summary:
      "Multi-channel (APNs, FCM, SMS, Webhook) push engine with priority queues, device token tracking, user quiet-hours deduplication, and exponential backoff retry policies.",
    tags: ["Priority Queues", "APNs / FCM", "Deduplication", "Exponential Backoff"],
    color: "#0668E1",
  },
  {
    id: "meta-live-chat",
    subtopicId: "design-chat-system",
    title: "Live Stream Interactive Comments & Reaction Broadcast (Instagram Live)",
    company: "Meta (Instagram)",
    companyCategory: "Meta",
    difficulty: "Expert",
    frequency: "High",
    summary:
      "Design a live streaming chatroom supporting 100k+ concurrent viewers with hierarchical pub/sub broker trees, message rate sampling, and client backpressure flow control.",
    tags: ["Broadcast Pub/Sub", "Hierarchical Brokers", "Message Sampling", "Backpressure"],
    color: "#0668E1",
  },
  {
    id: "meta-ratelimiter",
    subtopicId: "design-rate-limiter",
    title: "Distributed API Rate Limiter & Throttling (Meta Graph API)",
    company: "Meta",
    companyCategory: "Meta",
    difficulty: "Intermediate",
    frequency: "Very High",
    summary:
      "Sub-millisecond API rate limiting middleware using Redis Lua atomic scripts, Token Bucket, and Sliding Window counter algorithms with fail-open resilience.",
    tags: ["Redis Lua Scripts", "Token Bucket", "Sliding Window", "Fail-Open"],
    color: "#0668E1",
  },

  // ================= GOOGLE =================
  {
    id: "google-streaming",
    subtopicId: "design-youtube-video-streaming",
    title: "Planet-Scale Video Upload, Transcoding & Delivery (YouTube)",
    company: "Google (YouTube)",
    companyCategory: "Google",
    difficulty: "Expert",
    frequency: "Very High",
    summary:
      "Design planet-scale video upload pipelines, DAG-based GOP chunk parallel transcoding, Adaptive Bitrate (ABR) streaming via HLS/DASH, and global Edge CDN distribution.",
    tags: ["DAG Transcoding", "ABR / HLS", "GOP Chunks", "Edge CDN", "Blob Storage"],
    color: "#EA4335",
  },
  {
    id: "google-storage",
    subtopicId: "design-file-storage",
    title: "Content-Defined Chunking Cloud Storage (Google Drive)",
    company: "Google (Google Drive)",
    companyCategory: "Google",
    difficulty: "Advanced",
    frequency: "Very High",
    summary:
      "Cloud storage architecture utilizing Content-Defined Chunking (Rabin Fingerprinting), Content Addressable Storage (CAS) block deduplication, and delta synchronization.",
    tags: ["Rabin Fingerprint", "CAS Deduplication", "Delta Sync", "Metadata DB"],
    color: "#EA4335",
  },
  {
    id: "google-autocomplete",
    subtopicId: "design-distributed-cache",
    title: "Typeahead Search & Autocomplete System (Google Search)",
    company: "Google",
    companyCategory: "Google",
    difficulty: "Intermediate",
    frequency: "Very High",
    summary:
      "Design a fast search autocomplete system handling millions of queries per second: Trie data structures, MapReduce frequency pre-aggregation, distributed prefix caching, and Top-K sampling.",
    tags: ["Trie Index", "Top-K Heavy Hitters", "Prefix Cache", "MapReduce"],
    color: "#EA4335",
  },
  {
    id: "google-url",
    subtopicId: "design-url-shortener",
    title: "Sub-10ms Global URL Shortener & Dynamic Links (Google / Firebase)",
    company: "Google",
    companyCategory: "Google",
    difficulty: "Foundational",
    frequency: "Very High",
    summary:
      "Designing a Bitly/TinyURL/Firebase Dynamic Links scale redirect engine using Base62 encoding, distributed Snowflake ID generators, and 301 vs 302 HTTP caching.",
    tags: ["Base62 Encoding", "Snowflake ID", "301 Permanent", "Redis Cache"],
    color: "#EA4335",
  },
  {
    id: "google-metrics",
    subtopicId: "design-metrics-logging-system",
    title: "Planet-Scale TSDB Metrics & Logging Platform (Monarch / Borg)",
    company: "Google (Monarch / Borg)",
    companyCategory: "Google",
    difficulty: "Expert",
    frequency: "High",
    summary:
      "Designing a planet-scale observability engine featuring Gorilla XOR floating-point TSDB compression, inverted label index posting lists, and streaming alert evaluation.",
    tags: ["Gorilla TSDB", "Inverted Index", "Delta-of-Delta", "Streaming Alerts"],
    color: "#EA4335",
  },
  {
    id: "google-crawler",
    subtopicId: "design-distributed-job-scheduler",
    title: "Distributed Planet-Scale Web Crawler & Indexer (Googlebot)",
    company: "Google",
    companyCategory: "Google",
    difficulty: "Expert",
    frequency: "High",
    summary:
      "Design a planetary web crawler: URL frontier with politeness constraints, DNS resolution cache, Robottxt evaluation, content deduplication using SimHash, and distributed worker queues.",
    tags: ["URL Frontier", "SimHash Deduplication", "Politeness Queues", "DNS Cache"],
    color: "#EA4335",
  },

  // ================= AMAZON =================
  {
    id: "amazon-ecommerce",
    subtopicId: "design-ecommerce-order-system",
    title: "Flash-Sale E-Commerce Checkout & Inventory (Amazon Prime Day)",
    company: "Amazon",
    companyCategory: "Amazon",
    difficulty: "Expert",
    frequency: "Very High",
    summary:
      "Amazon Prime Day checkout architecture: Saga Orchestration, Striped inventory slots for flash-sale stock decrement, immutable price snapshots, and payment handoffs.",
    tags: ["Saga Orchestration", "Striped Inventory", "Idempotency", "2PC Fallback"],
    color: "#FF9900",
  },
  {
    id: "amazon-scheduler",
    subtopicId: "design-distributed-job-scheduler",
    title: "Cloud-Scale Distributed Job & Cron Scheduler (AWS Step Functions)",
    company: "Amazon (AWS)",
    companyCategory: "Amazon",
    difficulty: "Advanced",
    frequency: "High",
    summary:
      "Designing a cloud-scale cron and delayed task execution engine with time-bucketed partition sharding, hierarchical timing wheels, and fencing-token leases.",
    tags: ["Timing Wheels", "Partition Sharding", "Fencing Tokens", "At-Least-Once"],
    color: "#FF9900",
  },
  {
    id: "amazon-ratelimiter",
    subtopicId: "design-rate-limiter",
    title: "Distributed API Gateway & Throttling Middleware (AWS API Gateway)",
    company: "Amazon (AWS)",
    companyCategory: "Amazon",
    difficulty: "Intermediate",
    frequency: "Very High",
    summary:
      "Token-bucket distributed quota tracking, per-client tier limits, burst handling, and rate limit headers at edge gateway proxies.",
    tags: ["Token Bucket", "Distributed Quotas", "Edge Proxy", "Fail-Open"],
    color: "#FF9900",
  },
  {
    id: "amazon-cache",
    subtopicId: "design-distributed-cache",
    title: "Multi-Partition High-Throughput Key-Value Cache (DynamoDB DAX)",
    company: "Amazon (AWS)",
    companyCategory: "Amazon",
    difficulty: "Advanced",
    frequency: "High",
    summary:
      "Design an in-memory caching tier directly in front of distributed NoSQL databases with consistent hashing, write-around caching, and write amplification minimization.",
    tags: ["DAX Cache", "Consistent Hashing", "Write-Around", "Write Amplification"],
    color: "#FF9900",
  },
  {
    id: "amazon-topk",
    subtopicId: "design-metrics-logging-system",
    title: "Real-Time Bestsellers & Trending Products Leaderboard (Amazon Top-K)",
    company: "Amazon",
    companyCategory: "Amazon",
    difficulty: "Advanced",
    frequency: "Very High",
    summary:
      "Design a real-time heavy hitter analytics pipeline tracking top 100 selling items per category across millions of concurrent purchases using Count-Min Sketch and sliding windows.",
    tags: ["Count-Min Sketch", "Top-K Heap", "Sliding Window", "Leaderboard"],
    color: "#FF9900",
  },

  // ================= UBER / LYFT =================
  {
    id: "uber-dispatch",
    subtopicId: "design-uber-ride-matching",
    title: "Real-Time Geospatial Ride Matching & Dispatch (Uber)",
    company: "Uber",
    companyCategory: "Uber",
    difficulty: "Expert",
    frequency: "Very High",
    summary:
      "Designing a real-time geospatial ride-dispatch engine with Uber H3 hexagonal hierarchical spatial indexing, real-time driver telemetry streams, and transactional driver locking.",
    tags: ["Uber H3 Hexagons", "Geospatial Index", "Driver Locking", "ETA Graph"],
    color: "#000000",
  },
  {
    id: "uber-surge",
    subtopicId: "design-uber-ride-matching",
    title: "Real-Time Dynamic Surge Pricing Engine (Uber / Lyft)",
    company: "Uber / Lyft",
    companyCategory: "Uber",
    difficulty: "Expert",
    frequency: "High",
    summary:
      "Design an automated dynamic pricing engine calculating supply/demand imbalances aggregated across H3 hexagonal spatial buckets over 15-second sliding windows.",
    tags: ["Surge Multiplier", "Spatial Supply/Demand", "Sliding Aggregation", "H3 Cells"],
    color: "#000000",
  },
  {
    id: "uber-notifications",
    subtopicId: "design-notification-system",
    title: "High-Volume Geofence & Driver Alert System (Uber)",
    company: "Uber",
    companyCategory: "Uber",
    difficulty: "Intermediate",
    frequency: "High",
    summary:
      "Spatial geofencing trigger queues, driver heartbeat monitoring, multi-tier notification delivery, and exponential backoff retry policies.",
    tags: ["Geofence Trigger", "Heartbeat Monitor", "Push Delivery", "Retry Policy"],
    color: "#000000",
  },
  {
    id: "uber-eats",
    subtopicId: "design-ecommerce-order-system",
    title: "Real-Time Food Delivery Dispatch & Courier Batching (UberEats)",
    company: "Uber (UberEats)",
    companyCategory: "Uber",
    difficulty: "Expert",
    frequency: "High",
    summary:
      "Three-sided marketplace orchestration: customer ordering, restaurant prep scheduling, and multi-order courier route batching with dynamic delivery windows.",
    tags: ["Three-Sided Marketplace", "Courier Batching", "Route Optimization", "Saga"],
    color: "#000000",
  },

  // ================= NETFLIX =================
  {
    id: "netflix-video",
    subtopicId: "design-youtube-video-streaming",
    title: "Global Video Transcoding & Open Connect CDN Delivery",
    company: "Netflix",
    companyCategory: "Netflix",
    difficulty: "Expert",
    frequency: "Very High",
    summary:
      "High-scale media asset processing: parallelized chunk encoding, per-title bitrate ladders, Open Connect storage appliances, and resilient edge delivery.",
    tags: ["Video Transcoding", "Open Connect", "ABR Ladders", "Resilient CDN"],
    color: "#E50914",
  },
  {
    id: "netflix-cache",
    subtopicId: "design-distributed-cache",
    title: "High-Throughput Global Cache Cluster (Netflix EVCache)",
    company: "Netflix",
    companyCategory: "Netflix",
    difficulty: "Advanced",
    frequency: "High",
    summary:
      "Designing multi-region Memcached/EVCache layers with cross-region replication, consistent hashing rings, and cache stampede protection.",
    tags: ["EVCache", "Multi-Region", "Consistent Hashing", "Singleflight"],
    color: "#E50914",
  },
  {
    id: "netflix-concurrency",
    subtopicId: "design-rate-limiter",
    title: "Concurrent Screen Limit & Active Session Enforcer (Netflix Account Sharing)",
    company: "Netflix",
    companyCategory: "Netflix",
    difficulty: "Intermediate",
    frequency: "High",
    summary:
      "Design a real-time playback session coordinator enforcing 2/4 concurrent screen policies across global users with heartbeat leases and Redis sliding windows.",
    tags: ["Session Leases", "Concurrent Limits", "Heartbeat TTL", "Redis"],
    color: "#E50914",
  },

  // ================= APPLE =================
  {
    id: "apple-apns",
    subtopicId: "design-notification-system",
    title: "Apple Push Notification service for Billions of Devices (APNs)",
    company: "Apple",
    companyCategory: "Apple",
    difficulty: "Expert",
    frequency: "Very High",
    summary:
      "Design a planetary notification broker maintaining persistent TLS connections to billions of iOS/macOS devices with priority tiers, collapse keys, and battery efficiency.",
    tags: ["Persistent TLS", "Device Tokens", "Collapse Keys", "Battery Optimization"],
    color: "#555555",
  },
  {
    id: "apple-icloud",
    subtopicId: "design-file-storage",
    title: "Multi-Device Photo & File Cloud Synchronization (iCloud)",
    company: "Apple",
    companyCategory: "Apple",
    difficulty: "Advanced",
    frequency: "Very High",
    summary:
      "Offline-first mobile synchronization: delta sync with version vectors, conflict resolution (LWW / CRDT), background upload constraints, and deduplicated asset storage.",
    tags: ["Offline-First", "Delta Sync", "Version Vectors", "Background Sync"],
    color: "#555555",
  },
  {
    id: "apple-appstore",
    subtopicId: "design-payment-system",
    title: "Global In-App Purchases, Digital Receipts & Billing (App Store)",
    company: "Apple",
    companyCategory: "Apple",
    difficulty: "Expert",
    frequency: "High",
    summary:
      "Cryptographic receipt verification, double-entry ledger bookkeeping, developer revenue split calculation, and idempotent transaction processing with zero duplicates.",
    tags: ["Receipt Verification", "Double-Entry Ledger", "Revenue Split", "PCI-DSS"],
    color: "#555555",
  },

  // ================= MICROSOFT & LINKEDIN =================
  {
    id: "ms-teams",
    subtopicId: "design-chat-system",
    title: "Real-Time Enterprise Messaging, Presence & Audio Mesh (Microsoft Teams)",
    company: "Microsoft",
    companyCategory: "Microsoft",
    difficulty: "Advanced",
    frequency: "Very High",
    summary:
      "Multi-tenant WebSocket communication gateway, presence heartbeat state machines, channel role-based access control, and Azure Cosmos DB event sourcing.",
    tags: ["Multi-Tenant WebSockets", "Presence Heartbeat", "Channel RBAC", "Event Sourcing"],
    color: "#00A4EF",
  },
  {
    id: "ms-onedrive",
    subtopicId: "design-file-storage",
    title: "Differential Block File Sync & Storage (Microsoft OneDrive)",
    company: "Microsoft",
    companyCategory: "Microsoft",
    difficulty: "Advanced",
    frequency: "High",
    summary:
      "Client-server differential sync engine: block-level hashing, bandwidth throttling, conflict resolution, and Azure Blob Storage chunked upload pipeline.",
    tags: ["Differential Sync", "Block Hashing", "Bandwidth Throttling", "Azure Blob"],
    color: "#00A4EF",
  },
  {
    id: "ms-batch",
    subtopicId: "design-distributed-job-scheduler",
    title: "Cloud Task Execution & Compute Pool Orchestrator (Azure Batch)",
    company: "Microsoft",
    companyCategory: "Microsoft",
    difficulty: "Advanced",
    frequency: "High",
    summary:
      "Distributed task allocation across dynamically autoscaled worker VM pools, task dependency DAG evaluation, lease renewal, and dead-letter queues.",
    tags: ["Autoscaling VM Pools", "Task DAG", "Lease Renewal", "Dead Letter Queue"],
    color: "#00A4EF",
  },
  {
    id: "linkedin-connections",
    subtopicId: "design-news-feed",
    title: "Social Graph & 2nd-Degree Connection Traversals (LinkedIn Graph)",
    company: "LinkedIn",
    companyCategory: "LinkedIn",
    difficulty: "Expert",
    frequency: "Very High",
    summary:
      "Design LinkedIn's connection graph: storing 1B+ professional relationships, sub-second bidirectional BFS 2nd/3rd-degree queries, and 'People You May Know' recommendations.",
    tags: ["Graph Database", "Bidirectional BFS", "Adjacency Lists", "Degree Separation"],
    color: "#0A66C2",
  },
  {
    id: "linkedin-alerts",
    subtopicId: "design-notification-system",
    title: "Real-Time Activity Feed & Job Alerts Push Engine (LinkedIn)",
    company: "LinkedIn",
    companyCategory: "LinkedIn",
    difficulty: "Intermediate",
    frequency: "High",
    summary:
      "Real-time event fanout for profile views, job recommendation push alerts, user notification preference filtering, and Kafka-backed event delivery.",
    tags: ["Kafka Fanout", "Job Alerts", "User Preferences", "Event Sinks"],
    color: "#0A66C2",
  },

  // ================= TWITTER / X =================
  {
    id: "twitter-timeline",
    subtopicId: "design-news-feed",
    title: "Timeline Feed Fanout & Real-Time Tweet Distribution (Twitter / X)",
    company: "Twitter / X",
    companyCategory: "Twitter / X",
    difficulty: "Advanced",
    frequency: "Very High",
    summary:
      "Hybrid Fanout-on-Write for normal users and Fanout-on-Read for high-follower accounts, Redis timeline lists, and sub-100ms global delivery.",
    tags: ["Hybrid Fanout", "Celebrity Write Bypass", "Redis Lists", "Sub-100ms SLA"],
    color: "#1DA1F2",
  },
  {
    id: "twitter-trends",
    subtopicId: "design-metrics-logging-system",
    title: "Real-Time Trending Topics & Hashtags (Top-K Heavy Hitters)",
    company: "Twitter / X",
    companyCategory: "Twitter / X",
    difficulty: "Expert",
    frequency: "Very High",
    summary:
      "Design a streaming pipeline to detect real-time trending topics and hashtags over 5-minute sliding windows with Count-Min Sketch, decay factors, and anti-spam filters.",
    tags: ["Count-Min Sketch", "Decay Windows", "Anti-Spam Filter", "Heavy Hitters"],
    color: "#1DA1F2",
  },
  {
    id: "twitter-tco",
    subtopicId: "design-url-shortener",
    title: "Global t.co URL Redirection & Malicious Link Protection",
    company: "Twitter / X",
    companyCategory: "Twitter / X",
    difficulty: "Foundational",
    frequency: "High",
    summary:
      "Global sub-10ms redirection service inspecting links against real-time phishing blacklists before redirecting, logging click-through metrics asynchronously.",
    tags: ["URL Shortener", "Malware Filter", "Click Analytics", "Redis Caching"],
    color: "#1DA1F2",
  },

  // ================= BYTEDANCE / TIKTOK =================
  {
    id: "bytedance-recommendation",
    subtopicId: "design-news-feed",
    title: "TikTok Short Video Personalized Feed & Real-Time Ranking",
    company: "ByteDance (TikTok)",
    companyCategory: "ByteDance",
    difficulty: "Expert",
    frequency: "Very High",
    summary:
      "Design TikTok's 'For You' video feed: multi-stage recommendation architecture (Recall, Coarse Rank, Fine Rank), real-time watch-time feedback loops, and video pre-fetching.",
    tags: ["Multi-Stage Ranking", "Watch-Time Feedback", "Video Prefetch", "Low-Latency"],
    color: "#FE2C55",
  },
  {
    id: "bytedance-live",
    subtopicId: "design-chat-system",
    title: "TikTok Live Stream Chat & Real-Time Comments (100k+ Viewers)",
    company: "ByteDance (TikTok)",
    companyCategory: "ByteDance",
    difficulty: "Expert",
    frequency: "Very High",
    summary:
      "High-throughput live chat system during massive influencer broadcasts: message rate sampling, client backpressure, distributed broadcast pub/sub, and WebRTC streaming.",
    tags: ["Hierarchical Pub/Sub", "Message Sampling", "WebRTC", "Backpressure"],
    color: "#FE2C55",
  },
  {
    id: "bytedance-capcut",
    subtopicId: "design-youtube-video-streaming",
    title: "Cloud Video Processing & Multi-Format Transcoder (CapCut)",
    company: "ByteDance (CapCut)",
    companyCategory: "ByteDance",
    difficulty: "Advanced",
    frequency: "High",
    summary:
      "Distributed video rendering cluster: splitting uploaded video projects into timeline parallel chunks, GPU worker pools, and automated content safety moderation.",
    tags: ["Chunk Transcoding", "GPU Worker Pools", "Content Moderation", "Fast Sync"],
    color: "#FE2C55",
  },

  // ================= AIRBNB =================
  {
    id: "airbnb-booking",
    subtopicId: "design-ticket-booking",
    title: "Vacation Rental Reservation & Temporary Hold (Prevent Double Booking)",
    company: "Airbnb",
    companyCategory: "Airbnb",
    difficulty: "Advanced",
    frequency: "Very High",
    summary:
      "Design Airbnb's reservation engine ensuring zero double-bookings: Optimistic Concurrency Control (OCC) with versioning, 15-minute temporary holds with TTL, and distributed locks.",
    tags: ["Zero Double-Booking", "OCC Versioning", "15-Min Hold", "Distributed Locks"],
    color: "#FF5A5F",
  },
  {
    id: "airbnb-search",
    subtopicId: "design-uber-ride-matching",
    title: "Geospatial Vacation Property Search & Map Bounding-Box Clustering",
    company: "Airbnb",
    companyCategory: "Airbnb",
    difficulty: "Advanced",
    frequency: "Very High",
    summary:
      "Spatial search engine: Quadtree / Geo-hash spatial indexing, map viewport bounding-box queries, dynamic pricing filters, and cluster aggregation for dense cities.",
    tags: ["Quadtree Index", "Viewport Queries", "Spatial Clustering", "Filter Engine"],
    color: "#FF5A5F",
  },
  {
    id: "airbnb-pricing",
    subtopicId: "design-ecommerce-order-system",
    title: "Listing Availability Calendar & Dynamic Seasonal Pricing",
    company: "Airbnb",
    companyCategory: "Airbnb",
    difficulty: "Expert",
    frequency: "High",
    summary:
      "High-scale availability calendar using bitmask representations per year, high-write host price rule updates, seasonal surge recalculations, and tier caching.",
    tags: ["Bitmask Availability", "Dynamic Pricing", "Tiered Caching", "Host Rules"],
    color: "#FF5A5F",
  },

  // ================= STRIPE =================
  {
    id: "stripe-ledger",
    subtopicId: "design-payment-system",
    title: "Idempotent Double-Entry Payment Ledger & Billing Engine (Stripe)",
    company: "Stripe",
    companyCategory: "Stripe",
    difficulty: "Expert",
    frequency: "Very High",
    summary:
      "Financial transaction engine: Idempotency keys, immutable double-entry bookkeeping ledger, Payment Service Provider (PSP) orchestration, and automated T+1 settlement reconciliation.",
    tags: ["Idempotency Keys", "Double-Entry Ledger", "PSP Routing", "T+1 Settlement"],
    color: "#635BFF",
  },
  {
    id: "stripe-webhooks",
    subtopicId: "design-notification-system",
    title: "High-Reliability Outgoing Webhook Delivery Engine (Stripe)",
    company: "Stripe",
    companyCategory: "Stripe",
    difficulty: "Advanced",
    frequency: "Very High",
    summary:
      "Reliable webhook dispatch platform: guaranteed at-least-once delivery, HMAC SHA-256 signatures, exponential backoff with jitter, and dead-letter quarantine queues.",
    tags: ["Guaranteed Delivery", "Exponential Backoff", "HMAC Signatures", "DLQ"],
    color: "#635BFF",
  },
  {
    id: "stripe-ratelimiter",
    subtopicId: "design-rate-limiter",
    title: "High-Throughput Card Velocity & Fraud Defense Rate Limiter (Stripe)",
    company: "Stripe",
    companyCategory: "Stripe",
    difficulty: "Advanced",
    frequency: "High",
    summary:
      "Sliding window counter, credit card hash buckets, Redis cluster pipelining, and sub-millisecond fraud pattern evaluation before hitting payment processors.",
    tags: ["Sliding Window", "Card Velocity", "Redis Cluster", "Sub-Millisecond"],
    color: "#635BFF",
  },

  // ================= FINTECH & TRADING =================
  {
    id: "robinhood-trading",
    subtopicId: "design-stock-trading-system",
    title: "Ultra-Low-Latency Stock Trading & Order Matching Engine",
    company: "Robinhood / Citadel / Zerodha",
    companyCategory: "Fintech",
    difficulty: "Expert",
    frequency: "Very High",
    summary:
      "Design an ultra-low-latency electronic exchange with LMAX Disruptor lock-free ring buffers, single-threaded deterministic Limit Order Books, and Raft event journals.",
    tags: ["LMAX Disruptor", "Limit Order Book", "Raft Journal", "Zero-Copy"],
    color: "#00C805",
  },
  {
    id: "robinhood-ticker",
    subtopicId: "design-chat-system",
    title: "Real-Time Market Data Ticker & WebSocket Streaming",
    company: "Robinhood / Coinbase",
    companyCategory: "Fintech",
    difficulty: "Advanced",
    frequency: "High",
    summary:
      "High-throughput financial market data pipeline: sub-millisecond tick ingestion, conflated WebSocket streams for mobile clients, broadcast pub/sub, and L2/L3 order book depth.",
    tags: ["Market Ticks", "Conflated Streams", "WebSockets", "Order Book Depth"],
    color: "#00C805",
  },

  // ================= TICKETMASTER =================
  {
    id: "ticketmaster-booking",
    subtopicId: "design-ticket-booking",
    title: "Flash-Sale Concert Ticket Booking & Virtual Waiting Room",
    company: "Ticketmaster / BookMyShow",
    companyCategory: "Entertainment",
    difficulty: "Advanced",
    frequency: "Very High",
    summary:
      "Design high-concurrency ticket reservation systems: Virtual Waiting Room FIFO queues, temporary 10-minute seat holds with TTL, and Optimistic Concurrency Control (OCC).",
    tags: ["Waiting Room Queue", "10-Min Seat Hold", "Redis TTL", "OCC Stampede"],
    color: "#026CDF",
  },

  // ================= STORAGE & INFRA =================
  {
    id: "dropbox-sync",
    subtopicId: "design-file-storage",
    title: "Cloud File Storage, Block Deduplication & Delta Sync (Dropbox / Box)",
    company: "Dropbox / Box",
    companyCategory: "Storage & Infra",
    difficulty: "Advanced",
    frequency: "Very High",
    summary:
      "Client-server file synchronization: Rabin Fingerprinting for variable chunking, metadata DAG database, delta upload, and multi-device push notifications.",
    tags: ["Rabin Fingerprint", "Block Sync", "Delta Compression", "Metadata DAG"],
    color: "#0061FF",
  },

  // ================= OBSERVABILITY =================
  {
    id: "datadog-observability",
    subtopicId: "design-metrics-logging-system",
    title: "Distributed Time-Series Metric & Log Aggregation Engine (Datadog)",
    company: "Datadog / Prometheus",
    companyCategory: "Observability",
    difficulty: "Expert",
    frequency: "Very High",
    summary:
      "Planet-scale metrics collector: Gorilla TSDB XOR floating-point compression, Lucene-style inverted label posting lists, distributed LSM log storage, and streaming threshold alerts.",
    tags: ["Gorilla TSDB", "Inverted Index", "LSM Storage", "Streaming Alerts"],
    color: "#632CA6",
  },
];

export const COMPANY_CATEGORIES = [
  "All Companies",
  "Meta",
  "Google",
  "Amazon",
  "Uber",
  "Netflix",
  "Apple",
  "Microsoft",
  "LinkedIn",
  "Twitter / X",
  "ByteDance",
  "Airbnb",
  "Stripe",
  "Fintech",
  "Storage & Infra",
  "Observability",
];

export const DIFFICULTY_LEVELS = ["All Levels", "Foundational", "Intermediate", "Advanced", "Expert"];

export default function CompanyWiseProblemsPage() {
  const { mode, theme, toggleThemeMode } = useHandbookTheme();
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProblems = useMemo(() => {
    return COMPANY_PROBLEMS.filter((problem) => {
      const matchesCompany =
        selectedCompany === "All Companies" ||
        problem.companyCategory === selectedCompany ||
        problem.company.toLowerCase().includes(selectedCompany.toLowerCase());

      const matchesDifficulty =
        selectedDifficulty === "All Levels" ||
        problem.difficulty === selectedDifficulty;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        problem.title.toLowerCase().includes(q) ||
        problem.company.toLowerCase().includes(q) ||
        problem.summary.toLowerCase().includes(q) ||
        problem.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchesCompany && matchesDifficulty && matchesSearch;
    });
  }, [selectedCompany, selectedDifficulty, searchQuery]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <HeaderBar
          mode={mode}
          currentNav="company-wise"
          onToggleThemeMode={toggleThemeMode}
        />

        <Container maxWidth="lg" sx={{ py: { xs: 3.5, sm: 5, md: 7 }, flex: 1 }}>
          {/* Header Banner */}
          <Box sx={{ mb: 4.5, textAlign: { xs: "left", sm: "center" } }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                justifyContent: { xs: "flex-start", sm: "center" },
                mb: 1,
              }}
            >
              <BusinessRoundedIcon color="primary" />
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  color: "primary.main",
                }}
              >
                FAANG & Tier-1 Tech Interview Blueprints
              </Typography>
            </Stack>

            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "1.85rem", sm: "2.5rem", md: "2.8rem" },
                letterSpacing: "-0.02em",
                mb: 1.5,
              }}
            >
              Company-Wise System Design Problems
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: 820,
                mx: "auto",
                lineHeight: 1.7,
                fontSize: { xs: "0.95rem", sm: "1.05rem" },
              }}
            >
              Curated from real interview experiences across Meta, Google, Amazon,
              Uber, Netflix, Apple, Microsoft, Twitter/X, ByteDance, Airbnb, and Stripe.
              Each problem maps directly to production blueprints, ASCII architectural
              flows, and trade-off matrices in the GOD Handbook.
            </Typography>
          </Box>

          {/* Search & Filter Controls */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: 3,
              bgcolor:
                mode === "light"
                  ? "rgba(255, 255, 255, 0.9)"
                  : "rgba(15, 23, 42, 0.85)",
              backdropFilter: "blur(10px)",
              mb: 4,
            }}
          >
            {/* Search Input */}
            <TextField
              fullWidth
              size="small"
              placeholder="Search by problem name, company, or architectural component (e.g. Kafka, H3, WebSocket, Gorilla, Saga)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchQuery("")}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                  sx: { borderRadius: 2, bgcolor: mode === "light" ? "#f8fafc" : "#1e293b" },
                },
              }}
              sx={{ mb: 2 }}
            />

            {/* Company Categories Filter Bar */}
            <Box sx={{ mb: 1.5 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 750,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "text.secondary",
                  display: "block",
                  mb: 0.75,
                }}
              >
                Filter by Company
              </Typography>
              <Stack
                direction="row"
                spacing={0.75}
                sx={{
                  overflowX: "auto",
                  pb: 0.5,
                  "&::-webkit-scrollbar": { height: 4 },
                }}
              >
                {COMPANY_CATEGORIES.map((cat) => {
                  const isSelected = selectedCompany === cat;
                  return (
                    <Chip
                      key={cat}
                      label={cat}
                      size="small"
                      clickable
                      onClick={() => setSelectedCompany(cat)}
                      color={isSelected ? "primary" : "default"}
                      variant={isSelected ? "filled" : "outlined"}
                      sx={{
                        fontWeight: isSelected ? 750 : 550,
                        borderRadius: 1.5,
                        px: 0.5,
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>

            {/* Difficulty Level Filter & Counter */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                <FilterListIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                  Difficulty:
                </Typography>
                {DIFFICULTY_LEVELS.map((lvl) => {
                  const isSelected = selectedDifficulty === lvl;
                  return (
                    <Chip
                      key={lvl}
                      label={lvl}
                      size="small"
                      clickable
                      onClick={() => setSelectedDifficulty(lvl)}
                      color={isSelected ? "secondary" : "default"}
                      variant={isSelected ? "filled" : "outlined"}
                      sx={{
                        fontSize: "0.72rem",
                        height: 24,
                        fontWeight: isSelected ? 750 : 500,
                        borderRadius: 1.5,
                      }}
                    />
                  );
                })}
              </Stack>

              <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                Showing <strong>{filteredProblems.length}</strong> of{" "}
                {COMPANY_PROBLEMS.length} problems
              </Typography>
            </Stack>
          </Paper>

          {/* Problem Cards Grid */}
          <Grid container spacing={3}>
            {filteredProblems.map((problem) => (
              <Grid key={problem.id} size={{ xs: 12, md: 6 }}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    bgcolor:
                      mode === "light"
                        ? "rgba(255, 255, 255, 0.88)"
                        : "rgba(15, 23, 42, 0.75)",
                    border: "1px solid",
                    borderColor:
                      mode === "light"
                        ? "rgba(226, 232, 240, 0.9)"
                        : "rgba(51, 65, 85, 0.8)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      borderColor: "primary.main",
                      boxShadow:
                        mode === "light"
                          ? "0 10px 24px rgba(180, 83, 9, 0.12)"
                          : "0 10px 28px rgba(0, 0, 0, 0.4)",
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, sm: 3 }, flex: 1, display: "flex", flexDirection: "column" }}>
                    {/* Top Row: Company Badge & Frequency / Difficulty */}
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                      }}
                    >
                      <Chip
                        icon={<VerifiedIcon sx={{ fontSize: "14px !important" }} />}
                        label={problem.company}
                        size="small"
                        sx={{
                          fontWeight: 750,
                          fontSize: "0.75rem",
                          bgcolor:
                            mode === "light"
                              ? "rgba(241, 245, 249, 0.9)"
                              : "rgba(30, 41, 59, 0.8)",
                          color: "text.primary",
                          borderRadius: 1.5,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      />

                      <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                        {problem.frequency === "Very High" && (
                          <Chip
                            icon={<LocalFireDepartmentIcon sx={{ fontSize: "13px !important" }} />}
                            label="Hot"
                            size="small"
                            sx={{
                              fontWeight: 800,
                              fontSize: "0.68rem",
                              height: 22,
                              borderRadius: 1.5,
                              bgcolor: "rgba(239, 68, 68, 0.12)",
                              color: "#ef4444",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                            }}
                          />
                        )}

                        <Chip
                          label={problem.difficulty}
                          size="small"
                          sx={{
                            fontWeight: 750,
                            fontSize: "0.7rem",
                            height: 22,
                            borderRadius: 1.5,
                            bgcolor:
                              problem.difficulty === "Expert"
                                ? "rgba(239, 68, 68, 0.15)"
                                : problem.difficulty === "Advanced"
                                ? "rgba(245, 158, 11, 0.15)"
                                : problem.difficulty === "Intermediate"
                                ? "rgba(56, 189, 248, 0.15)"
                                : "rgba(34, 197, 94, 0.15)",
                            color:
                              problem.difficulty === "Expert"
                                ? "#ef4444"
                                : problem.difficulty === "Advanced"
                                ? "#f59e0b"
                                : problem.difficulty === "Intermediate"
                                ? "#0284c7"
                                : "#16a34a",
                          }}
                        />
                      </Stack>
                    </Stack>

                    {/* Problem Title */}
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: "1.05rem", sm: "1.15rem" },
                        lineHeight: 1.35,
                        mb: 1,
                      }}
                    >
                      {problem.title}
                    </Typography>

                    {/* Problem Summary / Scenario */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.6,
                        fontSize: "0.88rem",
                        mb: 2,
                        flex: 1,
                      }}
                    >
                      {problem.summary}
                    </Typography>

                    {/* Architectural Concept Tags */}
                    <Stack
                      direction="row"
                      spacing={0.6}
                      sx={{ flexWrap: "wrap", gap: 0.6, mb: 2.5 }}
                    >
                      {problem.tags.map((tag, tIdx) => (
                        <Chip
                          key={tIdx}
                          label={tag}
                          size="small"
                          sx={{
                            fontSize: "0.68rem",
                            height: 20,
                            fontWeight: 600,
                            fontFamily: "monospace",
                            borderRadius: 1,
                            bgcolor:
                              mode === "light"
                                ? "rgba(241, 245, 249, 0.9)"
                                : "rgba(15, 23, 42, 0.8)",
                            color: "text.secondary",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                      ))}
                    </Stack>

                    {/* CTA Button linking to Handbook Reader */}
                    <Button
                      component={Link}
                      href={`/?topic=${problem.topicId || "must-practice-designs"}&subtopic=${problem.subtopicId}`}
                      variant="outlined"
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                      fullWidth
                      sx={{
                        textTransform: "none",
                        fontWeight: 750,
                        fontSize: "0.85rem",
                        borderRadius: 2,
                        py: 0.85,
                        borderColor: "primary.main",
                        "&:hover": {
                          bgcolor: "primary.main",
                          color: "#ffffff",
                        },
                      }}
                    >
                      Read Blueprint & Architecture
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredProblems.length === 0 && (
            <Paper
              variant="outlined"
              sx={{
                p: 5,
                borderRadius: 3,
                textAlign: "center",
                bgcolor:
                  mode === "light"
                    ? "rgba(255, 255, 255, 0.8)"
                    : "rgba(15, 23, 42, 0.6)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                No problems match your filter
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                Try resetting your search query or company filter.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setSelectedCompany("All Companies");
                  setSelectedDifficulty("All Levels");
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </Button>
            </Paper>
          )}
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor:
              mode === "light"
                ? "rgba(255, 255, 255, 0.7)"
                : "rgba(15, 23, 42, 0.7)",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            © {new Date().getFullYear()} Gangs of Developers (GOD). Authored by{" "}
            <strong>Dharam</strong> (
            <Link
              href="https://github.com/dharamcodes"
              target="_blank"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              @dharamcodes
            </Link>
            ).
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
