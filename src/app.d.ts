// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { LogtoClient, UserInfoResponse } from "@logto/sveltekit";

declare global {
	namespace App {
		interface Error {
			message: string;
			errorId: string;
		}
		interface Locals {
			logtoClient: LogtoClient;
			requestId?: string;
			requestAction?: string;
			requestKind?: "action" | "api" | "page";
			requestOutcome?:
				| "not_found"
				| "server_error"
				| "success"
				| "validation_error";
			user?: UserInfoResponse;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}
