-- ============================================================
-- Clarity — Supabase Schema v2
-- Run this in the Supabase SQL Editor
-- ============================================================

create extension if not exists "pgcrypto";

-- ─── decisions ───────────────────────────────────────────────────────────────
create table if not exists decisions (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references auth.users(id) on delete cascade,
  intake            jsonb       not null,
  analysis          jsonb,
  status            text        not null default 'analyzed'
                                check (status in ('draft','analyzing','analyzed','decided','tracking')),
  chosen_option_id  text,
  chosen_reasoning  text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists decisions_user_created
  on decisions (user_id, created_at desc);

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger decisions_updated_at
  before update on decisions
  for each row execute function set_updated_at();

-- ─── outcome_check_ins ───────────────────────────────────────────────────────
create table if not exists outcome_check_ins (
  id                  uuid        primary key default gen_random_uuid(),
  decision_id         uuid        not null references decisions(id) on delete cascade,
  days_after          integer     not null check (days_after in (30, 90, 180)),
  satisfaction_score  integer     not null check (satisfaction_score between 1 and 10),
  actual_outcome      text        not null,
  lesson_learned      text,
  would_choose_again  boolean     not null default true,
  created_at          timestamptz not null default now(),
  unique (decision_id, days_after)
);

create index if not exists checkins_decision_id
  on outcome_check_ins (decision_id);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table decisions         enable row level security;
alter table outcome_check_ins enable row level security;

-- Users can only read/write their own decisions
create policy "Users own their decisions"
  on decisions for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Outcome check-ins are accessible if the parent decision belongs to the user
create policy "Users own their check-ins"
  on outcome_check_ins for all
  using (
    exists (
      select 1 from decisions d
      where d.id = outcome_check_ins.decision_id
        and d.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from decisions d
      where d.id = outcome_check_ins.decision_id
        and d.user_id = auth.uid()
    )
  );
  
-- ─── Supabase Auth config (run in Dashboard → Auth → Settings) ───────────────
-- Site URL:      https://your-app.netlify.app
-- Redirect URLs: https://your-app.netlify.app/auth/callback
--
-- For Google OAuth: Supabase Dashboard → Auth → Providers → Google
--   Client ID:     from Google Cloud Console
--   Client Secret: from Google Cloud Console
--   Callback URL:  https://[project].supabase.co/auth/v1/callback
--
-- For GitHub OAuth: Supabase Dashboard → Auth → Providers → GitHub
--   Client ID:     from GitHub → Settings → Developer Settings → OAuth Apps
--   Client Secret: from GitHub
--   Callback URL:  https://[project].supabase.co/auth/v1/callback
