# Operations & DevOps runbook

## 1. Architecture

```
Visitor ──HTTPS──> Caddy (80/443, auto Let's Encrypt)
                     │
                     └──> app container (Next.js + Payload, port 3000)
                            ├── ./data/site.db   SQLite database   (host folder)
                            └── ./media/         uploaded photos   (host folder)
```

- One container serves the website, the admin (`/admin`) and the API (`/api`).
- All pages render on request, so admin edits are live immediately and the Docker build never needs a database.
- Database migrations in `src/migrations` run automatically when the container starts.
- Data lives in host folders, so rebuilding or replacing the container never loses content.

## 2. Hosting options

| Option | Cost (approx.) | When |
|---|---|---|
| **VPS + Docker (default)** | Rp 50–150k / month (1 vCPU, 1–2 GB) | Most clients. Full control, fixed cost |
| Vercel + Turso + S3/R2 storage | Free tier possible | No server to manage; needs `@payloadcms/storage-s3` and `DATABASE_URI=libsql://…` |

Pick a VPS region in Jakarta/Singapore for Indonesian visitors.

## 3. First deployment (VPS)

**On your laptop**

1. Push this repo to GitHub.
2. Buy a domain and point an `A` record (and `www`) to the VPS IP.

**On the server (once, as root)**

```bash
curl -fsSL https://raw.githubusercontent.com/<you>/<repo>/main/scripts/server-setup.sh | sh
```

This installs Docker, enables the firewall (22/80/443) and fail2ban, creates a `deploy` user and `/opt/oleh-oleh` with the right folder permissions.

**As the `deploy` user**

```bash
cd /opt/oleh-oleh
# copy docker-compose.yml, deploy/, scripts/ from the repo, e.g.:
git clone https://github.com/<you>/<repo>.git src && cp -r src/docker-compose.yml src/deploy src/scripts src/.env.example . && cp .env.example .env
nano .env        # set PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL, DOMAIN, IMAGE
```

Private GHCR image? Log in once: `echo <token> | docker login ghcr.io -u <user> --password-stdin`
(or build on the server: `docker compose build app`).

```bash
docker compose up -d
docker compose run --rm tools npm run seed     # optional: demo content + admin user
curl https://your-domain/healthz               # {"status":"ok"}
```

Then log in at `https://your-domain/admin` and **change the admin password immediately**.

## 4. CI/CD

`.github/workflows/ci.yml` (every push & PR)
- `npm ci` → typecheck → migration drift check → production build.

`.github/workflows/deploy.yml` (push to `main`)
1. Builds the `runner` image and pushes `ghcr.io/<you>/<repo>:<sha>` and `:latest`.
2. SSHes to the VPS, **backs up first**, sets `IMAGE=` to the new tag, pulls and restarts.
3. Waits for `/healthz`; if it fails, prints logs and marks the deploy failed.

GitHub setup: *Settings → Environments → production* (optionally require approval), then add secrets:
- `VPS_HOST` — server IP
- `VPS_SSH_KEY` — private key whose public key is in `/home/deploy/.ssh/authorized_keys`

**Rollback:** edit `IMAGE=` in `.env` to a previous tag and run `docker compose up -d app`. If a migration changed data, also restore the pre-deploy backup (below).

## 5. Backups

```bash
crontab -e
0 2 * * * cd /opt/oleh-oleh && ./scripts/backup.sh >> backups/backup.log 2>&1
```

- Safe live snapshot of SQLite + tar of photos, kept 14 days (`KEEP_DAYS`).
- Off-site copy: install `rclone`, run `rclone config`, then set `RCLONE_REMOTE=gdrive:oleh-backups` in the crontab line.
- Restore: `./scripts/restore.sh 20260930-020000`
- Test a restore at least once before handing the site to a client.

## 6. Monitoring & maintenance

| Task | How | How often |
|---|---|---|
| Uptime | Free UptimeRobot / Better Stack check on `https://domain/healthz` | Always on |
| Logs | `docker compose logs -f app` (rotated, 3×10 MB) | When debugging |
| OS updates | `apt update && apt upgrade` | Monthly |
| App dependencies | Update Payload/Next together, run CI, deploy | Every 1–3 months |
| Disk | `df -h`, watch `media/` and `backups/` | Monthly |
| Backup restore test | Restore to a spare folder | Every 3 months |

## 7. Security checklist

- [ ] `PAYLOAD_SECRET` is a long random value and never committed
- [ ] Admin password changed from the seed default
- [ ] Client gets an **Editor** account; you keep **Admin**
- [ ] SSH key login only (disable password login in `/etc/ssh/sshd_config`)
- [ ] Firewall allows only 22/80/443
- [ ] Off-site backups enabled
- [ ] Login lockout is on by default (5 attempts, 10 minutes)

## 8. Handover to a client

1. Replace demo content: logo, colours, products, photos, WhatsApp number, address.
2. Create the client's Editor account; send a short admin guide (screenshots of Produk and Pengaturan Situs).
3. Submit `https://domain/sitemap.xml` in Google Search Console; create a Google Business Profile.
4. Agree who pays for domain + VPS renewals and who holds the credentials.

## 9. Common problems

| Symptom | Fix |
|---|---|
| Container starts then asks about "data loss" / migrations | The DB was created in dev mode. Use a fresh DB in production and let migrations create it |
| Photos fail to upload | `media/` not writable: `sudo chown -R 1001:1001 media data` |
| HTTPS certificate not issued | DNS not pointing to the server yet, or port 80 blocked |
| CI fails on "Schema changed but no migration" | Run `npm run payload migrate:create <name>` and commit |
| Site shows old content | It shouldn't (pages are dynamic); hard-refresh, check you edited the published version, not a draft |
