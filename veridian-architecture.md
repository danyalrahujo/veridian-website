# Veridian — Enterprise AI & Analytics Website
## Architecture, Design System & Implementation Guide

This document covers the deliverables that sit behind `homepage.html`: information architecture, design system, component library, Next.js project structure, content/data models, SEO, and rollout strategy. Company name **Veridian** is a placeholder — swap throughout once a legal name is confirmed.

---

## 1. Information Architecture

```
/                          Home
/about                     Story, Mission, Vision, Values
/about/leadership
/about/careers
/services                  Services overview (hub)
/services/artificial-intelligence
/services/machine-learning
/services/data-analytics
/services/data-engineering
/services/cloud-mlops
/services/consulting
/industries                Industries overview (hub)
/industries/healthcare
/industries/finance
/industries/retail
/industries/manufacturing
/industries/logistics
/industries/education
/industries/government
/solutions                 Solutions overview (hub)
/solutions/executive-dashboards
/solutions/predictive-analytics
/solutions/ai-assistants
/solutions/fraud-detection
/solutions/forecasting
/solutions/document-intelligence
/solutions/automation
/case-studies               Filterable index
/case-studies/[slug]
/insights                   Blog index (search, filters, categories)
/insights/[slug]
/insights/authors/[slug]
/resources/whitepapers
/resources/faqs
/resources/documentation
/contact
```

Every hub page (`/services`, `/industries`, `/solutions`) is a real landing page, not a redirect — it earns its own SEO equity and links out to its children.

---

## 2. UX Strategy

