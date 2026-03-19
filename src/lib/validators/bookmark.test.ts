import { describe, expect, it } from "vitest";
import {
	createBookmarkSchema,
	deleteBookmarkSchema,
	getCreateBookmarkValues,
	getDeleteBookmarkValues,
} from "./bookmark";

describe("createBookmarkSchema", () => {
	it("given a valid bookmark payload, when the schema parses it, then optional blank fields become null and values are normalized", () => {
		const result = createBookmarkSchema.parse({
			url: "https://example.com/articles?id=1",
			title: "  Example title  ",
			description: "   ",
		});

		expect(result).toEqual({
			url: "https://example.com/articles?id=1",
			title: "Example title",
			description: null,
		});
	});

	it("given an invalid bookmark url, when the schema parses it, then validation fails with a url error", () => {
		const result = createBookmarkSchema.safeParse({
			url: "not-a-url",
			title: "",
			description: "",
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.flatten().fieldErrors.url).toContain("Invalid URL");
		}
	});

	it("given a non-http bookmark url, when the schema parses it, then validation fails", () => {
		const result = createBookmarkSchema.safeParse({
			url: "javascript:alert(1)",
			title: "",
			description: "",
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.flatten().fieldErrors.url).toContain("Invalid URL");
		}
	});
});

describe("deleteBookmarkSchema", () => {
	it("given a non-uuid bookmark id, when the schema parses it, then validation fails", () => {
		const result = deleteBookmarkSchema.safeParse({
			bookmarkId: "bookmark-123",
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.flatten().fieldErrors.bookmarkId).toContain(
				"Bookmark id must be a valid UUID.",
			);
		}
	});
});

describe("bookmark form value helpers", () => {
	it("given create-bookmark form data, when values are read, then the helper returns the submitted strings", () => {
		const formData = new FormData();
		formData.set("url", "https://example.com");
		formData.set("title", "Example");
		formData.set("description", "Saved for later");

		expect(getCreateBookmarkValues(formData)).toEqual({
			url: "https://example.com",
			title: "Example",
			description: "Saved for later",
		});
	});

	it("given missing delete-bookmark form data, when values are read, then the helper returns an empty bookmark id", () => {
		const formData = new FormData();

		expect(getDeleteBookmarkValues(formData)).toEqual({
			bookmarkId: "",
		});
	});
});
