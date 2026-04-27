#!/usr/bin/env tsx
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

/**
 * Runs Lighthouse audit locally (same engine as PageSpeed Insights)
 *
 * Usage: npm run lighthouse <url> [mobile|desktop]
 * Example: npm run lighthouse https://keylistings.com/customers/duwest mobile
 */

async function runLighthouse(url: string, formFactor: 'mobile' | 'desktop' = 'mobile') {
  console.log(`\n🔍 Running Lighthouse audit for: ${url}`);
  console.log(`📱 Form factor: ${formFactor}\n`);

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-setuid-sandbox'],
  });

  const options = {
    logLevel: 'error' as const,
    output: 'json' as const,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
    formFactor,
    screenEmulation: formFactor === 'mobile'
      ? { mobile: true, width: 375, height: 667, deviceScaleFactor: 2 }
      : { mobile: false, width: 1920, height: 1080, deviceScaleFactor: 1 },
  };

  try {
    const runnerResult = await lighthouse(url, options);

    if (!runnerResult) {
      throw new Error('Lighthouse returned no results');
    }

    await chrome.kill();

    const { lhr } = runnerResult;
    const { categories, audits } = lhr;

    // Convert scores to percentages
    const performance = Math.round((categories.performance?.score ?? 0) * 100);
    const accessibility = Math.round((categories.accessibility?.score ?? 0) * 100);
    const bestPractices = Math.round((categories['best-practices']?.score ?? 0) * 100);
    const seo = Math.round((categories.seo?.score ?? 0) * 100);

    // Display results
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 LIGHTHOUSE SCORES');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Performance:     ${getScoreEmoji(performance)} ${performance}/100`);
    console.log(`Accessibility:   ${getScoreEmoji(accessibility)} ${accessibility}/100`);
    console.log(`Best Practices:  ${getScoreEmoji(bestPractices)} ${bestPractices}/100`);
    console.log(`SEO:             ${getScoreEmoji(seo)} ${seo}/100`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('⚡ CORE WEB VITALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`First Contentful Paint:   ${audits['first-contentful-paint']?.displayValue ?? 'N/A'}`);
    console.log(`Largest Contentful Paint: ${audits['largest-contentful-paint']?.displayValue ?? 'N/A'}`);
    console.log(`Total Blocking Time:      ${audits['total-blocking-time']?.displayValue ?? 'N/A'}`);
    console.log(`Cumulative Layout Shift:  ${audits['cumulative-layout-shift']?.displayValue ?? 'N/A'}`);
    console.log(`Speed Index:              ${audits['speed-index']?.displayValue ?? 'N/A'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return {
      performance,
      accessibility,
      bestPractices,
      seo,
      metrics: {
        fcp: audits['first-contentful-paint']?.displayValue ?? 'N/A',
        lcp: audits['largest-contentful-paint']?.displayValue ?? 'N/A',
        tbt: audits['total-blocking-time']?.displayValue ?? 'N/A',
        cls: audits['cumulative-layout-shift']?.displayValue ?? 'N/A',
        si: audits['speed-index']?.displayValue ?? 'N/A',
      },
    };
  } catch (error) {
    await chrome.kill();
    throw error;
  }
}

function getScoreEmoji(score: number): string {
  if (score >= 90) return '🟢';
  if (score >= 50) return '🟠';
  return '🔴';
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Usage: npm run lighthouse <url> [mobile|desktop]');
  console.error('Example: npm run lighthouse https://example.com mobile');
  console.error('Form factor: mobile (default) or desktop');
  process.exit(1);
}

const [url, formFactor = 'mobile'] = args;

if (formFactor !== 'mobile' && formFactor !== 'desktop') {
  console.error('Form factor must be either "mobile" or "desktop"');
  process.exit(1);
}

runLighthouse(url, formFactor as 'mobile' | 'desktop').catch((error) => {
  console.error('❌ Error running Lighthouse:', error);
  process.exit(1);
});
