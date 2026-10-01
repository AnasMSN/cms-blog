#!/usr/bin/env sh
# Usage: ./scripts/restore.sh 20260930-020000
set -eu
cd "$(dirname "$0")/.."
STAMP="${1:?give the backup timestamp, e.g. 20260930-020000}"
docker compose stop app
gunzip -c "backups/site-$STAMP.db.gz" > data/site.db
rm -rf media && tar -xzf "backups/media-$STAMP.tar.gz"
docker compose start app
echo "restored $STAMP"
