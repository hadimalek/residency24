# 07 — Smoke Test Results

**Status:** Plan (sandbox cannot run dev server)
**Last updated:** 2026-04-25
**Phase:** 1-B
**Sandbox limitation:** No running MySQL and no `node_modules`. The user runs
the smoke test on their Windows machine.

---

## What the user runs on Windows

After every prior step is green:

```bash
# Make sure MySQL is up
docker compose ps     # mysql should be (healthy)

# Start the Next.js dev server
npm run dev
```

Wait for the line:

```
   ▲ Next.js 16.2.1
   - Local:        http://localhost:3000
   - Network:      http://192.x.x.x:3000

 ✓ Ready in 3.2s
```

In a **second terminal**, run the smoke tests:

### Smoke test 1 — homepage redirects to /en/

```bash
curl -i http://localhost:3000/ 2>&1 | head -10
```

Expected:
```
HTTP/1.1 307 Temporary Redirect
Location: /en/
```

(307 because `next.config.ts` has `permanent: false`. This will change in a
future phase when English moves to `/`.)

### Smoke test 2 — admin login page renders

```bash
curl -is http://localhost:3000/admin/login 2>&1 | head -5
```

Expected:
```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
```

### Smoke test 3 — chat API rejects GET (correct behavior)

```bash
curl -is http://localhost:3000/api/chat 2>&1 | head -5
```

Expected:
```
HTTP/1.1 405 Method Not Allowed
```

(The chat route only declares `POST`. GET should NOT be 500.)

### Smoke test 4 — admin dashboard API responds

```bash
curl -s http://localhost:3000/api/dashboard | head -3
```

Expected: a JSON body starting with `{"stats":{`. Counts will be zero (no chat
sessions yet), but the route should NOT return 500.

### Smoke test 5 — chat actually works end-to-end

This is the most important one. From your browser:

1. Open `http://localhost:3000/`
2. You'll be redirected to `http://localhost:3000/en/`
3. In the hero chat input, type something like "How much does Dubai company setup cost?"
4. Send. Wait 2–5 seconds for the AI reply.
5. The reply should appear in the chat modal.

If you get an error like "هیچ تامین‌کننده AI فعالی تنظیم نشده است" (no active
AI provider), the seed didn't populate the `Provider` table — see
`05_SEED_VERIFICATION.md`.

If you get "کلید API نامعتبر است" (invalid API key), the seeded provider
exists but its `apiKey` is the placeholder `sk-CHANGE-ME`. Open
`http://localhost:3000/admin`, log in with `admin@residency24.com` / `admin123`,
go to `Providers`, and update the key with a real one.

### Smoke test 6 — admin login round-trip

1. Open `http://localhost:3000/admin/login`
2. Log in with `admin@residency24.com` / `admin123`
3. You should land on `http://localhost:3000/admin`
4. Verify the dashboard renders without errors.

---

## What to record in this file (after running the tests)

Append the actual results below.

```
Date run: ____
Tester: ____

Smoke test 1 (home → /en/):       PASS / FAIL  (___)
Smoke test 2 (admin login HTML):  PASS / FAIL  (___)
Smoke test 3 (chat 405 on GET):   PASS / FAIL  (___)
Smoke test 4 (dashboard JSON):    PASS / FAIL  (___)
Smoke test 5 (chat round-trip):   PASS / FAIL  (___)
Smoke test 6 (admin login):       PASS / FAIL  (___)

Notes / errors observed:
____
```

---

## Was this executed in the sandbox?

❌ **No.** Sandbox has no DB, no `node_modules`, and no way to bring the dev
server up.

---

**End of report.**
