"use client";

import React from "react";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import type {
  HandbookUiConfig,
  SubtopicSummary,
  TopicIndexItem,
} from "../types/handbook";

interface SubtopicQuickBarProps {
  ui: HandbookUiConfig;
  mode: "light" | "dark";
  topicGroup: TopicIndexItem;
  activeSubtopic: SubtopicSummary;
  onSelectSubtopic: (subtopicId: string, topicId: string) => void;
}

export default function SubtopicQuickBar({
  ui,
  mode,
  topicGroup,
  activeSubtopic,
  onSelectSubtopic,
}: SubtopicQuickBarProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 1.5, sm: 2 },
        mb: { xs: 2, sm: 3 },
        borderRadius: 2.5,
        bgcolor:
          mode === "light"
            ? "rgba(255, 255, 255, 0.85)"
            : "rgba(17, 24, 39, 0.85)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: "center", mb: 1.25 }}
      >
        <LayersOutlinedIcon
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
          {ui.partPrefix} {topicGroup.topicNumber}: {topicGroup.title} —{" "}
          {ui.subtopicsBarSuffix} ({topicGroup.subtopics.length})
        </Typography>
      </Stack>

      {/* Horizontal scroll on mobile/tablet so it never crowds the viewport; wraps cleanly on large desktops */}
      <Box
        sx={{
          display: "flex",
          flexWrap: { xs: "nowrap", lg: "wrap" },
          overflowX: { xs: "auto", lg: "visible" },
          gap: 0.75,
          pb: { xs: 0.5, lg: 0 },
          WebkitOverflowScrolling: "touch",
        }}
      >
        {topicGroup.subtopics.map((sub) => {
          const active = sub.id === activeSubtopic.id;
          return (
            <Chip
              key={sub.id}
              label={`${sub.subtopicNumber} ${sub.title}`}
              size="small"
              color={active ? "primary" : "default"}
              variant={active ? "filled" : "outlined"}
              onClick={() => onSelectSubtopic(sub.id, topicGroup.id)}
              sx={{
                flexShrink: 0,
                fontWeight: active ? 700 : 500,
                fontSize: "0.76rem",
                borderRadius: 1.5,
                transition: "all 0.15s ease",
              }}
            />
          );
        })}
      </Box>
    </Paper>
  );
}
