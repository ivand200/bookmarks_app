import { beforeEach, describe, expect, it, vi } from "vitest";
import { BookmarkRepositoryError } from "$lib/server/bookmarks/errors";
import type { Bookmark } from "$lib/types/bookmark";

const { bookmarkService } = vi.hoisted(() => ({
	bookmarkService: {
		listBookmarks: vi.fn(),
		countBookmarks: vi.fn(),
		createBookmark: vi.fn(),
		deleteBookmark: vi.fn(),
	},
}));

vi.mock("$lib/server/bookmarks/service", () => ({
	createBookmarkService: vi.fn(() => bookmarkService),
}));

vi.mock("$lib/server/observability/logger", () => ({
	getRequestContext: vi.fn(() => ({})),
	logger: {
		error: vi.fn(),
	},
}));

vi.mock("$lib/server/auth", () => ({
	getSignOutRedirectUri: vi.fn(() => "https://example.com/logout"),
}));

import { load } from "./+page.server";

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

function createLocals(userId?: string): App.Locals {
	return {
		logtoClient: {} as App.Locals["logtoClient"],
		...(userId
			? {
					user: {
						sub: userId,
					} as App.Locals["user"],
				}
			: {}),
	};
}

describe("bookmarks page server load", () => {
	beforeEach(() => {
		bookmarkService.listBookmarks.mockReset();
		bookmarkService.countBookmarks.mockReset();
		bookmarkService.createBookmark.mockReset();
		bookmarkService.deleteBookmark.mockReset();
	});

	it("given no authenticated user, when the page loads, then it returns the empty default search state without calling bookmark services", async () => {
		const result = await load({
			locals: createLocals(),
			url: new URL("https://example.com/app?q=youtube"),
		} as Parameters<typeof load>[0]);

		expect(bookmarkService.listBookmarks).not.toHaveBeenCalled();
		expect(bookmarkService.countBookmarks).not.toHaveBeenCalled();
		expect(result).toEqual({
			bookmarks: [],
			searchQuery: "",
			hasActiveSearch: false,
			totalBookmarks: 0,
		});
	});

	it("given an active search query, when the page loads, then it returns filtered bookmarks and the full bookmark count", async () => {
		const bookmarks = [
			createBookmark({ url: "https://facebook.com/groups/svelte" }),
		];
		bookmarkService.listBookmarks.mockResolvedValue(bookmarks);
		bookmarkService.countBookmarks.mockResolvedValue(4);

		const result = await load({
			locals: createLocals("user-123"),
			url: new URL("https://example.com/app?q=%20%20FaceBook%20%20"),
		} as Parameters<typeof load>[0]);

		expect(bookmarkService.listBookmarks).toHaveBeenCalledWith({
			userId: "user-123",
			searchQuery: "FaceBook",
		});
		expect(bookmarkService.countBookmarks).toHaveBeenCalledWith("user-123");
		expect(result).toEqual({
			bookmarks,
			searchQuery: "FaceBook",
			hasActiveSearch: true,
			totalBookmarks: 4,
		});
	});

	it("given a blank search query, when the page loads, then it returns the unfiltered bookmarks and skips the total-count lookup", async () => {
		const bookmarks = [
			createBookmark(),
			createBookmark({
				id: "18944c53-82a5-4afd-a4b0-a67366ec4c89",
				url: "https://youtube.com/watch?v=123",
			}),
		];
		bookmarkService.listBookmarks.mockResolvedValue(bookmarks);

		const result = await load({
			locals: createLocals("user-123"),
			url: new URL("https://example.com/app?q=%20%20%20"),
		} as Parameters<typeof load>[0]);

		expect(bookmarkService.listBookmarks).toHaveBeenCalledWith({
			userId: "user-123",
			searchQuery: null,
		});
		expect(bookmarkService.countBookmarks).not.toHaveBeenCalled();
		expect(result).toEqual({
			bookmarks,
			searchQuery: "",
			hasActiveSearch: false,
			totalBookmarks: 2,
		});
	});

	it("given an active search with no matches, when the page loads, then it still returns the total bookmark count for the empty-results state", async () => {
		bookmarkService.listBookmarks.mockResolvedValue([]);
		bookmarkService.countBookmarks.mockResolvedValue(7);

		const result = await load({
			locals: createLocals("user-123"),
			url: new URL("https://example.com/app?q=not-a-real-domain"),
		} as Parameters<typeof load>[0]);

		expect(result).toEqual({
			bookmarks: [],
			searchQuery: "not-a-real-domain",
			hasActiveSearch: true,
			totalBookmarks: 7,
		});
	});

	it("given the bookmark service fails during search, when the page loads, then the error is propagated", async () => {
		const error = new BookmarkRepositoryError("Failed to list bookmarks.");
		bookmarkService.listBookmarks.mockRejectedValue(error);

		await expect(
			load({
				locals: createLocals("user-123"),
				url: new URL("https://example.com/app?q=facebook"),
			} as Parameters<typeof load>[0]),
		).rejects.toThrow(error);
	});
});
