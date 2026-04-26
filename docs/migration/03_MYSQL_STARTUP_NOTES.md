# 03 — MySQL Container Startup Notes

**Status:** Migration in progress
**Last updated:** 2026-04-25
**Phase:** 1-B
**Sandbox limitation:** ⚠️ Docker daemon is not running in this sandbox. The
container start commands below were **not executed in this session** — they are
documented for the user to run on their Windows machine.

---

## Sandbox check

```bash
$ docker --version
Docker version 29.3.1, build c2be9cc

$ docker compose version
Docker Compose version v5.1.1

$ docker info
failed to connect to the docker API at unix:///var/run/docker.sock; check if
the path is correct and if the daemon is running
```

→ **Docker CLI is present, daemon is not.** This means schema editing,
validation, and the migration SQL preview were doable in the sandbox, but
**actually starting the MySQL container must be done on the user's Windows
machine** (where Docker Desktop runs the daemon).

---

## What you (the user) MUST run on Windows

### 1. Make sure Docker Desktop is running

Open Docker Desktop from the Start menu. Wait until the whale icon in the
system tray says "Docker Desktop is running".

### 2. Fill in `.env` with strong local passwords

```powershell
Copy-Item .env.example .env
notepad .env
```

Replace **every** `CHANGE_ME*` value. Use anything strong — these are local-only
passwords, but treat them seriously so you don't accidentally reuse a habit on
production. Example:

```ini
DATABASE_URL="mysql://residency24:Local-Dev-Pwd-2026!@localhost:3306/residency24"
MYSQL_ROOT_PASSWORD="Local-Root-Pwd-2026!"
MYSQL_DATABASE="residency24"
MYSQL_USER="residency24"
MYSQL_PASSWORD="Local-Dev-Pwd-2026!"
```

The `MYSQL_PASSWORD` and the password embedded in `DATABASE_URL` **must
match** — `docker-compose.yml` uses `${MYSQL_PASSWORD}` to create the user, and
Prisma uses `DATABASE_URL` to connect.

### 3. Start the MySQL container

```bash
docker compose up -d mysql
```

Expected output:

```
[+] Running 2/2
 ✔ Network residency24_default    Created
 ✔ Container residency24-mysql-1  Started
```

### 4. Wait for the healthcheck to pass

```bash
docker compose ps
```

Expected output (look for `(healthy)`):

```
NAME                      IMAGE       STATUS                    PORTS
residency24-mysql-1       mysql:8.4   Up 30 seconds (healthy)   0.0.0.0:3306->3306/tcp
```

This usually takes 15–30 seconds the first time (MySQL initializes its data
directory). Subsequent starts are nearly instant.

### 5. Verify connectivity from the host

```bash
docker compose exec mysql mysql -uresidency24 -p${MYSQL_PASSWORD:-yourPasswordHere} -e "SELECT VERSION();"
```

Expected output:

```
+-----------+
| VERSION() |
+-----------+
| 8.4.x     |
+-----------+
```

---

## Common issues and fixes

### A. Port 3306 is already in use

If you have MySQL installed natively on Windows (some installers default to
port 3306) you'll see:

```
Error response from daemon: failed to set up container networking:
driver failed programming external connectivity on endpoint
residency24-mysql-1: Bind for 0.0.0.0:3306 failed: port is already allocated
```

**Two ways to fix:**

**Option A — stop the native MySQL service:**
```powershell
# In an Administrator PowerShell:
Get-Service | Where-Object { $_.Name -like "*MySQL*" }
Stop-Service "MySQL80"   # or whatever the service name is
Set-Service "MySQL80" -StartupType Manual
```

**Option B — change the Docker port to 3307:**
1. Edit `docker-compose.yml`, change `"3306:3306"` → `"3307:3306"`.
2. Edit `.env`, change `DATABASE_URL` to use `localhost:3307` instead of `3306`.
3. `docker compose down && docker compose up -d mysql`.

The container's *internal* port stays 3306; only the host-side mapping changes.

### B. "Access denied for user 'residency24'@'%'"

You changed `MYSQL_PASSWORD` in `.env` AFTER the volume was created. MySQL only
honors the `MYSQL_PASSWORD` env var on the **first** initialization of an
empty data directory. After that the credentials are baked into the volume.

**Fix (LOCAL DEV ONLY — wipes the database):**
```bash
docker compose down -v   # removes the mysql-data volume
docker compose up -d mysql
```

### C. Container is "unhealthy" forever

Check the logs:

```bash
docker compose logs mysql --tail 50
```

Most common cause: incompatible volume from a previous MySQL major version
(e.g. you used to run MySQL 5.7 from a different project on the same Docker).

**Fix:**
```bash
docker compose down -v
docker compose up -d mysql
```

### D. `docker compose` says "no configuration file provided"

You're not in the project root. `cd` to the directory that contains
`docker-compose.yml`.

---

## What was actually executed in this sandbox session

| Step | Done? | Notes |
|------|-------|-------|
| `docker --version` | ✅ | CLI present (29.3.1) |
| `docker compose version` | ✅ | v5.1.1 |
| `docker info` | ❌ | Daemon unreachable (expected — sandbox limitation) |
| `docker compose up -d mysql` | ❌ | Cannot run without daemon |
| `docker compose ps` | ❌ | Cannot run without daemon |

All file edits were done. **Container start happens on your Windows machine.**

---

**End of report.**
