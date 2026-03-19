create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
	new.updated_at = timezone('utc', now());
	return new;
end;
$$;

create table if not exists public.bookmarks (
	id uuid primary key default gen_random_uuid(),
	user_id text not null,
	url text not null,
	title text,
	description text,
	created_at timestamptz not null default timezone('utc', now()),
	updated_at timestamptz not null default timezone('utc', now()),
	constraint bookmarks_url_not_empty check (char_length(btrim(url)) > 0)
);

create index if not exists bookmarks_user_created_at_idx
	on public.bookmarks (user_id, created_at desc);

drop trigger if exists bookmarks_set_updated_at on public.bookmarks;

create trigger bookmarks_set_updated_at
before update on public.bookmarks
for each row
execute function public.set_updated_at();
