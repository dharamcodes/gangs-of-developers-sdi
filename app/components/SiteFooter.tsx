"use client";

import React from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import GodLogoMark from "./GodLogoMark";

export default function SiteFooter() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        pt: 8,
        pb: 6,
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Brand info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <GodLogoMark />
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 2, pr: { md: 4 }, lineHeight: 1.7 }}
            >
              Gangs of Developers (GOD) is an engineering knowledge platform dedicated to
              deep-dive distributed systems, software architecture, microservices, GoF patterns,
              and technical interview preparation.
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 2 }}>
              Built for engineering excellence and deep architectural craft.
            </Typography>
          </Grid>

          {/* Col 1: Core Curricula */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "text.primary",
                display: "block",
                mb: 2,
              }}
            >
              Curricula
            </Typography>
            <Stack spacing={1.25}>
              <Typography
                component={Link}
                href="/system-design"
                variant="body2"
                sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                System Design
              </Typography>
              <Typography
                component={Link}
                href="/distributed-systems"
                variant="body2"
                sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                Distributed Systems
              </Typography>
              <Typography
                component={Link}
                href="/microservices"
                variant="body2"
                sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                Microservices
              </Typography>
              <Typography
                component={Link}
                href="/microservices-design-patterns"
                variant="body2"
                sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                Microservices Patterns
              </Typography>
              <Typography
                component={Link}
                href="/design-patterns"
                variant="body2"
                sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                GoF Design Patterns
              </Typography>
              <Typography
                component={Link}
                href="/design-patterns/uml-class-diagrams"
                variant="body2"
                sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                UML Class Diagrams
              </Typography>
            </Stack>
          </Grid>

          {/* Col 2: Engineering Pillars */}
          <Grid size={{ xs: 6, sm: 3, md: 3 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "text.primary",
                display: "block",
                mb: 2,
              }}
            >
              Deep Dives
            </Typography>
            <Stack spacing={1.25}>
              <Typography
                component={Link}
                href="/backend-engineering"
                variant="body2"
                sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                Backend Engineering
              </Typography>
              <Typography
                component={Link}
                href="/java"
                variant="body2"
                sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                Java 21 &amp; Concurrency
              </Typography>
              <Typography
                component={Link}
                href="/spring-boot"
                variant="body2"
                sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                Spring Boot Microservices
              </Typography>
              <Typography
                component={Link}
                href="/kafka"
                variant="body2"
                sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                Apache Kafka Topology
              </Typography>
              <Typography
                component={Link}
                href="/company-wise-problems"
                variant="body2"
                sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                FAANG Interview Problems
              </Typography>
              <Typography
                component={Link}
                href="/free-course"
                variant="body2"
                sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                Free Interactive Course
              </Typography>
            </Stack>
          </Grid>

          {/* Col 3: Connect & Author */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "text.primary",
                display: "block",
                mb: 2,
              }}
            >
              Author &amp; Community
            </Typography>
            <Stack spacing={1.25}>
              <Typography
                component={Link}
                href="/author"
                variant="body2"
                sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                Dharmendra Awasthi (Dharam)
              </Typography>
              <Box
                component="a"
                href="https://linkedin.com/in/dharamcodes"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  color: "text.secondary",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  "&:hover": { color: "primary.main" },
                }}
              >
                <LinkedInIcon sx={{ fontSize: 18 }} /> LinkedIn Profile
              </Box>
              <Box
                component="a"
                href="https://github.com/dharamcodes"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  color: "text.secondary",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  "&:hover": { color: "primary.main" },
                }}
              >
                <GitHubIcon sx={{ fontSize: 18 }} /> GitHub Repositories
              </Box>
              <Box
                component="a"
                href="mailto:dharamcodes@gmail.com"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  color: "text.secondary",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  "&:hover": { color: "primary.main" },
                }}
              >
                <EmailIcon sx={{ fontSize: 18 }} /> dharamcodes@gmail.com
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: "center", textAlign: "center" }}
        >
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            &copy; {new Date().getFullYear()} Gangs of Developers (GOD). All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Software Architecture &bull; Distributed Systems &bull; Microservices &bull; GoF Patterns
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
