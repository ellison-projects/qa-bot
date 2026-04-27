#!/usr/bin/env tsx
import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';

/**
 * Takes screenshots of a website at different viewport sizes
 *
 * Usage: npm run screenshot <url> <output-dir>
 * Example: npm run screenshot https://keylistings.com/customers/duwest site-testing/keylistings/customers/duwest/screenshots
 */

interface ViewportConfig {
  name: string;
  width: number;
  height: number;
}

const VIEWPORTS: ViewportConfig[] = [
  { name: 'mobile', width: 375, height: 667 },      // iPhone SE / 8
  { name: 'mobile-large', width: 414, height: 896 }, // iPhone XR / 11
  { name: 'tablet', width: 768, height: 1024 },      // iPad
  { name: 'tablet-landscape', width: 1024, height: 768 }, // iPad landscape
  { name: 'desktop', width: 1920, height: 1080 },    // Full HD
  { name: 'desktop-laptop', width: 1440, height: 900 }, // MacBook Pro
];

async function takeScreenshots(url: string, outputDir: string) {
  console.log(`Creating screenshots for: ${url}`);
  console.log(`Output directory: ${outputDir}\n`);

  // Ensure output directory exists
  await mkdir(outputDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  for (const viewport of VIEWPORTS) {
    console.log(`📸 Capturing ${viewport.name} (${viewport.width}x${viewport.height})...`);

    // Set viewport
    await page.setViewport({
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 2, // Retina/high-DPI for crisp screenshots
    });

    // Navigate (or reload if already navigated)
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait a bit for any animations/transitions
    await new Promise(resolve => setTimeout(resolve, 500));

    // Take full page screenshot
    const fullFilename = `${viewport.name}-full.png`;
    const fullFilepath = join(outputDir, fullFilename);

    await page.screenshot({
      path: fullFilepath,
      fullPage: true,
    });

    // Take above-the-fold screenshot (viewport only, no scrolling)
    const foldFilename = `${viewport.name}.png`;
    const foldFilepath = join(outputDir, foldFilename);

    await page.screenshot({
      path: foldFilepath,
      fullPage: false, // Only capture visible viewport
    });

    console.log(`   ✓ Saved: ${foldFilename} (above fold) + ${fullFilename} (full page)`);
  }

  await browser.close();

  console.log(`\n✅ All screenshots saved to: ${outputDir}`);
  console.log('\nScreenshots taken (above-the-fold + full page):');
  VIEWPORTS.forEach(v => console.log(`  - ${v.name}.png + ${v.name}-full.png (${v.width}x${v.height})`));
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: npm run screenshot <url> <output-dir>');
  console.error('Example: npm run screenshot https://example.com site-testing/example/screenshots');
  process.exit(1);
}

const [url, outputDir] = args;

takeScreenshots(url, outputDir).catch((error) => {
  console.error('Error taking screenshots:', error);
  process.exit(1);
});
