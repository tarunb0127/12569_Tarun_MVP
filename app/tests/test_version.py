def test_version_endpoint(client):
    response = client.get("/version")

    assert response.status_code == 200

    data = response.json()

    assert data["app"] == "AI Profile Photo Validator"
    assert data["version"] == "1.0.0"