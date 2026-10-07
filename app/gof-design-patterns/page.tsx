import type { Metadata } from "next";
import Link from "next/link";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import PillarPageLayout from "../components/PillarPageLayout";
import IntelliJCodeBlock from "../components/IntelliJCodeBlock";

export const metadata: Metadata = {
  title: "GoF Design Patterns Catalog: 23 Patterns in Java 21",
  description: "Complete catalog of 23 Gang of Four (GoF) design patterns: Creational, Structural, and Behavioral patterns implemented in modern Java 21 with UML diagrams.",
  alternates: {
    canonical: "https://www.gangsofdevelopers.com/gof-design-patterns",
  },
  openGraph: {
    title: "GoF Design Patterns Catalog: 23 Gang of Four Patterns in Java 21",
    description:
      "Deep dive into Creational, Structural, and Behavioral patterns with UML class diagrams, modern Java code, and architectural comparisons.",
    url: "https://www.gangsofdevelopers.com/gof-design-patterns",
    siteName: "Gangs of Developers (GOD)",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoF Design Patterns Catalog: 23 Gang of Four Patterns in Java 21",
    description:
      "Master Factory, Builder, Singleton, Adapter, Decorator, Strategy, Observer, and State patterns.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://www.gangsofdevelopers.com/gof-design-patterns#article",
      "headline": "GoF Design Patterns Catalog: 23 Gang of Four Patterns in Java 21",
      "description":
        "Master all 23 classic Gang of Four (GoF) design patterns: Creational, Structural, and Behavioral patterns with modern Java 21 implementations, UML class diagrams, and trade-off matrices.",
      "url": "https://www.gangsofdevelopers.com/gof-design-patterns",
      "author": {
        "@type": "Person",
        "name": "Dharmendra Awasthi",
        "url": "https://www.gangsofdevelopers.com/author",
      },
      "publisher": {
        "@type": "Organization",
        "name": "Gangs of Developers",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.gangsofdevelopers.com/god_logo.png",
        },
      },
      "about": [
        "Design Patterns",
        "GoF Patterns",
        "Gang of Four",
        "Creational Patterns",
        "Structural Patterns",
        "Behavioral Patterns",
        "Java 21",
        "UML Class Diagrams",
      ],
      "inLanguage": "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.gangsofdevelopers.com/gof-design-patterns#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.gangsofdevelopers.com",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "GoF Design Patterns",
          "item": "https://www.gangsofdevelopers.com/gof-design-patterns",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.gangsofdevelopers.com/gof-design-patterns#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the key difference between Strategy Pattern and State Pattern?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "While both patterns share nearly identical UML class structures (a Context delegating to an Interface), their intent is fundamentally different. In the Strategy Pattern, the client explicitly chooses which interchangeable algorithm or strategy to inject into the Context. In the State Pattern, the Context changes its internal state transitions dynamically and automatically changes its behavior based on internal lifecycle triggers.",
          },
        },
        {
          "@type": "Question",
          "name": "How does Java 21 modernize the classic GoF patterns?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Modern Java 21 drastically reduces GoF boilerplate: Sealed Interfaces and Pattern Matching for switch replace complex Visitor patterns; Records replace verbose Data Transfer and Prototype classes; Lambdas and method references eliminate single-method Strategy and Command classes; and Virtual Threads replace complex worker-thread pooling patterns.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the difference between Decorator, Proxy, and Adapter patterns?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Adapter changes an incompatible interface to match what a client expects. Decorator keeps the same interface but enhances it with additional responsibilities dynamically. Proxy keeps the same interface but controls and manages access to the underlying object (e.g., lazy loading, security check, or caching).",
          },
        },
      ],
    },
  ],
};

