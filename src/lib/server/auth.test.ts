import type { UserInfoResponse } from "@logto/sveltekit";
import { describe, expect, it } from "vitest";
import { requireUser } from "./auth";

function createUser(
	overrides: Partial<UserInfoResponse> = {},
): UserInfoResponse {
	return {
		iss: "https://example.logto.app/oidc",
		sub: "user-123",
		aud: "app-id",
		exp: 1_900_000_000,
		iat: 1_800_000_000,
		...overrides,
	};
}

describe("requireUser", () => {
	it("given an authenticated user in locals, when the guard runs, then it returns that user", () => {
		const user = createUser();

		const result = requireUser({
			logtoClient: {} as App.Locals["logtoClient"],
			user,
		});

		expect(result).toBe(user);
	});

	it("given no authenticated user in locals, when the guard runs, then it redirects to login", () => {
		try {
			requireUser({
				logtoClient: {} as App.Locals["logtoClient"],
			});

			throw new Error("Expected requireUser to redirect.");
		} catch (error) {
			expect(error).toHaveProperty("status", 303);
			expect(error).toHaveProperty("location", "/login");
		}
	});
});
