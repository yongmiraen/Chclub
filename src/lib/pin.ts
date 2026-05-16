import crypto from "node:crypto";

export function hashPin(pin: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .createHash("sha256")
    .update(salt + pin)
    .digest("hex");
  return `${salt}:${hash}`;
}

export function verifyPin(pin: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = crypto
    .createHash("sha256")
    .update(salt + pin)
    .digest("hex");
  const a = Buffer.from(test, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
