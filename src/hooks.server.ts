import { handleLogto, UserScope } from "@logto/sveltekit";
import type { Handle, HandleServerError } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import {
	getRequestContext,
	getRequestId,
	getRequestLogContext,
	logger,
} from "$lib/server/observability/logger";

function requireEnv(name: string, value: string | undefined) {
	if (!value) {
		throw new Error(`Missing Logto environment variable ${name}.`);
	}

	return value;
}

export const handle: Handle = async ({ event, resolve }) => {
	const startedAt = performance.now();
	event.locals.requestId = getRequestId(event.request);

	try {
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

		const response = await logtoHandle({ event, resolve });
		const durationMs = Math.round((performance.now() - startedAt) * 100) / 100;

		logger.info("request.completed", {
			request_id: event.locals.requestId,
			method: event.request.method,
			pathname: event.url.pathname,
			route_id: event.route.id ?? null,
			status: response.status,
			status_family: `${Math.floor(response.status / 100)}xx`,
			duration_ms: durationMs,
			...getRequestLogContext(event.locals, event.request, event.url),
		});

		return response;
	} catch (error) {
		const durationMs = Math.round((performance.now() - startedAt) * 100) / 100;

		logger.error(
			"request.failed",
			{
				request_id: event.locals.requestId,
				method: event.request.method,
				pathname: event.url.pathname,
				route_id: event.route.id ?? null,
				duration_ms: durationMs,
				...getRequestLogContext(event.locals, event.request, event.url),
			},
			error,
		);

		throw error;
	}
};

export const handleError: HandleServerError = ({
	error,
	event,
	status,
	message,
}) => {
	const errorId = crypto.randomUUID();

	logger.error(
		"request.unexpected_error",
		{
			error_id: errorId,
			status,
			safe_message: message,
			method: event.request.method,
			pathname: event.url.pathname,
			route_id: event.route.id ?? null,
			...getRequestContext(event.locals),
			request_kind: event.locals.requestKind,
			action: event.locals.requestAction,
			outcome: event.locals.requestOutcome ?? "server_error",
		},
		error,
	);

	return {
		message,
		errorId,
	};
};
