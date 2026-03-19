import { describe, expect, it, vi } from "vitest";
import type { Bookmark } from "$lib/types/bookmark";
import { BookmarkNotFoundError, BookmarkValidationError } from "./errors";
import { createBookmarkService } from "./service";

function createBookmark(overrides: Partial<Bookmark> = {}): Bookmark {
	return {
		id: "9d6a0b0b-6ca6-4a91-9b56-75ca4326a8d7",
		userId: "user-123",
		url: "https://example.com/article",
		title: null,
		description: null,
		createdAt: "2026-03-19T09:00:00.000Z",
		updatedAt: "2026-03-19T09:00:00.000Z",
		...overrides,
	};
}

function createRepository() {
	return {
		listByUserId: vi.fn<() => Promise<Bookmark[]>>(),
		create: vi.fn(),
		deleteByIdAndUserId: vi.fn<() => Promise<boolean>>(),
	};
}

describe("createBookmarkService", () => {
	describe("listBookmarks", () => {
		it("given a user id with extra whitespace, when bookmarks are listed, then the repository receives the trimmed user id", async () => {
			const repository = createRepository();
			const bookmarks = [createBookmark()];
			repository.listByUserId.mockResolvedValue(bookmarks);

			const service = createBookmarkService(repository);
			const result = await service.listBookmarks("  user-123  ");

			expect(repository.listByUserId).toHaveBeenCalledWith("user-123");
			expect(result).toEqual(bookmarks);
		});

		it("given bookmarks owned by the requested user, when bookmarks are listed, then only that user's bookmarks are returned", async () => {
			const repository = createRepository();
			const bookmarks = [
				createBookmark({
					id: "b2cd4b38-8995-4ffd-9f4d-01c2e7002640",
					userId: "user-123",
					url: "https://example.com/one",
				}),
				createBookmark({
					id: "18944c53-82a5-4afd-a4b0-a67366ec4c89",
					userId: "user-123",
					url: "https://example.com/two",
				}),
			];
			repository.listByUserId.mockResolvedValue(bookmarks);

			const service = createBookmarkService(repository);
			const result = await service.listBookmarks("user-123");

			expect(repository.listByUserId).toHaveBeenCalledWith("user-123");
			expect(result).toEqual(bookmarks);
			expect(result.every((bookmark) => bookmark.userId === "user-123")).toBe(
				true,
			);
		});

		it("given a blank user id, when bookmarks are listed, then validation fails before the repository is called", async () => {
			const repository = createRepository();
			const service = createBookmarkService(repository);

			await expect(service.listBookmarks("   ")).rejects.toThrow(
				BookmarkValidationError,
			);
			expect(repository.listByUserId).not.toHaveBeenCalled();
		});
	});

	describe("createBookmark", () => {
		it("given valid bookmark input, when a bookmark is created, then required values are trimmed and blank optional values become null", async () => {
			const repository = createRepository();
			const createdBookmark = createBookmark({
				title: "Example title",
				description: "Saved for later",
			});
			repository.create.mockResolvedValue(createdBookmark);

			const service = createBookmarkService(repository);
			const result = await service.createBookmark({
				userId: "  user-123  ",
				url: "  https://example.com/article  ",
				title: "  Example title  ",
				description: "   ",
			});

			expect(repository.create).toHaveBeenCalledWith({
				userId: "user-123",
				url: "https://example.com/article",
				title: "Example title",
				description: null,
			});
			expect(result).toEqual(createdBookmark);
		});

		it("given a non-http bookmark url, when a bookmark is created, then validation fails before the repository is called", async () => {
			const repository = createRepository();
			const service = createBookmarkService(repository);

			await expect(
				service.createBookmark({
					userId: "user-123",
					url: "javascript:alert(1)",
				}),
			).rejects.toThrow(BookmarkValidationError);
			expect(repository.create).not.toHaveBeenCalled();
		});

		it("given blank required fields, when a bookmark is created, then validation fails before the repository is called", async () => {
			const repository = createRepository();
			const service = createBookmarkService(repository);

			await expect(
				service.createBookmark({
					userId: "   ",
					url: "https://example.com/article",
				}),
			).rejects.toThrow(BookmarkValidationError);
			expect(repository.create).not.toHaveBeenCalled();
		});
	});

	describe("deleteBookmark", () => {
		it("given bookmark and user ids with extra whitespace, when a bookmark is deleted, then the repository receives trimmed ids", async () => {
			const repository = createRepository();
			repository.deleteByIdAndUserId.mockResolvedValue(true);

			const service = createBookmarkService(repository);
			await service.deleteBookmark({
				userId: "  user-123  ",
				bookmarkId: "  9d6a0b0b-6ca6-4a91-9b56-75ca4326a8d7  ",
			});

			expect(repository.deleteByIdAndUserId).toHaveBeenCalledWith(
				"9d6a0b0b-6ca6-4a91-9b56-75ca4326a8d7",
				"user-123",
			);
		});

		it("given a missing or non-owned bookmark, when a bookmark is deleted, then BookmarkNotFoundError is raised", async () => {
			const repository = createRepository();
			repository.deleteByIdAndUserId.mockResolvedValue(false);

			const service = createBookmarkService(repository);

			await expect(
				service.deleteBookmark({
					userId: "user-123",
					bookmarkId: "9d6a0b0b-6ca6-4a91-9b56-75ca4326a8d7",
				}),
			).rejects.toThrow(BookmarkNotFoundError);
		});

		it("given a blank user id, when a bookmark is deleted, then validation fails before the repository is called", async () => {
			const repository = createRepository();
			const service = createBookmarkService(repository);

			await expect(
				service.deleteBookmark({
					userId: "   ",
					bookmarkId: "9d6a0b0b-6ca6-4a91-9b56-75ca4326a8d7",
				}),
			).rejects.toThrow(BookmarkValidationError);
			expect(repository.deleteByIdAndUserId).not.toHaveBeenCalled();
		});

		it("given a blank bookmark id, when a bookmark is deleted, then validation fails before the repository is called", async () => {
			const repository = createRepository();
			const service = createBookmarkService(repository);

			await expect(
				service.deleteBookmark({
					userId: "user-123",
					bookmarkId: "   ",
				}),
			).rejects.toThrow(BookmarkValidationError);
			expect(repository.deleteByIdAndUserId).not.toHaveBeenCalled();
		});
	});
});
