"use client";

import React from "react";
import Link from "next/link";
import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import type { HandbookUiConfig } from "../types/handbook";

interface GodLogoMarkProps {
  ui?: HandbookUiConfig;
}

const DEFAULT_UI: HandbookUiConfig = {
  badgeText: "GOD",
  brandTitle: "Gangs of Developers",
  brandSubtitle: "System Design Handbook",
  tocHeading: "Handbook Index",
  searchPlaceholder: "Search 130 topics & subtopics...",
  noResultsText: "No topics match your search query.",
  expandAllTooltip: "Expand all topics",
  collapseAllTooltip: "Collapse all topics",
  lightModeTooltip: "Switch to Book Paper Mode",
  darkModeTooltip: "Switch to Dark Mode",
  keyTakeawaysHeading: "Key Takeaways",
  visualDiagramHeading: "System Architecture Diagram",
  asciiDiagramTabLabel: "ASCII Blueprint View",
  visualDiagramTabLabel: "Visual Diagram",
  tradeOffMatrixHeading: "Architectural Trade-Off Matrix",
  tradeOffHeaders: {
    option: "Approach / Option",
    pros: "Pros",
    cons: "Cons",
    bestFor: "Best Suited For",
  },
  interviewTipHeading: "GOD System Design Interview Pro-Tip",
  previousLabel: "Previous",
  nextLabel: "Next",
  partPrefix: "Part",
  sectionPrefix: "Section",
  subtopicsBarSuffix: "Subtopics",
  footerStatsTemplate: "13 Topics • 130 Subtopics",
};

export default function GodLogoMark({ ui = DEFAULT_UI }: GodLogoMarkProps) {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";
  const activeUi = ui || DEFAULT_UI;

  // Render clean brand name without repetitive suffixes
  const brandTitle =
    activeUi.brandTitle &&
    activeUi.brandTitle.includes("Gangs of Developers")
      ? "Gangs of Developers"
      : activeUi.brandTitle || "Gangs of Developers";

  const badgeText = activeUi.badgeText || "GOD";

  return (
    <Link
      href="/"
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          userSelect: "none",
          cursor: "pointer",
          py: 0.5,
          "&:hover .god-mark-icon": {
            transform: "translateY(-1px) scale(1.04)",
            boxShadow: isLight
              ? "0 6px 18px rgba(245, 158, 11, 0.35)"
              : "0 8px 24px rgba(245, 158, 11, 0.45)",
          },
        }}
      >
        {/* Geometric System Architecture Icon Mark */}
        <Box
          className="god-mark-icon"
          sx={{
            width: { xs: 36, sm: 40 },
            height: { xs: 36, sm: 40 },
            borderRadius: "10px",
            background: isLight
              ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
              : "linear-gradient(135deg, #1e293b 0%, #090d16 100%)",
            border: "1.5px solid",
            borderColor: isLight
              ? "rgba(245, 158, 11, 0.45)"
              : "rgba(245, 158, 11, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isLight
              ? "0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.2)"
              : "0 4px 14px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
            flexShrink: 0,
            position: "relative",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Distributed Cluster Isometric Mesh */}
            <path
              d="M16 4L26 9.8V21.4L16 27.2L6 21.4V9.8L16 4Z"
              fill="rgba(245, 158, 11, 0.1)"
              stroke="#f59e0b"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Coordinate Axis / Consensus Links */}
            <path
              d="M16 15.6V4M16 15.6L26 21.4M16 15.6L6 21.4"
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            {/* Node Points */}
            <circle cx="16" cy="4" r="2" fill="#fbbf24" />
            <circle cx="26" cy="9.8" r="2" fill="#38bdf8" />
            <circle cx="26" cy="21.4" r="2" fill="#38bdf8" />
            <circle cx="16" cy="27.2" r="2" fill="#fbbf24" />
            <circle cx="6" cy="21.4" r="2" fill="#f59e0b" />
            <circle cx="6" cy="9.8" r="2" fill="#f59e0b" />
            {/* Central Orchestration Nexus */}
            <circle cx="16" cy="15.6" r="3" fill="#ffffff" />
            <circle cx="16" cy="15.6" r="1.5" fill="#f59e0b" />
          </svg>
        </Box>

        {/* Brand Wordmark & Tagline */}
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
            <Typography
              component="span"
              sx={{
                fontWeight: 850,
                fontSize: { xs: "0.95rem", sm: "1.06rem" },
                letterSpacing: "-0.025em",
                color: "text.primary",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              {brandTitle}
            </Typography>

            <Chip
              label={badgeText}
              size="small"
              sx={{
                height: 18,
                fontSize: "0.64rem",
                fontWeight: 800,
                letterSpacing: "0.06em",
                bgcolor: isLight
                  ? "rgba(245, 158, 11, 0.12)"
                  : "rgba(245, 158, 11, 0.2)",
                color: isLight ? "#b45309" : "#fbbf24",
                border: "1px solid",
                borderColor: isLight
                  ? "rgba(245, 158, 11, 0.3)"
                  : "rgba(245, 158, 11, 0.4)",
                borderRadius: 1,
                px: 0.2,
              }}
            />
          </Stack>

          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.68rem", sm: "0.72rem" },
              fontWeight: 650,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              lineHeight: 1.15,
              mt: "1px",
              display: { xs: "none", sm: "block" },
            }}
          >
            System Design Handbook
          </Typography>
        </Box>
      </Box>
    </Link>
  );
}
