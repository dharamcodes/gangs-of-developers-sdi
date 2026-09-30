"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import CloseIcon from "@mui/icons-material/Close";
import SchemaOutlinedIcon from "@mui/icons-material/SchemaOutlined";
import ArchitectureDiagramCard from "./ArchitectureDiagramCard";
import type {
  HandbookUiConfig,
  SubtopicDetail,
  SubtopicSummary,
} from "../types/handbook";

interface SubtopicContentViewProps {
  ui: HandbookUiConfig;
  mode: "light" | "dark";
  fontScale: "normal" | "large" | "xlarge";
  subtopic: SubtopicDetail;
  prevSubtopic: SubtopicSummary | null;
  nextSubtopic: SubtopicSummary | null;
  onSelectSubtopic: (subtopicId: string, topicId: string) => void;
}

const FONT_SIZE_MAP = {
  normal: {
    body: { xs: "0.97rem", sm: "1.04rem" },
    bullet: { xs: "0.95rem", sm: "1.01rem" },
    code: { xs: "0.76rem", sm: "0.84rem" },
  },
  large: {
    body: { xs: "1.04rem", sm: "1.12rem" },
    bullet: { xs: "1.01rem", sm: "1.08rem" },
    code: { xs: "0.82rem", sm: "0.9rem" },
  },
  xlarge: {
    body: { xs: "1.1rem", sm: "1.2rem" },
    bullet: { xs: "1.08rem", sm: "1.15rem" },
    code: { xs: "0.88rem", sm: "0.96rem" },
  },
};

/**
 * Renders inline backtick code (`...`) as styled monospace pills without any external markdown dependency.
 */
