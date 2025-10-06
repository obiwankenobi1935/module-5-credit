#!/usr/bin/env bash
set -e
BASE="${1:-http://localhost:3000}"
for i in {1..5}; do
  curl -s -X POST "$BASE/api/sensors" -H "Content-Type: application/json" -d '{"location":"SeminarA"}' > /dev/null
done
echo "Seeded 5 readings."
