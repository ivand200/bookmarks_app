import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "$env/dynamic/private";

type SupabaseProbeResult = {
	ok: boolean;
	message: string;
	projectReachable: boolean;
	projectStatus: number;
	queryReachedDatabase: boolean;
	details?: string;
};

let serverClient: SupabaseClient | undefined;

function requireEnv(name: string, value: string | undefined) {
	if (!value) {
		throw new Error(`Missing Supabase environment variable ${name}.`);
	}

	return value;
}

export function getSupabaseServerClient() {
	if (serverClient) {
		return serverClient;
	}

	serverClient = createClient(
		requireEnv(
			"SUPABASE_PUBLIC_SUPABASE_URL",
			env.SUPABASE_PUBLIC_SUPABASE_URL,
		),
		requireEnv("SUPABASE_PUBLISHABLE_KEY", env.SUPABASE_PUBLISHABLE_KEY),
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		},
	);

	return serverClient;
}

export async function probeSupabaseConnection(
	fetchFn: typeof fetch,
): Promise<SupabaseProbeResult> {
	const url = requireEnv(
		"SUPABASE_PUBLIC_SUPABASE_URL",
		env.SUPABASE_PUBLIC_SUPABASE_URL,
	);
	const publishableKey = requireEnv(
		"SUPABASE_PUBLISHABLE_KEY",
		env.SUPABASE_PUBLISHABLE_KEY,
	);
	const supabase = getSupabaseServerClient();

	const projectResponse = await fetchFn(`${url}/rest/v1/`, {
		headers: {
			apikey: publishableKey,
			Authorization: `Bearer ${publishableKey}`,
		},
	});

	let queryReachedDatabase = false;
	let details: string | undefined;

	const { error } = await supabase
		.from("__connection_probe__")
		.select("*")
		.limit(1);

	if (!error) {
		queryReachedDatabase = true;
		details = "Probe query succeeded.";
	} else {
		const knownConnectivityCodes = new Set(["42P01", "PGRST205"]);
		const relationMissing = knownConnectivityCodes.has(error.code ?? "");
		const mentionsMissingRelation = /relation|schema cache|table/i.test(
			error.message,
		);

		queryReachedDatabase = relationMissing || mentionsMissingRelation;
		details = `${error.code ?? "UNKNOWN"}: ${error.message}`;
	}

	const projectReachable = projectResponse.ok || projectResponse.status === 401;
	const ok = projectReachable && queryReachedDatabase;

	return {
		ok,
		message: ok
			? "Supabase is reachable and the PostgREST query path is working."
			: "Supabase probe failed.",
		projectReachable,
		projectStatus: projectResponse.status,
		queryReachedDatabase,
		details,
	};
}
