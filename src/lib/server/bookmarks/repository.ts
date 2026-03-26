import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "$lib/server/supabase";
import type {
	Bookmark,
	CreateBookmarkInput,
	ListBookmarksInput,
} from "$lib/types/bookmark";
import { BookmarkRepositoryError } from "./errors";

type BookmarkRow = {
	id: string;
	user_id: string;
	url: string;
	title: string | null;
	description: string | null;
	created_at: string;
	updated_at: string;
};

const BOOKMARK_COLUMNS =
	"id, user_id, url, title, description, created_at, updated_at";

function escapeLikePattern(value: string) {
	return value.replace(/[\\%_]/g, "\\$&");
}

function mapBookmark(row: BookmarkRow): Bookmark {
	return {
		id: row.id,
		userId: row.user_id,
		url: row.url,
		title: row.title,
		description: row.description,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	};
}

export type BookmarkRepository = {
	listByUserId(input: ListBookmarksInput): Promise<Bookmark[]>;
	countByUserId(userId: string): Promise<number>;
	create(input: CreateBookmarkInput): Promise<Bookmark>;
	deleteByIdAndUserId(bookmarkId: string, userId: string): Promise<boolean>;
};

export function createBookmarkRepository(
	supabase?: SupabaseClient,
): BookmarkRepository {
	function getSupabase() {
		if (!supabase) {
			supabase = getSupabaseServerClient();
		}

		return supabase;
	}

	return {
		async listByUserId({ userId, searchQuery }) {
			let query = getSupabase()
				.from("bookmarks")
				.select(BOOKMARK_COLUMNS)
				.eq("user_id", userId);

			if (searchQuery) {
				query = query.ilike("url", `%${escapeLikePattern(searchQuery)}%`);
			}

			const { data, error } = await query.order("created_at", {
				ascending: false,
			});

			if (error) {
				throw new BookmarkRepositoryError("Failed to list bookmarks.", {
					cause: error,
				});
			}

			return (data satisfies BookmarkRow[]).map(mapBookmark);
		},

		async countByUserId(userId) {
			const { count, error } = await getSupabase()
				.from("bookmarks")
				.select("*", { count: "exact", head: true })
				.eq("user_id", userId);

			if (error) {
				throw new BookmarkRepositoryError("Failed to count bookmarks.", {
					cause: error,
				});
			}

			return count ?? 0;
		},

		async create(input) {
			const { data, error } = await getSupabase()
				.from("bookmarks")
				.insert({
					user_id: input.userId,
					url: input.url,
					title: input.title ?? null,
					description: input.description ?? null,
				})
				.select(BOOKMARK_COLUMNS)
				.single();

			if (error) {
				throw new BookmarkRepositoryError("Failed to create bookmark.", {
					cause: error,
				});
			}

			return mapBookmark(data satisfies BookmarkRow);
		},

		async deleteByIdAndUserId(bookmarkId, userId) {
			const { data, error } = await getSupabase()
				.from("bookmarks")
				.delete()
				.eq("id", bookmarkId)
				.eq("user_id", userId)
				.select("id")
				.maybeSingle();

			if (error) {
				throw new BookmarkRepositoryError("Failed to delete bookmark.", {
					cause: error,
				});
			}

			return Boolean(data);
		},
	};
}
