create extension if not exists pgcrypto;

create table if not exists public.testimonial_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  quote text not null,
  avatar_url text,
  rating integer not null default 5 check (rating between 1 and 5),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_submissions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  submitted_by text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists testimonial_submissions_status_created_at_idx
  on public.testimonial_submissions (status, created_at desc);

create index if not exists gallery_submissions_status_created_at_idx
  on public.gallery_submissions (status, created_at desc);

insert into storage.buckets (id, name, public)
values ('luis-community', 'luis-community', true)
on conflict (id) do nothing;
