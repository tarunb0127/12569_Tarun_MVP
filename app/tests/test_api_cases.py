import os
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

VALID_IMAGE = os.path.join("app", "tests", "sample_images", "valid.png")
INVALID_TEXT = os.path.join("app", "tests", "sample_images", "invalid.txt")


# ---------- MOCK VALIDATION ----------
async def mock_validate_photo(file_path):
    return {
        "is_professional": True,
        "suggestions": ["Good lighting", "Face centered"]
    }


# ---------- HEALTH TESTS ----------
def test_01_health_status():
    r = client.get("/health")
    assert r.status_code == 200


def test_02_health_service_name():
    r = client.get("/health")
    assert r.json()["service"] == "AI Profile Photo Validator"


def test_03_health_version():
    r = client.get("/health")
    assert r.json()["version"] == "1.0.0"


# ---------- VERSION TESTS ----------
def test_04_version_status():
    r = client.get("/version")
    assert r.status_code == 200


def test_05_version_value():
    r = client.get("/version")
    assert r.json()["version"] == "1.0.0"


# ---------- VALID IMAGE TESTS ----------
@pytest.mark.asyncio
async def test_06_valid_png_upload(mocker):

    mocker.patch(
        "app.services.validation_service.validate_photo",
        side_effect=mock_validate_photo
    )

    with open(VALID_IMAGE, "rb") as img:
        r = client.post(
            "/api/v1/photo/validate",
            files={"file": ("valid.png", img, "image/png")}
        )

    assert r.status_code == 200


@pytest.mark.asyncio
async def test_07_response_contains_professional(mocker):

    mocker.patch(
        "app.services.validation_service.validate_photo",
        side_effect=mock_validate_photo
    )

    with open(VALID_IMAGE, "rb") as img:
        r = client.post(
            "/api/v1/photo/validate",
            files={"file": ("valid.png", img, "image/png")}
        )

    assert "is_professional" in r.json()


@pytest.mark.asyncio
async def test_08_response_contains_suggestions(mocker):

    mocker.patch(
        "app.services.validation_service.validate_photo",
        side_effect=mock_validate_photo
    )

    with open(VALID_IMAGE, "rb") as img:
        r = client.post(
            "/api/v1/photo/validate",
            files={"file": ("valid.png", img, "image/png")}
        )

    assert "suggestions" in r.json()


# ---------- INVALID MIME ----------
def test_09_invalid_mime_txt():

    with open(INVALID_TEXT, "rb") as file:
        r = client.post(
            "/api/v1/photo/validate",
            files={"file": ("invalid.txt", file, "text/plain")}
        )

    assert r.status_code == 400


def test_10_invalid_mime_pdf():

    r = client.post(
        "/api/v1/photo/validate",
        files={"file": ("file.pdf", b"fake", "application/pdf")}
    )

    assert r.status_code == 400


def test_11_invalid_mime_json():

    r = client.post(
        "/api/v1/photo/validate",
        files={"file": ("file.json", b"{}", "application/json")}
    )

    assert r.status_code == 400


# ---------- INVALID EXTENSIONS ----------
def test_12_invalid_extension_gif():

    r = client.post(
        "/api/v1/photo/validate",
        files={"file": ("image.gif", b"fake", "image/gif")}
    )

    assert r.status_code == 400


def test_13_invalid_extension_bmp():

    r = client.post(
        "/api/v1/photo/validate",
        files={"file": ("image.bmp", b"fake", "image/bmp")}
    )

    assert r.status_code == 400


def test_14_invalid_extension_svg():

    r = client.post(
        "/api/v1/photo/validate",
        files={"file": ("image.svg", b"fake", "image/svg+xml")}
    )

    assert r.status_code == 400


# ---------- FILE VALIDATION ----------
def test_15_missing_file():

    r = client.post("/api/v1/photo/validate")

    assert r.status_code == 422


def test_16_empty_file():

    r = client.post(
        "/api/v1/photo/validate",
        files={"file": ("empty.png", b"", "image/png")}
    )

    assert r.status_code in [400, 500]


def test_17_random_bytes():

    r = client.post(
        "/api/v1/photo/validate",
        files={"file": ("fake.png", b"123456", "image/png")}
    )

    assert r.status_code == 400


# ---------- FILE NAME EDGE CASES ----------
def test_18_uppercase_filename():

    r = client.post(
        "/api/v1/photo/validate",
        files={"file": ("IMAGE.PNG", b"fake", "image/png")}
    )

    assert r.status_code in [200, 400]


def test_19_space_filename():

    r = client.post(
        "/api/v1/photo/validate",
        files={"file": ("my image.png", b"fake", "image/png")}
    )

    assert r.status_code in [200, 400]


def test_20_special_char_filename():

    r = client.post(
        "/api/v1/photo/validate",
        files={"file": ("image@#.png", b"fake", "image/png")}
    )

    assert r.status_code in [200, 400]


# ---------- LARGE FILE ----------
def test_21_large_file():

    big = b"x" * 5000000

    r = client.post(
        "/api/v1/photo/validate",
        files={"file": ("big.png", big, "image/png")}
    )

    assert r.status_code in [400, 500]


# ---------- REPEAT REQUEST ----------
def test_22_duplicate_upload():

    r1 = client.post(
        "/api/v1/photo/validate",
        files={"file": ("dup.png", b"fake", "image/png")}
    )

    r2 = client.post(
        "/api/v1/photo/validate",
        files={"file": ("dup.png", b"fake", "image/png")}
    )

    assert r1.status_code in [200, 400]
    assert r2.status_code in [200, 400]


# ---------- API SECURITY ----------
def test_23_invalid_endpoint():

    r = client.post("/api/v1/photo/unknown")

    assert r.status_code == 404


def test_24_invalid_method():

    r = client.get("/api/v1/photo/validate")

    assert r.status_code in [405, 404]


# ---------- HEALTH WRONG METHOD ----------
def test_25_health_post():

    r = client.post("/health")

    assert r.status_code in [405, 404]


# ---------- VERSION WRONG METHOD ----------
def test_26_version_post():

    r = client.post("/version")

    assert r.status_code in [405, 404]


# ---------- ADDITIONAL EDGE CASES ----------
def test_27_null_bytes():

    r = client.post(
        "/api/v1/photo/validate",
        files={"file": ("null.png", b"\x00\x00", "image/png")}
    )

    assert r.status_code in [400, 500]


def test_28_long_filename():

    name = "a" * 120 + ".png"

    r = client.post(
        "/api/v1/photo/validate",
        files={"file": (name, b"fake", "image/png")}
    )

    assert r.status_code in [200, 400]


def test_29_multiple_requests():

    for _ in range(3):
        r = client.post(
            "/api/v1/photo/validate",
            files={"file": ("multi.png", b"fake", "image/png")}
        )

        assert r.status_code in [200, 400]


def test_30_health_latency():

    r = client.get("/health")

    assert r.elapsed.total_seconds() < 2