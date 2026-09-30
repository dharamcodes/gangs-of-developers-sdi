"use client";

import React from "react";
import {
  AppBar,
  Box,
  Chip,
  IconButton,
  LinearProgress,
  Stack,
  Toolbar,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import GodLogoMark from "./GodLogoMark";
import type { HandbookUiConfig, SubtopicSummary } from "../types/handbook";

interface HeaderBarProps {
  ui: HandbookUiConfig;
  mode: "light" | "dark";
  activeSubtopic: SubtopicSummary;
  activeIndex: number;
  totalSubtopics: number;
  desktopSidebarOpen: boolean;
  isFullWidth: boolean;
  fontScale: "normal" | "large" | "xlarge";
  onToggleMobileMenu: () => void;
  onToggleDesktopSidebar: () => void;
  onToggleFullWidth: () => void;
  onCycleFontScale: () => void;
  onToggleThemeMode: () => void;
}

export default function HeaderBar({
  ui,
  mode,
  activeSubtopic,
  activeIndex,
  totalSubtopics,
  desktopSidebarOpen,
  isFullWidth,
  fontScale,
  onToggleMobileMenu,
  onToggleDesktopSidebar,
  onToggleFullWidth,
  onCycleFontScale,
  onToggleThemeMode,
}: HeaderBarProps) {
  const progressValue =
    totalSubtopics > 0 ? ((activeIndex + 1) / totalSubtopics) * 100 : 0;

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        bgcolor:
          mode === "light"
            ? "rgba(255, 255, 255, 0.88)"
            : "rgba(15, 23, 42, 0.88)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        zIndex: (t) => t.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          gap: { xs: 0.5, sm: 1.5 },
          minHeight: { xs: 58, sm: 64 },
          px: { xs: 1.5, sm: 2.5, md: 3 },
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0 }}>
          {/* Mobile Drawer Trigger */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={onToggleMobileMenu}
            sx={{ display: { xs: "inline-flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop Sidebar Collapse/Expand Trigger */}
          <Tooltip title={desktopSidebarOpen ? ui.collapseAllTooltip : ui.expandAllTooltip}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={onToggleDesktopSidebar}
              sx={{
                display: { xs: "none", md: "inline-flex" },
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.5,
                p: 0.75,
                mr: 0.5,
              }}
            >
              {desktopSidebarOpen ? (
                <MenuOpenIcon fontSize="small" />
              ) : (
                <MenuIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          <GodLogoMark ui={ui} />
        </Stack>

        <Stack
          direction="row"
          spacing={{ xs: 0.5, sm: 1 }}
          sx={{ alignItems: "center", flexShrink: 0 }}
        >
          <Chip
            icon={<BookmarkBorderIcon />}
            label={`${activeSubtopic.topicTitle} • ${activeSubtopic.subtopicNumber} (${activeIndex + 1}/${totalSubtopics})`}
            size="small"
            variant="outlined"
            sx={{
              display: { xs: "none", lg: "inline-flex" },
              fontWeight: 600,
              borderRadius: 1.5,
              bgcolor:
                mode === "light"
                  ? "rgba(248, 250, 252, 0.9)"
                  : "rgba(30, 41, 59, 0.6)",
            }}
          />

          {/* Font Size / Readability Scale Button */}
          <Tooltip title={`Text Scale: ${fontScale.toUpperCase()}`}>
            <IconButton
              onClick={onCycleFontScale}
              color={fontScale !== "normal" ? "primary" : "inherit"}
              size="small"
              sx={{
                border: "1px solid",
                borderColor: fontScale !== "normal" ? "primary.main" : "divider",
                borderRadius: 1.5,
                p: 0.75,
              }}
            >
              <FormatSizeIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Page Width Toggle (Readable Book Width vs Full-Bleed Page) */}
          <Tooltip title={isFullWidth ? "Readable Width" : "Full Page Width"}>
            <IconButton
              onClick={onToggleFullWidth}
              color={isFullWidth ? "primary" : "inherit"}
              size="small"
              sx={{
                display: { xs: "none", md: "inline-flex" },
                border: "1px solid",
                borderColor: isFullWidth ? "primary.main" : "divider",
                borderRadius: 1.5,
                p: 0.75,
              }}
            >
              {isFullWidth ? (
                <CloseFullscreenIcon fontSize="small" />
              ) : (
                <OpenInFullIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          {/* Light / Dark Mode Toggle */}
          <Tooltip
            title={mode === "light" ? ui.darkModeTooltip : ui.lightModeTooltip}
          >
            <IconButton
              onClick={onToggleThemeMode}
              color="inherit"
              size="small"
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.5,
                p: 0.75,
              }}
            >
              {mode === "light" ? (
                <DarkModeOutlinedIcon fontSize="small" />
              ) : (
                <LightModeOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>

      {/* Subtle Curriculum Progress Indicator */}
      <Box sx={{ width: "100%" }}>
        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{
            height: 2.5,
            bgcolor: "transparent",
            "& .MuiLinearProgress-bar": {
              background:
                "linear-gradient(90deg, #f59e0b 0%, #d97706 50%, #0284c7 100%)",
            },
          }}
        />
      </Box>
    </AppBar>
  );
}
