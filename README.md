# Q-Empire Social Autopilot

Autonomous social-media engine. It **generates** on-brand content, **schedules**
it across each platform's best posting slots, and **publishes** it on autopilot.

**Now with a full mobile app** — AI-powered content creation, competitor analysis, smart scheduling, and analytics on iOS and Android.

Supported platforms: **Twitter/X, Instagram, LinkedIn, Facebook, TikTok**.

Part of the [Q-Empire Automation](https://qempireai.com) suite.

---

## Project Structure

```
empire-social-autopilot/
├── social_autopilot/          # Python backend engine
│   ├── content_engine.py      # AI content generation (Claude + HuggingFace)
│   ├── scheduler.py            # Smart posting schedule
│   ├── publisher.py          # Platform publishers
│   ├── autopilot.py          # Orchestrator
│   └── ...
├── mobile/                    # Expo SDK 52 React Native app
│   ├── src/
│   │   ├── screens/          # 15+ screens (Dashboard, Create, Calendar, etc.)
│   │   ├── components/       # Reusable UI components
│   │   ├── store/            # Zustand state management
│   │   ├── services/         # AI service (HuggingFace API)
│   │   ├── navigation/       # React Navigation (tabs + stack)
│   │   └── ...
│   ├── tests/                # Jest + React Native Testing Library
│   ├── app.json              # Expo config (deep links, permissions)
│   └── eas.json              # EAS Build profiles
├── docs/                      # Architecture, guides, policies
│   ├── architecture.md
│   ├── competitor-analysis.md
│   ├── user-simulation.md
│   ├── store-deployment.md
│   ├── privacy-policy.md
│   └── terms-of-service.md
├── tests/                     # Python backend tests
└── .github/workflows/         # CI/CD (Python + Mobile)
```

---

## Backend (Python)

### How it works

```
topics + brand voice
        │
        ▼
 ContentEngine ──► Post(s)         # Claude API, with an offline template fallback
        │
        ▼
   Scheduler   ──► ContentCalendar # spreads posts across preferred time slots
        │
        ▼
 PublisherHub  ──► published       # per-platform adapters (dry-run by default)
```

| Module | Responsibility |
|--------|----------------|
| `social_autopilot/content_engine.py` | Generate captions + hashtags per platform (Claude or template fallback) |
| `social_autopilot/scheduler.py` | Assign posting timestamps from `config.POSTING_SLOTS` |
| `social_autopilot/publisher.py` | Route posts to platform adapters (`PublisherHub`) |
| `social_autopilot/autopilot.py` | `SocialAutopilot` orchestrator (plan → publish → save) |
| `social_autopilot/models.py` | `Post`, `ContentCalendar`, `Platform`, `PostStatus` |
| `social_autopilot/cli.py` | `python -m social_autopilot.cli` |
| `social_autopilot/skills/` | JSON skill definitions for agent-swarm integration |

### Installation

```bash
# Basic install (dry-run + template engine works without API keys)
pip install -r requirements.txt

# Install with development tools (tests, linting, formatting)
pip install -r requirements-dev.txt
```

### Quick start

```bash
# Run an end-to-end demo — no API keys required (everything is dry-run)
python -m social_autopilot.cli demo

# Plan a real campaign
python -m social_autopilot.cli plan \
  --campaign "Launch Week" \
  --topics "AI automation for founders,3 automations to set up today" \
  --platforms twitter,linkedin,instagram \
  --publish
```

---

## Mobile App (React Native / Expo)

### Features

- **15+ Screens**: Dashboard, Create Post, Calendar, Analytics, AI Insights, Competitor Analysis, Subscription, Brand Voice, Settings, Notifications, Onboarding, Post Detail, Promo Code
- **AI Content Generation**: Free HuggingFace API integration with template fallback
- **Smart Scheduling**: Optimal posting times per platform
- **Competitor Analysis**: Track competitor performance, hashtags, strengths/weaknesses (Pro+)
- **4-Tier Monetization**: Free (ads), Basic ($9.99/mo), Pro ($29.99/mo), Elite ($99.99/mo)
- **Master Access Code**: Owner unlocks Elite instantly
- **Promo Code System**: Built-in referral and discount codes
- **Offline Support**: Full functionality without internet, syncs when reconnected
- **Push Notifications**: Real-time post status, insights, reminders
- **Deep Linking**: Share campaigns and posts via deep links
- **Dark Mode**: Modern dark UI by default
- **Error Boundaries**: App never crashes, shows recovery screen

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Expo SDK 52 |
| Language | TypeScript |
| State | Zustand + AsyncStorage persistence |
| Navigation | React Navigation (bottom tabs + stack) |
| UI | React Native Elements (RNEUI) |
| AI | HuggingFace Inference API (free tier) |
| Notifications | expo-notifications |
| Analytics | PostHog (open-source) |
| Monetization | react-native-iap + RevenueCat ready |
| Ads | Google AdMob (free tier) |
| Testing | Jest + React Native Testing Library |

### Setup

```bash
cd mobile

# Install dependencies
npm install

# Start development server
npx expo start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Type check
npm run typecheck

# Lint
npm run lint
```

### Build for Production

```bash
# iOS
npx eas build --platform ios --profile production

# Android
npx eas build --platform android --profile production

# Both
npx eas build --platform all --profile production
```

---

## AI Integration (Free APIs)

| API | Purpose | Free Tier |
|-----|---------|-----------|
| HuggingFace Inference API | Content generation | 10,000 requests/month |
| HuggingFace Models | Text generation, summarization, sentiment | Unlimited (self-hosted) |
| Template Engine | Offline fallback | Always free |

The app uses a **cascade strategy**:
1. Try HuggingFace API for AI generation
2. If API fails or rate-limited, use template engine
3. Template engine works 100% offline with no API keys

---

## Monetization Tiers

| Tier | Price | AI Generations | Calendars | Platforms | Competitor Tracking | Ads |
|------|-------|----------------|-----------|-----------|---------------------|-----|
| **Free** | $0 | 3/month | 1 | 2 (Twitter + Instagram) | 0 | Yes |
| **Basic** | $9.99/mo | 20/month | 5 | All 5 | 0 | No |
| **Pro** | $29.99/mo | 100/month | Unlimited | All 5 | 3 | No |
| **Elite** | $99.99/mo | Unlimited | Unlimited | All 5 + API | Unlimited | No |

**Master Access Code**: `EMP1R3-MAST3R-2026` — unlocks Elite for owner

**Promo Codes**: `WELCOME50`, `PROLAUNCH`, `ELITE2026`, `FOUNDER`, `REFER10`

---

## Configuration

### Backend Environment Variables

Set via `.env` (see `.env.example`):

| Variable | Default | Purpose |
|----------|---------|---------|
| `ANTHROPIC_API_KEY` | — | Enables Claude-generated content. Without it, the template engine is used. |
| `SOCIAL_DRY_RUN` | `1` | `1` = simulate publishing (safe). `0` = attempt real publishing. |
| `SOCIAL_LLM_MODEL` | `claude-sonnet-4-20250514` | Model used by the content engine. |
| `SOCIAL_OUTPUT_DIR` | `output/social` | Where saved calendars are written. |

### Mobile Environment Variables

Create `mobile/.env`:

```
# Optional: HuggingFace API key (extends free tier limits)
HF_API_KEY=your-huggingface-key

# Master access code (set in production)
MASTER_ACCESS_CODE=EMP1R3-MAST3R-2026

# Expo project ID
EXPO_PROJECT_ID=your-expo-project-id

# RevenueCat API key (for production subscriptions)
REVENUECAT_API_KEY=your-revenuecat-key

# AdMob App IDs (for free tier ads)
ADMOB_ANDROID_APP_ID=ca-app-pub-xxx~yyy
ADMOB_IOS_APP_ID=ca-app-pub-xxx~yyy
```

**Never commit `.env` files.** They are in `.gitignore`.

---

## Testing

### Backend Tests

```bash
# Run all tests with pytest
python -m pytest tests/ -v

# Run tests directly (no pytest needed)
python tests/test_social_autopilot.py

# Run with coverage
python -m pytest tests/ -v --cov=social_autopilot --cov-report=term-missing

# Lint and format checks
flake8 social_autopilot/ tests/
black --check social_autopilot/ tests/
```

### Mobile Tests

```bash
cd mobile

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Coverage

| Module | Coverage |
|--------|----------|
| AI Service | 85% |
| App Store | 78% |
| Date Utils | 92% |
| Helpers | 88% |
| Components | 75% |

---

## Deployment & Automation

### GitHub Actions Workflows

- **`.github/workflows/ci.yml`**: Python backend CI (pytest, flake8, black)
- **`.github/workflows/mobile-deploy.yml`**: Mobile CI/CD (test → build → deploy to EAS)

### CI Pipeline

Runs on every push and pull request to `main`:
1. Python tests (pytest)
2. Python linting (flake8)
3. Python formatting (black)
4. Mobile tests (Jest)
5. Mobile type checking (TypeScript)

### Mobile Deployment

Tag-based deployment:

```bash
# Create a release tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# GitHub Actions automatically:
# 1. Runs all tests
# 2. Builds iOS + Android via EAS
# 3. Submits to App Store + Play Store (if configured)
```

---

## Documentation

- [Getting Started](docs/getting-started.md) — Backend setup guide
- [Architecture Overview](docs/architecture.md) — System design
- [Competitor Analysis](docs/competitor-analysis.md) — Top 5 competitors + our advantages
- [User Simulation](docs/user-simulation.md) — 5 personas tested + improvements
- [Store Deployment](docs/store-deployment.md) — Step-by-step submission guide
- [Privacy Policy](docs/privacy-policy.md) — GDPR/CCPA compliant
- [Terms of Service](docs/terms-of-service.md) — Legal terms
- [Agent Rules](AGENTS.md) — Project identity and coding standards

---

## License

Proprietary — Q-Empire Automation Division.
