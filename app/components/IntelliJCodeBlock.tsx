"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";

const KEYWORDS = new Set([
  "public", "private", "protected", "class", "interface", "record", "sealed",
  "permits", "extends", "implements", "static", "final", "synchronized",
  "volatile", "new", "return", "if", "else", "while", "for", "try", "catch",
  "finally", "throw", "throws", "import", "package", "void", "int", "long",
  "boolean", "byte", "double", "float", "var", "const", "let", "function",
  "async", "await", "export", "default", "from", "case", "switch", "break",
  "continue", "this", "super", "instanceof", "true", "false", "null", "type",
  "enum", "abstract", "transient", "native", "strictfp", "yield",
  // Algorithmic, schema, and pseudo-code primitives
  "algorithm", "procedure", "def", "fn", "method", "contract", "invariants",
  "input", "output", "require", "ensure", "select", "from", "where", "join",
  "group", "order", "by", "limit", "partition", "primary", "foreign", "key",
  "struct", "model", "entity", "schema"
]);

// Authentic IntelliJ Rainbow Brackets Cycling Palette
const RAINBOW_COLORS = [
  "#ffd700", // Level 0: Bright Gold
  "#00e5ff", // Level 1: Neon Cyan
  "#ff4081", // Level 2: Vibrant Pink / Magenta
  "#69f0ae", // Level 3: Mint Green
  "#b388ff", // Level 4: Soft Purple
];

interface Token {
  text: string;
  type:
    | "keyword"
    | "string"
    | "comment"
    | "annotation"
    | "number"
    | "type"
    | "method"
    | "bracket"
    | "operator"
    | "identifier"
    | "plain";
  color?: string;
}

function tokenizeLine(line: string, bracketStack: string[]): Token[] {
  // Regex to match tokens in priority order
  const tokenRegex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#(?!include)[^\n]*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`|@[A-Za-z0-9_.]+|[{}()[\]]|==|!=|<=|>=|&&|\|\||->|=>|::|\+\+|--|[+\-*/%=<>!&|^~?:;,.|]|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[fFdDlL]?\b|[a-zA-Z_$][a-zA-Z0-9_$]*)/g;

  let lastIndex = 0;
  const tokens: Token[] = [];
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: line.slice(lastIndex, match.index), type: "plain" });
    }
    const text = match[0];
    let type: Token["type"] = "plain";
    let color: string | undefined = undefined;

    if (text.startsWith("//") || text.startsWith("/*") || text.startsWith("#")) {
      type = "comment";
    } else if (text.startsWith('"') || text.startsWith("'") || text.startsWith("`")) {
      type = "string";
    } else if (text.startsWith("@")) {
      type = "annotation";
    } else if (text === "{" || text === "(" || text === "[") {
      type = "bracket";
      color = RAINBOW_COLORS[bracketStack.length % RAINBOW_COLORS.length];
      bracketStack.push(color);
    } else if (text === "}" || text === ")" || text === "]") {
      type = "bracket";
      color = bracketStack.pop() || RAINBOW_COLORS[0];
    } else if (KEYWORDS.has(text)) {
      type = "keyword";
    } else if (/^\d/.test(text)) {
      type = "number";
    } else {
      const rest = line.slice(tokenRegex.lastIndex);
      if (/^\s*\(/.test(rest)) {
        type = "method";
      } else if (/^[A-Z]/.test(text)) {
        type = "type";
      } else if (/^[a-zA-Z_$]/.test(text)) {
        type = "identifier";
      } else {
        type = "operator";
      }
    }

    tokens.push({ text, type, color });
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    tokens.push({ text: line.slice(lastIndex), type: "plain" });
  }

  return tokens;
}

function getTokenStyle(token: Token): React.CSSProperties {
  switch (token.type) {
    case "keyword":
      return { color: "#cc7832", fontWeight: 700 }; // IntelliJ Orange
    case "annotation":
      return { color: "#bbb529", fontWeight: 600 }; // IntelliJ Amber Gold
    case "string":
      return { color: "#6a8759" }; // IntelliJ Olive Green
    case "comment":
      return { color: "#808080", fontStyle: "italic" }; // IntelliJ Muted Gray
    case "number":
      return { color: "#6897bb" }; // IntelliJ Cyan Blue
    case "type":
      return { color: "#4ec9b0", fontWeight: 600 }; // IntelliJ Teal
    case "method":
      return { color: "#ffc66e" }; // IntelliJ Golden Yellow
    case "bracket":
      return { color: token.color, fontWeight: 700 }; // Rainbow Brackets
    case "operator":
      return { color: "#e2e8f0" };
    case "identifier":
      return { color: "#a9b7c6" }; // IntelliJ Light Slate
    default:
      return { color: "#a9b7c6" };
  }
}

