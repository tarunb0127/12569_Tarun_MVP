def test_health_endpoint(client):
    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "healthy"
    assert data["service"] == "AI Profile Photo Validator"
    assert data["version"] == "1.0.0"