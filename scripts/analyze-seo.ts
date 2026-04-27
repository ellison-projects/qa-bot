#!/usr/bin/env tsx
import puppeteer from 'puppeteer';

/**
 * Analyzes a website like Google does - with JavaScript rendering
 *
 * Usage: npm run analyze <url>
 * Example: npm run analyze https://keylistings.com/customers/duwest
 */

interface SEOAnalysis {
  url: string;
  title: string;
  metaDescription: string | null;
  h1Tags: string[];
  h2Tags: string[];
  h3Tags: string[];
  allHeadings: { level: string; text: string }[];
  images: { src: string; alt: string }[];
  links: { href: string; text: string; isExternal: boolean }[];
  wordCount: number;
  robotsTag: string | null;
  canonicalUrl: string | null;
  openGraphTags: Record<string, string>;
  structuredData: any[];
  performance: {
    loadTime: number;
    domContentLoaded: number;
  };
}

async function analyzeSEO(url: string): Promise<SEOAnalysis> {
  console.log(`Launching browser...`);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Track performance
  const startTime = Date.now();
  let domContentLoadedTime = 0;

  page.on('domcontentloaded', () => {
    domContentLoadedTime = Date.now() - startTime;
  });

  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  const loadTime = Date.now() - startTime;

  console.log(`Page loaded. Extracting SEO data...`);

  const analysis = await page.evaluate((pageUrl) => {
    const result: Partial<SEOAnalysis> = {
      url: pageUrl,
      title: document.title,
      metaDescription: null,
      h1Tags: [],
      h2Tags: [],
      h3Tags: [],
      allHeadings: [],
      images: [],
      links: [],
      wordCount: 0,
      robotsTag: null,
      canonicalUrl: null,
      openGraphTags: {},
      structuredData: [],
    };

    // Meta tags
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      result.metaDescription = metaDesc.getAttribute('content');
    }

    const robotsMeta = document.querySelector('meta[name="robots"]');
    if (robotsMeta) {
      result.robotsTag = robotsMeta.getAttribute('content');
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      result.canonicalUrl = canonical.getAttribute('href');
    }

    // Open Graph tags
    const ogTags = document.querySelectorAll('meta[property^="og:"]');
    ogTags.forEach((tag) => {
      const property = tag.getAttribute('property');
      const content = tag.getAttribute('content');
      if (property && content) {
        result.openGraphTags![property] = content;
      }
    });

    // Headings
    const h1s = document.querySelectorAll('h1');
    result.h1Tags = Array.from(h1s).map((h) => h.textContent?.trim() || '');

    const h2s = document.querySelectorAll('h2');
    result.h2Tags = Array.from(h2s).map((h) => h.textContent?.trim() || '');

    const h3s = document.querySelectorAll('h3');
    result.h3Tags = Array.from(h3s).map((h) => h.textContent?.trim() || '');

    // All headings with levels
    const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    result.allHeadings = Array.from(allHeadings).map((h) => ({
      level: h.tagName,
      text: h.textContent?.trim() || '',
    }));

    // Images
    const imgs = document.querySelectorAll('img');
    result.images = Array.from(imgs).map((img) => ({
      src: img.getAttribute('src') || '',
      alt: img.getAttribute('alt') || '',
    }));

    // Links
    const anchors = document.querySelectorAll('a[href]');
    result.links = Array.from(anchors).map((a) => {
      const href = a.getAttribute('href') || '';
      const text = a.textContent?.trim() || '';
      const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
      return { href, text, isExternal };
    });

    // Word count (approximate)
    const bodyText = document.body.textContent || '';
    const words = bodyText.trim().split(/\s+/).filter((w) => w.length > 0);
    result.wordCount = words.length;

    // Structured data (JSON-LD)
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    result.structuredData = Array.from(scripts).map((script) => {
      try {
        return JSON.parse(script.textContent || '{}');
      } catch {
        return null;
      }
    }).filter((data) => data !== null);

    return result;
  }, url);

  await browser.close();

  return {
    ...analysis,
    performance: {
      loadTime,
      domContentLoaded: domContentLoadedTime,
    },
  } as SEOAnalysis;
}

