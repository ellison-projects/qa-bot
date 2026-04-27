# Performance & Technical Report: DuWest

**Site:** https://keylistings.com/customers/duwest
**Test Date:** April 27, 2026
**Test Conditions:** Mobile (4G throttled)

---

## Lighthouse Scores

| Category | Score | Status |
|----------|-------|--------|
| **Performance** | 54/100 | 🟠 Needs Improvement |
| **Accessibility** | 81/100 | 🟠 Needs Improvement |
| **Best Practices** | 100/100 | 🟢 Excellent |
| **SEO** | 61/100 | 🟠 Needs Improvement |

---

## Core Web Vitals

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| **First Contentful Paint** | 6.9s | < 1.8s | 🔴 Poor |
| **Largest Contentful Paint** | 19.9s | < 2.5s | 🔴 Poor |
| **Total Blocking Time** | 150ms | < 200ms | 🟢 Good |
| **Cumulative Layout Shift** | 0.024 | < 0.1 | 🟢 Good |
| **Speed Index** | 11.0s | < 3.4s | 🔴 Poor |

---

## Key Performance Issues

### 🔴 Critical: Extremely Slow LCP (19.9s)
**What it means:** Users wait nearly 20 seconds before the main content is visible on mobile.

**Impact:**
- Most users will abandon the page before it loads
- Google heavily penalizes slow LCP in search rankings
- Poor user experience on mobile devices

**Likely Causes:**
- Large unoptimized images loading above the fold
- No image lazy loading or prioritization
- Render-blocking JavaScript (React SPA with no SSR)
- Slow server response time
- Heavy JavaScript bundle size

**Recommendations:**
1. Implement lazy loading for images
2. Optimize and compress all images (use WebP format)
3. Consider Server-Side Rendering (SSR) or Static Site Generation (SSG)
4. Implement code splitting to reduce initial bundle size
5. Use a CDN for static assets
6. Preload critical resources

---

## Accessibility Issues (Score: 81/100)

### Issues Found:
- **8 images missing alt text** - Screen readers can't describe these images
- Likely additional color contrast or ARIA issues (need detailed audit)

**Impact:**
- Poor experience for visually impaired users
- Fails WCAG accessibility standards
- Google considers accessibility as a ranking factor

**Recommendations:**
1. Add descriptive alt text to all 8 images
2. Run full accessibility audit for additional issues
3. Ensure color contrast meets WCAG AA standards

---

## SEO Issues (Score: 61/100)

### Primary Issue: `noindex` Tag
The site has `<meta name="robots" content="noindex, nofollow" />` blocking all search engines.

**Other Potential Issues:**
- May have additional crawlability issues
- Check for missing structured data
- Verify sitemap.xml exists and is submitted

**Note:** Once noindex is removed, SEO score should improve significantly (likely to 90+).

---

## What's Working Well ✅

| Item | Status |
|------|--------|
| **Best Practices** | 100/100 - Perfect score |
| **Layout Stability** | CLS of 0.024 (excellent) |
| **Blocking Time** | 150ms (good) |
| **HTTPS** | Secure connection enabled |
| **Meta Tags** | Complete and well-formed |

---

## Recommendations Summary

### Immediate (Before Launch):
1. Remove `noindex` tag
2. Add alt text to 8 images
3. Optimize images (compress, use WebP)

### High Priority (Performance):
1. Implement image lazy loading
2. Reduce JavaScript bundle size (code splitting)
3. Enable CDN for static assets
4. Consider SSR/SSG for React app

### Medium Priority:
1. Run full accessibility audit
2. Set up performance monitoring
3. Create performance budget
4. Test on real mobile devices

---

## Testing Tools Used

- **Lighthouse 13.1.0** (via Puppeteer Chrome)
- **Network:** Simulated 4G throttling
- **Device:** Emulated mobile (375x667, 2x DPI)

---

**Note:** Performance scores on real-world conditions may vary. These tests simulate slower mobile networks to identify worst-case scenarios.
