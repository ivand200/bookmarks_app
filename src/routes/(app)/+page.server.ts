import { fail } from "@sveltejs/kit";
import { getSignOutRedirectUri } from "$lib/server/auth";
import {
	BookmarkNotFoundError,
	BookmarkRepositoryError,
} from "$lib/server/bookmarks/errors";
import { createBookmarkService } from "$lib/server/bookmarks/service";
import {
	createBookmarkSchema,
	deleteBookmarkSchema,
	getCreateBookmarkValues,
	getDeleteBookmarkValues,
} from "$lib/validators/bookmark";
import type { Actions, PageServerLoad } from "./$types";

const bookmarkService = createBookmarkService();

function getUserId(locals: App.Locals) {
	if (!locals.user?.sub) {
		throw new Error("Missing authenticated user.");
	}

	return locals.user.sub;
}

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user?.sub;

	if (!userId) {
		return {
			bookmarks: [],
		};
	}

	return {
		bookmarks: await bookmarkService.listBookmarks(userId),
	};
};

export const actions: Actions = {
	createBookmark: async ({ request, locals }) => {
		const values = getCreateBookmarkValues(await request.formData());
		const parsedInput = createBookmarkSchema.safeParse(values);

		if (!parsedInput.success) {
			return fail(400, {
				createBookmark: {
					success: false,
					message: "Please fix the URL field and try again.",
					fieldErrors: parsedInput.error.flatten().fieldErrors,
					values,
				},
			});
		}

		try {
			await bookmarkService.createBookmark({
				userId: getUserId(locals),
				...parsedInput.data,
			});

			return {
				createBookmark: {
					success: true,
					message: "Bookmark saved.",
				},
			};
		} catch (error) {
			if (error instanceof BookmarkRepositoryError) {
				return fail(500, {
					createBookmark: {
						success: false,
						message: "Could not save the bookmark right now.",
						values,
					},
				});
			}

			throw error;
		}
	},

	deleteBookmark: async ({ request, locals }) => {
		const values = getDeleteBookmarkValues(await request.formData());
		const parsedInput = deleteBookmarkSchema.safeParse(values);

		if (!parsedInput.success) {
			return fail(400, {
				deleteBookmark: {
					success: false,
					message: "The bookmark could not be deleted.",
					fieldErrors: parsedInput.error.flatten().fieldErrors,
					values,
				},
			});
		}

		try {
			await bookmarkService.deleteBookmark({
				userId: getUserId(locals),
				...parsedInput.data,
			});

			return {
				deleteBookmark: {
					success: true,
					message: "Bookmark deleted.",
				},
			};
		} catch (error) {
			if (error instanceof BookmarkNotFoundError) {
				return fail(404, {
					deleteBookmark: {
						success: false,
						message: "Bookmark not found.",
						values,
					},
				});
			}

			if (error instanceof BookmarkRepositoryError) {
				return fail(500, {
					deleteBookmark: {
						success: false,
						message: "Could not delete the bookmark right now.",
						values,
					},
				});
			}

			throw error;
		}
	},

	signOut: async ({ locals, url }) => {
		await locals.logtoClient.signOut(getSignOutRedirectUri(url));
	},
};