function renderInlineCode(text: string, mode: "light" | "dark"): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      const codeContent = part.slice(1, -1);
      return (
        <Box
          key={idx}
          component="code"
          sx={{
            px: 0.7,
            py: 0.15,
            mx: 0.2,
            borderRadius: "5px",
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
            fontSize: "0.87em",
            fontWeight: 600,
            bgcolor:
              mode === "light"
                ? "rgba(15, 23, 42, 0.065)"
                : "rgba(255, 255, 255, 0.1)",
            color: mode === "light" ? "#9a3412" : "#fbbf24",
            border: "1px solid",
            borderColor:
              mode === "light"
                ? "rgba(15, 23, 42, 0.1)"
                : "rgba(255, 255, 255, 0.14)",
          }}
        >
          {codeContent}
        </Box>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

/**
 * Formats a bullet string by highlighting the lead-in label (before ':' or '—') in bold
 * and rendering inline backtick code pills.
 */
function renderFormattedBullet(
  bullet: string,
  mode: "light" | "dark"
): React.ReactNode {
  const colonIdx = bullet.indexOf(": ");
  const dashIdx = bullet.indexOf(" — ");

  let splitIdx = -1;
  let delimiter = "";

  if (colonIdx > 0 && colonIdx < 80) {
    splitIdx = colonIdx;
    delimiter = ": ";
  } else if (dashIdx > 0 && dashIdx < 80) {
    splitIdx = dashIdx;
    delimiter = " — ";
  }

  if (splitIdx > 0) {
    const lead = bullet.slice(0, splitIdx + delimiter.length);
    const rest = bullet.slice(splitIdx + delimiter.length);
    return (
      <>
        <Box
          component="span"
          sx={{ fontWeight: 700, color: "text.primary" }}
        >
          {renderInlineCode(lead, mode)}
        </Box>
        {renderInlineCode(rest, mode)}
      </>
    );
  }

  return renderInlineCode(bullet, mode);
}

function CodeBlockCard({
  title,
  code,
  fontSize,
}: {
  title: string;
  code: string;
  fontSize: { xs: string; sm: string };
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard errors
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        overflow: "hidden",
        borderRadius: 2.5,
        mt: 2,
        borderColor: "rgba(148, 163, 184, 0.25)",
        boxShadow: "0 8px 24px -8px rgba(15, 23, 42, 0.12)",
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.1,
          bgcolor: "#1e293b",
          color: "#e2e8f0",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", minWidth: 0 }}>
          <Stack direction="row" spacing={0.6} sx={{ alignItems: "center", flexShrink: 0 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#ef4444" }} />
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#f59e0b" }} />
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#22c55e" }} />
          </Stack>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
              color: "#f1f5f9",
              letterSpacing: "0.02em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>
        </Stack>

        <Tooltip title="Copy">
          <IconButton
            size="small"
            onClick={handleCopy}
            sx={{
              color: copied ? "#4ade80" : "#94a3b8",
              p: 0.4,
              "&:hover": { color: "#ffffff" },
            }}
          >
            {copied ? (
              <CheckIcon sx={{ fontSize: 16 }} />
            ) : (
              <ContentCopyIcon sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </Tooltip>
      </Stack>

      <Box
        component="pre"
        sx={{
          m: 0,
          p: { xs: 2, sm: 2.5 },
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
          fontSize,
          lineHeight: 1.65,
          bgcolor: "#0b1120",
          color: "#e2e8f0",
        }}
      >
        {code}
      </Box>
    </Paper>
  );
}

export default function SubtopicContentView({
  ui,
  mode,
  fontScale,
  subtopic,
  prevSubtopic,
  nextSubtopic,
  onSelectSubtopic,
}: SubtopicContentViewProps) {
  const [erZoomUrl, setErZoomUrl] = useState<string | null>(null);
  const scaleConfig = FONT_SIZE_MAP[fontScale];

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.25, sm: 4, md: 5, lg: 6 },
        borderRadius: { xs: 2.5, sm: 3.5 },
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow:
          mode === "light"
            ? "0 16px 40px -12px rgba(15, 23, 42, 0.07), inset 4px 0 10px -6px rgba(0,0,0,0.04)"
            : "0 16px 40px -12px rgba(0, 0, 0, 0.55)",
      }}
    >
      {/* Top Book Page Running Header */}
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.25,
          mb: 2,
        }}
      >
        <Typography
          variant="overline"
          sx={{
            color: "primary.main",
            fontWeight: 800,
            letterSpacing: "0.09em",
            fontSize: { xs: "0.72rem", sm: "0.78rem" },
          }}
        >
          {ui.partPrefix} {subtopic.topicNumber} • {subtopic.topicTitle}
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", flexWrap: "wrap", gap: 0.75 }}
        >
          <Chip
            label={`${ui.sectionPrefix} ${subtopic.subtopicNumber}`}
            size="small"
            color="primary"
            sx={{ fontWeight: 800, borderRadius: 1.5 }}
          />
          <Chip
            label={subtopic.difficulty}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600, borderRadius: 1.5 }}
          />
          <Chip
            icon={<AccessTimeIcon />}
            label={subtopic.readingTime}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600, borderRadius: 1.5 }}
          />
        </Stack>
      </Stack>

      {/* Subtopic Title & Subtitle */}
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: 850,
          letterSpacing: "-0.025em",
          lineHeight: 1.2,
          fontSize: { xs: "1.65rem", sm: "2.15rem", md: "2.5rem" },
          mb: 1.5,
        }}
      >
        <Box
          component="span"
          sx={{
            color: "primary.main",
            mr: 1.25,
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
            fontSize: "0.88em",
          }}
        >
          {subtopic.subtopicNumber}
        </Box>
        {subtopic.title}
      </Typography>

      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{
          fontSize: { xs: "1rem", sm: "1.15rem" },
          lineHeight: 1.65,
          maxWidth: "85ch",
          mb: 3.5,
        }}
      >
        {renderInlineCode(subtopic.subtitle, mode)}
      </Typography>

      <Divider sx={{ mb: 4 }} />

      {/* Key Takeaways Summary Box */}
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 4.5,
          borderRadius: 2.5,
          bgcolor:
            mode === "light"
              ? "rgba(245, 158, 11, 0.05)"
              : "rgba(245, 158, 11, 0.07)",
          borderColor:
            mode === "light"
              ? "rgba(180, 83, 9, 0.25)"
              : "rgba(245, 158, 11, 0.28)",
          borderLeft: "5px solid",
          borderLeftColor: "primary.main",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "primary.main",
            mb: 1.75,
          }}
        >
          {ui.keyTakeawaysHeading}
        </Typography>
        <Stack spacing={1.5}>
          {subtopic.keyTakeaways.map((point, idx) => (
            <Stack
              key={idx}
              direction="row"
              spacing={1.5}
              sx={{ alignItems: "flex-start" }}
            >
              <CheckCircleOutlineIcon
                fontSize="small"
                color="primary"
                sx={{ mt: 0.35, flexShrink: 0 }}
              />
              <Typography
                variant="body1"
                sx={{
                  fontSize: scaleConfig.bullet,
                  lineHeight: 1.7,
                  color: "text.primary",
                }}
              >
                {renderInlineCode(point, mode)}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Paper>

      {/* Detailed Book Sections */}
      <Stack spacing={4.5} sx={{ mb: 5 }}>
        {subtopic.sections.map((section, idx) => {
          const stepMatch = section.heading.match(/^(\d+)\.\s+(.*)$/);
          const stepNum = stepMatch ? stepMatch[1] : null;
          const cleanHeading = stepMatch ? stepMatch[2] : section.heading;

          return (
            <Box
              key={idx}
              id={`section-${idx}`}
              sx={{
                scrollMarginTop: "88px",
                pb: idx < subtopic.sections.length - 1 ? 3.5 : 0,
                borderBottom:
                  idx < subtopic.sections.length - 1 ? "1px solid" : "none",
                borderColor: "divider",
              }}
            >
              {/* Section Heading with Optional Step Badge */}
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "center", mb: 1.75 }}
              >
                {stepNum ? (
                  <Box
                    sx={{
                      minWidth: 34,
                      height: 34,
                      px: 1,
                      borderRadius: "9px",
                      background:
                        "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
                      boxShadow: "0 3px 10px rgba(180, 83, 9, 0.25)",
                      flexShrink: 0,
                    }}
                  >
                    {stepNum.padStart(2, "0")}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: 5,
                      height: 24,
                      borderRadius: 1,
                      bgcolor: "primary.main",
                      flexShrink: 0,
                    }}
                  />
                )}
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: "-0.015em",
                    fontSize: { xs: "1.22rem", sm: "1.42rem" },
                    lineHeight: 1.3,
                  }}
                >
                  {cleanHeading}
                </Typography>
              </Stack>

              {/* Section Body Prose */}
              <Typography
                variant="body1"
                sx={{
                  fontSize: scaleConfig.body,
                  lineHeight: 1.85,
                  color: "text.primary",
                  mb:
                    section.bullets ||
                    section.erDiagramUrl ||
                    section.diagramImageUrl ||
                    section.codeSnippet
                      ? 2.25
                      : 0,
                }}
              >
                {renderInlineCode(section.body, mode)}
              </Typography>

              {/* Styled Scannable Bullet Cards / Items */}
              {section.bullets && (
                <Stack spacing={1.25} sx={{ mb: 2.5 }}>
                  {section.bullets.map((bullet, bIdx) => (
                    <Box
                      key={bIdx}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        p: { xs: 1.25, sm: 1.5 },
                        borderRadius: 2,
                        bgcolor:
                          mode === "light"
                            ? "rgba(15, 23, 42, 0.025)"
                            : "rgba(255, 255, 255, 0.03)",
                        border: "1px solid",
                        borderColor:
                          mode === "light"
                            ? "rgba(15, 23, 42, 0.06)"
                            : "rgba(255, 255, 255, 0.06)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                          mt: 1,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: scaleConfig.bullet,
                          lineHeight: 1.75,
                          color: "text.primary",
                        }}
                      >
                        {renderFormattedBullet(bullet, mode)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}

              {/* Visual Entity-Relationship (ER) Diagram in Step 4 */}
              {section.erDiagramUrl && (
                <Paper
                  variant="outlined"
                  sx={{
                    mb: 2.5,
                    borderRadius: 2.5,
                    overflow: "hidden",
                    borderColor: "divider",
                    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 2,
                      py: 1,
                      bgcolor: "#0f172a",
                      color: "#f8fafc",
                    }}
                  >
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <SchemaOutlinedIcon
                        sx={{ color: "#38bdf8", fontSize: 18 }}
                      />
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        Entity-Relationship (ER) &amp; Storage Schema Diagram
                      </Typography>
                    </Stack>
                    <Tooltip title="Fullscreen Zoom">
                      <IconButton
                        size="small"
                        onClick={() => setErZoomUrl(section.erDiagramUrl ?? null)}
                        sx={{ color: "#e2e8f0", p: 0.4 }}
                      >
                        <ZoomOutMapIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Box
                    onClick={() => setErZoomUrl(section.erDiagramUrl ?? null)}
                    sx={{
                      p: { xs: 1, sm: 2 },
                      bgcolor: "#ffffff",
                      overflowX: "auto",
                      cursor: "zoom-in",
                      WebkitOverflowScrolling: "touch",
                    }}
                  >
                    <Box
                      component="img"
                      src={section.erDiagramUrl}
                      alt={`${subtopic.subtopicNumber} ${subtopic.title}`}
                      sx={{
                        width: "100%",
                        minWidth: { xs: 560, sm: "100%" },
                        height: "auto",
                        display: "block",
                      }}
                    />
                  </Box>
                </Paper>
              )}

              {/* System Architecture Diagram inside Step 5 (High-Level Box Diagram) */}
              {section.diagramImageUrl && (
                <ArchitectureDiagramCard
                  ui={ui}
                  diagramImageUrl={section.diagramImageUrl}
                  asciiDiagram={
                    section.asciiDiagram || subtopic.architectureDiagram
                  }
                  altText={`${subtopic.subtopicNumber} ${subtopic.title}`}
                />
              )}

              {/* Code / Schema / Math Worksheet Block */}
              {section.codeSnippet && (
                <CodeBlockCard
                  title={section.codeSnippet.title}
                  code={section.codeSnippet.code}
                  fontSize={scaleConfig.code}
                />
              )}
            </Box>
          );
        })}
      </Stack>

      {/* Architectural Trade-offs Table */}
      {subtopic.tradeOffs && (
        <Box
          id="section-tradeoffs"
          sx={{ mb: 4.5, scrollMarginTop: "88px" }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.22rem", sm: "1.4rem" },
              mb: 2,
            }}
          >
            {ui.tradeOffMatrixHeading}
          </Typography>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
              borderRadius: 2.5,
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <Table sx={{ minWidth: 640 }}>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: mode === "light" ? "#f1f5f9" : "#1e293b",
                  }}
                >
                  <TableCell sx={{ fontWeight: 800, width: "22%" }}>
                    {ui.tradeOffHeaders.option}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, width: "28%", color: "success.main" }}>
                    {ui.tradeOffHeaders.pros}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, width: "28%", color: "warning.main" }}>
                    {ui.tradeOffHeaders.cons}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, width: "22%", color: "secondary.main" }}>
                    {ui.tradeOffHeaders.bestFor}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subtopic.tradeOffs.map((row, rIdx) => (
                  <TableRow
                    key={rIdx}
                    sx={{
                      "&:nth-of-type(odd)": {
                        bgcolor:
                          mode === "light"
                            ? "rgba(248, 250, 252, 0.6)"
                            : "rgba(255, 255, 255, 0.015)",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        verticalAlign: "top",
                        fontSize: "0.92rem",
                      }}
                    >
                      {renderInlineCode(row.option, mode)}
                    </TableCell>
                    <TableCell
                      sx={{
                        verticalAlign: "top",
                        lineHeight: 1.65,
                        fontSize: "0.9rem",
                      }}
                    >
                      {renderInlineCode(row.pros, mode)}
                    </TableCell>
                    <TableCell
                      sx={{
                        verticalAlign: "top",
                        lineHeight: 1.65,
                        fontSize: "0.9rem",
                      }}
                    >
                      {renderInlineCode(row.cons, mode)}
                    </TableCell>
                    <TableCell
                      sx={{
                        verticalAlign: "top",
                        lineHeight: 1.65,
                        fontSize: "0.9rem",
                      }}
                    >
                      {renderInlineCode(row.bestFor, mode)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Interview Pro-Tip Callout */}
      <Paper
        id="section-interview-tip"
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2.5,
          bgcolor:
            mode === "light"
              ? "rgba(2, 132, 199, 0.07)"
              : "rgba(56, 189, 248, 0.09)",
          border: "1px solid",
          borderColor:
            mode === "light"
              ? "rgba(2, 132, 199, 0.2)"
              : "rgba(56, 189, 248, 0.22)",
          borderLeft: "5px solid",
          borderLeftColor: "secondary.main",
          mb: 5,
          scrollMarginTop: "88px",
        }}
      >
        <Stack direction="row" spacing={1.75} sx={{ alignItems: "flex-start" }}>
          <TipsAndUpdatesOutlinedIcon
            color="secondary"
            sx={{ mt: 0.3, flexShrink: 0 }}
          />
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "secondary.main",
                mb: 0.75,
              }}
            >
              {ui.interviewTipHeading}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: scaleConfig.bullet,
                lineHeight: 1.75,
              }}
            >
              {renderInlineCode(subtopic.interviewTip, mode)}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Divider sx={{ mb: 3.5 }} />

      {/* Book Page Turn Footer (Previous / Next Subtopic) */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ justifyContent: "space-between" }}
      >
        {prevSubtopic ? (
          <Button
            variant="outlined"
            startIcon={<ArrowBackIosNewIcon fontSize="small" />}
            onClick={() =>
              onSelectSubtopic(prevSubtopic.id, prevSubtopic.topicId)
            }
            sx={{
              justifyContent: "flex-start",
              textAlign: "left",
              py: 1.75,
              px: 2.5,
              borderRadius: 2.5,
              textTransform: "none",
              flex: 1,
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", fontWeight: 600 }}
              >
                {ui.previousLabel} ({prevSubtopic.topicTitle})
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                {prevSubtopic.subtopicNumber} {prevSubtopic.title}
              </Typography>
            </Box>
          </Button>
        ) : (
          <Box sx={{ flex: 1 }} />
        )}

        {nextSubtopic ? (
          <Button
            variant="contained"
            endIcon={<ArrowForwardIosIcon fontSize="small" />}
            onClick={() =>
              onSelectSubtopic(nextSubtopic.id, nextSubtopic.topicId)
            }
            sx={{
              justifyContent: "flex-end",
              textAlign: "right",
              py: 1.75,
              px: 2.5,
              borderRadius: 2.5,
              textTransform: "none",
              flex: 1,
            }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{ opacity: 0.9, display: "block", fontWeight: 600 }}
              >
                {ui.nextLabel} ({nextSubtopic.topicTitle})
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                {nextSubtopic.subtopicNumber} {nextSubtopic.title}
              </Typography>
            </Box>
          </Button>
        ) : (
          <Box sx={{ flex: 1 }} />
        )}
      </Stack>

      {/* Fullscreen Lightbox Dialog for Step 4 ER Diagram */}
      <Dialog
        open={Boolean(erZoomUrl)}
        onClose={() => setErZoomUrl(null)}
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
            bgcolor: "#0f172a",
            color: "#ffffff",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {subtopic.subtopicNumber} {subtopic.title} — Entity-Relationship (ER) Diagram
          </Typography>
          <IconButton
            onClick={() => setErZoomUrl(null)}
            sx={{ color: "#ffffff" }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        <DialogContent sx={{ bgcolor: "#ffffff", p: { xs: 1, sm: 3 } }}>
          {erZoomUrl && (
            <Box
              component="img"
              src={erZoomUrl}
              alt={`${subtopic.subtopicNumber} ${subtopic.title}`}
              sx={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
