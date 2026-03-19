import { redirect } from "@sveltejs/kit";

const CALLBACK_PATH = "/callback";
const LOGIN_PATH = "/login";

export function getSignInRedirectUri(url: URL) {
	return new URL(CALLBACK_PATH, url).toString();
}

export function getSignOutRedirectUri(url: URL) {
	return new URL(LOGIN_PATH, url).toString();
}

export function requireUser(locals: App.Locals) {
	if (!locals.user) {
		redirect(303, LOGIN_PATH);
	}

	return locals.user;
}
