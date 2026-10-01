#!/usr/bin/env sh
# One-time setup for a fresh Ubuntu 22.04/24.04 VPS. Run as root.
set -eu
apt-get update && apt-get -y upgrade
apt-get install -y ca-certificates curl ufw fail2ban
curl -fsSL https://get.docker.com | sh
ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw --force enable
systemctl enable --now fail2ban
id deploy >/dev/null 2>&1 || adduser --disabled-password --gecos "" deploy
usermod -aG docker deploy
mkdir -p /opt/oleh-oleh/data /opt/oleh-oleh/media /opt/oleh-oleh/backups
chown -R deploy:deploy /opt/oleh-oleh
# The container runs as uid 1001 and must be able to write the database and photos
chown -R 1001:1001 /opt/oleh-oleh/data /opt/oleh-oleh/media
echo "Done. Next: copy docker-compose.yml, deploy/, scripts/ and .env to /opt/oleh-oleh as user 'deploy'."
