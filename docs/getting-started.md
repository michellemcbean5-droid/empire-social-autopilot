# Getting Started with Q-Empire Social Autopilot

## Prerequisites

- Python 3.10 or higher
- `pip` (or `uv`, `poetry`, `pipenv`)
- (Optional) An Anthropic API key for Claude-generated content

## Installation

```bash
# Clone the repository
git clone https://github.com/your-org/empire-social-autopilot.git
cd empire-social-autopilot

# Create a virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install runtime dependencies
pip install -r requirements.txt

# Install development dependencies (optional, for running tests)
pip install -r requirements-dev.txt
```

## First Steps

### 1. Run the Demo (No API Key Required)

The demo uses the template content engine and dry-run publishers, so it works completely offline:

```bash
python -m social_autopilot.cli demo
```

You should see a generated content calendar with posts for Twitter, LinkedIn, and Instagram, followed by simulated publishing and a saved JSON file.

### 2. Configure Environment Variables (Optional)

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```ini
# Uncomment and add your key to enable Claude content generation
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Optional: change the model
SOCIAL_LLM_MODEL=claude-sonnet-4-20250514

# Keep dry-run on for safety until you're ready to go live
SOCIAL_DRY_RUN=1

# Optional: change output directory
SOCIAL_OUTPUT_DIR=output/social
```

### 3. Plan Your First Campaign

```bash
python -m social_autopilot.cli plan \
  --campaign "My Launch" \
  --topics "AI automation for founders,3 automations to set up today" \
  --platforms twitter,linkedin,instagram
```

This will:
1. Generate platform-specific posts for each topic
2. Schedule them across the next few days at optimal posting times
3. Save the content calendar to `output/social/my_launch.json`

### 4. Publish (Dry-Run by Default)

To simulate publishing immediately after planning:

```bash
python -m social_autopilot.cli plan \
  --campaign "My Launch" \
  --topics "AI automation for founders" \
  --platforms twitter,linkedin \
  --publish
```

All posts will be "published" in dry-run mode — no real network calls are made.

### 5. Go Live (Advanced)

> ⚠️ **Warning**: Only disable dry-run if you have implemented live platform adapters and have valid API credentials.

1. Implement `_publish_live()` in `social_autopilot/publisher.py` for each platform you want to use.
2. Set `SOCIAL_DRY_RUN=0` in your `.env` file or environment.
3. Run the plan command with `--publish`.

---

## Next Steps

- Read the [Architecture Overview](architecture.md) to understand the internals.
- Check the [Agent Rules](AGENTS.md) for contribution guidelines.
- Explore the programmatic API in `social_autopilot/autopilot.py`.
