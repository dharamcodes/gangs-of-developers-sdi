"use client";

import React from "react";
import {
  Box,
  Chip,
  Collapse,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import type {
  HandbookUiConfig,
  SubtopicSummary,
  TopicIndexItem,
} from "../types/handbook";

interface SidebarTocProps {
  ui: HandbookUiConfig;
  mode: "light" | "dark";
  filteredGroups: TopicIndexItem[];
  activeSubtopic: SubtopicSummary;
  activeIndex: number;
  totalSubtopics: number;
  searchQuery: string;
  expandedTopics: Record<string, boolean>;
  onSearchChange: (q: string) => void;
  onToggleTopic: (topicId: string) => void;
  onExpandAll: (expand: boolean) => void;
  onSelectSubtopic: (subtopicId: string, topicId: string) => void;
}

export default function SidebarToc({
  ui,
  mode,
  filteredGroups,
  activeSubtopic,
  activeIndex,
  totalSubtopics,
  searchQuery,
  expandedTopics,
  onSearchChange,
  onToggleTopic,
  onExpandAll,
  onSelectSubtopic,
}: SidebarTocProps) {
  const isSearching = searchQuery.trim().length > 0;
  const [difficultyFilter, setDifficultyFilter] = React.useState<string>("ALL");

  const displayGroups = React.useMemo(() => {
    if (difficultyFilter === "ALL") return filteredGroups;
    return filteredGroups
      .map((group) => {
        const matchingSubtopics = group.subtopics.filter((sub) => {
          if (!sub.difficulty) return false;
          const diff = sub.difficulty.toLowerCase();
          const target = difficultyFilter.toLowerCase();
          if (target === "expert") return diff === "expert" || diff === "architect";
          return diff === target;
        });
        return {
          ...group,
          subtopics: matchingSubtopics,
        };
      })
      .filter((group) => group.subtopics.length > 0);
  }, [filteredGroups, difficultyFilter]);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: mode === "light" ? "#f6f4ef" : "#0b1120",
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Top Search & Index Controls */}
      <Box sx={{ p: 2, pb: 1.5 }}>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.25,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <MenuBookIcon fontSize="small" color="primary" />
            <Typography
              variant="overline"
              sx={{
                fontWeight: 800,
                letterSpacing: "0.09em",
                color: "text.primary",
                lineHeight: 1,
              }}
            >
              {ui.tocHeading}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.25} sx={{ alignItems: "center" }}>
            <Tooltip title={ui.expandAllTooltip}>
              <IconButton size="small" onClick={() => onExpandAll(true)}>
                <UnfoldMoreIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={ui.collapseAllTooltip}>
              <IconButton size="small" onClick={() => onExpandAll(false)}>
                <UnfoldLessIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <TextField
          fullWidth
          size="small"
          placeholder={ui.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: isSearching ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    edge="end"
                    onClick={() => onSearchChange("")}
                  >
                    <ClearIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "background.paper",
              fontSize: "0.84rem",
              borderRadius: 2,
            },
          }}
        />

        {/* Difficulty Filter Chips (Easy -> Hard Progression) */}
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            mt: 1.25,
            overflowX: "auto",
            pb: 0.25,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {[
            { id: "ALL", label: "All" },
            { id: "Foundational", label: "🟢 Easy", color: "#10b981" },
            { id: "Intermediate", label: "🔵 Medium", color: "#0284c7" },
            { id: "Advanced", label: "🟣 Hard", color: "#8b5cf6" },
            { id: "Expert", label: "🟠 Expert", color: "#f59e0b" },
          ].map((lvl) => {
            const active = difficultyFilter === lvl.id;
            return (
              <Chip
                key={lvl.id}
                label={lvl.label}
                size="small"
                onClick={() => setDifficultyFilter(lvl.id)}
                sx={{
                  height: 22,
                  fontSize: "0.68rem",
                  fontWeight: active ? 800 : 600,
                  cursor: "pointer",
                  bgcolor: active
                    ? lvl.color || "primary.main"
                    : mode === "light"
                    ? "rgba(15,23,42,0.05)"
                    : "rgba(255,255,255,0.06)",
                  color: active
                    ? "#ffffff"
                    : "text.secondary",
                  border: "1px solid",
                  borderColor: active
                    ? "transparent"
                    : "divider",
                  "&:hover": {
                    bgcolor: active
                      ? lvl.color || "primary.main"
                      : mode === "light"
                      ? "rgba(15,23,42,0.08)"
                      : "rgba(255,255,255,0.1)",
                  },
                }}
              />
            );
          })}
        </Stack>
      </Box>

      <Divider />

      {/* Scrollable Topic & Subtopic Tree */}
      <Box sx={{ flex: 1, overflowY: "auto", pb: 2 }}>
        {displayGroups.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {ui.noResultsText}
            </Typography>
          </Box>
        ) : (
          displayGroups.map((group) => {
            const isOpen = isSearching || Boolean(expandedTopics[group.id]);
            const isGroupActive = group.id === activeSubtopic.topicId;

            return (
              <Box key={group.id}>
                <ListItemButton
                  onClick={() => onToggleTopic(group.id)}
                  sx={{
                    py: 1.1,
                    px: 2,
                    bgcolor:
                      mode === "light"
                        ? isGroupActive
                          ? "rgba(180, 83, 9, 0.09)"
                          : "rgba(15, 23, 42, 0.03)"
                        : isGroupActive
                        ? "rgba(245, 158, 11, 0.12)"
                        : "rgba(255, 255, 255, 0.02)",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1.25,
                      flexShrink: 0,
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      bgcolor: isGroupActive
                        ? "primary.main"
                        : mode === "light"
                        ? "rgba(15,23,42,0.08)"
                        : "rgba(255,255,255,0.1)",
                      color: isGroupActive
                        ? mode === "light"
                          ? "#fff"
                          : "#0f172a"
                        : "text.secondary",
                    }}
                  >
                    {group.topicNumber}
                  </Box>
                  <ListItemText
                    primary={group.title}
                    slotProps={{
                      primary: {
                        sx: {
                          fontWeight: 800,
                          fontSize: "0.78rem",
                          letterSpacing: "0.03em",
                          textTransform: "uppercase",
                          color: isGroupActive
                            ? "primary.main"
                            : "text.primary",
                        },
                      },
                    }}
                  />
                  <Chip
                    label={group.subtopics.length}
                    size="small"
                    sx={{
                      height: 19,
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      mr: 0.5,
                      bgcolor:
                        mode === "light"
                          ? "rgba(15,23,42,0.06)"
                          : "rgba(255,255,255,0.08)",
                    }}
                  />
                  {isOpen ? (
                    <ExpandLessIcon fontSize="small" color="action" />
                  ) : (
                    <ExpandMoreIcon fontSize="small" color="action" />
                  )}
                </ListItemButton>

                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List dense disablePadding sx={{ py: 0.5 }}>
                    {group.subtopics.map((subtopic) => {
                      const isSelected = subtopic.id === activeSubtopic.id;
                      const diffBadge = subtopic.difficulty
                        ? subtopic.difficulty.toLowerCase() === "foundational"
                          ? { label: "Easy", color: "#059669", bg: "rgba(16,185,129,0.12)" }
                          : subtopic.difficulty.toLowerCase() === "intermediate"
                          ? { label: "Med", color: "#0284c7", bg: "rgba(2,132,199,0.12)" }
                          : subtopic.difficulty.toLowerCase() === "advanced"
                          ? { label: "Hard", color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" }
                          : { label: "Expert", color: "#d97706", bg: "rgba(245,158,11,0.12)" }
                        : null;

                      return (
                        <ListItemButton
                          key={subtopic.id}
                          selected={isSelected}
                          onClick={() =>
                            onSelectSubtopic(subtopic.id, group.id)
                          }
                          sx={{
                            py: 0.8,
                            pl: 2.25,
                            pr: 1.75,
                            mx: 0.75,
                            my: 0.15,
                            borderRadius: 1.5,
                            alignItems: "flex-start",
                            borderLeft: "3px solid",
                            borderLeftColor: isSelected
                              ? "primary.main"
                              : "transparent",
                            "&.Mui-selected": {
                              bgcolor:
                                mode === "light"
                                  ? "rgba(180, 83, 9, 0.12)"
                                  : "rgba(245, 158, 11, 0.16)",
                              "&:hover": {
                                bgcolor:
                                  mode === "light"
                                    ? "rgba(180, 83, 9, 0.18)"
                                    : "rgba(245, 158, 11, 0.22)",
                              },
                            },
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily:
                                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
                              fontWeight: 700,
                              fontSize: "0.73rem",
                              color: isSelected
                                ? "primary.main"
                                : "text.secondary",
                              minWidth: 38,
                              mt: 0.25,
                            }}
                          >
                            {subtopic.subtopicNumber}
                          </Typography>
                          <ListItemText
                            primary={subtopic.title}
                            slotProps={{
                              primary: {
                                sx: {
                                  fontWeight: isSelected ? 700 : 500,
                                  fontSize: "0.84rem",
                                  color: isSelected
                                    ? "primary.main"
                                    : "text.primary",
                                  lineHeight: 1.35,
                                },
                              },
                            }}
                          />
                          {diffBadge && (
                            <Chip
                              label={diffBadge.label}
                              size="small"
                              sx={{
                                height: 17,
                                fontSize: "0.6rem",
                                fontWeight: 800,
                                color: diffBadge.color,
                                bgcolor: diffBadge.bg,
                                borderRadius: 1,
                                ml: 0.75,
                                mt: 0.35,
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          })
        )}
      </Box>

      <Divider />
      <Box
        sx={{
          p: 1.5,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: mode === "light" ? "#ede8dc" : "#070b14",
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {ui.footerStatsTemplate}
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontWeight: 800, color: "primary.main" }}
        >
          {activeIndex + 1} / {totalSubtopics}
        </Typography>
      </Box>
    </Box>
  );
}