function printAnalysis(analysis: SEOAnalysis) {
  console.log('\n' + '='.repeat(80));
  console.log('SEO ANALYSIS REPORT (JavaScript Rendered - Like Google Sees It)');
  console.log('='.repeat(80));

  console.log(`\n📊 URL: ${analysis.url}`);
  console.log(`⏱️  Load Time: ${analysis.performance.loadTime}ms`);
  console.log(`⏱️  DOM Ready: ${analysis.performance.domContentLoaded}ms`);

  console.log('\n--- BASIC META TAGS ---');
  console.log(`Title: ${analysis.title} (${analysis.title.length} chars)`);
  console.log(`Meta Description: ${analysis.metaDescription || 'MISSING ❌'}`);
  if (analysis.metaDescription) {
    console.log(`  Length: ${analysis.metaDescription.length} chars`);
  }
  console.log(`Robots Tag: ${analysis.robotsTag || 'None (default: index, follow)'}`);
  console.log(`Canonical URL: ${analysis.canonicalUrl || 'None'}`);

  console.log('\n--- HEADING STRUCTURE ---');
  console.log(`H1 Tags (${analysis.h1Tags.length}): ${analysis.h1Tags.length === 1 ? '✅' : '⚠️'}`);
  analysis.h1Tags.forEach((h1, i) => {
    console.log(`  H1 #${i + 1}: "${h1}"`);
  });

  console.log(`\nH2 Tags (${analysis.h2Tags.length}):`);
  analysis.h2Tags.slice(0, 5).forEach((h2, i) => {
    console.log(`  H2 #${i + 1}: "${h2}"`);
  });
  if (analysis.h2Tags.length > 5) {
    console.log(`  ... and ${analysis.h2Tags.length - 5} more`);
  }

  console.log(`\nH3 Tags (${analysis.h3Tags.length}):`);
  analysis.h3Tags.slice(0, 3).forEach((h3, i) => {
    console.log(`  H3 #${i + 1}: "${h3}"`);
  });
  if (analysis.h3Tags.length > 3) {
    console.log(`  ... and ${analysis.h3Tags.length - 3} more`);
  }

  console.log('\n--- CONTENT ---');
  console.log(`Word Count: ${analysis.wordCount}`);
  if (analysis.wordCount < 300) {
    console.log(`  ⚠️  Low content (recommended: 300+ words)`);
  } else {
    console.log(`  ✅ Sufficient content`);
  }

  console.log('\n--- IMAGES ---');
  console.log(`Total Images: ${analysis.images.length}`);
  const missingAlt = analysis.images.filter((img) => !img.alt || img.alt.trim() === '');
  console.log(`Missing Alt Text: ${missingAlt.length} ${missingAlt.length > 0 ? '⚠️' : '✅'}`);
  if (missingAlt.length > 0 && missingAlt.length <= 5) {
    missingAlt.forEach((img) => {
      console.log(`  ⚠️  ${img.src.substring(0, 60)}...`);
    });
  }

  console.log('\n--- LINKS ---');
  const internalLinks = analysis.links.filter((l) => !l.isExternal);
  const externalLinks = analysis.links.filter((l) => l.isExternal);
  console.log(`Internal Links: ${internalLinks.length}`);
  console.log(`External Links: ${externalLinks.length}`);

  console.log('\n--- OPEN GRAPH (Social Sharing) ---');
  const ogKeys = Object.keys(analysis.openGraphTags);
  if (ogKeys.length > 0) {
    console.log('✅ Open Graph tags present:');
    ogKeys.forEach((key) => {
      const value = analysis.openGraphTags[key];
      console.log(`  ${key}: ${value.substring(0, 60)}${value.length > 60 ? '...' : ''}`);
    });
  } else {
    console.log('❌ No Open Graph tags found');
  }

  console.log('\n--- STRUCTURED DATA (Schema.org) ---');
  if (analysis.structuredData.length > 0) {
    console.log(`✅ ${analysis.structuredData.length} JSON-LD script(s) found:`);
    analysis.structuredData.forEach((data, i) => {
      console.log(`  #${i + 1}: @type = ${data['@type'] || 'Unknown'}`);
      if (data.name) console.log(`      name: ${data.name}`);
      if (data.url) console.log(`      url: ${data.url}`);
    });
  } else {
    console.log('❌ No structured data found');
  }

  console.log('\n--- CRITICAL ISSUES ---');
  const issues: string[] = [];

  if (analysis.robotsTag?.includes('noindex')) {
    issues.push('🚨 CRITICAL: noindex tag prevents search engine indexing!');
  }
  if (analysis.h1Tags.length === 0) {
    issues.push('⚠️  No H1 tag found');
  }
  if (analysis.h1Tags.length > 1) {
    issues.push('⚠️  Multiple H1 tags (should be only 1)');
  }
  if (!analysis.metaDescription) {
    issues.push('⚠️  Missing meta description');
  }
  if (missingAlt.length > 0) {
    issues.push(`⚠️  ${missingAlt.length} image(s) missing alt text`);
  }
  if (analysis.wordCount < 300) {
    issues.push('⚠️  Low content (< 300 words)');
  }

  if (issues.length > 0) {
    issues.forEach((issue) => console.log(issue));
  } else {
    console.log('✅ No critical issues found!');
  }

  console.log('\n' + '='.repeat(80));
}

// Main
const url = process.argv[2];
if (!url) {
  console.error('Usage: npm run analyze <url>');
  console.error('Example: npm run analyze https://keylistings.com/customers/duwest');
  process.exit(1);
}

analyzeSEO(url)
  .then(printAnalysis)
  .catch((err) => {
    console.error('Error analyzing site:', err.message);
    process.exit(1);
  });
