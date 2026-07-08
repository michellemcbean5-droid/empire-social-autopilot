# Q-Empire Social Autopilot — Agent Rules & Project Identity

## Project Identity

- **Name**: Q-Empire Social Autopilot
- **Domain**: Autonomous social media content generation, scheduling, and publishing
- **Owner**: Q-Empire Automation Division
- **License**: Proprietary

## Tech Stack

- **Language**: Python 3.10+
- **Package**: `social_autopilot` (namespace package, not `src/` layout)
- **Dependencies**: `httpx>=0.25.0`, `python-dotenv>=1.0.0`
- **Dev Tools**: `pytest`, `pytest-cov`, `flake8`, `black`
- **CI/CD**: GitHub Actions (`.github/workflows/ci.yml`)

## Architecture

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

### Design Principles
1. **Safe by default**: All publishing is dry-run unless `SOCIAL_DRY_RUN=0`.
2. **Offline capable**: Template engine works without API keys.
3. **Platform-aware**: Each platform has character limits and hashtag limits in `config.py`.
4. **Extensible**: New platforms are added by subclassing `BasePublisher` and registering in `_REGISTRY`.

## Agent Rules

### Code Changes
1. **Follow PEP 8** and existing style (black-compatible, max line length 120).
2. **Type hints**: Use `from __future__ import annotations` and modern type hints.
3. **Imports**: Group as stdlib → third-party → local, with a blank line between each group.
4. **Docstrings**: Use Google-style docstrings for all public classes and functions.
5. **No hardcoded secrets**: Read all credentials and API keys from environment variables or `.env`.

### Testing Rules
1. **All new features must include tests** in `tests/test_social_autopilot.py` or a new test file.
2. **Run tests before committing**:
   ```bash
   pytest tests/ -v
   ```
3. **Coverage**: Aim for >80% coverage on new code.
4. **Dry-run tests**: Tests must pass without any API keys (the template engine and dry-run publishers are sufficient).

### Deployment Rules
1. **Never commit `.env`** or `credentials.json` — they are in `.gitignore`.
2. **Branch protection**: `main` is protected. Always use feature branches and pull requests.
3. **CI must pass**: The GitHub Actions workflow runs `pytest`, `flake8`, and `black --check`.
4. **Version bumps**: Update `__version__` in `social_autopilot/__init__.py` before tagging a release.

### Repository Permissions
- `main` branch: protected, requires PR review and passing CI.
- `.env.example`, `requirements*.txt`, `README.md`: update freely as part of feature PRs.
- `AGENTS.md`: update when project identity, tech stack, or agent rules change.

## Architecture Notes

- **ContentEngine**: The `_generate_llm` method calls Anthropic's Messages API. The `_generate_template` method is a deterministic fallback that uses string templates and `DEFAULT_BRAND_VOICE`. Both paths respect `PLATFORM_LIMITS`.
- **Scheduler**: Distributes posts across `POSTING_SLOTS` per platform, rolling into the next day when slots are exhausted. The starting day defaults to `utcnow() + 1 day`.
- **PublisherHub**: Routes posts to the correct `BasePublisher` subclass. All live adapters raise `NotImplementedError` by design; production teams must implement `_publish_live()` with real API credentials.
- **CLI**: The `demo` subcommand is the canonical smoke test — it runs end-to-end without any external credentials.
- **Skills**: JSON files in `social_autopilot/skills/` define agent-swarm integration hooks. They are validated by `test_skill_definitions_valid()`.
