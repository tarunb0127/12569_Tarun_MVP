import os
import pytest


@pytest.mark.asyncio
async def test_valid_image_upload(client, mocker):

    async def mock_validate_photo(file_path):
        return {
            "is_professional": True,
            "suggestions": ["Good lighting", "Face centered"]
        }

    mocker.patch(
        "app.services.validation_service.validate_photo",
        side_effect=mock_validate_photo
    )

    image_path = os.path.join("app", "tests", "sample_images", "valid.png")

    with open(image_path, "rb") as img:
        response = client.post(
            "/api/v1/photo/validate",
            files={"file": ("valid.jpg", img, "image/jpeg")}
        )

    assert response.status_code == 200


def test_invalid_mime_type(client):

    response = client.post(
        "/api/v1/photo/validate",
        files={"file": ("file.txt", b"fake data", "text/plain")}
    )

    assert response.status_code == 400


def test_invalid_extension(client):

    response = client.post(
        "/api/v1/photo/validate",
        files={"file": ("image.gif", b"fake image", "image/gif")}
    )

    assert response.status_code == 400


def test_missing_file(client):

    response = client.post("/api/v1/photo/validate")

    assert response.status_code == 422