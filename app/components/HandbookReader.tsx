"use client";

import React, { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import HeaderBar from "./HeaderBar";
import SidebarToc from "./SidebarToc";
import SubtopicQuickBar from "./SubtopicQuickBar";
import SubtopicContentView from "./SubtopicContentView";
import {
  fetchHandbookIndex,
  fetchSubtopicData,
  fetchTopicData,
} from "../services/handbookApi";
import type {
  HandbookIndexResponse,
  SubtopicDetail,
  SubtopicSummary,
  TopicIndexItem,
} from "../types/handbook";

const SIDEBAR_WIDTH = 340;
const THEME_STORAGE_KEY = "god_handbook_theme_mode";
const FONT_SCALE_STORAGE_KEY = "god_handbook_font_scale";
const FULL_WIDTH_STORAGE_KEY = "god_handbook_full_width";
const SIDEBAR_OPEN_STORAGE_KEY = "god_handbook_sidebar_open";
const LAST_SUBTOPIC_STORAGE_KEY = "god_handbook_last_subtopic";

const storageListeners = new Set<() => void>();

function subscribeStorage(callback: () => void) {
  storageListeners.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
  }
  return () => {
    storageListeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
    }
  };
}

function notifyStorage() {
  storageListeners.forEach((cb) => cb());
}

