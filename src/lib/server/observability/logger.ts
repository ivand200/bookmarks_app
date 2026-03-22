type LogLevel = "info" | "warn" | "error";

type LogContextValue = boolean | number | string | null | undefined | string[];

type LogContext = Record<string, LogContextValue>;

function inferActionName(url: URL) {
	if (!url.search.startsWith("?/")) {
		return undefined;
	}

	const rawValue = url.search.slice(2);
	const separatorIndex = rawValue.indexOf("&");
	const encodedAction =
		separatorIndex === -1 ? rawValue : rawValue.slice(0, separatorIndex);

	return encodedAction.length > 0
		? decodeURIComponent(encodedAction)
		: undefined;
}

function inferRequestKind(
	locals: Pick<App.Locals, "requestKind">,
	request: Request,
	url: URL,
) {
	if (locals.requestKind) {
		return locals.requestKind;
	}

	if (url.pathname.startsWith("/api/")) {
		return "api";
	}

	if (request.method === "POST") {
		return "action";
	}

	return "page";
}

function redactIdentifier(value: string | undefined) {
	if (!value) {
		return undefined;
	}

	if (value.length <= 8) {
		return value;
	}

	return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function getErrorContext(error: unknown): LogContext {
	if (error instanceof Error) {
		return {
			error_name: error.name,
			error_message: error.message,
			error_stack: error.stack,
		};
	}

	return {
		error_name: "UnknownError",
		error_message: String(error),
	};
}

function write(level: LogLevel, message: string, context: LogContext = {}) {
	const entry = {
		timestamp: new Date().toISOString(),
		level,
		message,
		...context,
	};

	const payload = JSON.stringify(entry);

	if (level === "error") {
		console.error(payload);
		return;
	}

	if (level === "warn") {
		console.warn(payload);
		return;
	}

	console.info(payload);
}

export const logger = {
	info(message: string, context?: LogContext) {
		write("info", message, context);
	},

	warn(message: string, context?: LogContext) {
		write("warn", message, context);
	},

	error(message: string, context?: LogContext, error?: unknown) {
		write("error", message, {
			...context,
			...(error ? getErrorContext(error) : {}),
		});
	},
};

export function getRequestContext(
	locals: Pick<App.Locals, "requestId" | "user">,
): LogContext {
	return {
		request_id: locals.requestId,
		has_user: Boolean(locals.user),
		user_id: redactIdentifier(locals.user?.sub),
	};
}

export function getRequestId(request: Request) {
	const headerValue = request.headers.get("x-request-id")?.trim();

	if (headerValue) {
		return headerValue;
	}

	return crypto.randomUUID();
}

export function getRequestLogContext(
	locals: Pick<
		App.Locals,
		"requestAction" | "requestId" | "requestKind" | "requestOutcome" | "user"
	>,
	request: Request,
	url: URL,
): LogContext {
	return {
		...getRequestContext(locals),
		request_kind: inferRequestKind(locals, request, url),
		action: locals.requestAction ?? inferActionName(url),
		outcome: locals.requestOutcome ?? "success",
	};
}
