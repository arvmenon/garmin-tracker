# Garmin Tracker UI Wireframes

This document outlines low-fidelity wireframes and UI foundations for the Garmin Tracker product. All screens assume responsive behavior from mobile to desktop. High-fidelity mocks will be produced after review/approval of these wireframes and foundations.

## Responsive Layout Grid
- **Breakpoints:**
  - Mobile: 360–767 px, 4-column grid, 16 px gutter, 24 px margin.
  - Tablet: 768–1199 px, 8-column grid, 16 px gutter, 24 px margin.
  - Desktop: 1200+ px, 12-column grid, 20 px gutter, 32 px margin.
- **Key rules:**
  - Navigation collapses to a bottom bar on small mobile, left rail on tablet/desktop.
  - Cards use a max width of 420 px on mobile and 360 px columns on desktop for readability.
  - Charts reserve at least 2 columns on tablet and 4+ on desktop; tables become cards on mobile.
  - Sticky headers for page titles and primary actions on mobile; sticky sidebar filters on desktop when space allows.

## Theming
- **Light theme:** neutral background `#F7F8FB`, surface `#FFFFFF`, primary accent `#1E7EF2`, success `#20B57A`, warning `#F4A11E`, danger `#E44C4E`, text `#0F172A`/`#334155` for body/subtext.
- **Dark theme:** background `#0B1220`, surface `#111827`, primary `#4CA5FF`, success `#4ADE80`, warning `#FACC15`, danger `#F87171`, text `#E5E7EB`/`#9CA3AF`.
- **Shared rules:**
  - 8 px corner radius for cards and inputs; 4 px for chips and tags.
  - Buttons: primary (solid), secondary (outline), tertiary (text). 44x44 px minimum touch targets.
  - Iconography uses 20 px size with 16 px padding.
  - Theme-aware charts (axes, gridlines, fills) to maintain contrast in both modes.

## Accessibility Targets
- WCAG 2.1 AA contrast for text and interactive elements (4.5:1 for body, 3:1 for large text and icons).
- Keyboard navigable flows with visible focus rings (2 px, theme-aware color).
- Form fields include labels, helper/error text, and inline validation.
- Motion-reduced mode: minimize animations; provide preferences toggle in Settings.
- Screen reader support: landmarks for nav/header/main, ARIA labels for icons, descriptive chart summaries.

## Onboarding

### Goals
- Guide new users through account creation, provider linking (Garmin first), and consent.
- Surface progress and allow skipping non-blocking steps.

### Mobile Wireframe (stacked cards)
```
[Header: Logo + Skip]
[Progress bar 3/5]
[Card: Create account]
  - Email input
  - Password + show/hide
  - CTA: Continue
[Card: Link Garmin]
  - Garmin logo + "Connect" button
[Card: Permissions]
  - List with toggles
[Footer CTA: Continue]
```

### Desktop Wireframe (two-column)
```
| Left: Progress steps | Right: Active card |
| 1. Account           | [Card: form fields]|
| 2. Garmin connect    | [Secondary info]   |
| 3. Permissions       |                    |
| 4. Preferences       |                    |
```
- Left sidebar sticky; right column uses card width ~540 px.
- Error states inline with icons; persistent help link in header.

## Dashboards

### Goals
- Provide quick status of recent activities, sync health, and upcoming actions.
- Support role-based views (athlete vs coach/admin) via modular widgets.

### Layout
```
[Top bar: app title, theme toggle, profile menu]
[Subheader: filters (date range, activity type), manual sync button]
[Grid]
  - Hero card: last sync status, CTA to sync
  - Stats row: distance, time, calories, HR (4 cards)
  - Chart: activity volume (bars/lines)
  - Recent activities list (table on desktop, cards on mobile)
  - Alerts/ingestion errors panel
```
- On mobile, hero + stats become a vertical stack; chart uses horizontal scroll if needed.
- Admin sees additional widget for provider health and queue depth.

## Activity Detail

### Goals
- Show full activity metrics, map/route, laps/splits, and sharing options.

### Layout
```
[Header: back + activity title + actions (share/export/more)]
[Summary row]
  - Date/time, distance, duration, pace/speed, HR, power (if available)
[Tabs]
  - Overview (map, elevation chart, pace/HR graphs)
  - Splits (table; collapses to accordion on mobile)
  - Notes (coach/athlete comments)
  - Files & source (provider, file upload info, dedupe flag)
[Right rail on desktop]
  - Weather, device info, share settings
```
- Map panel minimum height 240 px; collapses to static thumbnail on low-bandwidth or reduced-motion mode.

## Comparisons

### Goals
- Allow users/coaches to compare activities or segments over time.

### Layout
```
[Header with selector: Compare by (time range | activities | segments)]
[Filters]
  - Multi-select activities
  - Metrics selector (pace, HR, power, cadence)
[Grid]
  - Dual charts (overlay lines/bars)
  - Table of key deltas (duration, pace, HR, power)
  - Insight callouts (e.g., "Cadence up 4% vs prior week")
```
- On mobile, comparison cards stack; charts use swipeable tabs to switch metrics.

## Settings

### Goals
- Manage account, notifications, data controls, and provider connections.

### Layout
```
[Left nav: Account, Notifications, Providers, Data, Accessibility]
[Right content card]
  - Account: profile, password, MFA
  - Notifications: channel toggles, digest frequency
  - Providers: Garmin connection status, re-auth, manual sync
  - Data: export/delete requests, retention info
  - Accessibility: font scale slider, reduce motion toggle, color-blind safe palette previews
```
- Mobile uses accordion sections with sticky save bar.

## Interaction & State Patterns
- **Validation:** Inline errors with iconography; summary banner for multi-field errors.
- **Empty states:** Provide action-oriented placeholders ("Connect Garmin to see activities"), with illustrations in high-fidelity phase.
- **Loading:** Skeletons for lists and charts; progress indicators for long sync tasks.
- **Notifications:** Toasts for transient success; inline banners for blocking issues (e.g., failed sync).

## Next Steps to High-Fidelity
1. Review and approve layouts and UX priorities above.
2. Lock typographic scale and component library references (e.g., spacing tokens, button states).
3. Produce high-fidelity mocks for primary breakpoints (mobile, tablet, desktop) per screen group.
4. Validate accessibility (contrast checks, keyboard flows) in final mocks.
