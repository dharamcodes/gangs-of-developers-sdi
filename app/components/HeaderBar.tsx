"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import CloseIcon from "@mui/icons-material/Close";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import ArticleIcon from "@mui/icons-material/Article";
import GodLogoMark from "./GodLogoMark";
import type { HandbookUiConfig, SubtopicSummary } from "../types/handbook";

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

export interface HeaderBarProps {
  ui?: HandbookUiConfig;
  mode: "light" | "dark";
  currentNav?: "home" | "company-wise" | "author";
  activeSubtopic?: SubtopicSummary;
  activeIndex?: number;
  totalSubtopics?: number;
  desktopSidebarOpen?: boolean;
  isFullWidth?: boolean;
  fontScale?: "normal" | "large" | "xlarge";
  onToggleMobileMenu?: () => void;
  onToggleDesktopSidebar?: () => void;
  onToggleFullWidth?: () => void;
  onCycleFontScale?: () => void;
  onToggleThemeMode: () => void;
}

export default function HeaderBar({
  ui = DEFAULT_UI,
  mode,
  currentNav,
  activeSubtopic,
  activeIndex = 0,
  totalSubtopics = 0,
  desktopSidebarOpen,
  isFullWidth,
  fontScale = "normal",
  onToggleMobileMenu,
  onToggleDesktopSidebar,
  onToggleFullWidth,
  onCycleFontScale,
  onToggleThemeMode,
}: HeaderBarProps) {
  const pathname = usePathname();
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  // Determine active nav item
  const resolvedNav =
    currentNav ??
    (pathname === "/author"
      ? "author"
      : pathname === "/company-wise-problems"
      ? "company-wise"
      : "home");

  const progressValue =
    totalSubtopics > 0 ? ((activeIndex + 1) / totalSubtopics) * 100 : 0;

  const navItems = [
    {
      id: "home",
      label: "Home",
      href: "/",
      icon: <HomeRoundedIcon sx={{ fontSize: 18 }} />,
      badge: "Handbook",
    },
    {
      id: "company-wise",
      label: "Company-wise Problems",
      href: "/company-wise-problems",
      icon: <BusinessRoundedIcon sx={{ fontSize: 18 }} />,
      badge: "FAANG",
    },
    {
      id: "author",
      label: "Author",
      href: "/author",
      icon: (
        <Avatar
          src="/author.jpg"
          alt="Dharam"
          sx={{ width: 20, height: 20, border: "1px solid #f59e0b" }}
        />
      ),
      badge: "Staff Engineer",
    },
  ];

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        bgcolor:
          mode === "light"
            ? "rgba(255, 255, 255, 0.92)"
            : "rgba(15, 23, 42, 0.92)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        zIndex: (t) => t.zIndex.drawer + 2,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          gap: { xs: 0.5, sm: 1.5 },
          minHeight: { xs: 58, sm: 66 },
          px: { xs: 1.5, sm: 2.5, md: 3 },
        }}
      >
        {/* Left Side: Drawer Toggle (on Reader) + Brand Logo */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", minWidth: 0 }}
        >
          {/* Reader Mobile TOC Drawer Trigger */}
          {onToggleMobileMenu && (
            <Tooltip title="Table of Contents">
              <IconButton
                color="inherit"
                edge="start"
                onClick={onToggleMobileMenu}
                sx={{
                  display: { xs: "inline-flex", md: "none" },
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  p: 0.75,
                }}
              >
                <MenuIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* Reader Desktop Sidebar Collapse/Expand Trigger */}
          {onToggleDesktopSidebar && (
            <Tooltip
              title={
                desktopSidebarOpen
                  ? ui.collapseAllTooltip
                  : ui.expandAllTooltip
              }
            >
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
          )}

          <GodLogoMark ui={ui} />
        </Stack>

        {/* Center / Navigation Links (Desktop & Tablet) */}
        <Box
          component="nav"
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 0.75,
            bgcolor:
              mode === "light"
                ? "rgba(241, 245, 249, 0.75)"
                : "rgba(30, 41, 59, 0.65)",
            p: 0.5,
            borderRadius: 2,
            border: "1px solid",
            borderColor:
              mode === "light"
                ? "rgba(226, 232, 240, 0.8)"
                : "rgba(51, 65, 85, 0.7)",
          }}
        >
          {navItems.map((item) => {
            const isActive = resolvedNav === item.id;
            return (
              <Button
                key={item.id}
                component={Link}
                href={item.href}
                size="small"
                startIcon={item.icon}
                sx={{
                  textTransform: "none",
                  fontWeight: isActive ? 750 : 600,
                  fontSize: "0.85rem",
                  px: 1.5,
                  py: 0.65,
                  borderRadius: 1.5,
                  color: isActive
                    ? "primary.main"
                    : mode === "light"
                    ? "#334155"
                    : "#cbd5e1",
                  bgcolor: isActive
                    ? mode === "light"
                      ? "#ffffff"
                      : "rgba(245, 158, 11, 0.12)"
                    : "transparent",
                  boxShadow:
                    isActive && mode === "light"
                      ? "0 1px 3px rgba(0,0,0,0.08)"
                      : "none",
                  border: isActive
                    ? "1px solid"
                    : "1px solid transparent",
                  borderColor: isActive
                    ? mode === "light"
                      ? "rgba(180, 83, 9, 0.25)"
                      : "rgba(245, 158, 11, 0.3)"
                    : "transparent",
                  "&:hover": {
                    bgcolor:
                      mode === "light"
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(255, 255, 255, 0.08)",
                    color: "primary.main",
                  },
                  transition: "all 0.15s ease",
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>

        {/* Right Side Controls */}
        <Stack
          direction="row"
          spacing={{ xs: 0.5, sm: 1 }}
          sx={{ alignItems: "center", flexShrink: 0 }}
        >
          {/* Active Subtopic Chapter Chip (Reader Mode on Large Screens) */}
          {activeSubtopic && (
            <Chip
              icon={<BookmarkBorderIcon />}
              label={`${activeSubtopic.topicTitle} • ${activeSubtopic.subtopicNumber} (${
                activeIndex + 1
              }/${totalSubtopics})`}
              size="small"
              variant="outlined"
              sx={{
                display: { xs: "none", xl: "inline-flex" },
                fontWeight: 600,
                borderRadius: 1.5,
                bgcolor:
                  mode === "light"
                    ? "rgba(248, 250, 252, 0.9)"
                    : "rgba(30, 41, 59, 0.6)",
              }}
            />
          )}

          {/* Reader: Font Size Button */}
          {onCycleFontScale && (
            <Tooltip title={`Text Scale: ${fontScale.toUpperCase()}`}>
              <IconButton
                onClick={onCycleFontScale}
                color={fontScale !== "normal" ? "primary" : "inherit"}
                size="small"
                sx={{
                  border: "1px solid",
                  borderColor:
                    fontScale !== "normal" ? "primary.main" : "divider",
                  borderRadius: 1.5,
                  p: 0.75,
                }}
              >
                <FormatSizeIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* Reader: Page Width Toggle */}
          {onToggleFullWidth && (
            <Tooltip
              title={isFullWidth ? "Readable Width" : "Full Page Width"}
            >
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
          )}

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

          {/* Mobile Main Navigation Menu Button */}
          <Tooltip title="Menu Navigation">
            <IconButton
              onClick={() => setNavDrawerOpen(true)}
              color="inherit"
              size="small"
              sx={{
                display: { xs: "inline-flex", md: "none" },
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.5,
                p: 0.75,
              }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>

      {/* Curriculum Progress Indicator (only on reader view when subtopics exist) */}
      {totalSubtopics > 0 && activeSubtopic && (
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
      )}

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={navDrawerOpen}
        onClose={() => setNavDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 290,
              p: 2.5,
              bgcolor: mode === "light" ? "#fbfaf8" : "#0f172a",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2.5,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Navigation
          </Typography>
          <IconButton size="small" onClick={() => setNavDrawerOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <List sx={{ pt: 0 }}>
          {navItems.map((item) => {
            const isActive = resolvedNav === item.id;
            return (
              <ListItemButton
                key={item.id}
                component={Link}
                href={item.href}
                onClick={() => setNavDrawerOpen(false)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  py: 1.25,
                  bgcolor: isActive
                    ? mode === "light"
                      ? "rgba(180, 83, 9, 0.12)"
                      : "rgba(245, 158, 11, 0.15)"
                    : "transparent",
                  color: isActive ? "primary.main" : "text.primary",
                  border: isActive
                    ? "1px solid"
                    : "1px solid transparent",
                  borderColor: "primary.main",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive ? "primary.main" : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  secondary={item.badge}
                  slotProps={{
                    primary: {
                      sx: {
                        fontWeight: isActive ? 750 : 600,
                        fontSize: "0.95rem",
                      },
                    },
                    secondary: {
                      sx: {
                        fontSize: "0.72rem",
                      },
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Contact Author Links in Mobile Drawer */}
        <Box sx={{ mt: "auto" }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 750,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "text.secondary",
              display: "block",
              mb: 1.5,
            }}
          >
            Author Contacts
          </Typography>
          <Stack spacing={1}>
            <Button
              component="a"
              href="mailto:dharamcodes@gmail.com"
              startIcon={<EmailIcon sx={{ fontSize: 18 }} />}
              size="small"
              variant="outlined"
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                fontSize: "0.82rem",
                borderRadius: 1.5,
              }}
            >
              dharamcodes@gmail.com
            </Button>
            <Button
              component="a"
              href="https://linkedin.com/in/dharamcodes"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<LinkedInIcon sx={{ fontSize: 18 }} />}
              size="small"
              variant="outlined"
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                fontSize: "0.82rem",
                borderRadius: 1.5,
              }}
            >
              linkedin.com/in/dharamcodes
            </Button>
            <Button
              component="a"
              href="https://medium.com/@dharamcodes"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<ArticleIcon sx={{ fontSize: 18 }} />}
              size="small"
              variant="outlined"
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                fontSize: "0.82rem",
                borderRadius: 1.5,
              }}
            >
              medium.com/@dharamcodes
            </Button>
            <Button
              component="a"
              href="https://github.com/dharamcodes"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<GitHubIcon sx={{ fontSize: 18 }} />}
              size="small"
              variant="outlined"
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                fontSize: "0.82rem",
                borderRadius: 1.5,
              }}
            >
              github.com/dharamcodes
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </AppBar>
  );
}
