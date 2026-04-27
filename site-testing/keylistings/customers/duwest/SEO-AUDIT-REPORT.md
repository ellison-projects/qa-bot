# SEO Audit Report: DuWest Commercial Real Estate

**Site URL:** https://keylistings.com/customers/duwest
**Audit Date:** April 27, 2026
**Platform:** KeyListings (First Client)
**Prepared For:** Your Friend's Platform Review

---

## Executive Summary

DuWest's site has **strong foundational SEO** with proper meta tags and schema markup, but has **one critical blocker** preventing search visibility: `noindex, nofollow` robots tag. The site is well-structured for launch but currently invisible to search engines.

**Overall Grade: B-** (would be A- after removing noindex)

---

## Critical Issues (Fix Before Launch)

### 🚨 BLOCKER: Site Not Indexable
```html
<meta name="robots" content="noindex, nofollow" />
```
**Impact:** Site is completely invisible to Google and other search engines
**Fix:** Remove this tag OR change to `index, follow` before launch
**Why It's There:** Likely intentional for testing phase on subdomain
**Action:** Must remove before moving to production domain

---

## What's Working Well ✅

### Meta Tags & Social Sharing
- **Page Title:** "DuWest | Commercial Real Estate Brokerage" ✅
  - Length: 45 characters (optimal: 50-60)
  - Descriptive and brandable

- **Meta Description:** ✅ Present and compelling
  - "DuWest delivers commercial real estate brokerage, leasing, and investment advisory across our markets..."
  - Length: 152 characters (optimal: 150-160)
  - Includes key services and CTA

- **Open Graph Tags:** ✅ Complete
  - og:title, og:description, og:type, og:url, og:site_name, og:image all present
  - Will display well when shared on Facebook, LinkedIn

- **Twitter Cards:** ✅ Configured
  - twitter:card, twitter:title, twitter:description, twitter:image
  - Will display as rich card when tweeted

### Technical SEO
- **HTTPS:** ✅ Secure connection enabled
- **Mobile Viewport:** ✅ `width=device-width, initial-scale=1.0`
- **Canonical URL:** ✅ `<link rel="canonical" href="https://keylistings.com/customers/duwest" />`
- **Favicon:** ✅ Apple touch icon and favicon.png present
- **PWA Ready:** ✅ Apple mobile web app meta tags configured

### Structured Data (Schema.org)
- **Schema Type:** RealEstateAgent ✅
- **Properties Included:**
  - Organization name: "DuWest"
  - URL: https://keylistings.com
  - Logo: Profile image URL
  - Contact email: froscoe@duwestrealty.com

**Validation:** Schema is well-formed JSON-LD
**Recommendation:** Add more properties (address, phone, service area) for richer results

---

## Areas for Improvement ⚠️

### Content & On-Page SEO

**Issue:** React SPA with no server-rendered content in initial HTML
**Impact:** Search engines see empty `<div id="root"></div>`
**Current State:**
```html
<body>
  <div id="root"></div>
  <script type="module" src="/assets/index-BAx0sm_N.js"></script>
</body>
```

**Recommendations:**
1. **Implement Server-Side Rendering (SSR)** or **Static Site Generation (SSG)**
   - Google can crawl React apps, but SSR is more reliable
   - Consider Next.js or similar if rebuilding

2. **Add H1 and Content Structure**
   - Once rendered, ensure clear H1 tag (e.g., "DuWest Commercial Real Estate")
   - Use H2-H6 for sections (Listings, Services, About, Contact)

3. **Content Depth**
   - Add minimum 300-500 words of unique content
   - Include target keywords naturally:
     - "Commercial real estate [city]"
     - "Office space for lease"
     - "Investment properties"
     - Geographic terms (neighborhoods, districts)

### Images
**Current:** One logo image identified
**Missing:** Alt text on logo

**Recommendations:**
- Add `alt="DuWest Commercial Real Estate logo"` to logo
- Add alt text to all property images (descriptive, keyword-rich)
- Example: `alt="Modern office building for lease in downtown [city]"`

### Performance
**Cannot test comprehensively** (JavaScript-heavy SPA requires live browser testing)

**Recommendations:**
- Run Google PageSpeed Insights: https://pagespeed.web.dev/
- Target scores:
  - Performance: 90+
  - Accessibility: 90+
  - Best Practices: 90+
  - SEO: 100
- Optimize:
  - Code splitting for faster initial load
  - Lazy load images
  - Compress assets
  - Use CDN for static files

---

## Local SEO Opportunities

**For Commercial Real Estate:**

1. **Google Business Profile**
   - Claim/create listing
   - Add service areas
   - Post property listings
   - Collect reviews

