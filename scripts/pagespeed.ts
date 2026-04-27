#!/usr/bin/env tsx

/**
 * Checks Google PageSpeed Insights scores for a URL
 *
 * Usage: npm run pagespeed <url>
 * Example: npm run pagespeed https://keylistings.com/customers/duwest
 */

interface PageSpeedResponse {
  lighthouseResult: {
    categories: {
      performance: { score: number };
      accessibility: { score: number };
      'best-practices': { score: number };
      seo: { score: number };
    };
    audits: {
      'first-contentful-paint': { displayValue: string };
      'largest-contentful-paint': { displayValue: string };
      'total-blocking-time': { displayValue: string };
      'cumulative-layout-shift': { displayValue: string };
      'speed-index': { displayValue: string };
    };
  };
}

async function checkPageSpeed(url: string, strategy: 'mobile' | 'desktop' = 'mobile') {
  console.log(`\n🔍 Checking PageSpeed Insights for: ${url}`);
  console.log(`📱 Strategy: ${strategy}\n`);

  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`PageSpeed API returned ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as PageSpeedResponse;
    const { categories, audits } = data.lighthouseResult;

    // Convert scores to percentages
    const performance = Math.round(categories.performance.score * 100);
    const accessibility = Math.round(categories.accessibility.score * 100);
    const bestPractices = Math.round(categories['best-practices'].score * 100);
    const seo = Math.round(categories.seo.score * 100);

    // Display results
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SCORES');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Performance:     ${getScoreEmoji(performance)} ${performance}/100`);
    console.log(`Accessibility:   ${getScoreEmoji(accessibility)} ${accessibility}/100`);
    console.log(`Best Practices:  ${getScoreEmoji(bestPractices)} ${bestPractices}/100`);
    console.log(`SEO:             ${getScoreEmoji(seo)} ${seo}/100`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('⚡ CORE WEB VITALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`First Contentful Paint:  ${audits['first-contentful-paint'].displayValue}`);
    console.log(`Largest Contentful Paint: ${audits['largest-contentful-paint'].displayValue}`);
    console.log(`Total Blocking Time:     ${audits['total-blocking-time'].displayValue}`);
    console.log(`Cumulative Layout Shift: ${audits['cumulative-layout-shift'].displayValue}`);
    console.log(`Speed Index:             ${audits['speed-index'].displayValue}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return {
      performance,
      accessibility,
      bestPractices,
      seo,
      metrics: {
        fcp: audits['first-contentful-paint'].displayValue,
        lcp: audits['largest-contentful-paint'].displayValue,
        tbt: audits['total-blocking-time'].displayValue,
        cls: audits['cumulative-layout-shift'].displayValue,
        si: audits['speed-index'].displayValue,
      },
    };
  } catch (error) {
    console.error('❌ Error fetching PageSpeed data:', error);
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
  console.error('Usage: npm run pagespeed <url> [strategy]');
  console.error('Example: npm run pagespeed https://example.com mobile');
  console.error('Strategy: mobile (default) or desktop');
  process.exit(1);
}

const [url, strategy = 'mobile'] = args;

if (strategy !== 'mobile' && strategy !== 'desktop') {
  console.error('Strategy must be either "mobile" or "desktop"');
  process.exit(1);
}

checkPageSpeed(url, strategy as 'mobile' | 'desktop').catch((error) => {
  console.error('Error running PageSpeed check:', error);
  process.exit(1);
});
