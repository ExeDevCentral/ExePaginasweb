---
name: supabase-migration-checker
description: Validate SQL migration safety, RLS enablement, SECURITY DEFINER search_path, foreign key indexing, and dangerous DDL before applying Supabase migrations. Use when writing, reviewing, or running Supabase SQL migrations or when user mentions SQL migration checks, RLS safety, or migration audit.
---

# Supabase Migration Checker

## Overview

This skill provides deterministic automated auditing for Supabase / PostgreSQL migration files located in `supabase/migrations/`.

## Workflows

### 1. Run Automated Migration Audit

Execute the validation script:

```bash
node .agents/skills/supabase-migration-checker/scripts/check_migrations.js
```

### 2. Manual Checklist for Supabase Migrations

When authoring or modifying any `.sql` migration file, verify:

- [ ] **RLS Enabled:** Every `CREATE TABLE` is paired with `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;`.
- [ ] **Explicit `search_path`:** Every `SECURITY DEFINER` function includes `SET search_path = ''` (or explicit schema list) to prevent search path hijacking.
- [ ] **Foreign Key Indexing:** High-cardinality foreign key columns (e.g. `user_id`, `tenant_id`, `client_id`) have explicit `CREATE INDEX` defined.
- [ ] **Non-Destructive DDL:** Destructive operations like `DROP TABLE` or `DROP COLUMN` are explicitly documented with fallback backups.
- [ ] **Deterministic UUIDs:** Primary keys use `gen_random_uuid()` or `uuid_generate_v4()`.

## Script Details

The embedded validation tool `scripts/check_migrations.js` parses all SQL migration files in `supabase/migrations/` and checks for high-severity security and performance risks.
