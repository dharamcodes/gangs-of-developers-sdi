import fs from "fs";
import path from "path";

const OUT_DIR = path.join(process.cwd(), "out");

const EXPECTED_ROUTES = [
  { file: "index.html", url: "https://www.gangsofdevelopers.com" },
  { file: "system-design.html", url: "https://www.gangsofdevelopers.com/system-design", alt: "system-design/index.html" },
  { file: "distributed-systems.html", url: "https://www.gangsofdevelopers.com/distributed-systems", alt: "distributed-systems/index.html" },
  { file: "microservices.html", url: "https://www.gangsofdevelopers.com/microservices", alt: "microservices/index.html" },
  { file: "microservices-design-patterns.html", url: "https://www.gangsofdevelopers.com/microservices-design-patterns", alt: "microservices-design-patterns/index.html" },
  { file: "design-patterns.html", url: "https://www.gangsofdevelopers.com/design-patterns", alt: "design-patterns/index.html" },
  { file: "gof-design-patterns.html", url: "https://www.gangsofdevelopers.com/gof-design-patterns", alt: "gof-design-patterns/index.html" },
  { file: "design-patterns/uml-class-diagrams.html", url: "https://www.gangsofdevelopers.com/design-patterns/uml-class-diagrams", alt: "design-patterns/uml-class-diagrams/index.html" },
  { file: "backend-engineering.html", url: "https://www.gangsofdevelopers.com/backend-engineering", alt: "backend-engineering/index.html" },
  { file: "java.html", url: "https://www.gangsofdevelopers.com/java", alt: "java/index.html" },
  { file: "spring-boot.html", url: "https://www.gangsofdevelopers.com/spring-boot", alt: "spring-boot/index.html" },
  { file: "kafka.html", url: "https://www.gangsofdevelopers.com/kafka", alt: "kafka/index.html" },
  { file: "company-wise-problems.html", url: "https://www.gangsofdevelopers.com/company-wise-problems", alt: "company-wise-problems/index.html" },
  { file: "free-course.html", url: "https://www.gangsofdevelopers.com/free-course", alt: "free-course/index.html" },
  { file: "author.html", url: "https://www.gangsofdevelopers.com/author", alt: "author/index.html" },
];

console.log("=================================================");
console.log("  GANGS OF DEVELOPERS - SEO VERIFICATION AUDITOR  ");
console.log("=================================================\n");

if (!fs.existsSync(OUT_DIR)) {
  console.error("❌ 'out' directory not found! Run 'npm run build' first.");
  process.exit(1);
}

let totalErrors = 0;
let totalWarnings = 0;
let passedPages = 0;

