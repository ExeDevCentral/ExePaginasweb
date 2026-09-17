-- © 2026 Exequiel Echevarria — ExePaginasWeb
-- Migración: auditoría de IA (runs y tool calls)
-- Registra cada ejecución del agente y cada herramienta invocada.

create table if not exists public.ai_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  conversation_id text,
  model text not null,
  provider text not null,
  prompt_version text not null default 'v1.0',
  status text not null default 'completed'
    check (status in ('completed', 'failed', 'cancelled')),
  latency_ms integer,
  input_tokens integer,
  output_tokens integer,
  cost_estimate_usd numeric(10, 6),
  error text,
  tool_calls_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_tool_calls (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references public.ai_runs (id) on delete cascade,
  tool_name text not null,
  input jsonb not null,
  output jsonb,
  status text not null default 'executed'
    check (status in ('pending', 'executed', 'awaiting_confirmation', 'rejected', 'failed')),
  latency_ms integer,
  error text,
  user_id uuid references auth.users (id) on delete set null,
  tenant_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists ix_ai_runs_user_created
  on public.ai_runs (user_id, created_at desc);
create index if not exists ix_ai_runs_created
  on public.ai_runs (created_at desc);
create index if not exists ix_ai_tool_calls_run
  on public.ai_tool_calls (run_id);
create index if not exists ix_ai_tool_calls_tool_created
  on public.ai_tool_calls (tool_name, created_at desc);

alter table public.ai_runs enable row level security;
alter table public.ai_tool_calls enable row level security;

-- Los administradores ven todos los runs; cada usuario ve los suyos.
create policy "admin_read_ai_runs" on public.ai_runs
  for select
  to authenticated
  using (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid() and ur.role = 'admin'
    )
  );

create policy "owner_read_ai_runs" on public.ai_runs
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "admin_read_ai_tool_calls" on public.ai_tool_calls
  for select
  to authenticated
  using (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid() and ur.role = 'admin'
    )
  );

create policy "owner_read_ai_tool_calls" on public.ai_tool_calls
  for select
  to authenticated
  using (user_id = auth.uid());