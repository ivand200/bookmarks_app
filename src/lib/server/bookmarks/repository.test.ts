import { describe, expect, it, vi } from "vitest";
import { BookmarkRepositoryError } from "./errors";
import { createBookmarkRepository } from "./repository";

type QueryError = {
	message: string;
};

type ListQueryResult = {
	data: unknown[];
	error: QueryError | null;
};

type CountQueryResult = {
	data: null;
	error: QueryError | null;
	count: number | null;
};

function createListRow(overrides: Partial<Record<string, string | null>> = {}) {
	return {
		id: "9d6a0b0b-6ca6-4a91-9b56-75ca4326a8d7",
		user_id: "user-123",
		url: "https://example.com/article",
		title: null,
		description: null,
		created_at: "2026-03-19T09:00:00.000Z",
		updated_at: "2026-03-19T09:00:00.000Z",
		...overrides,
	};
}

function createListQuery(result: ListQueryResult) {
	const query = {
		eq: vi.fn(() => query),
		ilike: vi.fn(() => query),
		order: vi.fn(async () => result),
	};

	return query;
}

function createCountQuery(result: CountQueryResult) {
	const query = {
		eq: vi.fn(async () => result),
	};

	return query;
}

function createSupabaseStub({
	listResult = {
		data: [],
		error: null,
	} as ListQueryResult,
	countResult = {
		data: null,
		error: null,
		count: 0,
	} as CountQueryResult,
} = {}) {
	const listQuery = createListQuery(listResult);
	const countQuery = createCountQuery(countResult);
	const select = vi.fn(
		(_: string, options?: { count?: "exact"; head?: true }) =>
			options?.head ? countQuery : listQuery,
	);
	const from = vi.fn(() => ({
		select,
	}));

	return {
		client: {
			from,
		},
		select,
		listQuery,
		countQuery,
	};
}

describe("createBookmarkRepository", () => {
	describe("listByUserId", () => {
		it("given a user-scoped request without search, when bookmarks are listed, then the query filters by user and keeps newest-first ordering", async () => {
			const listResult = {
				data: [
					createListRow(),
					createListRow({
						id: "18944c53-82a5-4afd-a4b0-a67366ec4c89",
						url: "https://example.com/two",
					}),
				],
				error: null,
			} as ListQueryResult;
			const { client, select, listQuery } = createSupabaseStub({ listResult });
			const repository = createBookmarkRepository(client as never);

			const result = await repository.listByUserId({
				userId: "user-123",
			});

			expect(select).toHaveBeenCalledWith(
				"id, user_id, url, title, description, created_at, updated_at",
			);
			expect(listQuery.eq).toHaveBeenCalledWith("user_id", "user-123");
			expect(listQuery.ilike).not.toHaveBeenCalled();
			expect(listQuery.order).toHaveBeenCalledWith("created_at", {
				ascending: false,
			});
			expect(result).toEqual([
				{
					id: "9d6a0b0b-6ca6-4a91-9b56-75ca4326a8d7",
					userId: "user-123",
					url: "https://example.com/article",
					title: null,
					description: null,
					createdAt: "2026-03-19T09:00:00.000Z",
					updatedAt: "2026-03-19T09:00:00.000Z",
				},
				{
					id: "18944c53-82a5-4afd-a4b0-a67366ec4c89",
					userId: "user-123",
					url: "https://example.com/two",
					title: null,
					description: null,
					createdAt: "2026-03-19T09:00:00.000Z",
					updatedAt: "2026-03-19T09:00:00.000Z",
				},
			]);
		});

		it("given an active search query, when bookmarks are listed, then the query applies case-insensitive partial matching on url", async () => {
			const { client, listQuery } = createSupabaseStub();
			const repository = createBookmarkRepository(client as never);

			await repository.listByUserId({
				userId: "user-123",
				searchQuery: "FaceBook",
			});

			expect(listQuery.eq).toHaveBeenCalledWith("user_id", "user-123");
			expect(listQuery.ilike).toHaveBeenCalledWith("url", "%FaceBook%");
			expect(listQuery.order).toHaveBeenCalledWith("created_at", {
				ascending: false,
			});
		});

		it("given wildcard characters in the search query, when bookmarks are listed, then the query escapes them before partial matching", async () => {
			const { client, listQuery } = createSupabaseStub();
			const repository = createBookmarkRepository(client as never);

			await repository.listByUserId({
				userId: "user-123",
				searchQuery: "100%_done\\now",
			});

			expect(listQuery.ilike).toHaveBeenCalledWith(
				"url",
				"%100\\%\\_done\\\\now%",
			);
		});

		it("given a list query failure, when bookmarks are listed, then a repository error is raised", async () => {
			const { client } = createSupabaseStub({
				listResult: {
					data: [],
					error: {
						message: "boom",
					},
				} as ListQueryResult,
			});
			const repository = createBookmarkRepository(client as never);

			await expect(
				repository.listByUserId({
					userId: "user-123",
				}),
			).rejects.toThrow(BookmarkRepositoryError);
		});
	});

	describe("countByUserId", () => {
		it("given a user-scoped count request, when bookmarks are counted, then the repository returns the total count", async () => {
			const { client, select, countQuery } = createSupabaseStub({
				countResult: {
					data: null,
					error: null,
					count: 12,
				} as CountQueryResult,
			});
			const repository = createBookmarkRepository(client as never);

			const count = await repository.countByUserId("user-123");

			expect(select).toHaveBeenCalledWith("*", {
				count: "exact",
				head: true,
			});
			expect(countQuery.eq).toHaveBeenCalledWith("user_id", "user-123");
			expect(count).toBe(12);
		});

		it("given a null count response, when bookmarks are counted, then the repository returns zero", async () => {
			const { client } = createSupabaseStub({
				countResult: {
					data: null,
					error: null,
					count: null,
				} as CountQueryResult,
			});
			const repository = createBookmarkRepository(client as never);

			const count = await repository.countByUserId("user-123");

			expect(count).toBe(0);
		});

		it("given a count query failure, when bookmarks are counted, then a repository error is raised", async () => {
			const { client } = createSupabaseStub({
				countResult: {
					data: null,
					error: {
						message: "boom",
					},
					count: null,
				} as CountQueryResult,
			});
			const repository = createBookmarkRepository(client as never);

			await expect(repository.countByUserId("user-123")).rejects.toThrow(
				BookmarkRepositoryError,
			);
		});
	});
});
