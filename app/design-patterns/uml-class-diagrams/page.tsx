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
import PillarPageLayout from "../../components/PillarPageLayout";

export const metadata: Metadata = {
  title: "UML Class Diagrams & Architecture Notation Guide",
  description: "Authoritative guide to UML class diagrams: class and interface anatomy, relationship notation, generalization, realization, composition, and GoF mappings.",
  alternates: {
    canonical: "https://www.gangsofdevelopers.com/design-patterns/uml-class-diagrams",
  },
  openGraph: {
    title: "UML Class Diagrams & Software Architecture Notation Guide",
    description:
      "Master UML class diagrams: class compartments, visibility symbols, 6 relationship types, and Gang of Four structural blueprints.",
    url: "https://www.gangsofdevelopers.com/design-patterns/uml-class-diagrams",
    siteName: "Gangs of Developers (GOD)",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "UML Class Diagrams & Software Architecture Notation Guide",
    description:
      "Master inheritance, realization, composition, aggregation, and GoF UML notation.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://www.gangsofdevelopers.com/design-patterns/uml-class-diagrams#article",
      "headline": "UML Class Diagrams & Software Architecture Notation Guide",
      "description":
        "Authoritative guide to UML class diagrams: class & interface anatomy, relationships (inheritance, realization, dependency, association, aggregation, composition), and GoF pattern mappings.",
      "url": "https://www.gangsofdevelopers.com/design-patterns/uml-class-diagrams",
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
        "UML Class Diagrams",
        "Unified Modeling Language",
        "Software Architecture",
        "Object Oriented Design",
        "Design Patterns UML",
        "Composition vs Aggregation",
      ],
      "inLanguage": "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.gangsofdevelopers.com/design-patterns/uml-class-diagrams#breadcrumb",
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
          "name": "Design Patterns",
          "item": "https://www.gangsofdevelopers.com/design-patterns",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "UML Class Diagrams",
          "item": "https://www.gangsofdevelopers.com/design-patterns/uml-class-diagrams",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.gangsofdevelopers.com/design-patterns/uml-class-diagrams#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the critical difference between Aggregation and Composition in UML?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Both represent 'has-a' part-whole relationships. In Aggregation (represented by an open hollow diamond ◇), the child parts can exist independently of the parent container (e.g., a Department has Professors; if the Department closes, Professors still exist). In Composition (represented by a filled solid diamond ◆), the child lifecycle is strictly tied to the parent: destroying the parent immediately destroys the child parts (e.g., an Order has OrderLineItems; deleting the Order deletes its line items).",
          },
        },
        {
          "@type": "Question",
          "name": "What are the visibility symbols in UML class diagrams?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The four standard visibility notations are: '+' indicates Public access; '-' indicates Private access; '#' indicates Protected access (accessible within class and subclasses); and '~' indicates Package/Default access (accessible within the same namespace or package).",
          },
        },
        {
          "@type": "Question",
          "name": "How is Realization visually distinguished from Generalization in UML?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Generalization (class inheritance) is drawn with a SOLID line ending in a closed hollow triangle arrow pointing to the superclass. Realization (interface implementation) is drawn with a DASHED line ending in the same closed hollow triangle arrow pointing to the interface.",
          },
        },
      ],
    },
  ],
};

