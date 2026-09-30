"use client";

import React from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";
import type { HandbookUiConfig } from "../types/handbook";

interface GodLogoMarkProps {
  ui: HandbookUiConfig;
}

export default function GodLogoMark({ ui }: GodLogoMarkProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        userSelect: "none",
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "10px",
          background:
            "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(245, 158, 11, 0.35)",
          border: "1px solid rgba(255,255,255,0.25)",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 8.5C4 7.39543 4.89543 6.5 6 6.5H13C14.6569 6.5 16 7.84315 16 9.5V25.5C16 24.3954 15.1046 23.5 14 23.5H6C4.89543 23.5 4 22.6046 4 21.5V8.5Z"
            fill="#1e293b"
            stroke="#fff"
            strokeWidth="1.6"
          />
          <path
            d="M28 8.5C28 7.39543 27.1046 6.5 26 6.5H19C17.3431 6.5 16 7.84315 16 9.5V25.5C16 24.3954 16.8954 23.5 18 23.5H26C27.1046 23.5 28 22.6046 28 21.5V8.5Z"
            fill="#0f172a"
            stroke="#fff"
            strokeWidth="1.6"
          />
          <circle cx="10" cy="13" r="1.8" fill="#fbbf24" />
          <circle cx="10" cy="18" r="1.8" fill="#fbbf24" />
          <circle cx="22" cy="13" r="1.8" fill="#38bdf8" />
          <circle cx="22" cy="18" r="1.8" fill="#38bdf8" />
          <path
            d="M11.5 13H20.5M11.5 18H20.5M10 14.8V16.2M22 14.8V16.2"
            stroke="#fff"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Chip
            label={ui.badgeText}
            size="small"
            sx={{
              height: 20,
              fontSize: "0.7rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              bgcolor: "#f59e0b",
              color: "#0f172a",
              borderRadius: "4px",
            }}
          />
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
              fontSize: { xs: "0.92rem", sm: "1.08rem" },
            }}
          >
            {ui.brandTitle}
          </Typography>
        </Stack>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontSize: "0.73rem",
            display: { xs: "none", sm: "block" },
          }}
        >
          {ui.brandSubtitle}
        </Typography>
      </Box>
    </Box>
  );
}
