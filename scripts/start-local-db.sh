#!/usr/bin/env bash
set -euo pipefail

# Local development helper – not used in CI.

DB_CONTAINER_NAME="thesigningoffice-dev"
ENV_FILE=".env.local"

echo "Starting database container '$DB_CONTAINER_NAME'..."

if ! [ -x "$(command -v docker)" ]; then
  echo "Docker is not installed. Install Docker Desktop and try again."
  exit 1
fi

if ! docker info > /dev/null 2>&1; then
  echo "Docker daemon is not running. Start Docker Desktop and try again."
  exit 1
fi

if [ "$(docker ps -q -f name=^/${DB_CONTAINER_NAME}$)" ]; then
  echo "Database container '$DB_CONTAINER_NAME' already running"
  exit 0
fi

if [ "$(docker ps -q -a -f name=^/${DB_CONTAINER_NAME}$)" ]; then
  docker start "$DB_CONTAINER_NAME"
  echo "Existing database container '$DB_CONTAINER_NAME' started"
  exit 0
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE. Run the following command to create it:"
  echo "  cp .env.example $ENV_FILE"
  exit 1
fi

set -a
# shellcheck disable=SC1091
source "$ENV_FILE"
set +a

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is not set in $ENV_FILE"
  exit 1
fi

# postgresql://user:password@host:port/db
DB_PASSWORD=$(echo "$DATABASE_URL" | awk -F':' '{print $3}' | awk -F'@' '{print $1}')
DB_PORT=$(echo "$DATABASE_URL" | awk -F':' '{print $4}' | awk -F'/' '{print $1}')
DB_USER=$(echo "$DATABASE_URL" | awk -F'://' '{print $2}' | awk -F':' '{print $1}')
DB_NAME=$(echo "$DATABASE_URL" | awk -F'/' '{print $NF}')

docker run -d \
  --name "$DB_CONTAINER_NAME" \
  -e POSTGRES_USER="$DB_USER" \
  -e POSTGRES_PASSWORD="$DB_PASSWORD" \
  -e POSTGRES_DB="$DB_NAME" \
  -p "$DB_PORT":5432 \
  postgres:16

echo "Waiting for Postgres..."
until docker exec "$DB_CONTAINER_NAME" pg_isready -U "$DB_USER" -d "$DB_NAME" -q; do
  sleep 0.5
done

echo "Database ready."