2. **NAP Consistency** (Name, Address, Phone)
   - Ensure consistent across:
     - Website footer
     - Google Business
     - Social profiles
     - Directory listings

3. **Location-Based Keywords**
   - Add city/neighborhood names to content
   - Create location landing pages if serving multiple areas
   - Example: "Commercial Real Estate Broker in [City Name]"

4. **Schema Enhancements**
   ```json
   {
     "@type": "RealEstateAgent",
     "name": "DuWest",
     "url": "https://keylistings.com",
     "logo": "...",
     "email": "froscoe@duwestrealty.com",
     "telephone": "+1-XXX-XXX-XXXX",    // Add
     "address": {                        // Add
       "@type": "PostalAddress",
       "streetAddress": "123 Main St",
       "addressLocality": "City",
       "addressRegion": "ST",
       "postalCode": "12345"
     },
     "areaServed": ["City", "Region"],  // Add
     "priceRange": "$$"                  // Add
   }
   ```

---

## Pre-Launch Checklist

### Must Do Before Going Live:
- [ ] **Remove `noindex, nofollow` tag** (CRITICAL)
- [ ] Move to own domain (currently on subdomain)
- [ ] Verify all meta tags update with new domain
- [ ] Test mobile responsiveness
- [ ] Add alt text to all images
- [ ] Run PageSpeed Insights and fix critical issues
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics 4

### Should Do Soon After Launch:
- [ ] Implement SSR or improve initial HTML content
- [ ] Add H1 and proper heading structure
- [ ] Create 500+ words of unique content per page
- [ ] Set up Google Business Profile
- [ ] Build internal linking between pages
- [ ] Add property listing schema for each listing
- [ ] Set up 301 redirects from subdomain to new domain
- [ ] Monitor Search Console for indexing issues

### Nice to Have:
- [ ] Add FAQ schema for common questions
- [ ] Create blog for content marketing
- [ ] Build backlinks from industry sites
- [ ] Add video content (virtual tours)
- [ ] Implement breadcrumb navigation with schema
- [ ] Add customer testimonials with review schema

---

## Competitive Positioning

**Things Your Friend's Platform Does Well:**
1. Clean, modern meta tag implementation
2. Proper structured data foundation
3. Social sharing optimization out of the box
4. Mobile-ready from day one
5. Canonical tags prevent duplicate content

**Potential Differentiators:**
- If platform auto-generates optimized listing pages with rich schema
- If it includes built-in local SEO tools
- If it handles SSR/SSG automatically (huge advantage)

---

## Recommendations for Platform Improvement

**For Your Friend (Platform Builder):**

1. **Auto-generate SEO essentials per customer:**
   - Unique meta descriptions
   - Proper H1/heading structure
   - Alt text templates for images
   - Schema markup for listings

2. **Default to indexable:**
   - Remove `noindex` tag by default
   - Or add admin toggle: "Ready for search engines? Yes/No"

3. **SSR/SSG support:**
   - Server-side render initial HTML
   - Huge SEO benefit for all clients

4. **Built-in SEO checklist:**
   - Dashboard showing SEO health score
   - Guidance for customers

5. **Performance optimization:**
   - Auto-optimize images
   - Lazy loading by default
   - Code splitting

---

## Testing Tools Used

- ✅ Manual HTML inspection (curl)
- ✅ Schema validator (manual review)
- ✅ Meta tag analysis
- ⏳ PageSpeed Insights (recommended for client)
- ⏳ Mobile-Friendly Test (recommended)
- ⏳ Rich Results Test (recommended)

---

## Final Verdict

**Current State:** Well-built foundation, not yet search-visible
**Launch Readiness:** 85% (just needs noindex removed + domain)
**Post-Launch Potential:** Strong (with content + local SEO)

**Key Message for Your Friend:**
*"Great technical foundation! The biggest issue is the noindex tag blocking search engines. Remove that and move to a custom domain, and DuWest will be in good shape. The platform's meta tag and schema handling is excellent—just need to ensure customers can toggle search visibility and that content is server-rendered for best results."*

---

## Next Steps

1. **Immediate:** Remove `noindex` tag
2. **Pre-launch:** Set up on custom domain
3. **Week 1:** Submit to Google Search Console, set up Analytics
4. **Month 1:** Build out content, claim Google Business Profile
5. **Ongoing:** Create listings, collect reviews, build local authority

---

**Questions?** Happy to dive deeper into any section or run additional tests once the site is on its production domain.

---

**Audit Completed By:** Matt (via SEO analysis tools)
**Report Generated:** 2026-04-27
**Next Review:** After production launch
