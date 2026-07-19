# FIFA Nexus AI

An AI-powered stadium operations platform for FIFA World Cup 2026, designed to enhance the fan experience, streamline volunteer coordination, and provide real-time operational intelligence across stadiums, transportation, and security.

## Features

- **Command Center** — Unified operational dashboard with live KPIs, crowd intelligence, and incident monitoring
- **Digital Twin** — 3D stadium visualization with real-time sensor overlays
- **AI Copilots** — Dedicated assistants for Fans, Volunteers, Organizers, Security, and Operations teams
- **Smart Navigation & Transport** — Wayfinding, transit routing, and crowd-aware mobility
- **Sustainability Intelligence** — Environmental metrics and carbon footprint tracking
- **Accessibility Center** — Inclusive services with multilingual support (12 languages)
- **Security & Monitoring** — Threat detection, observability, and offline emergency mode
- **KPI/ROI Dashboard** — Executive analytics with cost-benefit analysis
- **Testing Dashboard** — In-app visibility into test health across all layers

## Tech Stack

- **Frontend**: React 18 + TypeScript (strict mode) + Vite
- **Styling**: Tailwind CSS + Lucide icons
- **Backend**: Supabase (auth, database, edge functions)
- **Testing**: Vitest + React Testing Library, Playwright
- **CI/CD**: GitHub Actions

## Getting Started

```bash
npm install
npm run dev          # start dev server
npm run build        # production build
npm run typecheck    # type-check
npm run lint         # lint
```

## Testing

```bash
npm test             # run all unit/integration tests
npm run test:watch   # watch mode
npm run test:coverage  # with coverage report (thresholds enforced)
npm run test:e2e     # Playwright E2E across 5 user journeys
npm run test:all     # unit + coverage + E2E
```

### Test layers

| Layer | Tooling | Scope |
|-------|---------|-------|
| Unit | Vitest + RTL | Utils, AI agents, mock data, UI components (~180 component tests) |
| Integration | Vitest + RTL | Auth provider, RBAC, navigation, error boundaries |
| E2E | Playwright | Fan, Volunteer, Organizer, Security, Ops journeys |
| Security | Vitest | SQL/XSS/prompt injection, input validation, session token safety, RBAC |
| Accessibility | Vitest + jest-dom | WCAG 2.1 AA: ARIA, focus management, semantic HTML, keyboard nav |
| AI Quality | Vitest | Hallucination, confidence scores, agent routing, safety guardrails |
| Performance | Vitest | Render speed, 100K concurrent user load, stress/spike, throughput |

## Architecture

```
src/
├── components/
│   ├── ui/           # Reusable primitives (Button, Card, Gauge, KpiCard, Progress, Sparkline, StateViews, ChatPanel)
│   ├── views/        # Feature views (lazy-loaded, 18 chunks)
│   ├── shell/        # AppShell layout
│   ├── auth/         # SignIn
│   └── landing/      # Landing page
├── context/          # AuthContext (RBAC, session persistence)
├── hooks/            # useChat, useLocalStorage, useInterval
├── lib/              # ai-agents, mock-data, security, supabase, utils
└── types/            # Shared TypeScript types
```

### Key design decisions

- **DRY**: Shared `useChat` hook + `ChatPanel` component extracted from FanCopilot/VolunteerCopilot (~90 lines deduplicated per view)
- **Security service layer** (`lib/security.ts`): centralized input validation, prompt injection detection, audit logging, and error message sanitization
- **Lazy loading**: All 18 feature views are code-split via `React.lazy` + `Suspense`
- **RBAC**: Role-based navigation filtering and route guards across 5 roles (Commander, Security, Volunteer, Fan, Operations)
- **Strict TypeScript**: No `any` types; all paths covered

## CI/CD

GitHub Actions pipeline (`.github/workflows/ci.yml`) runs on every push/PR:

1. **Quality** — typecheck, lint, unit + integration tests with coverage
2. **Build** — production build verification
3. **E2E** — Playwright across 5 user journeys
4. **Security audit** — dependency vulnerability scan

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Commander | commander@fifanexus.ai | nexus2026 |
| Security | security@fifanexus.ai | nexus2026 |
| Operations | ops@fifanexus.ai | nexus2026 |
| Volunteer | volunteer@fifanexus.ai | nexus2026 |
| Fan | fan@fifanexus.ai | nexus2026 |

## License

Private project. All rights reserved.
