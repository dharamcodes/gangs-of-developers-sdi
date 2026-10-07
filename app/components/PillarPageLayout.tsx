"use client";

import React from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import HeaderBar from "./HeaderBar";
import SiteFooter from "./SiteFooter";
import { useHandbookTheme } from "../theme/theme";

interface PillarPageLayoutProps {
  children: React.ReactNode;
  currentNav?: "home" | "system-design" | "microservices" | "design-patterns" | "company-wise" | "author";
}

export default function PillarPageLayout({
  children,
  currentNav = "home",
}: PillarPageLayoutProps) {
  const { mode, theme, toggleThemeMode } = useHandbookTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <HeaderBar
          mode={mode}
          currentNav={currentNav}
          onToggleThemeMode={toggleThemeMode}
        />
        <Box component="main" sx={{ flex: 1, py: { xs: 4, md: 6 } }}>
          {children}
        </Box>
        <SiteFooter />
      </Box>
    </ThemeProvider>
  );
}
