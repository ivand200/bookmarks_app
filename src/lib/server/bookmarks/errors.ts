export class BookmarkError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		this.name = new.target.name;
	}
}

export class BookmarkRepositoryError extends BookmarkError {}

export class BookmarkValidationError extends BookmarkError {}

export class BookmarkNotFoundError extends BookmarkError {}
