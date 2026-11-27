import { hashPassword, verifyPassword } from "./password";

describe("password helpers", () => {
  it("hashes passwords and verifies matching credentials", async () => {
    const password = "safe-example-password";
    const hash = await hashPassword(password);

    expect(hash).not.toContain(password);
    await expect(verifyPassword(password, hash)).resolves.toBe(true);
    await expect(verifyPassword("different-password", hash)).resolves.toBe(
      false,
    );
  });

  it("rejects malformed stored hashes", async () => {
    await expect(verifyPassword("password", "not-a-hash")).resolves.toBe(false);
  });
});
