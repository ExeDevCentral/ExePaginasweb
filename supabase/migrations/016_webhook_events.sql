CREATE TABLE IF NOT EXISTS webhook_events (
  id bigint primary key generated always as identity,
  event_type text not null,
  provider text not null default 'resend',
  payload jsonb,
  raw jsonb,
  created_at timestamptz not null default now()
);

ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON webhook_events(created_at desc);
