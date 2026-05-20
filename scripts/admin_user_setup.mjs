/**
 * One-shot: ensure an admin user exists with the given email.
 * If it exists -> reset its password.
 * If not -> create it with role=ADMIN.
 *
 * Usage: node admin_user_setup.mjs <email> [name]
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

const prisma = new PrismaClient();

const email = process.argv[2];
const name = process.argv[3] || email.split("@")[0];
if (!email) {
  console.error("usage: node admin_user_setup.mjs <email> [name]");
  process.exit(1);
}

// Generate a random 16-char password using readable charset (no ambiguous chars).
function generatePassword(len = 16) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*-_+=";
  const bytes = randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) out += chars[bytes[i] % chars.length];
  return out;
}

async function main() {
  const password = generatePassword(16);
  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { passwordHash, role: "ADMIN" },
    });
    console.log("UPDATED");
    console.log("email:", existing.email);
    console.log("name:", existing.name);
    console.log("password:", password);
    console.log("role: ADMIN");
  } else {
    const u = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log("CREATED");
    console.log("email:", u.email);
    console.log("name:", u.name);
    console.log("password:", password);
    console.log("role: ADMIN");
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("FATAL:", e);
  await prisma.$disconnect();
  process.exit(1);
});
