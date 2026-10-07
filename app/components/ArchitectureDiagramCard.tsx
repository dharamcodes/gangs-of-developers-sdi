"use client";

import React, { useState, useRef, useEffect } from "react";
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
import AltRouteOutlinedIcon from "@mui/icons-material/AltRouteOutlined";
import TerminalRoundedIcon from "@mui/icons-material/TerminalRounded";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import type { HandbookUiConfig } from "../types/handbook";

interface ArchitectureDiagramCardProps {
  ui: HandbookUiConfig;
  mode?: "light" | "dark";
  diagramImageUrl?: string;
  flowDiagramUrl?: string;
  asciiDiagram: string;
  altText: string;
}

export default function ArchitectureDiagramCard({
  ui,
  mode = "light",
  diagramImageUrl,
  flowDiagramUrl,
  asciiDiagram,
  altText,
}: ArchitectureDiagramCardProps) {
  const hasBlockImage = Boolean(diagramImageUrl && diagramImageUrl.trim().length > 0);
  const hasFlowImage = Boolean(flowDiagramUrl && flowDiagramUrl.trim().length > 0);
  const hasAscii = Boolean(asciiDiagram && asciiDiagram.trim().length > 0);

  type TabMode = "block" | "flow" | "ascii";

  const defaultTab: TabMode = hasBlockImage
    ? "block"
    : hasFlowImage
    ? "flow"
    : "ascii";

  const [selectedTab, setSelectedTab] = useState<TabMode | null>(null);
  const [prevKey, setPrevKey] = useState<string>(`${diagramImageUrl || ""}_${flowDiagramUrl || ""}`);

  const currentKey = `${diagramImageUrl || ""}_${flowDiagramUrl || ""}`;
  if (prevKey !== currentKey) {
    setPrevKey(currentKey);
    setSelectedTab(null);
  }

  const activeTab: TabMode = selectedTab ?? defaultTab;
  const [zoomOpen, setZoomOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
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

  // Determine current active image for zoom
  const currentImageUrl =
    activeTab === "block"
      ? diagramImageUrl
      : activeTab === "flow"
      ? flowDiagramUrl
      : undefined;

  const currentTabHeading =
    activeTab === "block"
      ? ui.visualDiagramHeading || "Component Topology & Architecture Blueprint"
      : activeTab === "flow"
      ? "Runtime Execution Sequence & Step Pipeline"
      : "ASCII Terminal Architecture Blueprint";

  const currentTabIcon =
    activeTab === "block" ? (
      <AccountTreeOutlinedIcon sx={{ color: isLight ? "#b45309" : "#f59e0b" }} fontSize="small" />
    ) : activeTab === "flow" ? (
      <AltRouteOutlinedIcon sx={{ color: isLight ? "#059669" : "#10b981" }} fontSize="small" />
    ) : (
      <TerminalRoundedIcon sx={{ color: isLight ? "#0284c7" : "#38bdf8" }} fontSize="small" />
    );

  return (
    <Box sx={{ mt: 2.5, mb: 3 }}>
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2.75,
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
            gap: 1.25,
            px: { xs: 1.5, sm: 2.5 },
            py: 1.25,
            bgcolor: isLight ? "#f8fafc" : "#0f172a",
            color: isLight ? "#0f172a" : "#f8fafc",
            borderBottom: isLight
              ? "1px solid #e2e8f0"
              : "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Header Title with Dynamic Icon */}
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {currentTabIcon}
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 750,
                letterSpacing: "0.01em",
                fontSize: { xs: "0.82rem", sm: "0.88rem" },
              }}
            >
              {currentTabHeading}
            </Typography>
          </Stack>

          {/* Tab Button Controls & Actions */}
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <ButtonGroup
              size="small"
              sx={{
                "& .MuiButton-root": {
                  textTransform: "none",
                  fontSize: { xs: "0.72rem", sm: "0.76rem" },
                  fontWeight: 650,
                  px: { xs: 1, sm: 1.5 },
                  py: 0.4,
                  color: isLight ? "#475569" : "#cbd5e1",
                  borderColor: isLight ? "#cbd5e1" : "rgba(255,255,255,0.2)",
                  "&.active-tab": {
                    bgcolor: isLight ? "#b45309" : "#f59e0b",
                    color: isLight ? "#ffffff" : "#0f172a",
                    borderColor: isLight ? "#b45309" : "#f59e0b",
                    fontWeight: 750,
                  },
                },
              }}
            >
              {hasBlockImage && (
                <Button
                  className={activeTab === "block" ? "active-tab" : ""}
                  onClick={() => setSelectedTab("block")}
                  startIcon={<AccountTreeOutlinedIcon sx={{ fontSize: "14px !important" }} />}
                >
                  Topology
                </Button>
              )}

              {hasFlowImage && (
                <Button
                  className={activeTab === "flow" ? "active-tab" : ""}
                  onClick={() => setSelectedTab("flow")}
                  startIcon={<AltRouteOutlinedIcon sx={{ fontSize: "14px !important" }} />}
                >
                  Execution Flow
                </Button>
              )}

              {hasAscii && (
                <Button
                  className={activeTab === "ascii" ? "active-tab" : ""}
                  onClick={() => setSelectedTab("ascii")}
                  startIcon={<TerminalRoundedIcon sx={{ fontSize: "14px !important" }} />}
                >
                  ASCII Art
                </Button>
              )}
            </ButtonGroup>

            {/* Copy button for ASCII when in ascii mode */}
            {activeTab === "ascii" && (
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
            {(activeTab === "block" || activeTab === "flow") && (
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
            )}
          </Stack>
        </Stack>

        {/* Diagram Body */}
        {activeTab === "block" && hasBlockImage && (
          <Box
            onClick={() => setZoomOpen(true)}
            sx={{
              p: { xs: 1, sm: 2.5 },
              bgcolor: isLight ? "#ffffff" : "#070b14",
              cursor: "zoom-in",
              overflowX: "auto",
            }}
          >
            <Box
              component="img"
              src={diagramImageUrl}
              alt={`${altText} Architecture Topology`}
              loading="lazy"
              decoding="async"
              sx={{
                width: "100%",
                minWidth: { xs: 580, sm: "100%" },
                height: "auto",
                display: "block",
                borderRadius: 1,
              }}
            />
          </Box>
        )}

        {activeTab === "flow" && hasFlowImage && (
          <Box
            onClick={() => setZoomOpen(true)}
            sx={{
              p: { xs: 1, sm: 2.5 },
              bgcolor: isLight ? "#ffffff" : "#070b14",
              cursor: "zoom-in",
              overflowX: "auto",
            }}
          >
            <Box
              component="img"
              src={flowDiagramUrl}
              alt={`${altText} Runtime Execution Flow`}
              loading="lazy"
              decoding="async"
              sx={{
                width: "100%",
                minWidth: { xs: 580, sm: "100%" },
                height: "auto",
                display: "block",
                borderRadius: 1,
              }}
            />
          </Box>
        )}

        {activeTab === "ascii" && (
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
          <Typography variant="subtitle1" sx={{ fontWeight: 750 }}>
            {altText} — {currentTabHeading}
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
            bgcolor: isLight ? "#ffffff" : "#070b14",
            p: { xs: 1, sm: 3 },
          }}
        >
          {currentImageUrl ? (
            <Box
              component="img"
              src={currentImageUrl}
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