function getThemeSnapshot(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

function getFontScaleSnapshot(): "normal" | "large" | "xlarge" {
  if (typeof window === "undefined") return "normal";
  try {
    const saved = localStorage.getItem(FONT_SCALE_STORAGE_KEY);
    if (saved === "normal" || saved === "large" || saved === "xlarge")
      return saved;
    return "normal";
  } catch {
    return "normal";
  }
}

function getFullWidthSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(FULL_WIDTH_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function getDesktopSidebarSnapshot(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const saved = localStorage.getItem(SIDEBAR_OPEN_STORAGE_KEY);
    return saved !== null ? saved === "true" : true;
  } catch {
    return true;
  }
}

const getServerTheme = () => "light" as const;
const getServerFontScale = () => "normal" as const;
const getServerFullWidth = () => false;
const getServerDesktopSidebar = () => true;

export default function HandbookReader() {
  const mode = useSyncExternalStore(
    subscribeStorage,
    getThemeSnapshot,
    getServerTheme
  );
  const fontScale = useSyncExternalStore(
    subscribeStorage,
    getFontScaleSnapshot,
    getServerFontScale
  );
  const isFullWidth = useSyncExternalStore(
    subscribeStorage,
    getFullWidthSnapshot,
    getServerFullWidth
  );
  const desktopSidebarOpen = useSyncExternalStore(
    subscribeStorage,
    getDesktopSidebarSnapshot,
    getServerDesktopSidebar
  );
  const [indexData, setIndexData] = useState<HandbookIndexResponse | null>(
    null
  );
  const [activeSubtopicDetail, setActiveSubtopicDetail] =
    useState<SubtopicDetail | null>(null);
  const [loadingSubtopic, setLoadingSubtopic] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(
    {}
  );
  const [activeSectionId, setActiveSectionId] = useState<string>("section-0");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: { main: "#b45309" },
                secondary: { main: "#0284c7" },
                background: {
                  default: "#f4f1ea",
                  paper: "#ffffff",
                },
                text: {
                  primary: "#0f172a",
                  secondary: "#475569",
                },
              }
            : {
                primary: { main: "#f59e0b" },
                secondary: { main: "#38bdf8" },
                background: {
                  default: "#070b14",
                  paper: "#0f172a",
                },
                text: {
                  primary: "#f8fafc",
                  secondary: "#94a3b8",
                },
              }),
        },
        typography: {
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        shape: {
          borderRadius: 10,
        },
      }),
    [mode]
  );

  // Load master index.json and resolve active subtopic (URL params -> localStorage -> first subtopic)
  useEffect(() => {
    let active = true;
    async function init() {
      const idx = await fetchHandbookIndex();
      if (!active) return;
      setIndexData(idx);
      setExpandedTopics(
        Object.fromEntries(idx.topics.map((t) => [t.id, true]))
      );

      // Check URL parameters first: ?topic=...&subtopic=...
      let initialTopicId: string | null = null;
      let initialSubtopicId: string | null = null;

      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        initialTopicId = params.get("topic");
        initialSubtopicId = params.get("subtopic");

        // If not in query, check hash e.g. #subtopic-id
        if (!initialSubtopicId && window.location.hash) {
          const cleanHash = window.location.hash.replace(/^#/, "");
          if (cleanHash) {
            initialSubtopicId = cleanHash;
          }
        }

        // If neither, check localStorage for last read chapter
        if (!initialSubtopicId) {
          try {
            const saved = localStorage.getItem(LAST_SUBTOPIC_STORAGE_KEY);
            if (saved) {
              const parsed = JSON.parse(saved);
              if (parsed?.subtopicId) {
                initialSubtopicId = parsed.subtopicId;
                initialTopicId = parsed.topicId;
              }
            }
          } catch {
            // Ignore parse errors
          }
        }
      }

      // Resolve topic & subtopic in index
      let targetTopic = initialTopicId
        ? idx.topics.find((t) => t.id === initialTopicId)
        : null;
      let targetSub = initialSubtopicId
        ? targetTopic?.subtopics.find((s) => s.id === initialSubtopicId) ||
          idx.topics.flatMap((t) => t.subtopics).find((s) => s.id === initialSubtopicId)
        : null;

      if (targetSub && !targetTopic) {
        targetTopic = idx.topics.find((t) => t.id === targetSub!.topicId) || null;
      }

      // Fallback to first chapter
      if (!targetTopic || !targetSub) {
        targetTopic = idx.topics[0];
        targetSub = targetTopic?.subtopics[0];
      }

      if (targetTopic && targetSub) {
        setLoadingSubtopic(true);
        const detail = await fetchSubtopicData(targetTopic.id, targetSub.id);
        if (active) {
          setActiveSubtopicDetail(detail);
          setLoadingSubtopic(false);
        }
        void fetchTopicData(targetTopic.id);
      }
    }
    void init();
    return () => {
      active = false;
    };
  }, []);

  const allSubtopicsFlat = useMemo<SubtopicSummary[]>(() => {
    if (!indexData) return [];
    return indexData.topics.flatMap((t) => t.subtopics);
  }, [indexData]);

  const filteredGroups = useMemo<TopicIndexItem[]>(() => {
    if (!indexData) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return indexData.topics;

    return indexData.topics
      .map((group) => {
        const topicMatches =
          group.title.toLowerCase().includes(q) ||
          group.description.toLowerCase().includes(q);
        const matchingSubtopics = group.subtopics.filter(
          (sub) =>
            topicMatches ||
            sub.title.toLowerCase().includes(q) ||
            sub.subtitle.toLowerCase().includes(q) ||
            sub.subtopicNumber.toLowerCase().includes(q)
        );
        return {
          ...group,
          subtopics: matchingSubtopics,
        };
      })
      .filter((group) => group.subtopics.length > 0);
  }, [indexData, searchQuery]);

  const activeIndex = useMemo(() => {
    if (!activeSubtopicDetail || allSubtopicsFlat.length === 0) return 0;
    const idx = allSubtopicsFlat.findIndex(
      (s) => s.id === activeSubtopicDetail.id
    );
    return idx >= 0 ? idx : 0;
  }, [activeSubtopicDetail, allSubtopicsFlat]);

  const activeTopicGroup = useMemo(() => {
    if (!indexData || !activeSubtopicDetail) return null;
    return (
      indexData.topics.find((g) => g.id === activeSubtopicDetail.topicId) ??
      indexData.topics[0] ??
      null
    );
  }, [indexData, activeSubtopicDetail]);

  const prevSubtopic =
    activeIndex > 0 ? allSubtopicsFlat[activeIndex - 1] : null;
  const nextSubtopic =
    activeIndex < allSubtopicsFlat.length - 1
      ? allSubtopicsFlat[activeIndex + 1]
      : null;

  // Background pre-fetch adjacent subtopics for zero-delay navigation
  useEffect(() => {
    if (!activeSubtopicDetail) return;
    if (nextSubtopic) {
      void fetchSubtopicData(nextSubtopic.topicId, nextSubtopic.id);
    }
    if (prevSubtopic) {
      void fetchSubtopicData(prevSubtopic.topicId, prevSubtopic.id);
    }
  }, [activeSubtopicDetail, nextSubtopic, prevSubtopic]);

  const requestSequenceRef = React.useRef<number>(0);

  const handleSelectSubtopic = React.useCallback(
    async (subtopicId: string, topicId: string) => {
      setExpandedTopics((prev) => ({ ...prev, [topicId]: true }));
      setMobileOpen(false);
      setLoadingSubtopic(true);

      // Persist chapter in localStorage and update URL search query
      try {
        localStorage.setItem(
          LAST_SUBTOPIC_STORAGE_KEY,
          JSON.stringify({ topicId, subtopicId })
        );
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.searchParams.set("topic", topicId);
          url.searchParams.set("subtopic", subtopicId);
          window.history.replaceState(null, "", url.toString());
        }
      } catch {
        // Ignore storage errors
      }

      const requestId = ++requestSequenceRef.current;
      try {
        const detail = await fetchSubtopicData(topicId, subtopicId);
        if (requestId === requestSequenceRef.current) {
          setActiveSubtopicDetail(detail);
        }
        void fetchTopicData(topicId);
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } finally {
        if (requestId === requestSequenceRef.current) {
          setLoadingSubtopic(false);
        }
      }
    },
    []
  );

  const handleToggleTopic = React.useCallback((topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  }, []);

  const handleExpandAll = React.useCallback(
    (expand: boolean) => {
      if (!indexData) return;
      setExpandedTopics(
        Object.fromEntries(indexData.topics.map((group) => [group.id, expand]))
      );
    },
    [indexData]
  );

  const handleToggleThemeMode = React.useCallback(() => {
    const current = getThemeSnapshot();
    const next = current === "light" ? "dark" : "light";
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", next);
        document.documentElement.style.colorScheme = next;
        document.documentElement.style.backgroundColor =
          next === "dark" ? "#070b14" : "#f4f1ea";
      }
      notifyStorage();
    } catch {}
  }, []);

  const handleScrollToSection = React.useCallback((elementId: string) => {
    if (typeof document !== "undefined") {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveSectionId(elementId);
      }
    }
  }, []);

  useEffect(() => {
    if (!activeSubtopicDetail || typeof window === "undefined") return;
    const sectionIds = [
      ...(activeSubtopicDetail.sections || []).map((_, idx) => `section-${idx}`),
      ...(activeSubtopicDetail.tradeOffs ? ["section-tradeoffs"] : []),
      "section-interview-tip",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -65% 0px",
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeSubtopicDetail]);

  if (!indexData || !activeSubtopicDetail) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      </ThemeProvider>
    );
  }

  const sidebarNode = (
    <SidebarToc
      ui={indexData.ui}
      mode={mode}
      filteredGroups={filteredGroups}
      activeSubtopic={activeSubtopicDetail}
      activeIndex={activeIndex}
      totalSubtopics={allSubtopicsFlat.length}
      searchQuery={searchQuery}
      expandedTopics={expandedTopics}
      onSearchChange={setSearchQuery}
      onToggleTopic={handleToggleTopic}
      onExpandAll={handleExpandAll}
      onSelectSubtopic={handleSelectSubtopic}
    />
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
        <HeaderBar
          ui={indexData.ui}
          mode={mode}
          currentNav="system-design"
          onToggleThemeMode={handleToggleThemeMode}
        />

        <Box sx={{ display: "flex", flex: 1 }}>
          {/* Mobile / Tablet Drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                width: { xs: "86vw", sm: SIDEBAR_WIDTH },
                maxWidth: SIDEBAR_WIDTH,
                boxSizing: "border-box",
              },
            }}
          >
            {sidebarNode}
          </Drawer>

          {/* Collapsible Desktop Left Sidebar */}
          {desktopSidebarOpen && (
            <Box
              component="nav"
              sx={{
                width: { md: SIDEBAR_WIDTH },
                flexShrink: { md: 0 },
                display: { xs: "none", md: "block" },
              }}
            >
              <Box
                sx={{
                  position: "sticky",
                  top: 67,
                  height: "calc(100vh - 67px)",
                }}
              >
                {sidebarNode}
              </Box>
            </Box>
          )}

          {/* Main Adaptive Right Reading Canvas */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: { xs: 2, sm: 3.5, md: 4.5 },
              px: { xs: 1.5, sm: 3, md: 4, lg: 5 },
              minWidth: 0,
              opacity: loadingSubtopic ? 0.6 : 1,
              transition: "opacity 0.15s ease",
            }}
          >
            <Box
              sx={{
                maxWidth: isFullWidth ? "100%" : 1440,
                mx: "auto",
                display: "flex",
                gap: 3.5,
                alignItems: "flex-start",
              }}
            >
              {/* Primary Book Page Column */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Mobile / Tablet Quick Navigation & TOC Drawer Trigger */}
                <Box
                  sx={{
                    display: { xs: "flex", md: "none" },
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                    p: 1.25,
                    px: 1.75,
                    borderRadius: 2,
                    bgcolor:
                      mode === "light"
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(30, 41, 59, 0.75)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<FormatListBulletedIcon />}
                    onClick={() => setMobileOpen(true)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 750,
                      fontSize: "0.82rem",
                      borderRadius: 1.5,
                      borderColor: "divider",
                      color: "text.primary",
                    }}
                  >
                    Table of Contents
                  </Button>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: "text.secondary" }}
                  >
                    {activeSubtopicDetail?.subtopicNumber} ({activeIndex + 1}/{allSubtopicsFlat.length})
                  </Typography>
                </Box>

                {activeTopicGroup && (
                  <SubtopicQuickBar
                    ui={indexData.ui}
                    mode={mode}
                    topicGroup={activeTopicGroup}
                    activeSubtopic={activeSubtopicDetail}
                    onSelectSubtopic={handleSelectSubtopic}
                  />
                )}

                <SubtopicContentView
                  ui={indexData.ui}
                  mode={mode}
                  fontScale={fontScale}
                  subtopic={activeSubtopicDetail}
                  prevSubtopic={prevSubtopic}
                  nextSubtopic={nextSubtopic}
                  onSelectSubtopic={handleSelectSubtopic}
                />
              </Box>

              {/* Sticky Right-Hand Section Outline on Wide Screens (when not Full-Width) */}
              {!isFullWidth && (
                <Box
                  component="aside"
                  sx={{
                    width: 240,
                    flexShrink: 0,
                    display: { xs: "none", xl: "block" },
                    position: "sticky",
                    top: 96,
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      bgcolor:
                        mode === "light"
                          ? "rgba(255, 255, 255, 0.78)"
                          : "rgba(15, 23, 42, 0.78)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <FormatListBulletedIcon
                        sx={{ fontSize: 16, color: "primary.main" }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: "text.secondary",
                        }}
                      >
                        {indexData.ui.sectionPrefix} {activeSubtopicDetail.subtopicNumber}
                      </Typography>
                    </Box>
                    <List dense disablePadding>
                      {(activeSubtopicDetail.sections || []).map((sec, sIdx) => {
                        const secId = `section-${sIdx}`;
                        const isCurrent = activeSectionId === secId;
                        return (
                          <ListItemButton
                            key={sIdx}
                            onClick={() => handleScrollToSection(secId)}
                            sx={{
                              py: 0.65,
                              px: 1.25,
                              my: 0.2,
                              borderRadius: 1.5,
                              borderLeft: isCurrent
                                ? "3px solid"
                                : "3px solid transparent",
                              borderLeftColor: "primary.main",
                              bgcolor: isCurrent
                                ? mode === "light"
                                  ? "rgba(180, 83, 9, 0.08)"
                                  : "rgba(245, 158, 11, 0.12)"
                                : "transparent",
                              transition: "all 0.15s ease",
                            }}
                          >
                            <ListItemText
                              primary={sec.heading}
                              slotProps={{
                                primary: {
                                  sx: {
                                    fontSize: "0.78rem",
                                    fontWeight: isCurrent ? 750 : 550,
                                    color: isCurrent
                                      ? "primary.main"
                                      : "text.secondary",
                                    lineHeight: 1.35,
                                    "&:hover": { color: "primary.main" },
                                  },
                                },
                              }}
                            />
                          </ListItemButton>
                        );
                      })}
                      {activeSubtopicDetail.tradeOffs && (
                        <ListItemButton
                          onClick={() =>
                            handleScrollToSection("section-tradeoffs")
                          }
                          sx={{
                            py: 0.65,
                            px: 1.25,
                            my: 0.2,
                            borderRadius: 1.5,
                            borderLeft:
                              activeSectionId === "section-tradeoffs"
                                ? "3px solid"
                                : "3px solid transparent",
                            borderLeftColor: "primary.main",
                            bgcolor:
                              activeSectionId === "section-tradeoffs"
                                ? mode === "light"
                                  ? "rgba(180, 83, 9, 0.08)"
                                  : "rgba(245, 158, 11, 0.12)"
                                : "transparent",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <ListItemText
                            primary={indexData.ui.tradeOffMatrixHeading}
                            slotProps={{
                              primary: {
                                sx: {
                                  fontSize: "0.78rem",
                                  fontWeight:
                                    activeSectionId === "section-tradeoffs"
                                      ? 750
                                      : 550,
                                  color:
                                    activeSectionId === "section-tradeoffs"
                                      ? "primary.main"
                                      : "text.secondary",
                                },
                              },
                            }}
                          />
                        </ListItemButton>
                      )}
                      <ListItemButton
                        onClick={() =>
                          handleScrollToSection("section-interview-tip")
                        }
                        sx={{
                          py: 0.65,
                          px: 1.25,
                          my: 0.2,
                          borderRadius: 1.5,
                          borderLeft:
                            activeSectionId === "section-interview-tip"
                              ? "3px solid"
                              : "3px solid transparent",
                          borderLeftColor: "secondary.main",
                          bgcolor:
                            activeSectionId === "section-interview-tip"
                              ? mode === "light"
                                ? "rgba(2, 132, 199, 0.08)"
                                : "rgba(56, 189, 248, 0.12)"
                              : "transparent",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <ListItemText
                          primary={indexData.ui.interviewTipHeading}
                          slotProps={{
                            primary: {
                              sx: {
                                fontSize: "0.78rem",
                                fontWeight:
                                  activeSectionId === "section-interview-tip"
                                    ? 750
                                    : 550,
                                color:
                                  activeSectionId === "section-interview-tip"
                                    ? "secondary.main"
                                    : "text.secondary",
                              },
                            },
                          }}
                        />
                      </ListItemButton>
                    </List>
                  </Paper>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
