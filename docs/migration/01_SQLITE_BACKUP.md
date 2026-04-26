# 01 — SQLite Backup (Phase 1-B)

**Status:** Migration in progress
**Last updated:** 2026-04-25
**Phase:** 1-B
**Sandbox:** Linux (no Docker daemon), Node 22.22.2

---

## Search performed

```bash
find /home/user/residency24 -name "*.db" \
     -not -path "*/node_modules/*" \
     -not -path "*/.next/*" 2>/dev/null
```

**Result:** no matches.

---

## Findings

| Question | Answer |
|----------|--------|
| Was a `.db` file present in the repo working tree? | **No.** |
| Was `prisma/dev.db` present? | **No.** |
| Was `prisma/dev.db-journal` present? | **No.** |
| Was a Docker named volume (`db-data`) present in this sandbox? | **No** (Docker daemon not running here). |

This matches the Phase 1-A finding (`docs/discovery/04_SQLITE_DATA_AUDIT.md`): the `.db` is gitignored and lives only on developer machines. **In this sandbox there is nothing to back up.**

---

## What you (the user) MUST still do on YOUR Windows machine

Even though this sandbox is clean, the **user's actual development laptop** may have a real `prisma/dev.db` file with seeded test data. Before running Phase 1-B's runtime steps locally, run the following on your Windows machine:

```powershell
# In the project root, with PowerShell:
Get-ChildItem -Recurse -Force -Include *.db,*.sqlite,*.sqlite3 |
  Where-Object { $_.FullName -notmatch "node_modules|\.next|\.git" }

# OR with Git Bash:
find . -name "*.db" -not -path "./node_modules/*" -not -path "./.next/*"
```

If anything appears, back it up before any other Phase 1-B step:

```powershell
New-Item -ItemType Directory -Force -Path .\backups | Out-Null
$stamp = Get-Date -Format "yyyyMMdd"
Copy-Item .\prisma\dev.db ".\backups\sqlite-pre-mysql-migration-$stamp.db"
```

Then verify the backup file exists and is readable:

```powershell
Get-ChildItem .\backups\
```

---

## Production note

There is **no production deployment yet** (per Phase 1-A discovery and the Phase 1-B brief — `https://residency24.com` still serves WordPress). Therefore there is no production SQLite file at risk in this migration.

The 200 leads currently held in the WordPress database are **out of scope** for this phase and will be migrated separately after the CMS data model is built.

---

**Verdict:** ✅ **No backup required in this sandbox.** Backup procedure documented above for the user to run on their Windows machine.

---

**End of report.**
