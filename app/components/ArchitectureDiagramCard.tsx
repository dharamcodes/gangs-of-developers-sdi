"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import type { HandbookUiConfig } from "../types/handbook";

interface ArchitectureDiagramCardProps {
  ui: HandbookUiConfig;
  mode?: "light" | "dark";
  diagramImageUrl?: string;
  asciiDiagram: string;
  altText: string;
}

export default function ArchitectureDiagramCard({
  ui,
  mode = "light",
  diagramImageUrl,
  asciiDiagram,
  altText,
}: ArchitectureDiagramCardProps) {
  const hasVisualImage = Boolean(diagramImageUrl && diagramImageUrl.trim().length > 0);
  const [viewMode, setViewMode] = useState<"visual" | "ascii">(
    hasVisualImage ? "visual" : "ascii"
  );
  const [zoomOpen, setZoomOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopyAscii = async () => {
    try {
      await navigator.clipboard.writeText(asciiDiagram);
      setCopied(true);
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard errors
    }
  };

  const isLight = mode === "light";

  return (
    <Box sx={{ mt: 2.5, mb: 2 }}>
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2.5,
          overflow: "hidden",
          borderColor: "divider",
          boxShadow: isLight
            ? "0 4px 20px -4px rgba(15, 23, 42, 0.06)"
            : "0 8px 24px -6px rgba(15, 23, 42, 0.25)",
        }}
      >
        {/* Diagram Card Toolbar */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
            px: { xs: 1.5, sm: 2.5 },
            py: 1.25,
            bgcolor: isLight ? "#f8fafc" : "#0f172a",
            color: isLight ? "#0f172a" : "#f8fafc",
            borderBottom: isLight
              ? "1px solid #e2e8f0"
              : "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <AccountTreeOutlinedIcon
              sx={{ color: isLight ? "#b45309" : "#f59e0b" }}
              fontSize="small"
            />
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 750, letterSpacing: "0.01em" }}
            >
              {ui.visualDiagramHeading}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {hasVisualImage && Boolean(asciiDiagram && asciiDiagram.trim().length > 0) && (
              <ButtonGroup
                size="small"
                sx={{
                  "& .MuiButton-root": {
                    textTransform: "none",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    px: 1.5,
                    py: 0.35,
                    color: isLight ? "#475569" : "#cbd5e1",
                    borderColor: isLight ? "#cbd5e1" : "rgba(255,255,255,0.2)",
                    "&.active-mode": {
                      bgcolor: "#f59e0b",
                      color: "#0f172a",
                      borderColor: "#f59e0b",
                      fontWeight: 700,
                    },
                  },
                }}
              >
                <Button
                  className={viewMode === "visual" ? "active-mode" : ""}
                  onClick={() => setViewMode("visual")}
                >
                  {ui.visualDiagramTabLabel}
                </Button>
                <Button
                  className={viewMode === "ascii" ? "active-mode" : ""}
                  onClick={() => setViewMode("ascii")}
                >
                  {ui.asciiDiagramTabLabel}
                </Button>
              </ButtonGroup>
            )}

            {/* Copy button for ASCII when in ascii mode */}
            {viewMode === "ascii" && (
              <Tooltip title={copied ? "Copied!" : "Copy Blueprint"}>
                <IconButton
                  size="small"
                  onClick={handleCopyAscii}
                  sx={{
                    color: copied ? "#16a34a" : isLight ? "#475569" : "#e2e8f0",
                    border: isLight
                      ? "1px solid #cbd5e1"
                      : "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 1.5,
                    p: 0.5,
                    "&:hover": {
                      bgcolor: isLight
                        ? "rgba(15, 23, 42, 0.05)"
                        : "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  {copied ? (
                    <CheckIcon fontSize="small" />
                  ) : (
                    <ContentCopyIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            )}

            {/* Fullscreen Zoom */}
            <Tooltip title="Fullscreen View">
              <IconButton
                size="small"
                onClick={() => setZoomOpen(true)}
                sx={{
                  color: isLight ? "#475569" : "#e2e8f0",
                  border: isLight
                    ? "1px solid #cbd5e1"
                    : "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 1.5,
                  p: 0.5,
                  "&:hover": {
                    bgcolor: isLight
                      ? "rgba(15, 23, 42, 0.05)"
                      : "rgba(255,255,255,0.1)",
                  },
                }}
              >
                <ZoomOutMapIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Diagram Body */}
        {viewMode === "visual" && hasVisualImage ? (
          <Box
            onClick={() => setZoomOpen(true)}
            sx={{
              p: { xs: 1, sm: 2.5 },
              bgcolor: "#ffffff",
              cursor: "zoom-in",
              overflowX: "auto",
            }}
          >
            <Box
              component="img"
              src={diagramImageUrl}
              alt={altText}
              loading="lazy"
              decoding="async"
              sx={{
                width: "100%",
                minWidth: { xs: 560, sm: "100%" },
                height: "auto",
                display: "block",
                borderRadius: 1,
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              bgcolor: isLight ? "#f8fafc" : "#0b1120",
              color: isLight ? "#1e293b" : "#e2e8f0",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              borderTop: isLight ? "1px solid #f1f5f9" : "none",
            }}
          >
            <Box
              component="pre"
              sx={{
                m: 0,
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
                fontSize: { xs: "0.74rem", sm: "0.82rem" },
                lineHeight: 1.55,
                letterSpacing: "0.01em",
                whiteSpace: "pre",
                color: isLight ? "#0f172a" : "#e2e8f0",
              }}
            >
              {asciiDiagram}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Fullscreen Lightbox Dialog for High-Res Inspection */}
      <Dialog
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
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
            bgcolor: isLight ? "#f8fafc" : "#0f172a",
            color: isLight ? "#0f172a" : "#ffffff",
            borderBottom: isLight
              ? "1px solid #e2e8f0"
              : "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {altText} — {ui.visualDiagramHeading}
          </Typography>
          <IconButton
            onClick={() => setZoomOpen(false)}
            sx={{ color: isLight ? "#0f172a" : "#ffffff" }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        <DialogContent
          sx={{
            bgcolor:
              viewMode === "visual" && hasVisualImage
                ? "#ffffff"
                : isLight
                ? "#f8fafc"
                : "#0b1120",
            p: { xs: 1, sm: 3 },
          }}
        >
          {viewMode === "visual" && hasVisualImage ? (
            <Box
              component="img"
              src={diagramImageUrl}
              alt={altText}
              sx={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          ) : (
            <Box
              component="pre"
              sx={{
                m: 0,
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
                fontSize: "0.85rem",
                lineHeight: 1.6,
                color: isLight ? "#0f172a" : "#e2e8f0",
                overflowX: "auto",
                p: 2,
              }}
            >
              {asciiDiagram}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
