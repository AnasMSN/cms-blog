#!/usr/bin/env sh
# Daily backup of database + photos. Add to crontab on the server:
#   0 2 * * * cd /opt/oleh-oleh && ./scripts/backup.sh >> backups/backup.log 2>&1
set -eu
cd "$(dirname "$0")/.."
KEEP_DAYS="${KEEP_DAYS:-14}"
STAMP="$(date +%Y%m%d-%H%M%S)"
mkdir -p backups

# Consistent snapshot of a live SQLite database (safe while the site is running)
docker run --rm -v "$PWD/data:/data" -v "$PWD/backups:/backups" alpine:3 \
  sh -c "apk add --no-cache sqlite >/dev/null && sqlite3 /data/site.db \".backup '/backups/site-$STAMP.db'\""
tar -czf "backups/media-$STAMP.tar.gz" media
gzip "backups/site-$STAMP.db"

# Optional off-site copy (configure once with `rclone config`)
if command -v rclone >/dev/null 2>&1 && [ -n "${RCLONE_REMOTE:-}" ]; then
  rclone copy backups "$RCLONE_REMOTE" --include "*-$STAMP.*"
fi

find backups -type f \( -name 'site-*.db.gz' -o -name 'media-*.tar.gz' \) -mtime +"$KEEP_DAYS" -delete
echo "$(date -Iseconds) backup ok: $STAMP"
