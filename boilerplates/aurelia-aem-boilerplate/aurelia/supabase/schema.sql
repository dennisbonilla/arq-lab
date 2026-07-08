-- Contacts/leads table schema for Aurelia.
-- Run this in the Supabase SQL Editor.

create table if not exists public.contacts (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  phone       text,
  topic       text not null check (topic in ('bespoke','appointment','press','other')),
  message     text not null,
  locale      text not null default 'es',
  source      text not null default 'web-contact-form'
);

create index if not exists contacts_email_idx on public.contacts (email);
create index if not exists contacts_created_at_idx on public.contacts (created_at desc);

-- RLS: blocks everything by default. The server uses the Service Role key,
-- which bypasses RLS. That way the client can never read/write directly.
alter table public.contacts enable row level security;

-- (Optional) If you wanted to expose direct anonymous inserts from the browser
-- instead of going through the API, you'd create an insert policy. NOT recommended
-- here because we want to validate + send email on the server.
-- create policy "anon can insert" on public.contacts
--   for insert to anon with check (true);
