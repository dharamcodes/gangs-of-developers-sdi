"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  Fade,
  Fab,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import CloseIcon from "@mui/icons-material/Close";
import SchemaOutlinedIcon from "@mui/icons-material/SchemaOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ArchitectureDiagramCard from "./ArchitectureDiagramCard";
import type {
  HandbookUiConfig,
  SubtopicDetail,
  SubtopicSummary,
} from "../types/handbook";

interface SubtopicContentViewProps {
  ui: HandbookUiConfig;
  mode: "light" | "dark";
  fontScale: "normal" | "large" | "xlarge";
  subtopic: SubtopicDetail;
  prevSubtopic: SubtopicSummary | null;
  nextSubtopic: SubtopicSummary | null;
  onSelectSubtopic: (subtopicId: string, topicId: string) => void;
}

const PROSE_MAX_WIDTH = 840;

const FONT_SIZE_MAP = {
  normal: {
    lede: { xs: "1.06rem", sm: "1.18rem" },
    body: { xs: "1.0rem", sm: "1.06rem" },
    bullet: { xs: "0.96rem", sm: "1.02rem" },
    code: { xs: "0.78rem", sm: "0.85rem" },
  },
  large: {
    lede: { xs: "1.14rem", sm: "1.28rem" },
    body: { xs: "1.06rem", sm: "1.15rem" },
    bullet: { xs: "1.02rem", sm: "1.10rem" },
    code: { xs: "0.84rem", sm: "0.92rem" },
  },
  xlarge: {
    lede: { xs: "1.22rem", sm: "1.38rem" },
    body: { xs: "1.14rem", sm: "1.24rem" },
    bullet: { xs: "1.10rem", sm: "1.18rem" },
    code: { xs: "0.90rem", sm: "0.98rem" },
  },
};

const DIFFICULTY_STYLE: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  Foundational: {
    label: "Foundational",
    color: "#059669",
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.25)",
  },
  Intermediate: {
    label: "Intermediate",
    color: "#0284c7",
    bg: "rgba(2, 132, 199, 0.1)",
    border: "rgba(2, 132, 199, 0.25)",
  },
  Advanced: {
    label: "Advanced",
    color: "#8b5cf6",
    bg: "rgba(139, 92, 246, 0.1)",
    border: "rgba(139, 92, 246, 0.25)",
  },
  "Staff+": {
    label: "Staff+",
    color: "#d97706",
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.25)",
  },
};

/**
 * Renders inline backtick code (`...`) and bold markdown (**...**) without external dependencies.
 */
