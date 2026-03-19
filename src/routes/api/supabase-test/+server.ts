import { json } from "@sveltejs/kit";
import { probeSupabaseConnection } from "$lib/server/supabase";

export const GET = async ({ fetch }) => {
	try {
		const result = await probeSupabaseConnection(fetch);

		return json(result, {
			status: result.ok ? 200 : 500,
		});
	} catch (error) {
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
