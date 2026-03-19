export type Bookmark = {
	id: string;
	userId: string;
	url: string;
	title: string | null;
	description: string | null;
	createdAt: string;
	updatedAt: string;
};

export type CreateBookmarkInput = {
	userId: string;
	url: string;
	title?: string | null;
	description?: string | null;
};

export type DeleteBookmarkInput = {
	userId: string;
	bookmarkId: string;
};
