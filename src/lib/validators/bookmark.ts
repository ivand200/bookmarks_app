import { z } from "zod";

function readFormValue(formData: FormData, fieldName: string) {
	const value = formData.get(fieldName);

	return typeof value === "string" ? value : "";
}

function formString<TSchema extends z.ZodType>(schema: TSchema) {
	return z.preprocess(
		(value) => (typeof value === "string" ? value : undefined),
		schema,
	);
}

const optionalTextField = formString(z.string().trim().optional()).transform(
	(value) => (value && value.length > 0 ? value : null),
);

const httpUrlField = formString(
	z
		.url({
			protocol: /^https?$/,
			hostname: z.regexes.domain,
		})
		.min(1, "URL is required."),
).transform((value) => new URL(value).toString());

export const createBookmarkSchema = z.object({
	url: httpUrlField,
	title: optionalTextField,
	description: optionalTextField,
});

export const deleteBookmarkSchema = z.object({
	bookmarkId: formString(
		z.string().trim().uuid("Bookmark id must be a valid UUID."),
	),
});

export type CreateBookmarkValues = {
	url: string;
	title: string;
	description: string;
};

export type DeleteBookmarkValues = {
	bookmarkId: string;
};

export type CreateBookmarkInput = z.output<typeof createBookmarkSchema>;
export type DeleteBookmarkInput = z.output<typeof deleteBookmarkSchema>;

export function getCreateBookmarkValues(
	formData: FormData,
): CreateBookmarkValues {
	return {
		url: readFormValue(formData, "url"),
		title: readFormValue(formData, "title"),
		description: readFormValue(formData, "description"),
	};
}

export function getDeleteBookmarkValues(
	formData: FormData,
): DeleteBookmarkValues {
	return {
		bookmarkId: readFormValue(formData, "bookmarkId"),
	};
}
