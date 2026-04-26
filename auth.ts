import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// ─── Phase A SCAFFOLD ONLY ────────────────────────────────────────────────────
// This Auth.js v5 config is wired but the existing src/app/api/auth/route.ts
// (custom base64 cookie auth) is still the active login path. Switching over
// is the job of Phase 1-D-finish — see BLOCKED_QUESTIONS.md Q3.
//
// To activate this:
//   1. Delete src/app/api/auth/route.ts
//   2. Update src/app/admin/login/page.tsx to call signIn("credentials", ...)
//   3. Update src/components/admin/AdminSidebar.tsx logout to call signOut()
//   4. Add proxy.ts that wraps `auth` to gate /admin/* and /api/admin/*
//   5. Set AUTH_SECRET in .env (generate via `npx auth secret`)
// ──────────────────────────────────────────────────────────────────────────────

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  // JWT session — no DB session lookups on every request.
  session: { strategy: "jwt" },

  // Custom pages so admin login points at the existing UI.
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (rawCredentials) => {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // Embed role into the JWT so `proxy.ts` and `auth()` calls can read it
    // without hitting the database.
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "ADMIN";
      }
      return token;
    },

    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },

    // `authorized` is called by `auth()` inside proxy.ts. Used to gate routes.
    // Returning a Response or false denies access; true allows. Returning
    // nothing falls back to "is the user signed in?".
    authorized: async ({ request, auth }) => {
      const { pathname } = request.nextUrl;

      // Admin routes require an authenticated session.
      if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
        // Public exceptions on the admin tree.
        if (pathname === "/admin/login" || pathname.startsWith("/api/auth")) {
          return true;
        }
        return Boolean(auth?.user);
      }

      // Everything else is open.
      return true;
    },
  },

  trustHost: true,
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
  }
}