export default function GofDesignPatternsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PillarPageLayout currentNav="design-patterns">
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 6 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: "center" }}>
              <Chip
                label="Software Architecture &amp; OOP"
                size="small"
                color="primary"
                sx={{ fontWeight: 700 }}
              />
              <Chip
                label="23 Gang of Four Patterns"
                size="small"
                variant="outlined"
              />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                20 min read &bull; Updated October 2026
              </Typography>
            </Stack>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                mb: 2,
              }}
            >
              GoF Design Patterns: The 23 Classic Patterns in Java 21 &amp; UML
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.35rem" },
                fontWeight: 400,
                color: "text.secondary",
                lineHeight: 1.6,
                maxWidth: "920px",
              }}
            >
              The definitive reference for all 23 Gang of Four software design patterns.
              Explore Creational, Structural, and Behavioral patterns with clean UML diagrams,
              production Java 21 implementations, and architectural trade-off comparisons.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
              <Link href="/design-patterns" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ fontWeight: 700, px: 3, py: 1.25 }}
                >
                  Open Interactive GoF Handbook
                </Button>
              </Link>
              <Link href="/design-patterns/uml-class-diagrams" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  sx={{ fontWeight: 600, px: 3, py: 1.25 }}
                >
                  UML Class Diagrams Guide
                </Button>
              </Link>
            </Stack>
          </Box>

          <Divider sx={{ mb: 6 }} />

          {/* Section 1: The Three Categories */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              1. The Three GoF Pattern Classifications
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              In 1994, Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides published <em>Design Patterns: Elements of Reusable Object-Oriented Software</em>.
              They grouped 23 patterns into three distinct scopes:
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 3, mb: 4 }}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>
                  Creational (5 Patterns)
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6, mb: 2 }}>
                  Abstract the instantiation process, making systems independent of how objects are created, composed, and represented.
                </Typography>
                <Typography variant="caption" sx={{ display: "block", color: "text.primary", fontWeight: 700 }}>
                  Singleton, Factory Method, Abstract Factory, Builder, Prototype
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "secondary.main", mb: 1 }}>
                  Structural (7 Patterns)
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6, mb: 2 }}>
                  Concern how classes and objects are composed to form larger structures while keeping relationships flexible and decoupled.
                </Typography>
                <Typography variant="caption" sx={{ display: "block", color: "text.primary", fontWeight: 700 }}>
                  Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#10b981", mb: 1 }}>
                  Behavioral (11 Patterns)
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6, mb: 2 }}>
                  Characterize the complex control flow, communication, and assignment of responsibilities between cooperating objects.
                </Typography>
                <Typography variant="caption" sx={{ display: "block", color: "text.primary", fontWeight: 700 }}>
                  Strategy, Observer, State, Command, Chain of Responsibility, Mediator, Iterator, Memento, Visitor, Template Method, Interpreter
                </Typography>
              </Paper>
            </Box>
          </Box>

          {/* Section 2: UML Blueprint */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              2. Architectural Blueprint: Strategy Pattern UML &amp; Execution Flow
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              The Strategy pattern enables algorithm family definition, encapsulating each algorithm into a separate
              class and making them interchangeable at runtime without mutating context clients:
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 3,
                bgcolor: "#070b14",
                color: "#38bdf8",
                fontFamily: "monospace",
                borderRadius: 2,
                overflowX: "auto",
                mb: 4,
              }}
            >
              <Typography component="pre" sx={{ m: 0, fontSize: "0.85rem", lineHeight: 1.5 }}>
{`+---------------------------------------------------------------------------------+
|                        STRATEGY PATTERN CLASS TOPOLOGY                          |
+---------------------------------------------------------------------------------+

              +------------------------+
              |     OrderProcessor     | (Context)
              +------------------------+
              | - strategy: PayStrategy|
              +------------------------+
              | + setStrategy(...)     |
              | + processOrder(...)    |
              +------------------------+
                          |
                          | <>------ (has-a composition)
                          v
              +------------------------+
              |     <<interface>>      |
              |     PaymentStrategy    | (Strategy)
              +------------------------+
              | + pay(amount: BigDecimal)
              +------------------------+
                ^          ^          ^
                |          |          |  (implements realization)
      +---------+    +-----+-----+    +---------+
      |              |           |              |
+-------------+ +-------------+ +-------------+ +-------------+
|CreditCardPay| | PayPalPay   | | ApplePay    | | CryptoPay   |
+-------------+ +-------------+ +-------------+ +-------------+`}
              </Typography>
            </Paper>
          </Box>

          {/* Section 3: Modern Java 21 Code */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              3. Modern Java 21 Implementation: Sealed Strategy &amp; Pattern Matching
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Leveraging Java 21 sealed interfaces and record patterns ensures compile-time exhaustive strategy evaluation:
            </Typography>

            <IntelliJCodeBlock
              title="Strategy Pattern — UML Class Model & Execution Strategy"
              code={`// =========================================================================
// UML CLASS MODEL: Strategy Pattern (Behavioral Family)
// <<interface>> Strategy Contract with Exhaustive Sealed Variants
// =========================================================================
public sealed interface PaymentStrategy 
    permits CreditCardStrategy, PayPalStrategy, CryptoStrategy {
    PaymentReceipt execute(BigDecimal amount);
}

// <<class>> ConcreteStrategyA
public record CreditCardStrategy(String cardNumber, String cvv) implements PaymentStrategy {
    @Override
    public PaymentReceipt execute(BigDecimal amount) {
        // Authorize with Stripe / Visa Gateway
        return new PaymentReceipt("TX-CC-" + UUID.randomUUID(), amount, Status.SUCCESS);
    }
}

// <<class>> ConcreteStrategyB
public record PayPalStrategy(String email) implements PaymentStrategy {
    @Override
    public PaymentReceipt execute(BigDecimal amount) {
        // Authorize via OAuth2 PayPal Token
        return new PaymentReceipt("TX-PP-" + UUID.randomUUID(), amount, Status.SUCCESS);
    }
}

// <<class>> ConcreteStrategyC
public record CryptoStrategy(String walletAddress) implements PaymentStrategy {
    @Override
    public PaymentReceipt execute(BigDecimal amount) {
        // Broadcast tx to RPC node
        return new PaymentReceipt("TX-BTC-" + UUID.randomUUID(), amount, Status.SUCCESS);
    }
}

// <<class>> Context: Algorithm Dispatcher & Pattern Matching Executor
public class CheckoutService {
    public PaymentReceipt checkout(BigDecimal amount, PaymentStrategy strategy) {
        // Compile-time exhaustive pattern matching evaluation
        return switch (strategy) {
            case CreditCardStrategy cc -> cc.execute(amount);
            case PayPalStrategy pp     -> pp.execute(amount);
            case CryptoStrategy crypto -> crypto.execute(amount);
        };
    }
}`}
            />
          </Box>

          {/* Section 4: Pattern Comparison Matrix */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              4. Key GoF Pattern Comparison Matrix
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Interviewers frequently test subtle distinctions between structurally similar patterns:
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: "action.hover" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Comparison</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Structural Similarity</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Fundamental Difference in Intent</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Primary Trade-off</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Strategy vs. State</TableCell>
                    <TableCell>Context class delegates behavior to an interface.</TableCell>
                    <TableCell>Strategy is chosen externally by client. State switches dynamically and automatically based on state machine lifecycle.</TableCell>
                    <TableCell>State creates higher coupling between concrete state classes; Strategy requires client to know algorithm choices.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Decorator vs. Proxy</TableCell>
                    <TableCell>Both wrap an object implementing the same interface.</TableCell>
                    <TableCell>Decorator dynamically adds behavior / features. Proxy controls and manages access (lazy loading, auth, caching).</TableCell>
                    <TableCell>Decorator can result in deeply nested wrapper chains; Proxy can hide expensive remote network calls.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Factory Method vs. Abstract Factory</TableCell>
                    <TableCell>Both abstract concrete object creation.</TableCell>
                    <TableCell>Factory Method uses inheritance and creates a single product. Abstract Factory uses composition to create families of related products.</TableCell>
                    <TableCell>Abstract Factory requires adding new factory methods across all concrete factories when a new product type is introduced.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Adapter vs. Facade</TableCell>
                    <TableCell>Both provide a wrapper around existing classes.</TableCell>
                    <TableCell>Adapter converts an incompatible interface to match a specific expected contract. Facade simplifies a complex subsystem interface.</TableCell>
                    <TableCell>Adapter preserves existing interfaces; Facade defines a brand-new higher-level interface.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Section 5: FAQ */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 3 }}>
              Frequently Asked Questions (GoF Design Patterns)
            </Typography>

            <Stack spacing={3}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  What is the key difference between Strategy Pattern and State Pattern?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  While both patterns share nearly identical UML class structures (a Context delegating to an Interface), their intent is fundamentally different. In the Strategy Pattern, the client explicitly chooses which interchangeable algorithm or strategy to inject into the Context. In the State Pattern, the Context changes its internal state transitions dynamically and automatically changes its behavior based on internal lifecycle triggers.
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  How does Java 21 modernize the classic GoF patterns?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  Modern Java 21 drastically reduces GoF boilerplate: Sealed Interfaces and Pattern Matching for switch replace complex Visitor patterns; Records replace verbose Data Transfer and Prototype classes; Lambdas and method references eliminate single-method Strategy and Command classes; and Virtual Threads replace complex worker-thread pooling patterns.
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  What is the difference between Decorator, Proxy, and Adapter patterns?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  Adapter changes an incompatible interface to match what a client expects. Decorator keeps the same interface but enhances it with additional responsibilities dynamically. Proxy keeps the same interface but controls and manages access to the underlying object (e.g., lazy loading, security check, or caching).
                </Typography>
              </Paper>
            </Stack>
          </Box>

          {/* CTA */}
          <Paper
            sx={{
              p: 5,
              borderRadius: 3,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              textAlign: "center",
              mb: 6,
            }}
          >
            <WidgetsRoundedIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
              Explore All 23 Interactive GoF Design Patterns
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "650px", mx: "auto", mb: 3 }}>
              Step through detailed UML diagrams, interactive code editors, edge cases,
              and interview trade-off questions for all 23 classic design patterns.
            </Typography>
            <Link href="/design-patterns" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{ fontWeight: 700, px: 4, py: 1.5 }}
              >
                Open GoF Design Patterns Handbook
              </Button>
            </Link>
          </Paper>
        </Container>
      </PillarPageLayout>
    </>
  );
}
