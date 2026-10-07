"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
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
import CloseIcon from "@mui/icons-material/Close";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
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
  currentNav?:
    | "home"
    | "system-design"
    | "company-wise"
    | "author"
    | "microservices"
    | "design-patterns";
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
  onToggleThemeMode,
}: HeaderBarProps) {
  const pathname = usePathname();
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  // Determine active nav item automatically from URL path or override prop
  const resolvedNav =
    currentNav ??
    (pathname === "/author"
      ? "author"
      : pathname === "/company-wise-problems"
      ? "company-wise"
      : pathname.startsWith("/microservices")
      ? "microservices"
      : pathname.startsWith("/design-patterns") || pathname.startsWith("/gof-design-patterns")
      ? "design-patterns"
      : pathname === "/free-course" || pathname.startsWith("/system-design")
      ? "system-design"
      : pathname === "/"
      ? "home"
      : "home");

  const isLight = mode === "light";

  const navItems = [
    {
      id: "home",
      label: "Home",
      href: "/",
      icon: <HomeRoundedIcon sx={{ fontSize: 18 }} />,
      badge: "Platform",
    },
    {
      id: "system-design",
      label: "System Design",
      href: "/free-course",
      icon: <MenuBookRoundedIcon sx={{ fontSize: 18 }} />,
      badge: "Handbook",
    },
    {
      id: "microservices",
      label: "Microservices",
      href: "/microservices",
      icon: <AccountTreeRoundedIcon sx={{ fontSize: 18 }} />,
      badge: "Architecture",
    },
    {
      id: "design-patterns",
      label: "Design Patterns",
      href: "/design-patterns",
      icon: <WidgetsRoundedIcon sx={{ fontSize: 18 }} />,
      badge: "GoF 23",
    },
    {
      id: "company-wise",
      label: "FAANG Problems",
      href: "/company-wise-problems",
      icon: <BusinessRoundedIcon sx={{ fontSize: 18 }} />,
      badge: "Interviews",
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
      badge: "Architect",
    },
  ];

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        bgcolor: isLight ? "rgba(255, 255, 255, 0.92)" : "rgba(15, 23, 42, 0.92)",
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
        {/* Left Side: Brand Logo (Always uniform and clean) */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", minWidth: 0 }}
        >
          <GodLogoMark ui={ui} />
        </Stack>

        {/* Center: Universal Navigation Links (Desktop & Tablet) */}
        <Box
          component="nav"
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 0.75,
            bgcolor: isLight
              ? "rgba(241, 245, 249, 0.75)"
              : "rgba(30, 41, 59, 0.65)",
            p: 0.5,
            borderRadius: 2.5,
            border: "1px solid",
            borderColor: isLight
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
                  borderRadius: 1.75,
                  color: isActive
                    ? "primary.main"
                    : isLight
                    ? "#334155"
                    : "#cbd5e1",
                  bgcolor: isActive
                    ? isLight
                      ? "#ffffff"
                      : "rgba(245, 158, 11, 0.12)"
                    : "transparent",
                  boxShadow:
                    isActive && isLight
                      ? "0 1px 3px rgba(0,0,0,0.08)"
                      : "none",
                  border: isActive ? "1px solid" : "1px solid transparent",
                  borderColor: isActive
                    ? isLight
                      ? "rgba(180, 83, 9, 0.25)"
                      : "rgba(245, 158, 11, 0.3)"
                    : "transparent",
                  "&:hover": {
                    bgcolor: isLight
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

        {/* Right Side: Theme Toggle & Single Mobile Menu Button */}
        <Stack
          direction="row"
          spacing={{ xs: 0.5, sm: 1 }}
          sx={{ alignItems: "center", flexShrink: 0 }}
        >
          {/* Light / Dark Mode Toggle */}
          <Tooltip
            title={isLight ? ui.darkModeTooltip : ui.lightModeTooltip}
          >
            <IconButton
              onClick={onToggleThemeMode}
              color="inherit"
              size="small"
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.75,
                p: 0.75,
              }}
            >
              {isLight ? (
                <DarkModeOutlinedIcon fontSize="small" />
              ) : (
                <LightModeOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          {/* Single Mobile Navigation Menu Button */}
          <Tooltip title="Site Menu">
            <IconButton
              onClick={() => setNavDrawerOpen(true)}
              color="inherit"
              size="small"
              sx={{
                display: { xs: "inline-flex", md: "none" },
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.75,
                p: 0.75,
              }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>

      {/* Universal Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={navDrawerOpen}
        onClose={() => setNavDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 290,
              p: 2.5,
              bgcolor: isLight ? "#fbfaf8" : "#0f172a",
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
          <Typography variant="subtitle1" sx={{ fontWeight: 850 }}>
            Site Navigation
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
                    ? isLight
                      ? "rgba(180, 83, 9, 0.12)"
                      : "rgba(245, 158, 11, 0.15)"
                    : "transparent",
                  color: isActive ? "primary.main" : "text.primary",
                  border: isActive ? "1px solid" : "1px solid transparent",
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
                        fontSize: "0.92rem",
                        fontWeight: isActive ? 800 : 600,
                      },
                    },
                    secondary: {
                      sx: {
                        fontSize: "0.72rem",
                        fontWeight: 500,
                      },
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Footer Contact & Community inside drawer */}
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
          Connect &amp; Community
        </Typography>

        <Stack spacing={1}>
          <Box
            component="a"
            href="https://www.linkedin.com/in/dharamcodes/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.25,
              fontSize: "0.85rem",
              fontWeight: 650,
              color: "text.primary",
              textDecoration: "none",
              p: 0.75,
              borderRadius: 1.5,
              "&:hover": { bgcolor: "rgba(245, 158, 11, 0.08)", color: "primary.main" },
            }}
          >
            <LinkedInIcon sx={{ fontSize: 18, color: "#0077b5" }} />
            LinkedIn / in/dharamcodes
          </Box>
          <Box
            component="a"
            href="https://medium.com/@dharamcodes"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.25,
              fontSize: "0.85rem",
              fontWeight: 650,
              color: "text.primary",
              textDecoration: "none",
              p: 0.75,
              borderRadius: 1.5,
              "&:hover": { bgcolor: "rgba(245, 158, 11, 0.08)", color: "primary.main" },
            }}
          >
            <ArticleIcon sx={{ fontSize: 18, color: "#f59e0b" }} />
            Medium / @dharamcodes
          </Box>
          <Box
            component="a"
            href="https://github.com/dharamcodes"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.25,
              fontSize: "0.85rem",
              fontWeight: 650,
              color: "text.primary",
              textDecoration: "none",
              p: 0.75,
              borderRadius: 1.5,
              "&:hover": { bgcolor: "rgba(245, 158, 11, 0.08)", color: "primary.main" },
            }}
          >
            <GitHubIcon sx={{ fontSize: 18 }} />
            GitHub / dharamcodes
          </Box>
          <Box
            component="a"
            href="mailto:dharamcodes@gmail.com"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.25,
              fontSize: "0.85rem",
              fontWeight: 650,
              color: "text.primary",
              textDecoration: "none",
              p: 0.75,
              borderRadius: 1.5,
              "&:hover": { bgcolor: "rgba(245, 158, 11, 0.08)", color: "primary.main" },
            }}
          >
            <EmailIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            dharamcodes@gmail.com
          </Box>
        </Stack>
      </Drawer>
    </AppBar>
  );
}
