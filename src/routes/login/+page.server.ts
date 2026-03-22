import { type Actions, redirect } from "@sveltejs/kit";
import { getSignInRedirectUri } from "$lib/server/auth";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		redirect(303, "/");
	}
};

export const actions: Actions = {
	signIn: async ({ locals, url }) => {
		locals.requestKind = "action";
		locals.requestAction = "signIn";
		locals.requestOutcome = "success";

		await locals.logtoClient.signIn(getSignInRedirectUri(url));
	},
};
