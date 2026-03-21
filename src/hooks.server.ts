import { handleLogto, UserScope } from "@logto/sveltekit";
import type { Handle } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

function requireEnv(name: string, value: string | undefined) {
	if (!value) {
		throw new Error(`Missing Logto environment variable ${name}.`);
	}

	return value;
}

export const handle: Handle = async ({ event, resolve }) => {
	const logtoHandle = handleLogto(
		{
			endpoint: requireEnv("LOGTO_ENDPOINT", env.LOGTO_ENDPOINT),
			appId: requireEnv("LOGTO_APP_ID", env.LOGTO_APP_ID),
			appSecret: requireEnv("LOGTO_APP_SECRET", env.LOGTO_APP_SECRET),
			scopes: [UserScope.Email],
		},
		{
			encryptionKey: requireEnv(
				"LOGTO_COOKIE_ENCRYPTION_KEY",
				env.LOGTO_COOKIE_ENCRYPTION_KEY,
			),
		},
	);

	return logtoHandle({ event, resolve });
};
