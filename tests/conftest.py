"""pytest fixtures and configuration for social_autopilot tests."""
import pytest


@pytest.fixture
def brand_voice():
    """Return a test brand voice configuration."""
    return {
        "name": "Test Brand",
        "tone": "friendly, helpful",
        "cta": "Learn more at test.example.com",
        "emoji": False,
        "hashtags_base": ["#TestBrand"],
    }


@pytest.fixture
def sample_topics():
    """Return a list of sample topics for testing."""
    return [
        "AI automation for founders",
        "3 automations to set up today",
    ]


@pytest.fixture
def tmp_output_dir(tmp_path):
    """Return a temporary output directory for test artifacts."""
    return tmp_path / "output" / "social"
