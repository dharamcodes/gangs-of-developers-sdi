"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  ThemeProvider,
  Tooltip,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HubIcon from "@mui/icons-material/Hub";
import SpeedIcon from "@mui/icons-material/Speed";
import ArticleIcon from "@mui/icons-material/Article";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedIcon from "@mui/icons-material/Verified";
import MemoryIcon from "@mui/icons-material/Memory";
import SecurityIcon from "@mui/icons-material/Security";
import StorageIcon from "@mui/icons-material/Storage";
import SchoolIcon from "@mui/icons-material/School";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import GroupsIcon from "@mui/icons-material/Groups";
import HeaderBar from "../components/HeaderBar";
import SiteFooter from "../components/SiteFooter";
import { useHandbookTheme } from "../theme/theme";

export default function AuthorPage() {
  const { mode, theme, toggleThemeMode } = useHandbookTheme();
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fullName = "Dharmendra Awasthi";
  const preferredName = "Dharam";
  const email = "dharamcodes@gmail.com";
  const linkedinHandle = "dharamcodes";
  const linkedinUrl = "https://www.linkedin.com/in/dharamcodes/";
  const githubHandle = "dharamcodes";
  const githubUrl = "https://github.com/dharamcodes";
  const linkedinGroupUrl = "https://www.linkedin.com/groups/40968099/";
  const linkedinCompanyUrl = "https://www.linkedin.com/company/gangsofdevelopers/";
  const mediumUrl = "https://medium.com/@dharamcodes";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setSnackbarOpen(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const isLight = mode === "light";

  const milestones = [
    {
      number: "9+ Years",
      label: "Systems Engineering",
      sub: "Distributed architectures, cloud platforms & high-throughput streaming",
      accent: "#f59e0b",
    },
    {
      number: "130+",
      label: "Blueprint Chapters",
      sub: "Mathematical proofs, sequence topologies & trade-off matrices",
      accent: "#0284c7",
    },
    {
      number: "33",
      label: "Microservices Patterns",
      sub: "Zero-Trust mTLS, Saga orchestration & whiteboard sequence block diagrams",
      accent: "#10b981",
    },
    {
      number: "50K+",
      label: "Engineers Reached",
      sub: "Global software architects and systems engineering community",
      accent: "#a855f7",
    },
  ];

  const specializations = [
    {
      icon: <HubIcon sx={{ fontSize: 26, color: isLight ? "#d97706" : "#f59e0b" }} />,
      title: "Distributed Systems & Consensus Architecture",
      description:
        "Architecting highly available, fault-tolerant topologies with pragmatic consistency trade-offs (CAP/PACELC). Designing leader election, Raft/Paxos quorums, dynamic sharding, and split-brain mitigation across multi-region active-active clouds.",
      focus: ["CAP / PACELC Trade-Offs", "Raft Consensus", "Multi-Region Active-Active", "Partition Tolerance"],
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 26, color: isLight ? "#0284c7" : "#38bdf8" }} />,
      title: "High-Throughput Event Streaming & Kafka",
      description:
        "Engineering enterprise messaging backbones with Apache Kafka. Guaranteeing strict partition ordering semantics, backpressure mitigation, consumer group rebalancing, exactly-once processing (EOS), and zero-copy Linux sendfile optimizations.",
      focus: ["Apache Kafka", "Exactly-Once Semantics (EOS)", "Consumer Group Topology", "Zero-Copy Streaming"],
    },
    {
      icon: <MemoryIcon sx={{ fontSize: 26, color: isLight ? "#059669" : "#10b981" }} />,
      title: "JVM Internals & Low-Latency Concurrency",
      description:
        "Fine-tuning Java runtime performance for mission-critical enterprise systems. Specialized in Garbage Collection ergonomics (ZGC, Generational ZGC, G1), Project Loom Virtual Threads, lock-free data structures, and memory-barrier profiling.",
      focus: ["Java 21 LTS", "ZGC & G1GC Ergonomics", "Project Loom Virtual Threads", "Lock-Free Concurrency"],
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 26, color: isLight ? "#7c3aed" : "#a855f7" }} />,
      title: "Microservices Mesh & Zero-Trust Security",
      description:
        "Implementing perimeterless Zero-Trust architectures using Envoy sidecars and SPIFFE/SPIRE workload attestation. Architecting OAuth 2.0 PKCE, RFC 8693 On-Behalf-Of token exchanges, and sub-millisecond stateless JWKS verification.",
      focus: ["Mutual TLS (mTLS)", "SPIFFE / SPIRE", "OAuth 2.0 & PKCE", "RFC 8693 Token Exchange"],
    },
    {
      icon: <StorageIcon sx={{ fontSize: 26, color: isLight ? "#dc2626" : "#f87171" }} />,
      title: "Storage Engine Internals & Data Modeling",
      description:
        "Designing polyglot persistence tiers balancing LSM-Trees (Cassandra/RocksDB) write amplification against B+ Trees (PostgreSQL/MySQL) read latencies. Implementing CQRS, Event Sourcing, and Change Data Capture (Debezium/Kafka Connect).",
      focus: ["LSM-Trees vs B+ Trees", "CQRS & Event Sourcing", "CDC (Debezium)", "Multi-Tier Caching"],
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 26, color: isLight ? "#db2777" : "#f472b6" }} />,
      title: "System Design Mentorship & Literature",
      description:
        "Authoring the 130-chapter Gangs of Developers Handbook. Deconstructing Tier-1 architectural interview problems (Google, Meta, Netflix, Uber, Stripe) into clear, production-grade blueprints and actionable decision frameworks.",
      focus: ["Architectural Blueprints", "FAANG System Design", "Engineering Mentorship", "Technical Literature"],
    },
  ];

  const doctrines = [
    {
      number: "01",
      title: "Production Reality Over Textbook Dogma",
      body: "Textbook advice naively suggests: 'Just put a cache in front of your database and a queue between services.' In reality, that is where catastrophic outages originate: cache stampedes, retry storms, thundering herds, and network split-brains. We engineer for real failure modes.",
      highlight: "Bulkhead isolation, jittered backoff, and circuit breaking are non-negotiable.",
    },
    {
      number: "02",
      title: "Zero-Trust & Cryptographic Verification",
      body: "Perimeter security is obsolete. Trusting traffic simply because it resides inside the private VPC is an existential risk. Every internal service hop must cryptographically attest its identity via mTLS and enforce least-privilege audience attenuation per network call.",
      highlight: "Never trust network location; verify cryptographic identity at every hop.",
    },
    {
      number: "03",
      title: "Mechanical Sympathy & Latency Budgets",
      body: "Software architecture cannot be decoupled from runtime physics. Sub-millisecond P99 latency requires mechanical sympathy: CPU cache line alignment, zero-copy kernel socket transfers, bounded thread pools, and zero-allocation serialization in hot paths.",
      highlight: "Understand runtime physics: garbage collection pauses and CPU cache locality.",
    },
  ];

  const flagshipWorks = [
    {
      title: "System Design Master Handbook",
      badge: "13 Modules • 130 Chapters",
      description:
        "The comprehensive curriculum covering distributed systems fundamentals, storage engines, caching hierarchies, messaging, consensus, and 15+ FAANG architectural blueprints.",
      link: "/system-design",
      color: "#f59e0b",
    },
    {
      title: "Microservices Architecture Handbook",
      badge: "6 Modules • 33 Patterns",
      description:
        "Production microservices handbook: Saga orchestration, Transactional Outbox, Zero-Trust mTLS, and all OAuth 2.0 flows rendered as whiteboard sequence diagrams.",
      link: "/microservices-design-patterns",
      color: "#0284c7",
    },
    {
      title: "GoF Design Patterns & UML Diagrams",
      badge: "23 Classic Patterns • Java 21",
      description:
        "Interactive reference for all 23 Gang of Four patterns implemented in modern Java 21 with virtual threads, immutable records, and formal UML class diagrams.",
      link: "/design-patterns",
      color: "#10b981",
    },
    {
      title: "Company-Wise Real-World Blueprints",
      badge: "Tier-1 Interview Architectures",
      description:
        "Curated real-world system design interview architectures asked at Google, Amazon, Meta, Netflix, Uber, and Stripe with full quantitative capacity planning.",
      link: "/company-wise-problems",
      color: "#a855f7",
    },
  ];

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
          currentNav="author"
          onToggleThemeMode={toggleThemeMode}
        />

        {/* Ambient Top Glow Effect */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 1200,
            height: 480,
            background: isLight
              ? "radial-gradient(ellipse at 50% 0%, rgba(245, 158, 11, 0.12) 0%, rgba(2, 132, 199, 0.06) 50%, transparent 75%)"
              : "radial-gradient(ellipse at 50% 0%, rgba(245, 158, 11, 0.16) 0%, rgba(56, 189, 248, 0.08) 50%, transparent 75%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 7 }, flex: 1, position: "relative", zIndex: 1 }}>
          
          {/* ========================================================================= */}
          {/* 1. EXECUTIVE HERO PROFILE CARD                                           */}
          {/* ========================================================================= */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: { xs: 3.5, md: 4.5 },
              bgcolor: isLight ? "rgba(255, 255, 255, 0.88)" : "rgba(15, 23, 42, 0.88)",
              backdropFilter: "blur(16px)",
              borderColor: isLight ? "rgba(226, 232, 240, 0.9)" : "rgba(51, 65, 85, 0.75)",
              boxShadow: isLight
                ? "0 12px 36px -4px rgba(15, 23, 42, 0.06), 0 4px 12px rgba(0, 0, 0, 0.02)"
                : "0 16px 44px -8px rgba(0, 0, 0, 0.45), 0 0 24px rgba(245, 158, 11, 0.1)",
              mb: 5,
            }}
          >
            <Grid container spacing={{ xs: 3.5, md: 5 }} sx={{ alignItems: "flex-start" }}>
              
              {/* Profile Photo & Connect Column */}
              <Grid
                size={{ xs: 12, md: 4 }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {/* Avatar with Dual-Color Gradient Ring & Active Pulse Indicator */}
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Box
                    sx={{
                      p: "4px",
                      borderRadius: "50%",
                      background: isLight
                        ? "linear-gradient(135deg, #f59e0b 0%, #0284c7 100%)"
                        : "linear-gradient(135deg, #fbbf24 0%, #38bdf8 100%)",
                      boxShadow: isLight
                        ? "0 12px 28px rgba(245, 158, 11, 0.22)"
                        : "0 14px 36px rgba(0, 0, 0, 0.5), 0 0 24px rgba(245, 158, 11, 0.25)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.025)",
                        boxShadow: isLight
                          ? "0 16px 36px rgba(245, 158, 11, 0.3)"
                          : "0 18px 44px rgba(245, 158, 11, 0.35)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: { xs: 185, sm: 210, md: 225 },
                        height: { xs: 185, sm: 210, md: 225 },
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "3.5px solid",
                        borderColor: isLight ? "#ffffff" : "#0f172a",
                        bgcolor: isLight ? "#f1f5f9" : "#1e293b",
                      }}
                    >
                      <Image
                        src="/author.jpg"
                        alt={`${fullName} (${preferredName}) - Author & Systems Architect`}
                        fill
                        priority
                        sizes="(max-width: 600px) 185px, (max-width: 900px) 210px, 225px"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center 16%",
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Active Status Badge */}
                  <Chip
                    icon={
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "#10b981",
                          boxShadow: "0 0 8px #10b981",
                        }}
                      />
                    }
                    label="Staff Engineer"
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: -10,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontWeight: 750,
                      fontSize: "0.74rem",
                      bgcolor: isLight ? "#ffffff" : "#0f172a",
                      color: isLight ? "#0f172a" : "#f8fafc",
                      border: "1.5px solid",
                      borderColor: "#10b981",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                      px: 0.5,
                    }}
                  />
                </Box>

                {/* Location & Experience Meta */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    mt: 3,
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: 0.8,
                  }}
                >
                  <Chip
                    icon={<LocationOnIcon sx={{ fontSize: "14px !important" }} />}
                    label="Bengaluru, India"
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.78rem",
                      bgcolor: isLight ? "rgba(15, 23, 42, 0.05)" : "rgba(255, 255, 255, 0.08)",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  />
                  <Chip
                    label="9+ Yrs Experience"
                    size="small"
                    sx={{
                      fontWeight: 750,
                      fontSize: "0.78rem",
                      bgcolor: isLight ? "rgba(2, 132, 199, 0.1)" : "rgba(56, 189, 248, 0.15)",
                      color: isLight ? "#0284c7" : "#38bdf8",
                      border: "1px solid",
                      borderColor: isLight ? "rgba(2, 132, 199, 0.3)" : "rgba(56, 189, 248, 0.3)",
                    }}
                  />
                </Stack>

                {/* Executive Social & Connection Actions */}
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: { xs: 290, md: "100%" },
                    mt: 3,
                    pt: 2.5,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "text.secondary",
                      display: "block",
                      mb: 1.5,
                    }}
                  >
                    Direct Connect
                  </Typography>

                  <Stack spacing={1.25} sx={{ width: "100%" }}>
                    {/* LinkedIn Button */}
                    <Button
                      component="a"
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      fullWidth
                      startIcon={<LinkedInIcon sx={{ color: "#ffffff" }} />}
                      endIcon={<OpenInNewIcon sx={{ fontSize: 13, opacity: 0.85 }} />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 750,
                        fontSize: "0.88rem",
                        borderRadius: 2.25,
                        py: 1,
                        bgcolor: "#0077b5",
                        justifyContent: "space-between",
                        "&:hover": { bgcolor: "#005e93" },
                      }}
                    >
                      LinkedIn / {linkedinHandle}
                    </Button>

                    {/* Medium Publication Button */}
                    <Button
                      component="a"
                      href={mediumUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      fullWidth
                      startIcon={<ArticleIcon sx={{ color: isLight ? "#b45309" : "#f59e0b" }} />}
                      endIcon={<OpenInNewIcon sx={{ fontSize: 13, opacity: 0.85 }} />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        borderRadius: 2.25,
                        py: 1,
                        borderColor: "divider",
                        justifyContent: "space-between",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: isLight ? "rgba(245, 158, 11, 0.06)" : "rgba(245, 158, 11, 0.12)",
                        },
                      }}
                    >
                      Medium / @{linkedinHandle}
                    </Button>

                    {/* GitHub Profile Button */}
                    <Button
                      component="a"
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      fullWidth
                      startIcon={<GitHubIcon />}
                      endIcon={<OpenInNewIcon sx={{ fontSize: 13, opacity: 0.85 }} />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        borderRadius: 2.25,
                        py: 1,
                        borderColor: "divider",
                        justifyContent: "space-between",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: isLight ? "rgba(245, 158, 11, 0.06)" : "rgba(245, 158, 11, 0.12)",
                        },
                      }}
                    >
                      GitHub / {githubHandle}
                    </Button>

                    {/* 1-Click Copy Email Action */}
                    <Box sx={{ display: "flex", gap: 0.75, width: "100%" }}>
                      <Button
                        component="a"
                        href={`mailto:${email}`}
                        variant="outlined"
                        startIcon={<EmailIcon />}
                        sx={{
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: "0.82rem",
                          borderRadius: 2.25,
                          flex: 1,
                          py: 1,
                          borderColor: "divider",
                          justifyContent: "flex-start",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {email}
                      </Button>
                      <Tooltip title={copied ? "Copied!" : "Copy email address"}>
                        <IconButton
                          onClick={handleCopyEmail}
                          sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2.25,
                            p: 1.1,
                            bgcolor: copied
                              ? "success.light"
                              : isLight
                              ? "#ffffff"
                              : "rgba(30, 41, 59, 0.8)",
                          }}
                        >
                          {copied ? (
                            <CheckIcon sx={{ fontSize: 18, color: "success.main" }} />
                          ) : (
                            <ContentCopyIcon sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Stack>
                </Box>
              </Grid>

              {/* Bio & Information Column */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={2.5} sx={{ textAlign: { xs: "center", md: "left" } }}>
                  
                  {/* Verified Header & Name */}
                  <Box>
                    <Stack
                      direction="row"
                      spacing={1.25}
                      sx={{
                        alignItems: "center",
                        justifyContent: { xs: "center", md: "flex-start" },
                        mb: 0.75,
                      }}
                    >
                      <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                          fontWeight: 900,
                          fontSize: { xs: "2.1rem", sm: "2.6rem", md: "2.85rem" },
                          letterSpacing: "-0.025em",
                          lineHeight: 1.15,
                        }}
                      >
                        {fullName}
                      </Typography>
                      <Tooltip title="Verified Technical Author & Systems Architect">
                        <VerifiedIcon sx={{ color: "#0284c7", fontSize: { xs: 26, sm: 30 } }} />
                      </Tooltip>
                    </Stack>

                    {/* Executive Title & Role */}
                    <Typography
                      variant="h6"
                      component="p"
                      sx={{
                        fontWeight: 800,
                        color: isLight ? "#b45309" : "#f59e0b",
                        fontSize: { xs: "1.08rem", sm: "1.22rem" },
                        lineHeight: 1.4,
                        mb: 0.5,
                      }}
                    >
                      Engineer &amp; Technical Author
                    </Typography>

                    <Typography
                      variant="subtitle1"
                      component="p"
                      sx={{
                        fontWeight: 700,
                        color: "text.secondary",
                        fontSize: { xs: "0.94rem", sm: "1.02rem" },
                        mb: 2,
                      }}
                    >
                      Creator &amp; Chief Editor, Gangs of Developers (GOD) Knowledge Platform
                    </Typography>

                    {/* Technology Specialization Tag Strip */}
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        flexWrap: "wrap",
                        gap: 0.9,
                        justifyContent: { xs: "center", md: "flex-start" },
                        mb: 3,
                      }}
                    >
                      {["Distributed Systems", "Apache Kafka", "Java 21 LTS & Spring Boot", "Microservices", "System Design Literature", "Security"].map((tag, tIdx) => (
                        <Chip
                          key={tIdx}
                          label={tag}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            bgcolor: isLight ? "rgba(15, 23, 42, 0.05)" : "rgba(255, 255, 255, 0.08)",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                      ))}
                    </Stack>

                    {/* Bio Paragraphs */}
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.primary",
                        lineHeight: 1.8,
                        fontSize: { xs: "0.98rem", sm: "1.05rem" },
                        mb: 2,
                      }}
                    >
                      Distributed systems practitioner with <strong>9+ years of production experience</strong> architecting,
                      building, and scaling mission-critical cloud platforms, event-driven streaming backbones, and
                      cloud-native microservices. Deeply specialized in the <strong>Java runtime ecosystem</strong> (JVM
                      performance ergonomics, ZGC &amp; G1 garbage collection optimization, Project Loom virtual threads,
                      and lock-free concurrency) and <strong>Apache Kafka at enterprise scale</strong>.
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.8,
                        fontSize: { xs: "0.96rem", sm: "1.02rem" },
                        mb: 3,
                      }}
                    >
                      Founded <strong>Gangs of Developers (GOD)</strong> to bridge the chasm between shallow, hand-waving
                      interview guides and the unvarnished realities of production engineering. Creator of the 130-chapter
                      System Design Handbook, 33-pattern Microservices catalog, and classic GoF architecture reference.
                      Active contributor to technical literature on{" "}
                      <Link
                        href={mediumUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: isLight ? "#b45309" : "#f59e0b",
                          fontWeight: 750,
                          textDecoration: "underline",
                        }}
                      >
                        Medium (@dharamcodes)
                      </Link>
                      , <strong>Stackademic</strong>, and <strong>wiredcoder.pub</strong>.
                    </Typography>

                    {/* Quick Handbook Direct Links */}
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.5}
                      sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
                    >
                      <Button
                        component={Link}
                        href="/system-design"
                        variant="contained"
                        color="primary"
                        startIcon={<MenuBookIcon />}
                        endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          textTransform: "none",
                          fontWeight: 750,
                          borderRadius: 2.25,
                          py: 1.1,
                          px: 2.75,
                        }}
                      >
                        Explore System Design Handbook
                      </Button>
                      <Button
                        component={Link}
                        href="/microservices-design-patterns"
                        variant="outlined"
                        color="secondary"
                        startIcon={<HubIcon />}
                        endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          textTransform: "none",
                          fontWeight: 750,
                          borderRadius: 2.25,
                          py: 1.1,
                          px: 2.75,
                        }}
                      >
                        Microservices Catalog
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* ========================================================================= */}
          {/* 2. QUANTIFIED IMPACT & ARCHITECTURAL METRICS                             */}
          {/* ========================================================================= */}
          <Grid container spacing={2.5} sx={{ mb: 6 }}>
            {milestones.map((item, idx) => (
              <Grid key={idx} size={{ xs: 6, md: 3 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: 3.5,
                    textAlign: "center",
                    bgcolor: isLight ? "rgba(255, 255, 255, 0.85)" : "rgba(15, 23, 42, 0.7)",
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: item.accent,
                      boxShadow: `0 12px 28px -4px ${item.accent}33`,
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      color: item.accent,
                      fontSize: { xs: "1.9rem", sm: "2.35rem" },
                      lineHeight: 1.1,
                      mb: 0.75,
                    }}
                  >
                    {item.number}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 800, color: "text.primary", mb: 0.5, fontSize: "0.95rem" }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", display: "block", lineHeight: 1.5, fontSize: "0.78rem" }}
                  >
                    {item.sub}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* ========================================================================= */}
          {/* 3. AREAS OF SPECIALIZATION (BENTO GRID)                                  */}
          {/* ========================================================================= */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 3, sm: 4.5, md: 5 },
              borderRadius: { xs: 3.5, md: 4.5 },
              bgcolor: isLight ? "rgba(255, 255, 255, 0.85)" : "rgba(15, 23, 42, 0.8)",
              mb: 6,
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.75 }}>
              <WorkspacePremiumIcon sx={{ color: isLight ? "#b45309" : "#f59e0b", fontSize: 20 }} />
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 850,
                  letterSpacing: "0.08em",
                  color: isLight ? "#b45309" : "#f59e0b",
                }}
              >
                Core Competencies &amp; Technical Depth
              </Typography>
            </Stack>

            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 850,
                fontSize: { xs: "1.55rem", sm: "1.95rem" },
                mb: 1,
              }}
            >
              Areas of Architectural Specialization
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: 780,
                lineHeight: 1.7,
                mb: 4,
                fontSize: "1.02rem",
              }}
            >
              Disciplines refined across nearly a decade of building, testing, tuning, and operating
              large-scale distributed backend platforms in production environments.
            </Typography>

            <Grid container spacing={3}>
              {specializations.map((spec, idx) => (
                <Grid key={idx} size={{ xs: 12, md: 6 }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3.25,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      borderRadius: 3.5,
                      bgcolor: isLight ? "rgba(248, 250, 252, 0.9)" : "rgba(30, 41, 59, 0.45)",
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                      "&:hover": {
                        borderColor: isLight ? "#b45309" : "#f59e0b",
                        transform: "translateY(-3px)",
                        boxShadow: isLight
                          ? "0 10px 28px rgba(15, 23, 42, 0.08)"
                          : "0 10px 28px rgba(0, 0, 0, 0.35)",
                      },
                    }}
                  >
                    <Box>
                      <Stack direction="row" spacing={1.75} sx={{ alignItems: "center", mb: 2 }}>
                        <Box
                          sx={{
                            p: 1.1,
                            borderRadius: 2.25,
                            bgcolor: isLight ? "rgba(15, 23, 42, 0.04)" : "rgba(255, 255, 255, 0.06)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {spec.icon}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 800, fontSize: "1.1rem", color: "text.primary" }}
                        >
                          {spec.title}
                        </Typography>
                      </Stack>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          lineHeight: 1.75,
                          fontSize: "0.93rem",
                          mb: 3,
                        }}
                      >
                        {spec.description}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={0.8} sx={{ flexWrap: "wrap", gap: 0.8 }}>
                      {spec.focus.map((item, fIdx) => (
                        <Chip
                          key={fIdx}
                          label={item}
                          size="small"
                          sx={{
                            fontSize: "0.76rem",
                            height: 25,
                            fontWeight: 650,
                            borderRadius: 1.75,
                            bgcolor: isLight ? "#ffffff" : "rgba(15, 23, 42, 0.8)",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                      ))}
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* ========================================================================= */}
          {/* 4. THE ENGINEERING DOCTRINE (3 ARCHITECTURAL PILLARS)                    */}
          {/* ========================================================================= */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 3, sm: 4.5, md: 5 },
              borderRadius: { xs: 3.5, md: 4.5 },
              bgcolor: isLight ? "rgba(255, 255, 255, 0.85)" : "rgba(15, 23, 42, 0.8)",
              mb: 6,
            }}
          >
            <Typography
              variant="overline"
              sx={{
                fontWeight: 850,
                letterSpacing: "0.08em",
                color: isLight ? "#b45309" : "#f59e0b",
                display: "block",
                mb: 0.75,
              }}
            >
              The Architectural Philosophy
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 850,
                fontSize: { xs: "1.55rem", sm: "1.95rem" },
                mb: 1.25,
              }}
            >
              The Gangs of Developers Engineering Doctrine
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: 780,
                lineHeight: 1.7,
                mb: 4,
                fontSize: "1.02rem",
              }}
            >
              Three non-negotiable architectural tenets that underpin every system design blueprint,
              microservice implementation, and technical publication on this platform.
            </Typography>

            <Grid container spacing={3}>
              {doctrines.map((doc, dIdx) => (
                <Grid key={dIdx} size={{ xs: 12, md: 4 }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3.5,
                      height: "100%",
                      borderRadius: 3.5,
                      bgcolor: isLight ? "rgba(248, 250, 252, 0.9)" : "rgba(30, 41, 59, 0.4)",
                      border: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 900,
                          color: isLight ? "rgba(180, 83, 9, 0.2)" : "rgba(245, 158, 11, 0.25)",
                          fontSize: "2rem",
                          lineHeight: 1,
                          mb: 1.5,
                        }}
                      >
                        {doc.number}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 800, fontSize: "1.1rem", mb: 1.5, color: "text.primary" }}
                      >
                        {doc.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", lineHeight: 1.75, fontSize: "0.93rem", mb: 2.5 }}
                      >
                        {doc.body}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: isLight ? "rgba(245, 158, 11, 0.08)" : "rgba(245, 158, 11, 0.12)",
                        borderLeft: "3px solid",
                        borderColor: isLight ? "#b45309" : "#f59e0b",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 750,
                          color: isLight ? "#92400e" : "#fbbf24",
                          lineHeight: 1.5,
                          display: "block",
                        }}
                      >
                        {doc.highlight}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* ========================================================================= */}
          {/* 5. FLAGSHIP HANDBOOKS & CURRICULA ON GOD                                */}
          {/* ========================================================================= */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 3, sm: 4.5, md: 5 },
              borderRadius: { xs: 3.5, md: 4.5 },
              bgcolor: isLight ? "rgba(255, 255, 255, 0.85)" : "rgba(15, 23, 42, 0.8)",
              mb: 6,
            }}
          >
            <Typography
              variant="overline"
              sx={{
                fontWeight: 850,
                letterSpacing: "0.08em",
                color: isLight ? "#b45309" : "#f59e0b",
                display: "block",
                mb: 0.75,
              }}
            >
              Authored Curricula &amp; Reference Blueprints
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 850,
                fontSize: { xs: "1.55rem", sm: "1.95rem" },
                mb: 1.25,
              }}
            >
              Flagship Handbooks on Gangs of Developers
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: 780,
                lineHeight: 1.7,
                mb: 4,
                fontSize: "1.02rem",
              }}
            >
              Comprehensive, interactive engineering handbooks authored to give practitioners
              exhaustive architectural blueprints, clear trade-offs, and production-tested patterns.
            </Typography>

            <Grid container spacing={3}>
              {flagshipWorks.map((work, wIdx) => (
                <Grid key={wIdx} size={{ xs: 12, sm: 6 }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3.25,
                      borderRadius: 3.5,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      bgcolor: isLight ? "rgba(248, 250, 252, 0.9)" : "rgba(30, 41, 59, 0.45)",
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        borderColor: work.color,
                        boxShadow: `0 10px 24px -4px ${work.color}33`,
                      },
                    }}
                  >
                    <Box>
                      <Chip
                        label={work.badge}
                        size="small"
                        sx={{
                          fontWeight: 750,
                          fontSize: "0.76rem",
                          bgcolor: `${work.color}1a`,
                          color: work.color,
                          border: `1px solid ${work.color}40`,
                          mb: 1.5,
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 850, fontSize: "1.15rem", mb: 1, color: "text.primary" }}
                      >
                        {work.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", lineHeight: 1.75, fontSize: "0.93rem", mb: 2.5 }}
                      >
                        {work.description}
                      </Typography>
                    </Box>

                    <Button
                      component={Link}
                      href={work.link}
                      variant="text"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 750,
                        color: work.color,
                        px: 0,
                        justifyContent: "flex-start",
                        "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                      }}
                    >
                      Read Handbook Chapters
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* ========================================================================= */}
          {/* 6. THE STORY & MISSION BEHIND GOD                                        */}
          {/* ========================================================================= */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 3, sm: 4.5, md: 5 },
              borderRadius: { xs: 3.5, md: 4.5 },
              bgcolor: isLight ? "rgba(255, 255, 255, 0.85)" : "rgba(15, 23, 42, 0.8)",
              mb: 6,
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.75 }}>
              <GroupsIcon sx={{ color: isLight ? "#b45309" : "#f59e0b", fontSize: 22 }} />
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 850,
                  letterSpacing: "0.08em",
                  color: isLight ? "#b45309" : "#f59e0b",
                }}
              >
                The Story &amp; Community
              </Typography>
            </Stack>

            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 850,
                fontSize: { xs: "1.55rem", sm: "1.95rem" },
                mb: 2.5,
              }}
            >
              Why Gangs of Developers Was Created
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "text.primary",
                lineHeight: 1.85,
                fontSize: "1.04rem",
                mb: 2.25,
              }}
            >
              For years, preparing for System Design interviews or scaling mission-critical production
              infrastructure felt like navigating an unforgiving desert of buzzwords. Most resources offer
              superficial hand-waving: <em>“Just add a Redis cache in front of PostgreSQL, put a Kafka topic
              between microservices, and you are done.”</em>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.85,
                fontSize: "1.02rem",
                mb: 2.25,
              }}
            >
              In real production systems, that is precisely where catastrophic outages begin: <strong>Cache
              Stampedes</strong> knocking out primary database replicas, <strong>Outage Retry Storms</strong> quadrupling
              ingress traffic during degradations, <strong>Split-Brain network partitions</strong> causing silent ledger
              corruptions, and <strong>LSM write amplification</strong> stalling NVMe SSD I/O.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.85,
                fontSize: "1.02rem",
                mb: 3,
              }}
            >
              <strong>Gangs of Developers (GOD)</strong> was conceived to replace shallow bullet points with deep
              architectural reality. Every chapter provides mathematical proofs, clean whiteboard SVG architectural
              blueprints, trade-off comparisons across conflicting approaches, and battle-tested technical interview guidance.
            </Typography>

            {/* LinkedIn Community Buttons */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
            >
              <Button
                component="a"
                href={linkedinGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                startIcon={<LinkedInIcon sx={{ color: "#0077b5" }} />}
                endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                sx={{
                  textTransform: "none",
                  fontWeight: 750,
                  borderRadius: 2.25,
                  px: 2.75,
                  py: 1.1,
                  borderColor: isLight ? "rgba(0, 119, 181, 0.4)" : "rgba(56, 189, 248, 0.4)",
                  "&:hover": {
                    borderColor: "#0077b5",
                    bgcolor: "rgba(0, 119, 181, 0.08)",
                  },
                }}
              >
                Join LinkedIn Community Group
              </Button>

              <Button
                component="a"
                href={linkedinCompanyUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                startIcon={<LinkedInIcon sx={{ color: "#0077b5" }} />}
                endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                sx={{
                  textTransform: "none",
                  fontWeight: 750,
                  borderRadius: 2.25,
                  px: 2.75,
                  py: 1.1,
                  borderColor: isLight ? "rgba(0, 119, 181, 0.4)" : "rgba(56, 189, 248, 0.4)",
                  "&:hover": {
                    borderColor: "#0077b5",
                    bgcolor: "rgba(0, 119, 181, 0.08)",
                  },
                }}
              >
                Follow LinkedIn Company Page
              </Button>
            </Stack>
          </Paper>

          {/* ========================================================================= */}
          {/* 7. GET IN TOUCH & COLLABORATE EXECUTIVE CARD                             */}
          {/* ========================================================================= */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 3.5, sm: 5, md: 5.5 },
              borderRadius: { xs: 3.5, md: 4.5 },
              textAlign: "center",
              bgcolor: isLight ? "rgba(248, 250, 252, 0.95)" : "rgba(30, 41, 59, 0.55)",
              border: "2px dashed",
              borderColor: isLight ? "rgba(180, 83, 9, 0.35)" : "rgba(245, 158, 11, 0.4)",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 850,
                fontSize: { xs: "1.5rem", sm: "1.95rem" },
                mb: 1.5,
              }}
            >
              Let’s Connect &amp; Collaborate
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: 680,
                mx: "auto",
                mb: 3.5,
                lineHeight: 1.75,
                fontSize: "1.02rem",
              }}
            >
              Whether you want to discuss distributed consensus trade-offs, JVM and Kafka performance
              tuning, invite me to technical speaking sessions, or collaborate on architectural blueprints
              for the handbook, feel free to reach out directly.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 1.5 }}
            >
              <Button
                component="a"
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                size="large"
                startIcon={<LinkedInIcon sx={{ color: "#ffffff" }} />}
                sx={{
                  textTransform: "none",
                  fontWeight: 750,
                  px: 3.25,
                  py: 1.3,
                  borderRadius: 2.25,
                  bgcolor: "#0077b5",
                  "&:hover": { bgcolor: "#005e93" },
                }}
              >
                Connect on LinkedIn
              </Button>

              <Button
                component="a"
                href={mediumUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="large"
                startIcon={<ArticleIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 750,
                  px: 3.25,
                  py: 1.3,
                  borderRadius: 2.25,
                  borderColor: "divider",
                }}
              >
                Read on Medium
              </Button>

              <Button
                component="a"
                href={`mailto:${email}`}
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<EmailIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 750,
                  px: 3.25,
                  py: 1.3,
                  borderRadius: 2.25,
                }}
              >
                Send Direct Email
              </Button>

              <Button
                component="a"
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="large"
                startIcon={<GitHubIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 750,
                  px: 3.25,
                  py: 1.3,
                  borderRadius: 2.25,
                }}
              >
                GitHub ({githubHandle})
              </Button>
            </Stack>
          </Paper>
        </Container>

        {/* ========================================================================= */}
        {/* 8. COMPLETE SITE FOOTER                                                   */}
        {/* ========================================================================= */}
        <SiteFooter />

        {/* Copy Notification Toast */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2500}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%", fontWeight: 750, borderRadius: 2 }}
          >
            Email address copied to clipboard: {email}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
