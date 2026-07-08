# Architecture Overview

## High-Level Flow

```
+-----------------+     +-----------------+     +------------------+
|   Brand Voice   |     |     Topics      |     |   Platforms      |
+--------+--------+     +--------+--------+     +--------+---------+
         |                       |                       |
         +-----------------------+-----------------------+
                                 |
                                 ▼
                     +----------------------+
                     |   ContentEngine      |
                     |  - Claude LLM path   |
                     |  - Template fallback |
                     +----------+-----------+
                                |
                                ▼
                     +----------------------+
                     |   Scheduler          |
                     |  - Slot-based timing  |
                     |  - Per-platform cadence
                     +----------+-----------+
                                |
                                ▼
                     +----------------------+
                     |   ContentCalendar    |
                     |  - List of Post objs |
                     |  - JSON serialization |
                     +----------+-----------+
                                |
                     +----------+----------+
                     |                     |
                     ▼                     ▼
            +----------------+   +----------------+
            |   run_due()    |   | publish_all()  |
            | (time-based)   |   | (force all)     |
            +--------+-------+   +--------+-------+
                     |                     |
                     +----------+----------+
                                |
                                ▼
                     +----------------------+
                     |   PublisherHub       |
                     |  - Routes per platform|
                     |  - Dry-run by default  |
                     +----------+-----------+
                                |
                     +----------+----------+----------+----------+----------+
                     |          |          |          |          |          |
                     ▼          ▼          ▼          ▼          ▼
            +-----------+ +-----------+ +-----------+ +-----------+ +-----------+
            |  Twitter  | | Instagram | |  LinkedIn | | Facebook  | |  TikTok   |
            | Publisher | | Publisher | | Publisher | | Publisher | | Publisher |
            +-----------+ +-----------+ +-----------+ +-----------+ +-----------+
```

## Module Breakdown

### `models.py` — Data Layer

Defines the core data structures:

- **`Platform`**: Enum of supported social networks (`twitter`, `instagram`, `linkedin`, `facebook`, `tiktok`).
- **`PostStatus`**: Enum of post lifecycle states (`draft`, `scheduled`, `published`, `failed`).
- **`Post`**: A single post with `platform`, `caption`, `hashtags`, `scheduled_for`, `status`, `media_url`, `external_id`, and `error`.
- **`ContentCalendar`**: A campaign container with a list of `Post` objects, `created_at` timestamp, and JSON serialization.

### `content_engine.py` — Generation Layer

- **`ContentEngine`**: The main interface for turning topics into posts.
  - `generate(topic, platform)` → `Post`
  - `generate_batch(topics, platforms)` → `List[Post]`
  - **`_generate_llm()`**: Calls Anthropic Claude API with a structured prompt. Extracts JSON from the response.
  - **`_generate_template()`**: Deterministic fallback using string templates and `DEFAULT_BRAND_VOICE`. No external dependencies.

Both paths enforce `PLATFORM_LIMITS` (caption length and hashtag count per platform).

### `scheduler.py` — Scheduling Layer

- **`Scheduler`**: Assigns `scheduled_for` timestamps to posts.
  - Uses `POSTING_SLOTS` from `config.py` to pick optimal hours per platform.
  - Distributes posts day-by-day, rolling into the next day when slots are exhausted.
  - Default start time is `utcnow() + 1 day` at the first available slot.

### `publisher.py` — Publishing Layer

- **`BasePublisher`**: Abstract base class for all platform publishers.
  - `publish(post)` → checks `dry_run` mode; if dry, returns a fake `dryrun-` ID.
  - **`_publish_live()`**: NotImplemented by default. Production teams override this with real API calls.
- **`PublisherHub`**: Routes a `Post` to the correct `BasePublisher` based on `post.platform`.
  - Updates `post.status` to `PUBLISHED` or `FAILED`.
  - Sets `post.external_id` or `post.error` accordingly.

### `autopilot.py` — Orchestration Layer

- **`SocialAutopilot`**: The high-level API that ties everything together.
  - `plan_campaign(campaign, topics, platforms)` → `ContentCalendar`
  - `run_due(calendar)` → publishes scheduled posts whose time has passed
  - `publish_all(calendar)` → force-publishes all scheduled/draft posts
  - `save(calendar)` → persists to `OUTPUT_DIR` as JSON
  - `load(path)` → restores a `ContentCalendar` from JSON

### `cli.py` — Interface Layer

- `python -m social_autopilot.cli demo` → runs the full pipeline with sample data
- `python -m social_autopilot.cli plan ...` → plans a campaign from CLI arguments

### `config.py` — Configuration Layer

- Loads `.env` via `python-dotenv` (optional import — works without it).
- Defines constants: API keys, model settings, `PLATFORM_LIMITS`, `POSTING_SLOTS`, `DEFAULT_BRAND_VOICE`, `OUTPUT_DIR`, `DRY_RUN`.

## Design Patterns

1. **Strategy Pattern**: `ContentEngine` chooses between LLM and template strategies at runtime based on `ANTHROPIC_API_KEY` availability.
2. **Registry Pattern**: `PublisherHub` looks up publishers via `_REGISTRY` dictionary keyed by `Platform`.
3. **Factory Pattern**: `Scheduler` creates `ContentCalendar` objects with pre-populated `Post` objects.
4. **Data Transfer Objects**: `Post` and `ContentCalendar` are plain dataclasses with JSON serialization.

## Extensibility

### Adding a New Platform

1. Add the platform to `Platform` enum in `models.py`.
2. Add limits to `PLATFORM_LIMITS` in `config.py`.
3. Add posting slots to `POSTING_SLOTS` in `config.py`.
4. Create a new publisher class in `publisher.py`:
   ```python
   class NewPlatformPublisher(BasePublisher):
       platform = Platform.NEWPLATFORM
       def _publish_live(self, post: Post) -> PublishResult:
           ...
   ```
5. Register it in `_REGISTRY`.
6. Add a platform-specific hook in `ContentEngine._generate_template()` (optional).
7. Add tests in `tests/test_social_autopilot.py`.

### Adding a New Skill

1. Create a JSON file in `social_autopilot/skills/` following the existing schema.
2. Add a test in `tests/test_social_autopilot.py` under `test_skill_definitions_valid()`.

## Testing Strategy

- **Unit tests**: Each module has independent tests that don't require API keys.
- **Integration tests**: `test_autopilot_end_to_end_dry_run()` exercises the full pipeline in dry-run mode.
- **Round-trip tests**: `test_calendar_round_trip_serialization()` and `test_save_and_load()` verify JSON persistence.
- **Boundary tests**: `test_content_engine_respects_platform_limits()` ensures all platforms stay within their limits.
