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
        {/* Geometric System Architecture Icon Mark - 3D Isometric Architecture Cube Triad */}
        <Box
          className="god-mark-icon"
          sx={{
            width: { xs: 36, sm: 40 },
            height: { xs: 36, sm: 40 },
            borderRadius: "11px",
            background: isLight
              ? "linear-gradient(135deg, #1e293b 0%, #0a0f1d 100%)"
              : "linear-gradient(135deg, #1e293b 0%, #060911 100%)",
            border: "1.5px solid",
            borderColor: isLight
              ? "rgba(180, 83, 9, 0.4)"
              : "rgba(245, 158, 11, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isLight
              ? "0 4px 12px rgba(180, 83, 9, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.2)"
              : "0 4px 16px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
            flexShrink: 0,
            position: "relative",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="headerTopFacet"
                x1="13"
                y1="18"
                x2="51"
                y2="18"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="35%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>

              <linearGradient
                id="headerLeftFacet"
                x1="13"
                y1="18"
                x2="32"
                y2="53"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#034d75" />
              </linearGradient>

              <linearGradient
                id="headerRightFacet"
                x1="51"
                y1="18"
                x2="32"
                y2="53"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>

              <radialGradient
                id="headerNexusGlow"
                cx="50%"
                cy="50%"
                r="50%"
              >
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </radialGradient>
            </defs>

            {/* 3D Isometric Architecture Cube Monolith */}
            {/* Left Facet: Storage Engine */}
            <path
              d="M13 18L32 29V53L13 42V18Z"
              fill="url(#headerLeftFacet)"
              stroke="#080c16"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />

            {/* Right Facet: Network & Messaging */}
            <path
              d="M32 29L51 18V42L32 53V29Z"
              fill="url(#headerRightFacet)"
              stroke="#080c16"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />

            {/* Top Facet: Compute & Ingress Gateway */}
            <path
              d="M32 7L51 18L32 29L13 18L32 7Z"
              fill="url(#headerTopFacet)"
              stroke="#080c16"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />

            {/* High-Tech Circuit Bus Lines connecting to Center Core */}
            <path
              d="M22.5 23.5L32 29"
              stroke="#ffffff"
              strokeOpacity="0.9"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M41.5 23.5L32 29"
              stroke="#ffffff"
              strokeOpacity="0.9"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M32 29V42"
              stroke="#ffffff"
              strokeOpacity="0.9"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Central Orchestration Nexus (Raft / Master Node) */}
            <circle
              cx="32"
              cy="29"
              r="6"
              fill="#f59e0b"
              fillOpacity="0.25"
            />
            <circle
              cx="32"
              cy="29"
              r="4.2"
              fill="url(#headerNexusGlow)"
            />
            <circle
              cx="32"
              cy="29"
              r="1.8"
              fill="#ffffff"
            />

            {/* Peripheral Vertex Gateway Nodes */}
            <circle
              cx="32"
              cy="7"
              r="2.8"
              fill="#fde047"
              stroke="#080c16"
              strokeWidth="1.2"
            />
            <circle
              cx="51"
              cy="18"
              r="2.8"
              fill="#f59e0b"
              stroke="#080c16"
              strokeWidth="1.2"
            />
            <circle
              cx="13"
              cy="18"
              r="2.8"
              fill="#38bdf8"
              stroke="#080c16"
              strokeWidth="1.2"
            />
            <circle
              cx="32"
              cy="53"
              r="2.8"
              fill="#fbbf24"
              stroke="#080c16"
              strokeWidth="1.2"
            />
            <circle
              cx="13"
              cy="42"
              r="2.2"
              fill="#0284c7"
              stroke="#080c16"
              strokeWidth="1"
            />
            <circle
              cx="51"
              cy="42"
              r="2.2"
              fill="#d97706"
              stroke="#080c16"
              strokeWidth="1"
            />
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