export default function UmlClassDiagramsPage() {
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
                label="Software Architecture &amp; Modeling"
                size="small"
                color="primary"
                sx={{ fontWeight: 700 }}
              />
              <Chip
                label="UML Notation Guide"
                size="small"
                variant="outlined"
              />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                16 min read &bull; Updated October 2026
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
              UML Class Diagrams: Software Architecture Notation &amp; GoF Patterns
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
              The definitive reference for Unified Modeling Language (UML) class diagrams:
              class anatomies, visibility notation, the 6 core structural relationships, and pattern mappings.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
              <Link href="/gof-design-patterns" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ fontWeight: 700, px: 3, py: 1.25 }}
                >
                  GoF 23 Patterns Catalog
                </Button>
              </Link>
              <Link href="/design-patterns" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  sx={{ fontWeight: 600, px: 3, py: 1.25 }}
                >
                  Interactive Design Patterns Handbook
                </Button>
              </Link>
            </Stack>
          </Box>

          <Divider sx={{ mb: 6 }} />

          {/* Section 1: The 6 Relationships Blueprint */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              1. The 6 Core UML Relationships Blueprint
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Understanding the precise arrows and lines in UML diagrams is crucial for technical interviews
              and architectural documentation:
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
{`+-----------------------------------------------------------------------------------------+
|                         THE 6 ESSENTIAL UML CLASS RELATIONSHIPS                         |
+-----------------------------------------------------------------------------------------+

  1. Generalization (Inheritance):
     [ SubClass ] ─────────────────────────▷ [ SuperClass ]
     - Solid line with closed hollow triangle arrow pointing to parent class.
     - "is-a" relationship (e.g., Dog is-a Animal).

  2. Realization (Interface Implementation):
     [ ConcreteService ] ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄▷ [ <<interface>> Service ]
     - Dashed line with closed hollow triangle arrow pointing to interface.
     - "implements" contract.

  3. Dependency ("uses-a"):
     [ OrderService ] ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄> [ PaymentCalculator ]
     - Dashed line with open arrowhead.
     - Transient usage: parameter in a method or local variable.

  4. Association ("references"):
     [ Customer ] ─────────────────────────> [ OrderHistory ]
     - Solid line with open arrowhead.
     - Persistent reference stored as a field/attribute.

  5. Aggregation ("weak part-whole"):
     [ Department ] ◇──────────────────────> [ Professor ]
     - Solid line with open hollow diamond at container end.
     - Part can exist independently if whole is destroyed.

  6. Composition ("strong part-whole"):
     [ Order ] ◆───────────────────────────> [ OrderLineItem ]
     - Solid line with filled solid diamond at container end.
     - Part lifecycle is bound to whole: destroying Order destroys items.`}
              </Typography>
            </Paper>
          </Box>

          {/* Section 2: Class Anatomy */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              2. Class &amp; Interface Box Anatomy
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              A standard UML class diagram box contains three horizontal compartments:
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mb: 4 }}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>
                  Visibility Notation Symbols
                </Typography>
                <Box component="ul" sx={{ pl: 3, m: 0, "& li": { mb: 1.25, color: "text.secondary", lineHeight: 1.6 } }}>
                  <li><code>+</code> <strong>Public:</strong> Accessible to any class.</li>
                  <li><code>-</code> <strong>Private:</strong> Accessible only within this class.</li>
                  <li><code>#</code> <strong>Protected:</strong> Accessible within class and subclasses.</li>
                  <li><code>~</code> <strong>Package / Default:</strong> Accessible within the same package.</li>
                  <li><code>_</code> <em>Underline:</em> Denotes static attributes or static methods.</li>
                  <li><em>Italics:</em> Denotes abstract classes or abstract methods.</li>
                </Box>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "secondary.main", mb: 1 }}>
                  Multiplicity &amp; Cardinality
                </Typography>
                <Box component="ul" sx={{ pl: 3, m: 0, "& li": { mb: 1.25, color: "text.secondary", lineHeight: 1.6 } }}>
                  <li><code>0..1</code> Zero or one instance (optional).</li>
                  <li><code>1</code> Exactly one instance (mandatory).</li>
                  <li><code>*</code> or <code>0..*</code> Zero or many instances.</li>
                  <li><code>1..*</code> One or many instances (at least one required).</li>
                  <li><code>m..n</code> Specific range between m and n instances.</li>
                </Box>
              </Paper>
            </Box>
          </Box>

          {/* Section 3: Pattern Mapping */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 2 }}>
              3. UML Relationship Comparison Matrix
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
              Clear distinctions across coupling strengths and lifecycle bindings:
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: "action.hover" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Relationship</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Visual UML Symbol</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Coupling Strength</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Lifecycle Binding</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>GoF Pattern Example</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Generalization</TableCell>
                    <TableCell><code>───▷</code> (Solid + Hollow Triangle)</TableCell>
                    <TableCell>Very High (Inheritance)</TableCell>
                    <TableCell>Compile-time class hierarchy</TableCell>
                    <TableCell>Template Method, Factory Method</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Realization</TableCell>
                    <TableCell><code>┄┄┄▷</code> (Dashed + Hollow Triangle)</TableCell>
                    <TableCell>Medium (Interface contract)</TableCell>
                    <TableCell>Loose decoupling via polymorphism</TableCell>
                    <TableCell>Strategy, State, Command</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Composition</TableCell>
                    <TableCell><code>◆───</code> (Solid + Filled Diamond)</TableCell>
                    <TableCell>High (Cascading ownership)</TableCell>
                    <TableCell>Child dies when parent dies</TableCell>
                    <TableCell>Composite, Decorator</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Aggregation</TableCell>
                    <TableCell><code>◇───</code> (Solid + Hollow Diamond)</TableCell>
                    <TableCell>Medium (Container has parts)</TableCell>
                    <TableCell>Parts survive parent destruction</TableCell>
                    <TableCell>Flyweight, Object Pool</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Dependency</TableCell>
                    <TableCell><code>┄┄┄&gt;</code> (Dashed + Open Arrow)</TableCell>
                    <TableCell>Weakest (Transient method call)</TableCell>
                    <TableCell>No lifecycle or field reference</TableCell>
                    <TableCell>Abstract Factory client usage</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Section 4: FAQ */}
          <Box component="section" sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ fontSize: "1.75rem", fontWeight: 800, mb: 3 }}>
              Frequently Asked Questions (UML Class Diagrams)
            </Typography>

            <Stack spacing={3}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  What is the critical difference between Aggregation and Composition in UML?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  Both represent &apos;has-a&apos; part-whole relationships. In Aggregation (represented by an open hollow diamond ◇), the child parts can exist independently of the parent container (e.g., a Department has Professors; if the Department closes, Professors still exist). In Composition (represented by a filled solid diamond ◆), the child lifecycle is strictly tied to the parent: destroying the parent immediately destroys the child parts (e.g., an Order has OrderLineItems; deleting the Order deletes its line items).
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  What are the visibility symbols in UML class diagrams?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  The four standard visibility notations are: &apos;+&apos; indicates Public access; &apos;-&apos; indicates Private access; &apos;#&apos; indicates Protected access (accessible within class and subclasses); and &apos;~&apos; indicates Package/Default access (accessible within the same namespace or package).
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  How is Realization visually distinguished from Generalization in UML?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  Generalization (class inheritance) is drawn with a SOLID line ending in a closed hollow triangle arrow pointing to the superclass. Realization (interface implementation) is drawn with a DASHED line ending in the same closed hollow triangle arrow pointing to the interface.
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
              Apply UML Diagrams Across All 23 GoF Patterns
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "650px", mx: "auto", mb: 3 }}>
              Explore interactive class diagrams, sequence workflows, and modern Java 21 code
              for Creational, Structural, and Behavioral patterns.
            </Typography>
            <Link href="/gof-design-patterns" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{ fontWeight: 700, px: 4, py: 1.5 }}
              >
                Explore GoF Patterns Catalog
              </Button>
            </Link>
          </Paper>
        </Container>
      </PillarPageLayout>
    </>
  );
}
