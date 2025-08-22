#!/bin/sh
set -e

# If DATABASE_URL points to SQLite, ensure directory exists
if echo "$DATABASE_URL" | grep -q "^file:"; then
  # Extract path after file:
  DB_PATH=$(echo "$DATABASE_URL" | sed 's#^file:##')
  DB_DIR=$(dirname "$DB_PATH")
  mkdir -p "$DB_DIR"
fi

# Apply schema (safe for SQLite); ignore if no Prisma schema
if [ -f ./prisma/schema.prisma ]; then
  npx prisma generate >/dev/null 2>&1 || true
  npx prisma db push >/dev/null 2>&1 || true
fi

exec npm start -p ${PORT:-3000}




