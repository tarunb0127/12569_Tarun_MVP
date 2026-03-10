import sys
from unittest.mock import MagicMock

sys.modules["mediapipe"] = MagicMock()
sys.modules["tensorflow"] = MagicMock()

from fastapi.testclient import TestClient
from app.main import app
import pytest


@pytest.fixture
def client():
    return TestClient(app)