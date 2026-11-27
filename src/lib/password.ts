import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";

const PASSWORD_KEY_LENGTH = 64;

function derivePasswordKey(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scryptCallback(password, salt, PASSWORD_KEY_LENGTH, (error, key) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(key);
    });
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await derivePasswordKey(password, salt);
  return `scrypt$${salt.toString("base64")}$${key.toString("base64")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, saltValue, keyValue, extra] = storedHash.split("$");
  if (algorithm !== "scrypt" || !saltValue || !keyValue || extra) return false;

  const salt = Buffer.from(saltValue, "base64");
  const expectedKey = Buffer.from(keyValue, "base64");
  if (salt.length !== 16 || expectedKey.length !== PASSWORD_KEY_LENGTH) {
    return false;
  }

  const actualKey = await derivePasswordKey(password, salt);
  return timingSafeEqual(actualKey, expectedKey);
}
