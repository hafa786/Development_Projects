#!/usr/bin/env bash

set -e

echo "Formatting DarmiHire frontend..."
(
  cd frontend
  npm run format
)

echo "Formatting DarmiHire backend..."
(
  cd backend
  ./mvnw spotless:apply
)

echo "DarmiHire formatting complete."