- **Primary conversion path:** Hero CTA → Consultation booking (calendar placeholder) or Service/Solution page → CTA. Every template ends in a CTA band.
- **Secondary path:** Case studies / Insights → credibility → Contact.
- **Navigation model:** sticky header, mega menus for Services and Industries (breadth is a selling point — surface it, don't hide it behind one link), persistent "Schedule a Consultation" button distinct from all other nav actions.
- **Trust signals:** client logos in hero, metrics band directly below hero, case-study metrics stated as numbers not adjectives, testimonials attributed by title not just name.
- **Content depth:** decision-makers skim first, then verify. Each service/solution/industry template therefore front-loads a scannable value statement, then supplies the depth (architecture, metrics, FAQs) for the technical evaluator who reads further.

---

## 3. Design System

### Tokens
| Role | Value |
|---|---|
| Primary | `#0F172A` (Deep Navy) |
| Accent | `#2563EB` (Electric Blue) |
| Secondary | `#06B6D4` (Cyan) |
| Background | `#FFFFFF` / `#F8FAFC` |
| Text | `#1E293B` |
| Success | `#10B981` |
| Warning | `#F59E0B` |
| Border | `#E2E8F0` |

Gradients: only two permitted combinations — `Blue → Cyan` (accents, text gradients, top-of-card highlight bars) and `Navy → Blue` (dark bands, CTA panels). Never gradient body text or large fill areas.

### Type
- Display: **Space Grotesk** (headlines, stat numbers, nav logo) — used at 600–700 weight only, never for body copy.
- Body/UI: **Inter** (paragraphs, nav, buttons, forms).
- Scale: 56 / 36 / 32 / 24 / 19 / 15.5 / 14 / 12.5px, with `-0.02em` tracking on display sizes.

### Spacing & shape
- 8px base unit. Section vertical rhythm: 100px desktop / 64px mobile.
- Radius: 10px (buttons/inputs), 14–16px (cards), 28px (CTA band).
- Shadows: soft, colored-neutral (`rgba(15,23,42,.15)`), never pure black, always paired with a `translateY` lift on hover.

### Signature element
The hero **data lattice** — a small SVG network of nodes and connecting lines in three independently drifting clusters — is the one deliberately animated, "designed" element on the page. It visualizes "raw data becoming structured intelligence" without resorting to generic dashboard-mockup hero art. Everything else on the page stays quiet by comparison (subtle hover lifts, scroll reveals, animated counters) so this element reads as intentional rather than one effect among many.

---

## 4. Component Library

Reusable, each with default / hover / focus / disabled states and a dark-mode variant:

`Button` (primary, ghost, light) · `Card` (service, solution, case-study, testimonial) · `MetricStat` (animated counter) · `MegaMenu` · `Accordion` (FAQ) · `Timeline` (process) · `Badge` (technology/category tag) · `IndustryChip` · `TeamCard` · `BlogCard` · `ContactForm` · `Breadcrumb` · `CTASection`.

Build these first in isolation (Storybook or a `/dev/components` route) before assembling page templates — every page above is a composition of this list, not bespoke markup.

---

## 5. Next.js Project Structure

```
/app
  /(marketing)
    /about/...
    /services/[slug]/page.tsx
    /industries/[slug]/page.tsx
    /solutions/[slug]/page.tsx
    /case-studies/[slug]/page.tsx
    /insights/[slug]/page.tsx
    page.tsx                 (home)
    layout.tsx
  /api
    /contact/route.ts
    /newsletter/route.ts
    /consultation/route.ts
  sitemap.ts
  robots.ts
/components
  /ui        (shadcn primitives)
  /marketing (Hero, ServiceCard, MegaMenu, CTASection, ...)
/lib
  /cms       (Sanity client + queries)
  /seo       (metadata + JSON-LD builders)
  /db        (Drizzle/Prisma client)
/content     (MDX fallback content, if not fully CMS-driven)
/styles
/public
```

---

## 6. CMS Content Models (Sanity or equivalent)

- `service` — title, slug, hero, problemStatement, benefits[], approach, technologies[], industriesServed[], processSteps[], metrics[], faqs[], relatedCaseStudies[], seo
- `industry` — title, slug, challenges[], howAiHelps, solutionsOffered[], technologies[], relatedCaseStudies[], outcomes[]
- `solution` — title, slug, overview, businessValue, architectureDiagram (image/asset), workflow[], techStack[], benefits[], useCases[], timeline
- `caseStudy` — client (or anonymized label), industry ref, service refs, challenge, approach, results (metrics[]), quote
- `post` — title, slug, author ref, category, body (portable text), readingTime, relatedPosts[]
- `author` — name, title, bio, avatar
- `testimonial` — quote, name, title, company, industry ref

## 7. Database Schema (PostgreSQL, application data only — not marketing content)

```sql
leads(id, name, email, company, role, message, source_page, created_at)
consultation_requests(id, lead_id, preferred_time, status, created_at)
newsletter_subscribers(id, email, subscribed_at, status)
```
Marketing content lives in the CMS, not Postgres; Postgres holds transactional/lead data only, keeping the CMS the single source of truth for editorial content.

---

## 8. SEO Strategy

- Metadata API per route: unique title/description, canonical URL, Open Graph + Twitter card image per template.
- JSON-LD: `Organization` sitewide, `Service` on service pages, `Article` on blog posts, `BreadcrumbList` everywhere nested.
- Internal linking: every service links to relevant industries and solutions and vice versa (the hub pages in §1 exist specifically to carry this link equity).
- Dynamic `sitemap.xml` generated from CMS content at build/revalidate time; `robots.txt` allows all except `/api`.
- Target keyword clusters map to the six services and seven industries — one page per cluster, no keyword-cannibalizing duplicates.

---

## 9. Animation Strategy

- Page load: hero content fades/slides in once (~400ms stagger), not on every scroll.
- Scroll: reveal-on-enter for cards/stats, one time only (no re-trigger on scroll-up), using IntersectionObserver.
- Hover: 2–6px lift + shadow on cards, underline/arrow shift on links — consistent across every card type.
- Respect `prefers-reduced-motion` globally (disable non-essential animation).
- No parallax on text (accessibility + motion-sickness risk); parallax reserved for the hero background glow only, and kept subtle.

---

## 10. Accessibility Checklist (WCAG AA)

- Color contrast: navy-on-white and white-on-navy pass AA; verify cyan/blue accents are never used for text on white below AA (use navy or slate for body text; blue/cyan reserved for accents ≥18px or non-text UI).
- Visible keyboard focus ring on all interactive elements (buttons, links, form fields, mega-menu triggers).
- Mega menus operable via keyboard (Tab/Enter/Escape), not hover-only.
- All images/icons have alt text or `aria-hidden` if decorative.
- Form fields have associated `<label>`s and inline error messaging (not color-only).
- Heading hierarchy strictly nested (one `h1` per page).
- Reduced-motion media query respected (see §9).
- Lighthouse target: 95+ across Performance, Accessibility, Best Practices, SEO.

---

## 11. Deployment Strategy

- **Hosting:** Vercel, with Preview Deployments per PR for stakeholder review.
- **CMS:** Sanity Studio deployed separately (`studio.veridian.example`), webhook-triggers ISR revalidation on publish.
- **Environments:** `dev` → `staging` → `production`, with staging gated behind basic auth for pre-launch review.
- **Monitoring:** Vercel Analytics + Web Vitals reporting; error tracking via Sentry.
- **CI:** typecheck, lint, and Lighthouse CI on every PR; block merge on accessibility regressions.

## 12. Scalability Roadmap

1. **Phase 1 (Launch):** Home + 6 service pages + 7 industry pages + core solutions, static content, contact form.
2. **Phase 2:** Blog/insights with search & filtering, whitepaper gating (lead capture), full case-study library.
3. **Phase 3:** Client portal / project dashboards (auth via Clerk), personalized content by industry (edge middleware).
4. **Phase 4:** Multi-locale support (i18n routing), programmatic SEO for long-tail industry × use-case combinations.

---

*Companion file: `homepage.html` implements §3 (Design System) and the Home template from §1 as a static, framework-agnostic reference build. Production implementation should port this markup/CSS into the Next.js component structure in §5.*
