"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  ThemeProvider,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import TerminalRoundedIcon from "@mui/icons-material/TerminalRounded";
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import HeaderBar from "./HeaderBar";
import GodLogoMark from "./GodLogoMark";
import { useHandbookTheme } from "../theme/theme";

export default function HomePageView() {
  const { mode, theme, toggleThemeMode } = useHandbookTheme();
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);

  const isLight = mode === "light";

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
          overflowX: "hidden",
        }}
      >
        {/* Universal Sticky Header Bar */}
        <HeaderBar
          mode={mode}
          currentNav="home"
          onToggleThemeMode={toggleThemeMode}
        />

        {/* ========================================================= */}
        {/* HERO SECTION                                              */}
        {/* ========================================================= */}
        <Box
          component="section"
          aria-label="Hero Introduction"
          sx={{
            position: "relative",
            pt: { xs: 6, sm: 9, md: 12 },
            pb: { xs: 8, sm: 11, md: 14 },
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundImage: isLight
              ? "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245, 158, 11, 0.12), transparent)"
              : "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245, 158, 11, 0.18), transparent)",
          }}
        >
          <Container maxWidth="lg">
            <Stack spacing={4} sx={{ alignItems: "center", textAlign: "center" }}>
              {/* Status Pill Badge */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.25,
                  px: 2,
                  py: 0.75,
                  borderRadius: 10,
                  bgcolor: isLight ? "rgba(245, 158, 11, 0.1)" : "rgba(245, 158, 11, 0.15)",
                  border: "1px solid",
                  borderColor: isLight ? "rgba(245, 158, 11, 0.3)" : "rgba(245, 158, 11, 0.4)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#10b981",
                    boxShadow: "0 0 10px #10b981",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 750,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: isLight ? "#92400e" : "#fcd34d",
                    fontSize: { xs: "0.72rem", sm: "0.78rem" },
                  }}
                >
                  Gangs of Developers • Distributed Systems & Architecture Knowledge Base
                </Typography>
              </Box>

              {/* Main Headline */}
              <Typography
                component="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "2.4rem", sm: "3.5rem", md: "4.4rem" },
                  lineHeight: { xs: 1.15, md: 1.08 },
                  letterSpacing: { xs: "-0.03em", md: "-0.04em" },
                  maxWidth: 960,
                  color: isLight ? "#0f172a" : "#f8fafc",
                }}
              >
                Build Better Systems.{" "}
                <Box
                  component="span"
                  sx={{
                    background: isLight
                      ? "linear-gradient(135deg, #b45309 0%, #0284c7 100%)"
                      : "linear-gradient(135deg, #f59e0b 0%, #38bdf8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "inline-block",
                  }}
                >
                  Master Distributed Systems Design.
                </Box>
              </Typography>

              {/* Supporting Lead Description */}
              <Typography
                variant="h6"
                sx={{
                  maxWidth: 780,
                  fontWeight: 450,
                  fontSize: { xs: "1.02rem", sm: "1.2rem", md: "1.28rem" },
                  lineHeight: 1.6,
                  color: "text.secondary",
                }}
              >
                A battle-tested engineering reference for software engineers, backend architects, and
                system design interview candidates. Master distributed consensus, resilience patterns,
                microservices boundaries, and Gang of Four designs with zero marketing hand-waving.
              </Typography>

              {/* Action Buttons */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ pt: 1, width: { xs: "100%", sm: "auto" } }}
              >
                <Button
                  component={Link}
                  href="/free-course"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    px: 3.5,
                    py: 1.5,
                    fontWeight: 750,
                    fontSize: "1rem",
                    borderRadius: 2,
                    textTransform: "none",
                    bgcolor: isLight ? "#b45309" : "#f59e0b",
                    color: isLight ? "#ffffff" : "#0f172a",
                    boxShadow: "0 4px 16px rgba(245, 158, 11, 0.35)",
                    "&:hover": {
                      bgcolor: isLight ? "#92400e" : "#d97706",
                      boxShadow: "0 6px 20px rgba(245, 158, 11, 0.45)",
                    },
                  }}
                >
                  Explore System Design Handbook
                </Button>

                <Button
                  component={Link}
                  href="/microservices"
                  variant="outlined"
                  size="large"
                  startIcon={<AccountTreeRoundedIcon />}
                  sx={{
                    px: 3,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: "1rem",
                    borderRadius: 2,
                    textTransform: "none",
                    borderColor: isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.2)",
                    color: "text.primary",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: isLight ? "rgba(2, 132, 199, 0.05)" : "rgba(56, 189, 248, 0.08)",
                    },
                  }}
                >
                  Microservices Architecture
                </Button>

                <Button
                  component={Link}
                  href="/design-patterns"
                  variant="outlined"
                  size="large"
                  startIcon={<WidgetsRoundedIcon />}
                  sx={{
                    px: 3,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: "1rem",
                    borderRadius: 2,
                    textTransform: "none",
                    borderColor: isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.2)",
                    color: "text.primary",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: isLight ? "rgba(2, 132, 199, 0.05)" : "rgba(56, 189, 248, 0.08)",
                    },
                  }}
                >
                  23 GoF Design Patterns
                </Button>
              </Stack>

              {/* Live Metric Statistics Strip */}
              <Grid
                container
                spacing={{ xs: 2, sm: 3 }}
                sx={{
                  pt: { xs: 4, sm: 6 },
                  maxWidth: 960,
                  width: "100%",
                }}
              >
                {[
                  { value: "130+", label: "System Design Topics", sub: "13 Core Modules" },
                  { value: "32", label: "Microservices Patterns", sub: "Distributed Resilience & Mesh" },
                  { value: "23", label: "Classic GoF Patterns", sub: "UML Models & Java 21 Code" },
                  { value: "75+", label: "FAANG Interview Problems", sub: "High-Frequency System Questions" },
                ].map((stat, idx) => (
                  <Grid size={{ xs: 6, sm: 3 }} key={idx}>
                    <Box
                      sx={{
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: 2.5,
                        bgcolor: isLight ? "rgba(255, 255, 255, 0.7)" : "rgba(15, 23, 42, 0.65)",
                        border: "1px solid",
                        borderColor: "divider",
                        backdropFilter: "blur(8px)",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 900,
                          color: isLight ? "#b45309" : "#f59e0b",
                          fontSize: { xs: "1.8rem", sm: "2.2rem" },
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 750, color: "text.primary", mt: 0.5 }}
                      >
                        {stat.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                        {stat.sub}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Hero Technical SVG Blueprint */}
              <Box
                sx={{
                  mt: { xs: 3, sm: 5 },
                  width: "100%",
                  maxWidth: 1040,
                  p: { xs: 1.5, sm: 2.5 },
                  borderRadius: 3.5,
                  bgcolor: isLight ? "#ffffff" : "#070b14",
                  border: "1px solid",
                  borderColor: isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.12)",
                  boxShadow: isLight
                    ? "0 10px 40px -10px rgba(15, 23, 42, 0.08)"
                    : "0 16px 50px -12px rgba(0, 0, 0, 0.6)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pb: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#ef4444" }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#f59e0b" }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#10b981" }} />
                    <Typography
                      variant="caption"
                      sx={{
                        ml: 1,
                        fontFamily: "ui-monospace, monospace",
                        color: "text.secondary",
                        fontWeight: 600,
                      }}
                    >
                      architecture-blueprint.svg • Multi-Tier Distributed Topology
                    </Typography>
                  </Stack>
                  <Chip
                    label="Live Architecture Topology"
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      bgcolor: isLight ? "rgba(2, 132, 199, 0.1)" : "rgba(56, 189, 248, 0.15)",
                      color: isLight ? "#0369a1" : "#38bdf8",
                    }}
                  />
                </Box>

                {/* Scalable High-Res SVG Blueprint Canvas */}
                <Box sx={{ mt: 2, overflowX: "auto" }}>
                  <svg
                    viewBox="0 0 980 260"
                    width="100%"
                    height="100%"
                    style={{ minWidth: 680, display: "block" }}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="heroCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={isLight ? "#f8fafc" : "#0f172a"} />
                        <stop offset="100%" stopColor={isLight ? "#f1f5f9" : "#090d16"} />
                      </linearGradient>
                      <marker id="heroArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill={isLight ? "#64748b" : "#94a3b8"} />
                      </marker>
                    </defs>

                    {/* Stage 1: Edge & Anycast */}
                    <g>
                      <rect x="20" y="50" width="160" height="150" rx="8" fill="url(#heroCardGrad)" stroke={isLight ? "#cbd5e1" : "#334155"} strokeWidth="1.5" />
                      <rect x="20" y="50" width="160" height="30" rx="8" fill={isLight ? "#e0f2fe" : "rgba(2, 132, 199, 0.2)"} />
                      <text x="100" y="70" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="800" fill={isLight ? "#0369a1" : "#38bdf8"}>1. EDGE &amp; INGRESS</text>
                      <text x="35" y="105" fontFamily="monospace" fontSize="10" fill={isLight ? "#475569" : "#cbd5e1"}>• Global Anycast DNS</text>
                      <text x="35" y="125" fontFamily="monospace" fontSize="10" fill={isLight ? "#475569" : "#cbd5e1"}>• Cloudflare / CDN Edge</text>
                      <text x="35" y="145" fontFamily="monospace" fontSize="10" fill={isLight ? "#475569" : "#cbd5e1"}>• DDoS / WAF Shield</text>
                      <text x="35" y="175" fontFamily="monospace" fontSize="9.5" fontWeight="700" fill="#10b981">p99 Latency: &lt;15ms</text>
                    </g>

                    {/* Arrow 1 */}
                    <path d="M 180 125 L 240 125" stroke={isLight ? "#64748b" : "#94a3b8"} strokeWidth="2" fill="none" markerEnd="url(#heroArrow)" />
                    <text x="210" y="115" textAnchor="middle" fontFamily="sans-serif" fontSize="8.5" fontWeight="700" fill={isLight ? "#64748b" : "#94a3b8"}>HTTPS / TLS</text>

                    {/* Stage 2: Gateway & Mesh */}
                    <g>
                      <rect x="240" y="40" width="180" height="170" rx="8" fill="url(#heroCardGrad)" stroke={isLight ? "#b45309" : "#f59e0b"} strokeWidth="2" />
                      <rect x="240" y="40" width="180" height="32" rx="8" fill={isLight ? "rgba(245, 158, 11, 0.15)" : "rgba(245, 158, 11, 0.25)"} />
                      <text x="330" y="61" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="800" fill={isLight ? "#b45309" : "#f59e0b"}>2. API GATEWAY &amp; MESH</text>
                      <text x="255" y="95" fontFamily="monospace" fontSize="10" fill={isLight ? "#475569" : "#cbd5e1"}>• Envoy Proxy &amp; Istio</text>
                      <text x="255" y="115" fontFamily="monospace" fontSize="10" fill={isLight ? "#475569" : "#cbd5e1"}>• JWT / OAuth2 Token Auth</text>
                      <text x="255" y="135" fontFamily="monospace" fontSize="10" fill={isLight ? "#475569" : "#cbd5e1"}>• Token Bucket Limiter</text>
                      <text x="255" y="155" fontFamily="monospace" fontSize="10" fill={isLight ? "#475569" : "#cbd5e1"}>• Circuit Breaker Valve</text>
                      <text x="255" y="188" fontFamily="monospace" fontSize="9.5" fontWeight="700" fill={isLight ? "#b45309" : "#f59e0b"}>Resilience4j / Bulkhead</text>
                    </g>

                    {/* Arrow 2 */}
                    <path d="M 420 125 L 480 125" stroke={isLight ? "#64748b" : "#94a3b8"} strokeWidth="2" fill="none" markerEnd="url(#heroArrow)" />
                    <text x="450" y="115" textAnchor="middle" fontFamily="sans-serif" fontSize="8.5" fontWeight="700" fill={isLight ? "#64748b" : "#94a3b8"}>gRPC / mTLS</text>

                    {/* Stage 3: Microservices Cluster */}
                    <g>
                      <rect x="480" y="50" width="180" height="150" rx="8" fill="url(#heroCardGrad)" stroke={isLight ? "#0284c7" : "#38bdf8"} strokeWidth="1.5" />
                      <rect x="480" y="50" width="180" height="30" rx="8" fill={isLight ? "#e0f2fe" : "rgba(2, 132, 199, 0.2)"} />
                      <text x="570" y="70" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="800" fill={isLight ? "#0369a1" : "#38bdf8"}>3. MICROSERVICES FLEET</text>
                      <text x="495" y="105" fontFamily="monospace" fontSize="10" fill={isLight ? "#475569" : "#cbd5e1"}>• Order Service (Java 21)</text>
                      <text x="495" y="125" fontFamily="monospace" fontSize="10" fill={isLight ? "#475569" : "#cbd5e1"}>• Payment Service (Go)</text>
                      <text x="495" y="145" fontFamily="monospace" fontSize="10" fill={isLight ? "#475569" : "#cbd5e1"}>• Catalog Service (Rust)</text>
                      <text x="495" y="175" fontFamily="monospace" fontSize="9.5" fontWeight="700" fill="#10b981">Auto-Scaled Pods (HPA)</text>
                    </g>

                    {/* Arrow 3 (Top to Storage, Bottom to Kafka) */}
                    <path d="M 660 100 L 730 80" stroke={isLight ? "#64748b" : "#94a3b8"} strokeWidth="2" fill="none" markerEnd="url(#heroArrow)" />
                    <path d="M 660 150 L 730 170" stroke={isLight ? "#64748b" : "#94a3b8"} strokeWidth="2" fill="none" markerEnd="url(#heroArrow)" />

                    {/* Stage 4A: Cache & DB Shards */}
                    <g>
                      <rect x="730" y="20" width="230" height="95" rx="8" fill="url(#heroCardGrad)" stroke={isLight ? "#cbd5e1" : "#334155"} strokeWidth="1.5" />
                      <text x="745" y="42" fontFamily="sans-serif" fontSize="11" fontWeight="800" fill={isLight ? "#0f172a" : "#f8fafc"}>4A. DATA TIER</text>
                      <text x="745" y="65" fontFamily="monospace" fontSize="9.5" fill={isLight ? "#475569" : "#cbd5e1"}>• Redis Cluster (L2 Cache)</text>
                      <text x="745" y="85" fontFamily="monospace" fontSize="9.5" fill={isLight ? "#475569" : "#cbd5e1"}>• PostgreSQL Shards + Raft</text>
                      <text x="745" y="102" fontFamily="monospace" fontSize="8.5" fontWeight="700" fill="#10b981">Multi-Region Read Replicas</text>
                    </g>

                    {/* Stage 4B: Event Streaming Fabric */}
                    <g>
                      <rect x="730" y="130" width="230" height="95" rx="8" fill="url(#heroCardGrad)" stroke={isLight ? "#a855f7" : "#c084fc"} strokeWidth="1.5" />
                      <text x="745" y="152" fontFamily="sans-serif" fontSize="11" fontWeight="800" fill={isLight ? "#7e22ce" : "#c084fc"}>4B. ASYNCHRONOUS FABRIC</text>
                      <text x="745" y="175" fontFamily="monospace" fontSize="9.5" fill={isLight ? "#475569" : "#cbd5e1"}>• Apache Kafka Partitioning</text>
                      <text x="745" y="195" fontFamily="monospace" fontSize="9.5" fill={isLight ? "#475569" : "#cbd5e1"}>• Transactional Outbox (CDC)</text>
                      <text x="745" y="212" fontFamily="monospace" fontSize="8.5" fontWeight="700" fill="#a855f7">Saga Orchestrator Coordinator</text>
                    </g>
                  </svg>
                </Box>
              </Box>
            </Stack>
          </Container>
        </Box>

        {/* ========================================================= */}
        {/* VALUE PILLARS STRIP (Learn • Architect • Lead)            */}
        {/* ========================================================= */}
        <Box
          component="section"
          aria-label="Core Engineering Pillars"
          sx={{
            py: { xs: 6, sm: 8 },
            bgcolor: isLight ? "#fbfaf8" : "#0a0f1d",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              {[
                {
                  icon: <SpeedRoundedIcon sx={{ fontSize: 28, color: "#10b981" }} />,
                  title: "1. Production-First Foundations",
                  description:
                    "Requirements engineering, SLA mathematics (99.99% vs 99.999%), capacity planning, write-ahead logging, and distributed storage consistency models.",
                  link: "/free-course",
                  linkText: "Read Foundations",
                },
                {
                  icon: <AccountTreeRoundedIcon sx={{ fontSize: 28, color: "#38bdf8" }} />,
                  title: "2. Distributed Systems & Resilience",
                  description:
                    "Master Sagas, Transactional Outbox, CQRS, Event Sourcing, Circuit Breakers, Bulkheads, Envoy service meshes, and dead-letter queues.",
                  link: "/microservices",
                  linkText: "Explore Microservices",
                },
                {
                  icon: <WidgetsRoundedIcon sx={{ fontSize: 28, color: "#f59e0b" }} />,
                  title: "3. Structural GoF & UML Rigor",
                  description:
                    "All 23 classic Gang of Four patterns with UML class topology diagrams, sequence interactions, memory-safe idioms, and Java 21 production code.",
                  link: "/design-patterns",
                  linkText: "Browse GoF Patterns",
                },
              ].map((pillar, idx) => (
                <Grid size={{ xs: 12, md: 4 }} key={idx}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      p: 1.5,
                      display: "flex",
                      flexDirection: "column",
                      bgcolor: isLight ? "#ffffff" : "#0f172a",
                      borderColor: "divider",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: isLight
                          ? "0 10px 25px -5px rgba(15, 23, 42, 0.08)"
                          : "0 14px 30px -6px rgba(0, 0, 0, 0.4)",
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                      <Box sx={{ mb: 2 }}>{pillar.icon}</Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, letterSpacing: "-0.01em" }}>
                        {pillar.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6, mb: 3, flexGrow: 1 }}>
                        {pillar.description}
                      </Typography>
                      <Button
                        component={Link}
                        href={pillar.link}
                        size="small"
                        endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          alignSelf: "flex-start",
                          fontWeight: 750,
                          textTransform: "none",
                          p: 0,
                          color: "primary.main",
                        }}
                      >
                        {pillar.linkText}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* ========================================================= */}
        {/* CORE LEARNING TRACKS (Topic Explorer)                     */}
        {/* ========================================================= */}
        <Box
          component="section"
          aria-label="Core Knowledge Tracks"
          sx={{
            py: { xs: 8, sm: 12 },
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: { xs: 5, sm: 8 } }}>
              <Chip
                label="CURATED ENGINEERING TRACKS"
                size="small"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  bgcolor: isLight ? "rgba(180, 83, 9, 0.1)" : "rgba(245, 158, 11, 0.15)",
                  color: isLight ? "#92400e" : "#fbbf24",
                  mb: 1.5,
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "2rem", sm: "2.8rem" },
                  letterSpacing: "-0.03em",
                }}
              >
                Comprehensive Architectural Curricula
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", maxWidth: 680, mx: "auto", mt: 1.5 }}
              >
                Four complete, free, interactive knowledge bases designed for deep conceptual retention,
                architectural trade-off reasoning, and interview mastery.
              </Typography>
            </Box>

            <Grid container spacing={3.5}>
              {/* Track 1: System Design Handbook */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    borderRadius: 3.5,
                    p: { xs: 2, sm: 3 },
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: isLight ? "#ffffff" : "#0f172a",
                    border: "1px solid",
                    borderColor: isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.1)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "primary.main",
                      boxShadow: isLight
                        ? "0 12px 30px -8px rgba(15, 23, 42, 0.1)"
                        : "0 16px 36px -10px rgba(0, 0, 0, 0.5)",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.25,
                        borderRadius: 2,
                        bgcolor: isLight ? "rgba(180, 83, 9, 0.1)" : "rgba(245, 158, 11, 0.15)",
                        color: isLight ? "#b45309" : "#f59e0b",
                      }}
                    >
                      <MenuBookRoundedIcon sx={{ fontSize: 26 }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 850, letterSpacing: "-0.02em" }}>
                        System Design Handbook
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 650 }}>
                        13 Topics • 130 Subtopics • Interactive Two-Column Book
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.65, mb: 3 }}>
                    The complete roadmap to designing massive-scale systems: capacity planning, load balancing,
                    multi-tier caching, database sharding, consistency models, real-time message streaming, and
                    observability pipelines.
                  </Typography>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: isLight ? "#f8fafc" : "#070b14",
                      border: "1px solid",
                      borderColor: "divider",
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 750,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "text.secondary",
                        display: "block",
                        mb: 1,
                      }}
                    >
                      Core Modules Covered
                    </Typography>
                    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                      {[
                        "Core Fundamentals",
                        "Networking & DNS",
                        "Load Balancing",
                        "Caching Strategies",
                        "Databases & Sharding",
                        "Distributed Storage",
                        "Message Queues",
                        "Consistency Models",
                        "Reliability & Failover",
                        "Stream Processing",
                      ].map((tag, tIdx) => (
                        <Chip
                          key={tIdx}
                          label={tag}
                          size="small"
                          sx={{
                            fontSize: "0.74rem",
                            fontWeight: 650,
                            borderRadius: 1.5,
                            bgcolor: isLight ? "#ffffff" : "#1e293b",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>

                  <Box sx={{ mt: "auto", pt: 1 }}>
                    <Button
                      component={Link}
                      href="/free-course"
                      variant="contained"
                      fullWidth
                      endIcon={<ArrowForwardRoundedIcon />}
                      sx={{
                        py: 1.25,
                        fontWeight: 750,
                        borderRadius: 2,
                        textTransform: "none",
                        bgcolor: isLight ? "#b45309" : "#f59e0b",
                        color: isLight ? "#ffffff" : "#0f172a",
                      }}
                    >
                      Read System Design Handbook
                    </Button>
                  </Box>
                </Card>
              </Grid>

              {/* Track 2: Microservices Architecture */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    borderRadius: 3.5,
                    p: { xs: 2, sm: 3 },
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: isLight ? "#ffffff" : "#0f172a",
                    border: "1px solid",
                    borderColor: isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.1)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "secondary.main",
                      boxShadow: isLight
                        ? "0 12px 30px -8px rgba(15, 23, 42, 0.1)"
                        : "0 16px 36px -10px rgba(0, 0, 0, 0.5)",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.25,
                        borderRadius: 2,
                        bgcolor: isLight ? "rgba(2, 132, 199, 0.1)" : "rgba(56, 189, 248, 0.15)",
                        color: isLight ? "#0284c7" : "#38bdf8",
                      }}
                    >
                      <AccountTreeRoundedIcon sx={{ fontSize: 26 }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 850, letterSpacing: "-0.02em" }}>
                        Microservices Architecture
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 650 }}>
                        6 Modules • 32 Distributed Patterns • 64 Themed SVGs
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.65, mb: 3 }}>
                    Everything required to operate production microservices: Bounded Contexts, Envoy service meshes,
                    distributed sagas, transactional outbox CDC, circuit breakers, Kafka event streaming, and OpenTelemetry.
                  </Typography>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: isLight ? "#f8fafc" : "#070b14",
                      border: "1px solid",
                      borderColor: "divider",
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 750,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "text.secondary",
                        display: "block",
                        mb: 1,
                      }}
                    >
                      Key Architectural Patterns
                    </Typography>
                    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                      {[
                        "API Gateway",
                        "Backend for Frontend",
                        "Service Mesh & Envoy",
                        "Saga Orchestration",
                        "Transactional Outbox",
                        "CQRS & Event Sourcing",
                        "Circuit Breaker",
                        "Bulkhead Isolation",
                        "Kafka Idempotency",
                        "OpenTelemetry Tracing",
                      ].map((tag, tIdx) => (
                        <Chip
                          key={tIdx}
                          label={tag}
                          size="small"
                          sx={{
                            fontSize: "0.74rem",
                            fontWeight: 650,
                            borderRadius: 1.5,
                            bgcolor: isLight ? "#ffffff" : "#1e293b",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>

                  <Box sx={{ mt: "auto", pt: 1 }}>
                    <Button
                      component={Link}
                      href="/microservices"
                      variant="contained"
                      fullWidth
                      endIcon={<ArrowForwardRoundedIcon />}
                      sx={{
                        py: 1.25,
                        fontWeight: 750,
                        borderRadius: 2,
                        textTransform: "none",
                        bgcolor: isLight ? "#0284c7" : "#38bdf8",
                        color: "#ffffff",
                      }}
                    >
                      Explore Microservices Curriculum
                    </Button>
                  </Box>
                </Card>
              </Grid>

              {/* Track 3: GoF Design Patterns */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    borderRadius: 3.5,
                    p: { xs: 2, sm: 3 },
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: isLight ? "#ffffff" : "#0f172a",
                    border: "1px solid",
                    borderColor: isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.1)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "#a855f7",
                      boxShadow: isLight
                        ? "0 12px 30px -8px rgba(15, 23, 42, 0.1)"
                        : "0 16px 36px -10px rgba(0, 0, 0, 0.5)",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.25,
                        borderRadius: 2,
                        bgcolor: isLight ? "rgba(168, 85, 247, 0.1)" : "rgba(168, 85, 247, 0.15)",
                        color: isLight ? "#9333ea" : "#c084fc",
                      }}
                    >
                      <WidgetsRoundedIcon sx={{ fontSize: 26 }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 850, letterSpacing: "-0.02em" }}>
                        GoF Design Patterns
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 650 }}>
                        3 Canonical Categories • 23 Classic Patterns • 46 UML SVGs
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.65, mb: 3 }}>
                    The classic Gang of Four patterns rebuilt for modern engineering. UML class structures,
                    object relationships, interaction sequence flows, and clean, thread-safe Java 21 implementations.
                  </Typography>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: isLight ? "#f8fafc" : "#070b14",
                      border: "1px solid",
                      borderColor: "divider",
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 750,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "text.secondary",
                        display: "block",
                        mb: 1,
                      }}
                    >
                      Canonical Categories
                    </Typography>
                    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                      {[
                        "Creational: Factory Method",
                        "Creational: Builder",
                        "Creational: Singleton",
                        "Structural: Adapter",
                        "Structural: Decorator",
                        "Structural: Proxy",
                        "Behavioral: Chain of Resp.",
                        "Behavioral: Strategy",
                        "Behavioral: State",
                        "Behavioral: Observer",
                      ].map((tag, tIdx) => (
                        <Chip
                          key={tIdx}
                          label={tag}
                          size="small"
                          sx={{
                            fontSize: "0.74rem",
                            fontWeight: 650,
                            borderRadius: 1.5,
                            bgcolor: isLight ? "#ffffff" : "#1e293b",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>

                  <Box sx={{ mt: "auto", pt: 1 }}>
                    <Button
                      component={Link}
                      href="/design-patterns"
                      variant="contained"
                      fullWidth
                      endIcon={<ArrowForwardRoundedIcon />}
                      sx={{
                        py: 1.25,
                        fontWeight: 750,
                        borderRadius: 2,
                        textTransform: "none",
                        bgcolor: isLight ? "#9333ea" : "#a855f7",
                        color: "#ffffff",
                      }}
                    >
                      Browse 23 GoF Design Patterns
                    </Button>
                  </Box>
                </Card>
              </Grid>

              {/* Track 4: FAANG Problems */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    borderRadius: 3.5,
                    p: { xs: 2, sm: 3 },
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: isLight ? "#ffffff" : "#0f172a",
                    border: "1px solid",
                    borderColor: isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.1)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "#10b981",
                      boxShadow: isLight
                        ? "0 12px 30px -8px rgba(15, 23, 42, 0.1)"
                        : "0 16px 36px -10px rgba(0, 0, 0, 0.5)",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.25,
                        borderRadius: 2,
                        bgcolor: isLight ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.15)",
                        color: "#10b981",
                      }}
                    >
                      <BusinessRoundedIcon sx={{ fontSize: 26 }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 850, letterSpacing: "-0.02em" }}>
                        Company-Wise FAANG Problems
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 650 }}>
                        75+ Curated High-Frequency Architecture Prompts
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.65, mb: 3 }}>
                    Practice real system design questions asked at Google, Meta, Amazon, Netflix, Uber, and Apple.
                    Complete with difficulty tiers, requirements breakdown, and cross-links to handbook chapters.
                  </Typography>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: isLight ? "#f8fafc" : "#070b14",
                      border: "1px solid",
                      borderColor: "divider",
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 750,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "text.secondary",
                        display: "block",
                        mb: 1,
                      }}
                    >
                      Top Interview Challenges
                    </Typography>
                    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                      {[
                        "Design TinyURL (Google)",
                        "Design Twitter Timeline (Meta)",
                        "Design Distributed Lock (Amazon)",
                        "Design Netflix Video Transcoder",
                        "Design Uber Ride Matcher",
                        "Design Distributed Rate Limiter",
                        "Design WhatsApp Messaging Engine",
                      ].map((tag, tIdx) => (
                        <Chip
                          key={tIdx}
                          label={tag}
                          size="small"
                          sx={{
                            fontSize: "0.74rem",
                            fontWeight: 650,
                            borderRadius: 1.5,
                            bgcolor: isLight ? "#ffffff" : "#1e293b",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>

                  <Box sx={{ mt: "auto", pt: 1 }}>
                    <Button
                      component={Link}
                      href="/company-wise-problems"
                      variant="contained"
                      fullWidth
                      endIcon={<ArrowForwardRoundedIcon />}
                      sx={{
                        py: 1.25,
                        fontWeight: 750,
                        borderRadius: 2,
                        textTransform: "none",
                        bgcolor: "#10b981",
                        color: "#ffffff",
                      }}
                    >
                      Solve FAANG Problems
                    </Button>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* ========================================================= */}
        {/* INTERACTIVE FEATURE SHOWCASE (How We Teach Systems)       */}
        {/* ========================================================= */}
        <Box
          component="section"
          aria-label="How Gangs of Developers Works"
          sx={{
            py: { xs: 8, sm: 12 },
            bgcolor: isLight ? "#fbfaf8" : "#0a0f1d",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: { xs: 4, sm: 6 } }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "2rem", sm: "2.6rem" },
                  letterSpacing: "-0.03em",
                }}
              >
                Engineered for Retention &amp; Architectural Clarity
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", maxWidth: 640, mx: "auto", mt: 1.5 }}
              >
                Every single chapter in our handbook provides structured, non-redundant learning
                artifacts so you can reason about scale with confidence.
              </Typography>
            </Box>

            {/* Interactive Showcase Tabs */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Tabs
                value={activeFeatureTab}
                onChange={(_, v) => setActiveFeatureTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  bgcolor: isLight ? "#f1f5f9" : "#1e293b",
                  p: 0.5,
                  borderRadius: 2.5,
                  "& .MuiTabs-indicator": { display: "none" },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 2,
                    fontSize: "0.88rem",
                    minHeight: 40,
                    color: "text.secondary",
                    "&.Mui-selected": {
                      color: isLight ? "#0f172a" : "#f8fafc",
                      bgcolor: isLight ? "#ffffff" : "#0f172a",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    },
                  },
                }}
              >
                <Tab icon={<HubRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="1. Dual Architecture SVGs" />
                <Tab icon={<TerminalRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="2. ASCII Blueprint View" />
                <Tab icon={<CompareArrowsRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="3. Decision Matrix (Trade-Offs)" />
                <Tab icon={<LightbulbOutlinedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="4. Interview Pro-Tips" />
              </Tabs>
            </Box>

            {/* Feature Content Display */}
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3.5,
                p: { xs: 2.5, sm: 4 },
                bgcolor: isLight ? "#ffffff" : "#0f172a",
                borderColor: "divider",
                boxShadow: isLight
                  ? "0 10px 30px -10px rgba(15, 23, 42, 0.06)"
                  : "0 14px 40px -12px rgba(0, 0, 0, 0.5)",
              }}
            >
              {activeFeatureTab === 0 && (
                <Grid container spacing={4} sx={{ alignItems: "center" }}>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Chip label="VISUAL CLARITY" size="small" color="primary" sx={{ fontWeight: 800, mb: 1.5 }} />
                    <Typography variant="h5" sx={{ fontWeight: 850, mb: 1.5 }}>
                      Component Topology &amp; Sequence Pipeline
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2.5 }}>
                      Never struggle with text-only abstractions. Every pattern comes with two dedicated,
                      theme-aware SVG diagrams: a high-level Component Block Diagram showing service boundaries,
                      and a Deep-Dive Flow Diagram demonstrating execution steps.
                    </Typography>
                    <Stack spacing={1.5}>
                      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                        <CheckCircleOutlineRoundedIcon sx={{ color: "#10b981", fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 650 }}>
                          100% valid XML with Dark &amp; Light theme styling
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                        <CheckCircleOutlineRoundedIcon sx={{ color: "#10b981", fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 650 }}>
                          Fullscreen zoomable modal for technical deep dives
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <Box
                      component="img"
                      src="/diagrams/microservices/saga-block.svg"
                      alt="Sample Saga Architecture SVG Diagram"
                      sx={{
                        width: "100%",
                        height: "auto",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    />
                  </Grid>
                </Grid>
              )}

              {activeFeatureTab === 1 && (
                <Grid container spacing={4} sx={{ alignItems: "center" }}>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Chip label="TERMINAL COMPATIBLE" size="small" color="secondary" sx={{ fontWeight: 800, mb: 1.5 }} />
                    <Typography variant="h5" sx={{ fontWeight: 850, mb: 1.5 }}>
                      ASCII Text Blueprints for Interview Whiteboards
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2.5 }}>
                      In virtual interviews, you often type ASCII diagrams inside CoderPad or Google Docs.
                      We provide ready-to-use ASCII representations for every pattern so you can sketch
                      production topologies instantly during technical interviews.
                    </Typography>
                    <Button
                      component={Link}
                      href="/free-course"
                      size="small"
                      variant="outlined"
                      endIcon={<ArrowForwardRoundedIcon />}
                    >
                      Browse ASCII Blueprints in Handbook
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        bgcolor: "#070b14",
                        color: "#38bdf8",
                        fontFamily: "ui-monospace, monospace",
                        fontSize: "0.82rem",
                        lineHeight: 1.45,
                        overflowX: "auto",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <pre style={{ margin: 0 }}>
{`+-------------------------------------------------------------------------+
|                  TRANSACTIONAL OUTBOX ARCHITECTURAL TOPOLOGY            |
+-------------------------------------------------------------------------+
[Order Service Node]                         [Debezium CDC Engine]
+-------------------------------+            +----------------------------+
| 1. Begin SQL Transaction      |            | Polls Postgres WAL Stream  |
| 2. INSERT INTO orders (...)   |   WAL      | Reads INSERT in real-time  |
| 3. INSERT INTO outbox (...)   | ---------> | Transforms to CloudEvent   |
| 4. COMMIT ATOMIC TRANSACTION  |            +-------------+--------------+
+-------------------------------+                          |
               |                                           v
       [Single DB Engine]                       [Apache Kafka Broker]
       [Order DB + Outbox Table]             (order.events topic, partition=3)`}
                      </pre>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {activeFeatureTab === 2 && (
                <Grid container spacing={4} sx={{ alignItems: "center" }}>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Chip label="NO SILVER BULLETS" size="small" color="primary" sx={{ fontWeight: 800, mb: 1.5 }} />
                    <Typography variant="h5" sx={{ fontWeight: 850, mb: 1.5 }}>
                      Architectural Decision Matrix
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2.5 }}>
                      Great systems engineers don&apos;t memorize buzzwords; they reason rigorously about trade-offs.
                      Every chapter features a 4-column matrix evaluating competing approaches,
                      their advantages, performance bottlenecks, and exact production recommendations.
                    </Typography>
                    <Button
                      component={Link}
                      href="/microservices"
                      size="small"
                      variant="outlined"
                      endIcon={<ArrowForwardRoundedIcon />}
                    >
                      See Trade-Off Matrices
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: isLight ? "#f8fafc" : "#070b14",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: "text.primary" }}>
                        Sample: Saga Orchestration vs Choreography Matrix
                      </Typography>
                      <Stack spacing={1.5}>
                        <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: isLight ? "#ffffff" : "#1e293b", border: "1px solid", borderColor: "divider" }}>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: "primary.main" }}>
                            ORCHESTRATION (Temporal / Camunda)
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: "0.82rem", mt: 0.5 }}>
                            <strong>Pros:</strong> Centralized state machine, trivial debugging, clean compensations.
                            <br />
                            <strong>Cons:</strong> Single point of coordination; requires dedicated workflow engine.
                          </Typography>
                        </Box>
                        <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: isLight ? "#ffffff" : "#1e293b", border: "1px solid", borderColor: "divider" }}>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: "secondary.main" }}>
                            CHOREOGRAPHY (Event-Driven Kafka)
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: "0.82rem", mt: 0.5 }}>
                            <strong>Pros:</strong> Decentralized, zero coordinator bottleneck, high horizontal throughput.
                            <br />
                            <strong>Cons:</strong> Complex distributed tracing, cyclic event risks, hard to audit status.
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {activeFeatureTab === 3 && (
                <Grid container spacing={4} sx={{ alignItems: "center" }}>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Chip label="INTERVIEW WAR ROOM" size="small" color="secondary" sx={{ fontWeight: 800, mb: 1.5 }} />
                    <Typography variant="h5" sx={{ fontWeight: 850, mb: 1.5 }}>
                      System Design Interview Pro-Tips
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2.5 }}>
                      Every chapter ends with an exact verbal script and architectural framing tip
                      vetted by experienced engineers who conduct top-tier system design interview loops.
                    </Typography>
                    <Button
                      component={Link}
                      href="/company-wise-problems"
                      size="small"
                      variant="outlined"
                      endIcon={<ArrowForwardRoundedIcon />}
                    >
                      View All 75+ Interview Tips
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 2.5,
                        bgcolor: isLight ? "rgba(245, 158, 11, 0.08)" : "rgba(245, 158, 11, 0.12)",
                        border: "1px solid",
                        borderColor: isLight ? "rgba(245, 158, 11, 0.3)" : "rgba(245, 158, 11, 0.35)",
                      }}
                    >
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                        <LightbulbOutlinedIcon sx={{ color: isLight ? "#b45309" : "#fbbf24" }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isLight ? "#92400e" : "#fcd34d" }}>
                          GOD System Design Interview Pro-Tip
                        </Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ fontStyle: "italic", lineHeight: 1.7, color: "text.primary" }}>
                        &ldquo;When an interviewer asks how you prevent double-spending in payments, never jump to distributed 2PC locks. State immediately: &lsquo;I enforce idempotency keys stored in Redis with an atomic SETNX, accompanied by a database unique constraint on the idempotency_key column inside the payment service.&rsquo; That shows true production intuition.&rdquo;
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Card>
          </Container>
        </Box>

        {/* ========================================================= */}
        {/* THE PRODUCTION ENGINEERING TECH STACK                     */}
        {/* ========================================================= */}
        <Box
          component="section"
          aria-label="Supported Engineering Technologies"
          sx={{
            py: { xs: 6, sm: 8 },
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "text.secondary" }}>
                Production Technologies &amp; Protocols Covered
              </Typography>
            </Box>
            <Stack
              direction="row"
              spacing={1.5}
              useFlexGap
              sx={{ flexWrap: "wrap", justifyContent: "center" }}
            >
              {[
                "Java 21 Virtual Threads",
                "Spring Boot 3",
                "Apache Kafka",
                "PostgreSQL Sharding",
                "Redis Cluster",
                "Docker & Kubernetes",
                "Envoy Proxy",
                "Istio Service Mesh",
                "OpenTelemetry",
                "gRPC / Protobuf",
                "Debezium CDC",
                "Raft Consensus",
                "Resilience4j",
                "Prometheus & Grafana",
                "AWS & Multi-Cloud",
                "OAuth2 & JWT",
              ].map((tech, idx) => (
                <Chip
                  key={idx}
                  label={tech}
                  sx={{
                    py: 1,
                    px: 1.5,
                    fontSize: "0.85rem",
                    fontWeight: 650,
                    borderRadius: 2,
                    bgcolor: isLight ? "rgba(15, 23, 42, 0.04)" : "rgba(255, 255, 255, 0.06)",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                />
              ))}
            </Stack>
          </Container>
        </Box>

        {/* ========================================================= */}
        {/* AUTHOR SPOTLIGHT                                          */}
        {/* ========================================================= */}
        <Box
          component="section"
          aria-label="Author Profile"
          sx={{
            py: { xs: 8, sm: 10 },
            bgcolor: isLight ? "#fbfaf8" : "#0a0f1d",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Container maxWidth="md">
            <Card
              variant="outlined"
              sx={{
                borderRadius: 4,
                p: { xs: 3, sm: 5 },
                bgcolor: isLight ? "#ffffff" : "#0f172a",
                borderColor: "divider",
              }}
            >
              <Grid container spacing={3.5} sx={{ alignItems: "center" }}>
                <Grid size={{ xs: 12, sm: 4 }} sx={{ textAlign: "center" }}>
                  <Box
                    component="img"
                    src="/author.jpg"
                    alt="Dharam - Systems Architect & Engineer"
                    sx={{
                      width: 140,
                      height: 140,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid",
                      borderColor: "primary.main",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 850, mt: 1.5 }}>
                    Dharam
                  </Typography>
                  <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 750, display: "block" }}>
                    Systems Architect &amp; Engineer
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 8 }}>
                  <Typography variant="h5" sx={{ fontWeight: 850, mb: 1, letterSpacing: "-0.01em" }}>
                    Curated by Practicing Systems Architects
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2.5 }}>
                    Gangs of Developers is maintained by Dharmendra Awasthi (Dharam), a Distributed Systems Engineer &amp; Architect
                    specializing in high-throughput backend architecture, resilient event streaming, and large-scale data systems.
                    No generated spam; only tested engineering wisdom.
                  </Typography>

                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    <Button
                      component={Link}
                      href="/author"
                      variant="contained"
                      size="small"
                      endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
                      sx={{ textTransform: "none", fontWeight: 750, borderRadius: 1.5 }}
                    >
                      Read Full Bio
                    </Button>
                    <IconButton
                      component="a"
                      href="https://linkedin.com/in/dharamcodes"
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      sx={{ border: "1px solid", borderColor: "divider" }}
                    >
                      <LinkedInIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      component="a"
                      href="mailto:dharamcodes@gmail.com"
                      size="small"
                      sx={{ border: "1px solid", borderColor: "divider" }}
                    >
                      <EmailIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
            </Card>
          </Container>
        </Box>

        {/* ========================================================= */}
        {/* FINAL CALL TO ACTION                                      */}
        {/* ========================================================= */}
        <Box
          component="section"
          aria-label="Get Started Call to Action"
          sx={{
            py: { xs: 8, sm: 12 },
            textAlign: "center",
            position: "relative",
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundImage: isLight
              ? "radial-gradient(circle at 50% 50%, rgba(2, 132, 199, 0.08), transparent 70%)"
              : "radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.1), transparent 70%)",
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "2.1rem", sm: "3rem" },
                letterSpacing: "-0.03em",
                mb: 2,
              }}
            >
              Stop Memorizing Checklists.{" "}
              <Box component="span" sx={{ color: "primary.main" }}>
                Start Engineering Systems.
              </Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", maxWidth: 620, mx: "auto", mb: 4, lineHeight: 1.7 }}
            >
              Join thousands of engineers who use Gangs of Developers to master distributed architectures,
              excel in technical interviews, and design resilient high-scale systems. 100% free.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ justifyContent: "center" }}
            >
              <Button
                component={Link}
                href="/free-course"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 800,
                  fontSize: "1rem",
                  borderRadius: 2,
                  textTransform: "none",
                  bgcolor: isLight ? "#b45309" : "#f59e0b",
                  color: isLight ? "#ffffff" : "#0f172a",
                }}
              >
                Start Free System Design Course
              </Button>
              <Button
                component={Link}
                href="/microservices"
                variant="outlined"
                size="large"
                sx={{
                  px: 3.5,
                  py: 1.5,
                  fontWeight: 750,
                  fontSize: "1rem",
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Explore Microservices Curriculum
              </Button>
            </Stack>
          </Container>
        </Box>

        {/* ========================================================= */}
        {/* COMPREHENSIVE TECHNICAL FOOTER                            */}
        {/* ========================================================= */}
        <Box
          component="footer"
          sx={{
            py: { xs: 6, sm: 8 },
            bgcolor: isLight ? "#fbfaf8" : "#070b14",
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} sx={{ mb: 6 }}>
              {/* Brand info */}
              <Grid size={{ xs: 12, md: 4 }}>
                <GodLogoMark />
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 2, pr: { md: 4 }, lineHeight: 1.7 }}>
                  Gangs of Developers (GOD) is an engineering knowledge platform dedicated to deep-dive
                  distributed systems, software architecture, microservices, and technical interview preparation.
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 2 }}>
                  Built with Next.js, TypeScript &amp; Material UI.
                </Typography>
              </Grid>

              {/* Col 1: Handbooks */}
              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "text.primary", display: "block", mb: 2 }}>
                  Curricula
                </Typography>
                <Stack spacing={1.25}>
                  <Typography component={Link} href="/free-course" variant="body2" sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}>
                    System Design
                  </Typography>
                  <Typography component={Link} href="/microservices" variant="body2" sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}>
                    Microservices
                  </Typography>
                  <Typography component={Link} href="/design-patterns" variant="body2" sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}>
                    GoF Patterns
                  </Typography>
                  <Typography component={Link} href="/company-wise-problems" variant="body2" sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}>
                    FAANG Problems
                  </Typography>
                </Stack>
              </Grid>

              {/* Col 2: Top Patterns */}
              <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "text.primary", display: "block", mb: 2 }}>
                  Featured Patterns
                </Typography>
                <Stack spacing={1.25}>
                  <Typography component={Link} href="/microservices?topic=distributed-data&subtopic=saga-pattern" variant="body2" sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}>
                    Saga Distributed Pattern
                  </Typography>
                  <Typography component={Link} href="/microservices?topic=distributed-data&subtopic=transactional-outbox" variant="body2" sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}>
                    Transactional Outbox (CDC)
                  </Typography>
                  <Typography component={Link} href="/microservices?topic=distributed-resilience&subtopic=circuit-breaker" variant="body2" sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}>
                    Circuit Breaker (Resilience4j)
                  </Typography>
                  <Typography component={Link} href="/design-patterns?topic=creational-patterns&subtopic=factory-method" variant="body2" sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}>
                    Factory Method Pattern
                  </Typography>
                  <Typography component={Link} href="/design-patterns?topic=structural-patterns&subtopic=adapter" variant="body2" sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}>
                    Adapter Pattern
                  </Typography>
                </Stack>
              </Grid>

              {/* Col 3: Community & Author */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "text.primary", display: "block", mb: 2 }}>
                  Connect &amp; Author
                </Typography>
                <Stack spacing={1.25}>
                  <Typography component={Link} href="/author" variant="body2" sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}>
                    About Dharam (Author)
                  </Typography>
                  <Box
                    component="a"
                    href="https://linkedin.com/in/dharamcodes"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: "inline-flex", alignItems: "center", gap: 1, color: "text.secondary", textDecoration: "none", fontSize: "0.875rem", "&:hover": { color: "primary.main" } }}
                  >
                    <LinkedInIcon sx={{ fontSize: 18 }} /> LinkedIn Profile
                  </Box>
                  <Box
                    component="a"
                    href="mailto:dharamcodes@gmail.com"
                    sx={{ display: "inline-flex", alignItems: "center", gap: 1, color: "text.secondary", textDecoration: "none", fontSize: "0.875rem", "&:hover": { color: "primary.main" } }}
                  >
                    <EmailIcon sx={{ fontSize: 18 }} /> dharamcodes@gmail.com
                  </Box>
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 4 }} />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ justifyContent: "space-between", alignItems: "center", textAlign: "center" }}
            >
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                &copy; {new Date().getFullYear()} Gangs of Developers (GOD). All rights reserved.
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Dedicated to engineering excellence and deep architectural craft.
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
