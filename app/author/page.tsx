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
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CodeIcon from "@mui/icons-material/Code";
import HubIcon from "@mui/icons-material/Hub";
import SpeedIcon from "@mui/icons-material/Speed";
import ArticleIcon from "@mui/icons-material/Article";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedIcon from "@mui/icons-material/Verified";
import HeaderBar from "../components/HeaderBar";
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

  const milestones = [
    {
      number: "9+ Years",
      label: "Engineering Experience",
      sub: "Distributed systems & cloud microservices",
    },
    {
      number: "130+",
      label: "Handbook Chapters",
      sub: "Production blueprints & trade-off matrices",
    },
    {
      number: "13",
      label: "Core Modules",
      sub: "Foundational to expert-level architecture",
    },
    {
      number: "15+",
      label: "Tier-1 Blueprints",
      sub: "Meta, Google, Uber, Netflix, Stripe & more",
    },
  ];

  const specializations = [
    {
      icon: <HubIcon sx={{ fontSize: 24, color: "#f59e0b" }} />,
      title: "Distributed Systems & Architecture",
      description:
        "Designing highly available, fault-tolerant microservices with clear domain boundaries, partition tolerance, and pragmatic consistency trade-offs (CAP/PACELC).",
      focus: ["Distributed Systems", "Fault Tolerance", "Consistency Models"],
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 24, color: "#38bdf8" }} />,
      title: "Event-Driven & Streaming Backbones",
      description:
        "Architecting high-throughput messaging infrastructures with Apache Kafka, guaranteeing ordering semantics, backpressure mitigation, and reliable async workflows.",
      focus: ["Event Streaming (Kafka)", "Decoupled Systems", "High-Throughput Pipelines"],
    },
    {
      icon: <CodeIcon sx={{ fontSize: 24, color: "#10b981" }} />,
      title: "High-Concurrency Runtime Performance",
      description:
        "Engineering low-latency backend services, fine-tuning JVM internals and garbage collection, and optimizing threading models for mission-critical enterprise workloads.",
      focus: ["JVM Optimization", "Concurrency Models", "Low-Latency Execution"],
    },
    {
      icon: <ArticleIcon sx={{ fontSize: 24, color: "#ec4899" }} />,
      title: "System Design Mentorship & Literature",
      description:
        "Deconstructing complex distributed architectures into clear, production-grade blueprints through the GOD Handbook, technical publications on Medium, and advanced system design interview frameworks.",
      focus: ["Architectural Blueprints", "Systems Mentorship", "Technical Publications"],
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

        <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 }, flex: 1 }}>
          {/* Hero Profile Card */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: { xs: 3, md: 4 },
              bgcolor:
                mode === "light"
                  ? "rgba(255, 255, 255, 0.9)"
                  : "rgba(15, 23, 42, 0.85)",
              backdropFilter: "blur(12px)",
              borderColor:
                mode === "light"
                  ? "rgba(226, 232, 240, 0.9)"
                  : "rgba(51, 65, 85, 0.8)",
              boxShadow:
                mode === "light"
                  ? "0 10px 30px rgba(0, 0, 0, 0.04)"
                  : "0 10px 35px rgba(0, 0, 0, 0.35)",
              mb: 5,
            }}
          >
            <Grid container spacing={{ xs: 3, md: 5 }} sx={{ alignItems: "flex-start" }}>
              {/* Profile Photo & Connect Sidebar */}
              <Grid
                size={{ xs: 12, md: 4 }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { xs: "center", md: "center" },
                  justifyContent: "flex-start",
                  pt: { xs: 0, md: 0.5 },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    p: "4px",
                    borderRadius: "50%",
                    background:
                      mode === "light"
                        ? "linear-gradient(135deg, #f59e0b 0%, #0284c7 100%)"
                        : "linear-gradient(135deg, #fbbf24 0%, #38bdf8 100%)",
                    boxShadow:
                      mode === "light"
                        ? "0 12px 30px rgba(245, 158, 11, 0.18), 0 4px 12px rgba(0,0,0,0.06)"
                        : "0 14px 36px rgba(0, 0, 0, 0.45), 0 0 20px rgba(245, 158, 11, 0.2)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.025)",
                      boxShadow:
                        mode === "light"
                          ? "0 16px 36px rgba(245, 158, 11, 0.26)"
                          : "0 18px 44px rgba(245, 158, 11, 0.35)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: { xs: 175, sm: 200, md: 220 },
                      height: { xs: 175, sm: 200, md: 220 },
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "3px solid",
                      borderColor: mode === "light" ? "#ffffff" : "#0f172a",
                      bgcolor: mode === "light" ? "#f1f5f9" : "#1e293b",
                    }}
                  >
                    <Image
                      src="/author.jpg"
                      alt={`${fullName} (${preferredName}) - Author & Systems Architect`}
                      fill
                      priority
                      sizes="(max-width: 600px) 175px, (max-width: 900px) 200px, 220px"
                      style={{
                        objectFit: "cover",
                        objectPosition: "center 16%",
                      }}
                    />
                  </Box>
                </Box>

                {/* Role & Experience Badges */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 2, alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 0.75 }}
                >
                  <Chip
                    label="Author & Systems Architect"
                    size="small"
                    sx={{
                      fontWeight: 750,
                      bgcolor:
                        mode === "light"
                          ? "rgba(180, 83, 9, 0.12)"
                          : "rgba(245, 158, 11, 0.18)",
                      color: mode === "light" ? "#92400e" : "#f59e0b",
                      border: "1px solid",
                      borderColor:
                        mode === "light"
                          ? "rgba(180, 83, 9, 0.25)"
                          : "rgba(245, 158, 11, 0.35)",
                    }}
                  />
                  <Chip
                    label="9+ Yrs Experience"
                    size="small"
                    sx={{
                      fontWeight: 700,
                      bgcolor:
                        mode === "light"
                          ? "rgba(2, 132, 199, 0.1)"
                          : "rgba(56, 189, 248, 0.15)",
                      color: "secondary.main",
                      border: "1px solid",
                      borderColor: "secondary.main",
                    }}
                  />
                </Stack>

                {/* Connect with me - Optimized Sidebar Buttons */}
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: { xs: 280, sm: 300, md: "100%" },
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
                      textAlign: "center",
                      mb: 1.5,
                    }}
                  >
                    Connect with Dharam
                  </Typography>

                  <Stack spacing={1.25} sx={{ width: "100%" }}>
                    {/* LinkedIn */}
                    <Button
                      component="a"
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      fullWidth
                      startIcon={<LinkedInIcon sx={{ color: "#ffffff" }} />}
                      endIcon={<OpenInNewIcon sx={{ fontSize: 13, opacity: 0.8 }} />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 750,
                        fontSize: "0.88rem",
                        borderRadius: 2,
                        py: 0.9,
                        bgcolor: "#0077b5",
                        justifyContent: "space-between",
                        "&:hover": {
                          bgcolor: "#005e93",
                        },
                      }}
                    >
                      LinkedIn / {linkedinHandle}
                    </Button>

                    {/* Medium */}
                    <Button
                      component="a"
                      href={mediumUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      fullWidth
                      startIcon={<ArticleIcon sx={{ color: mode === "light" ? "#b45309" : "#f59e0b" }} />}
                      endIcon={<OpenInNewIcon sx={{ fontSize: 13, opacity: 0.8 }} />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        borderRadius: 2,
                        py: 0.9,
                        borderColor: "divider",
                        justifyContent: "space-between",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: "rgba(245, 158, 11, 0.08)",
                        },
                      }}
                    >
                      Medium / @{linkedinHandle}
                    </Button>

                    {/* GitHub */}
                    <Button
                      component="a"
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      fullWidth
                      startIcon={<GitHubIcon />}
                      endIcon={<OpenInNewIcon sx={{ fontSize: 13, opacity: 0.8 }} />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        borderRadius: 2,
                        py: 0.9,
                        borderColor: "divider",
                        justifyContent: "space-between",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: "rgba(245, 158, 11, 0.08)",
                        },
                      }}
                    >
                      GitHub / {githubHandle}
                    </Button>

                    {/* Email with One-Click Copy */}
                    <Box sx={{ display: "flex", gap: 0.75, width: "100%" }}>
                      <Button
                        component="a"
                        href={`mailto:${email}`}
                        variant="outlined"
                        color="primary"
                        startIcon={<EmailIcon />}
                        sx={{
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: "0.82rem",
                          borderRadius: 2,
                          flex: 1,
                          py: 0.9,
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
                            borderRadius: 2,
                            p: 1,
                            bgcolor: copied
                              ? "success.light"
                              : mode === "light"
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

              {/* Bio & Information - Professional Resume Layout */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={2} sx={{ textAlign: { xs: "center", md: "left" } }}>
                  <Box>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.5}
                      sx={{
                        alignItems: { xs: "center", md: "flex-start" },
                        mb: 0.5,
                      }}
                    >
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <Typography
                          variant="h3"
                          component="h1"
                          sx={{
                            fontWeight: 900,
                            fontSize: { xs: "1.9rem", sm: "2.35rem", md: "2.55rem" },
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {fullName}
                        </Typography>
                        <Tooltip title="Verified Author & Engineer">
                          <VerifiedIcon sx={{ color: "primary.main", fontSize: { xs: 22, sm: 26 } }} />
                        </Tooltip>
                      </Stack>
                      <Chip
                        label={`@${linkedinHandle}`}
                        size="medium"
                        sx={{
                          fontWeight: 750,
                          fontFamily: "monospace",
                          fontSize: "0.85rem",
                          bgcolor:
                            mode === "light"
                              ? "rgba(2, 132, 199, 0.1)"
                              : "rgba(56, 189, 248, 0.15)",
                          color: "secondary.main",
                          border: "1px solid",
                          borderColor: "secondary.main",
                          alignSelf: { xs: "center", md: "center" },
                        }}
                      />
                    </Stack>

                    <Typography
                      variant="h6"
                      component="p"
                      sx={{
                        fontWeight: 700,
                        color: "primary.main",
                        fontSize: { xs: "1.02rem", sm: "1.15rem" },
                        mb: 1.5,
                      }}
                    >
                      Senior Distributed Systems Engineer &amp; Architect • Creator, Gangs of Developers (GOD)
                    </Typography>

                    {/* Resume Contact & Location Meta Strip */}
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        flexWrap: "wrap",
                        gap: 1.5,
                        alignItems: "center",
                        justifyContent: { xs: "center", md: "flex-start" },
                        mb: 2,
                        p: 1.25,
                        borderRadius: 2,
                        bgcolor: mode === "light" ? "rgba(241, 245, 249, 0.7)" : "rgba(30, 41, 59, 0.45)",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Stack direction="row" spacing={0.6} sx={{ alignItems: "center" }}>
                        <LocationOnIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="caption" sx={{ fontWeight: 650, color: "text.primary" }}>
                          Bengaluru, India
                        </Typography>
                      </Stack>
                      <Typography variant="caption" sx={{ color: "text.disabled", display: { xs: "none", sm: "inline" } }}>
                        •
                      </Typography>
                      <Stack direction="row" spacing={0.6} sx={{ alignItems: "center" }}>
                        <EmailIcon sx={{ fontSize: 15, color: "text.secondary" }} />
                        <Typography variant="caption" sx={{ fontWeight: 650, color: "text.primary" }}>
                          {email}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" sx={{ color: "text.disabled", display: { xs: "none", sm: "inline" } }}>
                        •
                      </Typography>
                      <Stack direction="row" spacing={0.6} sx={{ alignItems: "center" }}>
                        <LinkedInIcon sx={{ fontSize: 15, color: "#0077b5" }} />
                        <Typography variant="caption" sx={{ fontWeight: 650, color: "text.primary" }}>
                          in/{linkedinHandle}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.75,
                        fontSize: { xs: "0.95rem", sm: "1.02rem" },
                        maxWidth: 720,
                      }}
                    >
                      Distributed systems practitioner with <strong>9+ years of experience</strong> architecting,
                      building, and scaling high-throughput backend platforms, event-driven streaming
                      infrastructures, and cloud-native microservices. Specialized in the{" "}
                      <strong>Java ecosystem</strong> (JVM performance optimization, Garbage Collection internals,
                      Spring Boot, Tomcat tuning), <strong>Apache Kafka at enterprise scale</strong>, and resilient
                      distributed systems.
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.75,
                        fontSize: { xs: "0.95rem", sm: "1.02rem" },
                        maxWidth: 720,
                        mt: 1.25,
                      }}
                    >
                      As an active technical author, I publish deep-dive engineering insights on{" "}
                      <Link
                        href={mediumUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: mode === "light" ? "#b45309" : "#f59e0b",
                          fontWeight: 700,
                          textDecoration: "underline",
                        }}
                      >
                        Medium (@dharamcodes)
                      </Link>
                      , <strong>Stackademic</strong>, and{" "}
                      <strong>wiredcoder.pub</strong>. Creator of the{" "}
                      <strong>Gangs of Developers (GOD) System Design Handbook</strong>, bringing battle-tested
                      architectural blueprints, real trade-off comparisons, and zero-fluff architectural interview guidance
                      to thousands of engineers globally.
                    </Typography>
                  </Box>

                  {/* Quick Handbook Links */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    sx={{ pt: 2 }}
                  >
                    <Button
                      component={Link}
                      href="/"
                      variant="contained"
                      color="primary"
                      startIcon={<MenuBookIcon />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 750,
                        borderRadius: 2,
                        py: 0.9,
                        px: 2.5,
                      }}
                    >
                      Explore System Design Handbook
                    </Button>
                    <Button
                      component={Link}
                      href="/company-wise-problems"
                      variant="outlined"
                      color="secondary"
                      startIcon={<BusinessRoundedIcon />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 750,
                        borderRadius: 2,
                        py: 0.9,
                        px: 2.5,
                      }}
                    >
                      View Company-wise Problems
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* Handbook & Career Milestones Stats */}
          <Grid container spacing={2.5} sx={{ mb: 6 }}>
            {milestones.map((item, idx) => (
              <Grid key={idx} size={{ xs: 6, md: 3 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: 3,
                    textAlign: "center",
                    bgcolor:
                      mode === "light"
                        ? "rgba(255, 255, 255, 0.75)"
                        : "rgba(15, 23, 42, 0.6)",
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      borderColor: "primary.main",
                      boxShadow: "0 8px 24px rgba(245, 158, 11, 0.15)",
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      color: "primary.main",
                      fontSize: { xs: "1.75rem", sm: "2.2rem" },
                      lineHeight: 1.1,
                      mb: 0.5,
                    }}
                  >
                    {item.number}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 750, color: "text.primary", mb: 0.5 }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", display: "block" }}
                  >
                    {item.sub}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Areas of Specialization */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 3, sm: 4, md: 4.5 },
              borderRadius: { xs: 3, md: 4 },
              bgcolor:
                mode === "light"
                  ? "rgba(255, 255, 255, 0.85)"
                  : "rgba(15, 23, 42, 0.75)",
              mb: 6,
            }}
          >
            <Typography
              variant="overline"
              sx={{
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: "primary.main",
                display: "block",
                mb: 0.5,
              }}
            >
              Core Engineering Focus
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 850,
                fontSize: { xs: "1.45rem", sm: "1.85rem" },
                mb: 1,
              }}
            >
              Areas of Specialization
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                maxWidth: 720,
                lineHeight: 1.6,
                mb: 3.5,
              }}
            >
              Architectural domains and engineering principles honed across 9+ years of building, tuning, and scaling distributed backend systems.
            </Typography>

            <Grid container spacing={3}>
              {specializations.map((spec, idx) => (
                <Grid key={idx} size={{ xs: 12, md: 6 }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      borderRadius: 3,
                      bgcolor:
                        mode === "light"
                          ? "rgba(248, 250, 252, 0.85)"
                          : "rgba(30, 41, 59, 0.4)",
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "primary.main",
                        transform: "translateY(-2px)",
                        boxShadow:
                          mode === "light"
                            ? "0 8px 24px rgba(0,0,0,0.06)"
                            : "0 8px 24px rgba(0,0,0,0.3)",
                      },
                    }}
                  >
                    <Box>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 2,
                            bgcolor:
                              mode === "light"
                                ? "rgba(0, 0, 0, 0.04)"
                                : "rgba(255, 255, 255, 0.05)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {spec.icon}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 800, fontSize: "1.05rem", color: "text.primary" }}
                        >
                          {spec.title}
                        </Typography>
                      </Stack>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          lineHeight: 1.65,
                          fontSize: "0.9rem",
                          mb: 2.5,
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
                            fontSize: "0.75rem",
                            height: 24,
                            fontWeight: 600,
                            borderRadius: 1.5,
                            bgcolor:
                              mode === "light"
                                ? "rgba(255, 255, 255, 0.95)"
                                : "rgba(15, 23, 42, 0.8)",
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

          {/* The Vision & Story Behind GOD */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: { xs: 3, md: 4 },
              bgcolor:
                mode === "light"
                  ? "rgba(255, 255, 255, 0.85)"
                  : "rgba(15, 23, 42, 0.75)",
              mb: 6,
            }}
          >
            <Typography
              variant="overline"
              sx={{
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: "primary.main",
                display: "block",
                mb: 1,
              }}
            >
              The Story & Mission
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 850,
                fontSize: { xs: "1.5rem", sm: "1.9rem" },
                mb: 2.5,
              }}
            >
              Why Gangs of Developers (GOD) Was Created
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.8,
                fontSize: "1.02rem",
                mb: 2,
              }}
            >
              For years, preparing for System Design interviews or scaling
              mission-critical production infrastructure felt like navigating an
              unforgiving desert of buzzwords. Most guides offer hand-waving
              approximations: <em>“Just add a Redis cache in front of PostgreSQL,
              put a Kafka queue between microservices, and you’re done.”</em>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.8,
                fontSize: "1.02rem",
                mb: 2,
              }}
            >
              In real production systems, that is precisely where catastrophic outages
              begin: <strong>Cache Stampedes</strong> knocking out the primary database,
              <strong>Outage Retry Storms</strong> quadrupling traffic during degradations,
              <strong>Split-Brain network partitions</strong> causing silent ledger
              corruptions, and <strong>LSM write amplification</strong> stalling SSD I/O.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.8,
                fontSize: "1.02rem",
                mb: 2,
              }}
            >
              <strong>Gangs of Developers (GOD)</strong> was written to replace
              shallow bullet points with deep architectural reality. Every chapter
              provides the mathematical fundamentals, ASCII and visual SVG
              architectural blueprints, trade-off comparisons across conflicting
              approaches, and battle-tested technical interview guidance.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.8,
                fontSize: "1.02rem",
                mb: 2.5,
              }}
            >
              Today, this mission has grown into an active developer community.
              Connect with fellow engineers on our official{" "}
              <Link
                href={linkedinCompanyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: mode === "light" ? "#b45309" : "#f59e0b",
                  fontWeight: 700,
                  textDecoration: "underline",
                }}
              >
                Gangs of Developers LinkedIn Page
              </Link>{" "}
              and join our dedicated discussion forum on the{" "}
              <Link
                href={linkedinGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: mode === "light" ? "#b45309" : "#f59e0b",
                  fontWeight: 700,
                  textDecoration: "underline",
                }}
              >
                Gangs of Developers LinkedIn Group
              </Link>
              , where we dissect real-world production outages, analyze system design
              interview blueprints, and collaborate on distributed architecture patterns.
            </Typography>

            {/* LinkedIn Community Links */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ pt: 0.5 }}
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
                  borderRadius: 2,
                  px: 2.5,
                  py: 1,
                  borderColor:
                    mode === "light"
                      ? "rgba(0, 119, 181, 0.4)"
                      : "rgba(56, 189, 248, 0.4)",
                  "&:hover": {
                    borderColor: "#0077b5",
                    bgcolor: "rgba(0, 119, 181, 0.08)",
                  },
                }}
              >
                Join LinkedIn Group
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
                  borderRadius: 2,
                  px: 2.5,
                  py: 1,
                  borderColor:
                    mode === "light"
                      ? "rgba(0, 119, 181, 0.4)"
                      : "rgba(56, 189, 248, 0.4)",
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

          {/* Get In Touch CTA Card */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 3.5, sm: 4.5, md: 5 },
              borderRadius: { xs: 3, md: 4 },
              textAlign: "center",
              bgcolor:
                mode === "light"
                  ? "rgba(248, 250, 252, 0.95)"
                  : "rgba(30, 41, 59, 0.5)",
              border: "2px dashed",
              borderColor:
                mode === "light"
                  ? "rgba(180, 83, 9, 0.3)"
                  : "rgba(245, 158, 11, 0.35)",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 850,
                fontSize: { xs: "1.4rem", sm: "1.8rem" },
                mb: 1.5,
              }}
            >
              Let’s Connect & Collaborate
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: 620,
                mx: "auto",
                mb: 3,
                lineHeight: 1.7,
              }}
            >
              Whether you want to discuss distributed consensus trade-offs, JVM and Kafka
              performance tuning, or collaborate on architectural blueprints for the handbook,
              feel free to reach out directly!
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ justifyContent: "center", alignItems: "center" }}
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
                  px: 3,
                  py: 1.25,
                  borderRadius: 2,
                  bgcolor: "#0077b5",
                  "&:hover": {
                    bgcolor: "#005e93",
                  },
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
                  px: 3,
                  py: 1.25,
                  borderRadius: 2,
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
                  px: 3,
                  py: 1.25,
                  borderRadius: 2,
                }}
              >
                Send Email ({email})
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
                  px: 3,
                  py: 1.25,
                  borderRadius: 2,
                }}
              >
                GitHub ({githubHandle})
              </Button>
            </Stack>
          </Paper>
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
            <strong>{fullName}</strong> (
            <Link
              href={linkedinUrl}
              target="_blank"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              @{linkedinHandle}
            </Link>
            ). All rights reserved.
          </Typography>
        </Box>

        {/* Copy Notification Snackbar */}
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
            sx={{ width: "100%", fontWeight: 700 }}
          >
            Email address copied to clipboard: {email}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
