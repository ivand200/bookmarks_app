import type {
	Bookmark,
	CreateBookmarkInput,
	DeleteBookmarkInput,
} from "$lib/types/bookmark";
import { BookmarkNotFoundError, BookmarkValidationError } from "./errors";
import type { BookmarkRepository } from "./repository";
import { createBookmarkRepository } from "./repository";

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
	listBookmarks(userId: string): Promise<Bookmark[]>;
	createBookmark(input: CreateBookmarkInput): Promise<Bookmark>;
	deleteBookmark(input: DeleteBookmarkInput): Promise<void>;
};

export function createBookmarkService(
	repository: BookmarkRepository = createBookmarkRepository(),
): BookmarkService {
	return {
		async listBookmarks(userId) {
			return repository.listByUserId(requireNonEmpty(userId, "User ID"));
		},

		async createBookmark(input) {
			return repository.create({
				userId: requireNonEmpty(input.userId, "User ID"),
				url: requireNonEmpty(input.url, "URL"),
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