export interface IntelliJCodeBlockProps {
  code: string;
  title?: string;
  language?: string;
  showLineNumbers?: boolean;
}

export default function IntelliJCodeBlock({
  code,
  title,
  showLineNumbers = true,
}: IntelliJCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  // Clean title to look like an algorithm or class model specification
  const displayTitle = useMemo(() => {
    if (title && title.trim()) {
      return title
        .replace(/\.(java|ts|py|js|yml|yaml|go|cpp|c|cs)$/i, "")
        .replace(/Implementation$/i, "Specification")
        .trim();
    }
    return "Algorithm & Class Specification";
  }, [title]);

  // Pre-tokenize lines
  const tokenizedLines = useMemo(() => {
    const lines = code.trim().split("\n");
    const bracketStack: string[] = [];
    return lines.map((line) => tokenizeLine(line, bracketStack));
  }, [code]);

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2.5,
        overflow: "hidden",
        my: 2.5,
        bgcolor: "#1e1f22", // Authentic IntelliJ Darcula Background
        borderColor: "rgba(255, 255, 255, 0.12)",
        boxShadow: "0 8px 32px -8px rgba(0, 0, 0, 0.45)",
      }}
    >
      {/* Algorithm & Class Model Tab Header */}
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          bgcolor: "#2b2d30", // IntelliJ Window Header
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 0 }}>
          {/* Mac/IntelliJ Window Dots */}
          <Stack direction="row" spacing={0.7} sx={{ alignItems: "center", flexShrink: 0 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#ff5f56" }} />
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#ffbd2e" }} />
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#27c93f" }} />
          </Stack>

          {/* Active Specification Tab */}
          <Stack
            direction="row"
            spacing={0.75}
            sx={{
              alignItems: "center",
              bgcolor: "#1e1f22",
              px: 1.5,
              py: 0.4,
              borderRadius: 1.5,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              minWidth: 0,
            }}
          >
            <AccountTreeOutlinedIcon sx={{ fontSize: 14, color: "#38bdf8" }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: "#e2e8f0",
                fontFamily: 'ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace',
                fontSize: "0.78rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayTitle}
            </Typography>
          </Stack>
        </Stack>

        {/* Copy Action (No language badge) */}
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Tooltip title={copied ? "Copied Specification!" : "Copy Specification"}>
            <IconButton
              size="small"
              onClick={handleCopy}
              aria-label="Copy algorithm specification to clipboard"
              sx={{
                color: copied ? "#4ade80" : "#94a3b8",
                p: 0.5,
                borderRadius: 1.5,
                "&:hover": { color: "#ffffff", bgcolor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              {copied ? <CheckIcon sx={{ fontSize: 16 }} /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Algorithm & Class Model Specification Bar */}
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 0.5,
          bgcolor: "#232529",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#4ec9b0" }} />
          <Typography
            variant="caption"
            sx={{
              color: "#94a3b8",
              fontFamily: 'ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace',
              fontSize: "0.71rem",
              fontWeight: 650,
              letterSpacing: "0.02em",
            }}
          >
            Algorithm Invariants &amp; Class Model
          </Typography>
        </Stack>

        <Typography
          variant="caption"
          sx={{
            color: "#64748b",
            fontFamily: 'ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace',
            fontSize: "0.68rem",
            fontWeight: 500,
            display: { xs: "none", sm: "block" },
          }}
        >
          Architecture Specification
        </Typography>
      </Stack>

      {/* Code Editor Body with IntelliJ Line Numbers & Rainbow Highlighting */}
      <Box
        sx={{
          p: { xs: 1.75, sm: 2.25 },
          overflowX: "auto",
          fontFamily: 'ui-monospace, "JetBrains Mono", SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: "0.82rem",
          lineHeight: 1.6,
          bgcolor: "#1e1f22",
        }}
      >
        <table style={{ borderCollapse: "collapse", width: "100%", margin: 0 }}>
          <tbody>
            {tokenizedLines.map((tokens, lineIdx) => (
              <tr key={lineIdx} style={{ lineHeight: "1.65" }}>
                {showLineNumbers && (
                  <td
                    style={{
                      userSelect: "none",
                      textAlign: "right",
                      paddingRight: "18px",
                      color: "#4e5157", // IntelliJ Gutter Line Number
                      fontSize: "0.76rem",
                      verticalAlign: "top",
                      width: "32px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {lineIdx + 1}
                  </td>
                )}
                <td style={{ whiteSpace: "pre", verticalAlign: "top" }}>
                  {tokens.map((token, tokenIdx) => (
                    <span key={tokenIdx} style={getTokenStyle(token)}>
                      {token.text}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Paper>
  );
}
