import { json } from "@sveltejs/kit";
import { logger } from "$lib/server/observability/logger";
import { probeSupabaseConnection } from "$lib/server/supabase";

export const GET = async ({ fetch, locals, request, url }) => {
	locals.requestKind = "api";

	try {
		const result = await probeSupabaseConnection(fetch);
		locals.requestOutcome = result.ok ? "success" : "server_error";

		if (!result.ok) {
			logger.warn("supabase.probe_failed", {
				request_id: locals.requestId,
				method: request.method,
				pathname: url.pathname,
				project_reachable: result.projectReachable,
				project_status: result.projectStatus,
				query_reached_database: result.queryReachedDatabase,
				details: result.details ?? null,
			});
		}

		return json(result, {
			status: result.ok ? 200 : 500,
		});
	} catch (error) {
		locals.requestOutcome = "server_error";

		logger.error(
			"supabase.probe_unexpected_error",
			{
				request_id: locals.requestId,
				method: request.method,
				pathname: url.pathname,
			},
			error,
		);

		const message = error instanceof Error ? error.message : "Unknown error";

		return json(
			{
				ok: false,
				message: "Supabase client setup failed.",
				projectReachable: false,
				projectStatus: 500,
				queryReachedDatabase: false,
				details: message,
			},
			{ status: 500 },
		);
	}
};
