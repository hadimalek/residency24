// Phase A scaffold: Auth.js v5 catch-all handler.
//
// The OLD auth route at src/app/api/auth/route.ts is still live and is the
// active login mechanism. This file is wired but parallel — Auth.js v5 will
// only become active once the login form and logout button are switched over
// (see BLOCKED_QUESTIONS.md Q3).
//
// Note: this route exposes /api/auth/signin, /api/auth/callback/credentials,
// /api/auth/session, etc. The OLD route at /api/auth (single-file route.ts)
// handles only POST and GET on /api/auth itself, so the two coexist as long
// as nothing tries to call /api/auth/{signin,callback,session,...} until the
// switchover happens.

import { handlers } from "../../../../../auth";

export const { GET, POST } = handlers;