function renderInlineCode(text: string, mode: "light" | "dark"): React.ReactNode {
  if (!text) return null;
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      const codeContent = part.slice(1, -1);
      return (
        <Box
          key={idx}
          component="code"
          sx={{
            px: 0.75,
            py: 0.15,
            mx: 0.2,
            borderRadius: "5px",
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
            fontSize: "0.88em",
            fontWeight: 600,
            bgcolor:
              mode === "light"
                ? "rgba(15, 23, 42, 0.065)"
                : "rgba(255, 255, 255, 0.11)",
            color: mode === "light" ? "#9a3412" : "#fbbf24",
            border: "1px solid",
            borderColor:
              mode === "light"
                ? "rgba(15, 23, 42, 0.1)"
                : "rgba(255, 255, 255, 0.15)",
          }}
        >
          {codeContent}
        </Box>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      const boldContent = part.slice(2, -2);
      return (
        <Box
          key={idx}
          component="strong"
          sx={{
            fontWeight: 750,
            color: "text.primary",
          }}
        >
          {boldContent}
        </Box>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

/**
 * Formats a bullet string by highlighting the lead-in label (before ':' or '—') in bold
 * and rendering inline backtick code pills.
 */
function renderFormattedBullet(
  bullet: string,
  mode: "light" | "dark"
): React.ReactNode {
  const boldPrefixMatch = bullet.match(/^\*\*([^*]+)\*\*:\s*(.*)$/);
  if (boldPrefixMatch) {
    const [, title, rest] = boldPrefixMatch;
    return (
      <>
        <Box component="span" sx={{ fontWeight: 750, color: "text.primary" }}>
          {title}:{" "}
        </Box>
        {renderInlineCode(rest, mode)}
      </>
    );
  }

  const colonIdx = bullet.indexOf(": ");
  const dashIdx = bullet.indexOf(" — ");

  let splitIdx = -1;
  let delimiter = "";

  if (colonIdx > 0 && colonIdx < 80) {
    splitIdx = colonIdx;
    delimiter = ": ";
  } else if (dashIdx > 0 && dashIdx < 80) {
    splitIdx = dashIdx;
    delimiter = " — ";
  }

  if (splitIdx > 0) {
    const lead = bullet.slice(0, splitIdx + delimiter.length);
    const rest = bullet.slice(splitIdx + delimiter.length);
    return (
      <>
        <Box component="span" sx={{ fontWeight: 750, color: "text.primary" }}>
          {renderInlineCode(lead, mode)}
        </Box>
        {renderInlineCode(rest, mode)}
      </>
    );
  }

  return renderInlineCode(bullet, mode);
}

function CodeBlockCard({
  title,
  code,
  fontSize,
}: {
  title: string;
  code: string;
  fontSize: { xs: string; sm: string };
}) {
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard errors
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        overflow: "hidden",
        borderRadius: 2.5,
        mt: 2.5,
        mb: 2.5,
        borderColor: "rgba(148, 163, 184, 0.25)",
        boxShadow: "0 10px 28px -10px rgba(15, 23, 42, 0.18)",
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.15,
          bgcolor: "#111827",
          color: "#e2e8f0",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", minWidth: 0 }}>
          <Stack direction="row" spacing={0.6} sx={{ alignItems: "center", flexShrink: 0 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#ef4444" }} />
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#f59e0b" }} />
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#22c55e" }} />
          </Stack>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
              color: "#f1f5f9",
              letterSpacing: "0.02em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>
        </Stack>

        <Tooltip title={copied ? "Copied!" : "Copy Snippet"}>
          <IconButton
            size="small"
            onClick={handleCopy}
            sx={{
              color: copied ? "#4ade80" : "#94a3b8",
              p: 0.5,
              borderRadius: 1.5,
              "&:hover": { color: "#ffffff", bgcolor: "rgba(255,255,255,0.08)" },
            }}
          >
            {copied ? (
              <CheckIcon sx={{ fontSize: 16 }} />
            ) : (
              <ContentCopyIcon sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </Tooltip>
      </Stack>

      <Box
        component="pre"
        sx={{
          m: 0,
          p: { xs: 2, sm: 2.75 },
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
          fontSize,
          lineHeight: 1.65,
          bgcolor: "#070b14",
          color: "#e2e8f0",
        }}
      >
        {code}
      </Box>
    </Paper>
  );
}

export default function SubtopicContentView({
  ui,
  mode,
  fontScale,
  subtopic,
  prevSubtopic,
  nextSubtopic,
  onSelectSubtopic,
}: SubtopicContentViewProps) {
  const [erZoomUrl, setErZoomUrl] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const scaleConfig = FONT_SIZE_MAP[fontScale];

  const diffStyle =
    DIFFICULTY_STYLE[subtopic.difficulty] || DIFFICULTY_STYLE["Intermediate"];

  // Floating Back to Top listener
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setShowBackToTop(window.scrollY > 450);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyLink = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
      } catch {
        // Ignore clipboard failure
      }
    }
  };

  const handleScrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      {/* Blog Article Container */}
      <Paper
        elevation={0}
        component="article"
        sx={{
          p: { xs: 2.5, sm: 4.5, md: 6, lg: 7 },
          borderRadius: { xs: 2.5, sm: 4 },
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          boxShadow:
            mode === "light"
              ? "0 20px 50px -16px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02)"
              : "0 20px 50px -16px rgba(0, 0, 0, 0.6)",
        }}
      >
        {/* ========================================================= */}
        {/* 1. EDITORIAL HEADER & METADATA BAR                       */}
        {/* ========================================================= */}
        <Box sx={{ maxWidth: PROSE_MAX_WIDTH, mb: 4 }}>
          {/* Breadcrumb Pill & Chapter Meta */}
          <Stack
            direction="row"
            spacing={1.25}
            sx={{
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
              mb: 2.5,
            }}
          >
            <Chip
              icon={<MenuBookOutlinedIcon sx={{ fontSize: "14px !important" }} />}
              label={`${ui.partPrefix} ${subtopic.topicNumber}: ${subtopic.topicTitle}`}
              size="small"
              sx={{
                fontWeight: 750,
                fontSize: "0.75rem",
                letterSpacing: "0.02em",
                bgcolor:
                  mode === "light"
                    ? "rgba(15, 23, 42, 0.06)"
                    : "rgba(255, 255, 255, 0.08)",
                borderRadius: 1.5,
                color: "text.secondary",
              }}
            />

            <Chip
              label={`${ui.sectionPrefix} ${subtopic.subtopicNumber}`}
              size="small"
              color="primary"
              sx={{
                fontWeight: 800,
                fontSize: "0.75rem",
                borderRadius: 1.5,
              }}
            />

            <Chip
              label={diffStyle.label}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: "0.72rem",
                color: diffStyle.color,
                bgcolor: diffStyle.bg,
                border: "1px solid",
                borderColor: diffStyle.border,
                borderRadius: 1.5,
              }}
            />

            <Chip
              icon={<AccessTimeIcon sx={{ fontSize: "14px !important" }} />}
              label={subtopic.readingTime}
              size="small"
              variant="outlined"
              sx={{
                fontWeight: 600,
                fontSize: "0.72rem",
                borderRadius: 1.5,
                borderColor: "divider",
              }}
            />
          </Stack>

          {/* Main Blog Post Headline */}
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 850,
              letterSpacing: "-0.03em",
              lineHeight: { xs: 1.22, sm: 1.18 },
              fontSize: { xs: "1.85rem", sm: "2.5rem", md: "2.9rem" },
              color: "text.primary",
              mb: 2,
            }}
          >
            <Box
              component="span"
              sx={{
                color: "primary.main",
                mr: 1.5,
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
                fontSize: "0.85em",
                display: "inline-block",
              }}
            >
              {subtopic.subtopicNumber}
            </Box>
            {subtopic.title}
          </Typography>

          {/* Editorial Lede Deck */}
          <Typography
            variant="h6"
            component="p"
            sx={{
              fontSize: scaleConfig.lede,
              lineHeight: 1.75,
              color: "text.secondary",
              fontWeight: 450,
              mb: 3.5,
            }}
          >
            {renderInlineCode(subtopic.subtitle, mode)}
          </Typography>

          {/* Author Byline & Social / Action Tools */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              p: 2,
              borderRadius: 2.5,
              bgcolor:
                mode === "light"
                  ? "rgba(15, 23, 42, 0.025)"
                  : "rgba(255, 255, 255, 0.025)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: "primary.main",
                  color: "#0f172a",
                  fontWeight: 900,
                  fontSize: "0.85rem",
                  boxShadow: "0 2px 8px rgba(245, 158, 11, 0.35)",
                }}
              >
                GOD
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 800, lineHeight: 1.2, color: "text.primary" }}
                >
                  Gangs of Developers Staff
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                >
                  Distributed Systems &amp; Senior Interview Blueprint Series
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Tooltip title={bookmarked ? "Remove Bookmark" : "Bookmark this chapter"}>
                <IconButton
                  size="small"
                  onClick={() => setBookmarked(!bookmarked)}
                  sx={{
                    borderRadius: 1.5,
                    border: "1px solid",
                    borderColor: bookmarked ? "primary.main" : "divider",
                    color: bookmarked ? "primary.main" : "text.secondary",
                  }}
                >
                  {bookmarked ? (
                    <BookmarkIcon fontSize="small" />
                  ) : (
                    <BookmarkBorderIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>

              <Tooltip title="Copy article link">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ShareOutlinedIcon fontSize="small" />}
                  onClick={handleCopyLink}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    borderRadius: 1.5,
                    color: "text.primary",
                    borderColor: "divider",
                  }}
                >
                  Share
                </Button>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>

        <Divider sx={{ mb: 4.5 }} />

        {/* ========================================================= */}
        {/* 2. EXECUTIVE BRIEFING / KEY TAKEAWAYS                      */}
        {/* ========================================================= */}
        <Box sx={{ maxWidth: PROSE_MAX_WIDTH, mb: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: 3,
              bgcolor:
                mode === "light"
                  ? "rgba(245, 158, 11, 0.05)"
                  : "rgba(245, 158, 11, 0.08)",
              border: "1px solid",
              borderColor:
                mode === "light"
                  ? "rgba(180, 83, 9, 0.22)"
                  : "rgba(245, 158, 11, 0.28)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "4px",
                height: "100%",
                background: "linear-gradient(180deg, #f59e0b 0%, #b45309 100%)",
              }}
            />

            <Stack
              direction="row"
              spacing={1.25}
              sx={{ alignItems: "center", mb: 2 }}
            >
              <AutoAwesomeOutlinedIcon
                sx={{ color: "primary.main", fontSize: 20 }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 850,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "primary.main",
                  fontSize: "0.82rem",
                }}
              >
                {ui.keyTakeawaysHeading}
              </Typography>
            </Stack>

            <Stack spacing={1.75}>
              {subtopic.keyTakeaways.map((point, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.75,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor:
                      mode === "light"
                        ? "rgba(255, 255, 255, 0.65)"
                        : "rgba(15, 23, 42, 0.5)",
                    border: "1px solid",
                    borderColor:
                      mode === "light"
                        ? "rgba(180, 83, 9, 0.12)"
                        : "rgba(255, 255, 255, 0.06)",
                    transition: "transform 0.15s ease",
                    "&:hover": {
                      transform: "translateX(3px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "6px",
                      bgcolor: "primary.main",
                      color: "#0f172a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 850,
                      fontSize: "0.72rem",
                      flexShrink: 0,
                      mt: 0.2,
                    }}
                  >
                    {idx + 1}
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: scaleConfig.bullet,
                      lineHeight: 1.7,
                      color: "text.primary",
                    }}
                  >
                    {renderInlineCode(point, mode)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>

        {/* ========================================================= */}
        {/* 3. IN-DEPTH ARCHITECTURE SECTIONS                         */}
        {/* ========================================================= */}
        <Stack spacing={6} sx={{ mb: 6 }}>
          {subtopic.sections.map((section, idx) => {
            const stepMatch = section.heading.match(/^(\d+)\.\s+(.*)$/);
            const stepNum = stepMatch ? stepMatch[1] : null;
            const cleanHeading = stepMatch ? stepMatch[2] : section.heading;

            return (
              <Box
                key={idx}
                id={`section-${idx}`}
                sx={{
                  scrollMarginTop: "96px",
                  pb: idx < subtopic.sections.length - 1 ? 5 : 0,
                  borderBottom:
                    idx < subtopic.sections.length - 1 ? "1px solid" : "none",
                  borderColor: "divider",
                }}
              >
                {/* Section Header with Step Pill & Anchor */}
                <Box sx={{ maxWidth: PROSE_MAX_WIDTH, mb: 2 }}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: "center", mb: 1.25 }}
                  >
                    {stepNum ? (
                      <Chip
                        label={`PART ${stepNum.padStart(2, "0")}`}
                        size="small"
                        sx={{
                          fontWeight: 850,
                          fontSize: "0.7rem",
                          letterSpacing: "0.06em",
                          bgcolor: "primary.main",
                          color: "#0f172a",
                          borderRadius: 1.25,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 4,
                          height: 20,
                          borderRadius: 1,
                          bgcolor: "primary.main",
                        }}
                      />
                    )}
                    <Typography
                      variant="h4"
                      component="h2"
                      sx={{
                        fontWeight: 850,
                        letterSpacing: "-0.02em",
                        fontSize: { xs: "1.32rem", sm: "1.6rem" },
                        lineHeight: 1.3,
                        color: "text.primary",
                      }}
                    >
                      {cleanHeading}
                    </Typography>
                  </Stack>
                </Box>

                {/* Section Body Prose */}
                <Box sx={{ maxWidth: PROSE_MAX_WIDTH, mb: 3 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: scaleConfig.body,
                      lineHeight: 1.85,
                      color: "text.primary",
                      "&::first-letter":
                        idx === 0
                          ? {
                              fontSize: "1.35em",
                              fontWeight: 700,
                              color: "primary.main",
                            }
                          : {},
                    }}
                  >
                    {renderInlineCode(section.body, mode)}
                  </Typography>
                </Box>

                {/* Bullet Points Styled as Architecture Insight Cards */}
                {section.bullets && (
                  <Box sx={{ maxWidth: PROSE_MAX_WIDTH, mb: 3.5 }}>
                    <Stack spacing={1.5}>
                      {section.bullets.map((bullet, bIdx) => (
                        <Box
                          key={bIdx}
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.75,
                            p: { xs: 1.5, sm: 2 },
                            borderRadius: 2.25,
                            bgcolor:
                              mode === "light"
                                ? "rgba(15, 23, 42, 0.022)"
                                : "rgba(255, 255, 255, 0.025)",
                            border: "1px solid",
                            borderColor:
                              mode === "light"
                                ? "rgba(15, 23, 42, 0.07)"
                                : "rgba(255, 255, 255, 0.07)",
                            borderLeft: "3.5px solid",
                            borderLeftColor:
                              bIdx % 2 === 0 ? "primary.main" : "secondary.main",
                            transition: "background-color 0.15s ease",
                            "&:hover": {
                              bgcolor:
                                mode === "light"
                                  ? "rgba(15, 23, 42, 0.04)"
                                  : "rgba(255, 255, 255, 0.045)",
                            },
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              fontSize: scaleConfig.bullet,
                              lineHeight: 1.75,
                              color: "text.primary",
                              flex: 1,
                            }}
                          >
                            {renderFormattedBullet(bullet, mode)}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Entity-Relationship (ER) Storage Schema Diagram (Section 4) */}
                {section.erDiagramUrl && (
                  <Box sx={{ my: 3.5 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        borderColor: "divider",
                        boxShadow: "0 10px 30px -10px rgba(15, 23, 42, 0.12)",
                      }}
                    >
                      <Stack
                        direction="row"
                        sx={{
                          alignItems: "center",
                          justifyContent: "space-between",
                          px: 2.5,
                          py: 1.25,
                          bgcolor: "#0f172a",
                          color: "#f8fafc",
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                          <SchemaOutlinedIcon
                            sx={{ color: "#38bdf8", fontSize: 20 }}
                          />
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 750, letterSpacing: "0.01em" }}
                          >
                            Figure: Storage Model &amp; Entity-Relationship (ER) Blueprint
                          </Typography>
                        </Stack>

                        <Tooltip title="Fullscreen Zoom">
                          <IconButton
                            size="small"
                            onClick={() => setErZoomUrl(section.erDiagramUrl ?? null)}
                            sx={{
                              color: "#e2e8f0",
                              border: "1px solid rgba(255,255,255,0.2)",
                              borderRadius: 1.5,
                              p: 0.5,
                              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                            }}
                          >
                            <ZoomOutMapIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>

                      <Box
                        onClick={() => setErZoomUrl(section.erDiagramUrl ?? null)}
                        sx={{
                          p: { xs: 1.5, sm: 3 },
                          bgcolor: "#ffffff",
                          overflowX: "auto",
                          cursor: "zoom-in",
                          WebkitOverflowScrolling: "touch",
                        }}
                      >
                        <Box
                          component="img"
                          src={section.erDiagramUrl}
                          alt={`${subtopic.subtopicNumber} ${subtopic.title} ER Diagram`}
                          sx={{
                            width: "100%",
                            minWidth: { xs: 580, sm: "100%" },
                            height: "auto",
                            display: "block",
                          }}
                        />
                      </Box>
                    </Paper>
                  </Box>
                )}

                {/* System Architecture Diagram (Section 5) */}
                {section.diagramImageUrl && (
                  <Box sx={{ my: 3.5 }}>
                    <ArchitectureDiagramCard
                      ui={ui}
                      diagramImageUrl={section.diagramImageUrl}
                      asciiDiagram={
                        section.asciiDiagram || subtopic.architectureDiagram
                      }
                      altText={`${subtopic.subtopicNumber} ${subtopic.title}`}
                    />
                  </Box>
                )}

                {/* Code Snippet / Mathematical Worksheet */}
                {section.codeSnippet && (
                  <Box sx={{ maxWidth: PROSE_MAX_WIDTH }}>
                    <CodeBlockCard
                      title={section.codeSnippet.title}
                      code={section.codeSnippet.code}
                      fontSize={scaleConfig.code}
                    />
                  </Box>
                )}
              </Box>
            );
          })}
        </Stack>

        {/* ========================================================= */}
        {/* 4. ARCHITECTURAL DECISION MATRIX / TRADE-OFFS              */}
        {/* ========================================================= */}
        {subtopic.tradeOffs && (
          <Box
            id="section-tradeoffs"
            sx={{ mb: 6, scrollMarginTop: "96px" }}
          >
            <Box sx={{ maxWidth: PROSE_MAX_WIDTH, mb: 2 }}>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 850,
                  fontSize: { xs: "1.32rem", sm: "1.6rem" },
                  mb: 0.75,
                }}
              >
                {ui.tradeOffMatrixHeading}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.6 }}
              >
                Evaluating production alternatives, concurrency bottlenecks, and operational costs.
              </Typography>
            </Box>

            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                borderRadius: 3,
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                boxShadow: "0 8px 24px -8px rgba(15, 23, 42, 0.08)",
              }}
            >
              <Table sx={{ minWidth: 680 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: mode === "light" ? "#f8fafc" : "#111827",
                    }}
                  >
                    <TableCell sx={{ fontWeight: 800, width: "22%", py: 1.75 }}>
                      {ui.tradeOffHeaders.option}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        width: "28%",
                        color: "success.main",
                        py: 1.75,
                      }}
                    >
                      ✓ {ui.tradeOffHeaders.pros}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        width: "28%",
                        color: "warning.main",
                        py: 1.75,
                      }}
                    >
                      ⚠ {ui.tradeOffHeaders.cons}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        width: "22%",
                        color: "secondary.main",
                        py: 1.75,
                      }}
                    >
                      ★ {ui.tradeOffHeaders.bestFor}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subtopic.tradeOffs.map((row, rIdx) => (
                    <TableRow
                      key={rIdx}
                      sx={{
                        "&:nth-of-type(odd)": {
                          bgcolor:
                            mode === "light"
                              ? "rgba(248, 250, 252, 0.6)"
                              : "rgba(255, 255, 255, 0.015)",
                        },
                        "&:hover": {
                          bgcolor:
                            mode === "light"
                              ? "rgba(15, 23, 42, 0.02)"
                              : "rgba(255, 255, 255, 0.03)",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 750,
                          verticalAlign: "top",
                          fontSize: "0.92rem",
                          py: 2,
                        }}
                      >
                        {renderInlineCode(row.option, mode)}
                      </TableCell>
                      <TableCell
                        sx={{
                          verticalAlign: "top",
                          lineHeight: 1.65,
                          fontSize: "0.9rem",
                          py: 2,
                        }}
                      >
                        {renderInlineCode(row.pros, mode)}
                      </TableCell>
                      <TableCell
                        sx={{
                          verticalAlign: "top",
                          lineHeight: 1.65,
                          fontSize: "0.9rem",
                          py: 2,
                        }}
                      >
                        {renderInlineCode(row.cons, mode)}
                      </TableCell>
                      <TableCell
                        sx={{
                          verticalAlign: "top",
                          lineHeight: 1.65,
                          fontSize: "0.9rem",
                          py: 2,
                        }}
                      >
                        {renderInlineCode(row.bestFor, mode)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* ========================================================= */}
        {/* 5. STAFF+ ARCHITECT INTERVIEW FIELD GUIDE                */}
        {/* ========================================================= */}
        <Box
          id="section-interview-tip"
          sx={{ maxWidth: PROSE_MAX_WIDTH, mb: 6, scrollMarginTop: "96px" }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.75, sm: 3.75 },
              borderRadius: 3,
              bgcolor:
                mode === "light"
                  ? "rgba(2, 132, 199, 0.06)"
                  : "rgba(56, 189, 248, 0.08)",
              border: "1px solid",
              borderColor:
                mode === "light"
                  ? "rgba(2, 132, 199, 0.22)"
                  : "rgba(56, 189, 248, 0.25)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "4px",
                height: "100%",
                background: "linear-gradient(180deg, #0284c7 0%, #38bdf8 100%)",
              }}
            />

            <Stack direction="row" spacing={1.75} sx={{ alignItems: "flex-start" }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "10px",
                  bgcolor: "secondary.main",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 3px 10px rgba(2, 132, 199, 0.3)",
                }}
              >
                <TipsAndUpdatesOutlinedIcon fontSize="small" />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 850,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "secondary.main",
                    fontSize: "0.82rem",
                    mb: 1,
                  }}
                >
                  {ui.interviewTipHeading}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: scaleConfig.body,
                    lineHeight: 1.8,
                    color: "text.primary",
                  }}
                >
                  {renderInlineCode(subtopic.interviewTip, mode)}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

        <Divider sx={{ mb: 5 }} />

        {/* ========================================================= */}
        {/* 6. NEXT READS & CHAPTER NAVIGATION                         */}
        {/* ========================================================= */}
        <Box sx={{ maxWidth: PROSE_MAX_WIDTH, mx: "auto" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2.5}
            sx={{ justifyContent: "space-between" }}
          >
            {prevSubtopic ? (
              <Button
                variant="outlined"
                onClick={() =>
                  onSelectSubtopic(prevSubtopic.id, prevSubtopic.topicId)
                }
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: 3,
                  textTransform: "none",
                  flex: 1,
                  borderColor: "divider",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                  },
                }}
              >
                <ArrowBackIosNewIcon
                  fontSize="small"
                  sx={{ mr: 1.5, color: "text.secondary" }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", fontWeight: 700, mb: 0.25 }}
                  >
                    PREVIOUS CHAPTER
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 800, lineHeight: 1.3, color: "text.primary" }}
                  >
                    {prevSubtopic.subtopicNumber} {prevSubtopic.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.72rem" }}
                  >
                    {prevSubtopic.topicTitle}
                  </Typography>
                </Box>
              </Button>
            ) : (
              <Box sx={{ flex: 1 }} />
            )}

            {nextSubtopic ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  onSelectSubtopic(nextSubtopic.id, nextSubtopic.topicId)
                }
                sx={{
                  justifyContent: "flex-end",
                  textAlign: "right",
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: 3,
                  textTransform: "none",
                  flex: 1,
                  boxShadow: "0 6px 20px rgba(245, 158, 11, 0.25)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(245, 158, 11, 0.35)",
                  },
                }}
              >
                <Box sx={{ mr: 1.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      fontWeight: 800,
                      opacity: 0.9,
                      mb: 0.25,
                      letterSpacing: "0.04em",
                    }}
                  >
                    NEXT STORY IN SERIES →
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 850, lineHeight: 1.3 }}
                  >
                    {nextSubtopic.subtopicNumber} {nextSubtopic.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.85, fontSize: "0.72rem" }}
                  >
                    {nextSubtopic.topicTitle}
                  </Typography>
                </Box>
                <ArrowForwardIosIcon fontSize="small" />
              </Button>
            ) : (
              <Box sx={{ flex: 1 }} />
            )}
          </Stack>
        </Box>
      </Paper>

      {/* Floating Back to Top FAB */}
      <Fade in={showBackToTop}>
        <Fab
          size="medium"
          color="primary"
          onClick={handleScrollToTop}
          sx={{
            position: "fixed",
            bottom: 28,
            right: 28,
            zIndex: 1000,
            boxShadow: "0 6px 20px rgba(245, 158, 11, 0.4)",
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Fade>

      {/* Fullscreen Lightbox Dialog for ER Diagram */}
      <Dialog
        open={Boolean(erZoomUrl)}
        onClose={() => setErZoomUrl(null)}
        maxWidth="xl"
        fullWidth
      >
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 1.5,
            bgcolor: "#0f172a",
            color: "#ffffff",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {subtopic.subtopicNumber} {subtopic.title} — Entity-Relationship (ER) Blueprint
          </Typography>
          <IconButton
            onClick={() => setErZoomUrl(null)}
            sx={{ color: "#ffffff" }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        <DialogContent sx={{ bgcolor: "#ffffff", p: { xs: 1.5, sm: 3 } }}>
          {erZoomUrl && (
            <Box
              component="img"
              src={erZoomUrl}
              alt={`${subtopic.subtopicNumber} ${subtopic.title}`}
              sx={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Link Copied Toast Notification */}
      <Snackbar
        open={copiedLink}
        autoHideDuration={2200}
        onClose={() => setCopiedLink(false)}
        message="Article link copied to clipboard!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
