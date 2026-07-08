# Q-Empire Social Autopilot

Autonomous social-media engine. It **generates** on-brand content, **schedules**
it across each platform's best posting slots, and **publishes** it on autopilot.

Supported platforms: **Twitter/X, Instagram, LinkedIn, Facebook, TikTok**.

Part of the [Q-Empire Automation](https://qempireai.com) suite.

## How it works

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

## Quick start

```bash
# Install (only httpx + python-dotenv are needed; both optional for the demo)
pip install -r requirements.txt

# Run an end-to-end demo — no API keys required (everything is dry-run)
python -m social_autopilot.cli demo

# Plan a real campaign
python -m social_autopilot.cli plan \
  --campaign "Launch Week" \
  --topics "AI automation for founders,3 automations to set up today" \
  --platforms twitter,linkedin,instagram \
  --publish
```

## Programmatic use

```python
from social_autopilot import SocialAutopilot, Platform

bot = SocialAutopilot(brand_voice={
    "name": "Q-Empire",
    "tone": "bold, motivational, entrepreneurial",
    "cta": "Automate your empire today.",
})

calendar = bot.plan_campaign(
    campaign="Launch Week",
    topics=["How AI agents build businesses on autopilot"],
    platforms=[Platform.TWITTER, Platform.LINKEDIN],
)

bot.run_due(calendar)   # publish anything whose time has come
bot.save(calendar)      # -> output/social/launch_week.json
```

## Configuration

Set via environment variables (see `.env.example`):

| Variable | Default | Purpose |
|----------|---------|---------|
| `ANTHROPIC_API_KEY` | — | Enables Claude-generated content. Without it, the template engine is used. |
| `SOCIAL_DRY_RUN` | `1` | `1` = simulate publishing (safe). `0` = attempt real publishing (requires platform creds + live adapters). |
| `SOCIAL_LLM_MODEL` | `claude-sonnet-4-20250514` | Model used by the content engine. |
| `SOCIAL_OUTPUT_DIR` | `output/social` | Where saved calendars are written. |

## Going live

Publishing is **dry-run by default** — nothing is posted to a real network.
To publish for real, implement `_publish_live()` on the relevant publisher in
`social_autopilot/publisher.py` (add the platform's API client + credentials)
and set `SOCIAL_DRY_RUN=0`.

## Tests

```bash
python tests/test_social_autopilot.py
# or, if pytest is installed:
python -m pytest tests/ -v
```

## License

Proprietary — Q-Empire Automation Division.
