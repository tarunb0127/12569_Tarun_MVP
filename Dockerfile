FROM python:3.11-bookworm

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/root/.local/bin:${PATH}"

WORKDIR /app

# Install system dependencies for OpenCV/DeepFace (FIXED: handles hash mismatch)
RUN rm -rf /var/lib/apt/lists/* \
    && apt-get clean \
    && echo 'Acquire::http::Pipeline-Depth 0;\nAcquire::http::No-Cache true;\nAcquire::BrokenProxy true;' > /etc/apt/apt.conf.d/99fixbadproxy \
    && apt-get update --fix-missing --allow-releaseinfo-change -o Acquire::Retries=5 \
    && apt-get install -y --no-install-recommends \
         wget \
         ca-certificates \
         libgl1 \
         libglib2.0-0 \
         libx11-6 \
         libxcb1 \
         libxext6 \
         libsm6 \
    && rm -rf /var/lib/apt/lists/*

# Install uv
RUN wget -qO- https://astral.sh/uv/install.sh | sh

# Copy requirements and install into venv
COPY requirements.txt .
RUN uv venv /app/.venv \
    && uv pip install --no-cache -r requirements.txt

# Ensure venv binaries are on PATH
ENV PATH="/app/.venv/bin:${PATH}"

# Copy app code
COPY . .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
