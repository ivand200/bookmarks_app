import type {
	Bookmark,
	CreateBookmarkInput,
	DeleteBookmarkInput,
	ListBookmarksInput,
} from "$lib/types/bookmark";
import { normalizeBookmarkSearchQuery } from "$lib/validators/bookmark";
import { BookmarkNotFoundError, BookmarkValidationError } from "./errors";
import type { BookmarkRepository } from "./repository";
import { createBookmarkRepository } from "./repository";

function normalizeHttpUrl(value: string) {
	const normalizedValue = requireNonEmpty(value, "URL");

	try {
		const url = new URL(normalizedValue);

		if (url.protocol !== "http:" && url.protocol !== "https:") {
			throw new BookmarkValidationError("Please enter a valid http(s) URL.");
		}

		return url.toString();
	} catch (error) {
		if (error instanceof BookmarkValidationError) {
			throw error;
		}

		throw new BookmarkValidationError("Please enter a valid http(s) URL.", {
			cause: error,
		});
	}
}

function requireNonEmpty(value: string, fieldName: string) {
	const normalizedValue = value.trim();

	if (!normalizedValue) {
		throw new BookmarkValidationError(`${fieldName} is required.`);
	}

	return normalizedValue;
}

function normalizeOptionalValue(value: string | null | undefined) {
	if (value == null) {
		return null;
	}

	const normalizedValue = value.trim();

	return normalizedValue.length > 0 ? normalizedValue : null;
}

export type BookmarkService = {
	listBookmarks(input: ListBookmarksInput): Promise<Bookmark[]>;
	countBookmarks(userId: string): Promise<number>;
	createBookmark(input: CreateBookmarkInput): Promise<Bookmark>;
	deleteBookmark(input: DeleteBookmarkInput): Promise<void>;
};

export function createBookmarkService(
	repository: BookmarkRepository = createBookmarkRepository(),
): BookmarkService {
	return {
		async listBookmarks(input) {
			const userId = requireNonEmpty(input.userId, "User ID");
			const searchQuery = normalizeBookmarkSearchQuery(input.searchQuery);

			return repository.listByUserId({
				userId,
				...(searchQuery ? { searchQuery } : {}),
			});
		},

		async countBookmarks(userId) {
			return repository.countByUserId(requireNonEmpty(userId, "User ID"));
		},

		async createBookmark(input) {
			return repository.create({
				userId: requireNonEmpty(input.userId, "User ID"),
				url: normalizeHttpUrl(input.url),
				title: normalizeOptionalValue(input.title),
				description: normalizeOptionalValue(input.description),
			});
		},

		async deleteBookmark(input) {
			const deleted = await repository.deleteByIdAndUserId(
				requireNonEmpty(input.bookmarkId, "Bookmark ID"),
				requireNonEmpty(input.userId, "User ID"),
			);

			if (!deleted) {
				throw new BookmarkNotFoundError("Bookmark not found.");
			}
		},
	};
}