for (const route of EXPECTED_ROUTES) {
  let filePath = path.join(OUT_DIR, route.file);
  if (!fs.existsSync(filePath) && route.alt) {
    const altPath = path.join(OUT_DIR, route.alt);
    if (fs.existsSync(altPath)) {
      filePath = altPath;
    }
  }

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing static HTML file: ${route.file}`);
    totalErrors++;
    continue;
  }

  const html = fs.readFileSync(filePath, "utf8");
  const sizeKb = (Buffer.byteLength(html, "utf8") / 1024).toFixed(1);
  console.log(`\n🔍 Checking: ${route.url} (${sizeKb} KB)`);

  // 1. File size verification (ensure not an empty 13KB shell)
  if (parseFloat(sizeKb) < 25) {
    console.warn(`  ⚠️ Warning: Page size is only ${sizeKb} KB. Ensure static content is pre-rendered.`);
    totalWarnings++;
  } else {
    console.log(`  ✅ Pre-rendered static payload verified (${sizeKb} KB).`);
  }

  // 2. Title tag
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch) {
    console.error(`  ❌ Missing <title> tag!`);
    totalErrors++;
  } else {
    const title = titleMatch[1];
    console.log(`  ✅ Title (${title.length} chars): "${title}"`);
    if (title.length > 75) {
      console.warn(`  ⚠️ Title exceeds 75 characters.`);
      totalWarnings++;
    }
  }

  // 3. Meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
  if (!descMatch) {
    console.error(`  ❌ Missing <meta name="description">!`);
    totalErrors++;
  } else {
    const desc = descMatch[1];
    console.log(`  ✅ Description (${desc.length} chars): "${desc.slice(0, 80)}..."`);
    if (desc.length < 50 || desc.length > 170) {
      console.warn(`  ⚠️ Description length (${desc.length}) is outside 50-170 char range.`);
      totalWarnings++;
    }
  }

  // 4. Canonical tag
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
                         html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  if (!canonicalMatch) {
    console.error(`  ❌ Missing canonical tag!`);
    totalErrors++;
  } else {
    const canonical = canonicalMatch[1];
    console.log(`  ✅ Canonical: ${canonical}`);
    if (!canonical.startsWith("https://www.gangsofdevelopers.com")) {
      console.error(`  ❌ Canonical must be absolute HTTPS URL starting with https://www.gangsofdevelopers.com: found "${canonical}"`);
      totalErrors++;
    }
  }

  // 5. H1 tag
  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  if (!h1Matches || h1Matches.length === 0) {
    console.error(`  ❌ Missing <h1> tag!`);
    totalErrors++;
  } else if (h1Matches.length > 1) {
    console.warn(`  ⚠️ Multiple (${h1Matches.length}) <h1> tags found!`);
    totalWarnings++;
  } else {
    const h1Text = h1Matches[0].replace(/<[^>]+>/g, "").trim();
    console.log(`  ✅ Single H1: "${h1Text.slice(0, 60)}..."`);
  }

  // 6. JSON-LD Structured Data
  const jsonLdMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (!jsonLdMatches || jsonLdMatches.length === 0) {
    console.error(`  ❌ Missing JSON-LD structured data script!`);
    totalErrors++;
  } else {
    console.log(`  ✅ JSON-LD structured data detected (${jsonLdMatches.length} script blocks).`);
    for (const block of jsonLdMatches) {
      const content = block.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "").trim();
      try {
        const parsed = JSON.parse(content);
        const types = parsed["@graph"] ? parsed["@graph"].map((g) => g["@type"]).join(", ") : parsed["@type"];
        console.log(`     - Schema types: ${types}`);
      } catch (e) {
        console.error(`  ❌ Invalid JSON in ld+json script block: ${e.message}`);
        totalErrors++;
      }
    }
  }

  // 7. Forbidden words check
  // Check for "Alex" + "Xu"
  if (/alex\s+xu/i.test(html)) {
    console.error(`  ❌ FORBIDDEN AUTHOR NAME DETECTED!`);
    totalErrors++;
  }
  // Check for "Staff+" or "Staff-level" or "Staff engineer"
  if (/staff\+/i.test(html) || /staff-level/i.test(html) || /staff\s+engineer/i.test(html)) {
    console.error(`  ❌ FORBIDDEN ROLE WORD 'Staff' DETECTED IN OUTPUT HTML!`);
    totalErrors++;
  }

  passedPages++;
}

// 8. Verify Sitemap & Robots
console.log("\n🔍 Checking Sitemap and Robots files...");
const sitemapPath = path.join(OUT_DIR, "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
  const sitemapXml = fs.readFileSync(sitemapPath, "utf8");
  const locCount = (sitemapXml.match(/<loc>/g) || []).length;
  console.log(`  ✅ sitemap.xml exists with ${locCount} indexed URLs.`);
  if (locCount < 14) {
    console.error(`  ❌ sitemap.xml contains only ${locCount} URLs; expected at least 14.`);
    totalErrors++;
  }
} else {
  console.error(`  ❌ sitemap.xml missing in out/`);
  totalErrors++;
}

const robotsPath = path.join(OUT_DIR, "robots.txt");
if (fs.existsSync(robotsPath)) {
  const robotsTxt = fs.readFileSync(robotsPath, "utf8");
  if (robotsTxt.includes("Allow: /") && robotsTxt.includes("Sitemap:")) {
    console.log(`  ✅ robots.txt properly configured with Allow and Sitemap directives.`);
  } else {
    console.error(`  ❌ robots.txt missing standard directives.`);
    totalErrors++;
  }
} else {
  console.error(`  ❌ robots.txt missing in out/`);
  totalErrors++;
}

console.log("\n=================================================");
console.log(`  AUDIT COMPLETE: ${passedPages} pages checked`);
console.log(`  Errors: ${totalErrors}`);
console.log(`  Warnings: ${totalWarnings}`);
console.log("=================================================");

if (totalErrors > 0) {
  process.exit(1);
} else {
  console.log("🎉 ALL SEO AUDIT INVARIANTS PASSED SUCCESSFULLY!\n");
  process.exit(0);
}
