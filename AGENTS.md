# Q-Empire Social Autopilot — Agent Rules & Project Identity

## Project Identity

- **Name**: Q-Empire Social Autopilot
- **Domain**: Autonomous social media content generation, scheduling, and publishing
- **Owner**: Q-Empire Automation Division
- **License**: Proprietary
- **Platforms**: Python CLI/Library + React Native Mobile App (iOS/Android)

## Tech Stack

### Backend
- **Language**: Python 3.10+
- **Package**: `social_autopilot` (namespace package, not `src/` layout)
- **Dependencies**: `httpx>=0.25.0`, `python-dotenv>=1.0.0`
- **Dev Tools**: `pytest`, `pytest-cov`, `flake8`, `black`
- **CI/CD**: GitHub Actions (`.github/workflows/ci.yml`)

### Mobile App
- **Framework**: Expo SDK 52 + React Native 0.76
- **Language**: TypeScript
- **State**: Zustand + AsyncStorage persistence
- **Navigation**: React Navigation (bottom tabs + stack)
- **UI**: React Native Elements (RNEUI)
- **AI**: HuggingFace Inference API (free tier)
- **Testing**: Jest + React Native Testing Library
- **CI/CD**: GitHub Actions (`.github/workflows/mobile-deploy.yml`)

## Architecture

### Backend
```
social_autopilot/
├── __init__.py          # Public API exports
├── models.py            # Post, ContentCalendar, Platform, PostStatus
├── config.py            # Environment + constants
├── content_engine.py    # Claude LLM + template fallback
├── scheduler.py         # Slot-based posting calendar builder
├── publisher.py         # Platform adapters (dry-run by default)
├── autopilot.py         # SocialAutopilot orchestrator
├── cli.py               # argparse CLI entry point
└── skills/              # JSON skill definitions for agent-swarm integration
```

### Mobile App
```
mobile/src/
├── screens/             # 15+ screens (Dashboard, Create, Calendar, Analytics, etc.)
├── components/          # Reusable UI (PostCard, InsightCard, FeatureGate, etc.)
├── store/               # Zustand state management (appStore.ts)
├── services/            # AI service (HuggingFace API + template fallback)
├── navigation/          # React Navigation (RootNavigator.tsx)
├── hooks/               # Custom hooks (useNetworkStatus, usePushNotifications, etc.)
├── utils/               # Helpers (dateUtils, helpers)
├── constants/           # Theme, colors, spacing, typography
└── types/               # TypeScript type definitions
```

### Design Principles
1. **Safe by default**: All publishing is dry-run unless `SOCIAL_DRY_RUN=0`.
2. **Offline capable**: Template engine works without API keys. Mobile app works fully offline.
3. **Platform-aware**: Each platform has character limits and hashtag limits in `config.py`.
4. **Extensible**: New platforms are added by subclassing `BasePublisher` and registering in `_REGISTRY`.
5. **Mobile-first**: UI designed for thumb-friendly navigation, quick actions, minimal steps.
6. **AI-first**: Free AI content generation with template fallback — never leaves user stuck.
7. **Monetization-ready**: 4-tier subscription system with feature gating, promo codes, master access.

## Agent Rules

### Code Changes (Backend)
1. **Follow PEP 8** and existing style (black-compatible, max line length 120).
2. **Type hints**: Use `from __future__ import annotations` and modern type hints.
3. **Imports**: Group as stdlib → third-party → local, with a blank line between each group.
4. **Docstrings**: Use Google-style docstrings for all public classes and functions.
5. **No hardcoded secrets**: Read all credentials and API keys from environment variables or `.env`.

### Code Changes (Mobile)
1. **TypeScript strict mode**: All files must be `.ts` or `.tsx` with proper types.
2. **Component structure**: Functional components with hooks, no class components.
3. **State management**: Use Zustand for global state, React hooks for local state.
4. **Styling**: Use StyleSheet with theme constants from `constants/theme.ts`.
5. **No hardcoded strings**: Use constants for colors, spacing, font sizes.
6. **Error handling**: Wrap async calls in try/catch, show Toast notifications.
7. **Feature gating**: Use `FeatureGate` component for tier-locked features.

### Testing Rules
1. **All new features must include tests** in `tests/` or `mobile/tests/`.
2. **Run tests before committing**:
   ```bash
   # Backend
   pytest tests/ -v
   
   # Mobile
   cd mobile && npm test
   ```
3. **Coverage**: Aim for >80% coverage on new code.
4. **Dry-run tests**: Tests must pass without any API keys (the template engine and dry-run publishers are sufficient).
5. **Mobile tests**: Mock all native modules (AsyncStorage, Notifications, NetInfo, etc.).

### Deployment Rules
1. **Never commit `.env`** or `credentials.json` — they are in `.gitignore`.
2. **Branch protection**: `main` is protected. Always use feature branches and pull requests.
3. **CI must pass**: The GitHub Actions workflow runs `pytest`, `flake8`, `black --check`, and mobile tests.
4. **Version bumps**: Update `__version__` in `social_autopilot/__init__.py` and `mobile/package.json` before tagging a release.
5. **Mobile builds**: Use EAS Build for production. Tag-based deployment via GitHub Actions.

### Repository Permissions
- `main` branch: protected, requires PR review and passing CI.
- `.env.example`, `requirements*.txt`, `README.md`, `mobile/package.json`: update freely as part of feature PRs.
- `AGENTS.md`: update when project identity, tech stack, or agent rules change.

## Architecture Notes

- **ContentEngine**: The `_generate_llm` method calls Anthropic's Messages API. The `_generate_template` method is a deterministic fallback that uses string templates and `DEFAULT_BRAND_VOICE`. Both paths respect `PLATFORM_LIMITS`.
- **Scheduler**: Distributes posts across `POSTING_SLOTS` per platform, rolling into the next day when slots are exhausted. The starting day defaults to `utcnow() + 1 day`.
- **PublisherHub**: Routes posts to the correct `BasePublisher` subclass. All live adapters raise `NotImplementedError` by design; production teams must implement `_publish_live()` with real API credentials.
- **CLI**: The `demo` subcommand is the canonical smoke test — it runs end-to-end without any external credentials.
- **Skills**: JSON files in `social_autopilot/skills/` define agent-swarm integration hooks. They are validated by `test_skill_definitions_valid()`.
- **Mobile AI Service**: Uses HuggingFace Inference API (free tier: 10k requests/month). Falls back to template engine on API failure. Supports 5 platforms with platform-specific prompts.
- **Mobile Store**: Zustand with AsyncStorage persistence. Survives app crashes and device restarts. Syncs with backend when online.
- **Feature Gating**: `FeatureGate` component checks user tier against required tier. Shows upgrade prompt for locked features.
- **Monetization**: 4 tiers (Free/Basic/Pro/Elite) with react-native-iap integration. RevenueCat config ready. Promo codes and master access code supported.
